"use client";

import Link from "next/link";
import {
  Database,
  Cloud,
  Users,
  CodeXml,
  ChevronRight,
  ArrowRight,
} from "lucide-react";

export function RecentEvaluationsList() {
  const evaluations = [
    {
      id: "eval-1",
      title: "Scalability Fundamentals",
      subtitle: "System Design · Interview Practice",
      icon: Database,
      iconBg: "bg-[#fff0ec] text-brand",
      score: "78%",
      scoreType: "high",
      date: "Sep 24, 2026",
      href: "/practice/topics",
    },
    {
      id: "eval-2",
      title: "ECS Architecture",
      subtitle: "AWS & Cloud · Knowledge Evaluation",
      icon: Cloud,
      iconBg: "bg-[#eff6ff] text-[#2563eb]",
      score: "71%",
      scoreType: "high",
      date: "Sep 23, 2026",
      href: "/practice/topics",
    },
    {
      id: "eval-3",
      title: "Leadership and Conflict",
      subtitle: "Behavioral · Interview Practice",
      icon: Users,
      iconBg: "bg-[#f5f3ff] text-[#7c3aed]",
      score: "84%",
      scoreType: "high",
      date: "Sep 22, 2026",
      href: "/practice/session/behavioral",
    },
    {
      id: "eval-4",
      title: "CAP Theorem",
      subtitle: "System Design · Knowledge Evaluation",
      icon: Database,
      iconBg: "bg-[#fff0ec] text-brand",
      score: "62%",
      scoreType: "medium",
      date: "Sep 21, 2026",
      href: "/practice/topics",
    },
    {
      id: "eval-5",
      title: "Dynamic Programming",
      subtitle: "Coding Patterns · Problem Solving",
      icon: CodeXml,
      iconBg: "bg-[#edf5ec] text-[#10b981]",
      score: "76%",
      scoreType: "high",
      date: "Sep 20, 2026",
      href: "/practice/topics",
    },
  ];

  return (
    <div className="flex w-full lg:w-[420px] shrink-0 flex-col justify-between rounded-2xl border border-line bg-white p-5 sm:p-6 shadow-2xs">
      {/* Header: Title + View all */}
      <div className="flex items-center justify-between pb-3 border-b border-line/60">
        <h2 className="font-display text-base font-bold text-ink">
          Recent Evaluations
        </h2>
        <Link
          href="/practice/topics"
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#2563eb] hover:underline"
        >
          <span>View all</span>
          <ArrowRight className="size-3" />
        </Link>
      </div>

      {/* List items */}
      <div className="flex flex-col divide-y divide-line/60">
        {evaluations.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.id}
              href={item.href}
              className="group flex items-center justify-between gap-3 py-3 hover:bg-cream/40 px-1 rounded-xl transition-colors"
            >
              {/* Left: Icon + Title & Subtitle */}
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div
                  className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${item.iconBg}`}
                >
                  <Icon className="size-4" />
                </div>

                <div className="flex flex-col min-w-0">
                  <span className="font-display text-xs font-bold text-ink truncate group-hover:text-brand transition-colors">
                    {item.title}
                  </span>
                  <span className="text-[11px] text-ink-muted truncate">
                    {item.subtitle}
                  </span>
                </div>
              </div>

              {/* Right: Score Badge + Date + Chevron */}
              <div className="flex items-center gap-2.5 shrink-0">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-bold font-mono ${
                    item.scoreType === "high"
                      ? "bg-[#edf5ec] text-[#10b981]"
                      : "bg-[#fffbeb] text-[#d97706]"
                  }`}
                >
                  {item.score}
                </span>

                <span className="text-[11px] text-ink-muted hidden sm:inline whitespace-nowrap">
                  {item.date}
                </span>

                <ChevronRight className="size-3.5 text-ink-muted group-hover:text-ink transition-colors" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
