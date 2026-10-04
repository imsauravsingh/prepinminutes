"use client";

import Link from "next/link";
import {
  Database,
  Cloud,
  CodeXml,
  Users,
  AlertCircle,
  Check,
  ArrowRight,
} from "lucide-react";

export function PerformanceByArea() {
  const areas = [
    {
      id: "system-design",
      name: "System Design",
      icon: Database,
      iconBg: "bg-[#fff0ec] text-brand border border-[#ffd8cc]",
      readiness: 42,
      readinessColor: "text-brand",
      barColor: "bg-brand",
      scores: [
        { label: "Practice Score", value: "48%" },
        { label: "Interview Answers", value: "38%" },
        { label: "Concept Recall", value: "61%" },
      ],
      statusType: "needs-practice" as const,
      statusLabel: "Needs practice",
      href: "/practice/topics?area=system-design",
      accentColor: "text-brand",
    },
    {
      id: "aws-cloud",
      name: "AWS & Cloud",
      icon: Cloud,
      iconBg: "bg-[#eff6ff] text-[#2563eb] border border-[#dbeafe]",
      readiness: 71,
      readinessColor: "text-[#2563eb]",
      barColor: "bg-[#2563eb]",
      scores: [
        { label: "Practice Score", value: "74%" },
        { label: "Interview Answers", value: "68%" },
        { label: "Concept Recall", value: "72%" },
      ],
      statusType: "on-track" as const,
      statusLabel: "On track",
      href: "/practice/topics?area=aws-cloud",
      accentColor: "text-[#2563eb]",
    },
    {
      id: "coding-patterns",
      name: "Coding Patterns",
      icon: CodeXml,
      iconBg: "bg-[#edf5ec] text-[#10b981] border border-[#d1fae5]",
      readiness: 78,
      readinessColor: "text-[#10b981]",
      barColor: "bg-[#10b981]",
      scores: [
        { label: "Practice Score", value: "81%" },
        { label: "Problem Solving", value: "76%" },
        { label: "Concept Recall", value: "78%" },
      ],
      statusType: "on-track" as const,
      statusLabel: "On track",
      href: "/practice/topics?area=coding-patterns",
      accentColor: "text-[#10b981]",
    },
    {
      id: "behavioral",
      name: "Behavioral",
      icon: Users,
      iconBg: "bg-[#f5f3ff] text-[#7c3aed] border border-[#ede9fe]",
      readiness: 91,
      readinessColor: "text-[#7c3aed]",
      barColor: "bg-[#7c3aed]",
      scores: [
        { label: "Practice Score", value: "88%" },
        { label: "Interview Answers", value: "92%" },
        { label: "Communication", value: "84%" },
      ],
      statusType: "strong" as const,
      statusLabel: "Strong",
      href: "/practice/topics?area=behavioral",
      accentColor: "text-[#7c3aed]",
    },
  ];

  return (
    <div className="flex flex-col gap-3.5">
      {/* Section Title & Subtitle */}
      <div className="flex flex-col gap-0.5">
        <h2 className="font-display text-base sm:text-lg font-extrabold text-ink">
          Performance by Area
        </h2>
        <p className="text-xs text-ink-muted">
          Your current readiness and performance based on all evaluations and
          practice sessions.
        </p>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {areas.map((area) => {
          const Icon = area.icon;

          return (
            <div
              key={area.id}
              className="flex flex-col justify-between rounded-2xl border border-line bg-white p-5 shadow-2xs hover:border-line-strong hover:shadow-xs transition-all"
            >
              <div>
                {/* Header: Icon + Name & Readiness */}
                <div className="flex items-center gap-3">
                  <div
                    className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${area.iconBg}`}
                  >
                    <Icon className="size-5" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-display font-bold text-xs sm:text-sm text-ink truncate">
                      {area.name}
                    </span>
                    <span
                      className={`font-mono text-xs font-bold ${area.readinessColor}`}
                    >
                      {area.readiness}%{" "}
                      <span className="font-sans font-normal text-ink-muted">
                        Ready
                      </span>
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-3.5 h-1.5 w-full overflow-hidden rounded-full bg-line">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${area.barColor}`}
                    style={{ width: `${area.readiness}%` }}
                  />
                </div>

                {/* Score Breakdown (Key - Value Pairs) */}
                <div className="mt-4 flex flex-col gap-2 pt-1 border-t border-line/50 text-xs">
                  {area.scores.map((s) => (
                    <div
                      key={s.label}
                      className="flex items-center justify-between text-ink-muted"
                    >
                      <span>{s.label}</span>
                      <span className="font-mono font-bold text-ink">
                        {s.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Footer: Status Pill + Navigation Link */}
              <div className="mt-5 flex items-center justify-between pt-3 border-t border-line/60">
                {area.statusType === "needs-practice" ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#fff0ec] px-2 sm:px-2.5 py-0.5 text-[10px] sm:text-[11px] font-semibold text-[#ef4444] border border-[#fecaca]">
                    <AlertCircle className="size-3 fill-[#ef4444] text-white" />
                    <span>{area.statusLabel}</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#edf5ec] px-2 sm:px-2.5 py-0.5 text-[10px] sm:text-[11px] font-semibold text-[#10b981] border border-[#d1fae5]">
                    <Check className="size-3 stroke-[2.5]" />
                    <span>{area.statusLabel}</span>
                  </span>
                )}

                <Link
                  href={area.href}
                  className="flex size-7 items-center justify-center rounded-full hover:bg-cream text-ink-muted hover:text-ink transition-colors"
                  aria-label={`View ${area.name} topics`}
                >
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
