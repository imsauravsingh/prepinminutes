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
    <div className="flex items-center gap-2 sm:gap-2.5">
      {/* 1. Step 1: Set Up */}
      {currentStep > 1 ? (
        onEditSetup ? (
          <button
            type="button"
            onClick={onEditSetup}
            className="flex items-center gap-1.5 text-xs sm:text-[13px] font-semibold text-ink hover:text-brand transition-colors cursor-pointer"
          >
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#10754d] text-white">
              <Check className="size-3.5 stroke-[3]" />
            </span>
            <span>Set Up</span>
          </button>
        ) : (
          <Link
            href="/dashboard?setup=true"
            className="flex items-center gap-1.5 text-xs sm:text-[13px] font-semibold text-ink hover:text-brand transition-colors"
          >
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#10754d] text-white">
              <Check className="size-3.5 stroke-[3]" />
            </span>
            <span>Set Up</span>
          </Link>
        )
      ) : (
        <div className="flex items-center gap-1.5 text-xs sm:text-[13px] font-bold text-ink">
          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand text-white shadow-xs">
            1
          </span>
          <span>Set Up</span>
        </div>
      )}

      {/* Connecting Line 1 */}
      <div
        className={`h-[2px] w-6 sm:w-7 rounded-full ${
          currentStep >= 2 ? "bg-[#fcb7a5]" : "bg-[#e5e1d8]"
        }`}
      />

      {/* 2. Step 2: Next Step */}
      {currentStep > 2 ? (
        <Link
          href="/dashboard/plan-ready"
          className="flex items-center gap-1.5 text-xs sm:text-[13px] font-semibold text-ink hover:text-brand transition-colors"
        >
          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#10754d] text-white">
            <Check className="size-3.5 stroke-[3]" />
          </span>
          <span>Next Step</span>
        </Link>
      ) : currentStep === 2 ? (
        <div className="flex items-center gap-1.5 text-xs sm:text-[13px] font-bold text-ink">
          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand text-white shadow-xs">
            2
          </span>
          <span>Next Step</span>
        </div>
      ) : (
        <div className="flex items-center gap-1.5 text-xs sm:text-[13px] font-medium text-[#8a92a0]">
          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#f0ede6] text-[#8a92a0]">
            2
          </span>
          <span>Next Step</span>
        </div>
      )}

      {/* Connecting Line 2 */}
      <div
        className={`h-[2px] w-6 sm:w-7 rounded-full ${
          currentStep === 3 ? "bg-[#fcb7a5]" : "bg-[#e5e1d8]"
        }`}
      />

      {/* 3. Step 3: Start Preparing */}
      {currentStep === 3 ? (
        <div className="flex items-center gap-1.5 text-xs sm:text-[13px] font-bold text-ink">
          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand text-white shadow-xs">
            3
          </span>
          <span>Start Preparing</span>
        </div>
      ) : (
        <div className="flex items-center gap-1.5 text-xs sm:text-[13px] font-medium text-[#8a92a0]">
          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#f0ede6] text-[#8a92a0]">
            3
          </span>
          <span>Start Preparing</span>
        </div>
      )}
    </div>
  );
}
