"use client";

import { Brain, Check } from "lucide-react";

export function KnowledgeHealthCard() {
  const categories = [
    {
      id: "strong",
      count: "12",
      label: "Strong Recall",
      subtext: "No immediate revision needed",
      bgColor: "bg-[#f0fdf4]",
      borderColor: "border-[#d1fae5]",
      badgeColor: "text-[#059669]",
      iconBg: "bg-[#10b981] rounded-full",
    },
    {
      id: "good",
      count: "7",
      label: "Good Recall",
      subtext: "Keep practicing periodically",
      bgColor: "bg-[#eff6ff]",
      borderColor: "border-[#dbeafe]",
      badgeColor: "text-[#2563eb]",
      iconBg: "bg-[#2563eb] rounded-lg",
    },
    {
      id: "needs-reinforcement",
      count: "6",
      label: "Needs Reinforcement",
      subtext: "Include in upcoming revision",
      bgColor: "bg-[#fffbeb]",
      borderColor: "border-[#fef3c7]",
      badgeColor: "text-[#d97706]",
      iconBg: "bg-[#f59e0b] rounded-lg",
    },
    {
      id: "at-risk",
      count: "4",
      label: "At Risk",
      subtext: "Revise soon to avoid forgetting",
      bgColor: "bg-[#fef2f2]",
      borderColor: "border-[#fee2e2]",
      badgeColor: "text-[#dc2626]",
      iconBg: "bg-[#ef4444] rounded-lg",
    },
  ];

  // SVG Gauge calculations (r = 42)
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const percentage = 72;
  const strokeDashoffset = circumference - (circumference * percentage) / 100;

  return (
    <div className="w-full rounded-2xl border border-line bg-white p-5 sm:p-6 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
      {/* Left Main Content */}
      <div className="flex flex-col gap-4 flex-1">
        {/* Title & Subtitle */}
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#eff6ff] text-[#2563eb] border border-[#dbeafe]/80">
            <Brain className="size-5" />
          </div>
          <div className="flex flex-col">
            <h2 className="font-display text-base sm:text-lg font-extrabold text-ink">
              Knowledge Health
            </h2>
            <p className="text-xs text-ink-muted">
              Your current recall strength across all topics.
            </p>
          </div>
        </div>

        {/* 4 Stat Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-3.5">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className={`flex flex-col justify-between rounded-xl border p-3.5 ${cat.bgColor} ${cat.borderColor} transition-all`}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`flex size-6 shrink-0 items-center justify-center text-white ${cat.iconBg}`}
                >
                  <Check className="size-3.5 stroke-[2.5]" />
                </div>
                <div className="flex items-baseline gap-1.5 min-w-0">
                  <span className="font-display font-extrabold text-xl text-ink leading-none">
                    {cat.count}
                  </span>
                  <span
                    className={`font-semibold text-xs truncate ${cat.badgeColor}`}
                  >
                    {cat.label}
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-ink-muted mt-2 leading-tight">
                {cat.subtext}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Right Circular Gauge & Total Topics */}
      <div className="flex items-center justify-center sm:justify-end gap-6 shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 lg:border-l border-line lg:pl-6">
        <div className="flex flex-col text-right">
          <span className="text-[11px] font-medium text-ink-muted">
            Total Topics
          </span>
          <span className="font-display font-extrabold text-2xl text-ink leading-tight">
            29
          </span>
        </div>

        {/* Circular Gauge */}
        <div className="relative flex size-28 items-center justify-center">
          <svg className="size-full -rotate-90" viewBox="0 0 100 100">
            {/* Background circle track */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="#f3f4f6"
              strokeWidth="9"
            />
            {/* Active progress ring */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="#059669"
              strokeWidth="9"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-700 ease-out"
            />
          </svg>

          {/* Centered Percentage Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display text-2xl font-extrabold text-ink leading-none">
              72%
            </span>
            <span className="text-[10px] text-ink-muted font-medium mt-1">
              Revision
              <br />
              Health
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
