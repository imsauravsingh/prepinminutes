"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { backendApi, type DashboardTaskRow } from "@/lib/api-client";
import { getPracticeSessionUrl } from "@/lib/practice-router";
import type { CurriculumHierarchyResponse, CurriculumTopicSummary } from "@/types/curriculum";
import {
  HIERARCHY_CACHE_PREFIX,
  getStoredCandidateOverlays,
  setStoredCandidateOverlay,
  type CachedItem,
} from "@/hooks/useCurriculum";

/**
 * Builds the "Start preparing" dashboard from real data:
 * - the candidate's setup (role, experience, timeline, weekly hours),
 * - their generated plan (area weights + weekly milestones),
 * - the published curriculum (areas, topics, durations, practice links),
 * - their topic progress (topics marked practiced).
 */

/** Roadmap domain keys (role rules) → curriculum domain slugs. */
const KEY_TO_SLUG: Record<string, string | null> = {
  "system-design": "system-design",
  "ai-system-design": "ai-system-design",
  dsa: "dsa",
  lld: "low-level-design",
  "low-level-design": "low-level-design",
  "nodejs-runtime": "backend-engineering",
  "backend-engineering": "backend-engineering",
  "frontend-engineering": "frontend-engineering",
  "cloud-devops": "cloud-devops",
  behavioral: "behavioral-leadership",
  "behavioral-leadership": "behavioral-leadership",
  "data-engineering": "data-engineering",
  "mobile-engineering": "mobile-engineering",
  "cs-fundamentals": null, // not a published curriculum area yet
};

/** Plan weight keys (from plan generation) → curriculum slugs. */
const WEIGHT_TO_SLUG: Record<string, string> = {
  "system-design": "system-design",
  coding: "dsa",
  dsa: "dsa",
  cloud: "cloud-devops",
  "cloud-devops": "cloud-devops",
  behavioral: "behavioral-leadership",
  frontend: "frontend-engineering",
  backend: "backend-engineering",
  "ai-system-design": "ai-system-design",
  "low-level-design": "low-level-design",
  lld: "low-level-design",
  "data-engineering": "data-engineering",
};

/** Short card names for long curriculum area names. */
const SHORT_NAME: Record<string, string> = {
  "system-design": "System Design",
  "ai-system-design": "AI System Design",
  "low-level-design": "Low-Level Design",
  dsa: "Coding & Algorithms",
  "backend-engineering": "Backend & Runtime",
  "frontend-engineering": "Frontend Architecture",
  "cloud-devops": "Cloud & DevOps",
  "behavioral-leadership": "Behavioral & Leadership",
  "data-engineering": "Data Engineering",
  "mobile-engineering": "Mobile Engineering",
};

export type PlanTopic = {
  slug: string;
  title: string;
  category: string;
  domainSlug: string;
  durationMin: number;
  priority: string;
  href: string;
};

export type DashboardArea = {
  slug: string;
  name: string;
  description: string;
  weight: number;
  topics: PlanTopic[];
  done: number;
  total: number;
  progress: number;
  nextHref: string;
};

export type DashboardTask = {
  id: string; // topic slug
  title: string;
  subtitle: string;
  duration: string;
  durationMin: number;
  href: string;
  domainSlug: string;
  /** Saved row id (daily_plan_tasks) once stored. */
  taskId?: string;
  isCompleted?: boolean;
};

function rowToTask(r: DashboardTaskRow): DashboardTask {
  return {
    id: r.id,
    taskId: r.taskId,
    title: r.title,
    subtitle: r.subtitle,
    duration: r.duration,
    durationMin: r.durationMin,
    href: r.href,
    domainSlug: r.domainSlug,
    isCompleted: r.isCompleted,
  };
}

export type WeekMilestone = { weekNumber: number; totalWeeks: number; title: string; goals: string[] };

type Input = {
  profile: Record<string, unknown> | null;
  activePlan: Record<string, unknown> | null;
  roleDomainKeys: string[];
  /** False until the profile and plan have loaded; today's list waits for it. */
  ready: boolean;
};

const PRACTICED = "Practiced";

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Monday of the current week, "YYYY-MM-DD". */
function weekStartKey() {
  const d = new Date();
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function readJSON<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

/** Topics a candidate at this level should cover: P0 always, P1 from mid-level, P2 for senior. */
function priorityAllowed(experience: string) {
  // Works for every stored format: "6-8 years", "8+ years", "6-9", "10+", "STUDENT_FRESHER", "0 years (Fresher)".
  const e = experience.toLowerCase();
  const years = Number(e.match(/\d+/)?.[0] ?? 0);
  const fresher = e.includes("fresher") || e.includes("student");
  const senior = !fresher && years >= 6;
  const mid = !fresher && years >= 3;
  return (p: string) => p === "P0" || (mid && p === "P1") || (senior && p === "P2");
}

function daysSince(iso: unknown) {
  const t = typeof iso === "string" ? Date.parse(iso) : NaN;
  if (Number.isNaN(t)) return 0;
  return Math.max(0, Math.floor((Date.now() - t) / 86_400_000));
}

export function usePrepDashboard({ profile, activePlan, roleDomainKeys, ready }: Input) {
  // 1. Which areas, in what order: plan weights first, then the role's areas.
  const weights = useMemo(() => {
    const raw = (activePlan?.domainWeights ?? {}) as Record<string, number>;
    const out: Record<string, number> = {};
    for (const [k, v] of Object.entries(raw)) {
      const slug = WEIGHT_TO_SLUG[k] ?? KEY_TO_SLUG[k];
      if (slug) out[slug] = (out[slug] ?? 0) + Number(v || 0);
    }
    return out;
  }, [activePlan]);

  const slugs = useMemo(() => {
    const fromRole = roleDomainKeys.map((k) => KEY_TO_SLUG[k]).filter((s): s is string => Boolean(s));
    const all = Array.from(new Set([...Object.keys(weights), ...fromRole]));
    return all.sort((a, b) => (weights[b] ?? 0) - (weights[a] ?? 0) || fromRole.indexOf(a) - fromRole.indexOf(b));
  }, [weights, roleDomainKeys]);
  const slugsKey = slugs.join(",");

  // 2. Load each area's curriculum (cached by the shared curriculum cache).
  const [hierarchies, setHierarchies] = useState<Record<string, CurriculumHierarchyResponse>>(() => {
    const out: Record<string, CurriculumHierarchyResponse> = {};
    if (typeof window === "undefined") return out;
    for (const slug of slugs) {
      const cached = readJSON<CachedItem<CurriculumHierarchyResponse>>(`${HIERARCHY_CACHE_PREFIX}${slug}`);
      if (cached?.data?.categories) out[slug] = cached.data;
    }
    return out;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    const list = slugsKey ? slugsKey.split(",") : [];
    Promise.all(
      list.map(async (slug) => {
        const cacheKey = `${HIERARCHY_CACHE_PREFIX}${slug}`;
        const cached = readJSON<CachedItem<CurriculumHierarchyResponse>>(cacheKey);
        try {
          const res = await backendApi.getCurriculumHierarchy(slug, cached?.etag ?? undefined);
          if (res.notModified && cached?.data) return [slug, cached.data] as const;
          if (!res.categories) return null;
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
    ).then((rows) => {
      if (!alive) return;
      const next: Record<string, CurriculumHierarchyResponse> = {};
      for (const row of rows) if (row) next[row[0]] = row[1];
      setHierarchies(next);
      setLoading(false);
    });
    return () => {
      alive = false;
    };
  }, [slugsKey]);

  // 3. Progress, saved in PostgreSQL via the dashboard API.
  //    The local "practiced" overlay is kept in sync so curriculum pages see the same status.
  const [practiced, setPracticed] = useState<Set<string>>(new Set());
  const [serverToday, setServerToday] = useState<DashboardTaskRow[] | null>(null);
  const [weekProgress, setWeekProgress] = useState<Record<string, { total: number; done: number }>>({});
  const [streakDays, setStreakDays] = useState(0);
  const [progressLoaded, setProgressLoaded] = useState(false);

  useEffect(() => {
    if (!ready) return;
    let alive = true;
    backendApi
      .getDashboardProgress(todayKey(), weekStartKey())
      .then((res) => {
        if (!alive) return;
        setPracticed(new Set(res.practicedTopicSlugs));
        setServerToday(res.todayTasks);
        setWeekProgress(res.week ?? {});
        setStreakDays(res.streakDays ?? 0);
        // Mirror into the shared overlay for the curriculum pages.
        const overlays = getStoredCandidateOverlays();
        for (const slug of res.practicedTopicSlugs) {
          if (overlays[slug]?.status !== PRACTICED) setStoredCandidateOverlay(slug, { status: PRACTICED, readiness: 100 });
        }
      })
      .catch((err) => console.warn("Dashboard progress unavailable:", err))
      .finally(() => alive && setProgressLoaded(true));
    return () => {
      alive = false;
    };
  }, [ready]);

  // 4. Areas with the topics this candidate needs.
  const experience = String(profile?.experienceLevel ?? "");
  const areas: DashboardArea[] = useMemo(() => {
    const allowed = priorityAllowed(experience);
    return slugs
      .filter((slug) => hierarchies[slug])
      .map((slug) => {
        const h = hierarchies[slug];
        const topics: PlanTopic[] = h.categories
          .slice()
          .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
          .flatMap((c) =>
            c.topics
              .filter((t: CurriculumTopicSummary) => allowed(String(t.priority)))
              .map((t) => ({
                slug: t.slug,
                title: t.title,
                category: c.name,
                domainSlug: slug,
                durationMin: Number(t.durationMin) || 15,
                priority: String(t.priority),
                href: t.practiceHref || getPracticeSessionUrl(slug, t.slug),
              })),
          );
        const done = topics.filter((t) => practiced.has(t.slug)).length;
        const next = topics.find((t) => !practiced.has(t.slug)) ?? topics[0];
        return {
          slug,
          name: SHORT_NAME[slug] ?? h.domainName,
          description: h.description ?? "",
          weight: weights[slug] ?? 0,
          topics,
          done,
          total: topics.length,
          progress: topics.length ? Math.round((done / topics.length) * 100) : 0,
          nextHref: next?.href ?? "/practice",
        };
      })
      .filter((a) => a.total > 0);
  }, [slugs, hierarchies, practiced, experience, weights]);

  // 5. Plan timing: current week, milestone, days left.
  const totalWeeks = Number(activePlan?.timelineWeeks ?? profile?.timelineWeeks ?? 4) || 4;
  const elapsedDays = daysSince(activePlan?.createdAt);
  const daysRemaining = Math.max(0, totalWeeks * 7 - elapsedDays);
  const milestones = (Array.isArray(activePlan?.weeklyMilestones) ? activePlan.weeklyMilestones : []) as Record<string, unknown>[];
  const weekIndex = Math.min(Math.floor(elapsedDays / 7), Math.max(0, milestones.length - 1));
  const m = milestones[weekIndex];
  const milestone: WeekMilestone | null = m
    ? {
        weekNumber: Number(m.weekNumber ?? weekIndex + 1),
        totalWeeks,
        title: String(m.title ?? ""),
        goals: Array.isArray(m.goals) ? (m.goals as unknown[]).map(String) : [],
      }
    : null;

  // 6. Today's tasks: sized to the candidate's daily time, this week's focus first.
  const weeklyHours = Number(profile?.weeklyGoalHours ?? 5) || 5;
  const minutesPerDay = Math.max(15, Math.round((weeklyHours * 60) / 5));
  const focus = String(m?.focusDomain ?? "").toLowerCase();

  const freshTasks = useMemo(() => {
    if (!areas.length) return [] as DashboardTask[];
    const ordered = areas.slice().sort((a, b) => {
      const fa = focus && (focus.includes(a.name.toLowerCase().split(" ")[0]) || a.name.toLowerCase().includes(focus.split(" ")[0])) ? 1 : 0;
      const fb = focus && (focus.includes(b.name.toLowerCase().split(" ")[0]) || b.name.toLowerCase().includes(focus.split(" ")[0])) ? 1 : 0;
      return fb - fa || b.weight - a.weight;
    });
    const queues = ordered.map((a) => a.topics.filter((t) => !practiced.has(t.slug)));
    const tasks: DashboardTask[] = [];
    let used = 0;
    for (let round = 0; tasks.length < 4 && used < minutesPerDay; round++) {
      let added = false;
      for (let i = 0; i < queues.length && tasks.length < 4 && used < minutesPerDay; i++) {
        const t = queues[i][round];
        if (!t) continue;
        tasks.push({
          id: t.slug,
          title: t.title,
          subtitle: `${ordered[i].name} · ${t.category}`,
          duration: `${t.durationMin} min`,
          durationMin: t.durationMin,
          href: t.href,
          domainSlug: t.domainSlug,
        });
        used += t.durationMin;
        added = true;
      }
      if (!added) break;
    }
    return tasks;
    // Practiced changes shouldn't reshuffle today's list mid-day (it's frozen below).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [areas.length, slugsKey, minutesPerDay, focus, loading]);

  // Today's list: the saved list for today wins; otherwise build it once and save it.
  const [todayTasks, setTodayTasks] = useState<DashboardTask[]>([]);
  const savingRef = useRef(false);
  useEffect(() => {
    if (!ready || !progressLoaded) return;
    if (serverToday && serverToday.length) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- adopt today's saved list
      setTodayTasks(serverToday.map(rowToTask));
      return;
    }
    if (loading || !freshTasks.length || savingRef.current) return;
    savingRef.current = true;
    setTodayTasks(freshTasks);
    backendApi
      .saveDashboardToday({
        date: todayKey(),
        tasks: freshTasks.map((t) => ({
          topicSlug: t.id,
          domainSlug: t.domainSlug,
          title: t.title,
          subtitle: t.subtitle,
          durationMin: t.durationMin,
          practiceHref: t.href,
        })),
      })
      .then((res) => setServerToday(res.todayTasks))
      .catch((err) => console.warn("Could not save today's tasks:", err))
      .finally(() => {
        savingRef.current = false;
      });
  }, [freshTasks, loading, ready, progressLoaded, serverToday]);

  const doneTodayIds = todayTasks.filter((t) => t.isCompleted).map((t) => t.id);

  const setTopicDone = (slug: string, isDone: boolean) => {
    const task = todayTasks.find((t) => t.id === slug);
    // Optimistic update.
    setPracticed((prev) => {
      const next = new Set(prev);
      if (isDone) next.add(slug);
      else next.delete(slug);
      return next;
    });
    setTodayTasks((prev) => prev.map((t) => (t.id === slug ? { ...t, isCompleted: isDone } : t)));
    const key = todayKey();
    setWeekProgress((prev) => {
      const cur = prev[key] ?? { total: todayTasks.length, done: 0 };
      return { ...prev, [key]: { total: Math.max(cur.total, todayTasks.length), done: Math.max(0, cur.done + (isDone ? 1 : -1)) } };
    });
    setStoredCandidateOverlay(slug, isDone ? { status: PRACTICED, readiness: 100 } : { status: "Not Practiced", readiness: 0 });
    if (!task?.taskId) return;
    const doneAfter = doneTopicsRef.current + (isDone ? 1 : -1);
    backendApi
      .toggleDashboardTask(task.taskId, {
        done: isDone,
        today: key,
        readinessScore: totalTopicsRef.current ? Math.round((doneAfter / totalTopicsRef.current) * 100) : 0,
      })
      .then((res) => typeof res.streakDays === "number" && setStreakDays(res.streakDays))
      .catch((err) => console.warn("Could not save task progress:", err));
  };

  const totalTopics = areas.reduce((s, a) => s + a.total, 0);
  const doneTopics = areas.reduce((s, a) => s + a.done, 0);
  const totalTopicsRef = useRef(0);
  const doneTopicsRef = useRef(0);
  useEffect(() => {
    totalTopicsRef.current = totalTopics;
    doneTopicsRef.current = doneTopics;
  }, [totalTopics, doneTopics]);

  return {
    loading: loading && areas.length === 0,
    areas,
    todayTasks,
    practiced,
    setTopicDone,
    doneTodayIds,
    weekProgress,
    streakDays,
    milestone,
    daysRemaining,
    totalTopics,
    doneTopics,
    readiness: totalTopics ? Math.round((doneTopics / totalTopics) * 100) : 0,
    minutesPerDay,
  };
}
