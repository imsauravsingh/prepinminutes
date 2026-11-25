/**
 * What PrepInMinutes keeps in the browser to open pages instantly.
 *
 * The database is the source of truth: every change (setup, ticks, profile) is
 * saved through the API first. The browser only keeps a small, non-sensitive
 * snapshot of what's needed to draw My Focus and My Plan before the fresh data
 * arrives, so pages open smoothly:
 *   - kept:   role, experience, timeline, weekly hours, target companies,
 *             technologies, coding language, plan weights/milestones, and which
 *             topics are done (slugs and dates)
 *   - never:  resume file name or link, job description text, names, emails,
 *             tokens, internal IDs, or anything else from the profile
 * Snapshots expire after 7 days and are removed on sign-out (pim_ keys), and
 * when another candidate signs in on the same browser.
 */

const MAX_AGE_MS = 7 * 86_400_000;

type Row = Record<string, unknown> | null | undefined;

/** Only the profile fields the plan needs. */
export function safeProfile(p: Row): Record<string, unknown> | null {
  if (!p) return null;
  return {
    targetRole: p.targetRole ?? null,
    experienceLevel: p.experienceLevel ?? null,
    timelineWeeks: p.timelineWeeks ?? null,
    timelineLabel: p.timelineLabel ?? null,
    weeklyGoalHours: p.weeklyGoalHours ?? null,
    targetCompanies: Array.isArray(p.targetCompanies) ? p.targetCompanies : [],
    languages: Array.isArray(p.languages) ? p.languages : [],
    codingLanguage: p.codingLanguage ?? null,
    isOnboardingDone: p.isOnboardingDone ?? null,
  };
}

/** Only the plan fields the plan view needs. */
export function safePlan(p: Row): Record<string, unknown> | null {
  if (!p) return null;
  const milestones = Array.isArray(p.weeklyMilestones) ? (p.weeklyMilestones as Record<string, unknown>[]) : [];
  return {
    targetRole: p.targetRole ?? null,
    timelineWeeks: p.timelineWeeks ?? null,
    createdAt: p.createdAt ?? null,
    domainWeights: p.domainWeights ?? {},
    weeklyMilestones: milestones.map((m) => ({ weekNumber: m.weekNumber, title: m.title, focusDomain: m.focusDomain })),
  };
}

export function writeSnapshot<T>(key: string, data: T) {
  try {
    localStorage.setItem(key, JSON.stringify({ savedAt: Date.now(), data }));
  } catch {}
}

/** The snapshot if it exists and isn't older than 7 days (older ones are removed). */
export function readSnapshot<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { savedAt?: number; data?: T };
    if (!parsed?.savedAt || Date.now() - parsed.savedAt > MAX_AGE_MS || parsed.data === undefined) {
      localStorage.removeItem(key);
      return null;
    }
    return parsed.data;
  } catch {
    return null;
  }
}
