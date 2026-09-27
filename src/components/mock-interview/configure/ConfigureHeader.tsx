"use client";

import Link from "next/link";
import { ArrowLeft, SlidersHorizontal } from "lucide-react";

export function ConfigureHeader() {
  return (
    <div className="flex w-full flex-col gap-4">
      {/* Back button */}
      <div>
        <Link
          href="/mock-interview"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-ink-muted hover:text-ink transition-colors cursor-pointer"
        >
          <ArrowLeft className="size-4" />
          <span>Back to Mock Interview</span>
        </Link>
      </div>

      {/* Main title row */}
      <div className="flex w-full items-start gap-4">
        {/* Purple Sliders Icon Badge */}
        <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-[#ede9fe] bg-[#f5efff] text-[#8b5cf6] shadow-2xs">
          <SlidersHorizontal className="size-6 text-[#8b5cf6]" />
        </div>

        {/* Title & Subtitle */}
        <div className="flex flex-col gap-1">
          <h1 className="font-display text-2xl font-extrabold text-ink sm:text-3xl">
            Configure Mock Interview
          </h1>
          <p className="text-sm text-ink-muted leading-relaxed">
            Customize your mock interview or choose the AI recommended option.
          </p>
        </div>
      </div>
    </div>
  );
}
