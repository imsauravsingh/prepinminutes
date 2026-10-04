"use client";

import React from "react";
import { Clock, HardDrive, Zap, TrendingUp } from "lucide-react";
import { ARProblem } from "./types";

interface ComplexityVisualizerProps {
  problem: ARProblem;
  className?: string;
}

export function ComplexityVisualizer({
  problem,
  className = "",
}: ComplexityVisualizerProps) {
  const { complexity } = problem;

  return (
    <div
      className={`flex flex-col gap-4 rounded-2xl bg-[#171514] border border-[#2d2925] p-4 sm:p-5 text-[#ede8de] shadow-xl ${className}`}
    >
      {/* Title */}
      <div className="flex items-center justify-between pb-3 border-b border-[#292522]">
        <div className="flex items-center gap-2">
          <Zap className="size-4 text-brand" />
          <span className="text-sm font-bold text-white">
            Algorithmic Complexity Explorer
          </span>
        </div>
        <span className="rounded-full bg-emerald-500/20 text-emerald-400 px-2.5 py-0.5 text-[11px] font-bold">
          Optimal Solution
        </span>
      </div>

      {/* Main Complexity Badges: Time & Space */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Time Complexity Card */}
        <div className="flex flex-col gap-2 rounded-xl bg-[#201d1a] border border-[#342e29] p-3.5">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-[#a39c8e]">
              <Clock className="size-3.5 text-brand" />
              Time Complexity
            </span>
            <span className="rounded-lg bg-brand/20 border border-brand/40 px-2.5 py-0.5 font-mono text-xs font-extrabold text-brand">
              {complexity.timeComplexity}
            </span>
          </div>
          <p className="text-xs text-[#c9c2b5] leading-relaxed">
            {complexity.timeExplanation}
          </p>

          {/* Time Breakdown Elements */}
          {complexity.timeElements && complexity.timeElements.length > 0 && (
            <div className="mt-1 flex flex-col gap-1 border-t border-[#2e2824] pt-2">
              {complexity.timeElements.map((el, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-[11px]"
                >
                  <span className="text-[#968d7f]">{el.label}:</span>
                  <span className="font-mono font-semibold text-[#f0ebe1]">
                    {el.count}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Space Complexity Card */}
        <div className="flex flex-col gap-2 rounded-xl bg-[#201d1a] border border-[#342e29] p-3.5">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-[#a39c8e]">
              <HardDrive className="size-3.5 text-blue-400" />
              Space Complexity
            </span>
            <span className="rounded-lg bg-blue-500/20 border border-blue-500/40 px-2.5 py-0.5 font-mono text-xs font-extrabold text-blue-400">
              {complexity.spaceComplexity}
            </span>
          </div>
          <p className="text-xs text-[#c9c2b5] leading-relaxed">
            {complexity.spaceExplanation}
          </p>

          {/* Space Breakdown Elements */}
          {complexity.spaceElements && complexity.spaceElements.length > 0 && (
            <div className="mt-1 flex flex-col gap-1 border-t border-[#2e2824] pt-2">
              {complexity.spaceElements.map((el, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-[11px]"
                >
                  <span className="text-[#968d7f]">{el.label}:</span>
                  <span className="font-mono font-semibold text-[#f0ebe1]">
                    {el.usage}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Algorithmic Pattern Intuition */}
      <div className="flex flex-col gap-2 rounded-xl bg-[#1d1b19] border border-[#302b26] p-3.5">
        <div className="flex items-center gap-2 text-xs font-bold text-white">
          <TrendingUp className="size-4 text-emerald-400" />
          <span>Core Intuition &amp; Invariant</span>
        </div>
        <p className="text-xs text-[#b8b0a1] leading-relaxed">
          {problem.intuition}
        </p>
      </div>

      {/* Big-O Cheat Scale Reference */}
      <div className="flex flex-col gap-1.5 pt-1">
        <span className="text-[11px] font-semibold text-[#8a8274] uppercase tracking-wider">
          Complexity Scale Reference
        </span>
        <div className="grid grid-cols-5 gap-1 text-center font-mono text-[10px] select-none">
          <div className="rounded-md bg-emerald-900/40 border border-emerald-500/40 py-1 text-emerald-300">
            O(1)
          </div>
          <div className="rounded-md bg-emerald-900/30 border border-emerald-500/30 py-1 text-emerald-400">
            O(log N)
          </div>
          <div className="rounded-md bg-amber-900/30 border border-amber-500/30 py-1 text-amber-400">
            O(N)
          </div>
          <div className="rounded-md bg-orange-900/30 border border-orange-500/30 py-1 text-orange-400">
            O(N log N)
          </div>
          <div className="rounded-md bg-rose-900/30 border border-rose-500/30 py-1 text-rose-400">
            O(N²)
          </div>
        </div>
      </div>
    </div>
  );
}
