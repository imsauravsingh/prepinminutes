"use client";

import React from "react";
import { Info, HelpCircle, CheckCircle } from "lucide-react";
import { ExecutionStep, OperationType } from "./types";

interface StepExplanationCardProps {
  step: ExecutionStep;
  currentStepIndex: number;
  totalSteps: number;
  className?: string;
}

const OPERATION_STYLE_MAP: Record<
  OperationType,
  { bg: string; text: string; label: string }
> = {
  read: { bg: "bg-blue-500/20", text: "text-blue-400", label: "Read" },
  write: { bg: "bg-emerald-500/20", text: "text-emerald-400", label: "Write" },
  compare: { bg: "bg-amber-500/20", text: "text-amber-400", label: "Compare" },
  lookup: { bg: "bg-cyan-500/20", text: "text-cyan-400", label: "Lookup" },
  insert: { bg: "bg-teal-500/20", text: "text-teal-400", label: "Insert" },
  delete: { bg: "bg-rose-500/20", text: "text-rose-400", label: "Delete" },
  swap: { bg: "bg-purple-500/20", text: "text-purple-400", label: "Swap" },
  move: { bg: "bg-indigo-500/20", text: "text-indigo-400", label: "Move" },
  push: { bg: "bg-pink-500/20", text: "text-pink-400", label: "Push" },
  pop: { bg: "bg-rose-500/20", text: "text-rose-400", label: "Pop" },
  enqueue: {
    bg: "bg-emerald-500/20",
    text: "text-emerald-400",
    label: "Enqueue",
  },
  dequeue: {
    bg: "bg-orange-500/20",
    text: "text-orange-400",
    label: "Dequeue",
  },
  slide: { bg: "bg-brand/20", text: "text-brand", label: "Slide Window" },
  recursive_call: {
    bg: "bg-violet-500/20",
    text: "text-violet-400",
    label: "Recurse",
  },
  recursive_return: {
    bg: "bg-fuchsia-500/20",
    text: "text-fuchsia-400",
    label: "Return",
  },
  branch: { bg: "bg-indigo-500/20", text: "text-indigo-400", label: "Branch" },
  return: { bg: "bg-green-500/20", text: "text-green-400", label: "Return" },
};

export function StepExplanationCard({
  step,
  currentStepIndex,
  totalSteps,
  className = "",
}: StepExplanationCardProps) {
  const opInfo = (step.operation && OPERATION_STYLE_MAP[step.operation]) || {
    bg: "bg-brand/20",
    text: "text-brand",
    label: step.operation || "Step",
  };

  const whatText = step.explanation?.what || "Executing operation";
  const whyText =
    step.explanation?.why ||
    "To maintain the algorithmic invariant and progress toward the optimal result.";
  const resultText = step.explanation?.result || "State updated successfully.";

  return (
    <div
      className={`flex flex-col gap-3 rounded-2xl bg-[#171514] border border-[#2d2925] p-4 text-[#ede8de] shadow-xl ${className}`}
    >
      {/* Top Header Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${opInfo.bg} ${opInfo.text}`}
          >
            {opInfo.label}
          </span>
          <span className="text-xs font-semibold text-[#a8a092]">
            Step {currentStepIndex + 1} of {totalSteps}
          </span>
        </div>

        {step.codeLine && (
          <span className="rounded-md bg-[#231f1c] px-2 py-0.5 font-mono text-[11px] text-[#9c9486] border border-[#362f2a]">
            Line {step.codeLine}
          </span>
        )}
      </div>

      {/* Structured What / Why / Result Columns */}
      <div className="flex flex-col gap-2.5">
        {/* WHAT */}
        <div className="flex items-start gap-2.5 rounded-xl bg-[#201d1a] border border-[#302b26] p-2.5">
          <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md bg-blue-500/20 text-blue-400">
            <Info className="size-3.5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400">
              What
            </span>
            <p className="text-xs leading-relaxed text-[#ded8cc]">{whatText}</p>
          </div>
        </div>

        {/* WHY */}
        <div className="flex items-start gap-2.5 rounded-xl bg-[#201d1a] border border-[#302b26] p-2.5">
          <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md bg-amber-500/20 text-amber-400">
            <HelpCircle className="size-3.5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
              Why
            </span>
            <p className="text-xs leading-relaxed text-[#ded8cc]">{whyText}</p>
          </div>
        </div>

        {/* RESULT */}
        <div className="flex items-start gap-2.5 rounded-xl bg-[#201d1a] border border-[#302b26] p-2.5">
          <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md bg-emerald-500/20 text-emerald-400">
            <CheckCircle className="size-3.5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
              Result
            </span>
            <p className="text-xs leading-relaxed text-[#ded8cc]">
              {resultText}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
