"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  Building2,
  CalendarDays,
  CalendarRange,
  Check,
  Clock,
  Loader,
  Mic,
  PencilLine,
  Play,
  RefreshCw,
  Sparkles,
  Target,
} from "lucide-react";
import { joinNames } from "@/hooks/useCompanyFocus";
import { usePlanOverview, type PlanOverview, type PlanWeek } from "@/hooks/usePlanOverview";
import { WeekDrawer } from "@/components/preparation-plan/WeekDrawer";

/**
 * My Plan: the candidate's time-boxed roadmap. By Week (default) is a timeline
 * counted from the plan start; each week opens a detail panel. By Domain shows
 * how the time is split across areas. Same numbers as the area pages.
 */

const card = "rounded-3xl border border-[#f0e8de] bg-white shadow-[0_8px_24px_rgba(64,38,25,0.06)]";
const cardTitle = "font-display text-[18px] font-extrabold text-ink";
const sub = "text-[13px] text-ink-muted";

/** Bump when the artwork changes so browsers fetch the new file. */
const HERO_ART = "/images/plan/plan-hero.webp?v=1";

/** One colour per area, in order of share. */
export const AREA_COLORS = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ec4899", "#06b6d4", "#64748b", "#ef4444"];

export function fmtHours(min: number) {
  if (min < 60) return `${Math.round(min)}m`;
  const h = Math.floor(min / 60);
  const m = Math.round(min % 60);
  return m ? `${h}h ${m}m` : `${h}h`;
}

const titleCase = (s: string) => s.replace(/\b\w/g, (c) => c.toUpperCase());

export function PlanOverviewWorkspace() {
  const { loading, overview: o } = usePlanOverview();
  const [view, setView] = useState<"week" | "domain">("week");
  const [openWeek, setOpenWeek] = useState<number | null>(null);
  const [showArt, setShowArt] = useState(true);

  if (loading || !o) return <p className="py-20 text-center text-sm text-ink-muted">Building your plan…</p>;
  if (!o.areas.length) {
    return (
      <div className={`${card} mx-auto max-w-xl p-8 text-center`}>
        <p className={cardTitle}>Your plan isn&rsquo;t ready yet</p>
        <p className={`mt-2 ${sub}`}>Finish your setup so we can build a plan for your role and timeline.</p>
        <Link href="/dashboard?setup=true" className="mt-4 inline-flex rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white">
          Finish setup
        </Link>
      </div>
    );
  }

  const color = (slug: string) => AREA_COLORS[Math.max(0, o.areas.findIndex((a) => a.slug === slug)) % AREA_COLORS.length];
  const week = openWeek !== null ? o.weeks[openWeek] : null;

  return (
    <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="flex min-w-0 flex-col gap-5">
        {/* Header */}
        <section className="relative overflow-hidden rounded-3xl border border-[#f6e2d6] bg-gradient-to-br from-[#fff1e8] via-[#fffaf6] to-[#fdf2ea] p-5 sm:p-6">
          <div className="flex items-center gap-5">
            <div className="hidden size-[120px] shrink-0 items-center justify-center sm:flex">
              {showArt ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={HERO_ART} alt="" aria-hidden="true" onError={() => setShowArt(false)} className="max-h-full w-auto drop-shadow-[0_12px_16px_rgba(64,38,25,0.16)]" />
              ) : (
                <span className="flex size-24 items-center justify-center rounded-[28px] bg-white/80 text-brand shadow-[0_8px_20px_rgba(255,108,71,0.15)]">
                  <CalendarRange className="size-12" aria-hidden="true" />
                </span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-display text-[28px] font-extrabold leading-tight text-ink sm:text-[36px]">My Interview Plan</h1>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e9f9f0] px-3 py-1 text-[12.5px] font-semibold text-emerald-700">
                  <BadgeCheck className="size-4" aria-hidden="true" />
                  Personalized Plan
                </span>
              </div>
              <p className="mt-1 text-[14px] text-ink-muted">
                A realistic, time-boxed roadmap based on your experience{o.companies.length ? ", target company," : ""} and interview date.
              </p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2.5">
            {o.daysRemaining !== null && (
              <Pill icon={CalendarDays}>
                <b>{o.daysRemaining} days</b> left
              </Pill>
            )}
            {o.totalPlanHours !== null && (
              <Pill icon={Clock} title="Your weekly study hours across the whole plan">
                <b>≈ {o.totalPlanHours} hours</b> total
              </Pill>
            )}
            <Pill icon={Target}>
              <b>{titleCase(o.level)}</b>
            </Pill>
            {o.companies.length > 0 && (
              <Pill icon={Building2}>
                <b>{joinNames(o.companies)}</b> (Target)
              </Pill>
            )}
            <Link
              href="/dashboard?setup=true"
              className="ml-auto inline-flex items-center gap-1.5 rounded-2xl border border-[#ffd3c2] bg-white px-4 py-2 text-[13.5px] font-semibold text-brand hover:bg-[#fff6f1]"
            >
              <PencilLine className="size-4" aria-hidden="true" />
              Edit Plan
            </Link>
          </div>
          {!o.hasTimeline && (
            <p className="mt-4 rounded-2xl bg-white/70 px-4 py-3 text-[13px] text-ink-muted">
              Add your interview timeline and weekly study hours in{" "}
              <Link href="/dashboard?setup=true" className="font-semibold text-brand">
                setup
              </Link>{" "}
              to see your weeks.
            </p>
          )}
          {o.overByMinutes > 0 && (
            <p className="mt-4 flex items-start gap-2 text-[13px] text-[#b45309]">
              <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              Your must-do topics need {fmtHours(o.overByMinutes)} more than your study time. Add hours in setup or follow the weeks in order.
            </p>
          )}
        </section>

        {/* Plan */}
        <section className={`${card} p-5 sm:p-6`}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="font-display text-[22px] font-extrabold text-ink">Your Preparation Plan</h2>
              <p className={sub}>Follow a week-by-week roadmap or track your plan by area.</p>
            </div>
            <div role="tablist" aria-label="Plan view" className="flex rounded-full border border-[#ede6db] bg-white p-1">
              {(
                [
                  ["domain", "By Domain"],
                  ["week", "By Week"],
                ] as const
              ).map(([k, label]) => (
                <button
                  key={k}
                  type="button"
                  role="tab"
                  aria-selected={view === k}
                  onClick={() => setView(k)}
                  className={`rounded-full px-4 py-1.5 text-[13.5px] font-semibold transition-colors ${view === k ? "bg-ink text-white" : "text-ink hover:bg-[#f6f1ea]"}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {view === "week" ? (
            o.weeks.length ? (
              <ol className="mt-5 flex flex-col">
                {o.weeks.map((w, i) => (
                  <WeekRow key={w.index} week={w} last={i === o.weeks.length - 1} onOpen={() => setOpenWeek(w.index)} />
                ))}
              </ol>
            ) : (
              <p className={`mt-5 ${sub}`}>Add your timeline in setup to see your weeks.</p>
            )
          ) : (
            <DomainView o={o} color={color} />
          )}
        </section>
      </div>

      {/* Right column */}
      <aside className="flex flex-col gap-5">
        <PlanOverviewCard o={o} />
        <TimeCard o={o} />
        <ThisWeekCard o={o} onOpen={() => o.currentWeek && setOpenWeek(o.currentWeek.index)} />
        <section className={`${card} p-5`}>
          <h2 className="flex items-center gap-2 font-display text-[16px] font-extrabold text-ink">
            <RefreshCw className="size-4 text-brand" aria-hidden="true" />
            What changed
          </h2>
          {o.changes.length ? (
            <ul className="mt-2 flex flex-col gap-1.5 text-[13px] leading-relaxed text-ink">
              {o.changes.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          ) : (
            <p className={`mt-2 ${sub}`}>No changes since your last visit. Your plan adapts as you finish topics or edit your setup.</p>
          )}
          {o.unmatchedCompanies.length > 0 && (
            <p className={`mt-2 ${sub}`}>We don&rsquo;t have interview data for {joinNames(o.unmatchedCompanies)} yet.</p>
          )}
        </section>
      </aside>

      {week && <WeekDrawer week={week} color={color} onClose={() => setOpenWeek(null)} />}
    </div>
  );
}

function Pill({ icon: Icon, title, children }: { icon?: typeof Clock; title?: string; children: React.ReactNode }) {
  return (
    <span title={title} className="inline-flex items-center gap-2 rounded-2xl border border-[#f0e8de] bg-white px-3.5 py-2 text-[13.5px] text-ink [&_b]:font-bold">
      {Icon && <Icon className="size-4 text-brand" aria-hidden="true" />}
      <span>{children}</span>
    </span>
  );
}

const PREVIEW_GROUPS = 3;

function WeekRow({ week: w, last, onOpen }: { week: PlanWeek; last: boolean; onOpen: () => void }) {
  const current = w.status === "current";
  const done = w.status === "done";
  const revisionOnly = w.plannedMin === 0 && w.reserveDays > 0;
  return (
    <li className="relative flex gap-3 sm:gap-4">
      {/* Timeline marker */}
      <div className="relative flex w-6 shrink-0 justify-center">
        {!last && <span className="absolute top-8 bottom-0 w-0.5 bg-[#f0e4d8]" aria-hidden="true" />}
        <span
          className={`relative z-10 mt-5 flex size-6 items-center justify-center rounded-full ${
            done ? "bg-brand text-white" : current ? "border-[3px] border-brand bg-white" : "border-2 border-[#cfc8bf] bg-white"
          }`}
          aria-hidden="true"
        >
          {done && <Check className="size-3.5" strokeWidth={3} />}
          {!done && !current && <span className="size-2 rounded-full bg-[#cfc8bf]" />}
        </span>
      </div>

      <button
        type="button"
        onClick={onOpen}
        aria-label={`Week ${w.number}: ${w.name}. Open details`}
        className={`mb-2 flex min-w-0 flex-1 flex-col gap-2 rounded-2xl border px-4 py-3.5 text-left transition-colors sm:flex-row sm:gap-5 ${
          current ? "border-[#ffd3c2] bg-[#fff4ee]" : "border-transparent hover:border-[#f0e8de] hover:bg-[#fffaf6]"
        }`}
      >
        <span className="w-28 shrink-0">
          <span className={`block text-[16px] font-extrabold ${current || done ? "text-brand" : "text-ink"}`}>Week {w.number}</span>
          <span className="block text-[12.5px] text-ink-muted">({w.daysLabel})</span>
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-2">
            <span className="font-display text-[16px] font-extrabold text-ink">{w.name}</span>
            {w.plannedMin > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full border border-[#efe5da] bg-white px-2.5 py-0.5 text-[12px] text-ink-muted">
                <Clock className="size-3" aria-hidden="true" />
                {fmtHours(w.plannedMin)}
              </span>
            )}
            <span className="ml-auto flex items-center gap-2">
              <span className={`text-[14px] font-bold ${done ? "text-emerald-600" : current ? "text-brand" : "text-ink"}`}>{w.pct}%</span>
              {done && (
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-white px-2.5 py-0.5 text-[12px] font-semibold text-emerald-700">
                  <Check className="size-3" aria-hidden="true" />
                  Completed
                </span>
              )}
              {current && (
                <span className="inline-flex items-center gap-1 rounded-full border border-[#ffc9b5] bg-white px-2.5 py-0.5 text-[12px] font-semibold text-brand">
                  <Loader className="size-3" aria-hidden="true" />
                  In Progress
                </span>
              )}
            </span>
          </span>
          <span className="mt-1.5 flex flex-wrap gap-x-5 gap-y-1.5 text-[13px] text-ink">
            {revisionOnly ? (
              ["Revision of key topics", "Mock interviews", "Weak area practice"].map((x) => (
                <span key={x} className="inline-flex items-center gap-1.5">
                  <span className="size-4 rounded-full border-2 border-[#d9d3cb]" aria-hidden="true" />
                  {x}
                </span>
              ))
            ) : w.groups.length ? (
              <>
                {w.groups.slice(0, PREVIEW_GROUPS).map((g) => (
                  <span key={`${g.areaName}-${g.name}`} className="inline-flex items-center gap-1.5">
                    {g.done === g.topics.length ? (
                      <span className="flex size-4 items-center justify-center rounded-full bg-emerald-500" aria-hidden="true">
                        <Check className="size-2.5 text-white" strokeWidth={3} />
                      </span>
                    ) : (
                      <span className="size-4 rounded-full border-2 border-[#d9d3cb]" aria-hidden="true" />
                    )}
                    {g.name} <span className="text-ink-muted">({g.topics.length} topic{g.topics.length === 1 ? "" : "s"})</span>
                  </span>
                ))}
                {w.groups.length > PREVIEW_GROUPS && <span className="text-ink-muted">+{w.groups.length - PREVIEW_GROUPS} more</span>}
              </>
            ) : (
              <span className="text-ink-muted">{done ? "No topics finished this week." : "Buffer time to catch up."}</span>
            )}
            {w.reserveDays > 0 && !revisionOnly && (
              <span className="inline-flex items-center gap-1.5 text-ink-muted">
                <Mic className="size-3.5" aria-hidden="true" />
                {w.reserveDays} day{w.reserveDays === 1 ? "" : "s"} of mocks and revision
              </span>
            )}
          </span>
        </span>
      </button>
    </li>
  );
}

function DomainView({ o, color }: { o: PlanOverview; color: (slug: string) => string }) {
  return (
    <div className="mt-5">
      <p className={sub}>
        {o.companies.length ? `Time split from your plan, blended with how ${joinNames(o.companies)} interview.` : "Time split from your plan and role."}
      </p>
      <div className="mt-3 flex h-3.5 gap-0.5 overflow-hidden rounded-full" aria-hidden="true">
        {o.areas.map((a) => (
          <div key={a.slug} style={{ width: `${a.sharePct}%`, background: color(a.slug) }} />
        ))}
      </div>
      <ul className="mt-4 flex flex-col gap-2">
        {o.areas.map((a) => {
          const pct = a.counts.must ? Math.round((a.mustDone / a.counts.must) * 100) : 0;
          return (
            <li key={a.slug}>
              <Link href={`/prepare/${a.slug}`} className="group flex items-center gap-4 rounded-2xl border border-[#f3ede5] px-4 py-3 hover:border-brand/40 hover:bg-[#fffaf6]">
                <span className="size-3 shrink-0 rounded-full" style={{ background: color(a.slug) }} aria-hidden="true" />
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] font-bold text-ink">{a.name}</span>
                  <span className="block text-[12.5px] text-ink-muted">
                    {a.sharePct}% of your time{a.minutes !== null ? ` · ${fmtHours(a.minutes)}` : ""} · {a.counts.skip + a.counts.maybe} skipped
                  </span>
                </span>
                <span className="hidden w-32 sm:block">
                  <span className="block h-1.5 overflow-hidden rounded-full bg-[#eceae6]">
                    <span className="block h-full rounded-full bg-emerald-500" style={{ width: `${pct}%` }} />
                  </span>
                </span>
                <span className="w-16 text-right text-[13px] font-bold text-ink">
                  {a.mustDone} / {a.counts.must}
                </span>
                <ArrowRight className="size-4 text-ink-muted transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function PlanOverviewCard({ o }: { o: PlanOverview }) {
  // Centre: how much of the must-do list is done. Ring: done (green) and still to do (amber).
  const left = o.mustTotal - o.mustDone;
  const donePct = o.mustTotal ? Math.round((o.mustDone / o.mustTotal) * 100) : 0;
  const r = 46;
  const c = 2 * Math.PI * r;
  return (
    <section className={`${card} p-5`}>
      <h2 className={`flex items-center gap-2 ${cardTitle}`}>
        <CalendarDays className="size-5 text-brand" aria-hidden="true" />
        Plan Overview
      </h2>
      <div className="mt-4 flex items-center gap-5">
        <div className="relative size-[124px] shrink-0">
          <svg viewBox="0 0 120 120" className="size-full -rotate-90" aria-hidden="true">
            <circle cx="60" cy="60" r={r} fill="none" stroke={o.mustTotal ? "#f6b73c" : "#ece7e1"} strokeWidth="12" />
            <circle cx="60" cy="60" r={r} fill="none" stroke="#10b981" strokeWidth="12" strokeDasharray={`${(donePct / 100) * c} ${c}`} />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display text-[26px] font-extrabold leading-none text-ink">{donePct}%</span>
            <span className="text-[12px] text-ink-muted">Completed</span>
          </div>
        </div>
        <ul className="flex flex-col gap-2.5 text-[13px]">
          <Legend dot="bg-emerald-500" value={o.mustDone} label="Completed" />
          <Legend dot="bg-[#f6b73c]" value={left} label="Remaining (Must Do)" />
          <Legend dot="bg-[#e2ddd6]" value={o.skipped} label="Skipped for Now" />
        </ul>
      </div>
      <p className={`mt-3 ${sub}`}>
        Must-do topics fit your time; skipped ones are lower priority for your timeline.
      </p>
    </section>
  );
}

function Legend({ dot, value, label }: { dot: string; value: number; label: string }) {
  return (
    <li className="flex items-center gap-2">
      <span className={`size-2.5 rounded-full ${dot}`} aria-hidden="true" />
      <b className="w-9 text-ink">{value}</b>
      <span className="text-ink-muted">{label}</span>
    </li>
  );
}

function TimeCard({ o }: { o: PlanOverview }) {
  const rows = [
    { label: "Done so far", min: o.mustMinutesDone, color: "#10b981" },
    { label: "Must-do topics left", min: o.mustMinutesLeft, color: "#3b82f6" },
    { label: "Mocks and revision", min: o.reserveMinutes, color: "#f6b73c" },
  ].filter((r) => r.min > 0);
  const total = rows.reduce((s, r) => s + r.min, 0);
  if (!total) return null;
  return (
    <section className={`${card} p-5`}>
      <h2 className={`flex items-center gap-2 ${cardTitle}`}>
        <Sparkles className="size-5 text-[#f59e0b]" aria-hidden="true" />
        Time Allocation <span className="font-sans text-[15px] font-semibold text-ink-muted">({fmtHours(total)})</span>
      </h2>
      <div className="mt-4 flex h-3 gap-0.5 overflow-hidden rounded-full" aria-hidden="true">
        {rows.map((r) => (
          <div key={r.label} style={{ width: `${(r.min / total) * 100}%`, background: r.color }} />
        ))}
      </div>
      <ul className="mt-3 flex flex-col gap-2 text-[13.5px]">
        {rows.map((r) => (
          <li key={r.label} className="flex items-center gap-2">
            <span className="size-2.5 rounded-full" style={{ background: r.color }} aria-hidden="true" />
            <span className="flex-1 text-ink">{r.label}</span>
            <b className="text-ink">{fmtHours(r.min)}</b>
            <span className="w-12 text-right text-ink-muted">({Math.round((r.min / total) * 100)}%)</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ThisWeekCard({ o, onOpen }: { o: PlanOverview; onOpen: () => void }) {
  const w = o.currentWeek;
  if (!w) return null;
  const doneMin = w.topics.filter((t) => t.status === "done").reduce((s, t) => s + t.durationMin, 0);
  const planned = w.topics.reduce((s, t) => s + t.durationMin, 0);
  return (
    <section className={`${card} p-5`}>
      <h2 className={`flex items-center gap-2 ${cardTitle}`}>
        <Target className="size-5 text-brand" aria-hidden="true" />
        This Week
      </h2>
      <p className="mt-2 text-[14px] font-bold text-ink">
        Week {w.number}: {w.name}
      </p>
      <p className={sub}>
        {fmtHours(doneMin)} of {fmtHours(planned)} done · {w.done} of {w.topics.length} topics
      </p>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#eceae6]">
        <div className="h-full rounded-full bg-brand" style={{ width: `${planned ? (doneMin / planned) * 100 : 0}%` }} />
      </div>
      {o.next && (
        <div className="mt-4 flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#fff1ec]">
            <Play className="size-4 fill-brand text-brand" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-[12px] text-ink-muted">Next up</p>
            <p className="text-[14px] font-bold leading-snug text-ink">{o.next.title}</p>
            <p className="text-[12px] text-ink-muted">
              {o.next.areaName} · {o.next.durationMin} min
            </p>
          </div>
        </div>
      )}
      <div className="mt-4 flex gap-2">
        {o.next && (
          <Link href={o.next.href} className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-brand py-2.5 text-[14px] font-semibold text-white shadow-[0_8px_18px_rgba(255,108,71,0.3)]">
            Continue Learning <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        )}
        <button type="button" onClick={onOpen} className="rounded-full border border-[#e6dfd6] px-4 py-2.5 text-[13.5px] font-semibold text-ink hover:border-brand/50">
          Week details
        </button>
      </div>
    </section>
  );
}
