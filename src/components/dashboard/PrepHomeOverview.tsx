"use client";

import { useEffect, useState, type ComponentType } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BarChart3,
  CalendarCheck2,
  CalendarDays,
  Check,
  Clock,
  Code2,
  Info,
  Pencil,
  Play,
  Target,
  Trophy,
} from "lucide-react";

type IconType = ComponentType<{ className?: string }>;

export type PrepArea = {
  name: string;
  progress: number;
  remaining: string;
  color: string;
  bg: string;
  border: string;
  iconColor: string;
  icon: IconType;
  /** Real-data extras (curriculum area). */
  slug?: string;
  description?: string;
  href?: string;
};

export type TodayActivity = {
  title: string;
  subtitle: string;
  duration: string;
  href: string;
  icon: IconType;
  badge: string;
  /** Topic slug when the task comes from the curriculum. */
  id?: string;
};

type Props = {
  displayRole: string;
  displayTimeline: string;
  daysRemaining: number;
  progressPercent: number;
  completedTopics: number;
  totalTopics: number;
  areas: PrepArea[];
  today: TodayActivity[];
  targetCompany: string;
  onEditSetup?: () => void;
  /** Reset now lives in the setup form; kept so callers don't break. */
  onReset?: () => void;
  /** Called when a task is ticked or unticked (marks the topic practiced). */
  onTaskToggle?: (id: string, done: boolean) => void;
  /** This week's plan milestone, if the plan has one. */
  milestone?: { weekNumber: number; totalWeeks: number; title: string } | null;
  /** True while the curriculum is still loading. */
  loading?: boolean;
  /** Saved progress: today's finished task ids and per-day totals for this week. */
  doneTodayIds?: string[];
  weekProgress?: Record<string, { total: number; done: number }>;
};

// Bump the version whenever the artwork changes so browsers fetch the new file.
/** Neutral study-desk illustration, the same for every candidate. */
const HERO_SRC = "/images/dashboard/prep-hero-desk.webp?v=1";
const DONE_KEY = "pim_today_done"; // { [yyyy-mm-dd]: string[] } of finished task titles

function dateKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function readDone(): Record<string, string[]> {
  try {
    return JSON.parse(localStorage.getItem(DONE_KEY) || "{}");
  } catch {
    return {};
  }
}

/** Topic icons matched by keywords in the area name: 3D renders, with flat SVGs where no render exists yet. */
const AREA_ICONS: [RegExp, string][] = [
  [/cloud|kubernetes|ci\/cd|devops|infrastructure/i, "3d/cloud.webp"],
  [/system design|architecture|microservice/i, "3d/system-design.webp"],
  [/coding|algorithm|dsa/i, "3d/dsa.webp"],
  [/node|api|backend/i, "3d/nodejs.webp"],
  [/react|frontend|typescript/i, "3d/react.webp"],
  [/javascript/i, "3d/javascript.webp"],
  [/sql|database|data|python/i, "3d/databases.webp"],
  [/behavioral|leadership|communication|collaboration/i, "3d/behavioral.webp"],
];
const SLUG_ICONS: Record<string, string> = {
  "system-design": "3d/system-design.webp",
  "ai-system-design": "3d/system-design.webp",
  "low-level-design": "3d/javascript.webp",
  dsa: "3d/dsa.webp",
  "backend-engineering": "3d/nodejs.webp",
  "frontend-engineering": "3d/react.webp",
  "cloud-devops": "3d/cloud.webp",
  "behavioral-leadership": "3d/behavioral.webp",
  "data-engineering": "3d/databases.webp",
  "mobile-engineering": "3d/react.webp",
};
function areaIcon(name: string) {
  if (SLUG_ICONS[name]) return `/icons/dashboard/${SLUG_ICONS[name]}`;
  const hit = AREA_ICONS.find(([re]) => re.test(name));
  return hit ? `/icons/dashboard/${hit[1]}` : null;
}

/** One-line description per prep area, matched by keywords in its name. */
const AREA_BLURBS: [RegExp, string][] = [
  [/cloud|kubernetes|ci\/cd|devops|infrastructure/i, "Deploy, scale and run reliable cloud systems."],
  [/system design|architecture|microservice/i, "Design scalable, reliable, real-world systems."],
  [/coding|algorithm|dsa/i, "Master core data structures and algorithms."],
  [/node|api|backend/i, "Build scalable and efficient backend services."],
  [/react|frontend|typescript/i, "Build fast, scalable and maintainable UIs."],
  [/javascript/i, "Strengthen your core JS and modern ES features."],
  [/sql|database|data|python/i, "Learn data modeling, SQL and analysis."],
  [/behavioral|leadership|communication|collaboration/i, "Tell clear, confident stories about your impact."],
];
const areaBlurb = (name: string) => AREA_BLURBS.find(([re]) => re.test(name))?.[1] ?? "Core topics for your target role.";

/** Shared type styles so every card reads the same. */
const cardTitle = "flex items-center gap-2 font-display text-lg font-extrabold leading-tight text-ink";
const cardSub = "text-[13px] leading-snug text-ink-muted";

const WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/** Monday-first dates of the current week. */
function currentWeek() {
  const now = new Date();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  return WEEK.map((_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

const card = "rounded-3xl border border-[#f0e8de] bg-white shadow-[0_8px_24px_rgba(64,38,25,0.06)]";

/** Half-circle gauge, red to green, for interview readiness. */
function ReadinessGauge({ value }: { value: number }) {
  const r = 80;
  const len = Math.PI * r;
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className="relative mx-auto w-full max-w-[230px]">
      <svg viewBox="0 0 200 112" className="w-full" aria-hidden="true">
        <defs>
          <linearGradient id="gauge-grad" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="35%" stopColor="#f97316" />
            <stop offset="65%" stopColor="#facc15" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>
        <path d="M20 100 A80 80 0 0 1 180 100" fill="none" stroke="#f1ece4" strokeWidth="16" strokeLinecap="round" />
        <path
          d="M20 100 A80 80 0 0 1 180 100"
          fill="none"
          stroke="url(#gauge-grad)"
          strokeWidth="16"
          strokeLinecap="round"
          strokeDasharray={len}
          strokeDashoffset={len - (len * v) / 100}
          style={{ transition: "stroke-dashoffset 900ms cubic-bezier(0.22,1,0.36,1)" }}
        />
      </svg>
      <div className="absolute inset-x-0 bottom-0 flex flex-col items-center">
        <span className="font-display text-4xl font-black text-ink">{v}%</span>
        <span className="text-sm text-ink-muted">Ready</span>
      </div>
    </div>
  );
}


/**
 * Top of the "Start preparing" dashboard: hero with the next task, the
 * candidate's prep areas, and a side rail with readiness, today's checklist,
 * countdown and profile actions.
 */
export function PrepHomeOverview({
  displayTimeline,
  daysRemaining,
  progressPercent,
  completedTopics,
  totalTopics,
  areas,
  today,
  targetCompany,
  onEditSetup,
  onTaskToggle,
  milestone,
  loading,
  doneTodayIds,
  weekProgress,
}: Props) {
  const router = useRouter();
  // The full topic list lives on the My Plan page.
  const goToPlan = () => router.push("/preparation-plan");
  const todayKey = dateKey(new Date());
  const [showCharacter, setShowCharacter] = useState(true);

  // Ticked tasks live in this browser until progress tracking reaches the backend.
  const [done, setDone] = useState<Record<string, string[]>>({});
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- read browser storage after hydration
    setDone(readDone());
  }, []);

  // Saved progress (database) takes over from the browser copy once it arrives.
  const doneTodayKey = (doneTodayIds ?? []).join(",");
  useEffect(() => {
    if (!doneTodayIds) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- adopt saved ticks for today
    setDone((prev) => ({ ...prev, [todayKey]: doneTodayIds }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doneTodayKey, todayKey]);
  const doneToday = done[todayKey] ?? [];
  const taskKey = (t: TodayActivity) => t.id ?? t.title;
  const toggle = (title: string) => {
    const nowDone = !(done[todayKey] ?? []).includes(title);
    onTaskToggle?.(title, nowDone);
    setDone((prev) => {
      const list = prev[todayKey] ?? [];
      const nextList = list.includes(title) ? list.filter((t) => t !== title) : [...list, title];
      const next = { ...prev, [todayKey]: nextList };
      try {
        localStorage.setItem(DONE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const total = today.length;
  const finished = today.filter((t) => doneToday.includes(taskKey(t))).length;
  // This week: green = all of the day's tasks done, yellow = some, white = none yet.
  const week = currentWeek().map((d, i) => {
    const key = dateKey(d);
    const saved = weekProgress?.[key];
    const isTodayKey = key === todayKey;
    const count = isTodayKey || !saved ? (done[key] ?? []).length : saved.done;
    const dayTotal = isTodayKey || !saved ? total : saved.total;
    const status = dayTotal > 0 && count >= dayTotal ? "full" : count > 0 ? "partial" : "none";
    return { key, label: WEEK[i], day: d.getDate(), status, isToday: key === todayKey, isFuture: key > todayKey };
  });
  const fullDays = week.filter((d) => d.status === "full").length;
  const nextTask = today.find((t) => !doneToday.includes(taskKey(t))) ?? today[0];

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
      {/* ---------- Left: hero + prep areas ---------- */}
      <div className="flex min-w-0 flex-col gap-8">
        <section className="rise-in relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#fff1e8] via-[#fffaf6] to-[#fdf7f2] p-6 sm:p-7">
          <div aria-hidden="true" className="pointer-events-none absolute -left-10 top-6 size-64 rounded-full bg-[#ffd9c7]/60 blur-2xl" />
          {showCharacter && (
            // Background layer: sits behind the content, anchored bottom-left.
            // Hidden if the artwork is missing, so the hero never shows a broken image.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={HERO_SRC}
              alt=""
              aria-hidden="true"
              onError={() => setShowCharacter(false)}
              className="pointer-events-none absolute bottom-0 left-0 hidden h-[92%] max-h-[300px] w-auto select-none drop-shadow-[0_18px_24px_rgba(64,38,25,0.16)] xl:block 2xl:max-h-[370px]"
            />
          )}
          <div className={`relative flex min-h-[260px] flex-col justify-center gap-5 ${showCharacter ? "xl:pl-[300px] 2xl:pl-[380px]" : ""}`}>
            <h1 className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-[52px]">
              Your interview prep
              <br />
              <span className="relative inline-block text-brand">
                starts here
                <svg aria-hidden="true" viewBox="0 0 200 12" className="absolute -bottom-2 left-[18%] w-[64%]" preserveAspectRatio="none">
                  <path d="M2 9 Q100 1 198 7" stroke="currentColor" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                </svg>
              </span>
            </h1>
            <p className="text-base leading-relaxed text-ink sm:text-[17px]">
              Structured learning, hands-on practice, and real interview experience — all in one place.
            </p>

            {/* Countdown · Target company · Start learning · Edit setup */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
              <div className="flex flex-col items-center gap-1 text-center">
                <span className="flex items-center gap-1.5 font-display text-sm font-extrabold text-ink">
                  <CalendarDays className="size-4 text-brand" aria-hidden="true" /> Countdown
                </span>
                <span className="font-display text-2xl font-black text-ink" title={`${displayTimeline} plan`}>
                  {daysRemaining} Days
                </span>
              </div>
              {targetCompany && (
                <>
                <span aria-hidden="true" className="hidden h-12 w-px bg-[#eadfd3] sm:block" />
                <div className="flex min-w-0 flex-col items-center gap-1 text-center">
                  <span className="flex items-center gap-1.5 font-display text-sm font-extrabold text-ink">
                    <Target className="size-4 text-brand" aria-hidden="true" /> Target Company
                  </span>
                  <span className="max-w-[180px] truncate font-display text-2xl font-black text-ink" title={targetCompany}>
                    {targetCompany}
                  </span>
                </div>
                </>
              )}
              <span aria-hidden="true" className="hidden h-12 w-px bg-[#eadfd3] sm:block" />
              <div className="flex items-center gap-3">
                <Link
                  href="/preparation-plan"
                  className="inline-flex items-center gap-3 whitespace-nowrap rounded-full bg-brand py-3 pl-3 pr-7 text-base font-bold text-white shadow-[0_12px_24px_rgba(255,108,71,0.35)] transition-transform hover:-translate-y-0.5 sm:text-lg"
                >
                  <span className="flex size-9 items-center justify-center rounded-full bg-white/20">
                    <Play className="size-4 fill-white" aria-hidden="true" />
                  </span>
                  Start Learning
                  <ArrowRight className="size-5" aria-hidden="true" />
                </Link>
                {onEditSetup && (
                  <button
                    type="button"
                    onClick={onEditSetup}
                    aria-label="Edit your setup"
                    title="Edit your setup"
                    className="flex size-14 shrink-0 items-center justify-center rounded-full border-[1.5px] border-brand/50 bg-white text-brand transition-colors hover:bg-[#fff1ec] cursor-pointer"
                  >
                    <Pencil className="size-5" aria-hidden="true" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-3 px-1">
            <h2 className="font-display text-xl font-extrabold text-ink sm:text-2xl">Continue Your Preparation</h2>
            <button
              type="button"
              onClick={goToPlan}
              className="inline-flex items-center gap-1 text-sm font-semibold text-brand hover:underline cursor-pointer"
            >
              View All Topics <ArrowRight className="size-4" aria-hidden="true" />
            </button>
          </div>
          {areas.length === 0 && (
            <p className={`${card} p-6 text-sm text-ink-muted`}>
              {loading
                ? "Loading your preparation areas…"
                : "We couldn't load your topics right now. Please refresh the page in a moment."}
            </p>
          )}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {areas.map((a) => {
              const Icon = a.icon;
              return (
                <article
                  key={a.name}
                  className={`${card} group flex gap-4 p-4 transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(64,38,25,0.1)]`}
                >
                  <div className={`flex size-[92px] shrink-0 items-center justify-center rounded-[22px] border ${a.border} ${a.bg}`}>
                    {areaIcon(a.slug ?? a.name) ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={areaIcon(a.slug ?? a.name)!}
                        alt=""
                        aria-hidden="true"
                        className={`transition-transform group-hover:scale-110 ${areaIcon(a.slug ?? a.name)!.endsWith(".svg") ? "size-12" : "size-[76px] drop-shadow-[0_8px_10px_rgba(64,38,25,0.15)]"}`}
                      />
                    ) : (
                      <Icon className={`size-11 ${a.iconColor} transition-transform group-hover:scale-110`} />
                    )}
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                    <h3 className={cardTitle}>{a.name}</h3>
                    <p className={`line-clamp-2 ${cardSub}`}>{a.description || areaBlurb(a.name)}</p>
                    <div className="mt-1 flex items-center gap-2" title={a.remaining}>
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#eceae6]">
                        <div className="h-full rounded-full bg-emerald-500" style={{ width: `${a.progress}%` }} />
                      </div>
                      <span className="text-xs font-bold text-ink">{a.progress}%</span>
                    </div>
                    <p className="text-[11px] font-medium text-ink-muted">{a.remaining}</p>
                    <Link
                      href={a.href ?? "/practice"}
                      className="mt-1.5 inline-flex w-fit items-center gap-1 whitespace-nowrap rounded-full bg-[#fff1ec] px-4 py-2 text-[13px] font-semibold text-brand transition-colors hover:bg-brand hover:text-white"
                    >
                      {a.progress > 0 ? "Continue Learning" : "Start Learning"} <ArrowRight className="size-3.5" aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>
      {/* ---------- Right rail: readiness, this week, next up, today ---------- */}
      <aside className="flex flex-col gap-5">
        <section className={`${card} p-5`}>
          <div className="flex items-center justify-between gap-2">
            <h2 className={cardTitle}>
              <Target className="size-5 text-brand" aria-hidden="true" /> Interview Readiness
              <span title="Share of your roadmap topics you've completed">
                <Info className="size-4 text-ink-muted" aria-hidden="true" />
              </span>
            </h2>
            <button
              type="button"
              onClick={goToPlan}
              title="Topics completed — view your plan"
              className="rounded-full bg-[#fff1ec] px-2.5 py-0.5 text-sm font-bold text-brand cursor-pointer hover:bg-brand hover:text-white"
            >
              {completedTopics}/{totalTopics}
            </button>
          </div>
          <p className={`mt-1 ${cardSub}`}>How much of your roadmap you&apos;ve covered.</p>
          <div className="mt-3">
            <ReadinessGauge value={progressPercent} />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {[
              { icon: Trophy, value: totalTopics, label: "Topics", tone: "text-emerald-500" },
              { icon: Code2, value: completedTopics, label: "Practices", tone: "text-blue-600" },
              { icon: BarChart3, value: 0, label: "Mocks", tone: "text-purple-500" },
            ].map((s) => (
              <div key={s.label} className="flex flex-col items-center gap-0.5 rounded-2xl bg-[#fbf9f6] py-3 shadow-[inset_0_0_0_1px_#f1ebe3]">
                <s.icon className={`size-5 ${s.tone}`} aria-hidden="true" />
                <span className="mt-1 font-display text-xl font-black text-ink">{s.value}</span>
                <span className="text-[11px] text-ink-muted">{s.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className={`${card} p-5`}>
          <div className="flex items-center justify-between gap-2">
            <h2 className={cardTitle}>
              <CalendarCheck2 className="size-5 text-brand" aria-hidden="true" /> This Week
            </h2>
            <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-600">
              {fullDays}/7 Days
            </span>
          </div>
          <p className={`mt-1 ${cardSub}`}>
            {milestone ? (
              <>
                <span className="font-semibold text-ink">
                  Week {milestone.weekNumber} of {milestone.totalWeeks}:
                </span>{" "}
                {milestone.title}
              </>
            ) : (
              "Finish every task in a day to turn it green."
            )}
          </p>
          <ol className="mt-4 grid grid-cols-7 gap-1.5">
            {week.map((d) => (
              <li key={d.key} className="flex flex-col items-center gap-1.5">
                <span className={`text-[11px] ${d.isToday ? "font-bold text-ink" : "text-ink-muted"}`}>{d.label}</span>
                <span
                  title={
                    d.status === "full" ? "All tasks done" : d.status === "partial" ? "Some tasks done" : d.isFuture ? "Upcoming" : "No tasks done"
                  }
                  className={`flex size-9 items-center justify-center rounded-xl border-2 text-xs font-bold ${
                    d.status === "full"
                      ? "border-emerald-500 bg-emerald-500 text-white"
                      : d.status === "partial"
                        ? "border-amber-400 bg-amber-300 text-amber-900"
                        : "border-[#e8e1d7] bg-white text-ink-muted"
                  } ${d.isToday ? "ring-2 ring-brand/40 ring-offset-2" : ""}`}
                >
                  {d.status === "full" ? <Check className="size-4" strokeWidth={3} aria-hidden="true" /> : d.day}
                </span>
              </li>
            ))}
          </ol>
          <div className="mt-3 flex items-center gap-3 text-[11px] text-ink-muted">
            <span className="flex items-center gap-1"><span className="size-2.5 rounded-sm bg-emerald-500" /> Done</span>
            <span className="flex items-center gap-1"><span className="size-2.5 rounded-sm bg-amber-300" /> Partial</span>
            <span className="flex items-center gap-1"><span className="size-2.5 rounded-sm border border-[#e8e1d7] bg-white" /> Not yet</span>
          </div>
        </section>

        {/* Next up: the first unfinished task of today */}
            {nextTask && (
              <div className={`${card} overflow-hidden`}>
                <div className="bg-gradient-to-br from-[#eef5ff] to-[#f7faff] p-5">
                  <h2 className={cardTitle}>
                    <Target className="size-5 text-brand" aria-hidden="true" /> Next Up for You
                  </h2>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="font-display text-base font-extrabold leading-snug text-ink">{nextTask.title}</p>
                      <p className={`mt-1 line-clamp-2 ${cardSub}`}>{nextTask.subtitle}</p>
                    </div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/icons/dashboard/3d/next-up-server.webp"
                      alt=""
                      aria-hidden="true"
                      className="size-20 shrink-0 drop-shadow-[0_10px_14px_rgba(59,130,246,0.25)]"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between gap-3 px-5 py-3.5">
                  <span className="flex items-center gap-1.5 text-sm font-semibold text-ink">
                    <Clock className="size-4 text-ink-muted" aria-hidden="true" /> {nextTask.duration}
                  </span>
                  <Link
                    href={nextTask.href}
                    className="inline-flex items-center gap-1 rounded-full bg-[#fff1ec] px-4 py-2 text-sm font-bold text-brand shadow-2xs transition-colors hover:bg-brand hover:text-white"
                  >
                    Start Now <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            )}

        <section className={`${card} p-5`}>
          <div className="flex items-center justify-between gap-2">
            <h2 className={cardTitle}>
              <CalendarDays className="size-5 text-brand" aria-hidden="true" /> Daily Preparation
            </h2>
            <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-600">
              {finished}/{total} Today
            </span>
          </div>
          <p className={`mt-1 ${cardSub}`}>Small steps today keep your streak going.</p>
          <ul className="mt-2 flex flex-col">
            {today.map((t) => {
              const checked = doneToday.includes(taskKey(t));
              return (
                <li key={taskKey(t)} className="flex items-center gap-3 py-2">
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={checked}
                    aria-label={`Mark "${t.title}" done`}
                    onClick={() => toggle(taskKey(t))}
                    className={`flex size-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors cursor-pointer ${
                      checked ? "border-emerald-500 bg-emerald-500 text-white" : "border-[#d6cfc4] hover:border-emerald-400"
                    }`}
                  >
                    {checked && <Check className="size-3.5" strokeWidth={3} aria-hidden="true" />}
                  </button>
                  <Link
                    href={t.href}
                    title={t.title}
                    className={`min-w-0 flex-1 truncate text-sm hover:text-brand ${checked ? "text-ink-muted" : "font-medium text-ink"}`}
                  >
                    {t.title}
                  </Link>
                  <span className="shrink-0 text-xs text-ink-muted">({t.duration})</span>
                </li>
              );
            })}
          </ul>
        </section>
      </aside>
    </div>
  );
}
