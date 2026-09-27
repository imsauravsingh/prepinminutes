"use client";

import { Mic } from "lucide-react";

export function MockInterviewHeader() {
  return (
    <div className="flex w-full items-start gap-4">
      {/* Mic Icon Badge */}
      <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-[#ede9fe] bg-[#f5efff] text-[#8b5cf6] shadow-2xs">
        <Mic className="size-6 text-[#8b5cf6]" />
      </div>

      {/* Title & Subtitle */}
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-2xl font-extrabold text-ink sm:text-3xl">
          Mock Interview
        </h1>
        <p className="text-sm text-ink-muted leading-relaxed">
          Simulate a real interview with AI and see how you perform under interview conditions.
        </p>
      </div>
    </div>
  );
}
