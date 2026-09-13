import { Info, RefreshCw } from "lucide-react";

export function PlanUpdatedCallout() {
  return (
    <div className="flex w-full flex-col gap-5">
      {/* Dynamic adaptability info note */}
      <div className="flex items-start gap-2.5 sm:items-center">
        <Info className="size-4 shrink-0 text-brand mt-0.5 sm:mt-0" />
        <p className="text-[13px] text-ink-muted">
          This plan dynamically adapts as you practice and improve. Complete
          activities to see your readiness score update in real time.
        </p>
      </div>

      {/* Plan updated callout card */}
      <div className="flex flex-col gap-2 rounded-xl border border-[#ede6db] bg-[#faf6f0] p-4 sm:p-5">
        <div className="flex items-center gap-2">
          <RefreshCw className="size-3.5 text-ink-muted shrink-0" />
          <p className="text-[13px] font-bold text-ink">
            Plan Updated · 2 hours ago
          </p>
        </div>
        <p className="text-[13px] leading-relaxed text-ink-muted">
          What changed: Based on your latest evaluation (28% on distributed
          systems), System Design is now your top preparation focus. Scalability
          Fundamentals added as your recommended starting point.
        </p>
      </div>
    </div>
  );
}
