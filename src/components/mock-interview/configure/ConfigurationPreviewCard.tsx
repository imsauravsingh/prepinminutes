"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  GitFork,
  CodeXml,
  Users,
  FileText,
  LayoutGrid,
  User,
  BarChart3,
  Clock,
  Target,
  Lightbulb,
  ArrowRight,
  Loader2,
} from "lucide-react";
import type { InterviewConfiguration } from "@/types/mock-interview";

interface ConfigurationPreviewCardProps {
  config: InterviewConfiguration;
}

export function ConfigurationPreviewCard({
  config,
}: ConfigurationPreviewCardProps) {
  const router = useRouter();
  const [isContinuing, setIsContinuing] = useState(false);

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

  const getTypeIcon = () => {
    switch (config.interviewType) {
      case "technical":
        return (
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#eff6ff] text-[#2563eb]">
            <CodeXml className="size-4" />
          </div>
        );
      case "system-design":
        return (
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#e6fbf9] text-[#0d9488]">
            <GitFork className="size-4" />
          </div>
        );
      case "behavioral":
        return (
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#f5efff] text-[#7c3aed]">
            <Users className="size-4" />
          </div>
        );
      case "resume-based":
        return (
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#fff7ed] text-[#ea580c]">
            <FileText className="size-4" />
          </div>
        );
      case "mixed":
        return (
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#fef2f2] text-[#e11d48]">
            <LayoutGrid className="size-4" />
          </div>
        );
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

  const handleContinue = () => {
    if (isContinuing) return;
    setIsContinuing(true);
    setTimeout(() => {
      router.push("/mock-interview/briefing");
    }, 450);
  };

  return (
    <div className="sticky top-6 flex flex-col gap-5 rounded-2xl border border-line bg-gradient-to-b from-[#fffbf8] via-white to-white p-5 sm:p-6 shadow-2xs">
      {/* Top Stylized Illustration */}
      <div className="relative flex items-center justify-center py-2 select-none">
        {/* Soft Background Glow */}
        <div
          className="pointer-events-none absolute -inset-2 rounded-full bg-gradient-to-tr from-[#ffe4e6]/30 via-[#f3e8ff]/50 to-[#dbeafe]/30 blur-xl"
          aria-hidden
        />

        {/* Floating Checklist Artwork */}
        <div className="relative z-10 flex flex-col items-center">
          {/* Sparkles */}
          <span className="absolute -top-1 -right-2 text-[#f59e0b] text-base animate-pulse">
            ✦
          </span>
          <span className="absolute top-6 -left-3 text-[#c084fc] text-xs">
            ✦
          </span>
          <span className="absolute bottom-2 -right-3 text-[#f59e0b] text-xs">
            ✦
          </span>

          {/* Checklist Card */}
          <div className="w-36 aspect-[4/5] rounded-2xl border border-[#e2e8f0] bg-white shadow-md p-3 flex flex-col justify-between">
            {/* Checklist Items */}
            <div className="flex flex-col gap-2.5 pt-1">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="flex size-3.5 shrink-0 items-center justify-center rounded-[4px] border border-[#cbd5e1] bg-[#f8fafc] text-[#8b5cf6]">
                    <span className="size-1.5 rounded-full bg-[#8b5cf6]" />
                  </span>
                  <div
                    className="h-1.5 rounded-full bg-[#e2e8f0]"
                    style={{ width: `${80 - i * 10}%` }}
                  />
                </div>
              ))}
            </div>

            {/* Bottom Accent */}
            <div className="h-1 w-8 self-center rounded-full bg-[#cbd5e1]/60" />
          </div>
        </div>
      </div>

      {/* Title & Subtitle */}
      <div className="flex flex-col gap-0.5">
        <h3 className="font-display text-lg font-bold text-ink">
          Your Mock Interview
        </h3>
        <p className="text-xs text-ink-muted">
          Here&apos;s a preview of your configuration.
        </p>
      </div>

      {/* Summary Box */}
      <div className="flex flex-col gap-3.5 rounded-xl border border-[#f1f5f9] bg-white p-4 shadow-2xs">
        {/* Row 1: Interview Type */}
        <div className="flex items-center gap-3">
          {getTypeIcon()}
          <div className="flex flex-col min-w-0">
            <span className="text-[11px] text-ink-muted">Interview Type</span>
            <span className="text-xs sm:text-sm font-bold text-ink truncate">
              {getTypeName()}
            </span>
          </div>
        </div>

        {/* Row 2: Target Role */}
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

        {/* Row 3: Difficulty Level */}
        <div className="flex items-center gap-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#eff6ff] text-[#2563eb]">
            <BarChart3 className="size-4" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[11px] text-ink-muted">Difficulty Level</span>
            <span className="text-xs sm:text-sm font-bold text-ink truncate">
              {getDifficultyName()}
            </span>
          </div>
        </div>

        {/* Row 4: Duration */}
        <div className="flex items-center gap-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#f5efff] text-[#7c3aed]">
            <Clock className="size-4" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[11px] text-ink-muted">Duration</span>
            <span className="text-xs sm:text-sm font-bold text-ink truncate">
              {config.durationMinutes} minutes
            </span>
          </div>
        </div>

        {/* Row 5: Focus Areas */}
        <div className="flex items-start gap-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#fff0ec] text-brand mt-0.5">
            <Target className="size-4" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[11px] text-ink-muted">Focus Areas</span>
            <span className="text-xs font-bold text-ink leading-snug">
              {config.focusAreas.length > 0
                ? config.focusAreas.join(", ")
                : "AI Recommended"}
            </span>
          </div>
        </div>
      </div>

      {/* Callout Box: Good setup! */}
      <div className="flex items-start gap-2.5 rounded-xl border border-[#dbeafe] bg-[#eff6ff] p-3">
        <Lightbulb className="size-4 shrink-0 text-[#2563eb] mt-0.5" />
        <div className="flex flex-col gap-0.5">
          <p className="text-xs font-bold text-[#1d4ed8]">Good setup!</p>
          <p className="text-[11px] text-[#1e40af] leading-relaxed">
            This configuration will help us create a personalized and realistic
            interview experience.
          </p>
        </div>
      </div>

      {/* Primary Action Button */}
      <button
        type="button"
        onClick={handleContinue}
        disabled={isContinuing}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#ff5520] py-3.5 px-4 text-center text-sm font-bold text-white shadow-[0_4px_14px_rgba(255,85,32,0.35)] transition-all hover:bg-[#eb4a19] active:scale-[0.98] disabled:opacity-80 cursor-pointer"
      >
        {isContinuing ? (
          <>
            <Loader2 className="size-4 animate-spin text-white" />
            <span>Preparing briefing…</span>
          </>
        ) : (
          <>
            <span>Continue to Briefing</span>
            <ArrowRight className="size-4" />
          </>
        )}
      </button>
    </div>
  );
}
