"use client";

import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";

export function UpcomingScheduleCard() {
  const scheduleDays = [
    {
      id: "day-1",
      dayName: "Today",
      date: "Sep 24",
      count: "4",
      dotColor: "bg-[#ea580c]",
    },
    {
      id: "day-2",
      dayName: "Tomorrow",
      date: "Sep 25",
      count: "3",
      dotColor: "bg-[#6366f1]",
    },
    {
      id: "day-3",
      dayName: "Sep 26",
      date: "",
      count: "5",
      dotColor: "bg-[#3b82f6]",
    },
    {
      id: "day-4",
      dayName: "Sep 27",
      date: "",
      count: "2",
      dotColor: "bg-[#10b981]",
    },
    {
      id: "day-5",
      dayName: "Sep 28",
      date: "",
      count: "4",
      dotColor: "bg-[#6366f1]",
    },
  ];

  return (
    <div className="w-full rounded-2xl border border-line bg-white p-5 sm:p-6 shadow-2xs flex flex-col gap-4">
      {/* Header: Calendar Icon + Title + View Calendar Link */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-[#eff6ff] text-[#2563eb] mt-0.5">
            <Calendar className="size-4" />
          </div>
          <div className="flex flex-col">
            <h3 className="font-display font-extrabold text-sm sm:text-base text-ink">
              Upcoming Revision Schedule
            </h3>
            <p className="text-xs text-ink-muted">
              Topics scheduled based on your performance and spaced repetition.
            </p>
          </div>
        </div>

        <Link
          href="/preparation-plan"
          className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#2563eb] hover:underline shrink-0"
        >
          <span>View calendar</span>
          <ArrowRight className="size-2.5" />
        </Link>
      </div>

      {/* 5 Days Strip Container */}
      <div className="flex flex-col gap-3 pt-1">
        <div className="grid grid-cols-5 gap-1.5 sm:gap-2 text-center">
          {scheduleDays.map((d) => (
            <div
              key={d.id}
              className="flex flex-col items-center justify-between rounded-xl border border-line/80 bg-[#fdfbf7]/60 py-2 px-1 hover:bg-cream/40 transition-colors"
            >
              {/* Day & Date Header */}
              <div className="flex flex-col min-h-[30px] justify-center">
                <span className="text-[11px] font-bold text-ink leading-tight">
                  {d.dayName}
                </span>
                {d.date && (
                  <span className="text-[10px] text-ink-muted leading-tight">
                    {d.date}
                  </span>
                )}
              </div>

              {/* Count */}
              <div className="flex flex-col items-center py-1.5">
                <span className="font-display font-extrabold text-base sm:text-lg text-ink leading-none">
                  {d.count}
                </span>
                <span className="text-[10px] text-ink-muted mt-0.5">
                  topics
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Timeline Connecting Line & Node Dots */}
        <div className="relative flex items-center justify-between px-6 pt-1">
          <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5 bg-line" />
          {scheduleDays.map((d) => (
            <div
              key={`dot-${d.id}`}
              className={`relative z-10 size-2.5 rounded-full ${d.dotColor} ring-2 ring-white`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
