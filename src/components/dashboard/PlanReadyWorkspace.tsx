"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { DashboardStepper } from "@/components/dashboard/DashboardStepper";
import {
  BarChart3,
  Target,
  ListChecks,
  Lightbulb,
  Calendar,
  Clock,
  Sparkles,
  ArrowRight,
  X,
} from "lucide-react";

export function PlanReadyWorkspace() {
  const [showHowItWorksModal, setShowHowItWorksModal] = useState(false);

  return (
    <div className="flex w-full flex-col gap-8">
      {/* 1. Header & Stepper (Step 2 of 3) */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Left: Step kicker, Title, Subtitle */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-brand">
            STEP 2 OF 3
          </span>
          <h1 className="font-display text-2xl font-extrabold text-ink sm:text-[32px] tracking-tight flex items-center gap-2">
            <span>Great! Let&apos;s take the next step</span>
            <span className="text-2xl sm:text-3xl">👋</span>
          </h1>
          <p className="text-sm text-ink-muted sm:text-[15px]">
            We&apos;ve got your details. Now, how would you like to continue
            your preparation journey?
          </p>
        </div>

        {/* Right side: Stepper */}
        <div className="shrink-0 self-start lg:self-center">
          <DashboardStepper currentStep={2} />
        </div>
      </div>

      {/* 2. Main Two Path Cards + Optional Journey Decoration */}
      <div className="flex flex-col xl:flex-row items-stretch gap-6 xl:gap-8 w-full">
        {/* Left & Right Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
          {/* CARD 1: Take AI Assessment (Recommended) */}
          <div className="flex flex-col justify-between rounded-3xl border-[1.5px] border-[#ffd8cc] bg-gradient-to-b from-[#fff6f2] via-white to-white p-6 sm:p-7 shadow-[0_8px_30px_rgba(255,108,71,0.06)] transition-all hover:shadow-[0_12px_36px_rgba(255,108,71,0.1)] relative overflow-hidden">
            <div className="flex flex-col gap-5">
              {/* Top Hero Visual with Robot & Speech Bubble */}
              <div className="relative w-full h-[190px] sm:h-[210px] overflow-hidden rounded-2xl bg-[#fff6f2] flex items-center justify-center">
                <Image
                  src="/images/dashboard/assessment-hero-card.png"
                  alt="Take AI Assessment Assistant"
                  width={435}
                  height={210}
                  className="h-full w-auto object-contain select-none pointer-events-none"
                  priority
                />
              </div>

              {/* Title & Description */}
              <div className="flex flex-col gap-1.5">
                <h3 className="font-display text-xl sm:text-2xl font-extrabold text-ink tracking-tight">
                  Take AI Assessment
                </h3>
                <p className="text-xs sm:text-[13px] text-ink-muted leading-relaxed">
                  Discover your strengths, gaps, and improvement areas for your
                  target role with an AI-powered assessment.
                </p>
              </div>

              {/* Feature Checklist Box */}
              <div className="flex flex-col gap-3 rounded-2xl bg-white/70 p-4 border border-[#fee2d5]/60 shadow-[0_2px_8px_rgba(255,108,71,0.02)]">
                {/* Item 1 */}
                <div className="flex items-center gap-3">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#ffede6] text-[#ff6c47]">
                    <BarChart3 className="size-3.5" />
                  </div>
                  <span className="text-[13px] font-medium text-ink">
                    Current interview readiness
                  </span>
                </div>

                {/* Item 2 */}
                <div className="flex items-center gap-3">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#eff6ff] text-[#2563eb]">
                    <Target className="size-3.5" />
                  </div>
                  <span className="text-[13px] font-medium text-ink">
                    Strong and weak areas
                  </span>
                </div>

                {/* Item 3 */}
                <div className="flex items-center gap-3">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#eff6ff] text-[#0284c7]">
                    <ListChecks className="size-3.5" />
                  </div>
                  <span className="text-[13px] font-medium text-ink">
                    Topic-wise gap analysis
                  </span>
                </div>

                {/* Item 4 */}
                <div className="flex items-center gap-3">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#fefce8] text-[#ca8a04]">
                    <Lightbulb className="size-3.5" />
                  </div>
                  <span className="text-[13px] font-medium text-ink">
                    Personalized recommendations
                  </span>
                </div>
              </div>
            </div>

            {/* CTA Button & Time Subtext */}
            <div className="flex flex-col gap-2.5 pt-5">
              <Link
                href="/practice"
                className="flex w-full items-center justify-center gap-2 rounded-full bg-brand py-3.5 text-sm sm:text-[15px] font-semibold text-white shadow-[0_4px_16px_rgba(255,108,71,0.28)] transition-all hover:bg-[#fa552b] active:scale-[0.99]"
              >
                <span>Start AI Assessment</span>
                <ArrowRight className="size-4" />
              </Link>

              <div className="flex items-center justify-center gap-1.5 text-xs text-[#8a847c]">
                <Clock className="size-3.5 text-[#8a847c]" />
                <span>Takes about 15–25 minutes</span>
              </div>
            </div>
          </div>

          {/* CARD 2: Create My Preparation Plan */}
          <div className="flex flex-col justify-between rounded-3xl border-[1.5px] border-[#dbeafe] bg-gradient-to-b from-[#f0f7ff] via-white to-white p-6 sm:p-7 shadow-[0_8px_30px_rgba(59,130,246,0.06)] transition-all hover:shadow-[0_12px_36px_rgba(59,130,246,0.1)] relative overflow-hidden">
            <div className="flex flex-col gap-5">
              {/* Top Hero Visual with Plan Character & Speech Bubble */}
              <div className="relative w-full h-[190px] sm:h-[210px] overflow-hidden rounded-2xl bg-[#f0f7ff] flex items-center justify-center">
                <Image
                  src="/images/dashboard/plan-hero-card.png"
                  alt="Personalized Preparation Plan Assistant"
                  width={380}
                  height={210}
                  className="h-full w-auto object-contain select-none pointer-events-none"
                  priority
                />
              </div>

              {/* Title & Description */}
              <div className="flex flex-col gap-1.5">
                <h3 className="font-display text-xl sm:text-2xl font-extrabold text-ink tracking-tight">
                  Create My Preparation Plan
                </h3>
                <p className="text-xs sm:text-[13px] text-ink-muted leading-relaxed">
                  Get a structured and personalized study plan to help you reach
                  your interview goals.
                </p>
              </div>

              {/* Feature Checklist Box */}
              <div className="flex flex-col gap-3 rounded-2xl bg-white/70 p-4 border border-[#dbeafe]/60 shadow-[0_2px_8px_rgba(59,130,246,0.02)]">
                {/* Item 1 */}
                <div className="flex items-center gap-3">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#eff6ff] text-[#2563eb]">
                    <Calendar className="size-3.5" />
                  </div>
                  <span className="text-[13px] font-medium text-ink">
                    A step-by-step study plan
                  </span>
                </div>

                {/* Item 2 */}
                <div className="flex items-center gap-3">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#eff6ff] text-[#2563eb]">
                    <Target className="size-3.5" />
                  </div>
                  <span className="text-[13px] font-medium text-ink">
                    Topic-wise preparation roadmap
                  </span>
                </div>

                {/* Item 3 */}
                <div className="flex items-center gap-3">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#eff6ff] text-[#2563eb]">
                    <Clock className="size-3.5" />
                  </div>
                  <span className="text-[13px] font-medium text-ink">
                    Estimated time and weekly goals
                  </span>
                </div>

                {/* Item 4 */}
                <div className="flex items-center gap-3">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#fef3c7] text-[#d97706]">
                    <Sparkles className="size-3.5" />
                  </div>
                  <span className="text-[13px] font-medium text-ink">
                    You can take the assessment later
                  </span>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="flex flex-col gap-2.5 pt-5">
              <Link
                href="/dashboard?step=3"
                className="flex w-full items-center justify-center gap-2 rounded-full border-[1.5px] border-[#3b82f6] bg-white py-3.5 text-sm sm:text-[15px] font-semibold text-[#2563eb] shadow-xs transition-all hover:bg-[#eff6ff] active:scale-[0.99]"
              >
                <span>Create My Preparation Plan</span>
                <ArrowRight className="size-4" />
              </Link>

              {/* Balances height with left card's clock note */}
              <div className="h-4 invisible sm:block" />
            </div>
          </div>
        </div>

        {/* Right Decorative Column (Visible on XL screens) */}
        <div className="hidden xl:flex flex-col items-center justify-center w-36 shrink-0 select-none pointer-events-none opacity-90 pl-1">
          <Image
            src="/images/dashboard/journey-decoration.png"
            alt="Your Interview Success Starts Here"
            width={124}
            height={620}
            className="w-full h-auto object-contain"
          />
        </div>
      </div>

      {/* 3. Bottom Guidance Banner */}
      <div className="flex w-full flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-[#ede6db] bg-white p-4 sm:p-5 shadow-[0_4px_16px_rgba(30,28,26,0.02)]">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#fef3c7] text-[#d97706]">
            <Sparkles className="size-5" />
          </div>
          <div className="flex flex-col gap-0.5">
            <h4 className="text-sm font-bold text-ink">
              Not sure which one to choose?
            </h4>
            <p className="text-xs sm:text-[13px] text-ink-muted">
              We recommend taking the AI assessment first as it helps create a
              more accurate and personalized preparation plan.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowHowItWorksModal(true)}
          className="shrink-0 inline-flex items-center gap-1.5 rounded-full border border-[#dbeafe] bg-white px-4 py-2 text-xs font-semibold text-[#2563eb] hover:bg-[#eff6ff] transition-colors self-start sm:self-auto cursor-pointer"
        >
          <span>Learn more about how it works</span>
          <ArrowRight className="size-3" />
        </button>
      </div>

      {/* 4. How It Works Modal */}
      {showHowItWorksModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="flex w-full max-w-lg flex-col rounded-2xl border border-[#ede6db] bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#f4efe8]">
              <div className="flex items-center gap-2">
                <Sparkles className="size-5 text-brand" />
                <h3 className="text-base font-bold text-ink">
                  Choosing Your Starting Point
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowHowItWorksModal(false)}
                className="text-[#6b6661] hover:text-ink cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="flex flex-col gap-4 py-4 text-xs sm:text-sm text-ink-muted leading-relaxed">
              <div className="flex items-start gap-3 rounded-xl bg-[#fff6f2] p-3.5 border border-[#fed7aa]">
                <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand text-white font-bold text-xs mt-0.5">
                  1
                </div>
                <div className="flex flex-col gap-1">
                  <strong className="text-ink font-bold">
                    Take AI Assessment (Recommended)
                  </strong>
                  <p className="text-[#6b6661]">
                    Spend 15–25 minutes answering targeted questions. Our AI
                    evaluates your live responses, pinpoints your blind spots,
                    and generates a plan zeroed in on your exact improvement
                    areas.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl bg-[#eff6ff] p-3.5 border border-[#bfdbfe]">
                <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-blue text-white font-bold text-xs mt-0.5">
                  2
                </div>
                <div className="flex flex-col gap-1">
                  <strong className="text-ink font-bold">
                    Create My Preparation Plan Directly
                  </strong>
                  <p className="text-[#6b6661]">
                    Skip the initial diagnostic and generate your curriculum
                    instantly based on your experience level and target company.
                    You can take mock assessments whenever you feel ready.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowHowItWorksModal(false)}
                className="rounded-xl bg-ink px-5 py-2 text-xs font-semibold text-white hover:bg-black cursor-pointer"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
