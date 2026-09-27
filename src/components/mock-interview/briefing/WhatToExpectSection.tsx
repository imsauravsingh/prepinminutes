"use client";

import { MessageSquareText, TrendingUp, FileText } from "lucide-react";

export function WhatToExpectSection() {
  const items = [
    {
      icon: MessageSquareText,
      iconBg: "bg-[#f5efff] text-[#8b5cf6]",
      title: "Adaptive Questions",
      description:
        "The AI will adjust follow-up questions based on your answers.",
    },
    {
      icon: TrendingUp,
      iconBg: "bg-[#e6fbf9] text-[#0d9488]",
      title: "Real Interview Flow",
      description: "Questions may become deeper as the interview progresses.",
    },
    {
      icon: FileText,
      iconBg: "bg-[#fff7ed] text-[#ea580c]",
      title: "Evaluation After Interview",
      description:
        "You'll receive detailed feedback on your strengths, gaps and next steps.",
    },
  ];

  return (
    <div className="flex w-full flex-col gap-3">
      {/* Section Header */}
      <div className="flex flex-col gap-0.5">
        <h2 className="font-display text-base sm:text-lg font-bold text-ink">
          What to Expect
        </h2>
        <p className="text-xs text-ink-muted">
          Here&apos;s what makes this a real interview experience.
        </p>
      </div>

      {/* 3 Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="flex items-start gap-4 rounded-2xl border border-line bg-white p-5 shadow-2xs"
            >
              <div
                className={`flex size-11 shrink-0 items-center justify-center rounded-full ${item.iconBg}`}
              >
                <Icon className="size-5" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-bold text-sm text-ink">{item.title}</h3>
                <p className="text-xs text-ink-muted leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
