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

export function PlanHeader() {
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
            <span>Senior Software Engineer</span>
          </div>

          <span className="text-[#d6cfc4] select-none" aria-hidden>
            |
          </span>

          <div className="flex items-center gap-1.5 font-medium">
            <svg className="size-3.5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.94 0 12s.45 3.84 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>Google</span>
          </div>

          <span className="text-[#d6cfc4] select-none" aria-hidden>
            |
          </span>

          <div className="flex items-center gap-1.5 font-medium">
            <Calendar className="size-4 text-ink-muted shrink-0" />
            <span>Interview in 12 days</span>
          </div>
        </div>
      </div>

      {/* Interview Readiness Card */}
      <div className="flex shrink-0 items-center gap-3.5 rounded-2xl border border-line bg-white p-3.5 sm:px-4 sm:py-3.5 shadow-[0_2px_8px_rgba(30,28,26,0.04)]">
        <ReadinessGauge percentage={68} />
        <div className="flex flex-col gap-0.5">
          <span className="font-display text-sm font-bold text-ink">
            Interview Readiness
          </span>
          <div className="flex items-center gap-1 text-[11px] text-ink-muted">
            <span>Updated after your latest practice</span>
            <ArrowUpRight className="size-3 text-[#10b981] stroke-[2.5]" />
          </div>
        </div>
      </div>
    </div>
  );
}
