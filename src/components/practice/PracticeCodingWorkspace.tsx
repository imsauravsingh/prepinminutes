"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Clock } from "lucide-react";

const INITIAL_CODE = `def max_subarray_sum(arr, k):
    # Write your solution here
    pass`;

export function PracticeCodingWorkspace() {
  const [code, setCode] = useState(INITIAL_CODE);
  const [secondsRemaining, setSecondsRemaining] = useState(600); // 10 minutes

  // Countdown timer
  useEffect(() => {
    if (secondsRemaining <= 0) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [secondsRemaining]);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex w-full flex-col gap-6 sm:gap-8">
      {/* Practice Header & Progress */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2 text-sm font-medium">
            <span className="font-bold text-brand">1 / 3</span>
            <span className="text-[#b0a898]">•</span>
            <span className="font-semibold text-ink">Data Structures</span>
          </div>
          <span className="text-sm text-ink-muted sm:text-right">
            ~27 min remaining
          </span>
        </div>

        {/* Progress bar (1 of 3 filled ~ 36%) */}
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#ede6db]">
          <div
            className="h-full rounded-full bg-brand transition-all duration-300"
            style={{ width: "36%" }}
          />
        </div>
      </div>

      {/* Main Content Stack */}
      <div className="flex flex-col gap-6">
        {/* Title Header Group */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2.5">
            <span className="rounded-md bg-[#fff0ec] px-2.5 py-1 text-xs font-bold text-brand">
              Data Structures
            </span>
            <span className="text-sm font-semibold text-ink-muted">
              Sliding Window
            </span>
          </div>
          <h1 className="font-display text-2xl font-extrabold text-ink sm:text-[28px] sm:leading-snug">
            Find Maximum Sum Subarray of Size K
          </h1>
        </div>

        {/* Problem Description Card */}
        <div className="flex flex-col gap-4 rounded-2xl border border-line bg-white p-5 shadow-[0_4px_16px_rgba(30,28,26,0.03)] sm:p-6">
          <p className="text-[15px] leading-relaxed text-ink">
            Given an array of integers and a number K, find the maximum sum of a
            contiguous subarray of size K.
          </p>

          <div className="flex flex-col gap-1 rounded-xl bg-[#faf6f0]/70 p-4 font-mono text-sm leading-relaxed text-ink border border-line/60">
            <p className="font-sans text-xs font-bold uppercase tracking-wider text-ink-muted">
              Example
            </p>
            <p>
              <span className="text-ink-muted">Input:</span> arr = [2, 1, 5, 1,
              3, 2], K = 3
            </p>
            <p>
              <span className="text-ink-muted">Output:</span> 9
            </p>
            <p className="text-ink-muted">
              <span className="text-ink">Explanation:</span> Subarray [5, 1, 3]
              has the maximum sum.
            </p>
          </div>
        </div>

        {/* Code Workspace Editor */}
        <div className="relative flex flex-col overflow-hidden rounded-xl border border-[#2e2a27] bg-[#1e1c1a] shadow-inner">
          <div className="flex items-center justify-between border-b border-[#2e2a27] bg-[#171514] px-4 py-2 text-xs font-mono text-[#b0a898]">
            <span>Python 3</span>
            <span className="text-[11px] text-[#787168]">
              Tab or Space to indent
            </span>
          </div>

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            rows={10}
            className="w-full resize-y bg-transparent p-5 font-mono text-sm leading-relaxed text-[#f7f5f0] outline-none selection:bg-brand/30 placeholder:text-zinc-500"
            style={{
              fontFamily:
                'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "JetBrains Mono", monospace',
            }}
          />
        </div>

        {/* Bottom Action Bar */}
        <div className="flex flex-col gap-4 pt-1 sm:flex-row sm:items-center sm:justify-between">
          {/* Timer & Estimated Duration */}
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 shadow-sm">
              <Clock className="size-4 text-brand" />
              <span className="font-mono text-sm font-bold text-brand">
                {formatTimer(secondsRemaining)}
              </span>
            </div>
            <span className="text-sm text-ink-muted">Estimated: 10 min</span>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center justify-between gap-5 sm:justify-end">
            <Link
              href="/practice"
              className="text-sm font-semibold text-[#b0a898] transition-colors hover:text-ink"
            >
              Skip this activity
            </Link>

            <button
              type="button"
              className="flex items-center justify-center rounded-full bg-brand px-6 py-3 text-[15px] font-semibold text-white shadow-[0_4px_12px_rgba(255,108,71,0.2)] transition-opacity hover:opacity-95 active:scale-[0.99]"
            >
              Submit Answer →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
