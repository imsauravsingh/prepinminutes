"use client";

import { useUser } from "@clerk/react";
import { toTitleCase } from "@/lib/format";
import { DashboardStepper } from "@/components/dashboard/DashboardStepper";

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

      {/* Right side: Stepper */}
      <div className="flex flex-col gap-2 lg:items-end">
        <DashboardStepper currentStep={1} />
      </div>
    </div>
  );
}
