"use client";

import { useEffect, useState, type ComponentType } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CalendarDays,
  Check,
  Clock,
  Code2,
  Info,
  Pencil,
  Play,
  RotateCcw,
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
};

export type TodayActivity = {
  title: string;
  subtitle: string;
  duration: string;
  href: string;
  icon: IconType;
  badge: string;
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
  onReset: () => void;
};

/** Transparent illustration of the candidate at a laptop. */
// Bump the version whenever the artwork changes so browsers fetch the new file.
const CHARACTER_SRC = "/images/dashboard/prep-hero-character.webp?v=2";
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
function areaIcon(name: string) {
  const hit = AREA_ICONS.find(([re]) => re.test(name));
  return hit ? `/icons/dashboard/${hit[1]}` : null;
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

const scrollToRoadmap = () =>
  document.getElementById("roadmap-curriculum-tree")?.scrollIntoView({ behavior: "smooth" });

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
  onReset,
}: Props) {
  const todayKey = dateKey(new Date());
  const [showCharacter, setShowCharacter] = useState(true);

  // Ticked tasks live in this browser until progress tracking reaches the backend.
  const [done, setDone] = useState<Record<string, string[]>>({});
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- read browser storage after hydration
    setDone(readDone());
  }, []);

  const doneToday = done[todayKey] ?? [];
  const toggle = (title: string) => {
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
  const finished = today.filter((t) => doneToday.includes(t.title)).length;
  const nextTask = today.find((t) => !doneToday.includes(t.title)) ?? today[0];

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
      {/* ---------- Left: hero + prep areas ---------- */}
      <div className="flex min-w-0 flex-col gap-8">
        <section className="rise-in relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#fff1e8] via-[#fffaf6] to-[#fdf7f2] p-6 sm:p-7">
          <div aria-hidden="true" className="pointer-events-none absolute -left-10 top-6 size-64 rounded-full bg-[#ffd9c7]/60 blur-2xl" />
          <div
            className={`relative grid grid-cols-1 items-center gap-6 lg:grid-cols-[minmax(0,1fr)_300px] ${
              showCharacter ? "xl:grid-cols-[170px_minmax(0,1fr)_270px] 2xl:grid-cols-[230px_minmax(0,1fr)_300px]" : ""
            }`}
          >
            {showCharacter && (
              // Hidden if the artwork is missing, so the hero never shows a broken image.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={CHARACTER_SRC}
                alt=""
                aria-hidden="true"
                onError={() => setShowCharacter(false)}
                className="hero-character hidden w-full max-w-[240px] select-none drop-shadow-[0_18px_24px_rgba(64,38,25,0.18)] xl:block"
              />
            )}

            <div className="flex flex-col gap-4">
              <h1 className="font-display text-3xl font-extrabold leading-[1.1] tracking-tight text-ink sm:text-[40px]">
                Your interview prep
                <br />
                <span className="relative inline-block text-brand">
                  starts here
                  <svg aria-hidden="true" viewBox="0 0 200 12" className="absolute -bottom-2 left-[30%] w-[70%]" preserveAspectRatio="none">
                    <path d="M2 9 Q100 1 198 7" stroke="currentColor" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                  </svg>
                </span>
              </h1>
              <p className="max-w-md text-[15px] leading-relaxed text-ink-muted">
                Structured learning, hands-on practice, and real interview experience — all in one place.
              </p>
              <Link
                href="/preparation-plan"
                className="inline-flex w-fit items-center gap-3 whitespace-nowrap rounded-full bg-brand py-3 pl-3 pr-6 text-[15px] font-bold text-white shadow-[0_12px_24px_rgba(255,108,71,0.35)] transition-transform hover:-translate-y-0.5"
              >
                <span className="flex size-7 items-center justify-center rounded-full bg-white/20">
                  <Play className="size-3.5 fill-white" aria-hidden="true" />
                </span>
                Start Learning
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>

            {/* Next up: the first unfinished task of today */}
            {nextTask && (
              <div className={`${card} overflow-hidden`}>
                <div className="bg-gradient-to-br from-[#eef5ff] to-[#f7faff] p-5">
                  <p className="flex items-center gap-2 font-display text-[15px] font-bold text-ink">
                    <Target className="size-5 text-brand" aria-hidden="true" /> Next Up for You
                  </p>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="font-display text-base font-extrabold leading-snug text-ink">{nextTask.title}</p>
                      <p className="mt-1 line-clamp-2 text-xs text-ink-muted">{nextTask.subtitle}</p>
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
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-3 px-1">
            <h2 className="font-display text-xl font-extrabold text-ink sm:text-2xl">Continue Your Preparation</h2>
            <button
              type="button"
              onClick={scrollToRoadmap}
              className="inline-flex items-center gap-1 text-sm font-semibold text-brand hover:underline cursor-pointer"
            >
              View All Topics <ArrowRight className="size-4" aria-hidden="true" />
            </button>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-3">
            {areas.map((a) => {
              const Icon = a.icon;
              return (
                <article
                  key={a.name}
                  className={`${card} group flex gap-4 p-4 transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(64,38,25,0.1)]`}
                >
                  <div className={`flex size-[92px] shrink-0 items-center justify-center rounded-[22px] border ${a.border} ${a.bg}`}>
                    {areaIcon(a.name) ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={areaIcon(a.name)!}
                        alt=""
                        aria-hidden="true"
                        className={`transition-transform group-hover:scale-110 ${areaIcon(a.name)!.endsWith(".svg") ? "size-12" : "size-[76px] drop-shadow-[0_8px_10px_rgba(64,38,25,0.15)]"}`}
                      />
                    ) : (
                      <Icon className={`size-11 ${a.iconColor} transition-transform group-hover:scale-110`} />
                    )}
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                    <h3 className="font-display text-lg font-extrabold leading-tight text-ink">{a.name}</h3>
                    <p className="text-[13px] text-ink-muted">{a.remaining}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#eceae6]">
                        <div className="h-full rounded-full bg-emerald-500" style={{ width: `${a.progress}%` }} />
                      </div>
                      <span className="text-xs font-bold text-ink">{a.progress}%</span>
                    </div>
                    <Link
                      href="/practice"
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

      {/* ---------- Right rail ---------- */}
      <aside className="flex flex-col gap-5">
        <section className={`${card} p-5`}>
          <div className="flex items-center justify-between gap-2">
            <h2 className="flex items-center gap-2 font-display text-lg font-extrabold text-ink">
              <Target className="size-5 text-brand" aria-hidden="true" /> Interview Readiness
              <span title="Share of your roadmap topics you've completed">
                <Info className="size-4 text-ink-muted" aria-hidden="true" />
              </span>
            </h2>
            <button
              type="button"
              onClick={scrollToRoadmap}
              title="Topics completed — view the roadmap"
              className="rounded-full bg-[#fff1ec] px-2.5 py-0.5 text-sm font-bold text-brand cursor-pointer hover:bg-brand hover:text-white"
            >
              {completedTopics}/{totalTopics}
            </button>
          </div>
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
            <h2 className="flex items-center gap-2 font-display text-lg font-extrabold text-ink">
              <CalendarDays className="size-5 text-brand" aria-hidden="true" /> Daily Preparation
            </h2>
            <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-600">
              {finished}/{total} Today
            </span>
          </div>
          <ul className="mt-3 flex flex-col">
            {today.map((t) => {
              const checked = doneToday.includes(t.title);
              return (
                <li key={t.title} className="flex items-center gap-3 py-2">
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={checked}
                    aria-label={`Mark "${t.title}" done`}
                    onClick={() => toggle(t.title)}
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

        <section className={`${card} grid grid-cols-2 divide-x divide-[#f0e8de] py-4`}>
          <div className="flex flex-col items-center gap-1 px-3 text-center">
            <span className="flex items-center gap-1.5 text-sm font-bold text-ink">
              <CalendarDays className="size-4 text-brand" aria-hidden="true" /> Countdown
            </span>
            <span className="font-display text-2xl font-black text-ink">{daysRemaining} Days</span>
            <span className="text-xs text-ink-muted">({displayTimeline})</span>
          </div>
          <div className="flex min-w-0 flex-col items-center gap-1 px-3 text-center">
            <span className="flex items-center gap-1.5 text-sm font-bold text-ink">
              <Target className="size-4 text-brand" aria-hidden="true" /> Target Company
            </span>
            <span className="mt-1 max-w-full truncate font-display text-xl font-extrabold text-ink" title={targetCompany}>
              {targetCompany}
            </span>
          </div>
        </section>

        <div className="grid grid-cols-2 gap-3">
          {onEditSetup && (
            <button
              type="button"
              onClick={onEditSetup}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border-[1.5px] border-brand bg-white px-3 py-3 text-sm font-bold text-brand transition-colors hover:bg-[#fff1ec] cursor-pointer"
            >
              <Pencil className="size-4" aria-hidden="true" /> Edit Details
            </button>
          )}
          <button
            type="button"
            onClick={onReset}
            className={`inline-flex items-center justify-center gap-2 rounded-2xl border border-[#f0e8de] bg-white px-3 py-3 text-sm font-bold text-brand shadow-2xs transition-colors hover:bg-[#fff1ec] cursor-pointer ${
              onEditSetup ? "" : "col-span-2"
            }`}
          >
            <RotateCcw className="size-4" aria-hidden="true" /> Reset Profile
          </button>
        </div>
      </aside>
    </div>
  );
}
