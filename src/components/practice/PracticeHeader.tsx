export function PracticeHeader() {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div className="flex flex-col gap-1.5">
        <h1 className="font-display text-2xl font-extrabold text-ink sm:text-[32px]">
          Practice
        </h1>
        <p className="text-sm text-ink-muted sm:text-[15px]">
          AI-recommended practice based on your preparation plan, readiness, and
          performance
        </p>
      </div>

      <div className="shrink-0 text-sm font-medium text-ink-muted">
        0 / 3 completed · ~27 min
      </div>
    </div>
  );
}
