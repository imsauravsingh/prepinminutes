"use client";

import { Brain, Sparkles } from "lucide-react";

export interface RevisionHeaderProps {
  onStartDrill?: () => void;
  dueCount?: number;
}

export function RevisionHeader({ onStartDrill, dueCount }: RevisionHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
      {/* Eyebrow + Title */}
      <div className="flex flex-col gap-0.5">
        <span className="text-xs font-extrabold uppercase tracking-wider text-brand">
          REVISION HUB
        </span>
        <h1 className="font-display text-2xl font-extrabold text-ink sm:text-3xl lg:text-[34px] leading-tight">
          Active Spaced Repetition
        </h1>
        <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
          Calibrate retention with SuperMemo SM-2 memory intervals before your interview loops.
        </p>
      </div>

      {/* Action CTA */}
      {onStartDrill && (
        <button
          type="button"
          onClick={onStartDrill}
          className="flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-xs hover:opacity-95 transition-all cursor-pointer active:scale-98 shrink-0"
        >
          <Brain className="size-4" />
          <span>Launch Rapid Drill</span>
          {typeof dueCount === "number" && dueCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-white/20 text-[10px] font-mono font-bold">
              {dueCount} Due
            </span>
          )}
          <Sparkles className="size-3.5 opacity-80" />
        </button>
      )}
    </div>
  );
}
