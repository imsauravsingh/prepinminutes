"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Circle,
  CircleDot,
  Clock,
  Lock,
  Mic,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { areaIcon } from "@/components/dashboard/PrepHomeOverview";
import { useAreaDetail, type AreaCategory, type AreaTopic } from "@/hooks/useAreaDetail";

/**
 * One preparation area (System Design, DSA, …): every topic the candidate
 * needs, grouped by curriculum category, with their status and the next step.
 */

type Filter = "must" | "all" | "done";

const card = "rounded-3xl border border-[#f0e8de] bg-white shadow-[0_8px_24px_rgba(64,38,25,0.06)]";
const cardTitle = "font-display text-lg font-extrabold leading-tight text-ink";
const cardSub = "text-[13px] leading-snug text-ink-muted";

function hours(min: number) {
  if (min < 60) return `${min} min`;
  const h = Math.round((min / 60) * 10) / 10;
  return `${h} hr${h === 1 ? "" : "s"}`;
}

export function AreaDetailWorkspace({ slug }: { slug: string }) {
  const { loading, failed, detail } = useAreaDetail(slug);
  const [filter, setFilter] = useState<Filter>("must");
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [open, setOpen] = useState<Record<string, boolean>>({});

  // Topics visible under the current filter and search; advanced ones live in their own section.
  const visible: AreaCategory[] = useMemo(() => {
    if (!detail) return [];
    const q = query.trim().toLowerCase();
    return detail.categories
      .map((c) => ({
        ...c,
        topics: c.topics.filter((t) => {
          if (t.advanced) return false;
          if (filter === "must" && !t.mustDo) return false;
          if (filter === "done" && t.status !== "done") return false;
          return !q || t.title.toLowerCase().includes(q);
        }),
      }))
      .filter((c) => c.topics.length > 0);
  }, [detail, filter, query]);

  const advanced = useMemo(
    () => (detail ? detail.categories.flatMap((c) => c.topics.filter((t) => t.advanced)) : []),
    [detail],
  );

  // By default only the group holding the next topic (or the first group) is open.
  const defaultOpen = detail
    ? (detail.categories.find((c) => c.topics.some((t) => t.slug === detail.next?.slug))?.slug ?? detail.categories[0]?.slug)
    : undefined;

  // While searching, show every matching group open.
  const isOpen = (c: AreaCategory) => Boolean(query.trim()) || (open[c.slug] ?? c.slug === defaultOpen);

  if (loading && !detail) {
    return <p className="py-20 text-center text-sm text-ink-muted">Loading your topics…</p>;
  }
  if (failed || !detail) {
    return (
      <div className="flex flex-col items-center gap-3 py-20 text-center">
        <p className="text-sm text-ink-muted">We couldn&rsquo;t load this area right now. Please try again in a moment.</p>
        <Link href="/dashboard" className="text-sm font-semibold text-brand">
          Back to Today
        </Link>
      </div>
    );
  }

  const pct = detail.mustDoTotal ? Math.round((detail.mustDoDone / detail.mustDoTotal) * 100) : 0;
  const icon = areaIcon(slug);
  const why = [detail.weightPct ? `${detail.weightPct}% of your plan` : null, detail.isWeekFocus ? "this week's focus" : null]
    .filter(Boolean)
    .join(" · ");
  const behind = detail.behind;

  const counts: Record<Filter, number> = {
    must: detail.mustDoTotal,
    all: detail.allTotal - detail.advancedCount,
    done: detail.allDone,
  };

  return (
    <div className="mx-auto flex w-full max-w-[1040px] flex-col gap-5">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[13px] text-ink-muted">
        <Link href="/dashboard" className="inline-flex items-center gap-1 font-medium hover:text-ink">
          <ArrowLeft className="size-3.5" aria-hidden="true" />
          Today
        </Link>
        <span aria-hidden="true">/</span>
        <span className="font-semibold text-ink">{detail.name}</span>
      </nav>

      {/* Header */}
      <section className={`${card} flex flex-col gap-4 p-5 sm:p-6`}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex min-w-0 flex-1 items-center gap-4">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-[18px] border border-[#f0e8de] bg-[#fbf7f2] sm:size-[72px] sm:rounded-[20px]">
              {icon && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={icon} alt="" aria-hidden="true" className="size-12 drop-shadow-[0_8px_10px_rgba(64,38,25,0.15)] sm:size-[60px]" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="font-display text-[22px] font-extrabold leading-tight text-ink sm:text-[28px]">{detail.name}</h1>
              <p className={`mt-1 line-clamp-2 ${cardSub}`}>{why || detail.description}</p>
            </div>
          </div>
          <div className="flex items-center justify-between gap-5 sm:justify-end">
            <div className="sm:text-right">
              <p className="font-display text-2xl font-extrabold text-ink">
                {detail.mustDoDone} <span className="text-ink-muted">/ {detail.mustDoTotal}</span>
              </p>
              <p className="text-[12px] font-medium text-ink-muted">must-do done</p>
            </div>
            {detail.next && (
              <Link
                href={detail.next.href}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-brand px-5 py-2.5 text-[14px] font-semibold text-white shadow-[0_6px_14px_rgba(255,108,71,0.32)] transition-transform hover:-translate-y-0.5"
              >
                {detail.mustDoDone > 0 || detail.next.status === "in-progress" ? "Continue" : "Start"}
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            )}
          </div>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-[#eceae6]" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Must-do progress">
          <div className="h-full rounded-full bg-emerald-500 transition-[width]" style={{ width: `${pct}%` }} />
        </div>

        <p className={`text-[13px] ${behind ? "text-[#b4570f]" : "text-ink-muted"}`}>
          {detail.next ? (
            <>
              Next: <span className="font-semibold text-ink">{detail.next.title}</span> · {detail.next.durationMin} min
            </>
          ) : (
            <span className="font-semibold text-emerald-700">All must-do topics done. Great work!</span>
          )}
          {detail.minutesLeft > 0 && <> · about {hours(detail.minutesLeft)} left</>}
          {detail.daysRemaining !== null && <> · {detail.daysRemaining} days to your interview</>}
          {behind && <> · more than your study time covers, so focus on must-do first</>}
        </p>
      </section>

      {/* Filters + search */}
      <div className="flex flex-wrap items-center gap-2">
        <div role="radiogroup" aria-label="Show topics" className="flex flex-wrap gap-2">
          {(
            [
              ["must", "Must do"],
              ["all", "All"],
              ["done", "Done"],
            ] as [Filter, string][]
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              role="radio"
              aria-checked={filter === key}
              onClick={() => setFilter(key)}
              className={`rounded-full border px-4 py-1.5 text-[13px] font-semibold transition-colors ${
                filter === key
                  ? "border-ink bg-ink text-white"
                  : "border-[#ede6db] bg-white text-ink hover:border-brand/50 hover:bg-[#fff7f3]"
              }`}
            >
              {label} <span className={filter === key ? "text-white/70" : "text-ink-muted"}>{counts[key]}</span>
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center">
          {searchOpen ? (
            <div className="flex items-center gap-1.5 rounded-full border border-[#ede6db] bg-white py-1 pl-3 pr-1">
              <Search className="size-4 text-ink-muted" aria-hidden="true" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Find a topic"
                aria-label="Find a topic"
                className="w-40 bg-transparent text-[13px] outline-none sm:w-56"
              />
              <button
                type="button"
                aria-label="Close search"
                onClick={() => {
                  setQuery("");
                  setSearchOpen(false);
                }}
                className="rounded-full p-1 text-ink-muted hover:bg-[#f4efe8]"
              >
                <X className="size-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              aria-label="Search topics"
              onClick={() => setSearchOpen(true)}
              className="rounded-full border border-[#ede6db] bg-white p-2 text-ink-muted hover:border-brand/50 hover:text-ink"
            >
              <Search className="size-4" />
            </button>
          )}
        </div>
      </div>

      {/* Topics by category */}
      <div className="flex flex-col gap-3">
        {visible.length === 0 && (
          <p className={`${card} px-5 py-8 text-center text-sm text-ink-muted`}>
            {query.trim()
              ? "No topics match your search."
              : filter === "done"
                ? "Topics you finish will show up here."
                : "No topics here yet."}
          </p>
        )}
        {visible.map((c) => {
          const all = detail.categories.find((x) => x.slug === c.slug)?.topics.filter((t) => !t.advanced) ?? c.topics;
          const scope = filter === "must" ? all.filter((t) => t.mustDo) : all;
          const doneCount = scope.filter((t) => t.status === "done").length;
          const catPct = scope.length ? Math.round((doneCount / scope.length) * 100) : 0;
          const expanded = isOpen(c);
          return (
            <section key={c.slug} className={`${card} overflow-hidden`}>
              <button
                type="button"
                aria-expanded={expanded}
                onClick={() => setOpen((p) => ({ ...p, [c.slug]: !expanded }))}
                className="flex w-full items-center gap-3 px-5 py-4 text-left hover:bg-[#fffaf6]"
              >
                <ChevronDown
                  className={`size-4 shrink-0 text-ink-muted transition-transform ${expanded ? "" : "-rotate-90"}`}
                  aria-hidden="true"
                />
                <span className="min-w-0 flex-1 truncate text-[15px] font-bold text-ink">{c.name}</span>
                <span className="hidden h-1.5 w-20 overflow-hidden rounded-full bg-[#eceae6] sm:block" aria-hidden="true">
                  <span className="block h-full rounded-full bg-emerald-500" style={{ width: `${catPct}%` }} />
                </span>
                <span className="w-12 text-right text-[12px] font-semibold text-ink-muted">
                  {doneCount} / {scope.length}
                </span>
              </button>
              {expanded && (
                <ul className="border-t border-[#f3ede5]">
                  {c.topics.map((t) => (
                    <TopicRow key={t.slug} topic={t} current={t.slug === detail.next?.slug} />
                  ))}
                </ul>
              )}
            </section>
          );
        })}

        {/* Advanced: locked until most must-do topics are done (or for 8+ years experience). */}
        {advanced.length > 0 && filter !== "done" && !query.trim() && (
          <section className={`${card} overflow-hidden ${detail.advancedUnlocked ? "" : "bg-[#fbf9f4]"}`}>
            {detail.advancedUnlocked ? (
              <>
                <button
                  type="button"
                  aria-expanded={open.__advanced === true}
                  onClick={() => setOpen((p) => ({ ...p, __advanced: !p.__advanced }))}
                  className="flex w-full items-center gap-3 px-5 py-4 text-left hover:bg-[#fffaf6]"
                >
                  <ChevronDown
                    className={`size-4 shrink-0 text-ink-muted transition-transform ${open.__advanced ? "" : "-rotate-90"}`}
                    aria-hidden="true"
                  />
                  <Sparkles className="size-4 text-brand" aria-hidden="true" />
                  <span className="flex-1 text-[15px] font-bold text-ink">Advanced</span>
                  <span className="text-[12px] font-semibold text-ink-muted">{advanced.length} topics</span>
                </button>
                {open.__advanced && (
                  <ul className="border-t border-[#f3ede5]">
                    {advanced.map((t) => (
                      <TopicRow key={t.slug} topic={t} current={false} />
                    ))}
                  </ul>
                )}
              </>
            ) : (
              <div className="flex items-center gap-3 px-5 py-4 text-ink-muted">
                <Lock className="size-4 shrink-0" aria-hidden="true" />
                <span className="flex-1 text-[15px] font-bold">Advanced · {advanced.length} topics</span>
                <span className="text-[12px] font-semibold">Unlocks at 80% of must-do</span>
              </div>
            )}
          </section>
        )}
      </div>

      {/* Weak spot + mock */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {detail.weakSpot && (
          <Link
            href={detail.weakSpot.href}
            className={`${card} flex items-center gap-3 px-5 py-4 transition-colors hover:bg-[#fffaf6]`}
          >
            <AlertTriangle className="size-5 shrink-0 text-[#d97706]" aria-hidden="true" />
            <span className="min-w-0 flex-1">
              <span className={`block ${cardTitle} text-[15px]`}>Weak spot: {detail.weakSpot.title}</span>
              <span className={cardSub}>Your score is {detail.weakSpot.score}%. Practice it again.</span>
            </span>
            <ArrowRight className="size-4 text-brand" aria-hidden="true" />
          </Link>
        )}
        <Link href="/mock-interview" className={`${card} flex items-center gap-3 px-5 py-4 transition-colors hover:bg-[#fffaf6]`}>
          <Mic className="size-5 shrink-0 text-brand" aria-hidden="true" />
          <span className="min-w-0 flex-1">
            <span className={`block ${cardTitle} text-[15px]`}>Ready to test yourself?</span>
            <span className={cardSub}>Take a mock interview round.</span>
          </span>
          <ArrowRight className="size-4 text-brand" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}

function TopicRow({ topic: t, current }: { topic: AreaTopic; current: boolean }) {
  const done = t.status === "done";
  const label = done ? "Revise" : t.status === "in-progress" ? "Continue" : "Start";
  return (
    <li
      className={`flex items-center gap-3 border-b border-[#f3ede5] px-5 py-3 last:border-b-0 ${current ? "bg-[#fff7f2]" : ""}`}
    >
      {done ? (
        <CheckCircle2 className="size-[18px] shrink-0 text-emerald-600" aria-label="Done" />
      ) : t.status === "in-progress" ? (
        <CircleDot className="size-[18px] shrink-0 text-[#d97706]" aria-label="In progress" />
      ) : (
        <Circle className="size-[18px] shrink-0 text-[#cfc8bf]" aria-label="Not started" />
      )}
      <span className={`min-w-0 flex-1 text-[14px] ${done ? "text-ink-muted" : current ? "font-semibold text-ink" : "text-ink"}`}>
        {t.title}
      </span>
      {done && t.score !== null ? (
        <span className="text-[12px] font-semibold text-ink-muted">{t.score}%</span>
      ) : (
        <span className="hidden items-center gap-1 text-[12px] text-ink-muted sm:inline-flex">
          <Clock className="size-3.5" aria-hidden="true" />
          {t.durationMin} min
        </span>
      )}
      <Link
        href={t.href}
        className={`shrink-0 rounded-full border px-3.5 py-1.5 text-[12.5px] font-semibold transition-colors ${
          current
            ? "border-brand/40 bg-white text-brand hover:bg-brand hover:text-white"
            : "border-[#ede6db] bg-white text-ink-muted hover:border-brand/50 hover:text-brand"
        }`}
      >
        {label}
      </Link>
    </li>
  );
}
