"use client";

import { useEffect, useMemo, useState } from "react";
import { backendApi } from "@/lib/api-client";
import type { CurriculumHierarchyResponse } from "@/types/curriculum";
import { HIERARCHY_CACHE_PREFIX, getStoredCandidateOverlays, type CachedItem } from "@/hooks/useCurriculum";
import { SHORT_NAME, readJSON, todayKey, weekStartKey } from "@/hooks/usePrepDashboard";
import { targetCompanyNames, useCompanyFocus } from "@/hooks/useCompanyFocus";
import {
  areaShares,
  buildAreaPlan,
  candidateAreaSlugs,
  levelLabel,
  planTiming,
  planWeightsBySlug,
  yearsOf,
  type AreaPlan,
  type AreaTopic,
} from "@/lib/prepPlan";

/**
 * My Plan: the whole time-budgeted plan as a week-by-week roadmap, from the same
 * calculation as the area pages (lib/prepPlan), so the numbers always agree.
 *
 * Weeks are counted from the plan's start date:
 * - past weeks show the topics finished in them (by finish date);
 * - this week shows what's done so far plus what's planned for the days left;
 * - upcoming weeks get the remaining Must do topics, filled to the weekly hours,
 *   areas interleaved by their share of time;
 * - the last few days are kept for mocks and revision (no new topics).
 * Each week is named after its main topic families.
 */

export type PlanArea = AreaPlan & { slug: string; name: string; sharePct: number; minutes: number | null };

export type WeekTopic = AreaTopic & { areaSlug: string; areaName: string };

export type WeekGroup = { name: string; areaName: string; topics: WeekTopic[]; done: number };

export type PlanWeek = {
  index: number;
  number: number;
  name: string;
  /** "Days 1 – 7" and "Nov 25 – Dec 1". */
  daysLabel: string;
  range: string;
  status: "done" | "current" | "upcoming";
  /** Study minutes planned for the week (weekly hours, minus mock/revision days). */
  plannedMin: number;
  topics: WeekTopic[];
  groups: WeekGroup[];
  done: number;
  pct: number;
  /** Days in this week kept for mocks and revision. */
  reserveDays: number;
  /** Day-by-day split for the detail panel. */
  days: { label: string; topics: WeekTopic[]; reserve: boolean }[];
};

export type PlanOverview = {
  role: string;
  level: string;
  companies: string[];
  unmatchedCompanies: string[];
  daysRemaining: number | null;
  weeklyHours: number;
  totalPlanHours: number | null;
  totalMinutes: number | null;
  areas: PlanArea[];
  allTopics: number;
  mustTotal: number;
  mustDone: number;
  mustMinutesDone: number;
  mustMinutesLeft: number;
  skipped: number;
  overByMinutes: number;
  reserveMinutes: number;
  weeks: PlanWeek[];
  currentWeek: PlanWeek | null;
  next: WeekTopic | null;
  changes: string[];
  hasTimeline: boolean;
  snapshot: Snapshot;
};

type Snapshot = { must: string[]; companies: string[]; done: number };

const SNAPSHOT_KEY = "pim_plan_snapshot";
const DAY = 86_400_000;

const fmtDay = (d: Date) => d.toLocaleDateString(undefined, { month: "short", day: "numeric" });

/** Short label for a topic family: "Scalability & Performance Principles" → "Scalability". */
function shortFamily(name: string) {
  return name.split(/\s*(?:&|,|:|\(|-)\s*/)[0].trim() || name;
}

function nameWeek(topics: WeekTopic[], isFirst: boolean) {
  const byFamily = new Map<string, number>();
  for (const t of topics) byFamily.set(t.category, (byFamily.get(t.category) ?? 0) + t.durationMin);
  const top = [...byFamily.entries()].sort((a, b) => b[1] - a[1]).map(([n]) => n);
  if (!top.length) return isFirst ? "Getting started" : "Catch-up and buffer";
  if (top.length === 1) return top[0];
  return `${shortFamily(top[0])} & ${shortFamily(top[1])}`;
}

function groupTopics(topics: WeekTopic[]): WeekGroup[] {
  const map = new Map<string, WeekGroup>();
  for (const t of topics) {
    const key = `${t.areaSlug}|${t.category}`;
    const g = map.get(key) ?? { name: t.category, areaName: t.areaName, topics: [], done: 0 };
    g.topics.push(t);
    if (t.status === "done") g.done++;
    map.set(key, g);
  }
  return [...map.values()];
}

export function usePlanOverview() {
  const [profile, setProfile] = useState<Record<string, unknown> | null>(null);
  const [plan, setPlan] = useState<Record<string, unknown> | null>(null);
  const [practiced, setPracticed] = useState<Set<string>>(new Set());
  const [doneAt, setDoneAt] = useState<Record<string, string>>({});
  const [hierarchies, setHierarchies] = useState<Record<string, CurriculumHierarchyResponse>>({});
  const [loading, setLoading] = useState(true);
  const companyNames = useMemo(() => targetCompanyNames(profile), [profile]);
  const { focus, ready: companyReady } = useCompanyFocus(companyNames);
  // The plan as this browser last saw it (read once on load).
  const [prev] = useState<Snapshot | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      return JSON.parse(localStorage.getItem(SNAPSHOT_KEY) ?? "null") as Snapshot | null;
    } catch {
      return null;
    }
  });

  // 1. Profile, plan and progress; then every area's curriculum (shared cache).
  useEffect(() => {
    let alive = true;
    Promise.all([
      backendApi.getProfile().catch(() => null),
      backendApi.getDashboardProgress(todayKey(), weekStartKey()).catch(() => null),
    ]).then(async ([prof, progress]) => {
      if (!alive) return;
      const p = prof?.profile ?? null;
      const ap = prof?.activePlan ?? null;
      const slugs = candidateAreaSlugs(p, ap);
      const rows = await Promise.all(
        slugs.map(async (slug) => {
          const cacheKey = `${HIERARCHY_CACHE_PREFIX}${slug}`;
          const cached = readJSON<CachedItem<CurriculumHierarchyResponse>>(cacheKey);
          try {
            const res = await backendApi.getCurriculumHierarchy(slug, cached?.etag ?? undefined);
            if (res.notModified && cached?.data) return [slug, cached.data] as const;
            if (!res.categories) return cached?.data ? ([slug, cached.data] as const) : null;
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
            return [slug, data] as const;
          } catch {
            return cached?.data ? ([slug, cached.data] as const) : null;
          }
        }),
      );
      if (!alive) return;
      const next: Record<string, CurriculumHierarchyResponse> = {};
      for (const r of rows) if (r) next[r[0]] = r[1];
      setProfile(p);
      setPlan(ap);
      setPracticed(new Set(progress?.practicedTopicSlugs ?? []));
      const dates: Record<string, string> = {};
      for (const t of progress?.practicedTopics ?? []) if (t.at) dates[t.slug] = t.at;
      setDoneAt(dates);
      setHierarchies(next);
      setLoading(false);
    });
    return () => {
      alive = false;
    };
  }, []);

  // 2. The plan.
  const overview: PlanOverview | null = useMemo(() => {
    if (loading || !companyReady) return null;
    const experience = String(profile?.experienceLevel ?? "");
    const slugs = candidateAreaSlugs(profile, plan).filter((s) => hierarchies[s]);
    const matched = focus?.matched.length ? focus : null;
    const { share } = areaShares(slugs, planWeightsBySlug(plan), matched);
    const timing = planTiming(profile, plan);
    const overlays = typeof window === "undefined" ? {} : getStoredCandidateOverlays();

    const areas: PlanArea[] = slugs
      .map((slug) => {
        const minutes = timing.totalMinutes !== null ? Math.round(timing.totalMinutes * (share[slug] ?? 0)) : null;
        const a = buildAreaPlan({
          slug,
          hierarchy: hierarchies[slug],
          experience,
          practiced,
          overlays,
          minutesAvailable: minutes,
          focus: matched,
          technologies: Array.isArray(profile?.languages) ? (profile.languages as unknown[]).map(String) : [],
        });
        return { ...a, slug, name: SHORT_NAME[slug] ?? hierarchies[slug].domainName, sharePct: Math.round((share[slug] ?? 0) * 100), minutes };
      })
      .sort((a, b) => b.sharePct - a.sharePct);

    const tag = (a: PlanArea, t: AreaTopic): WeekTopic => ({ ...t, areaSlug: a.slug, areaName: a.name });
    const mustAll = areas.flatMap((a) => a.ranked.filter((t) => t.bucket === "must").map((t) => tag(a, t)));
    const doneTopics = mustAll.filter((t) => t.status === "done");
    const mustTotal = mustAll.length;
    const mustDone = doneTopics.length;
    const mustMinutesDone = doneTopics.reduce((s, t) => s + t.durationMin, 0);
    const mustMinutesLeft = areas.reduce((s, a) => s + a.mustMinutesLeft, 0);
    const allTopics = areas.reduce((s, a) => s + a.counts.must + a.counts.maybe + a.counts.skip, 0);
    const skipped = areas.reduce((s, a) => s + a.counts.maybe + a.counts.skip, 0);
    const perDay = timing.weeklyHours > 0 ? (timing.weeklyHours * 60) / 7 : 0;

    // 3. Weeks, counted from the plan start.
    const totalDays = timing.totalWeeks * 7;
    const weeks: PlanWeek[] = [];
    if (totalDays > 0) {
      const elapsed = Math.min(timing.elapsedDays, totalDays - 1);
      const startDate = new Date(new Date().setHours(0, 0, 0, 0) - elapsed * DAY);
      const reserveStart = totalDays - timing.reserveDays;
      const dayOf = (iso: string) => Math.floor((new Date(iso).getTime() - startDate.getTime()) / DAY);

      // Finished topics → the week they were finished in (undated ones count as this week).
      const doneByWeek = new Map<number, WeekTopic[]>();
      for (const t of doneTopics) {
        const d = doneAt[t.slug] ? Math.max(0, Math.min(elapsed, dayOf(doneAt[t.slug]))) : elapsed;
        const w = Math.floor(d / 7);
        doneByWeek.set(w, [...(doneByWeek.get(w) ?? []), t]);
      }

      // Remaining Must do topics, areas interleaved by share (area furthest behind its share goes next).
      const queues = areas.map((a) => ({ a, left: a.ranked.filter((t) => t.bucket === "must" && t.status !== "done"), used: 0 }));
      const nextTopic = (): WeekTopic | null => {
        const open = queues.filter((q) => q.left.length);
        if (!open.length) return null;
        open.sort((x, y) => x.used / Math.max(x.a.sharePct, 1) - y.used / Math.max(y.a.sharePct, 1));
        const q = open[0];
        const t = q.left.shift()!;
        q.used += t.durationMin;
        return tag(q.a, t);
      };
      let carry: WeekTopic | null = nextTopic();

      const weekCount = Math.ceil(totalDays / 7);
      for (let i = 0; i < weekCount; i++) {
        const startDay = i * 7;
        const endDay = Math.min(totalDays, startDay + 7);
        const status: PlanWeek["status"] = endDay <= elapsed ? "done" : startDay <= elapsed ? "current" : "upcoming";
        const studyDays: number[] = [];
        let reserveDays = 0;
        for (let d = startDay; d < endDay; d++) {
          if (d >= reserveStart) reserveDays++;
          else if (d >= elapsed) studyDays.push(d);
        }
        const done = doneByWeek.get(i) ?? [];

        // Fill the remaining study days of this week, day by day.
        const dayTopics = new Map<number, WeekTopic[]>();
        for (const d of studyDays) {
          let used = 0;
          const list: WeekTopic[] = [];
          while (carry && (used + carry.durationMin <= perDay || list.length === 0)) {
            list.push(carry);
            used += carry.durationMin;
            carry = nextTopic();
            if (used >= perDay) break;
          }
          dayTopics.set(d, list);
        }
        const scheduled = studyDays.flatMap((d) => dayTopics.get(d) ?? []);
        const topics = [...done, ...scheduled];
        const daysInWeek = endDay - startDay;
        const from = new Date(startDate.getTime() + startDay * DAY);
        const to = new Date(startDate.getTime() + (endDay - 1) * DAY);
        const studyDaysInWeek = daysInWeek - reserveDays;
        const days = [];
        for (let d = Math.max(startDay, status === "done" ? startDay : elapsed); d < endDay; d++) {
          const date = new Date(startDate.getTime() + d * DAY);
          const finished = done.filter((t) => (doneAt[t.slug] ? dayOf(doneAt[t.slug]) : elapsed) === d);
          days.push({
            label: d === elapsed ? `Today · ${fmtDay(date)}` : date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" }),
            topics: [...finished, ...(dayTopics.get(d) ?? [])],
            reserve: d >= reserveStart,
          });
        }

        weeks.push({
          index: i,
          number: i + 1,
          name:
            studyDaysInWeek <= 0
              ? "Practice, revision and mock interviews"
              : nameWeek(topics, i === 0),
          daysLabel: daysInWeek > 1 ? `Days ${startDay + 1} – ${endDay}` : `Day ${endDay}`,
          range: daysInWeek > 1 ? `${fmtDay(from)} – ${fmtDay(to)}` : fmtDay(from),
          status,
          // This week: what's done plus the study days still ahead; other weeks: their full study time.
          plannedMin:
            status === "current"
              ? Math.round(done.reduce((m, t) => m + t.durationMin, 0) + perDay * studyDays.length)
              : Math.round(perDay * studyDaysInWeek),
          topics,
          groups: groupTopics(topics),
          done: done.length,
          pct: topics.length ? Math.round((done.length / topics.length) * 100) : status === "done" ? 100 : 0,
          reserveDays,
          days,
        });
      }
    }
    const currentWeek = weeks.find((w) => w.status === "current") ?? null;
    const next =
      currentWeek?.topics.find((t) => t.status === "in-progress") ??
      weeks.flatMap((w) => (w.status === "done" ? [] : w.topics)).find((t) => t.status !== "done") ??
      null;

    // 4. What changed since this browser last saw the plan.
    const mustSet = mustAll.map((t) => t.slug);
    const companiesNow = matched?.matched.map((m) => m.name) ?? [];
    const changes: string[] = [];
    if (prev) {
      const added = companiesNow.filter((c) => !prev.companies.includes(c));
      const removed = prev.companies.filter((c) => !companiesNow.includes(c));
      const before = new Set(prev.must);
      const now = new Set(mustSet);
      const movedIn = mustSet.filter((x) => !before.has(x)).length;
      const movedOut = prev.must.filter((x) => !now.has(x)).length;
      if (added.length) changes.push(`You added ${added.join(", ")} as a target, so their frequent topics moved up.`);
      if (removed.length) changes.push(`${removed.join(", ")} is no longer a target, so the plan went back to your experience and timeline.`);
      if (mustDone > prev.done) changes.push(`You finished ${mustDone - prev.done} topic${mustDone - prev.done === 1 ? "" : "s"} since your last visit.`);
      if (movedOut > 0) changes.push(`${movedOut} topic${movedOut === 1 ? "" : "s"} moved out of Must do to fit the time left.`);
      if (movedIn > 0 && !added.length) changes.push(`${movedIn} topic${movedIn === 1 ? "" : "s"} moved into Must do.`);
    }

    return {
      role: String(profile?.targetRole ?? plan?.targetRole ?? ""),
      level: levelLabel(yearsOf(experience)),
      companies: companiesNow,
      unmatchedCompanies: focus?.unmatched ?? [],
      daysRemaining: timing.daysRemaining,
      weeklyHours: timing.weeklyHours,
      totalPlanHours: totalDays && timing.weeklyHours ? Math.round((timing.weeklyHours * totalDays) / 7) : null,
      totalMinutes: timing.totalMinutes,
      areas,
      allTopics,
      mustTotal,
      mustDone,
      mustMinutesDone,
      mustMinutesLeft,
      skipped,
      overByMinutes: timing.totalMinutes !== null ? Math.max(0, mustMinutesLeft - timing.totalMinutes) : 0,
      reserveMinutes: Math.round(perDay * timing.reserveDays),
      weeks,
      currentWeek,
      next,
      changes,
      hasTimeline: timing.totalMinutes !== null,
      snapshot: { must: mustSet, companies: companiesNow, done: mustDone },
    };
  }, [loading, companyReady, profile, plan, hierarchies, practiced, doneAt, focus, prev]);

  useEffect(() => {
    if (!overview) return;
    try {
      localStorage.setItem(SNAPSHOT_KEY, JSON.stringify(overview.snapshot));
    } catch {}
  }, [overview]);

  return { loading: loading || !companyReady, overview };
}
