"use client";

import {
  FileText,
  MessageSquare,
  Sparkles,
  GitFork,
  ArrowRight,
  ArrowDown,
} from "lucide-react";

export function HowTheInterviewWorksSection() {
  const steps = [
    {
      icon: FileText,
      iconBg: "bg-[#eff6ff] text-[#2563eb]",
      title: "Question",
      description: "AI asks a question based on your profile and goals.",
    },
    {
      icon: MessageSquare,
      iconBg: "bg-[#e6fbf9] text-[#0d9488]",
      title: "Your Answer",
      description: "You explain your thinking and approach.",
    },
    {
      icon: Sparkles,
      iconBg: "bg-[#f5efff] text-[#8b5cf6]",
      title: "AI Evaluates",
      description: "AI analyzes your answer and identifies strengths and gaps.",
    },
    {
      icon: GitFork,
      iconBg: "bg-[#fff7ed] text-[#ea580c]",
      title: "Adaptive Follow-up",
      description: "AI asks relevant follow-up questions.",
    },
    {
      icon: FileText,
      iconBg: "bg-[#eff6ff] text-[#2563eb]",
      title: "Next Question",
      description: "Based on your answers, the next question is selected.",
    },
  ];

  return (
    <div className="flex w-full flex-col gap-3">
      {/* Section Header */}
      <div className="flex flex-col gap-0.5">
        <h2 className="font-display text-base sm:text-lg font-bold text-ink">
          How the Interview Works
        </h2>
        <p className="text-xs text-ink-muted">
          The next question is selected based on what you demonstrate in each
          answer.
        </p>
      </div>

      {/* Main Flow Card */}
      <div className="rounded-2xl border border-line bg-white p-5 sm:p-6 shadow-2xs">
        <div className="flex flex-col md:grid md:grid-cols-5 gap-3 md:gap-4 items-center">
          {steps.map((step, idx) => {
            const Icon = step.icon;

            return (
              <div
                key={step.title}
                className="flex flex-col md:flex-row items-center gap-3 w-full"
              >
                {/* Step Item */}
                <div className="flex flex-1 flex-col items-center text-center gap-2 w-full">
                  <div
                    className={`flex size-11 items-center justify-center rounded-full ${step.iconBg} shadow-2xs`}
                  >
                    <Icon className="size-5" />
                  </div>
                  <div className="flex flex-col gap-0.5 max-w-xs md:max-w-none">
                    <span className="text-xs font-bold text-ink">
                      {step.title}
                    </span>
                    <span className="text-[11px] text-ink-muted leading-tight">
                      {step.description}
                    </span>
                  </div>
                </div>

                {/* Arrow connector: Right on desktop, Down on mobile */}
                {idx < steps.length - 1 && (
                  <>
                    <div className="hidden md:flex shrink-0 items-center justify-center text-[#cbd5e1]">
                      <ArrowRight className="size-4" />
                    </div>
                    <div className="flex md:hidden shrink-0 items-center justify-center text-[#cbd5e1] py-1">
                      <ArrowDown className="size-4" />
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
