"use client";

import { useUser } from "@clerk/react";
import { toTitleCase } from "@/lib/format";

export function OnboardingHeader() {
  const { user } = useUser();
  const userName = user?.firstName ? toTitleCase(user.firstName) : null;

  return (
    <div className="flex w-full flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      {/* Left side: Step kicker, Heading, Subtitle */}
      <div className="flex flex-col gap-1.5">
        <span className="text-[11px] font-bold uppercase tracking-wider text-brand">
          Step 1 of 3
        </span>
        <h1 className="font-display text-2xl font-extrabold text-ink sm:text-3xl lg:text-[30px] tracking-tight">
          Welcome {userName ? `${userName} ` : "to PrepInMinutes "}👋
        </h1>
        <p className="text-sm sm:text-[15px] text-ink-muted">
          Let&apos;s build your personalized interview preparation plan.
        </p>
      </div>

      {/* Right side: Setup Progress Stepper */}
      <div className="flex flex-col gap-2 lg:items-end">
        <span className="text-[11px] font-bold uppercase tracking-wider text-brand">
          Setup Progress · Step 1 of 3
        </span>

        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          {/* Step 1 */}
          <span className="inline-flex items-center rounded-full bg-brand px-3 py-1 text-[11px] font-bold text-white shadow-xs">
            1 Set Up
          </span>

          <span className="text-xs font-medium text-[#b0a898]">→</span>

          {/* Step 2 */}
          <span className="inline-flex items-center rounded-full border border-[#ede6db] bg-[#faf6f0] px-3 py-1 text-[11px] font-medium text-[#6b6661]">
            2 Get Plan
          </span>

          <span className="text-xs font-medium text-[#b0a898]">→</span>

          {/* Step 3 */}
          <span className="inline-flex items-center rounded-full border border-[#ede6db] bg-[#faf6f0] px-3 py-1 text-[11px] font-medium text-[#6b6661]">
            3 Start Preparing
          </span>
        </div>
      </div>
    </div>
  );
}
