"use client";

import Link from "next/link";
import {
  User,
  GitFork,
  Clock,
  BarChart3,
  Target,
  SquarePen,
} from "lucide-react";
import type { InterviewConfiguration } from "@/types/mock-interview";

interface YourMockInterviewSummaryCardProps {
  config?: InterviewConfiguration;
}

export function YourMockInterviewSummaryCard({
  config = {
    interviewType: "system-design",
    targetRole: "Senior Software Engineer",
    difficulty: "standard",
    durationMinutes: 45,
    focusAreas: ["Scalability", "Trade-offs", "Failure Handling"],
  },
}: YourMockInterviewSummaryCardProps) {
  const getTypeName = () => {
    switch (config.interviewType) {
      case "technical":
        return "Technical";
      case "system-design":
        return "System Design";
      case "behavioral":
        return "Behavioral";
      case "resume-based":
        return "Resume-Based";
      case "mixed":
        return "Mixed";
    }
  };

  const getDifficultyName = () => {
    switch (config.difficulty) {
      case "standard":
        return "Standard";
      case "challenging":
        return "Challenging";
      case "expert":
        return "Expert";
    }
  };

  return (
    <div className="flex w-full flex-col gap-3">
      {/* Header Row: Title + Edit Configuration Link */}
      <div className="flex items-center justify-between">
        <h2 className="font-display text-base sm:text-lg font-bold text-ink">
          Your Mock Interview
        </h2>
        <Link
          href="/mock-interview/configure"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1e40af] hover:text-brand transition-colors cursor-pointer"
        >
          <SquarePen className="size-3.5" />
          <span>Edit Configuration</span>
        </Link>
      </div>

      {/* Main Card */}
      <div className="flex flex-col gap-5 rounded-2xl border border-line bg-white p-5 sm:p-6 shadow-2xs">
        {/* Top 4 Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-4 border-b border-line/60">
          {/* Target Role */}
          <div className="flex items-center gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#f5efff] text-[#7c3aed]">
              <User className="size-4" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] text-ink-muted">Target Role</span>
              <span className="text-xs sm:text-sm font-bold text-ink truncate">
                {config.targetRole}
              </span>
            </div>
          </div>

          {/* Interview Type */}
          <div className="flex items-center gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#e6fbf9] text-[#0d9488]">
              <GitFork className="size-4" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] text-ink-muted">Interview Type</span>
              <span className="text-xs sm:text-sm font-bold text-ink truncate">
                {getTypeName()}
              </span>
            </div>
          </div>

          {/* Duration */}
          <div className="flex items-center gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#fff7ed] text-[#ea580c]">
              <Clock className="size-4" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] text-ink-muted">Duration</span>
              <span className="text-xs sm:text-sm font-bold text-ink truncate">
                {config.durationMinutes} minutes
              </span>
            </div>
          </div>

          {/* Difficulty Level */}
          <div className="flex items-center gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#eff6ff] text-[#2563eb]">
              <BarChart3 className="size-4" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] text-ink-muted">
                Difficulty Level
              </span>
              <span className="text-xs sm:text-sm font-bold text-ink truncate">
                {getDifficultyName()}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom: Focus Areas */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-[#fff0ec] text-brand">
              <Target className="size-3.5" />
            </div>
            <span className="text-xs font-semibold text-ink-muted">
              Focus Areas
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {config.focusAreas.map((area) => (
              <span
                key={area}
                className="inline-flex items-center rounded-full bg-[#f0f9ff] border border-[#e0f2fe] px-3 py-1 text-xs font-semibold text-[#0369a1]"
              >
                {area}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
