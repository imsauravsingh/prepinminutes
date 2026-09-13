function ReadinessMeter({ percentage = 68 }: { percentage?: number }) {
  const size = 48;
  const strokeWidth = 5;
  const radius = size / 2 - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - percentage / 100);

  return (
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
        stroke="#ff6c47"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
      />
    </svg>
  );
}

export function PreparationProgress() {
  const completed = 3;
  const total = 24;
  const percentage = Math.round((completed / total) * 100);

  return (
    <div className="flex w-full flex-col gap-4">
      <h2 className="font-display text-lg font-extrabold text-ink sm:text-xl">
        Preparation Progress
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Activities Completed */}
        <div className="flex flex-col justify-between gap-3 rounded-2xl border border-line bg-white p-5">
          <p className="text-[13px] font-semibold text-ink-muted">
            Activities Completed
          </p>
          <p className="font-display text-[28px] font-extrabold text-ink">
            {completed} / {total}
          </p>
          <div className="h-2 w-full overflow-hidden rounded-full bg-[#fbf9f4]">
            <div
              className="h-full rounded-full bg-brand"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Interview Readiness */}
        <div className="flex flex-col justify-between gap-3 rounded-2xl border border-line bg-white p-5">
          <p className="text-[13px] font-semibold text-ink-muted">
            Interview Readiness
          </p>
          <div className="flex items-center gap-4">
            <ReadinessMeter percentage={68} />
            <p className="font-display text-[28px] font-extrabold text-ink">
              68%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
