"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Building2, Check, Clock, Mic, X } from "lucide-react";
import type { PlanWeek } from "@/hooks/usePlanOverview";

/**
 * Side panel with one week of the plan: its goal, progress, a day-by-day split
 * and every topic with its area, time, company tag and Start/Review.
 */
export function WeekDrawer({ week: w, color, onClose }: { week: PlanWeek; color: (slug: string) => string; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const minutes = w.topics.reduce((s, t) => s + t.durationMin, 0);
  const doneMin = w.topics.filter((t) => t.status === "done").reduce((s, t) => s + t.durationMin, 0);
  const families = w.groups.slice(0, 3).map((g) => g.name);
  const companyTopics = w.topics.filter((t) => t.companies?.length);
  const companies = Array.from(new Set(companyTopics.flatMap((t) => t.companies ?? [])));

  const goal =
    w.plannedMin === 0 && w.reserveDays > 0
      ? "No new topics this week. Revise what you've covered, do mock interviews, and practise your weak areas."
      : families.length
        ? `Cover ${families.join(", ")}${w.groups.length > 3 ? " and more" : ""}.${
            companyTopics.length ? ` ${companyTopics.length} of these are asked often at ${companies.join(", ")}.` : ""
          }`
        : w.status === "done"
          ? "No topics were finished this week."
          : "Buffer time to catch up on anything left from earlier weeks.";

  return (
    <div className="fixed inset-0 z-[60] flex justify-end" role="dialog" aria-modal="true" aria-labelledby="week-drawer-title">
      <button type="button" aria-label="Close week details" onClick={onClose} className="absolute inset-0 bg-[#1e1c1a]/30 backdrop-blur-[2px]" />
      <div className="relative flex h-full w-full max-w-[480px] flex-col bg-[#fbf9f4] shadow-[-20px_0_40px_rgba(30,28,26,0.18)]">
        <header className="flex items-start gap-3 border-b border-[#f0e8de] bg-white px-5 py-4">
          <div className="min-w-0 flex-1">
            <p className="text-[12.5px] font-semibold text-brand">
              Week {w.number} · {w.range}
            </p>
            <h2 id="week-drawer-title" className="font-display text-[20px] font-extrabold leading-tight text-ink">
              {w.name}
            </h2>
            <p className="mt-1 flex flex-wrap items-center gap-x-3 text-[12.5px] text-ink-muted">
              <span className="inline-flex items-center gap-1">
                <Clock className="size-3.5" aria-hidden="true" />
                {w.plannedMin ? `${Math.round((w.plannedMin / 60) * 10) / 10} h planned` : "Mocks and revision"}
              </span>
              <span>
                {w.done} of {w.topics.length} topics done
              </span>
              <span>{w.status === "done" ? "Completed" : w.status === "current" ? "In progress" : "Upcoming"}</span>
            </p>
          </div>
          <button ref={closeRef} type="button" aria-label="Close" onClick={onClose} className="rounded-full p-2 text-ink-muted hover:bg-[#f4efe8] hover:text-ink">
            <X className="size-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          <section className="rounded-2xl border border-[#fde3c7] bg-[#fff8ee] p-4">
            <h3 className="text-[13px] font-bold text-ink">This week&rsquo;s goal</h3>
            <p className="mt-1 text-[13px] leading-relaxed text-ink-muted">{goal}</p>
            {minutes > 0 && (
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#f1e6dc]">
                <div className="h-full rounded-full bg-brand" style={{ width: `${(doneMin / minutes) * 100}%` }} />
              </div>
            )}
          </section>

          <h3 className="mt-5 text-[13px] font-bold uppercase tracking-wide text-ink-muted">Day by day</h3>
          <ol className="mt-2 flex flex-col gap-3">
            {w.days.map((d) => (
              <li key={d.label} className="rounded-2xl border border-[#f0e8de] bg-white">
                <p className="border-b border-[#f3ede5] px-4 py-2 text-[12.5px] font-bold text-ink">{d.label}</p>
                {d.reserve ? (
                  <Link href="/mock-interview" className="flex items-center gap-2 px-4 py-3 text-[13px] text-ink hover:text-brand">
                    <Mic className="size-4 text-brand" aria-hidden="true" />
                    Mock interview and revision
                  </Link>
                ) : d.topics.length ? (
                  <ul>
                    {d.topics.map((t) => {
                      const done = t.status === "done";
                      return (
                        <li key={t.slug} className="flex items-center gap-3 border-b border-[#f3ede5] px-4 py-2.5 last:border-b-0">
                          {done ? (
                            <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-emerald-500" aria-label="Done">
                              <Check className="size-2.5 text-white" strokeWidth={3} />
                            </span>
                          ) : (
                            <span className="size-4 shrink-0 rounded-full border-2 border-[#d9d3cb]" aria-label="Not started" />
                          )}
                          <span className="min-w-0 flex-1">
                            <span className={`block text-[13.5px] font-semibold leading-snug ${done ? "text-ink-muted" : "text-ink"}`}>{t.title}</span>
                            <span className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[11.5px]">
                              <span className="rounded-full px-2 py-0.5 font-semibold text-white" style={{ background: color(t.areaSlug) }}>
                                {t.areaName}
                              </span>
                              {t.companies && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-[#eef0ff] px-2 py-0.5 font-semibold text-[#4338ca]">
                                  <Building2 className="size-3" aria-hidden="true" />
                                  {t.companies[0]}
                                </span>
                              )}
                              <span className="text-ink-muted">{t.durationMin} min</span>
                            </span>
                          </span>
                          <Link
                            href={t.href}
                            className={`shrink-0 rounded-full px-3 py-1 text-[12.5px] font-semibold ${
                              done ? "border border-[#e6dfd6] text-ink hover:border-brand/50" : "bg-brand text-white hover:bg-[#f2582f]"
                            }`}
                          >
                            {done ? "Review" : "Start"}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="px-4 py-3 text-[13px] text-ink-muted">{w.status === "done" ? "Nothing finished." : "Rest or catch up."}</p>
                )}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
