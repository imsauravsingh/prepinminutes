"use client";

import {
  CodeXml,
  Lightbulb,
  Layers,
  Users,
  Target,
  BarChart3,
} from "lucide-react";

export function WhatAiWillEvaluateSection() {
  const criteria = [
    {
      icon: CodeXml,
      iconColor: "text-[#2563eb]",
      label: "Technical Depth",
    },
    {
      icon: Lightbulb,
      iconColor: "text-[#2563eb]",
      label: "Reasoning",
    },
    {
      icon: Layers,
      iconColor: "text-[#2563eb]",
      label: "Trade-offs",
    },
    {
      icon: Users,
      iconColor: "text-[#7c3aed]",
      label: "Communication",
    },
    {
      icon: Target,
      iconColor: "text-[#ff6c47]",
      label: "Problem Solving",
    },
    {
      icon: BarChart3,
      iconColor: "text-[#0d9488]",
      label: "Follow-up Handling",
    },
  ];

  return (
    <div className="flex w-full flex-col gap-3">
      {/* Section Header */}
      <div className="flex flex-col gap-0.5">
        <h2 className="font-display text-base sm:text-lg font-bold text-ink">
          What the AI Will Evaluate
        </h2>
        <p className="text-xs text-ink-muted">
          Your interview will be evaluated across key areas, similar to real
          interviews.
        </p>
      </div>

      {/* 6 Criteria Badges Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
        {criteria.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="flex items-center justify-center gap-1.5 sm:gap-2 rounded-xl border border-line bg-white px-2.5 sm:px-3 py-2.5 sm:py-3 text-[11px] sm:text-xs font-bold text-ink shadow-2xs"
            >
              <Icon
                className={`size-3.5 sm:size-4 shrink-0 ${item.iconColor}`}
              />
              <span className="truncate">{item.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
