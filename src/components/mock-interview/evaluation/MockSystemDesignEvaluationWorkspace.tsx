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
  Cpu,
  Clock,
  Award,
  Layers,
  CodeXml,
  Users,
  Target,
  BarChart3,
  ChevronRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export function MockSystemDesignEvaluationWorkspace() {
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
      title: "Technical Depth",
      score: "8.5 / 10",
      rating: "Strong",
      percent: 85,
      icon: CodeXml,
      color: "text-[#2563eb]",
      bg: "bg-[#eff6ff]",
      feedback:
        "Solid grasp of Base62 encoding, hashing collisions, distributed caching, and database read/write isolation.",
    },
    {
      title: "Reasoning & Trade-offs",
      score: "8.5 / 10",
      rating: "Strong",
      percent: 85,
      icon: Lightbulb,
      color: "text-[#2563eb]",
      bg: "bg-[#eff6ff]",
      feedback:
        "Effectively weighed SQL vs NoSQL for URL persistence and articulated why Redis with LRU cache suits 80/20 read loads.",
    },
    {
      title: "Data Modeling & Architecture",
      score: "9.0 / 10",
      rating: "Exceptional",
      percent: 90,
      icon: Layers,
      color: "text-[#10b981]",
      bg: "bg-[#edf5ec]",
      feedback:
        "Clean relational schema with indexed short_url, user_id, and created_at timestamps. Good partitioning strategy.",
    },
    {
      title: "Communication & Structure",
      score: "9.0 / 10",
      rating: "Exceptional",
      percent: 90,
      icon: Users,
      color: "text-[#7c3aed]",
      bg: "bg-[#f5f3ff]",
      feedback:
        "Structured top-down delivery. Asked insightful clarifying questions early and guided the discussion proactively.",
    },
    {
      title: "Problem Solving & Estimation",
      score: "8.5 / 10",
      rating: "Strong",
      percent: 85,
      icon: Target,
      color: "text-[#ff6c47]",
      bg: "bg-[#fff0ec]",
      feedback:
        "Accurately estimated 100M writes/day (~1.15K write QPS) and 10:1 read ratio (~11.5K read QPS) with storage headroom.",
    },
    {
      title: "Follow-up & Scalability",
      score: "8.0 / 10",
      rating: "Good",
      percent: 80,
      icon: BarChart3,
      color: "text-[#0d9488]",
      bg: "bg-[#e6fbf9]",
      feedback:
        "Handled database replication and CDN routing well; could deepen discussion on multi-region cache stampede mitigation.",
    },
  ];

  const timelineMilestones = [
    {
      stage: "Stage 1",
      name: "Requirements & Scope Clarification",
      time: "6 min",
      status: "Completed",
      score: "9.5 / 10",
      highlight:
        "Clarified vanity URLs, short key length (Base62 7 chars), read latency SLA (<15ms), and 2-year expiration TTL.",
    },
    {
      stage: "Stage 2",
      name: "High-Level System Architecture",
      time: "14 min",
      status: "Completed",
      score: "9.0 / 10",
      highlight:
        "Designed stateless API servers, load balancing layer, Redis caching, and relational database with read replicas.",
    },
    {
      stage: "Stage 3",
      name: "Data Modeling & Token Generation",
      time: "12 min",
      status: "Completed",
      score: "8.5 / 10",
      highlight:
        "Proposed counter-based pre-generated token service vs MD5/SHA256 truncation to prevent collisions at scale.",
    },
    {
      stage: "Stage 4",
      name: "Scalability, Caching & Bottlenecks",
      time: "11 min",
      status: "Completed",
      score: "8.0 / 10",
      highlight:
        "Identified single DB write bottleneck and implemented Redis cache for top 20% hot links; addressed cache miss spikes.",
    },
  ];

  return (
    <div className="flex w-full flex-col gap-6 sm:gap-8 max-w-[1300px] mx-auto pb-16">
      {/* 1. Header & Navigation Row */}
      <div className="flex flex-col gap-4">
        {/* Breadcrumb Path */}
        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
          <Link
            href="/mock-interview"
            className="font-medium text-ink-muted hover:text-brand transition-colors"
          >
            Mock Interview
          </Link>
          <span className="text-[#b0a898]">•</span>
          <Link
            href="/mock-interview/interview-session"
            className="font-medium text-ink-muted hover:text-brand transition-colors"
          >
            Live Session
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
              <span className="rounded-md bg-[#edf7f4] px-2.5 py-0.5 text-xs font-bold text-[#0b8a8f]">
                System Design Mock
              </span>
              <span className="rounded-md bg-brand/10 px-2.5 py-0.5 text-xs font-bold text-brand">
                Senior Software Engineer
              </span>
            </div>
            <h1 className="font-display text-xl sm:text-2xl lg:text-3xl font-extrabold text-ink tracking-tight break-words">
              Mock Evaluation: URL Shortener Service
            </h1>
            <p className="text-xs sm:text-sm text-ink-muted">
              Conducted on September 27, 2026 • 43m 18s duration • Evaluator:
              Sarah (AI Staff Infrastructure Engineer)
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 sm:gap-3 w-full sm:w-auto shrink-0">
            <button
              type="button"
              onClick={handleShare}
              className="flex h-9 sm:h-10 items-center justify-center gap-1.5 rounded-full border border-line bg-white px-3 sm:px-4 text-xs font-semibold text-ink shadow-2xs hover:bg-[#faf6f0] transition-colors cursor-pointer"
            >
              <Share2 className="size-3.5 text-ink-muted" />
              <span>{copied ? "Copied Link!" : "Share"}</span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              disabled={downloading}
              className="flex h-9 sm:h-10 items-center justify-center gap-1.5 rounded-full border border-line bg-white px-3 sm:px-4 text-xs font-semibold text-ink shadow-2xs hover:bg-[#faf6f0] transition-colors cursor-pointer"
            >
              <Download className="size-3.5 text-ink-muted" />
              <span>{downloading ? "Preparing..." : "Export PDF"}</span>
            </button>

            <Link
              href="/mock-interview/configure"
              className="col-span-2 sm:col-span-1 flex h-9 sm:h-10 items-center justify-center gap-1.5 rounded-full bg-brand px-4 sm:px-5 text-xs sm:text-sm font-bold text-white shadow-[0_4px_12px_rgba(255,108,71,0.25)] hover:bg-[#eb4a19] transition-all cursor-pointer"
            >
              <RotateCcw className="size-3.5" />
              <span>Retake Mock</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Executive Summary Hero Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 w-full items-stretch">
        {/* Left Column: Overall Score & Verdict (8 cols) */}
        <div className="lg:col-span-8 flex flex-col justify-between gap-5 rounded-2xl sm:rounded-3xl border border-line bg-white p-5 sm:p-7 shadow-[0_4px_20px_rgba(30,28,26,0.03)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-line/60">
            {/* Score Ring & Verdict */}
            <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
              <div className="relative flex size-16 sm:size-20 shrink-0 items-center justify-center">
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
                    strokeDashoffset={213 - (213 * 84) / 100}
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="font-display text-lg sm:text-2xl font-black text-ink">
                    84
                  </span>
                  <span className="text-[9px] sm:text-[10px] text-ink-muted uppercase font-bold">
                    / 100
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-1 min-w-0">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <span className="flex items-center gap-1 rounded-full bg-[#edf5ec] px-2.5 py-0.5 sm:px-3 sm:py-1 text-[11px] sm:text-xs font-extrabold text-[#10b981]">
                    <Check className="size-3 stroke-[3]" />
                    Strong Hire
                  </span>
                  <span className="text-[11px] sm:text-xs font-semibold text-ink-muted">
                    Percentile: Top 12%
                  </span>
                </div>
                <h2 className="font-display text-sm sm:text-base lg:text-lg font-bold text-ink leading-snug">
                  Senior SWE Architectural Readiness
                </h2>
              </div>
            </div>

            {/* Readiness Growth Pill */}
            <div className="flex items-center justify-between sm:justify-start gap-2.5 rounded-xl border border-line bg-[#faf6f0] px-3.5 py-2.5 w-full sm:w-auto">
              <div className="flex size-7 items-center justify-center rounded-lg bg-[#edf5ec] text-[#10b981] shrink-0">
                <TrendingUp className="size-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-ink-muted tracking-wider">
                  Readiness Impact
                </span>
                <div className="flex items-center gap-1 text-xs font-bold text-ink">
                  <span className="text-ink-muted font-medium">68%</span>
                  <span>→</span>
                  <span className="text-[#10b981]">74%</span>
                  <span className="text-[11px] font-semibold text-[#10b981]">
                    (+6%)
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
              &quot;The candidate demonstrated strong system design maturity for
              a Senior Software Engineer. Successfully structured the 45-minute
              discussion, clarified essential SLAs before proposing components,
              and designed a robust Redis caching layer for the 10:1 read-heavy
              workload. Key opportunity for Staff-level performance is expanding
              on distributed unique ID collision handling (e.g., Snowflake vs
              Range Ticket Servers) and mitigating cache stampede risks.&quot;
            </p>
          </div>
        </div>

        {/* Right Column: Fast Session Stats (4 cols) */}
        <div className="lg:col-span-4 flex flex-col justify-between gap-3.5 rounded-2xl sm:rounded-3xl border border-line bg-white p-5 sm:p-6 shadow-[0_4px_20px_rgba(30,28,26,0.03)]">
          <h3 className="font-display font-bold text-sm text-ink pb-1 border-b border-line/60">
            Session Overview
          </h3>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-ink-muted flex items-center gap-1.5">
                <Award className="size-4 text-brand" /> Recommendation
              </span>
              <span className="font-bold text-ink">Ready for Onsite</span>
            </div>

            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-ink-muted flex items-center gap-1.5">
                <Clock className="size-4 text-[#7c3aed]" /> Session Duration
              </span>
              <span className="font-bold text-ink">43m 18s / 45m</span>
            </div>

            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-ink-muted flex items-center gap-1.5">
                <ShieldCheck className="size-4 text-[#10b981]" /> Clarifications
                Asked
              </span>
              <span className="font-bold text-ink">4 key questions</span>
            </div>

            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-ink-muted flex items-center gap-1.5">
                <Layers className="size-4 text-[#2563eb]" /> Interview Tools
                Used
              </span>
              <span className="font-bold text-ink">Whiteboard & Diagram</span>
            </div>
          </div>

          <div className="pt-2 border-t border-line/60 flex items-center justify-between">
            <span className="text-xs text-ink-muted">Target Company Tier</span>
            <span className="rounded bg-[#fff0ec] px-2 py-0.5 text-xs font-bold text-brand">
              Tier 1 Tech / FAANG
            </span>
          </div>
        </div>
      </div>

      {/* 3. Evaluation Dimensions Grid (What AI Evaluated) */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-0.5">
          <h2 className="font-display text-lg sm:text-xl font-bold text-ink">
            Evaluation Dimensions & Scoring Breakdown
          </h2>
          <p className="text-xs sm:text-sm text-ink-muted">
            Detailed rubric scoring assessed across the 6 core interview
            dimensions.
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
                <div className="flex items-start justify-between gap-3 min-w-0">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${item.bg} ${item.color}`}
                    >
                      <Icon className="size-4" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <h3 className="font-display font-bold text-sm text-ink truncate sm:whitespace-normal">
                        {item.title}
                      </h3>
                      <span className="text-[11px] font-semibold text-ink-muted">
                        {item.rating}
                      </span>
                    </div>
                  </div>
                  <span className="shrink-0 rounded-md bg-[#faf6f0] border border-line px-2 py-1 text-xs font-mono font-bold text-ink">
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
                <strong>Proactive Scoping:</strong> Asked crisp clarifying
                questions upfront regarding custom vanity URLs, 15ms latency
                SLA, and 2-year TTL expiration before drawing components.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="size-1.5 rounded-full bg-[#10b981] mt-2 shrink-0" />
              <p>
                <strong>Caching Strategy:</strong> Correctly leveraged the 80/20
                rule to size a Redis cluster for hot URLs, reducing database
                read load by approximately 80%.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="size-1.5 rounded-full bg-[#10b981] mt-2 shrink-0" />
              <p>
                <strong>Stateless Tier Separation:</strong> Clearly decoupled
                API gateways, stateless application servers, and database
                replication clusters, ensuring seamless horizontal scaling.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="size-1.5 rounded-full bg-[#10b981] mt-2 shrink-0" />
              <p>
                <strong>Base62 Encoding Choice:</strong> Articulated why Base62
                [A-Z, a-z, 0-9] produces URL-safe 7-character tokens capable of
                representing 3.5 trillion unique combinations.
              </p>
            </div>
          </div>
        </div>

        {/* Areas for Improvement Card */}
        <div className="flex flex-col gap-4 rounded-2xl sm:rounded-3xl border border-[#ffd8cc] bg-[#fff0ec]/40 p-5 sm:p-7 shadow-xs">
          <div className="flex items-center gap-2.5">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#fff0ec] text-brand border border-[#ffd8cc]">
              <ArrowUp className="size-4 stroke-[2.5]" />
            </span>
            <h2 className="font-display text-base sm:text-lg font-bold text-ink">
              Areas to Improve (Staff-Level Growth)
            </h2>
          </div>

          <div className="flex flex-col gap-3 text-xs sm:text-sm text-ink leading-relaxed">
            <div className="flex items-start gap-2">
              <span className="size-1.5 rounded-full bg-brand mt-2 shrink-0" />
              <p>
                <strong>Distributed ID Generation:</strong> Dive deeper into
                collision prevention. Compare Twitter Snowflake vs ZooKeeper
                range-based ticket services instead of simple counter hashing.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="size-1.5 rounded-full bg-brand mt-2 shrink-0" />
              <p>
                <strong>Cache Stampede Protection:</strong> Address how to
                prevent the &quot;thundering herd&quot; problem when viral
                shortened URLs expire from cache simultaneously under heavy
                traffic.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="size-1.5 rounded-full bg-brand mt-2 shrink-0" />
              <p>
                <strong>Click Analytics Decoupling:</strong> Use an asynchronous
                message bus (e.g. Apache Kafka or AWS Kinesis) so click tracking
                writes never block HTTP 301 redirection latency.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="size-1.5 rounded-full bg-brand mt-2 shrink-0" />
              <p>
                <strong>Geographic Redirection:</strong> Briefly discuss
                multi-region active-active deployments with Anycast DNS to
                ensure global read response times stay under 15ms.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Interview Timeline & Milestones */}
      <div className="flex flex-col gap-4 rounded-2xl sm:rounded-3xl border border-line bg-white p-5 sm:p-7 shadow-2xs">
        <div className="flex flex-col gap-0.5">
          <h2 className="font-display text-base sm:text-lg font-bold text-ink">
            Interview Progression & Stage Milestones
          </h2>
          <p className="text-xs text-ink-muted">
            How your time was allocated across the 4 stages of the system design
            interview.
          </p>
        </div>

        <div className="flex flex-col divide-y divide-line/60">
          {timelineMilestones.map((m, idx) => (
            <div
              key={m.stage}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3.5 first:pt-1 last:pb-1"
            >
              <div className="flex items-start gap-3 min-w-0">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#edf5ec] text-[11px] font-bold text-[#10b981] mt-0.5">
                  {idx + 1}
                </span>
                <div className="flex flex-col gap-0.5 min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <span className="font-display font-bold text-sm text-ink">
                      {m.name}
                    </span>
                    <span className="rounded bg-[#faf6f0] px-2 py-0.5 text-[10px] font-semibold text-ink-muted">
                      {m.time}
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
            Targeted drills recommended based on your URL Shortener mock
            interview performance.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <Link
            href="/practice/session/system-design"
            className="flex flex-col justify-between gap-3 rounded-xl border border-line p-4 hover:border-brand hover:bg-[#fffbf8] transition-all group"
          >
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#0d9488]">
                Distributed Systems
              </span>
              <h3 className="font-display font-bold text-sm text-ink group-hover:text-brand transition-colors">
                Distributed Unique ID Generator
              </h3>
              <p className="text-xs text-ink-muted leading-relaxed">
                Master Twitter Snowflake, range ticket services, and UUID
                tradeoffs.
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-brand">
              Practice Drill <ChevronRight className="size-3.5" />
            </span>
          </Link>

          <Link
            href="/practice/session/system-design"
            className="flex flex-col justify-between gap-3 rounded-xl border border-line p-4 hover:border-brand hover:bg-[#fffbf8] transition-all group"
          >
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#2563eb]">
                Caching & Performance
              </span>
              <h3 className="font-display font-bold text-sm text-ink group-hover:text-brand transition-colors">
                Cache Invalidation & Stampede Mitigation
              </h3>
              <p className="text-xs text-ink-muted leading-relaxed">
                Implement mutex locks and probabilistic early expiration
                algorithms.
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-brand">
              Practice Drill <ChevronRight className="size-3.5" />
            </span>
          </Link>

          <Link
            href="/mock-interview/configure"
            className="flex flex-col justify-between gap-3 rounded-xl border border-line p-4 hover:border-brand hover:bg-[#fffbf8] transition-all group"
          >
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand">
                Full-Length Mock
              </span>
              <h3 className="font-display font-bold text-sm text-ink group-hover:text-brand transition-colors">
                Configure Next Mock Interview
              </h3>
              <p className="text-xs text-ink-muted leading-relaxed">
                Choose another topic: Web Crawler, Rate Limiter, or Distributed
                Cache.
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-brand">
              Set Up Next Mock <ChevronRight className="size-3.5" />
            </span>
          </Link>
        </div>
      </div>

      {/* 7. Bottom Navigation Bar */}
      <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
        <Link
          href="/mock-interview"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#cbd5e1] bg-white px-5 py-3 text-sm font-semibold text-ink shadow-2xs hover:bg-[#faf6f0] transition-colors cursor-pointer text-center"
        >
          <ArrowLeft className="size-4" />
          <span>Back to Mock Interviews</span>
        </Link>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
          <Link
            href="/practice"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-line bg-white px-5 py-3 text-sm font-semibold text-ink shadow-2xs hover:bg-[#faf6f0] transition-colors cursor-pointer text-center"
          >
            <span>Explore Practice Topics</span>
          </Link>

          <Link
            href="/mock-interview/configure"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-bold text-white shadow-[0_4px_14px_rgba(255,108,71,0.25)] hover:bg-[#eb4a19] transition-all cursor-pointer text-center"
          >
            <RotateCcw className="size-4" />
            <span>Retake This Mock Interview</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
