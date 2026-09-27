"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";

export function BriefingBottomBar() {
  const router = useRouter();
  const [isStarting, setIsStarting] = useState(false);

  const handleStartInterview = () => {
    if (isStarting) return;
    setIsStarting(true);
    setTimeout(() => {
      router.push("/practice/session/system-design");
    }, 450);
  };

  return (
    <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pt-2">
      {/* Back to Configuration */}
      <Link
        href="/mock-interview/configure"
        className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#cbd5e1] bg-white px-5 py-3.5 sm:py-3 text-sm font-semibold text-ink shadow-2xs hover:bg-cream hover:border-[#94a3b8] transition-all cursor-pointer w-full sm:w-auto text-center"
      >
        <ArrowLeft className="size-4" />
        <span>Back to Configuration</span>
      </Link>

      {/* Start Interview CTA */}
      <button
        type="button"
        onClick={handleStartInterview}
        disabled={isStarting}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#ff5520] px-7 py-3.5 sm:py-3 text-sm font-bold text-white shadow-[0_4px_14px_rgba(255,85,32,0.35)] transition-all hover:bg-[#eb4a19] active:scale-[0.98] disabled:opacity-80 cursor-pointer w-full sm:w-auto"
      >
        {isStarting ? (
          <>
            <Loader2 className="size-4 animate-spin text-white" />
            <span>Starting Interview…</span>
          </>
        ) : (
          <>
            <span>Start Interview</span>
            <ArrowRight className="size-4" />
          </>
        )}
      </button>
    </div>
  );
}
