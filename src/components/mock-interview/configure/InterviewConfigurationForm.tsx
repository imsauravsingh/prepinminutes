"use client";

import { useState } from "react";
import {
  SlidersHorizontal,
  CodeXml,
  GitFork,
  Users,
  FileText,
  LayoutGrid,
  ChevronDown,
  BarChart3,
  Target,
  Gem,
  Clock,
  Check,
  Info,
} from "lucide-react";
import type {
  InterviewConfiguration,
  InterviewType,
  DifficultyLevel,
} from "@/types/mock-interview";
import {
  targetRoleOptions,
  difficultyOptions,
  durationOptions,
  focusAreaOptions,
} from "@/data/mock-interview";

interface InterviewConfigurationFormProps {
  config: InterviewConfiguration;
  onChange: (updated: InterviewConfiguration) => void;
}

export function InterviewConfigurationForm({
  config,
  onChange,
}: InterviewConfigurationFormProps) {
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const handleTypeSelect = (type: InterviewType) => {
    onChange({ ...config, interviewType: type });
  };

  const handleRoleSelect = (role: string) => {
    onChange({ ...config, targetRole: role });
    setRoleDropdownOpen(false);
  };

  const handleDifficultySelect = (difficulty: DifficultyLevel) => {
    onChange({ ...config, difficulty });
  };

  const handleDurationSelect = (durationMinutes: number) => {
    onChange({ ...config, durationMinutes });
  };

  const handleFocusToggle = (area: string) => {
    const exists = config.focusAreas.includes(area);
    if (exists) {
      onChange({
        ...config,
        focusAreas: config.focusAreas.filter((a) => a !== area),
      });
    } else {
      if (config.focusAreas.length >= 6) return;
      onChange({
        ...config,
        focusAreas: [...config.focusAreas, area],
      });
    }
  };

  return (
    <div className="flex flex-col gap-6 sm:gap-7 rounded-2xl border border-line bg-white p-4 sm:p-7 shadow-2xs">
      {/* Card Header */}
      <div className="flex items-center gap-3 border-b border-line/60 pb-4 sm:pb-5">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-[#ffd8cc] bg-[#fff0ec] text-brand">
          <SlidersHorizontal className="size-4" />
        </div>
        <div className="flex flex-col gap-0.5">
          <h2 className="font-display text-base sm:text-lg font-bold text-ink">
            Interview Configuration
          </h2>
          <p className="text-xs text-ink-muted">
            Set up your interview preferences. We&apos;ll tailor the questions
            based on your selection.
          </p>
        </div>
      </div>

      {/* 1. Interview Type */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-0.5">
          <label className="text-sm font-bold text-ink">Interview Type</label>
          <p className="text-xs text-ink-muted">
            Choose the type of interview you want to practice.
          </p>
        </div>

        {/* Row 1: Technical, System Design, Behavioral */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Technical */}
          <button
            type="button"
            onClick={() => handleTypeSelect("technical")}
            className={`relative flex items-center gap-3 rounded-xl p-3 text-left transition-all cursor-pointer ${
              config.interviewType === "technical"
                ? "border-2 border-[#3b82f6] bg-[#f0f9ff] text-ink font-semibold shadow-xs"
                : "border border-[#e2e8f0] bg-white text-ink-muted hover:border-[#cbd5e1] hover:text-ink"
            }`}
          >
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#eff6ff] text-[#2563eb]">
              <CodeXml className="size-4" />
            </div>
            <span className="text-xs sm:text-sm font-bold text-ink">
              Technical
            </span>
            {config.interviewType === "technical" && (
              <span className="absolute top-2 right-2 flex size-4 items-center justify-center rounded-full bg-[#2563eb] text-white">
                <Check className="size-2.5 stroke-[3]" />
              </span>
            )}
          </button>

          {/* System Design */}
          <button
            type="button"
            onClick={() => handleTypeSelect("system-design")}
            className={`relative flex items-center gap-3 rounded-xl p-3 text-left transition-all cursor-pointer ${
              config.interviewType === "system-design"
                ? "border-2 border-[#3b82f6] bg-[#f0f9ff] text-ink font-semibold shadow-xs"
                : "border border-[#e2e8f0] bg-white text-ink-muted hover:border-[#cbd5e1] hover:text-ink"
            }`}
          >
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#e6fbf9] text-[#0d9488]">
              <GitFork className="size-4" />
            </div>
            <span className="text-xs sm:text-sm font-bold text-ink">
              System Design
            </span>
            {config.interviewType === "system-design" && (
              <span className="absolute top-2 right-2 flex size-4 items-center justify-center rounded-full bg-[#2563eb] text-white">
                <Check className="size-2.5 stroke-[3]" />
              </span>
            )}
          </button>

          {/* Behavioral */}
          <button
            type="button"
            onClick={() => handleTypeSelect("behavioral")}
            className={`relative flex items-center gap-3 rounded-xl p-3 text-left transition-all cursor-pointer ${
              config.interviewType === "behavioral"
                ? "border-2 border-[#3b82f6] bg-[#f0f9ff] text-ink font-semibold shadow-xs"
                : "border border-[#e2e8f0] bg-white text-ink-muted hover:border-[#cbd5e1] hover:text-ink"
            }`}
          >
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#f5efff] text-[#7c3aed]">
              <Users className="size-4" />
            </div>
            <span className="text-xs sm:text-sm font-bold text-ink">
              Behavioral
            </span>
            {config.interviewType === "behavioral" && (
              <span className="absolute top-2 right-2 flex size-4 items-center justify-center rounded-full bg-[#2563eb] text-white">
                <Check className="size-2.5 stroke-[3]" />
              </span>
            )}
          </button>
        </div>

        {/* Row 2: Resume-Based, Mixed */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Resume-Based */}
          <button
            type="button"
            onClick={() => handleTypeSelect("resume-based")}
            className={`relative flex items-center gap-3 rounded-xl p-3 text-left transition-all cursor-pointer ${
              config.interviewType === "resume-based"
                ? "border-2 border-[#3b82f6] bg-[#f0f9ff] text-ink font-semibold shadow-xs"
                : "border border-[#e2e8f0] bg-white text-ink-muted hover:border-[#cbd5e1] hover:text-ink"
            }`}
          >
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#fff7ed] text-[#ea580c]">
              <FileText className="size-4" />
            </div>
            <span className="text-xs sm:text-sm font-bold text-ink">
              Resume-Based
            </span>
            {config.interviewType === "resume-based" && (
              <span className="absolute top-2 right-2 flex size-4 items-center justify-center rounded-full bg-[#2563eb] text-white">
                <Check className="size-2.5 stroke-[3]" />
              </span>
            )}
          </button>

          {/* Mixed */}
          <button
            type="button"
            onClick={() => handleTypeSelect("mixed")}
            className={`relative flex items-center gap-3 rounded-xl p-3 text-left transition-all cursor-pointer ${
              config.interviewType === "mixed"
                ? "border-2 border-[#3b82f6] bg-[#f0f9ff] text-ink font-semibold shadow-xs"
                : "border border-[#e2e8f0] bg-white text-ink-muted hover:border-[#cbd5e1] hover:text-ink"
            }`}
          >
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#fef2f2] text-[#e11d48]">
              <LayoutGrid className="size-4" />
            </div>
            <span className="text-xs sm:text-sm font-bold text-ink">Mixed</span>
            {config.interviewType === "mixed" && (
              <span className="absolute top-2 right-2 flex size-4 items-center justify-center rounded-full bg-[#2563eb] text-white">
                <Check className="size-2.5 stroke-[3]" />
              </span>
            )}
          </button>
        </div>
      </div>

      {/* 2. Target Role */}
      <div className="flex flex-col gap-2 relative">
        <div className="flex flex-col gap-0.5">
          <label className="text-sm font-bold text-ink">Target Role</label>
          <p className="text-xs text-ink-muted">
            Helps us tailor the questions to the right level.
          </p>
        </div>

        {/* Dropdown toggle */}
        <button
          type="button"
          onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
          className="flex w-full items-center justify-between rounded-xl border border-[#cbd5e1] bg-white px-4 py-2.5 text-sm font-semibold text-ink shadow-2xs hover:border-[#94a3b8] transition-all cursor-pointer text-left"
        >
          <span>{config.targetRole}</span>
          <ChevronDown
            className={`size-4 text-ink-muted transition-transform duration-200 ${
              roleDropdownOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Dropdown menu */}
        {roleDropdownOpen && (
          <div className="absolute top-full left-0 right-0 z-30 mt-1 overflow-hidden rounded-xl border border-line bg-white py-1.5 shadow-[0_8px_24px_rgba(30,28,26,0.12)]">
            {targetRoleOptions.map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => handleRoleSelect(role)}
                className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-xs sm:text-sm font-medium transition-colors hover:bg-cream cursor-pointer ${
                  config.targetRole === role
                    ? "bg-[#f0f9ff] font-bold text-[#2563eb]"
                    : "text-ink"
                }`}
              >
                <span>{role}</span>
                {config.targetRole === role && (
                  <Check className="size-4 text-[#2563eb]" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 3. Difficulty Level */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-0.5">
          <label className="text-sm font-bold text-ink">Difficulty Level</label>
          <p className="text-xs text-ink-muted">
            Choose the difficulty of questions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {difficultyOptions.map((diff) => {
            const isSelected = config.difficulty === diff.id;
            const DiffIcon =
              diff.id === "standard"
                ? BarChart3
                : diff.id === "challenging"
                  ? Target
                  : Gem;

            return (
              <button
                key={diff.id}
                type="button"
                onClick={() => handleDifficultySelect(diff.id)}
                className={`relative flex items-center justify-center gap-2 rounded-xl py-3 px-4 text-xs sm:text-sm transition-all cursor-pointer ${
                  isSelected
                    ? "border-2 border-[#3b82f6] bg-[#f0f9ff] font-bold text-[#2563eb] shadow-xs"
                    : "border border-[#e2e8f0] bg-white font-medium text-ink-muted hover:border-[#cbd5e1] hover:text-ink"
                }`}
              >
                <DiffIcon
                  className={`size-4 ${
                    isSelected ? "text-[#2563eb]" : "text-ink-muted"
                  }`}
                />
                <span>{diff.label}</span>
                {isSelected && (
                  <span className="absolute top-2 right-2 flex size-4 items-center justify-center rounded-full bg-[#2563eb] text-white">
                    <Check className="size-2.5 stroke-[3]" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Duration */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-0.5">
          <label className="text-sm font-bold text-ink">Duration</label>
          <p className="text-xs text-ink-muted">
            Choose how long you want the interview to be.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {durationOptions.map((mins) => {
            const isSelected = config.durationMinutes === mins;

            return (
              <button
                key={mins}
                type="button"
                onClick={() => handleDurationSelect(mins)}
                className={`relative flex items-center justify-center gap-2 rounded-xl py-3 px-3 text-xs sm:text-sm transition-all cursor-pointer ${
                  isSelected
                    ? "border-2 border-[#3b82f6] bg-[#f0f9ff] font-bold text-[#2563eb] shadow-xs"
                    : "border border-[#e2e8f0] bg-white font-medium text-ink-muted hover:border-[#cbd5e1] hover:text-ink"
                }`}
              >
                <Clock
                  className={`size-4 ${
                    isSelected ? "text-[#2563eb]" : "text-ink-muted"
                  }`}
                />
                <span>{mins} min</span>
                {isSelected && (
                  <span className="absolute top-2 right-2 flex size-4 items-center justify-center rounded-full bg-[#2563eb] text-white">
                    <Check className="size-2.5 stroke-[3]" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Interview Focus (Optional) */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-ink">
              Interview Focus{" "}
              <span className="font-normal text-ink-muted">(Optional)</span>
            </label>
            <span className="text-xs text-ink-muted">
              {config.focusAreas.length} / 6 selected
            </span>
          </div>
          <p className="text-xs text-ink-muted">
            Select up to 6 areas you want to focus on.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {focusAreaOptions.map((area) => {
            const isSelected = config.focusAreas.includes(area);

            return (
              <button
                key={area}
                type="button"
                onClick={() => handleFocusToggle(area)}
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? "border border-[#bfdbfe] bg-[#f0f9ff] text-[#2563eb] shadow-2xs"
                    : "border border-[#e2e8f0] bg-white text-ink-muted hover:border-[#cbd5e1] hover:text-ink"
                }`}
              >
                {isSelected && <Check className="size-3.5 stroke-[2.5]" />}
                <span>{area}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Info Callout */}
      <div className="flex items-start gap-3 rounded-xl border border-[#dbeafe] bg-[#eff6ff] p-3.5 sm:p-4">
        <Info className="size-5 shrink-0 text-[#2563eb] mt-0.5" />
        <div className="flex flex-col gap-0.5">
          <p className="text-xs font-bold text-[#1d4ed8]">
            You can leave this empty.
          </p>
          <p className="text-xs text-[#1e40af] leading-relaxed">
            AI will choose the most relevant focus areas based on your
            preparation and readiness.
          </p>
        </div>
      </div>
    </div>
  );
}
