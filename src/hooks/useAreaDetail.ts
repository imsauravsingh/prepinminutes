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

/**
 * Data for one preparation area page (/prepare/[area]):
 * the area's curriculum grouped by category, with this candidate's status per topic.
 *
 * Sources (all existing, nothing new is stored):
 * - profile + active plan       → experience, plan weight, this week's focus, days left
 * - curriculum hierarchy        → categories and topics (shared local cache)
 * - dashboard progress (Postgres) → topics marked practiced
 * - local topic overlays        → "in progress" / readiness from practice sessions
 */

export type TopicStatus = "done" | "in-progress" | "not-started";

export type AreaTopic = {
  slug: string;
  title: string;
  durationMin: number;
  priority: string;
  difficulty: string;
  href: string;
  /** Part of this candidate's must-do set (priority fits their experience). */
  mustDo: boolean;
  /** Stretch topic, shown in the Advanced section. */
  advanced: boolean;
  status: TopicStatus;
  /** Readiness from practice, 0-100, when known. */
  score: number | null;
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
  mustDoTotal: number;
  mustDoDone: number;
  allTotal: number;
  allDone: number;
  /** Minutes of must-do work left. */
  minutesLeft: number;
  daysRemaining: number | null;
  /** Must-do work left needs more time than the candidate's study hours give this area before the interview. */
  behind: boolean;
  next: AreaTopic | null;
  /** Lowest-readiness practiced topic, if any score is below 70. */
  weakSpot: AreaTopic | null;
  advancedCount: number;
  advancedUnlocked: boolean;
};

const ADVANCED_UNLOCK_PCT = 80;

function yearsOf(experience: string) {
  const e = experience.toLowerCase();
  if (e.includes("fresher") || e.includes("student")) return 0;
  return Number(e.match(/\d+/)?.[0] ?? 0);
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

    const categories: AreaCategory[] = hierarchy.categories
      .slice()
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
      .map((c) => ({
        slug: c.slug,
        name: c.name,
        topics: c.topics.map((t) => {
          const priority = String(t.priority);
          const mustDo = allowed(priority);
          const ov = overlays[t.slug];
          const done = practiced.has(t.slug) || ov?.status === "Practiced";
          const score = typeof ov?.readiness === "number" && ov.readiness > 0 ? Math.round(ov.readiness) : null;
          return {
            slug: t.slug,
            title: t.title,
            durationMin: Number(t.durationMin) || 15,
            priority,
            difficulty: String(t.difficulty ?? ""),
            href: t.practiceHref || getPracticeSessionUrl(slug, t.slug),
            mustDo,
            advanced: !mustDo && (priority === "P2" || t.difficulty === "EXPERT"),
            status: done ? "done" : ov?.status === "In Progress" || ov?.status === "Needs Practice" ? "in-progress" : "not-started",
            score,
          } satisfies AreaTopic;
        }),
      }))
      .filter((c) => c.topics.length > 0);

    const all = categories.flatMap((c) => c.topics);
    const must = all.filter((t) => t.mustDo);
    const mustDoDone = must.filter((t) => t.status === "done").length;
    const pct = must.length ? (mustDoDone / must.length) * 100 : 0;

    // Plan weight and this week's focus.
    const rawWeights = (plan?.domainWeights ?? {}) as Record<string, number>;
    let weight = 0;
    for (const [k, v] of Object.entries(rawWeights)) {
      if ((WEIGHT_TO_SLUG[k] ?? KEY_TO_SLUG[k]) === slug) weight += Number(v || 0);
    }
    const totalWeeks = Number(plan?.timelineWeeks ?? profile?.timelineWeeks ?? 0) || 0;
    const elapsed = daysSince(plan?.createdAt);
    const milestones = (Array.isArray(plan?.weeklyMilestones) ? plan.weeklyMilestones : []) as Record<string, unknown>[];
    const m = milestones[Math.min(Math.floor(elapsed / 7), Math.max(0, milestones.length - 1))];
    const focus = String(m?.focusDomain ?? "").toLowerCase();
    const isWeekFocus = Boolean(focus) && ((WEIGHT_TO_SLUG[focus] ?? KEY_TO_SLUG[focus]) === slug || focus === slug);

    const remaining = must.filter((t) => t.status !== "done");
    const daysRemaining = totalWeeks ? Math.max(0, totalWeeks * 7 - elapsed) : null;
    // Time this area gets before the interview: weekly study hours × its plan share (whole time if unweighted).
    const weeklyHours = Number(profile?.weeklyGoalHours ?? 0) || 0;
    const share = weight > 0 ? Math.min(1, weight) : 1;
    const minutesAvailable = daysRemaining !== null ? (weeklyHours * 60 * share * daysRemaining) / 7 : null;
    const minutesLeft = remaining.reduce((s, t) => s + t.durationMin, 0);
    const behind = minutesAvailable !== null && weeklyHours > 0 && minutesLeft > minutesAvailable;
    const next = must.find((t) => t.status === "in-progress") ?? remaining[0] ?? all.find((t) => t.status !== "done") ?? null;
    const weak = all
      .filter((t) => t.score !== null && t.score < 70)
      .sort((a, b) => (a.score ?? 0) - (b.score ?? 0))[0] ?? null;

    return {
      slug,
      name: SHORT_NAME[slug] ?? hierarchy.domainName,
      description: hierarchy.description ?? "",
      weightPct: Math.round(weight * 100),
      isWeekFocus,
      categories,
      mustDoTotal: must.length,
      mustDoDone,
      allTotal: all.length,
      allDone: all.filter((t) => t.status === "done").length,
      minutesLeft,
      daysRemaining,
      behind,
      next,
      weakSpot: weak,
      advancedCount: all.filter((t) => t.advanced).length,
      advancedUnlocked: pct >= ADVANCED_UNLOCK_PCT || years >= 8,
    };
  }, [hierarchy, profile, plan, practiced, slug]);

  return { loading, failed, detail };
}
