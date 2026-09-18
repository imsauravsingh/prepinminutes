import Link from "next/link";
import { Check, ArrowUp, Lightbulb, TrendingUp } from "lucide-react";

export function BehavioralEvaluation() {
  return (
    <div className="flex w-full flex-col gap-6 sm:gap-8 max-w-[1064px]">
      {/* Practice Header & Progress */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2 text-sm font-medium">
            <span className="font-bold text-brand">3 / 3</span>
            <span className="text-[#b0a898]">•</span>
            <span className="font-semibold text-ink">Behavioral</span>
          </div>
          <span className="text-sm text-ink-muted sm:text-right">
            Evaluation
          </span>
        </div>

        {/* Progress bar (all 3 steps completed/evaluated - 100% full) */}
        <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-[#ede6db]">
          <div
            className="h-full bg-[#10b981] transition-all duration-300"
            style={{ width: "33.3%" }}
            title="Step 1 Coding Evaluated"
          />
          <div
            className="h-full bg-[#10b981] transition-all duration-300"
            style={{ width: "33.3%" }}
            title="Step 2 System Design Evaluated"
          />
          <div
            className="h-full bg-[#10b981] transition-all duration-300"
            style={{ width: "33.4%" }}
            title="Step 3 Behavioral Evaluated"
          />
        </div>
      </div>

      {/* Main Content Stack */}
      <div className="flex flex-col gap-6">
        {/* Title Header Group */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2.5">
            <span className="rounded-md bg-[#fff0ec] px-2.5 py-1 text-xs font-bold text-brand">
              Behavioral
            </span>
            <span className="text-sm font-semibold text-ink-muted">
              Leadership &amp; Conflict
            </span>
          </div>
          <h1 className="font-display text-2xl font-extrabold text-ink sm:text-[28px] sm:leading-snug">
            Quick Evaluation
          </h1>
        </div>

        {/* Evaluation Card (evaluation-card-creamy) */}
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
              <p>
                • Effective application of the STAR method (Situation, Task,
                Action, Result)
              </p>
              <p>
                • Demonstrated data-driven conflict resolution without ego or
                defensiveness
              </p>
              <p>
                • Highlighted positive team collaboration and long-term
                alignment with your peer
              </p>
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
                • Quantify the engineering impact more explicitly (e.g. latency
                improvement, throughput, SLA adherence)
              </p>
              <p>
                • Explain how you engaged cross-functional stakeholders
                (Product, QA) during consensus building
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
                In Google behavioral interviews, focus on
                &quot;Googliness&quot;: navigating conflicts with emotional
                intelligence, prioritizing user and team outcomes over ego, and
                demonstrating how you disagree and commit constructively.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Group */}
        <div className="flex flex-col gap-4 pt-1 sm:flex-row sm:items-center sm:justify-between">
          {/* Readiness Card */}
          <div className="inline-flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-3 shadow-[0_2px_8px_rgba(30,28,26,0.02)]">
            <span className="text-[13px] text-ink-muted">
              Leadership &amp; Conflict Readiness:
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-[13px] text-[#b0a898]">52%</span>
              <span className="text-[13px] text-[#b0a898]">→</span>
              <span className="text-[15px] font-bold text-[#10b981]">60%</span>
              <TrendingUp className="size-3.5 text-[#10b981]" />
            </div>
          </div>

          {/* Continue CTA to Session Complete */}
          <div className="flex justify-end">
            <Link
              href="/practice/session/complete"
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
