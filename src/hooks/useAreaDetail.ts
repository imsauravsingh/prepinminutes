"use client";

import { useEffect, useMemo, useState } from "react";
import { backendApi } from "@/lib/api-client";
import type { CurriculumHierarchyResponse } from "@/types/curriculum";
import { HIERARCHY_CACHE_PREFIX, getStoredCandidateOverlays, type CachedItem } from "@/hooks/useCurriculum";
import { KEY_TO_SLUG, SHORT_NAME, WEIGHT_TO_SLUG, readJSON, todayKey, weekStartKey } from "@/hooks/usePrepDashboard";
import { targetCompanyNames, useCompanyFocus } from "@/hooks/useCompanyFocus";
import {
  areaShares,
  buildAreaPlan,
  candidateAreaSlugs,
  levelLabel,
  planTiming,
  planWeightsBySlug,
  yearsOf,
  type AreaCategory,
  type AreaTopic,
  type Bucket,
} from "@/lib/prepPlan";

export type { AreaCategory, AreaTopic, Bucket, TopicStatus } from "@/lib/prepPlan";

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

export type AreaDetail = {
  slug: string;
  name: string;
  description: string;
  /** This area's share of study time, 0-100 (plan weights, blended with target companies). */
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
    const years = yearsOf(experience);

    // Same split as My Plan: this area's share of the candidate's study time.
    const slugs = Array.from(new Set([...candidateAreaSlugs(profile, plan), slug]));
    const matched = companyFocus?.matched.length ? companyFocus : null;
    const { share, company } = areaShares(slugs, planWeightsBySlug(plan), matched);
    const timing = planTiming(profile, plan);
    const minutesAvailable = timing.totalMinutes !== null ? Math.round(timing.totalMinutes * (share[slug] ?? 0)) : null;

    const area = buildAreaPlan({
      slug,
      hierarchy,
      experience,
      practiced,
      overlays: typeof window === "undefined" ? {} : getStoredCandidateOverlays(),
      minutesAvailable,
      focus: matched,
      technologies: Array.isArray(profile?.languages) ? (profile.languages as unknown[]).map(String) : [],
    });

    // This week's focus (from the plan's weekly milestones).
    const milestones = (Array.isArray(plan?.weeklyMilestones) ? plan.weeklyMilestones : []) as Record<string, unknown>[];
    const m = milestones[Math.min(Math.floor(timing.elapsedDays / 7), Math.max(0, milestones.length - 1))];
    const focus = String(m?.focusDomain ?? "").toLowerCase();
    const isWeekFocus = Boolean(focus) && ((WEIGHT_TO_SLUG[focus] ?? KEY_TO_SLUG[focus]) === slug || focus === slug);
    const companies = (Array.isArray(profile?.targetCompanies) ? profile.targetCompanies : []) as unknown[];

    return {
      slug,
      name: SHORT_NAME[slug] ?? hierarchy.domainName,
      description: hierarchy.description ?? "",
      weightPct: Math.round((share[slug] ?? 0) * 100),
      isWeekFocus,
      categories: area.categories,
      counts: area.counts,
      mustDone: area.mustDone,
      mustMinutesLeft: area.mustMinutesLeft,
      mustMinutesTotal: area.mustMinutesTotal,
      minutesAvailable,
      daysRemaining: timing.daysRemaining,
      next: area.next,
      why: {
        level: levelLabel(years),
        role: String(profile?.targetRole ?? plan?.targetRole ?? ""),
        company: companies.length ? String(companies[0]) : "",
        hours: minutesAvailable !== null ? Math.round(minutesAvailable / 60) : null,
      },
      company: companyNames.length
        ? {
            matched: matched?.matched.map((x) => x.name) ?? [],
            unmatched: companyFocus?.unmatched ?? [],
            topicCount: area.companyTopicCount,
            interviewSharePct: company[slug] !== undefined ? Math.round(company[slug] * 100) : null,
          }
        : null,
    };
  }, [hierarchy, profile, plan, practiced, slug, companyFocus, companyNames]);

  return { loading, failed, detail };
}
