"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Check,
  ArrowUp,
  Lightbulb,
  TrendingUp,
  Download,
  RotateCcw,
  ArrowLeft,
  Share2,
  Clock,
  Award,
  Layers,
  Users,
  Target,
  BarChart3,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  HeartHandshake,
  MessageSquare,
} from "lucide-react";

export function BehavioralEvaluation() {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      window.print();
    }, 600);
  };

  const evaluationCriteria = [
    {
      title: "Situation Framing (Context)",
      score: "9.0 / 10",
      rating: "Exceptional",
      percent: 90,
      icon: Target,
      color: "text-[#2563eb]",
      bg: "bg-[#eff6ff]",
      feedback:
        "Crisply framed a high-stakes P0 payment latency degradation affecting 18% of global checkout traffic without rambling or conversational drift.",
    },
    {
      title: "Task Ownership & Accountability",
      score: "9.0 / 10",
      rating: "Exceptional",
      percent: 90,
      icon: ShieldCheck,
      color: "text-[#10b981]",
      bg: "bg-[#edf5ec]",
      feedback:
        "Stepped up as the primary incident commander, defined clear blast-radius mitigation goals, and established concrete SLA recovery targets.",
    },
    {
      title: "Action & Conflict Mediation",
      score: "8.5 / 10",
      rating: "Strong",
      percent: 85,
      icon: Users,
      color: "text-[#7c3aed]",
      bg: "bg-[#f5f3ff]",
      feedback:
        "Defused heated finger-pointing between Infrastructure and Product by establishing objective APM telemetry criteria for safe rollback.",
    },
    {
      title: "Quantifiable Business Results",
      score: "8.5 / 10",
      rating: "Strong",
      percent: 85,
      icon: BarChart3,
      color: "text-[#ff6c47]",
      bg: "bg-[#fff0ec]",
      feedback:
        "Anchored outcome in hard metrics: reduced MTTR from 45m to 14m (-68%), restored 99.99% availability, and protected $120K in checkout volume.",
    },
    {
      title: "Empathy & Blameless Culture",
      score: "9.0 / 10",
      rating: "Exceptional",
      percent: 90,
      icon: HeartHandshake,
      color: "text-[#0d9488]",
      bg: "bg-[#e6fbf9]",
      feedback:
        "Maintained psychological safety in the war room, facilitated blameless 5-whys post-mortems, and protected junior engineers from unfair attribution.",
    },
    {
      title: "Reflection & Continuous Learning",
      score: "8.5 / 10",
      rating: "Strong",
      percent: 85,
      icon: TrendingUp,
      color: "text-[#2563eb]",
      bg: "bg-[#eff6ff]",
      feedback:
        "Codified architectural lessons into automated circuit breakers, synthetic canary probes, and quarterly cross-pod game day simulations.",
    },
  ];

  const timelineMilestones = [
    {
      stage: "Step 1",
      name: "Situation & Task Framing (STAR)",
      time: "4 min",
      status: "Completed",
      score: "9.5 / 10",
      highlight:
        "Articulated context of critical database connection pool exhaustion and personal ownership as incident commander.",
    },
    {
      stage: "Step 2",
      name: "Crisis Triage & Conflict Mediation",
      time: "8 min",
      status: "Completed",
      score: "8.5 / 10",
      highlight:
        "De-escalated tension between infrastructure and backend teams by establishing objective telemetry criteria for rollback.",
    },
    {
      stage: "Step 3",
      name: "Resolution & Quantifiable Business Results",
      time: "6 min",
      status: "Completed",
      score: "9.0 / 10",
      highlight:
        "Safely mitigated outage in 14 minutes, preventing estimated $120K in checkout loss and recovering 99.99% availability.",
    },
    {
      stage: "Step 4",
      name: "Reflection & Blameless Post-Mortem",
      time: "6 min",
      status: "Completed",
      score: "8.5 / 10",
      highlight:
        "Led blameless post-mortem resulting in circuit breaker implementation and updated chaos engineering drills.",
    },
  ];

  return (
    <div className="flex w-full flex-col gap-6 sm:gap-8 max-w-[1300px] mx-auto pb-16">
      {/* 1. Header & Navigation Row */}
      <div className="flex flex-col gap-4">
        {/* Breadcrumb Path */}
        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
          <Link
            href="/practice"
            className="font-medium text-ink-muted hover:text-brand transition-colors"
          >
            Practice
          </Link>
          <span className="text-[#b0a898]">•</span>
          <Link
            href="/practice/session/behavioral"
            className="font-medium text-ink-muted hover:text-brand transition-colors"
          >
            Behavioral Session
          </Link>
          <span className="text-[#b0a898]">•</span>
          <span className="font-bold text-brand uppercase tracking-wider text-[11px] sm:text-xs">
            Evaluation Report
          </span>
        </div>

        {/* Title & Action Bar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1.5 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-[#fff0ec] px-2.5 py-0.5 text-xs font-bold text-brand">
                Behavioral &amp; Leadership
              </span>
              <span className="rounded-md bg-purple-50 px-2.5 py-0.5 text-xs font-bold text-[#7c3aed]">
                STAR Method · Crisis Resolution
              </span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
              Practice Evaluation: High-Stakes Incident Management &amp;
              Cross-Functional Alignment
            </h1>
            <p className="text-xs sm:text-sm text-ink-muted">
              Completed on September 27, 2026 • 24 min practice drill •
              Evaluator: Sarah (AI Executive Leadership Coach)
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 shrink-0">
            <button
              type="button"
              onClick={handleShare}
              className="flex h-9 sm:h-10 items-center gap-1.5 rounded-full border border-line bg-white px-3.5 sm:px-4 text-xs font-semibold text-ink shadow-2xs hover:bg-[#faf6f0] transition-colors cursor-pointer"
            >
              <Share2 className="size-3.5 text-ink-muted" />
              <span>{copied ? "Copied Link!" : "Share"}</span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              disabled={downloading}
              className="flex h-9 sm:h-10 items-center gap-1.5 rounded-full border border-line bg-white px-3.5 sm:px-4 text-xs font-semibold text-ink shadow-2xs hover:bg-[#faf6f0] transition-colors cursor-pointer"
            >
              <Download className="size-3.5 text-ink-muted" />
              <span>{downloading ? "Preparing..." : "Export PDF"}</span>
            </button>

            <Link
              href="/practice/session/behavioral"
              className="flex h-9 sm:h-10 items-center gap-1.5 rounded-full bg-brand px-4 sm:px-5 text-xs sm:text-sm font-bold text-white shadow-[0_4px_12px_rgba(255,108,71,0.25)] hover:bg-[#eb4a19] transition-all cursor-pointer"
            >
              <RotateCcw className="size-3.5" />
              <span>Retake Drill</span>
            </Link>
          </div>
        </div>

        {/* Practice Progress Stepper Bar (Step 4 of 4 - 100% Complete) */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-brand">
              Step 4 of 4: Behavioral &amp; Leadership Evaluation
            </span>
            <span className="text-[#10b981] font-bold">100% Completed</span>
          </div>
          <div className="flex h-2 w-full overflow-hidden rounded-full bg-[#ede6db]">
            <div
              className="h-full bg-[#10b981] transition-all duration-300"
              style={{ width: "25%" }}
              title="Step 1 Coding: Evaluated"
            />
            <div
              className="h-full bg-[#10b981] transition-all duration-300"
              style={{ width: "25%" }}
              title="Step 2 System Design: Evaluated"
            />
            <div
              className="h-full bg-[#10b981] transition-all duration-300"
              style={{ width: "25%" }}
              title="Step 3 Cloud: Evaluated"
            />
            <div
              className="h-full bg-[#10b981] transition-all duration-300"
              style={{ width: "25%" }}
              title="Step 4 Behavioral: Evaluated"
            />
          </div>
        </div>
      </div>

      {/* 2. Executive Summary Hero Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 w-full items-stretch">
        {/* Left Column: Overall Score & Verdict (8 cols) */}
        <div className="lg:col-span-8 flex flex-col justify-between gap-5 rounded-2xl sm:rounded-3xl border border-line bg-white p-5 sm:p-7 shadow-[0_4px_20px_rgba(30,28,26,0.03)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-line/60">
            {/* Score Ring & Verdict */}
            <div className="flex items-center gap-4">
              <div className="relative flex size-18 sm:size-20 shrink-0 items-center justify-center">
                <svg className="size-full -rotate-90" viewBox="0 0 80 80">
                  <circle
                    cx="40"
                    cy="40"
                    r="34"
                    stroke="#ede6db"
                    strokeWidth="6"
                    fill="none"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="34"
                    stroke="#ff5520"
                    strokeWidth="6"
                    strokeDasharray={213}
                    strokeDashoffset={213 - (213 * 88) / 100}
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="font-display text-xl sm:text-2xl font-black text-ink">
                    88
                  </span>
                  <span className="text-[10px] text-ink-muted uppercase font-bold">
                    / 100
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 rounded-full bg-[#edf5ec] px-3 py-1 text-xs font-extrabold text-[#10b981]">
                    <Check className="size-3.5 stroke-[3]" />
                    Strong Hire
                  </span>
                  <span className="text-xs font-semibold text-ink-muted">
                    Percentile: Top 8%
                  </span>
                </div>
                <h2 className="font-display text-base sm:text-lg font-bold text-ink">
                  Leadership &amp; Crisis Mediation Excellence
                </h2>
              </div>
            </div>

            {/* Readiness Growth Pill */}
            <div className="inline-flex items-center gap-2.5 rounded-xl border border-line bg-[#faf6f0] px-3.5 py-2.5 self-start sm:self-center">
              <div className="flex size-7 items-center justify-center rounded-lg bg-[#edf5ec] text-[#10b981]">
                <TrendingUp className="size-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-ink-muted tracking-wider">
                  Readiness Impact
                </span>
                <div className="flex items-center gap-1 text-xs font-bold text-ink">
                  <span className="text-ink-muted font-medium">52%</span>
                  <span>→</span>
                  <span className="text-[#10b981]">60%</span>
                  <span className="text-[11px] font-semibold text-[#10b981]">
                    (+8%)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* AI Evaluator Executive Summary Note */}
          <div className="flex flex-col gap-2 rounded-xl bg-[#faf8f5] border border-[#ede6db]/60 p-4">
            <div className="flex items-center gap-2 text-xs font-bold text-ink">
              <Sparkles className="size-3.5 text-brand" />
              <span>AI Evaluator Assessment</span>
            </div>
            <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
              &quot;The candidate demonstrated exceptional mastery of the STAR
              framework with high emotional intelligence and blameless
              engineering culture. Effectively articulated technical trade-offs
              during a high-stress production incident, successfully mediated
              competing engineering priorities between Infrastructure and
              Product teams, and demonstrated clear quantifiable business
              outcomes (MTTR reduced from 45m to 14m, $120K revenue protected).
              To demonstrate Staff+ executive presence, proactively discuss how
              incident takeaways influenced long-term engineering SLO
              budgets.&quot;
            </p>
          </div>
        </div>

        {/* Right Column: Fast Session Stats (4 cols) */}
        <div className="lg:col-span-4 flex flex-col justify-between gap-3.5 rounded-2xl sm:rounded-3xl border border-line bg-white p-5 sm:p-6 shadow-[0_4px_20px_rgba(30,28,26,0.03)]">
          <h3 className="font-display font-bold text-sm text-ink pb-1 border-b border-line/60">
            Drill Overview
          </h3>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-ink-muted flex items-center gap-1.5">
                <Award className="size-4 text-brand" /> Recommendation
              </span>
              <span className="font-bold text-ink">Senior / Staff Ready</span>
            </div>

            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-ink-muted flex items-center gap-1.5">
                <Clock className="size-4 text-[#7c3aed]" /> Drill Duration
              </span>
              <span className="font-bold text-ink">24m 15s / 30m</span>
            </div>

            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-ink-muted flex items-center gap-1.5">
                <MessageSquare className="size-4 text-[#10b981]" /> Framework
                Used
              </span>
              <span className="font-bold text-ink">STAR Method</span>
            </div>

            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-ink-muted flex items-center gap-1.5">
                <ShieldCheck className="size-4 text-[#2563eb]" /> Outage MTTR
              </span>
              <span className="font-bold text-ink">
                14 min (Target: &lt;30m)
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-line/60 flex items-center justify-between">
            <span className="text-xs text-ink-muted">Resolution Impact</span>
            <span className="rounded bg-[#edf5ec] px-2 py-0.5 text-xs font-bold text-[#10b981]">
              99.99% Availability Restored
            </span>
          </div>
        </div>
      </div>

      {/* 3. Evaluation Dimensions Grid */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-0.5">
          <h2 className="font-display text-lg sm:text-xl font-bold text-ink">
            Evaluation Dimensions &amp; Scoring Rubric
          </h2>
          <p className="text-xs sm:text-sm text-ink-muted">
            Detailed assessment across the 6 core behavioral and leadership
            competencies.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {evaluationCriteria.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="flex flex-col justify-between gap-3.5 rounded-2xl border border-line bg-white p-5 shadow-2xs hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${item.bg} ${item.color}`}
                    >
                      <Icon className="size-4" />
                    </div>
                    <div className="flex flex-col">
                      <h3 className="font-display font-bold text-sm text-ink">
                        {item.title}
                      </h3>
                      <span className="text-[11px] font-semibold text-ink-muted">
                        {item.rating}
                      </span>
                    </div>
                  </div>
                  <span className="rounded-md bg-[#faf6f0] border border-line px-2 py-1 text-xs font-mono font-bold text-ink">
                    {item.score}
                  </span>
                </div>

                {/* Progress bar track */}
                <div className="flex flex-col gap-1.5">
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#f4efe8]">
                    <div
                      className="h-full bg-brand transition-all duration-300"
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                  <p className="text-xs text-ink-muted leading-relaxed">
                    {item.feedback}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Qualitative Feedback: Strengths vs Areas to Improve */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        {/* Strengths Card */}
        <div className="flex flex-col gap-4 rounded-2xl sm:rounded-3xl border border-[#d1fae5] bg-[#f0fdf4]/50 p-5 sm:p-7 shadow-xs">
          <div className="flex items-center gap-2.5">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#edf5ec] text-[#10b981]">
              <Check className="size-4 stroke-[2.5]" />
            </span>
            <h2 className="font-display text-base sm:text-lg font-bold text-ink">
              What You Did Well (Key Strengths)
            </h2>
          </div>

          <div className="flex flex-col gap-3 text-xs sm:text-sm text-ink leading-relaxed">
            <div className="flex items-start gap-2">
              <span className="size-1.5 rounded-full bg-[#10b981] mt-2 shrink-0" />
              <p>
                <strong>Structured STAR Delivery:</strong> Seamlessly guided the
                conversation through Situation, Task, Action, and quantifiable
                Result with zero conversational drift or tangents.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="size-1.5 rounded-full bg-[#10b981] mt-2 shrink-0" />
              <p>
                <strong>Blameless Culture &amp; Psychological Safety:</strong>{" "}
                Steered the team away from finger-pointing during the P0 war
                room, establishing objective blameless post-mortem standards.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="size-1.5 rounded-full bg-[#10b981] mt-2 shrink-0" />
              <p>
                <strong>Data-Driven Consensus Building:</strong> Defused
                high-friction disagreements between Database Admin and Frontend
                teams by anchoring discussions in distributed APM tracing data.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="size-1.5 rounded-full bg-[#10b981] mt-2 shrink-0" />
              <p>
                <strong>Customer-First Prioritization:</strong> Kept customer
                checkout continuity and revenue impact at the forefront of
                rollback decisions rather than premature root-cause fixes in
                production.
              </p>
            </div>
          </div>
        </div>

        {/* Areas to Improve Card */}
        <div className="flex flex-col gap-4 rounded-2xl sm:rounded-3xl border border-[#ffd8cc] bg-[#fff5f2]/50 p-5 sm:p-7 shadow-xs">
          <div className="flex items-center gap-2.5">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#fff0ec] text-brand">
              <ArrowUp className="size-4 stroke-[2.5]" />
            </span>
            <h2 className="font-display text-base sm:text-lg font-bold text-ink">
              Areas to Improve (Growth Opportunities)
            </h2>
          </div>

          <div className="flex flex-col gap-3 text-xs sm:text-sm text-ink leading-relaxed">
            <div className="flex items-start gap-2">
              <span className="size-1.5 rounded-full bg-brand mt-2 shrink-0" />
              <p>
                <strong>Upward Executive Communication:</strong> Detail how you
                broadcasted structured cadence updates (e.g. 15-minute
                Slack/email summaries) to VP and Director-level stakeholders
                during the live incident.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="size-1.5 rounded-full bg-brand mt-2 shrink-0" />
              <p>
                <strong>Long-Term SLO Error Budget Tracking:</strong> Mention
                specific engineering policies instituted (e.g. freezing
                non-critical feature work if error budget burns exceed 20% in a
                30-day window).
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="size-1.5 rounded-full bg-brand mt-2 shrink-0" />
              <p>
                <strong>Cross-Pod Mentorship:</strong> Highlight how the
                incident learnings were codified into runbooks and shared across
                adjacent engineering pods to level up junior on-call engineers.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Stage Progression Milestones Timeline */}
      <div className="flex flex-col gap-4 rounded-2xl sm:rounded-3xl border border-line bg-white p-5 sm:p-7 shadow-2xs">
        <div className="flex flex-col gap-0.5">
          <h2 className="font-display text-base sm:text-lg font-bold text-ink">
            Interview Progression &amp; Timeline Milestones
          </h2>
          <p className="text-xs text-ink-muted">
            Step-by-step breakdown of how you structured the conversation and
            handled follow-up probes.
          </p>
        </div>

        <div className="flex flex-col divide-y divide-line/60">
          {timelineMilestones.map((m) => (
            <div
              key={m.stage}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3.5 first:pt-1 last:pb-1"
            >
              <div className="flex items-start gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand/10 text-xs font-bold text-brand">
                  ✓
                </span>
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-ink">
                      {m.stage}: {m.name}
                    </span>
                    <span className="text-[11px] text-ink-muted">
                      ({m.time})
                    </span>
                  </div>
                  <p className="text-xs text-ink-muted leading-relaxed">
                    {m.highlight}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-center shrink-0 pl-9 sm:pl-0">
                <span className="rounded-full bg-[#edf5ec] px-2.5 py-0.5 text-[11px] font-bold text-[#10b981]">
                  Score: {m.score}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Action Plan & Next Steps */}
      <div className="flex flex-col gap-4 rounded-2xl sm:rounded-3xl border border-line bg-white p-5 sm:p-7 shadow-2xs">
        <div className="flex flex-col gap-0.5">
          <h2 className="font-display text-base sm:text-lg font-bold text-ink">
            Recommended Follow-Up Practice
          </h2>
          <p className="text-xs text-ink-muted">
            Targeted drills recommended based on your behavioral and leadership
            performance.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <Link
            href="/practice/session/complete"
            className="flex flex-col justify-between gap-3 rounded-xl border border-line p-4 hover:border-brand hover:bg-[#fffbf8] transition-all group"
          >
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#10b981]">
                Session Complete
              </span>
              <h3 className="font-display font-bold text-sm text-ink group-hover:text-brand transition-colors">
                Complete Preparation Summary
              </h3>
              <p className="text-xs text-ink-muted leading-relaxed">
                You have completed all 4 stages of your practice session! Review
                your cumulative readiness report.
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-brand">
              View Final Summary <ChevronRight className="size-3.5" />
            </span>
          </Link>

          <Link
            href="/mock-interview/configure"
            className="flex flex-col justify-between gap-3 rounded-xl border border-line p-4 hover:border-brand hover:bg-[#fffbf8] transition-all group"
          >
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand">
                Full-Length Simulation
              </span>
              <h3 className="font-display font-bold text-sm text-ink group-hover:text-brand transition-colors">
                Behavioral &amp; Leadership Mock Interview
              </h3>
              <p className="text-xs text-ink-muted leading-relaxed">
                Experience a 45-minute live interview simulation with realistic
                follow-up pushbacks.
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-brand">
              Start Behavioral Mock <ChevronRight className="size-3.5" />
            </span>
          </Link>

          <Link
            href="/practice"
            className="flex flex-col justify-between gap-3 rounded-xl border border-line p-4 hover:border-brand hover:bg-[#fffbf8] transition-all group"
          >
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#2563eb]">
                Practice Hub
              </span>
              <h3 className="font-display font-bold text-sm text-ink group-hover:text-brand transition-colors">
                Explore System Design Drills
              </h3>
              <p className="text-xs text-ink-muted leading-relaxed">
                Reinforce technical leadership with high-concurrency distributed
                system drills.
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-brand">
              Explore Practice Topics <ChevronRight className="size-3.5" />
            </span>
          </Link>
        </div>
      </div>

      {/* 7. Bottom Navigation Bar */}
      <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
        <Link
          href="/practice"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#cbd5e1] bg-white px-5 py-3 text-sm font-semibold text-ink shadow-2xs hover:bg-[#faf6f0] transition-colors cursor-pointer text-center"
        >
          <ArrowLeft className="size-4" />
          <span>Back to Practice Hub</span>
        </Link>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
          <Link
            href="/practice/choose-topic"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-line bg-white px-5 py-3 text-sm font-semibold text-ink shadow-2xs hover:bg-[#faf6f0] transition-colors cursor-pointer text-center"
          >
            <span>Explore Other Topics</span>
          </Link>

          <Link
            href="/practice/session/complete"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-bold text-white shadow-[0_4px_14px_rgba(255,108,71,0.25)] hover:bg-[#eb4a19] transition-all cursor-pointer text-center"
          >
            <span>Complete Practice Session →</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
