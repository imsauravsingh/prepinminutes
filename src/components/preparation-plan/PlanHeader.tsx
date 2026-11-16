import { User, Calendar, ArrowUpRight } from "lucide-react";

function ReadinessGauge({ percentage = 68 }: { percentage?: number }) {
  const size = 56;
  const strokeWidth = 5;
  const radius = size / 2 - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - percentage / 100);

  return (
    <div className="relative flex size-14 items-center justify-center shrink-0">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
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
          stroke="#ea580c"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <span className="absolute font-display text-sm font-extrabold text-ink">
        {percentage}%
      </span>
    </div>
  );
}

interface PlanHeaderProps {
  targetRole?: string;
  company?: string;
  readinessScore?: number;
  timelineLabel?: string;
}

export function PlanHeader({
  targetRole = "Senior Software Engineer",
  company = "Google",
  readinessScore = 68,
  timelineLabel = "1 month",
}: PlanHeaderProps) {
  return (
    <div className="flex w-full flex-col justify-between gap-6 lg:flex-row lg:items-center">
      {/* Title, Subtitle & Metadata */}
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-2xl font-extrabold text-ink sm:text-[32px] tracking-tight">
          My Preparation Plan
        </h1>
        <p className="text-xs text-ink-muted sm:text-sm">
          A personalized plan based on your target role, experience and
          interview timeline.
        </p>

        {/* Badges metadata bar */}
        <div className="mt-2 flex flex-wrap items-center gap-2.5 text-xs text-ink sm:gap-3 sm:text-[13px]">
          <div className="flex items-center gap-1.5 font-medium">
            <User className="size-4 text-ink-muted shrink-0" />
            <span>{targetRole}</span>
          </div>

          <span className="text-[#d6cfc4] select-none" aria-hidden>
            |
          </span>

          <div className="flex items-center gap-1.5 font-medium">
            <span className="font-semibold text-ink">{company}</span>
          </div>

          <span className="text-[#d6cfc4] select-none" aria-hidden>
            |
          </span>

          <div className="flex items-center gap-1.5 font-medium">
            <Calendar className="size-4 text-ink-muted shrink-0" />
            <span>Timeline: {timelineLabel}</span>
          </div>
        </div>
      </div>

      {/* Readiness gauge callout */}
      <div className="flex items-center gap-4 rounded-2xl border border-line bg-white p-3.5 sm:px-5 sm:py-3.5 shadow-[0_2px_12px_rgba(30,28,26,0.04)]">
        <ReadinessGauge percentage={readinessScore} />
        <div className="flex flex-col gap-0.5">
          <span className="font-display text-xs font-bold uppercase tracking-wider text-ink-muted">
            Target Readiness
          </span>
          <span className="font-display text-base font-extrabold text-ink">
            {readinessScore >= 70 ? "On Track for Strong Hire" : "Preparation in Progress"}
          </span>
        </div>
      </div>
    </div>
  );
}
