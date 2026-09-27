"use client";

import {
  Lightbulb,
  MessageSquare,
  HelpCircle,
  CheckSquare,
} from "lucide-react";

export function BeforeYouStartCard() {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 rounded-2xl border border-[#fef08a] bg-gradient-to-r from-[#fffbeb] via-[#fffdf0] to-[#fffbeb] p-5 sm:p-6 shadow-2xs">
      {/* Left: Main Advice */}
      <div className="flex items-start gap-3.5 max-w-md">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#fef9c3] text-[#ca8a04] shadow-2xs">
          <Lightbulb className="size-5" />
        </div>
        <div className="flex flex-col gap-0.5">
          <h3 className="font-bold text-sm text-ink">Before You Start</h3>
          <p className="text-xs text-ink-muted leading-relaxed">
            Treat this like a real interview. Explain your assumptions,
            reasoning and decisions clearly.
          </p>
        </div>
      </div>

      {/* Vertical Divider (Desktop) */}
      <div className="hidden lg:block w-px self-stretch bg-[#fde047]/60" />

      {/* Right: 3 Tips Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1">
        {/* Tip 1 */}
        <div className="flex items-start gap-2.5">
          <MessageSquare className="size-4 shrink-0 text-[#2563eb] mt-0.5" />
          <div className="flex flex-col">
            <span className="text-xs font-bold text-ink">Think aloud</span>
            <span className="text-[11px] text-ink-muted leading-tight">
              Explain how you approach the problem.
            </span>
          </div>
        </div>

        {/* Tip 2 */}
        <div className="flex items-start gap-2.5">
          <HelpCircle className="size-4 shrink-0 text-[#2563eb] mt-0.5" />
          <div className="flex flex-col">
            <span className="text-xs font-bold text-ink">Ask when needed</span>
            <span className="text-[11px] text-ink-muted leading-tight">
              Clarify requirements just like a real interview.
            </span>
          </div>
        </div>

        {/* Tip 3 */}
        <div className="flex items-start gap-2.5">
          <CheckSquare className="size-4 shrink-0 text-[#2563eb] mt-0.5" />
          <div className="flex flex-col">
            <span className="text-xs font-bold text-ink">
              Don&apos;t worry about perfection
            </span>
            <span className="text-[11px] text-ink-muted leading-tight">
              The goal is to understand how you think and improve.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
