"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Clock } from "lucide-react";

export function SystemDesignWorkspace() {
  const [answer, setAnswer] = useState("");
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
            <span className="font-bold text-brand">2 / 3</span>
            <span className="text-[#b0a898]">•</span>
            <span className="font-semibold text-ink">System Design</span>
          </div>
          <span className="text-sm text-ink-muted sm:text-right">
            ~17 min remaining
          </span>
        </div>

        {/* Progress bar with completed step 1 (green) and active step 2 (brand) */}
        <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-[#ede6db]">
          <div
            className="h-full bg-[#10b981] transition-all duration-300"
            style={{ width: "33.3%" }}
            title="Step 1 Completed"
          />
          <div
            className="h-full bg-brand transition-all duration-300"
            style={{ width: "33.3%" }}
            title="Step 2 In Progress"
          />
        </div>
      </div>

      {/* Main Content Stack */}
      <div className="flex flex-col gap-6">
        {/* Title Header Group */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2.5">
            <span className="rounded-md bg-[#edf7f4] px-2.5 py-1 text-xs font-bold text-[#0b8a8f]">
              System Design
            </span>
            <span className="text-sm font-semibold text-ink-muted">
              Load Balancing
            </span>
          </div>
          <h1 className="font-display text-2xl font-extrabold text-ink sm:text-[28px] sm:leading-snug">
            Design a Load Balancer
          </h1>
        </div>

        {/* Problem Description Card */}
        <div className="flex flex-col gap-3 rounded-2xl border border-line bg-white p-5 shadow-[0_4px_16px_rgba(30,28,26,0.03)] sm:p-6">
          <p className="text-[15px] leading-relaxed text-ink">
            Design a scalable service that distributes incoming traffic across
            multiple backend servers. Consider:
          </p>
          <ul className="flex flex-col gap-1.5 pl-1 text-[15px] leading-relaxed text-ink-muted">
            <li>• How would you handle server failures?</li>
            <li>
              • How would you distribute traffic for different types of requests?
            </li>
            <li>
              • What trade-offs exist between different load balancing
              algorithms?
            </li>
          </ul>
        </div>

        {/* Answer Workspace */}
        <div className="flex flex-col overflow-hidden rounded-xl border border-[#ede6db] bg-white shadow-sm focus-within:border-brand/50 focus-within:ring-2 focus-within:ring-brand/10 transition-all">
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Describe your system design approach..."
            rows={9}
            className="w-full resize-y bg-transparent p-5 font-sans text-sm leading-relaxed text-ink placeholder:text-[#b0a898] outline-none"
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
              Submit Design →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
