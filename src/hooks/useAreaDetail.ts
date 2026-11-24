"use client";

import { useEffect, useMemo, useState } from "react";
import { backendApi } from "@/lib/api-client";
import { getPracticeSessionUrl } from "@/lib/practice-router";
import type { CurriculumHierarchyResponse } from "@/types/curriculum";
import { HIERARCHY_CACHE_PREFIX, getStoredCandidateOverlays, type CachedItem } from "@/hooks/useCurriculum";
import {
  KEY_TO_SLUG,
  SHORT_NAME,
  WEIGHT_TO_SLUG,
  daysSince,
  priorityAllowed,
  readJSON,
  todayKey,
  weekStartKey,
} from "@/hooks/usePrepDashboard";
import { companyAreaShares, targetCompanyNames, useCompanyFocus } from "@/hooks/useCompanyFocus";

/**
 * Data for one preparation area page (/prepare/[area]): a time-budgeted plan.
 *
 * The core PrepInMinutes promise: tell the candidate exactly which topics to do
 * in the time they have left. Every topic in the area is ranked for this
 * candidate, then split into three buckets by their remaining study time:
 *   - Must do         : fits the time this area gets before the interview
 *   - If time allows  : next in line, worth doing if they get ahead
 *   - Skip for now    : lower priority for this timeline (shown, not hidden)
 *
 * Sources (all existing, nothing new is stored):
 * - profile + active plan       → experience, plan weight, this week's focus, days left
 * - curriculum hierarchy        → categories and topics (shared local cache)
 * - dashboard progress (Postgres) → topics marked practiced
 * - local topic overlays        → "in progress" / readiness from practice sessions
 */

export type TopicStatus = "done" | "in-progress" | "not-started";
export type Bucket = "must" | "maybe" | "skip";

export type AreaTopic = {
  slug: string;
  title: string;
  durationMin: number;
  priority: string;
  difficulty: string;
  href: string;
  bucket: Bucket;
  status: TopicStatus;
  /** Readiness from practice, 0-100, when known. */
  score: number | null;
  /** Target companies that ask this topic often (only when set in setup). */
  companies: string[] | null;
};

export type AreaCategory = {
  slug: string;
  name: string;
  topics: AreaTopic[];
};

export type AreaDetail = {
  slug: string;
  name: string;
  description: string;
  /** Share of the plan, 0-100; 0 when the plan doesn't weight this area. */
  weightPct: number;
  isWeekFocus: boolean;
  categories: AreaCategory[];
  counts: Record<Bucket, number>;
  mustDone: number;
  /** Minutes of Must do work left / total Must do minutes. */
  mustMinutesLeft: number;
  mustMinutesTotal: number;
  /** Study minutes this area gets before the interview; null when the plan has no timeline or hours. */
  minutesAvailable: number | null;
  daysRemaining: number | null;
  next: AreaTopic | null;
  /** Context for "Why these topics?". */
  why: { level: string; role: string; company: string; hours: number | null };
  /**
   * Target-company personalisation; null when no target company is set in setup.
   * matched = companies we have interview data for; unmatched = names we don't know yet.
   */
  company: {
    matched: string[];
    unmatched: string[];
    /** Topics in this area the matched companies ask often (that fit the candidate's level). */
    topicCount: number;
    /** This area's share of the matched companies' interviews, 0-100; null if no matched data. */
    interviewSharePct: number | null;
  } | null;
};

/** "If time allows" covers roughly this much extra time beyond the budget. */
const MAYBE_EXTRA = 0.75;
const PRIORITY_RANK: Record<string, number> = { P0: 0, P1: 1, P2: 2 };

function yearsOf(experience: string) {
  const e = experience.toLowerCase();
  if (e.includes("fresher") || e.includes("student")) return 0;
  return Number(e.match(/\d+/)?.[0] ?? 0);
}

function levelLabel(years: number) {
  if (years === 0) return "fresher";
  if (years < 3) return "junior engineer";
  if (years < 6) return "mid-level engineer";
  return "senior engineer";
}

/** Difficulty that's a poor fit for this level gets pushed down the ranking. */
function difficultyPenalty(years: number, difficulty: string) {
  if (years < 3) return difficulty === "ADVANCED" || difficulty === "EXPERT" ? 1 : 0;
  if (years < 6) return difficulty === "EXPERT" ? 1 : 0;
  return 0;
}

export function useAreaDetail(slug: string) {
  const [profile, setProfile] = useState<Record<string, unknown> | null>(null);
  const [plan, setPlan] = useState<Record<string, unknown> | null>(null);
  const [hierarchy, setHierarchy] = useState<CurriculumHierarchyResponse | null>(() => {
    if (typeof window === "undefined") return null;
    return readJSON<CachedItem<CurriculumHierarchyResponse>>(`${HIERARCHY_CACHE_PREFIX}${slug}`)?.data ?? null;
  });
  const [practiced, setPracticed] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const companyNames = useMemo(() => targetCompanyNames(profile), [profile]);
  const { focus: companyFocus } = useCompanyFocus(companyNames);

  useEffect(() => {
    let alive = true;
    const cacheKey = `${HIERARCHY_CACHE_PREFIX}${slug}`;
    const cached = readJSON<CachedItem<CurriculumHierarchyResponse>>(cacheKey);

    const loadHierarchy = backendApi
      .getCurriculumHierarchy(slug, cached?.etag ?? undefined)
      .then((res) => {
        if (res.notModified && cached?.data) return cached.data;
        if (!res.categories) return cached?.data ?? null;
        const data: CurriculumHierarchyResponse = {
          domainSlug: res.domainSlug,
          domainName: res.domainName,
          description: res.description,
          version: res.version,
          totalCategories: res.totalCategories,
          totalTopics: res.totalTopics,
          totalQuestions: res.totalQuestions,
          categories: res.categories,
        };
        try {
          localStorage.setItem(cacheKey, JSON.stringify({ data, etag: res.etag ?? null, timestamp: Date.now() }));
        } catch {}
        return data;
      })
      .catch(() => cached?.data ?? null);

    Promise.all([
      loadHierarchy,
      backendApi.getProfile().catch(() => null),
      backendApi.getDashboardProgress(todayKey(), weekStartKey()).catch(() => null),
    ]).then(([h, prof, progress]) => {
      if (!alive) return;
      setHierarchy(h);
      setFailed(!h);
      setProfile(prof?.profile ?? null);
      setPlan(prof?.activePlan ?? null);
      setPracticed(new Set(progress?.practicedTopicSlugs ?? []));
      setLoading(false);
    });
    return () => {
      alive = false;
    };
  }, [slug]);

  const detail: AreaDetail | null = useMemo(() => {
    if (!hierarchy) return null;
    const experience = String(profile?.experienceLevel ?? "");
    const allowed = priorityAllowed(experience);
    const years = yearsOf(experience);
    const overlays = typeof window === "undefined" ? {} : getStoredCandidateOverlays();

    // 1. Time this area gets before the interview: weekly hours × days left × plan share.
    const rawWeights = (plan?.domainWeights ?? {}) as Record<string, number>;
    const planWeights: Record<string, number> = {};
    for (const [k, v] of Object.entries(rawWeights)) {
      const s = WEIGHT_TO_SLUG[k] ?? KEY_TO_SLUG[k];
      if (s) planWeights[s] = (planWeights[s] ?? 0) + Number(v || 0);
    }
    // Target company (only if set in setup): blend the plan's split 50/50 with how the
    // company's interview loop is weighted across the candidate's areas.
    const matched = companyFocus?.matched.length ? companyFocus : null;
    const companyShares = matched
      ? companyAreaShares(matched, Object.keys(planWeights).length ? Object.keys(planWeights) : [slug])
      : {};
    const planWeight = planWeights[slug] ?? 0;
    const companyShare = companyShares[slug];
    const weight =
      companyShare === undefined ? planWeight : planWeight > 0 ? 0.5 * planWeight + 0.5 * companyShare : companyShare;
    const totalWeeks = Number(plan?.timelineWeeks ?? profile?.timelineWeeks ?? 0) || 0;
    const elapsed = daysSince(plan?.createdAt);
    const daysRemaining = totalWeeks ? Math.max(0, totalWeeks * 7 - elapsed) : null;
    const weeklyHours = Number(profile?.weeklyGoalHours ?? 0) || 0;
    const share = weight > 0 ? Math.min(1, weight) : 1;
    const minutesAvailable =
      daysRemaining !== null && weeklyHours > 0 ? Math.round((weeklyHours * 60 * share * daysRemaining) / 7) : null;

    // 2. Every topic with this candidate's status, in curriculum order.
    type Raw = Omit<AreaTopic, "bucket"> & {
      category: string;
      order: number;
      eligible: boolean;
      penalty: number;
      /** Company frequency (0-100) when a target company asks this often and it fits the level. */
      boost: number;
    };
    const cats = hierarchy.categories.slice().sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
    let order = 0;
    const raw: Raw[] = cats.flatMap((c) =>
      c.topics.map((t) => {
        const priority = String(t.priority);
        const ov = overlays[t.slug];
        const done = practiced.has(t.slug) || ov?.status === "Practiced";
        const penalty = difficultyPenalty(years, String(t.difficulty ?? ""));
        const asked = matched?.topics[t.slug];
        // Company topics are boosted only when they suit the candidate's level.
        const boost = asked && penalty === 0 ? asked.frequency : 0;
        return {
          slug: t.slug,
          title: t.title,
          durationMin: Number(t.durationMin) || 15,
          priority,
          difficulty: String(t.difficulty ?? ""),
          href: t.practiceHref || getPracticeSessionUrl(slug, t.slug),
          status: (done
            ? "done"
            : ov?.status === "In Progress" || ov?.status === "Needs Practice"
              ? "in-progress"
              : "not-started") as TopicStatus,
          score: typeof ov?.readiness === "number" && ov.readiness > 0 ? Math.round(ov.readiness) : null,
          companies: asked ? asked.companies : null,
          category: c.slug,
          order: order++,
          eligible: allowed(priority) || boost > 0,
          penalty,
          boost,
        };
      }),
    );

    // 3. Rank: priority that fits their level first, then difficulty fit, then curriculum order
    //    (so foundations come before what builds on them).
    const ranked = raw
      .slice()
      .sort(
        (a, b) =>
          Number(!a.eligible) - Number(!b.eligible) ||
          // Topics the target company asks often come first (most frequent first).
          b.boost - a.boost ||
          (PRIORITY_RANK[a.priority] ?? 3) - (PRIORITY_RANK[b.priority] ?? 3) ||
          a.penalty - b.penalty ||
          a.order - b.order,
      );

    // 4. Fill the buckets. Finished topics always count as Must do (time already spent);
    //    the rest fill the remaining budget in rank order.
    const bucket = new Map<string, Bucket>();
    let left = minutesAvailable ?? Infinity;
    let maybeLeft = minutesAvailable !== null ? minutesAvailable * MAYBE_EXTRA : 0;
    for (const t of ranked) {
      if (t.status === "done") {
        bucket.set(t.slug, "must");
        continue;
      }
      if (minutesAvailable === null) {
        // No timeline or hours yet: fall back to what fits their level.
        bucket.set(t.slug, t.eligible ? "must" : "skip");
      } else if (t.eligible && t.durationMin <= left) {
        bucket.set(t.slug, "must");
        left -= t.durationMin;
      } else if (t.durationMin <= maybeLeft) {
        bucket.set(t.slug, "maybe");
        maybeLeft -= t.durationMin;
      } else {
        bucket.set(t.slug, "skip");
      }
    }

    const all: AreaTopic[] = raw.map((r) => ({
      slug: r.slug,
      title: r.title,
      durationMin: r.durationMin,
      priority: r.priority,
      difficulty: r.difficulty,
      href: r.href,
      status: r.status,
      score: r.score,
      companies: r.companies,
      bucket: bucket.get(r.slug) ?? "skip",
    }));
    const bySlug = new Map(all.map((t) => [t.slug, t]));
    const categories: AreaCategory[] = cats
      .map((c) => ({ slug: c.slug, name: c.name, topics: c.topics.map((t) => bySlug.get(t.slug)!).filter(Boolean) }))
      .filter((c) => c.topics.length > 0);

    const must = all.filter((t) => t.bucket === "must");
    const mustLeft = must.filter((t) => t.status !== "done");
    // Next: an unfinished Must do topic in rank order (one in progress first).
    const rankedMust = ranked.map((r) => bySlug.get(r.slug)!).filter((t) => t.bucket === "must" && t.status !== "done");
    const next = rankedMust.find((t) => t.status === "in-progress") ?? rankedMust[0] ?? null;

    // This week's focus (from the plan's weekly milestones).
    const milestones = (Array.isArray(plan?.weeklyMilestones) ? plan.weeklyMilestones : []) as Record<string, unknown>[];
    const m = milestones[Math.min(Math.floor(elapsed / 7), Math.max(0, milestones.length - 1))];
    const focus = String(m?.focusDomain ?? "").toLowerCase();
    const isWeekFocus = Boolean(focus) && ((WEIGHT_TO_SLUG[focus] ?? KEY_TO_SLUG[focus]) === slug || focus === slug);

    const companies = (Array.isArray(profile?.targetCompanies) ? profile.targetCompanies : []) as unknown[];

    return {
      slug,
      name: SHORT_NAME[slug] ?? hierarchy.domainName,
      description: hierarchy.description ?? "",
      weightPct: Math.round(weight * 100),
      isWeekFocus,
      categories,
      counts: {
        must: must.length,
        maybe: all.filter((t) => t.bucket === "maybe").length,
        skip: all.filter((t) => t.bucket === "skip").length,
      },
      mustDone: must.length - mustLeft.length,
      mustMinutesLeft: mustLeft.reduce((s, t) => s + t.durationMin, 0),
      mustMinutesTotal: must.reduce((s, t) => s + t.durationMin, 0),
      minutesAvailable,
      daysRemaining,
      next,
      why: {
        level: levelLabel(years),
        role: String(profile?.targetRole ?? plan?.targetRole ?? ""),
        company: companies.length ? String(companies[0]) : "",
        hours: minutesAvailable !== null ? Math.round(minutesAvailable / 60) : null,
      },
      company: companyNames.length
        ? {
            matched: matched?.matched.map((m) => m.name) ?? [],
            unmatched: companyFocus?.unmatched ?? [],
            topicCount: raw.filter((r) => r.boost > 0).length,
            interviewSharePct: companyShare !== undefined ? Math.round(companyShare * 100) : null,
          }
        : null,
    };
  }, [hierarchy, profile, plan, practiced, slug, companyFocus, companyNames]);

  return { loading, failed, detail };
}
