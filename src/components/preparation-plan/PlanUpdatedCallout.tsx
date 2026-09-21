import { Lightbulb, ArrowRight } from "lucide-react";

export function PlanUpdatedCallout() {
  return (
    <div className="flex w-full flex-col justify-between gap-4 rounded-2xl border border-[#dbeafe] bg-[#f0f7ff] p-4 sm:flex-row sm:items-center sm:p-5 shadow-[0_2px_8px_rgba(37,99,235,0.04)]">
      <div className="flex items-center gap-3.5">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#dbeafe] text-[#2563eb]">
          <Lightbulb className="size-5" />
        </div>
        <div className="flex flex-col gap-0.5">
          <p className="font-display text-sm font-extrabold text-ink sm:text-[15px]">
            Your plan adapts as you progress
          </p>
          <p className="text-xs text-ink-muted sm:text-[13px]">
            As you complete topics, upcoming topics and timelines will adjust
            automatically.
          </p>
        </div>
      </div>

      <button
        type="button"
        className="flex w-fit shrink-0 items-center gap-1.5 rounded-full border border-[#bfdbfe] bg-white px-4 py-2 text-xs font-semibold text-[#2563eb] shadow-xs transition-colors hover:bg-blue-50/50 sm:text-sm"
      >
        <span>Learn more about timelines</span>
        <ArrowRight className="size-3.5" />
      </button>
    </div>
  );
}
