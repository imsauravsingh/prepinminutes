"use client";

import {
  Calendar,
  Cloud,
  CheckCircle2,
  CodeXml,
  ArrowUpRight,
  ArrowRight,
} from "lucide-react";

export function ThisWeekActivity() {
  const activities = [
    {
      id: "practice-sessions",
      icon: Calendar,
      iconBg: "bg-[#fff0ec] text-brand border border-[#ffd8cc]/60",
      value: "5",
      label: "Practice sessions",
      trendText: "+2 from last week",
      trendType: "up" as const,
    },
    {
      id: "evaluations",
      icon: Cloud,
      iconBg: "bg-[#eff6ff] text-[#2563eb] border border-[#dbeafe]/60",
      value: "3",
      label: "Evaluations",
      trendText: "same as last week",
      trendType: "same" as const,
    },
    {
      id: "topics-completed",
      icon: CheckCircle2,
      iconBg: "bg-[#f5f3ff] text-[#7c3aed] border border-[#ede9fe]/60",
      value: "4",
      label: "Topics completed",
      trendText: "+2 from last week",
      trendType: "up" as const,
    },
    {
      id: "readiness-improvement",
      icon: CodeXml,
      iconBg: "bg-[#edf5ec] text-[#10b981] border border-[#d1fae5]/60",
      value: "+8%",
      valueColor: "text-[#10b981]",
      label: "Readiness improvement",
      trendText: "from 63% to 68%",
      trendType: "up" as const,
    },
  ];

  return (
    <div className="flex flex-col gap-3.5">
      <h2 className="font-display text-base sm:text-lg font-bold text-ink">
        This Week&apos;s Activity
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {activities.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.id}
              className="flex items-start gap-3.5 rounded-2xl border border-line bg-white p-4 shadow-2xs hover:border-line-strong transition-all"
            >
              <div
                className={`flex size-10 sm:size-11 shrink-0 items-center justify-center rounded-xl ${item.iconBg}`}
              >
                <Icon className="size-5" />
              </div>

              <div className="flex flex-col min-w-0">
                <span
                  className={`font-display text-2xl font-extrabold leading-none ${
                    item.valueColor || "text-ink"
                  }`}
                >
                  {item.value}
                </span>

                <span className="text-xs font-semibold text-ink-muted mt-1 truncate">
                  {item.label}
                </span>

                <div className="flex items-center gap-1 text-[11px] mt-1 font-medium">
                  {item.trendType === "up" ? (
                    <ArrowUpRight className="size-3 text-[#10b981] stroke-[2.5]" />
                  ) : (
                    <ArrowRight className="size-3 text-ink-muted" />
                  )}
                  <span
                    className={
                      item.trendType === "up"
                        ? "text-[#10b981]"
                        : "text-ink-muted"
                    }
                  >
                    {item.trendText}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
