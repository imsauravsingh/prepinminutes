"use client";

import Link from "next/link";
import {
  Check,
  Briefcase,
  TrendingUp,
  Clock,
  Building2,
  Pencil,
  Lightbulb,
  Calendar,
  BookOpen,
  Code2,
  MessageSquare,
  Users2,
  Layers,
  Zap,
  Mic,
  FileText,
  BarChart3,
  ChevronRight,
  Settings,
} from "lucide-react";

interface StartPreparingWorkspaceProps {
  onEditSetup?: () => void;
}

export function StartPreparingWorkspace({
  onEditSetup,
}: StartPreparingWorkspaceProps) {
  // Circular progress calculation for 12%
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const progressPercent = 12;
  const strokeDashoffset =
    circumference - (circumference * progressPercent) / 100;

  return (
    <div className="flex w-full flex-col gap-8">
      {/* 1. Header & Stepper (Step 3 of 3) */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Left: Step kicker & Title */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-brand">
            Step 3 of 3
          </span>
          <h1 className="font-display text-2xl font-extrabold text-ink sm:text-[32px] tracking-tight flex items-center gap-2">
            <span>Let&apos;s Start Preparing!</span>
            <span className="text-2xl sm:text-3xl">🚀</span>
          </h1>
          <p className="text-sm text-ink-muted sm:text-[15px]">
            Your plan is ready. Follow your personalized roadmap, practice
            consistently, and track your progress.
          </p>
        </div>

        {/* Right side: Setup Progress Stepper */}
        <div className="flex flex-col gap-2 lg:items-end">
          <span className="text-[11px] font-bold uppercase tracking-wider text-brand">
            Setup Progress · Step 3 of 3
          </span>

          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            {/* Step 1 */}
            {onEditSetup ? (
              <button
                type="button"
                onClick={onEditSetup}
                className="inline-flex items-center gap-1 rounded-full bg-brand px-3 py-1 text-[11px] font-bold text-white shadow-xs hover:opacity-90 transition-opacity cursor-pointer"
              >
                <Check className="size-3 stroke-[3]" />
                <span>1 Set Up</span>
              </button>
            ) : (
              <Link
                href="/dashboard?setup=true"
                className="inline-flex items-center gap-1 rounded-full bg-brand px-3 py-1 text-[11px] font-bold text-white shadow-xs hover:opacity-90 transition-opacity"
              >
                <Check className="size-3 stroke-[3]" />
                <span>1 Set Up</span>
              </Link>
            )}

            <span className="text-xs font-medium text-brand">→</span>

            {/* Step 2 */}
            <Link
              href="/dashboard/plan-ready"
              className="inline-flex items-center gap-1 rounded-full bg-brand px-3 py-1 text-[11px] font-bold text-white shadow-xs hover:opacity-90 transition-opacity"
            >
              <Check className="size-3 stroke-[3]" />
              <span>2 Get Plan</span>
            </Link>

            <span className="text-xs font-medium text-brand">→</span>

            {/* Step 3 */}
            <span className="inline-flex items-center rounded-full bg-brand px-3 py-1 text-[11px] font-bold text-white shadow-xs">
              3 Start Preparing
            </span>
          </div>
        </div>
      </div>

      {/* 2. User Profile / Parameters Summary Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-line bg-white p-5 sm:p-6 shadow-[0_4px_16px_rgba(30,28,26,0.03)]">
        {/* Parameters Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 flex-1">
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

        {/* Edit Button */}
        {onEditSetup ? (
          <button
            type="button"
            onClick={onEditSetup}
            className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-full border border-line bg-white px-3.5 py-1.5 font-semibold text-ink shadow-xs transition-colors hover:bg-cream shrink-0 text-xs"
          >
            <Pencil className="size-3 text-ink-muted" />
            <span>Edit Details</span>
          </button>
        ) : (
          <Link
            href="/dashboard?setup=true"
            className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-full border border-line bg-white px-3.5 py-1.5 font-semibold text-ink shadow-xs transition-colors hover:bg-cream shrink-0 text-xs"
          >
            <Pencil className="size-3 text-ink-muted" />
            <span>Edit Details</span>
          </Link>
        )}
      </div>

      {/* 3. Middle Two-Column Grid: Today's Preparation (Left) + Your Progress (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* Left Column: Today's Preparation (span 7) */}
        <div className="lg:col-span-7 flex flex-col justify-between gap-4 rounded-2xl border border-line bg-white p-5 sm:p-6 shadow-[0_4px_16px_rgba(30,28,26,0.03)]">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-xl bg-amber/10 text-amber">
                <Lightbulb className="size-5 fill-amber/20" />
              </div>
              <div className="flex flex-col gap-0.5">
                <h3 className="font-display text-lg font-extrabold text-ink sm:text-xl">
                  Today&apos;s Preparation
                </h3>
                <span className="text-xs text-ink-muted sm:text-sm">
                  A focused plan to keep you on track. ~ 25 minutes
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
              <div className="flex items-center gap-1.5 text-xs text-ink-muted font-medium">
                <Calendar className="size-3.5" />
                <span>Mon, Sep 16, 2026</span>
              </div>
              <span className="rounded-full bg-brand-soft px-2.5 py-0.5 text-xs font-bold text-brand">
                25 min
              </span>
            </div>
          </div>

          {/* Activities List */}
          <div className="flex flex-col gap-3">
            {/* Activity 1: System Design */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-line bg-white p-3.5 shadow-2xs hover:border-brand/30 transition-colors">
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#ffe4e8] text-pink">
                  <BookOpen className="size-5" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <h4 className="font-display text-sm font-bold text-ink">
                    System Design: Load Balancing
                  </h4>
                  <p className="text-xs text-ink-muted">
                    Read key concepts and patterns
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
                <span className="text-xs font-semibold text-ink-muted">
                  10 min
                </span>
                <Link
                  href="/practice/session/system-design"
                  className="rounded-full bg-brand px-4 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-[#fa552b] transition-colors"
                >
                  Start →
                </Link>
              </div>
            </div>

            {/* Activity 2: Coding Practice */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-line bg-white p-3.5 shadow-2xs hover:border-brand/30 transition-colors">
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#eff6ff] text-blue">
                  <Code2 className="size-5" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <h4 className="font-display text-sm font-bold text-ink">
                    Coding Practice
                  </h4>
                  <p className="text-xs text-ink-muted">
                    Solve 1–2 problems (medium)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
                <span className="text-xs font-semibold text-ink-muted">
                  10 min
                </span>
                <Link
                  href="/practice/session/coding"
                  className="rounded-full border border-line bg-white px-4 py-1.5 text-xs font-semibold text-ink shadow-xs hover:bg-cream transition-colors"
                >
                  Start →
                </Link>
              </div>
            </div>

            {/* Activity 3: Behavioral */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-line bg-white p-3.5 shadow-2xs hover:border-brand/30 transition-colors">
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#f5f3ff] text-purple">
                  <MessageSquare className="size-5" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <h4 className="font-display text-sm font-bold text-ink">
                    Behavioral: Conflict Resolution
                  </h4>
                  <p className="text-xs text-ink-muted">
                    Practice answering using STAR
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
                <span className="text-xs font-semibold text-ink-muted">
                  5 min
                </span>
                <Link
                  href="/practice/session/behavioral"
                  className="rounded-full border border-line bg-white px-4 py-1.5 text-xs font-semibold text-ink shadow-xs hover:bg-cream transition-colors"
                >
                  Start →
                </Link>
              </div>
            </div>
          </div>

          {/* Motivation Callout */}
          <div className="flex items-center gap-3 rounded-xl border border-brand/20 bg-brand-soft/60 p-3.5 text-xs">
            <span className="text-xl">📣</span>
            <div className="flex flex-col">
              <span className="font-bold text-ink">
                Complete today&apos;s plan to build momentum!
              </span>
              <span className="text-ink-muted">
                Your plan adapts as you practice and improve.
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Your Progress (span 5) */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-5 rounded-2xl border border-line bg-white p-5 sm:p-6 shadow-[0_4px_16px_rgba(30,28,26,0.03)]">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-extrabold text-ink sm:text-xl">
              Your Progress
            </h3>
            <Link
              href="/preparation-plan"
              className="text-xs font-semibold text-blue hover:underline"
            >
              View Full Plan →
            </Link>
          </div>

          {/* Radial Ring & Main Metric */}
          <div className="flex items-center gap-5 sm:gap-6 py-1">
            {/* SVG Circular Ring */}
            <div className="relative flex size-24 shrink-0 items-center justify-center">
              <svg className="size-full -rotate-90" viewBox="0 0 90 90">
                <circle
                  cx="45"
                  cy="45"
                  r={radius}
                  className="stroke-[#f4efe8]"
                  strokeWidth="7"
                  fill="transparent"
                />
                <circle
                  cx="45"
                  cy="45"
                  r={radius}
                  className="stroke-brand transition-all duration-700 ease-out"
                  strokeWidth="7"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-display text-xl font-extrabold text-ink">
                  12%
                </span>
              </div>
            </div>

            {/* Metrics */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-baseline gap-1.5">
                <span className="font-display text-2xl font-extrabold text-ink">
                  3 / 24
                </span>
                <span className="text-xs text-ink-muted">
                  Activities completed
                </span>
              </div>

              <div className="inline-flex items-center gap-1 rounded-full bg-[#edf5ec] px-2.5 py-0.5 text-[11px] font-semibold text-[#10b981] w-fit">
                <span>↗</span>
                <span>You&apos;re on track!</span>
              </div>
            </div>
          </div>

          {/* 3 Metric Pills Grid */}
          <div className="grid grid-cols-3 gap-2.5 pt-2 border-t border-line">
            {/* Metric 1 */}
            <div className="flex flex-col items-center justify-center rounded-xl bg-[#fbf9f4] p-2.5 text-center gap-1">
              <BookOpen className="size-4 text-[#10b981]" />
              <span className="font-display text-base font-bold text-ink leading-none">
                1
              </span>
              <span className="text-[10px] text-ink-muted">Day completed</span>
            </div>

            {/* Metric 2 */}
            <div className="flex flex-col items-center justify-center rounded-xl bg-[#fbf9f4] p-2.5 text-center gap-1">
              <Zap className="size-4 text-purple" />
              <span className="font-display text-base font-bold text-ink leading-none">
                5
              </span>
              <span className="text-[10px] text-ink-muted">
                Topics in progress
              </span>
            </div>

            {/* Metric 3 */}
            <div className="flex flex-col items-center justify-center rounded-xl bg-[#fbf9f4] p-2.5 text-center gap-1">
              <Clock className="size-4 text-blue" />
              <span className="font-display text-base font-bold text-ink leading-none">
                12
              </span>
              <span className="text-[10px] text-ink-muted">Days remaining</span>
            </div>
          </div>

          {/* Quote Card */}
          <div className="rounded-xl border border-line bg-[#fbf9f4] p-3.5 flex flex-col gap-1 text-xs">
            <p className="italic text-ink font-medium leading-snug">
              “A little progress each day adds up to big results.”
            </p>
            <span className="text-[11px] text-ink-muted">— James Clear</span>
          </div>
        </div>
      </div>

      {/* 4. Row 3: Your Preparation Areas */}
      <div className="flex flex-col gap-4 rounded-2xl border border-line bg-white p-5 sm:p-6 shadow-[0_4px_16px_rgba(30,28,26,0.03)]">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex flex-col gap-0.5">
            <h3 className="font-display text-lg font-extrabold text-ink sm:text-xl">
              Your Preparation Areas
            </h3>
            <span className="text-xs text-ink-muted sm:text-sm">
              Focus on these areas as per your plan. Progress will update as you
              complete activities.
            </span>
          </div>

          <Link
            href="/preparation-plan"
            className="self-start sm:self-auto rounded-full border border-line bg-white px-3.5 py-1 text-xs font-semibold text-brand hover:bg-cream transition-colors shrink-0"
          >
            View All →
          </Link>
        </div>

        {/* 4 Topic Area Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* 1. System Design */}
          <div className="flex flex-col justify-between gap-3 rounded-xl border border-[#ffe4dc] bg-[#fff8f6] p-4">
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-lg bg-white text-red shadow-xs">
                <Layers className="size-4" />
              </div>
              <h4 className="font-display text-sm font-bold text-ink">
                System Design
              </h4>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-ink-muted">Progress</span>
                <span className="font-bold text-ink">18%</span>
              </div>
              <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-[#ede6db]">
                <div
                  className="h-full rounded-full bg-brand transition-all duration-300"
                  style={{ width: "18%" }}
                />
              </div>
              <span className="text-[11px] text-ink-muted">
                8 topics remaining
              </span>
            </div>
          </div>

          {/* 2. Coding */}
          <div className="flex flex-col justify-between gap-3 rounded-xl border border-[#dbeafe] bg-[#f0f7ff] p-4">
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-lg bg-white text-blue shadow-xs">
                <Code2 className="size-4" />
              </div>
              <h4 className="font-display text-sm font-bold text-ink">
                Coding
              </h4>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-ink-muted">Progress</span>
                <span className="font-bold text-ink">10%</span>
              </div>
              <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-[#ede6db]">
                <div
                  className="h-full rounded-full bg-blue transition-all duration-300"
                  style={{ width: "10%" }}
                />
              </div>
              <span className="text-[11px] text-ink-muted">
                12 topics remaining
              </span>
            </div>
          </div>

          {/* 3. Behavioral */}
          <div className="flex flex-col justify-between gap-3 rounded-xl border border-[#f3e8ff] bg-[#faf5ff] p-4">
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-lg bg-white text-purple shadow-xs">
                <Users2 className="size-4" />
              </div>
              <h4 className="font-display text-sm font-bold text-ink">
                Behavioral
              </h4>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-ink-muted">Progress</span>
                <span className="font-bold text-ink">5%</span>
              </div>
              <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-[#ede6db]">
                <div
                  className="h-full rounded-full bg-purple transition-all duration-300"
                  style={{ width: "5%" }}
                />
              </div>
              <span className="text-[11px] text-ink-muted">
                10 topics remaining
              </span>
            </div>
          </div>

          {/* 4. Communication */}
          <div className="flex flex-col justify-between gap-3 rounded-xl border border-[#dcfce7] bg-[#f0fdf4] p-4">
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-lg bg-white text-[#10b981] shadow-xs">
                <MessageSquare className="size-4" />
              </div>
              <h4 className="font-display text-sm font-bold text-ink">
                Communication
              </h4>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-ink-muted">Progress</span>
                <span className="font-bold text-ink">8%</span>
              </div>
              <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-[#ede6db]">
                <div
                  className="h-full rounded-full bg-[#10b981] transition-all duration-300"
                  style={{ width: "8%" }}
                />
              </div>
              <span className="text-[11px] text-ink-muted">
                8 topics remaining
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Row 4: Bottom Two-Column Split (Quick Actions + Pro Tip) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* Left: Quick Actions (span 7) */}
        <div className="lg:col-span-7 flex flex-col gap-4 rounded-2xl border border-line bg-white p-5 sm:p-6 shadow-[0_4px_16px_rgba(30,28,26,0.03)]">
          <div className="flex items-center gap-2.5">
            <Zap className="size-5 text-amber fill-amber shrink-0" />
            <div className="flex flex-col gap-0.5">
              <h3 className="font-display text-lg font-extrabold text-ink sm:text-xl">
                Quick Actions
              </h3>
              <span className="text-xs text-ink-muted sm:text-sm">
                Other ways to practice and improve.
              </span>
            </div>
          </div>

          {/* 2x2 Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* 1. Practice by Topic */}
            <Link
              href="/practice"
              className="flex items-center justify-between rounded-xl border border-line bg-[#fbf9f4] p-3.5 hover:bg-cream hover:border-brand/30 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white text-blue shadow-2xs">
                  <BookOpen className="size-4" />
                </div>
                <div className="flex flex-col">
                  <span className="font-display text-xs font-bold text-ink group-hover:text-brand transition-colors">
                    Practice by Topic
                  </span>
                  <span className="text-[11px] text-ink-muted">
                    Choose a topic and start practicing.
                  </span>
                </div>
              </div>
              <ChevronRight className="size-4 text-ink-muted/60 group-hover:text-brand transition-colors" />
            </Link>

            {/* 2. AI Mock Interview */}
            <Link
              href="/practice/session"
              className="flex items-center justify-between rounded-xl border border-line bg-[#fbf9f4] p-3.5 hover:bg-cream hover:border-brand/30 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white text-purple shadow-2xs">
                  <Mic className="size-4" />
                </div>
                <div className="flex flex-col">
                  <span className="font-display text-xs font-bold text-ink group-hover:text-brand transition-colors">
                    AI Mock Interview
                  </span>
                  <span className="text-[11px] text-ink-muted">
                    Simulate a real interview.
                  </span>
                </div>
              </div>
              <ChevronRight className="size-4 text-ink-muted/60 group-hover:text-brand transition-colors" />
            </Link>

            {/* 3. Revise Notes */}
            <Link
              href="/practice"
              className="flex items-center justify-between rounded-xl border border-line bg-[#fbf9f4] p-3.5 hover:bg-cream hover:border-brand/30 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white text-blue shadow-2xs">
                  <FileText className="size-4" />
                </div>
                <div className="flex flex-col">
                  <span className="font-display text-xs font-bold text-ink group-hover:text-brand transition-colors">
                    Revise Notes
                  </span>
                  <span className="text-[11px] text-ink-muted">
                    Review your saved notes.
                  </span>
                </div>
              </div>
              <ChevronRight className="size-4 text-ink-muted/60 group-hover:text-brand transition-colors" />
            </Link>

            {/* 4. Track Progress */}
            <Link
              href="/preparation-plan"
              className="flex items-center justify-between rounded-xl border border-line bg-[#fbf9f4] p-3.5 hover:bg-cream hover:border-brand/30 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white text-purple shadow-2xs">
                  <BarChart3 className="size-4" />
                </div>
                <div className="flex flex-col">
                  <span className="font-display text-xs font-bold text-ink group-hover:text-brand transition-colors">
                    Track Progress
                  </span>
                  <span className="text-[11px] text-ink-muted">
                    See detailed analytics.
                  </span>
                </div>
              </div>
              <ChevronRight className="size-4 text-ink-muted/60 group-hover:text-brand transition-colors" />
            </Link>
          </div>
        </div>

        {/* Right: Pro Tip (span 5) */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-5 rounded-2xl border border-line bg-white p-5 sm:p-6 shadow-[0_4px_16px_rgba(30,28,26,0.03)]">
          {/* Top: Pro Tip */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Lightbulb className="size-5 text-amber fill-amber/20" />
              <h3 className="font-display text-base font-extrabold text-ink">
                Pro Tip
              </h3>
            </div>

            <h4 className="font-display text-sm font-bold text-ink mt-1">
              Consistency beats cramming.
            </h4>
            <p className="text-xs text-ink-muted leading-relaxed">
              Spend 30–60 minutes daily, and let the plan guide you.
            </p>
          </div>

          {/* Bottom: Need to adjust your plan? */}
          <div className="flex flex-col gap-2.5 pt-3 border-t border-line">
            <div className="flex flex-col gap-0.5">
              <span className="font-display text-xs font-bold text-ink">
                Need to adjust your plan?
              </span>
              <span className="text-[11px] text-ink-muted leading-tight">
                You can always update your timeline or target role from
                settings.
              </span>
            </div>

            {onEditSetup ? (
              <button
                type="button"
                onClick={onEditSetup}
                className="inline-flex items-center gap-1.5 self-start rounded-xl border border-line bg-white px-3.5 py-1.5 text-xs font-semibold text-ink shadow-xs hover:bg-cream transition-colors"
              >
                <Settings className="size-3.5 text-ink-muted" />
                <span>Update Plan</span>
              </button>
            ) : (
              <Link
                href="/dashboard?setup=true"
                className="inline-flex items-center gap-1.5 self-start rounded-xl border border-line bg-white px-3.5 py-1.5 text-xs font-semibold text-ink shadow-xs hover:bg-cream transition-colors"
              >
                <Settings className="size-3.5 text-ink-muted" />
                <span>Update Plan</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* 6. Celebration Banner ("You're all set!") */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-line bg-white p-5 sm:p-6 shadow-[0_4px_16px_rgba(30,28,26,0.03)]">
        {/* Left: Confetti + Copy */}
        <div className="flex items-center gap-3.5">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-2xl shadow-xs">
            🎉
          </div>
          <div className="flex flex-col gap-0.5">
            <h3 className="font-display text-base font-bold text-ink sm:text-lg">
              You&apos;re all set!
            </h3>
            <p className="text-xs text-ink-muted sm:text-sm">
              Keep going, stay consistent, and make the most of your preparation
              journey.
            </p>
          </div>
        </div>

        {/* Right: Continue CTA */}
        <Link
          href="/preparation-plan"
          className="flex items-center justify-center rounded-full bg-brand px-8 py-3 text-[15px] font-semibold text-white shadow-[0_4px_12px_rgba(255,108,71,0.2)] transition-opacity hover:opacity-95 active:scale-[0.99] whitespace-nowrap self-start sm:self-auto"
        >
          Continue to My Preparation Plan →
        </Link>
      </div>
    </div>
  );
}
