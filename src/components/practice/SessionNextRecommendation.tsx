import Link from "next/link";
import { Sparkles } from "lucide-react";

export function SessionNextRecommendation() {
  return (
    <div className="mx-auto flex w-full max-w-[1064px] flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-2xl font-extrabold text-ink sm:text-[28px] sm:leading-[35px]">
          What&apos;s Next
        </h1>
      </div>

      {/* Recommendation Card */}
      <div className="flex flex-col sm:flex-row overflow-hidden rounded-[20px] border border-line bg-white shadow-[0_4px_16px_rgba(30,28,26,0.03)]">
        {/* Left Orange Accent Strip */}
        <div
          className="h-2 w-full shrink-0 bg-brand sm:h-auto sm:w-2"
          aria-hidden
        />

        {/* Card Content */}
        <div className="flex flex-1 flex-col gap-6 p-6 sm:p-8">
          {/* AI Recommendation Message */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1.5 text-brand">
              <Sparkles className="size-3.5 fill-brand text-brand" />
              <span className="text-xs font-bold uppercase tracking-wider text-brand">
                AI Recommendation
              </span>
            </div>
            <p className="text-[15px] leading-[22px] text-ink font-normal">
              System Design is still your biggest preparation gap at 35%
              readiness. Continue with Database Sharding in your next practice
              session to build on today&apos;s load balancing progress.
            </p>
          </div>

          {/* Progression Map */}
          <div className="flex flex-col gap-4 pt-1 sm:flex-row sm:items-center sm:gap-4 sm:justify-between">
            {/* Step 1: Today */}
            <div className="flex flex-1 flex-col gap-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#b0a898]">
                Today
              </span>
              <span className="text-sm font-semibold text-ink-muted">
                Load Balancing
              </span>
            </div>

            {/* Separator Arrow */}
            <span
              className="hidden text-sm text-[#b0a898] sm:inline"
              aria-hidden
            >
              →
            </span>

            {/* Step 2: Next Session */}
            <div className="flex flex-1 flex-col gap-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-brand">
                Next Session
              </span>
              <span className="text-sm font-bold text-ink">
                Database Sharding
              </span>
            </div>

            {/* Separator Arrow */}
            <span
              className="hidden text-sm text-[#b0a898] sm:inline"
              aria-hidden
            >
              →
            </span>

            {/* Step 3: Upcoming */}
            <div className="flex flex-1 flex-col gap-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#b0a898]">
                Upcoming
              </span>
              <span className="text-sm font-semibold text-ink-muted">
                CAP Theorem
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Buttons & Status Note */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Link
            href="/preparation-plan"
            className="flex h-11 w-full sm:w-auto items-center justify-center rounded-full bg-brand px-8 text-[15px] font-semibold text-white shadow-[0_4px_12px_rgba(255,108,71,0.2)] transition-opacity hover:opacity-95 active:scale-[0.99]"
          >
            View Preparation Plan →
          </Link>
          <Link
            href="/practice"
            className="flex h-11 w-full sm:w-auto items-center justify-center rounded-full border border-brand bg-white px-6 text-[15px] font-semibold text-brand transition-colors hover:bg-[#fff0ec] active:scale-[0.99]"
          >
            Back to Practice
          </Link>
        </div>
        <p className="text-xs text-[#b0a898]">
          Your Preparation Plan has been updated based on today&apos;s practice
          results.
        </p>
      </div>
    </div>
  );
}
