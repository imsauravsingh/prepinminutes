"use client";

import Link from "next/link";
import { Check } from "lucide-react";

interface DashboardStepperProps {
  currentStep: 1 | 2 | 3;
  onEditSetup?: () => void;
}

export function DashboardStepper({
  currentStep,
  onEditSetup,
}: DashboardStepperProps) {
  return (
    <div className="inline-flex items-center gap-2 sm:gap-3 rounded-full border border-line/80 bg-white px-3 sm:px-4 py-1.5 sm:py-2 shadow-2xs shrink-0 max-w-full overflow-x-auto no-scrollbar">
      {/* 1. Step 1: Set Up */}
      {currentStep > 1 ? (
        onEditSetup ? (
          <button
            type="button"
            onClick={onEditSetup}
            className="group flex items-center gap-1.5 text-xs sm:text-[13px] font-semibold text-ink hover:text-brand transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <span className="flex size-5.5 sm:size-6 shrink-0 items-center justify-center rounded-full bg-[#10b981] text-white shadow-2xs group-hover:bg-brand transition-colors">
              <Check className="size-3 sm:size-3.5 stroke-[2.5]" />
            </span>
            <span className="whitespace-nowrap">Set Up</span>
          </button>
        ) : (
          <Link
            href="/dashboard?setup=true"
            className="group flex items-center gap-1.5 text-xs sm:text-[13px] font-semibold text-ink hover:text-brand transition-colors whitespace-nowrap shrink-0"
          >
            <span className="flex size-5.5 sm:size-6 shrink-0 items-center justify-center rounded-full bg-[#10b981] text-white shadow-2xs group-hover:bg-brand transition-colors">
              <Check className="size-3 sm:size-3.5 stroke-[2.5]" />
            </span>
            <span className="whitespace-nowrap">Set Up</span>
          </Link>
        )
      ) : (
        <div className="flex items-center gap-1.5 text-xs sm:text-[13px] font-bold text-ink whitespace-nowrap shrink-0">
          <span className="flex size-5.5 sm:size-6 shrink-0 items-center justify-center rounded-full bg-brand text-white shadow-xs">
            1
          </span>
          <span className="whitespace-nowrap">Set Up</span>
        </div>
      )}

      {/* Connecting Line 1 */}
      <div
        className={`h-[2px] w-4 sm:w-6 shrink-0 rounded-full transition-colors ${
          currentStep >= 2 ? "bg-[#10b981]" : "bg-line"
        }`}
      />

      {/* 2. Step 2: Next Step */}
      {currentStep > 2 ? (
        <Link
          href="/dashboard/plan-ready"
          className="group flex items-center gap-1.5 text-xs sm:text-[13px] font-semibold text-ink hover:text-brand transition-colors whitespace-nowrap shrink-0"
        >
          <span className="flex size-5.5 sm:size-6 shrink-0 items-center justify-center rounded-full bg-[#10b981] text-white shadow-2xs group-hover:bg-brand transition-colors">
            <Check className="size-3 sm:size-3.5 stroke-[2.5]" />
          </span>
          <span className="whitespace-nowrap">Next Step</span>
        </Link>
      ) : currentStep === 2 ? (
        <div className="flex items-center gap-1.5 text-xs sm:text-[13px] font-bold text-ink whitespace-nowrap shrink-0">
          <span className="flex size-5.5 sm:size-6 shrink-0 items-center justify-center rounded-full bg-brand text-white shadow-xs">
            2
          </span>
          <span className="whitespace-nowrap">Next Step</span>
        </div>
      ) : (
        <div className="flex items-center gap-1.5 text-xs sm:text-[13px] font-medium text-ink-muted whitespace-nowrap shrink-0">
          <span className="flex size-5.5 sm:size-6 shrink-0 items-center justify-center rounded-full bg-[#f3f4f6] text-ink-muted border border-line">
            2
          </span>
          <span className="whitespace-nowrap">Next Step</span>
        </div>
      )}

      {/* Connecting Line 2 */}
      <div
        className={`h-[2px] w-4 sm:w-6 shrink-0 rounded-full transition-colors ${
          currentStep === 3 ? "bg-brand" : "bg-line"
        }`}
      />

      {/* 3. Step 3: Start Preparing */}
      {currentStep === 3 ? (
        <div className="flex items-center gap-1.5 text-xs sm:text-[13px] font-bold text-ink whitespace-nowrap shrink-0">
          <span className="flex size-5.5 sm:size-6 shrink-0 items-center justify-center rounded-full bg-brand text-white shadow-xs">
            3
          </span>
          <span className="whitespace-nowrap">Start Preparing</span>
        </div>
      ) : (
        <div className="flex items-center gap-1.5 text-xs sm:text-[13px] font-medium text-ink-muted whitespace-nowrap shrink-0">
          <span className="flex size-5.5 sm:size-6 shrink-0 items-center justify-center rounded-full bg-[#f3f4f6] text-ink-muted border border-line">
            3
          </span>
          <span className="whitespace-nowrap">Start Preparing</span>
        </div>
      )}
    </div>
  );
}
