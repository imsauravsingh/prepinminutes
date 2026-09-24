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
      isToday: true,
    },
    {
      id: "day-2",
      dayName: "Tomorrow",
      date: "Sep 25",
      count: "3",
      dotColor: "bg-[#6366f1]",
      isToday: false,
    },
    {
      id: "day-3",
      dayName: "Sep 26",
      date: null,
      count: "5",
      dotColor: "bg-[#3b82f6]",
      isToday: false,
    },
    {
      id: "day-4",
      dayName: "Sep 27",
      date: null,
      count: "2",
      dotColor: "bg-[#10b981]",
      isToday: false,
    },
    {
      id: "day-5",
      dayName: "Sep 28",
      date: null,
      count: "4",
      dotColor: "bg-[#6366f1]",
      isToday: false,
    },
  ];

  return (
    <div className="w-full rounded-2xl border border-line bg-white p-5 sm:p-6 shadow-2xs flex flex-col gap-4 sm:gap-5">
      {/* Header: Calendar Icon + Title + View Calendar Link */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5 min-w-0">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-[#eff6ff] text-[#2563eb] mt-0.5">
            <Calendar className="size-4" />
          </div>
          <div className="flex flex-col min-w-0">
            <h3 className="font-display font-extrabold text-sm sm:text-base text-ink truncate">
              Upcoming Revision Schedule
            </h3>
            <p className="text-xs text-ink-muted leading-relaxed">
              Topics scheduled based on your performance and spaced repetition.
            </p>
          </div>
        </div>

        <Link
          href="/preparation-plan"
          className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#2563eb] hover:underline shrink-0 pt-0.5"
        >
          <span>View calendar</span>
          <ArrowRight className="size-2.5" />
        </Link>
      </div>

      {/* 5-Day Spaced Repetition Timeline Container */}
      <div className="w-full overflow-x-auto no-scrollbar -mx-1 px-1 sm:mx-0 sm:px-0">
        <div className="min-w-[320px] flex flex-col gap-2.5">
          {/* Day Cards Grid */}
          <div className="grid grid-cols-5 gap-1.5 sm:gap-2 text-center">
            {scheduleDays.map((d, index) => (
              <div key={d.id} className="flex flex-col items-center">
                {/* Day Card */}
                <div
                  className={`w-full flex flex-col rounded-xl border transition-all hover:shadow-2xs overflow-hidden ${
                    d.isToday
                      ? "border-[#fed7aa] bg-[#fffaf5] hover:border-brand/40"
                      : "border-line/80 bg-[#fdfbf7]/70 hover:border-line-strong hover:bg-cream/40"
                  }`}
                >
                  {/* Card Header: Day & Date */}
                  <div
                    className={`flex flex-col items-center justify-center py-1.5 px-1 min-h-[38px] ${
                      d.isToday ? "bg-[#fff2e8]/60" : "bg-white/70"
                    }`}
                  >
                    <span
                      className={`text-[10px] sm:text-[11px] font-bold leading-tight whitespace-nowrap ${
                        d.isToday ? "text-[#ea580c]" : "text-ink"
                      }`}
                    >
                      {d.dayName}
                    </span>
                    {d.date ? (
                      <span className="text-[9px] sm:text-[10px] text-ink-muted leading-tight whitespace-nowrap mt-0.5">
                        {d.date}
                      </span>
                    ) : (
                      <span className="text-[9px] leading-tight opacity-0 select-none">
                        &nbsp;
                      </span>
                    )}
                  </div>

                  {/* Divider line */}
                  <div className="w-full h-px bg-line/60" />

                  {/* Card Body: Number of Topics */}
                  <div className="flex flex-col items-center justify-center py-2 px-1">
                    <span className="font-display font-extrabold text-base sm:text-lg text-ink leading-none">
                      {d.count}
                    </span>
                    <span className="text-[10px] text-ink-muted mt-1 font-medium">
                      topics
                    </span>
                  </div>
                </div>

                {/* Timeline Track & Node Dot - exactly centered under each card */}
                <div className="relative w-full flex items-center justify-center h-4 mt-2">
                  {/* Left horizontal track segment (connects across grid gap) */}
                  {index > 0 && (
                    <div className="absolute right-1/2 left-[-6px] sm:left-[-8px] top-1/2 -translate-y-1/2 h-[2px] bg-line z-0" />
                  )}

                  {/* Right horizontal track segment (connects across grid gap) */}
                  {index < scheduleDays.length - 1 && (
                    <div className="absolute left-1/2 right-[-6px] sm:right-[-8px] top-1/2 -translate-y-1/2 h-[2px] bg-line z-0" />
                  )}

                  {/* Node Dot */}
                  <div
                    className={`relative z-10 size-2.5 sm:size-3 rounded-full ${d.dotColor} ring-2 ring-white shadow-2xs`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
