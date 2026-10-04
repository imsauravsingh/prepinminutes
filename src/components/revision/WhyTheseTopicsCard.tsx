"use client";

import {
  Sparkles,
  BarChart2,
  Activity,
  Clock,
  Target,
  GitBranch,
} from "lucide-react";

export function WhyTheseTopicsCard() {
  const factors = [
    {
      id: "factor-1",
      icon: BarChart2,
      iconBg: "bg-[#f5f3ff] text-[#7c3aed]",
      text: "Recall strength from previous sessions",
    },
    {
      id: "factor-2",
      icon: Activity,
      iconBg: "bg-[#eff6ff] text-[#2563eb]",
      text: "Recent evaluation performance",
    },
    {
      id: "factor-3",
      icon: Clock,
      iconBg: "bg-[#f0fdfa] text-[#0284c7]",
      text: "Time since last review",
    },
    {
      id: "factor-4",
      icon: Target,
      iconBg: "bg-[#eef2ff] text-[#4f46e5]",
      text: "Interview relevance for your target role",
    },
    {
      id: "factor-5",
      icon: GitBranch,
      iconBg: "bg-[#ecfdf5] text-[#059669]",
      text: "Dependencies with other topics",
    },
  ];

  return (
    <div className="w-full rounded-2xl border border-line bg-white p-5 sm:p-6 shadow-2xs flex flex-col gap-3.5">
      {/* Header: Sparkle Icon + Title + Subtitle */}
      <div className="flex items-start gap-2.5">
        <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-[#fffbeb] text-[#f59e0b] mt-0.5">
          <Sparkles className="size-4" />
        </div>
        <div className="flex flex-col">
          <h3 className="font-display font-extrabold text-base text-ink">
            Why these topics?
          </h3>
          <p className="text-xs text-ink-muted">
            Each topic is chosen using multiple factors:
          </p>
        </div>
      </div>

      {/* 5 Factors */}
      <div className="flex flex-col gap-2.5 pt-1">
        {factors.map((f) => {
          const Icon = f.icon;

          return (
            <div
              key={f.id}
              className="flex items-center gap-3 text-xs font-medium text-ink-muted hover:text-ink transition-colors"
            >
              <div
                className={`flex size-6 shrink-0 items-center justify-center rounded-md ${f.iconBg}`}
              >
                <Icon className="size-3.5" />
              </div>
              <span className="leading-snug">{f.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
