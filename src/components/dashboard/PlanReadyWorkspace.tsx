"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Check,
  Briefcase,
  TrendingUp,
  Clock,
  Building2,
  Sparkles,
  Pencil,
  Target,
  Zap,
  Calendar,
  BookOpen,
  Code2,
  Users2,
  RotateCcw,
  Flag,
  BarChart3,
  Layers,
  ArrowRight,
  X,
} from "lucide-react";

export function PlanReadyWorkspace() {
  const [showWhyModal, setShowWhyModal] = useState(false);

  return (
    <div className="flex w-full flex-col gap-8">
      {/* 1. Header & Stepper (Step 2 of 3) */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Left: Step kicker & Title */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-brand">
            Step 2 of 3
          </span>
          <h1 className="font-display text-2xl font-extrabold text-ink sm:text-[32px] tracking-tight flex items-center gap-2">
            <span>Your Preparation Plan is Ready!</span>
            <span className="text-2xl sm:text-3xl">🎯</span>
          </h1>
          <p className="text-sm text-ink-muted sm:text-[15px]">
            Based on the details you provided, here&apos;s your personalized
            plan to help you succeed.
          </p>
        </div>

        {/* Right side: Setup Progress Stepper */}
        <div className="flex flex-col gap-2 lg:items-end">
          <span className="text-[11px] font-bold uppercase tracking-wider text-brand">
            Setup Progress · Step 2 of 3
          </span>

          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            {/* Step 1 */}
            <Link
              href="/dashboard?setup=true"
              className="inline-flex items-center gap-1 rounded-full bg-brand px-3 py-1 text-[11px] font-bold text-white shadow-xs hover:opacity-90 transition-opacity"
            >
              <Check className="size-3 stroke-[3]" />
              <span>1 Set Up</span>
            </Link>

            <span className="text-xs font-medium text-brand">→</span>

            {/* Step 2 */}
            <span className="inline-flex items-center rounded-full bg-brand px-3 py-1 text-[11px] font-bold text-white shadow-xs">
              2 Get Plan
            </span>

            <span className="text-xs font-medium text-[#b0a898]">→</span>

            {/* Step 3 */}
            <span className="inline-flex items-center rounded-full border border-[#ede6db] bg-[#faf6f0] px-3 py-1 text-[11px] font-medium text-[#6b6661]">
              3 Start Preparing
            </span>
          </div>
        </div>
      </div>

      {/* 2. User Profile / Parameters Summary Card */}
      <div className="flex flex-col gap-4 rounded-2xl border border-line bg-white p-5 sm:p-6 shadow-[0_4px_16px_rgba(30,28,26,0.03)]">
        {/* Parameters Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {/* Target Role */}
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#f5f3ff] text-purple">
              <Briefcase className="size-5" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-sans text-[11px] font-bold uppercase tracking-[0.5px] text-[#1e1c1a] leading-normal">
                Target Role
              </span>
              <span className="font-display text-sm sm:text-[15px] font-bold text-ink truncate">
                Senior Software Engineer
              </span>
            </div>
          </div>

          {/* Experience */}
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#eff6ff] text-blue">
              <TrendingUp className="size-5" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-sans text-[11px] font-bold uppercase tracking-[0.5px] text-[#1e1c1a] leading-normal">
                Years of Experience
              </span>
              <span className="font-display text-sm sm:text-[15px] font-bold text-ink truncate">
                15+ years
              </span>
            </div>
          </div>

          {/* Preparation Timeline */}
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand">
              <Clock className="size-5" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-sans text-[11px] font-bold uppercase tracking-[0.5px] text-[#1e1c1a] leading-normal">
                Prep Timeline
              </span>
              <span className="font-display text-sm sm:text-[15px] font-bold text-ink truncate">
                2 weeks
              </span>
            </div>
          </div>

          {/* Target Company */}
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#eff6ff] text-blue relative">
              <Building2 className="size-5" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-sans text-[11px] font-bold uppercase tracking-[0.5px] text-[#1e1c1a] leading-normal">
                Target Company
              </span>
              <div className="flex items-center gap-1.5">
                {/* Google Colored Logo */}
                <svg className="size-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span className="font-display text-sm sm:text-[15px] font-bold text-ink truncate">
                  Google
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Customized note & Edit button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-line pt-3.5 text-xs">
          <div className="flex items-center gap-2 text-ink-muted">
            <Sparkles className="size-4 shrink-0 text-purple" />
            <span>
              We&apos;ve created a customized plan based on industry best
              practices, your experience level, and Google&apos;s interview
              focus areas.
            </span>
          </div>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-full border border-line bg-white px-3.5 py-1.5 font-semibold text-ink shadow-xs transition-colors hover:bg-cream shrink-0"
          >
            <Pencil className="size-3 text-ink-muted" />
            <span>Edit Details</span>
          </Link>
        </div>
      </div>

      {/* 3. Middle Two-Column Grid: Focus Areas (Left) + What's Next (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* Left Column: Recommended Focus Areas (span 8) */}
        <div className="lg:col-span-8 flex flex-col gap-4 rounded-2xl border border-line bg-white p-5 sm:p-6 shadow-[0_4px_16px_rgba(30,28,26,0.03)]">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <Target className="size-5 text-brand shrink-0" />
              <div className="flex flex-col gap-0.5">
                <h3 className="font-display text-lg font-extrabold text-ink sm:text-xl">
                  Recommended Focus Areas
                </h3>
                <span className="text-xs text-ink-muted sm:text-sm">
                  Based on your role, experience, and target company
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowWhyModal(true)}
              className="self-start sm:self-auto rounded-full bg-[#eff6ff] px-3.5 py-1.5 text-xs font-semibold text-blue transition-colors hover:bg-blue-100 shrink-0 cursor-pointer"
            >
              Why these topics? →
            </button>
          </div>

          {/* 4 Focus Area Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* System Design */}
            <div className="flex flex-col items-center justify-between rounded-xl border border-[#dbeafe] bg-[#f8faff] p-3.5 text-center gap-2 min-h-[160px]">
              <div className="flex size-10 items-center justify-center rounded-xl bg-white text-blue shadow-xs">
                <Layers className="size-5" />
              </div>
              <div className="flex flex-col gap-1">
                <h4 className="font-display text-sm font-bold text-blue">
                  System Design
                </h4>
                <p className="text-[11px] text-ink-muted leading-tight">
                  High priority for Senior SDE interviews
                </p>
              </div>
              <span className="mt-auto rounded-full bg-[#fee2e2] px-2.5 py-0.5 text-[10px] font-bold text-red">
                High Priority
              </span>
            </div>

            {/* Behavioral */}
            <div className="flex flex-col items-center justify-between rounded-xl border border-[#ffe4e8] bg-[#fff5f7] p-3.5 text-center gap-2 min-h-[160px]">
              <div className="flex size-10 items-center justify-center rounded-xl bg-white text-pink shadow-xs">
                <Users2 className="size-5" />
              </div>
              <div className="flex flex-col gap-1">
                <h4 className="font-display text-sm font-bold text-ink">
                  Behavioral
                </h4>
                <p className="text-[11px] text-ink-muted leading-tight">
                  Leadership, impact and decision making
                </p>
              </div>
              <span className="mt-auto rounded-full bg-[#fee2e2] px-2.5 py-0.5 text-[10px] font-bold text-red">
                High Priority
              </span>
            </div>

            {/* Coding */}
            <div className="flex flex-col items-center justify-between rounded-xl border border-[#dcfce7] bg-[#f0fdf4] p-3.5 text-center gap-2 min-h-[160px]">
              <div className="flex size-10 items-center justify-center rounded-xl bg-white text-[#10b981] shadow-xs">
                <Code2 className="size-5" />
              </div>
              <div className="flex flex-col gap-1">
                <h4 className="font-display text-sm font-bold text-[#15803d]">
                  Coding
                </h4>
                <p className="text-[11px] text-ink-muted leading-tight">
                  Problem solving &amp; system design coding
                </p>
              </div>
              <span className="mt-auto rounded-full bg-[#fef3c7] px-2.5 py-0.5 text-[10px] font-bold text-[#b45309]">
                Medium Priority
              </span>
            </div>

            {/* Communication */}
            <div className="flex flex-col items-center justify-between rounded-xl border border-[#f3e8ff] bg-[#faf5ff] p-3.5 text-center gap-2 min-h-[160px]">
              <div className="flex size-10 items-center justify-center rounded-xl bg-white text-purple shadow-xs">
                <BarChart3 className="size-5" />
              </div>
              <div className="flex flex-col gap-1">
                <h4 className="font-display text-sm font-bold text-purple">
                  Communication
                </h4>
                <p className="text-[11px] text-ink-muted leading-tight">
                  Clear and structured explanations
                </p>
              </div>
              <span className="mt-auto rounded-full bg-[#fef3c7] px-2.5 py-0.5 text-[10px] font-bold text-[#b45309]">
                Medium Priority
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: What's Next? (span 4) */}
        <div className="lg:col-span-4 flex flex-col gap-3.5 rounded-2xl border border-line bg-white p-5 sm:p-6 shadow-[0_4px_16px_rgba(30,28,26,0.03)]">
          {/* Header */}
          <div className="flex items-center gap-2.5">
            <Zap className="size-5 text-amber fill-amber shrink-0" />
            <div className="flex flex-col gap-0.5">
              <h3 className="font-display text-lg font-extrabold text-ink sm:text-xl">
                What&apos;s Next?
              </h3>
              <span className="text-xs text-ink-muted sm:text-sm">
                Start with these to make the most of your plan.
              </span>
            </div>
          </div>

          {/* 4 Steps */}
          <div className="flex flex-col gap-3.5 pt-1">
            {/* Step 1 */}
            <div className="flex items-start gap-3">
              <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#ffedd5] text-[#c2410c] text-xs font-bold mt-0.5">
                1
              </div>
              <div className="flex flex-col">
                <span className="font-display text-sm font-bold text-ink">
                  Go through Today&apos;s Plan
                </span>
                <span className="text-xs text-ink-muted">
                  Start with high-priority topics.
                </span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-3">
              <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#f3e8ff] text-purple text-xs font-bold mt-0.5">
                2
              </div>
              <div className="flex flex-col">
                <span className="font-display text-sm font-bold text-ink">
                  Practice regularly
                </span>
                <span className="text-xs text-ink-muted">
                  Short, focused practice sessions.
                </span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-3">
              <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#dbeafe] text-blue text-xs font-bold mt-0.5">
                3
              </div>
              <div className="flex flex-col">
                <span className="font-display text-sm font-bold text-ink">
                  Take an AI Readiness Assessment
                </span>
                <span className="text-xs text-ink-muted">
                  Get your current level evaluated (optional).
                </span>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex items-start gap-3">
              <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#dcfce7] text-[#15803d] text-xs font-bold mt-0.5">
                4
              </div>
              <div className="flex flex-col">
                <span className="font-display text-sm font-bold text-ink">
                  Track your progress
                </span>
                <span className="text-xs text-ink-muted">
                  The plan will adapt as you improve.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Row 3: Your 2-Week Preparation Timeline */}
      <div className="flex flex-col gap-4 rounded-2xl border border-line bg-white p-5 sm:p-6 shadow-[0_4px_16px_rgba(30,28,26,0.03)]">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <Calendar className="size-5 text-brand shrink-0" />
            <div className="flex flex-col gap-0.5">
              <h3 className="font-display text-lg font-extrabold text-ink sm:text-xl">
                Your 2-Week Preparation Timeline
              </h3>
              <span className="text-xs text-ink-muted sm:text-sm">
                A structured plan to help you build the right skills at the
                right time.
              </span>
            </div>
          </div>

          <Link
            href="/preparation-plan"
            className="self-start sm:self-auto rounded-full border border-line bg-white px-3.5 py-1.5 text-xs font-semibold text-brand transition-colors hover:bg-cream shrink-0"
          >
            View Full Plan →
          </Link>
        </div>

        {/* 5 Timeline Milestone Cards */}
        <div className="flex flex-col md:flex-row items-stretch gap-2.5 overflow-x-auto pb-1">
          {/* Milestone 1 */}
          <div className="flex-1 min-w-[170px] flex flex-col justify-between rounded-xl border border-line bg-[#fbf9f4] p-3.5 gap-2.5">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5 text-blue">
                <BookOpen className="size-4" />
                <span className="text-xs font-semibold text-ink-muted">
                  Days 1–3
                </span>
              </div>
              <h4 className="font-display text-sm font-extrabold text-ink">
                Foundation &amp; Refresh
              </h4>
              <ul className="text-xs text-ink-muted space-y-1 leading-snug">
                <li>• Core concepts</li>
                <li>• Key patterns</li>
                <li>• Quick wins</li>
              </ul>
            </div>
            <span className="rounded-full bg-[#e0f2fe] px-2 py-0.5 text-[11px] font-bold text-[#0284c7] text-center">
              4 topics • ~6 hrs
            </span>
          </div>

          {/* Arrow */}
          <div className="hidden md:flex items-center justify-center text-ink-muted/40">
            <ArrowRight className="size-4" />
          </div>

          {/* Milestone 2 */}
          <div className="flex-1 min-w-[170px] flex flex-col justify-between rounded-xl border border-line bg-[#fbf9f4] p-3.5 gap-2.5">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5 text-[#0284c7]">
                <Code2 className="size-4" />
                <span className="text-xs font-semibold text-ink-muted">
                  Days 4–6
                </span>
              </div>
              <h4 className="font-display text-sm font-extrabold text-ink">
                Deep Dive Practice
              </h4>
              <ul className="text-xs text-ink-muted space-y-1 leading-snug">
                <li>• System design</li>
                <li>• Coding problems</li>
                <li>• Behavioral examples</li>
              </ul>
            </div>
            <span className="rounded-full bg-[#e0f2fe] px-2 py-0.5 text-[11px] font-bold text-[#0284c7] text-center">
              5 topics • ~7 hrs
            </span>
          </div>

          {/* Arrow */}
          <div className="hidden md:flex items-center justify-center text-ink-muted/40">
            <ArrowRight className="size-4" />
          </div>

          {/* Milestone 3 */}
          <div className="flex-1 min-w-[170px] flex flex-col justify-between rounded-xl border border-line bg-[#fbf9f4] p-3.5 gap-2.5">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5 text-purple">
                <Users2 className="size-4" />
                <span className="text-xs font-semibold text-ink-muted">
                  Days 7–10
                </span>
              </div>
              <h4 className="font-display text-sm font-extrabold text-ink">
                Mock Interviews
              </h4>
              <ul className="text-xs text-ink-muted space-y-1 leading-snug">
                <li>• AI mock interviews</li>
                <li>• Detailed feedback</li>
                <li>• Focus on weak areas</li>
              </ul>
            </div>
            <span className="rounded-full bg-[#f3e8ff] px-2 py-0.5 text-[11px] font-bold text-purple text-center">
              4 sessions • ~5 hrs
            </span>
          </div>

          {/* Arrow */}
          <div className="hidden md:flex items-center justify-center text-ink-muted/40">
            <ArrowRight className="size-4" />
          </div>

          {/* Milestone 4 */}
          <div className="flex-1 min-w-[170px] flex flex-col justify-between rounded-xl border border-line bg-[#fbf9f4] p-3.5 gap-2.5">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5 text-brand">
                <RotateCcw className="size-4" />
                <span className="text-xs font-semibold text-ink-muted">
                  Days 11–13
                </span>
              </div>
              <h4 className="font-display text-sm font-extrabold text-ink">
                Targeted Revision
              </h4>
              <ul className="text-xs text-ink-muted space-y-1 leading-snug">
                <li>• Revise key topics</li>
                <li>• Practice questions</li>
                <li>• Improve communication</li>
              </ul>
            </div>
            <span className="rounded-full bg-[#fef3c7] px-2 py-0.5 text-[11px] font-bold text-[#b45309] text-center">
              3 topics • ~4 hrs
            </span>
          </div>

          {/* Arrow */}
          <div className="hidden md:flex items-center justify-center text-ink-muted/40">
            <ArrowRight className="size-4" />
          </div>

          {/* Milestone 5 */}
          <div className="flex-1 min-w-[170px] flex flex-col justify-between rounded-xl border border-line bg-[#fbf9f4] p-3.5 gap-2.5">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5 text-red">
                <Flag className="size-4" />
                <span className="text-xs font-semibold text-ink-muted">
                  Days 14
                </span>
              </div>
              <h4 className="font-display text-sm font-extrabold text-ink">
                Final Review
              </h4>
              <ul className="text-xs text-ink-muted space-y-1 leading-snug">
                <li>• Quick revision</li>
                <li>• Readiness checklist</li>
                <li>• Next steps</li>
              </ul>
            </div>
            <span className="rounded-full bg-[#fee2e2] px-2 py-0.5 text-[11px] font-bold text-red text-center">
              1 session • ~2 hrs
            </span>
          </div>
        </div>
      </div>

      {/* 5. Row 4: Bottom Banner ("Ready to start?") */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 rounded-2xl border border-line bg-white p-5 sm:p-6 shadow-[0_4px_16px_rgba(30,28,26,0.03)]">
        {/* Left: Confetti Celebration + Copy */}
        <div className="flex items-center gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-brand-soft text-2xl shadow-xs">
            🎉
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="font-display text-lg font-extrabold text-ink sm:text-xl">
              Ready to start?
            </h3>
            <p className="text-xs text-ink-muted sm:text-sm leading-relaxed max-w-xl">
              Your personalized plan is waiting. You can also take an AI
              assessment now to see your current readiness and get an even more
              tailored roadmap.
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex flex-wrap items-center gap-3 shrink-0 self-start sm:self-auto">
          <Link
            href="/dashboard?step=3"
            onClick={() => {
              try {
                localStorage.setItem("prep_onboarding_completed", "true");
              } catch {}
            }}
            className="flex items-center justify-center rounded-full bg-brand px-8 py-3 text-[15px] font-semibold text-white shadow-[0_4px_12px_rgba(255,108,71,0.2)] transition-opacity hover:opacity-95 active:scale-[0.99] whitespace-nowrap"
          >
            Go to My Preparation Plan →
          </Link>

          <Link
            href="/practice"
            className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-5 py-3 text-[13px] sm:text-sm font-semibold text-blue shadow-[0_2px_8px_rgba(30,28,26,0.02)] transition-colors hover:bg-cream whitespace-nowrap"
          >
            <BarChart3 className="size-4" />
            <span>Take AI Assessment (Optional)</span>
          </Link>
        </div>
      </div>

      {/* MODAL: Why these topics? */}
      {showWhyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="flex w-full max-w-lg flex-col rounded-2xl border border-line bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between pb-3.5 border-b border-line">
              <div className="flex items-center gap-2">
                <Target className="size-5 text-brand" />
                <h3 className="font-display text-base font-extrabold text-ink sm:text-lg">
                  Why These Focus Areas?
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowWhyModal(false)}
                className="text-ink-muted hover:text-ink cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="flex flex-col gap-3 py-4 text-xs sm:text-[13px] text-ink-muted leading-relaxed">
              <div className="rounded-xl border border-[#dbeafe] bg-[#f8faff] p-3.5">
                <strong className="font-display font-bold text-ink">
                  System Design (High Priority):
                </strong>
                <p className="mt-1 text-ink-muted">
                  For 15+ years Senior SDE roles at Google, architecture,
                  distributed scalability, and tradeoff analysis account for
                  over 50% of the bar evaluation.
                </p>
              </div>

              <div className="rounded-xl border border-[#ffe4e8] bg-[#fff5f7] p-3.5">
                <strong className="font-display font-bold text-ink">
                  Behavioral &amp; Googliness (High Priority):
                </strong>
                <p className="mt-1 text-ink-muted">
                  Staff/Senior engineering interviews require deep STAR examples
                  on technical conflict resolution, cross-org mentorship, and
                  executive communication.
                </p>
              </div>

              <div className="rounded-xl border border-[#dcfce7] bg-[#f0fdf4] p-3.5">
                <strong className="font-display font-bold text-ink">
                  Coding (Medium Priority):
                </strong>
                <p className="mt-1 text-ink-muted">
                  Maintaining algorithmic agility in sliding windows, graph
                  traversals, and concurrency.
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowWhyModal(false)}
                className="rounded-full bg-brand px-6 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs hover:bg-[#fa552b] cursor-pointer"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
