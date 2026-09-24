"use client";

import { FileText, Calendar, ArrowUpRight } from "lucide-react";

export function InterviewReadinessCard({
  percentage = 68,
  growth = "+8%",
}: {
  percentage?: number;
  growth?: string;
}) {
  const size = 120;
  const strokeWidth = 8;
  const radius = size / 2 - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - percentage / 100);

  return (
    <div className="flex w-full lg:w-[320px] shrink-0 flex-col justify-between gap-5 rounded-2xl border border-line bg-white p-5 sm:p-6 shadow-2xs">
      {/* Title */}
      <div>
        <h2 className="font-display text-base font-bold text-ink">
          Interview Readiness
        </h2>
      </div>

      {/* Circular Gauge 68% */}
      <div className="flex flex-col items-center justify-center gap-2">
        <div className="relative flex size-28 sm:size-32 items-center justify-center">
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className="-rotate-90 select-none"
          >
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="#f4efe8"
              strokeWidth={strokeWidth}
            />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="#ff6c47"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="transition-all duration-700 ease-out"
            />
          </svg>

          {/* Center Text */}
          <div className="absolute flex flex-col items-center justify-center">
            <span className="font-display text-2xl sm:text-3xl font-extrabold text-ink leading-none">
              {percentage}%
            </span>
            <span className="text-xs font-semibold text-ink-muted mt-1">
              Ready
            </span>
          </div>
        </div>

        {/* Growth badge */}
        <div className="flex items-center gap-1 text-xs font-bold text-[#10b981]">
          <ArrowUpRight className="size-3.5 stroke-[2.5]" />
          <span>{growth}</span>
          <span className="font-normal text-ink-muted">since last week</span>
        </div>
      </div>

      {/* Info Stack */}
      <div className="flex flex-col gap-3 pt-3 border-t border-line/60">
        {/* Info 1: Based on 18 evaluations */}
        <div className="flex items-start gap-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-[#eff6ff] text-[#2563eb]">
            <FileText className="size-4" />
          </div>
          <p className="text-xs text-ink-muted leading-relaxed">
            Based on{" "}
            <span className="font-semibold text-ink">18 evaluations</span> and{" "}
            <span className="font-semibold text-ink">24 practice sessions</span>
          </p>
        </div>

        {/* Info 2: Interview in 12 days */}
        <div className="flex items-start gap-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-[#eff6ff] text-[#2563eb]">
            <Calendar className="size-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-ink">
              Interview in 12 days
            </span>
            <span className="text-[11px] text-ink-muted">
              Google · Senior Software Engineer
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
