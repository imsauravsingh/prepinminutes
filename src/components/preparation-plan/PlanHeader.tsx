import { Sparkles } from "lucide-react";

export function PlanHeader() {
  return (
    <div className="flex w-full flex-col gap-6">
      {/* Page Title & Subtitle */}
      <div className="flex flex-col gap-1.5">
        <h1 className="font-display text-2xl font-extrabold text-ink sm:text-[32px]">
          My Preparation Plan
        </h1>
        <p className="text-sm text-ink-muted sm:text-[15px]">
          Personalized journey based on your profile, target role, and interview
          timeline
        </p>
      </div>

      {/* Summary Bar */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-line bg-white p-4 sm:flex-row sm:items-center sm:p-5">
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <p className="font-display text-sm font-semibold text-ink sm:text-[15px]">
            Senior Software Engineer · Google · Interview in 12 days
          </p>
          <div className="hidden h-4 w-px bg-line sm:block" aria-hidden />
          <div className="flex items-center gap-1.5 text-xs text-ink-muted sm:text-[13px]">
            <Sparkles className="size-4 shrink-0 text-brand" />
            <span>Plan adapts as you practice and improve</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-ink-muted sm:text-[13px]">
            Readiness:
          </span>
          <span className="rounded-full bg-brand-soft px-2.5 py-1 text-xs font-extrabold text-brand sm:text-[13px]">
            68%
          </span>
        </div>
      </div>
    </div>
  );
}
