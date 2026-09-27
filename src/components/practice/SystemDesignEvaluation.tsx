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
  Server,
  Network,
} from "lucide-react";

export function SystemDesignEvaluation() {
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
      title: "Technical Depth (L4 vs L7)",
      score: "8.5 / 10",
      rating: "Strong",
      percent: 85,
      icon: CodeXml,
      color: "text-[#2563eb]",
      bg: "bg-[#eff6ff]",
      feedback:
        "Articulated differences between Layer 4 (TCP/UDP packet routing) and Layer 7 (HTTP header inspection, SSL termination, path routing).",
    },
    {
      title: "Reasoning & Trade-offs",
      score: "8.0 / 10",
      rating: "Strong",
      percent: 80,
      icon: Lightbulb,
      color: "text-[#2563eb]",
      bg: "bg-[#eff6ff]",
      feedback:
        "Weighed Round-Robin vs Least Connections vs IP-Hash; explained why least-connections prevents uneven thread starvation.",
    },
    {
      title: "Resilience & Health Checks",
      score: "8.5 / 10",
      rating: "Strong",
      percent: 85,
      icon: ShieldCheck,
      color: "text-[#10b981]",
      bg: "bg-[#edf5ec]",
      feedback:
        "Designed active and passive health checking with graceful server connection draining to eliminate 502/504 gateway errors.",
    },
    {
      title: "Session Persistence & State",
      score: "8.0 / 10",
      rating: "Good",
      percent: 80,
      icon: Layers,
      color: "text-[#7c3aed]",
      bg: "bg-[#f5f3ff]",
      feedback:
        "Analyzed sticky sessions (cookie insertion) vs centralized Redis token stores, pointing out affinity failover risks.",
    },
    {
      title: "High Availability & VRRP",
      score: "8.5 / 10",
      rating: "Strong",
      percent: 85,
      icon: Target,
      color: "text-[#ff6c47]",
      bg: "bg-[#fff0ec]",
      feedback:
        "Eliminated load balancer single points of failure by implementing active-passive LB pairs with Keepalived and VRRP virtual IP.",
    },
    {
      title: "Communication & Diagrams",
      score: "8.5 / 10",
      rating: "Strong",
      percent: 85,
      icon: Users,
      color: "text-[#0d9488]",
      bg: "bg-[#e6fbf9]",
      feedback:
        "Drew crisp whiteboard diagrams separating reverse proxy ingress, application clusters, and database replication replicas.",
    },
  ];

  const timelineMilestones = [
    {
      stage: "Step 1",
      name: "Requirements & Traffic Ingress",
      time: "6 min",
      status: "Completed",
      score: "9.0 / 10",
      highlight:
        "Identified peak concurrency requirements, SSL/TLS offloading needs, and 99.99% availability expectations.",
    },
    {
      stage: "Step 2",
      name: "Reverse Proxy & Load Balancing Topology",
      time: "12 min",
      status: "Completed",
      score: "8.5 / 10",
      highlight:
        "Configured dual-tier architecture using NGINX/HAProxy behind cloud Anycast IPs with automated weighted routing.",
    },
    {
      stage: "Step 3",
      name: "Health Checks & Server Draining",
      time: "9 min",
      status: "Completed",
      score: "8.5 / 10",
      highlight:
        "Defined 5-second interval health checks with 3 consecutive failure thresholds and zero-downtime rolling deploys.",
    },
    {
      stage: "Step 4",
      name: "Consistent Hashing & State Management",
      time: "8 min",
      status: "Completed",
      score: "8.0 / 10",
      highlight:
        "Discussed consistent hashing with virtual nodes to prevent massive key redistribution when scaling backend pods.",
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
            href="/practice/session/system-design"
            className="font-medium text-ink-muted hover:text-brand transition-colors"
          >
            System Design Session
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
                System Design
              </span>
              <span className="rounded-md bg-brand/10 px-2.5 py-0.5 text-xs font-bold text-brand">
                Load Balancing & High Availability
              </span>
            </div>
            <h1 className="font-display text-xl sm:text-2xl lg:text-3xl font-extrabold text-ink tracking-tight break-words">
              Practice Evaluation: Load Balancing &amp; High Availability
            </h1>
            <p className="text-xs sm:text-sm text-ink-muted">
              Completed on September 27, 2026 • 35 min practice drill •
              Evaluator: Sarah (AI Staff Infrastructure Engineer)
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
              href="/practice/session/system-design"
              className="col-span-2 sm:col-span-1 flex h-9 sm:h-10 items-center justify-center gap-1.5 rounded-full bg-brand px-4 sm:px-5 text-xs sm:text-sm font-bold text-white shadow-[0_4px_12px_rgba(255,108,71,0.25)] hover:bg-[#eb4a19] transition-all cursor-pointer"
            >
              <RotateCcw className="size-3.5" />
              <span>Retake Drill</span>
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
                    strokeDashoffset={213 - (213 * 82) / 100}
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="font-display text-lg sm:text-2xl font-black text-ink">
                    82
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
                    Percentile: Top 15%
                  </span>
                </div>
                <h2 className="font-display text-sm sm:text-base lg:text-lg font-bold text-ink leading-snug">
                  Load Balancing &amp; High Availability Mastery
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
                  <span className="text-ink-muted font-medium">28%</span>
                  <span>→</span>
                  <span className="text-[#10b981]">35%</span>
                  <span className="text-[11px] font-semibold text-[#10b981]">
                    (+7%)
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
              &quot;The candidate demonstrated a thorough understanding of
              reverse proxy architectures and high-availability ingress. Clearly
              articulated why Layer 7 routing is essential for path-based
              microservices, and implemented active health checks with
              connection draining. Next level improvement involves diving deeper
              into consistent hashing with virtual nodes to minimize cache
              invalidation spikes during auto-scaling events.&quot;
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
              <span className="font-bold text-ink">Ready for Next Drill</span>
            </div>

            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-ink-muted flex items-center gap-1.5">
                <Clock className="size-4 text-[#7c3aed]" /> Drill Duration
              </span>
              <span className="font-bold text-ink">35m 12s / 45m</span>
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
                <Layers className="size-4 text-[#2563eb]" /> Tooling Used
              </span>
              <span className="font-bold text-ink">Whiteboard & Diagram</span>
            </div>
          </div>

          <div className="pt-2 border-t border-line/60 flex items-center justify-between">
            <span className="text-xs text-ink-muted">Topic Difficulty</span>
            <span className="rounded bg-[#fff0ec] px-2 py-0.5 text-xs font-bold text-brand">
              Medium · Core System Design
            </span>
          </div>
        </div>
      </div>

      {/* 3. Evaluation Dimensions Grid (What AI Evaluated) */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-0.5">
          <h2 className="font-display text-lg sm:text-xl font-bold text-ink">
            Evaluation Dimensions & Scoring Rubric
          </h2>
          <p className="text-xs sm:text-sm text-ink-muted">
            Detailed rubric breakdown assessed across the 6 key architectural
            criteria.
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
                <strong>Routing Strategies:</strong> Demonstrated clear
                understanding of Round-Robin, Weighted Round-Robin, and
                Least-Connections algorithms and when to employ each.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="size-1.5 rounded-full bg-[#10b981] mt-2 shrink-0" />
              <p>
                <strong>Health Checks & Draining:</strong> Explained active HTTP
                `/healthz` polling combined with passive TCP connection draining
                to prevent terminating active transactions.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="size-1.5 rounded-full bg-[#10b981] mt-2 shrink-0" />
              <p>
                <strong>SSL/TLS Termination:</strong> Accurately recommended
                terminating TLS at the load balancer to offload heavy
                cryptographic operations from application web servers.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="size-1.5 rounded-full bg-[#10b981] mt-2 shrink-0" />
              <p>
                <strong>High Availability Pairs:</strong> Addressed load
                balancer failure by provisioning Active-Passive pairs utilizing
                VRRP (Virtual Router Redundancy Protocol).
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
                <strong>Consistent Hashing with Virtual Nodes:</strong>{" "}
                Elaborate on how consistent hashing distributes keys across a
                hash ring and why virtual nodes (e.g. 100-200 per server)
                prevent hotspots.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="size-1.5 rounded-full bg-brand mt-2 shrink-0" />
              <p>
                <strong>Sticky Sessions & Decoupled State:</strong> While sticky
                sessions work, explain why storing state in external distributed
                caches (e.g. Redis) is superior for autoscaling elasticity.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="size-1.5 rounded-full bg-brand mt-2 shrink-0" />
              <p>
                <strong>Global Anycast DNS:</strong> Discuss BGP Anycast routing
                where identical public IP addresses are advertised from multiple
                edge data centers worldwide for low-latency ingress.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="size-1.5 rounded-full bg-brand mt-2 shrink-0" />
              <p>
                <strong>Thundering Herd on Health Check Recovery:</strong>{" "}
                Implement gradual connection ramp-up (warm-up periods) so newly
                recovered servers aren&apos;t crushed by immediate peak traffic.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Interview Timeline & Milestones */}
      <div className="flex flex-col gap-4 rounded-2xl sm:rounded-3xl border border-line bg-white p-5 sm:p-7 shadow-2xs">
        <div className="flex flex-col gap-0.5">
          <h2 className="font-display text-base sm:text-lg font-bold text-ink">
            Drill Progression & Stage Milestones
          </h2>
          <p className="text-xs text-ink-muted">
            Time allocation across the 4 stages of the load balancing system
            design drill.
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
            Targeted drills recommended based on your load balancing session
            performance.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <Link
            href="/practice/session/cloud"
            className="flex flex-col justify-between gap-3 rounded-xl border border-line p-4 hover:border-brand hover:bg-[#fffbf8] transition-all group"
          >
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#0d9488]">
                Cloud Infrastructure
              </span>
              <h3 className="font-display font-bold text-sm text-ink group-hover:text-brand transition-colors">
                Multi-Region VPC & Global Failover
              </h3>
              <p className="text-xs text-ink-muted leading-relaxed">
                Connect load balancers across multi-region active-active VPC
                peering topologies.
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-brand">
              Continue to Cloud Drill <ChevronRight className="size-3.5" />
            </span>
          </Link>

          <Link
            href="/practice/session/system-design"
            className="flex flex-col justify-between gap-3 rounded-xl border border-line p-4 hover:border-brand hover:bg-[#fffbf8] transition-all group"
          >
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#2563eb]">
                Distributed Systems
              </span>
              <h3 className="font-display font-bold text-sm text-ink group-hover:text-brand transition-colors">
                Distributed Cache with Redis Cluster
              </h3>
              <p className="text-xs text-ink-muted leading-relaxed">
                Implement cache invalidation, LRU eviction, and session token
                storage.
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
                Full-Length Simulation
              </span>
              <h3 className="font-display font-bold text-sm text-ink group-hover:text-brand transition-colors">
                Take a Full Mock Interview
              </h3>
              <p className="text-xs text-ink-muted leading-relaxed">
                Test your system design and load balancing knowledge in a live
                45-min AI interview.
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-brand">
              Start Full Mock <ChevronRight className="size-3.5" />
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
            href="/practice/session/cloud"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-bold text-white shadow-[0_4px_14px_rgba(255,108,71,0.25)] hover:bg-[#eb4a19] transition-all cursor-pointer text-center"
          >
            <span>Continue to Next Drill →</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
