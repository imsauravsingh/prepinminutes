/**
 * PrepInMinutes time-budgeted plan: one calculation shared by the area pages and
 * My Plan, so every screen shows the same numbers.
 *
 *   study time left = weekly hours × (days left − mock/revision days at the end)
 *   area time       = study time left × the area's share of the plan
 *   area share      = plan weights (from plan generation), blended 50/50 with the
 *                     target companies' interview format when one is set
 *
 * Inside an area, topics are ranked for the candidate (company topics that suit
 * their level, then priority for their experience, then difficulty fit, then
 * curriculum order) and split into Must do / If time allows / Skip for now.
 * Stacks the candidate doesn't use (e.g. PHP for a Spring Boot developer) stay
 * out of Must do once they've picked their technologies.
 */

import { evaluateCandidateProfileDomains } from "@/components/dashboard/InteractiveRoadmap";
import { companyAreaShares, type CompanyFocus } from "@/hooks/useCompanyFocus";
import { KEY_TO_SLUG, WEIGHT_TO_SLUG, daysSince, priorityAllowed } from "@/hooks/usePrepDashboard";
import { getPracticeSessionUrl } from "@/lib/practice-router";
import { chosenStackCategory, deprioritisedCategory } from "@/lib/techStack";
import type { CurriculumHierarchyResponse } from "@/types/curriculum";

export type TopicStatus = "done" | "in-progress" | "not-started";
export type Bucket = "must" | "maybe" | "skip";

export type AreaTopic = {
  slug: string;
  title: string;
  /** Curriculum category (topic family) name, e.g. "Scalability & Performance Principles". */
  category: string;
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

export type AreaCategory = { slug: string; name: string; topics: AreaTopic[] };

export type AreaPlan = {
  categories: AreaCategory[];
  /** Every topic, best first (the order Must do topics should be studied in). */
  ranked: AreaTopic[];
  counts: Record<Bucket, number>;
  mustDone: number;
  mustMinutesLeft: number;
  mustMinutesTotal: number;
  next: AreaTopic | null;
  /** Topics a matched target company asks often that suit the candidate's level. */
  companyTopicCount: number;
};

type Row = Record<string, unknown> | null;

/** "If time allows" covers roughly this much extra time beyond the budget. */
const MAYBE_EXTRA = 0.75;
const PRIORITY_RANK: Record<string, number> = { P0: 0, P1: 1, P2: 2 };

export function yearsOf(experience: string) {
  const e = experience.toLowerCase();
  if (e.includes("fresher") || e.includes("student")) return 0;
  return Number(e.match(/\d+/)?.[0] ?? 0);
}

export function levelLabel(years: number) {
  if (years === 0) return "fresher";
  if (years < 3) return "junior engineer";
  if (years < 6) return "mid-level engineer";
  return "senior engineer";
}

/** Difficulty that's a poor fit for this level gets pushed down the ranking. */
export function difficultyPenalty(years: number, difficulty: string) {
  if (years < 3) return difficulty === "ADVANCED" || difficulty === "EXPERT" ? 1 : 0;
  if (years < 6) return difficulty === "EXPERT" ? 1 : 0;
  return 0;
}

/** Plan weights from plan generation, keyed by curriculum area slug. */
export function planWeightsBySlug(plan: Row): Record<string, number> {
  const raw = (plan?.domainWeights ?? {}) as Record<string, number>;
  const out: Record<string, number> = {};
  for (const [k, v] of Object.entries(raw)) {
    const s = WEIGHT_TO_SLUG[k] ?? KEY_TO_SLUG[k];
    if (s) out[s] = (out[s] ?? 0) + Number(v || 0);
  }
  return out;
}

/** The candidate's areas, same rule as the dashboard: plan-weighted areas first, then the role's areas. */
export function candidateAreaSlugs(profile: Row, plan: Row): string[] {
  const weights = planWeightsBySlug(plan);
  const experience = String(profile?.experienceLevel ?? "");
  const isFresher = /0 years|fresher/i.test(experience);
  const role = String(profile?.targetRole ?? plan?.targetRole ?? "");
  const forte = typeof profile?.fresherForte === "string" ? profile.fresherForte : "";
  const companies = Array.isArray(profile?.targetCompanies) ? (profile.targetCompanies as unknown[]) : [];
  let roleKeys: string[] = [];
  if (role) {
    roleKeys = evaluateCandidateProfileDomains({
      targetRole: isFresher && forte ? `${role} • ${forte.split(" (")[0]}` : role,
      experienceLevel: experience || "0-1 years",
      isFresher,
      targetCompany: companies.length ? String(companies[0]) : "",
    }).identifiedKeys;
  }
  const fromRole = roleKeys.map((k) => KEY_TO_SLUG[k]).filter((s): s is string => Boolean(s));
  const all = Array.from(new Set([...Object.keys(weights), ...fromRole]));
  return all.sort((a, b) => (weights[b] ?? 0) - (weights[a] ?? 0) || fromRole.indexOf(a) - fromRole.indexOf(b));
}

/**
 * Each area's share of study time (sums to 1 over `slugs`).
 * Areas the plan didn't weight get half the smallest plan weight, so they still get some time.
 * `company` is each area's share of the matched companies' interviews (empty without company data).
 */
export function areaShares(
  slugs: string[],
  planWeights: Record<string, number>,
  focus: CompanyFocus | null,
): { share: Record<string, number>; company: Record<string, number> } {
  const share: Record<string, number> = {};
  if (!slugs.length) return { share, company: {} };
  const positive = slugs.map((s) => planWeights[s] ?? 0).filter((w) => w > 0);
  const filler = positive.length ? Math.min(...positive) / 2 : 1;
  const base: Record<string, number> = {};
  for (const s of slugs) base[s] = (planWeights[s] ?? 0) > 0 ? planWeights[s] : filler;
  normalise(base);
  const company = focus?.matched.length ? companyAreaShares(focus, slugs) : {};
  for (const s of slugs) share[s] = company[s] === undefined ? base[s] : 0.5 * base[s] + 0.5 * company[s];
  normalise(share);
  return { share, company };
}

function normalise(m: Record<string, number>) {
  const total = Object.values(m).reduce((a, b) => a + b, 0);
  if (total > 0) for (const k of Object.keys(m)) m[k] = m[k] / total;
}

/** Days kept free at the end for mocks and revision (no new topics). */
export function reserveDaysFor(daysRemaining: number) {
  return daysRemaining >= 10 ? 3 : daysRemaining >= 5 ? 1 : 0;
}

/**
 * Days left, weekly hours and the study minutes left for new topics
 * (null without a timeline or hours). The last few days are kept for mocks and revision.
 */
export function planTiming(profile: Row, plan: Row) {
  const totalWeeks = Number(plan?.timelineWeeks ?? profile?.timelineWeeks ?? 0) || 0;
  const elapsedDays = daysSince(plan?.createdAt);
  const daysRemaining = totalWeeks ? Math.max(0, totalWeeks * 7 - elapsedDays) : null;
  const reserveDays = daysRemaining !== null ? reserveDaysFor(daysRemaining) : 0;
  const studyDays = daysRemaining !== null ? Math.max(0, daysRemaining - reserveDays) : 0;
  const weeklyHours = Number(profile?.weeklyGoalHours ?? 0) || 0;
  const totalMinutes =
    daysRemaining !== null && weeklyHours > 0 ? Math.round((weeklyHours * 60 * studyDays) / 7) : null;
  return { totalWeeks, elapsedDays, daysRemaining, reserveDays, studyDays, weeklyHours, totalMinutes };
}

/** Rank one area's topics for the candidate and split them by the area's study time. */
export function buildAreaPlan({
  slug,
  hierarchy,
  experience,
  practiced,
  progress,
  minutesAvailable,
  focus,
  technologies = [],
}: {
  slug: string;
  hierarchy: CurriculumHierarchyResponse;
  experience: string;
  practiced: Set<string>;
  /** Practice status and score per topic slug, from the database. */
  progress: Record<string, { status: string; score: number | null }>;
  minutesAvailable: number | null;
  focus: CompanyFocus | null;
  /** Technologies from setup; categories of stacks they don't use drop out of Must do. */
  technologies?: string[];
}): AreaPlan {
  const otherStack = deprioritisedCategory(technologies);
  const ownStack = chosenStackCategory(technologies);
  const allowed = priorityAllowed(experience);
  const years = yearsOf(experience);
  const matched = focus?.matched.length ? focus : null;

  type Raw = AreaTopic & { order: number; eligible: boolean; penalty: number; boost: number; stack: boolean };
  const cats = hierarchy.categories.slice().sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  let order = 0;
  const raw: Raw[] = cats.flatMap((c) =>
    c.topics.map((t) => {
      const priority = String(t.priority);
      const ov = progress[t.slug];
      const done = practiced.has(t.slug) || ov?.status === "PRACTICED" || ov?.status === "MASTERED";
      const penalty = difficultyPenalty(years, String(t.difficulty ?? ""));
      const asked = matched?.topics[t.slug];
      // Company topics are boosted only when they suit the candidate's level.
      const boost = asked && penalty === 0 ? asked.frequency : 0;
      return {
        slug: t.slug,
        title: t.title,
        category: c.name,
        durationMin: Number(t.durationMin) || 15,
        priority,
        difficulty: String(t.difficulty ?? ""),
        href: t.practiceHref || getPracticeSessionUrl(slug, t.slug),
        bucket: "skip" as Bucket,
        status: (done ? "done" : ov ? "in-progress" : "not-started") as TopicStatus,
        score: ov?.score ?? null,
        companies: asked ? asked.companies : null,
        order: order++,
        eligible: !otherStack(c.name) && (allowed(priority) || boost > 0),
        stack: ownStack(c.name),
        penalty,
        boost,
      };
    }),
  );

  const rankedRaw = raw
    .slice()
    .sort(
      (a, b) =>
        Number(!a.eligible) - Number(!b.eligible) ||
        b.boost - a.boost ||
        (PRIORITY_RANK[a.priority] ?? 3) - (PRIORITY_RANK[b.priority] ?? 3) ||
        // At equal priority, the candidate's own stack (e.g. Spring Boot → Java & JVM) comes first.
        Number(b.stack) - Number(a.stack) ||
        a.penalty - b.penalty ||
        a.order - b.order,
    );

  // Finished topics always count as Must do (time already spent); the rest fill the budget in rank order.
  let left = minutesAvailable ?? Infinity;
  let maybeLeft = minutesAvailable !== null ? minutesAvailable * MAYBE_EXTRA : 0;
  for (const t of rankedRaw) {
    if (t.status === "done") t.bucket = "must";
    else if (minutesAvailable === null) t.bucket = t.eligible ? "must" : "skip";
    else if (t.eligible && t.durationMin <= left) {
      t.bucket = "must";
      left -= t.durationMin;
    } else if (t.durationMin <= maybeLeft) {
      t.bucket = "maybe";
      maybeLeft -= t.durationMin;
    } else t.bucket = "skip";
  }

  const strip = (r: Raw): AreaTopic => ({
    slug: r.slug,
    title: r.title,
    category: r.category,
    durationMin: r.durationMin,
    priority: r.priority,
    difficulty: r.difficulty,
    href: r.href,
    bucket: r.bucket,
    status: r.status,
    score: r.score,
    companies: r.companies,
  });
  const bySlug = new Map(raw.map((r) => [r.slug, strip(r)]));
  const ranked = rankedRaw.map((r) => bySlug.get(r.slug)!);
  const categories: AreaCategory[] = cats
    .map((c) => ({ slug: c.slug, name: c.name, topics: c.topics.map((t) => bySlug.get(t.slug)!).filter(Boolean) }))
    .filter((c) => c.topics.length > 0);

  const must = ranked.filter((t) => t.bucket === "must");
  const mustLeft = must.filter((t) => t.status !== "done");
  return {
    categories,
    ranked,
    counts: {
      must: must.length,
      maybe: ranked.filter((t) => t.bucket === "maybe").length,
      skip: ranked.filter((t) => t.bucket === "skip").length,
    },
    mustDone: must.length - mustLeft.length,
    mustMinutesLeft: mustLeft.reduce((s, t) => s + t.durationMin, 0),
    mustMinutesTotal: must.reduce((s, t) => s + t.durationMin, 0),
    next: mustLeft.find((t) => t.status === "in-progress") ?? mustLeft[0] ?? null,
    companyTopicCount: raw.filter((r) => r.boost > 0).length,
  };
}
