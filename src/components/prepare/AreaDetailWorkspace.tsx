"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Ban,
  Boxes,
  Brain,
  Building2,
  CalendarDays,
  Check,
  ChevronDown,
  Clock,
  Cloud,
  Code2,
  Database,
  Flame,
  Gauge,
  GitBranch,
  Hourglass,
  Layers,
  MessageSquare,
  Network,
  Play,
  Search,
  Server,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { areaIcon } from "@/components/dashboard/PrepHomeOverview";
import { useAreaDetail, type AreaTopic, type Bucket } from "@/hooks/useAreaDetail";
import { joinNames } from "@/hooks/useCompanyFocus";

/**
 * One preparation area as a time-budgeted plan: which topics to do in the time
 * left (Must do), what to add if they get ahead (If time allows), and what to
 * leave for now (Skip for now), with the reason and the next step.
 */

const card = "rounded-3xl border border-[#f0e8de] bg-white shadow-[0_8px_24px_rgba(64,38,25,0.06)]";

/** Bump when the artwork changes so browsers fetch the new file. */
const HERO_ART_VERSION = 1;

const BUCKETS: { key: Bucket; title: string; icon: LucideIcon }[] = [
  { key: "must", title: "Must Do", icon: Layers },
  { key: "maybe", title: "If Time Allows", icon: Hourglass },
  { key: "skip", title: "Skip for Now", icon: Ban },
];

/** Category name → icon (keyword match), so every group gets a fitting icon. */
const CATEGORY_ICONS: [RegExp, LucideIcon][] = [
  [/cach|memory|redis/i, Zap],
  [/database|storage|sql|data/i, Database],
  [/scal|perform|latency/i, Gauge],
  [/network|traffic|gateway|protocol|api/i, Network],
  [/messag|event|stream|queue|kafka|communication/i, MessageSquare],
  [/secur|auth/i, ShieldCheck],
  [/cloud|devops|infra|kubernetes|container/i, Cloud],
  [/distributed|coordination|consensus/i, GitBranch],
  [/graph|tree|array|string|linked|stack|heap|trie|search|dynamic|recursion/i, Code2],
  [/leader|team|behavio|collaborat|mentor|ownership|customer|story/i, Users],
  [/\bai\b|llm|model|vector|generative/i, Brain],
  [/server|runtime|node|java|python|golang|php|backend/i, Server],
  [/pattern|design|architecture|oop|clean/i, Boxes],
];
function categoryIcon(name: string): LucideIcon {
  return CATEGORY_ICONS.find(([re]) => re.test(name))?.[1] ?? Layers;
}

function fmtHours(min: number) {
  if (min < 60) return `${Math.round(min)}m`;
  const h = Math.floor(min / 60);
  const m = Math.round(min % 60);
  return m ? `${h}h ${m}m` : `${h}h`;
}

const PRIORITY_BADGE: Record<string, { label: string; cls: string; hot?: boolean }> = {
  P0: { label: "High Priority", cls: "bg-[#fff1ec] text-[#e0532f]", hot: true },
  P1: { label: "Medium", cls: "bg-[#fff6e5] text-[#b7791f]" },
  P2: { label: "Low", cls: "bg-[#f3f1ee] text-ink-muted" },
};

export function AreaDetailWorkspace({ slug }: { slug: string }) {
  const { loading, failed, detail } = useAreaDetail(slug);
  const [bucket, setBucket] = useState<Bucket>("must");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [showArt, setShowArt] = useState(true);

  const groups = useMemo(() => {
    if (!detail) return [];
    const q = query.trim().toLowerCase();
    return detail.categories
      .map((c) => ({ ...c, topics: c.topics.filter((t) => t.bucket === bucket && (!q || t.title.toLowerCase().includes(q))) }))
      .filter((c) => c.topics.length > 0);
  }, [detail, bucket, query]);

  if (loading && !detail) {
    return <p className="py-20 text-center text-sm text-ink-muted">Building your plan for this area…</p>;
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

  const { counts } = detail;
  const pct = counts.must ? Math.round((detail.mustDone / counts.must) * 100) : 0;
  const icon = areaIcon(slug);
  const listMinutes = detail.categories
    .flatMap((c) => c.topics)
    .filter((t) => t.bucket === bucket)
    .reduce((s, t) => s + t.durationMin, 0);
  // Only the group holding the next topic (or the first group) starts open.
  const defaultOpen = groups.find((g) => g.topics.some((t) => t.slug === detail.next?.slug))?.slug ?? groups[0]?.slug;
  const isOpen = (s: string) => Boolean(query.trim()) || (open[s] ?? s === defaultOpen);

  const subtitle =
    detail.daysRemaining !== null
      ? `A time-budgeted plan tailored to your experience${detail.company?.matched.length ? ", target company," : ""} and ${detail.daysRemaining} days left.`
      : "A plan tailored to your experience. Finish your setup to fit it to your timeline.";

  const bucketSub: Record<Bucket, string> = {
    must: detail.minutesAvailable !== null ? `Fits in ${fmtHours(detail.minutesAvailable)}` : "Fits your level",
    maybe: "Next in priority",
    skip: "Lower priority for your timeline",
  };

  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-5">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[14px] text-ink-muted">
        <Link href="/dashboard" className="inline-flex items-center gap-1.5 font-medium hover:text-ink">
          <ArrowLeft className="size-4" aria-hidden="true" />
          Today
        </Link>
        <span aria-hidden="true">/</span>
        <span className="font-semibold text-ink">{detail.name}</span>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-[#f6e2d6] bg-gradient-to-br from-[#fff1e8] via-[#fffaf6] to-[#fdf2ea] p-5 sm:p-7">
        <div className="relative z-10 flex max-w-[620px] items-center gap-5">
          {icon && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={icon}
              alt=""
              aria-hidden="true"
              className="hidden size-[110px] shrink-0 drop-shadow-[0_14px_18px_rgba(64,38,25,0.18)] sm:block"
            />
          )}
          <div className="flex min-w-0 flex-1 flex-col gap-3">
            <div>
              <h1 className="font-display text-[28px] font-extrabold leading-tight text-ink sm:text-[38px]">{detail.name}</h1>
              <p className="mt-1 text-[14px] text-ink-muted sm:text-[15px]">{subtitle}</p>
            </div>
            <div
              className="h-2 overflow-hidden rounded-full bg-[#f1e6dc]"
              role="progressbar"
              aria-valuenow={pct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Must do progress"
            >
              <div className="h-full rounded-full bg-brand transition-[width]" style={{ width: `${pct}%` }} />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 text-[13px]">
              <span className="font-bold text-ink">
                {detail.mustDone} of {counts.must} topics ({pct}%)
              </span>
              {detail.weightPct > 0 && (
                <span className="text-ink-muted">
                  {detail.name} is {detail.weightPct}% of your overall plan{detail.isWeekFocus ? " · this week's focus" : ""}
                </span>
              )}
            </div>
          </div>
        </div>
        {showArt && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`/images/prepare/${slug}.webp?v=${HERO_ART_VERSION}`}
            alt=""
            aria-hidden="true"
            onError={() => setShowArt(false)}
            className="pointer-events-none absolute right-6 top-1/2 hidden h-[88%] max-h-[180px] w-auto -translate-y-1/2 select-none min-[1400px]:block 2xl:max-h-[230px]"
          />
        )}
      </section>

      {/* Time budget at a glance */}
      <div className="flex flex-wrap gap-3">
        {detail.daysRemaining !== null && (
          <Stat icon={CalendarDays} tone="text-brand">
            <b>{detail.daysRemaining} days</b> left
          </Stat>
        )}
        {detail.minutesAvailable !== null && (
          <Stat icon={Clock} tone="text-ink" title="Your weekly study hours × days left × this area's share of your plan">
            <b>≈ {fmtHours(detail.minutesAvailable)}</b> available
          </Stat>
        )}
        <Stat icon={Target} tone="text-emerald-600" highlight>
          <b>{counts.must} topics</b> fit your time
        </Stat>
        {detail.company && detail.company.topicCount > 0 && (
          <Stat icon={Building2} tone="text-[#4f46e5]" title={`Topics ${joinNames(detail.company.matched)} ask often come first`}>
            <b>
              {detail.company.topicCount} {detail.company.matched.length === 1 ? detail.company.matched[0] : "company"} topic
              {detail.company.topicCount === 1 ? "" : "s"}
            </b>{" "}
            first
          </Stat>
        )}
        {counts.skip > 0 && (
          <Stat>
            <b>{counts.skip} topics</b> skipped for now
          </Stat>
        )}
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_330px]">
        {/* Left: buckets + topic list */}
        <div className="flex min-w-0 flex-col gap-4">
          <div role="tablist" aria-label="Topic groups" className="grid grid-cols-3 gap-2 sm:gap-3">
            {BUCKETS.map((b) => {
              const active = bucket === b.key;
              return (
                <button
                  key={b.key}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setBucket(b.key)}
                  className={`flex flex-col items-center gap-1 rounded-2xl border px-2 py-3 text-center transition-colors sm:flex-row sm:gap-3 sm:px-4 sm:py-3.5 sm:text-left ${
                    active
                      ? "border-[#ffc9b5] bg-[#fff1ea] shadow-[0_6px_16px_rgba(255,108,71,0.12)]"
                      : "border-[#f0e8de] bg-white hover:border-brand/40 hover:bg-[#fffaf6]"
                  }`}
                >
                  <b.icon className={`size-6 shrink-0 ${active ? "text-brand" : "text-ink"}`} aria-hidden="true" />
                  <span className="min-w-0">
                    <span className={`block text-[13px] font-bold leading-tight sm:text-[15px] ${active ? "text-brand" : "text-ink"}`}>
                      {b.title} ({counts[b.key]})
                    </span>
                    <span className="hidden truncate text-[12.5px] text-ink-muted sm:block">{bucketSub[b.key]}</span>
                  </span>
                </button>
              );
            })}
          </div>

          <section className={`${card} flex flex-col gap-4 p-4 sm:p-5`}>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="font-display text-xl font-extrabold text-ink">
                {BUCKETS.find((b) => b.key === bucket)?.title} Topics <span className="text-ink-muted">({counts[bucket]})</span>
              </h2>
              {listMinutes > 0 && (
                <span className="inline-flex items-center gap-1.5 text-[13px] text-ink-muted">
                  <Clock className="size-4" aria-hidden="true" />≈ {fmtHours(listMinutes)} total
                </span>
              )}
              <label className="ml-auto flex w-full items-center gap-2 rounded-full border border-[#ede6db] bg-white px-3.5 py-2 sm:w-60">
                <Search className="size-4 text-ink-muted" aria-hidden="true" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search topics…"
                  aria-label="Search topics"
                  className="w-full bg-transparent text-[13px] outline-none"
                />
              </label>
            </div>

            {bucket === "skip" && counts.skip > 0 && (
              <p className="rounded-2xl bg-[#fbf9f4] px-4 py-3 text-[13px] text-ink-muted">
                These are lower priority for your timeline. Come back to them once your Must Do topics are done.
              </p>
            )}

            {groups.length === 0 && (
              <p className="py-8 text-center text-sm text-ink-muted">
                {query.trim()
                  ? "No topics match your search."
                  : bucket === "must"
                    ? "No topics fit yet. Add study hours in your setup to plan this area."
                    : bucket === "maybe"
                      ? "Nothing extra right now. Your Must Do list covers your time."
                      : "Nothing skipped. Everything fits your time."}
              </p>
            )}

            <div className="flex flex-col gap-3">
              {groups.map((g) => {
                const CatIcon = categoryIcon(g.name);
                const done = g.topics.filter((t) => t.status === "done").length;
                const expanded = isOpen(g.slug);
                return (
                  <div key={g.slug} className="overflow-hidden rounded-2xl border border-[#f0e8de] bg-white">
                    <button
                      type="button"
                      aria-expanded={expanded}
                      onClick={() => setOpen((p) => ({ ...p, [g.slug]: !expanded }))}
                      className={`flex w-full items-center gap-3 px-4 py-3.5 text-left hover:bg-[#fffaf6] ${expanded ? "bg-[#fffaf6]" : ""}`}
                    >
                      <ChevronDown
                        className={`size-4 shrink-0 text-ink transition-transform ${expanded ? "" : "-rotate-90"}`}
                        aria-hidden="true"
                      />
                      <CatIcon className="size-5 shrink-0 text-brand" aria-hidden="true" />
                      <span className="min-w-0 flex-1 truncate text-[15px] font-bold text-ink">
                        {g.name} <span className="font-medium text-ink-muted">({g.topics.length} topics)</span>
                      </span>
                      <span className="text-[13px] font-bold text-ink">
                        {done} / {g.topics.length}
                      </span>
                      <span className="hidden h-1.5 w-24 overflow-hidden rounded-full bg-[#eceae6] sm:block" aria-hidden="true">
                        <span
                          className="block h-full rounded-full bg-emerald-500"
                          style={{ width: `${Math.round((done / g.topics.length) * 100)}%` }}
                        />
                      </span>
                    </button>
                    {expanded && (
                      <ul className="border-t border-[#f3ede5]">
                        {g.topics.map((t) => (
                          <TopicRow key={t.slug} topic={t} icon={CatIcon} current={t.slug === detail.next?.slug} />
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* Right: plan summary, why, next up */}
        <aside className="flex flex-col gap-4">
          <section className={`${card} p-5`}>
            <h2 className="flex items-center gap-2 font-display text-[17px] font-extrabold text-ink">
              <Target className="size-5 text-brand" aria-hidden="true" />
              Your Plan for {detail.name}
            </h2>
            <div className="mt-4 flex items-center gap-5">
              <Donut done={detail.mustDone} total={counts.must} />
              <ul className="flex flex-col gap-2 text-[13px] text-ink">
                <Legend color="bg-emerald-500" value={detail.mustDone} label="Completed" />
                <Legend color="bg-[#f6b73c]" value={counts.must - detail.mustDone} label="Remaining" />
                <Legend color="bg-[#e2ddd6]" value={counts.skip} label="Skipped for now" />
              </ul>
            </div>
            <p className="mt-4 flex items-center gap-2 border-t border-[#f3ede5] pt-3 text-[13px] text-ink-muted">
              <Clock className="size-4 text-ink" aria-hidden="true" />
              <b className="text-[15px] text-ink">≈ {fmtHours(detail.mustMinutesLeft)}</b> to complete Must Do
            </p>
          </section>

          <section className="rounded-3xl border border-[#fde3c7] bg-[#fff8ee] p-5">
            <h2 className="flex items-center gap-2 font-display text-[16px] font-extrabold text-ink">
              <Sparkles className="size-5 text-[#f59e0b]" aria-hidden="true" />
              Why these {counts.must} topics?
            </h2>
            <p className="mt-2 text-[13px] leading-relaxed text-ink-muted">
              They cover the highest-impact concepts for a {detail.why.level}
              {detail.why.role ? ` preparing for a ${detail.why.role} role` : ""}
              {detail.company?.matched.length ? (
                <>
                  {" "}targeting <b className="text-ink">{joinNames(detail.company.matched)}</b>
                </>
              ) : null}
              {detail.why.hours !== null ? `, and fit within your ${detail.why.hours} hours for this area.` : "."}
            </p>
            {detail.company && detail.company.matched.length > 0 && (
              <ul className="mt-2 flex flex-col gap-1 text-[13px] leading-relaxed text-ink-muted">
                {detail.company.topicCount > 0 && (
                  <li>
                    • <b className="text-ink">{detail.company.topicCount}</b> topic{detail.company.topicCount === 1 ? "" : "s"}{" "}
                    {joinNames(detail.company.matched)} ask{detail.company.matched.length === 1 ? "s" : ""} often come first.
                  </li>
                )}
                {detail.company.interviewSharePct !== null && detail.company.interviewSharePct > 0 && (
                  <li>
                    • {detail.name} is about <b className="text-ink">{detail.company.interviewSharePct}%</b> of their interview, so
                    your time here is set with that in mind.
                  </li>
                )}
              </ul>
            )}
            {detail.company && detail.company.unmatched.length > 0 && (
              <p className="mt-2 text-[12.5px] leading-relaxed text-ink-muted">
                We don&rsquo;t have interview data for {joinNames(detail.company.unmatched)} yet, so{" "}
                {detail.company.matched.length ? "it doesn't change this plan" : "this plan uses your experience and timeline"}.
              </p>
            )}
          </section>

          {detail.next && (
            <section className={`${card} p-5`}>
              <h2 className="font-display text-[17px] font-extrabold text-ink">Next Up</h2>
              <div className="mt-3 flex items-start gap-3">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#fff1ec]">
                  <Play className="size-5 fill-brand text-brand" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="text-[15px] font-bold leading-snug text-ink">{detail.next.title}</p>
                  <p className="mt-1 flex items-center gap-1.5 text-[12.5px] text-ink-muted">
                    <Clock className="size-3.5" aria-hidden="true" />
                    {detail.next.durationMin} min
                    {PRIORITY_BADGE[detail.next.priority] && (
                      <>
                        <span aria-hidden="true">·</span>
                        {PRIORITY_BADGE[detail.next.priority].hot && <Flame className="size-3.5 text-[#e0532f]" aria-hidden="true" />}
                        {PRIORITY_BADGE[detail.next.priority].label}
                      </>
                    )}
                  </p>
                </div>
              </div>
              <Link
                href={detail.next.href}
                className="mt-4 flex items-center justify-center gap-2 rounded-full bg-brand py-3 text-[15px] font-semibold text-white shadow-[0_8px_18px_rgba(255,108,71,0.3)] transition-transform hover:-translate-y-0.5"
              >
                {detail.next.status === "in-progress" || detail.mustDone > 0 ? "Continue Learning" : "Start Learning"}
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </section>
          )}
        </aside>
      </div>
    </div>
  );
}

function Stat({
  icon: Icon,
  tone,
  highlight,
  title,
  children,
}: {
  icon?: LucideIcon;
  tone?: string;
  highlight?: boolean;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      title={title}
      className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-[14px] text-ink [&_b]:font-bold ${
        highlight ? "border-[#cdeedd] bg-[#ecfaf2]" : "border-[#f0e8de] bg-white"
      }`}
    >
      {Icon && <Icon className={`size-5 ${tone ?? ""}`} aria-hidden="true" />}
      <span>{children}</span>
    </span>
  );
}

function Legend({ color, value, label }: { color: string; value: number; label: string }) {
  return (
    <li className="flex items-center gap-2">
      <span className={`size-2.5 rounded-full ${color}`} aria-hidden="true" />
      <b className="w-6">{value}</b>
      <span className="text-ink-muted">{label}</span>
    </li>
  );
}

/** Ring: completed (green) and remaining (amber) Must do topics. */
function Donut({ done, total }: { done: number; total: number }) {
  const r = 46;
  const c = 2 * Math.PI * r;
  const doneLen = total ? (done / total) * c : 0;
  return (
    <div className="relative size-[116px] shrink-0">
      <svg viewBox="0 0 120 120" className="size-full -rotate-90" aria-hidden="true">
        <circle cx="60" cy="60" r={r} fill="none" stroke="#f6b73c" strokeWidth="12" opacity={total ? 1 : 0.25} />
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke="#10b981"
          strokeWidth="12"
          strokeDasharray={`${doneLen} ${c}`}
          strokeLinecap={done > 0 && done < total ? "round" : "butt"}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-[28px] font-extrabold leading-none text-ink">{total}</span>
        <span className="text-[12px] text-ink-muted">Topics</span>
      </div>
    </div>
  );
}

function TopicRow({ topic: t, icon: Icon, current }: { topic: AreaTopic; icon: LucideIcon; current: boolean }) {
  const done = t.status === "done";
  const badge = PRIORITY_BADGE[t.priority];
  return (
    <li className={`flex items-center gap-3 border-b border-[#f3ede5] px-4 py-3 last:border-b-0 ${current ? "bg-[#fff7f2]" : ""}`}>
      {done ? (
        <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-500" aria-label="Done">
          <Check className="size-3.5 text-white" strokeWidth={3} />
        </span>
      ) : (
        <span
          className={`size-5 shrink-0 rounded-full border-2 ${t.status === "in-progress" ? "border-[#f59e0b]" : "border-[#d9d3cb]"}`}
          aria-label={t.status === "in-progress" ? "In progress" : "Not started"}
        />
      )}
      <Icon className="hidden size-5 shrink-0 text-brand sm:block" aria-hidden="true" />
      <span className={`min-w-0 flex-1 text-[14px] font-semibold ${done ? "text-ink-muted" : "text-ink"}`}>{t.title}</span>
      {t.companies && (
        <span
          title={`Asked often at ${t.companies.join(", ")}`}
          className="hidden items-center gap-1 rounded-full bg-[#eef0ff] px-2.5 py-1 text-[11.5px] font-semibold text-[#4338ca] md:inline-flex"
        >
          <Building2 className="size-3" aria-hidden="true" />
          {t.companies[0]}
          {t.companies.length > 1 ? ` +${t.companies.length - 1}` : ""}
        </span>
      )}
      {badge && (
        <span className={`hidden items-center gap-1 rounded-full px-2.5 py-1 text-[11.5px] font-semibold md:inline-flex ${badge.cls}`}>
          {badge.hot && <Flame className="size-3" aria-hidden="true" />}
          {badge.label}
        </span>
      )}
      <span className="hidden w-16 items-center justify-end gap-1 text-[12.5px] text-ink-muted sm:inline-flex">
        <Clock className="size-3.5" aria-hidden="true" />
        {done && t.score !== null ? `${t.score}%` : `${t.durationMin} min`}
      </span>
      <Link
        href={t.href}
        className={`w-[84px] shrink-0 rounded-full py-1.5 text-center text-[13px] font-semibold transition-colors ${
          done
            ? "border border-[#e6dfd6] bg-white text-ink hover:border-brand/50 hover:text-brand"
            : "bg-brand text-white shadow-[0_4px_10px_rgba(255,108,71,0.25)] hover:bg-[#f2582f]"
        }`}
      >
        {done ? "Review" : t.status === "in-progress" ? "Continue" : "Start"}
      </Link>
    </li>
  );
}
