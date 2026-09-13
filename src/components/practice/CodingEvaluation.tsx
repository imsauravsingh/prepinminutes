import Link from "next/link";
import { Check, ArrowUp, Lightbulb, TrendingUp } from "lucide-react";

export function CodingEvaluation() {
  return (
    <div className="flex w-full flex-col gap-6 sm:gap-8">
      {/* Practice Header & Progress */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2 text-sm font-medium">
            <span className="font-bold text-brand">1 / 3</span>
            <span className="text-[#b0a898]">•</span>
            <span className="font-semibold text-ink">Data Structures</span>
          </div>
          <span className="text-sm text-ink-muted sm:text-right">
            Evaluation
          </span>
        </div>

        {/* Progress bar (1 of 3 filled ~ 36%) */}
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#ede6db]">
          <div
            className="h-full rounded-full bg-brand transition-all duration-300"
            style={{ width: "36%" }}
          />
        </div>
      </div>

      {/* Main Content Stack */}
      <div className="flex flex-col gap-6">
        {/* Title Header Group */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2.5">
            <span className="rounded-md bg-[#fff0ec] px-2.5 py-1 text-xs font-bold text-brand">
              Data Structures
            </span>
            <span className="text-sm font-semibold text-ink-muted">
              Sliding Window
            </span>
          </div>
          <h1 className="font-display text-2xl font-extrabold text-ink sm:text-[28px] sm:leading-snug">
            Quick Evaluation
          </h1>
        </div>

        {/* Evaluation Card */}
        <div className="flex flex-col gap-6 rounded-2xl border border-line bg-white p-6 shadow-[0_4px_16px_rgba(30,28,26,0.03)] sm:p-8">
          {/* Section 1: What you did well */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#edf5ec] text-[#10b981]">
                <Check className="size-3.5 stroke-[2.5]" />
              </span>
              <h2 className="font-display text-base font-extrabold text-ink">
                What you did well
              </h2>
            </div>
            <div className="flex flex-col gap-1.5 pl-8 text-sm text-ink-muted leading-relaxed">
              <p>• Correctly identified the sliding window approach</p>
              <p>• Clean code structure with good variable naming</p>
            </div>
          </div>

          <hr className="border-line" />

          {/* Section 2: Areas to improve */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#fff0ec] text-brand">
                <ArrowUp className="size-3.5 stroke-[2.5]" />
              </span>
              <h2 className="font-display text-base font-extrabold text-ink">
                Areas to improve
              </h2>
            </div>
            <div className="flex flex-col gap-1.5 pl-8 text-sm text-ink-muted leading-relaxed">
              <p>
                • Consider edge cases: empty array, K larger than array length
              </p>
              <p>
                • Optimize space complexity — current solution uses O(K) extra
                space
              </p>
            </div>
          </div>

          <hr className="border-line" />

          {/* Section 3: Interview feedback */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#f5f3ff] text-[#8b5cf6]">
                <Lightbulb className="size-3.5 stroke-[2.5]" />
              </span>
              <h2 className="font-display text-base font-extrabold text-ink">
                Interview feedback
              </h2>
            </div>
            <div className="pl-8 text-sm text-ink-muted leading-relaxed">
              <p>
                In a real interview, verbalize your thought process while
                coding. Mention the time complexity (O(n)) proactively.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Group */}
        <div className="flex flex-col gap-4 pt-1 sm:flex-row sm:items-center sm:justify-between">
          {/* Readiness Card */}
          <div className="inline-flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-3 shadow-[0_2px_8px_rgba(30,28,26,0.02)]">
            <span className="text-[13px] text-ink-muted">
              Sliding Window Readiness:
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-[13px] text-[#b0a898]">64%</span>
              <span className="text-[13px] text-[#b0a898]">→</span>
              <span className="text-[15px] font-bold text-[#10b981]">71%</span>
              <TrendingUp className="size-3.5 text-[#10b981]" />
            </div>
          </div>

          {/* Continue CTA */}
          <div className="flex justify-end">
            <Link
              href="/practice/session/system-design"
              className="flex items-center justify-center rounded-full bg-brand px-8 py-3 text-[15px] font-semibold text-white shadow-[0_4px_12px_rgba(255,108,71,0.2)] transition-opacity hover:opacity-95 active:scale-[0.99]"
            >
              Continue →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
