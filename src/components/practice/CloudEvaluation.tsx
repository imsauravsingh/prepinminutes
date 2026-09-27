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
  Cloud,
  Cpu,
  Network,
  Server,
} from "lucide-react";

export function CloudEvaluation() {
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
      title: "Multi-Region Network Topology",
      score: "9.0 / 10",
      rating: "Exceptional",
      percent: 90,
      icon: Network,
      color: "text-[#2563eb]",
      bg: "bg-[#eff6ff]",
      feedback:
        "Flawlessly designed redundant VPC peering across primary and secondary regions with non-overlapping CIDR blocks and AWS Transit Gateway.",
    },
    {
      title: "High Availability & DNS Failover",
      score: "8.5 / 10",
      rating: "Strong",
      percent: 85,
      icon: Target,
      color: "text-[#10b981]",
      bg: "bg-[#edf5ec]",
      feedback:
        "Configured Route 53 latency-based routing with automated health-checked DNS failover and CloudWatch regional alarm triggers.",
    },
    {
      title: "Data Replication & Consistency",
      score: "8.5 / 10",
      rating: "Strong",
      percent: 85,
      icon: Cpu,
      color: "text-[#7c3aed]",
      bg: "bg-[#f5f3ff]",
      feedback:
        "Selected Aurora Global Database for sub-second storage-layer replication, backed by S3 Cross-Region Replication with versioning.",
    },
    {
      title: "Security Perimeter & IAM Roles",
      score: "8.5 / 10",
      rating: "Strong",
      percent: 85,
      icon: ShieldCheck,
      color: "text-[#ff6c47]",
      bg: "bg-[#fff0ec]",
      feedback:
        "Enforced least-privilege IAM roles, KMS multi-region customer managed keys, and private VPC endpoints eliminating public internet exposure.",
    },
    {
      title: "Cost Optimization & Egress Bandwidth",
      score: "8.0 / 10",
      rating: "Good",
      percent: 80,
      icon: BarChart3,
      color: "text-[#0d9488]",
      bg: "bg-[#e6fbf9]",
      feedback:
        "Optimized cross-AZ and cross-region egress using VPC endpoints and payload compression; highlighted egress data transfer savings.",
    },
    {
      title: "Observability & SRE Operations",
      score: "8.5 / 10",
      rating: "Strong",
      percent: 85,
      icon: Clock,
      color: "text-[#2563eb]",
      bg: "bg-[#eff6ff]",
      feedback:
        "Integrated centralized CloudWatch Logs, Prometheus metrics, and automated PagerDuty alerting for regional degradation.",
    },
  ];

  const timelineMilestones = [
    {
      stage: "Step 1",
      name: "Network Architecture & VPC Design",
      time: "5 min",
      status: "Completed",
      score: "9.5 / 10",
      highlight:
        "Constructed 3-tier subnets across 3 Availability Zones with Transit Gateway orchestration and VPC peering.",
    },
    {
      stage: "Step 2",
      name: "Compute Orchestration & Auto-Scaling",
      time: "8 min",
      status: "Completed",
      score: "8.5 / 10",
      highlight:
        "Configured Kubernetes EKS node groups with Karpenter autoscaling and cross-AZ pod disruption budgets.",
    },
    {
      stage: "Step 3",
      name: "Database Replication & Disaster Recovery",
      time: "9 min",
      status: "Completed",
      score: "8.5 / 10",
      highlight:
        "Configured Aurora Global Database read replicas with automated 1-click cross-region promotion.",
    },
    {
      stage: "Step 4",
      name: "Security, Observability & Cost Analysis",
      time: "6 min",
      status: "Completed",
      score: "8.0 / 10",
      highlight:
        "Defined IAM least-privilege policies, KMS envelope encryption, and cross-region egress cost projections.",
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
            href="/practice/session/cloud"
            className="font-medium text-ink-muted hover:text-brand transition-colors"
          >
            Cloud Session
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
              <span className="rounded-md bg-[#eff6ff] px-2.5 py-0.5 text-xs font-bold text-[#2563eb]">
                Cloud Infrastructure
              </span>
              <span className="rounded-md bg-[#fff0ec] px-2.5 py-0.5 text-xs font-bold text-brand">
                AWS / GCP · Multi-Region Architecture
              </span>
            </div>
            <h1 className="font-display text-xl sm:text-2xl lg:text-3xl font-extrabold text-ink tracking-tight break-words">
              Practice Evaluation: Multi-Region VPC Peering, Disaster Recovery
              &amp; High Availability
            </h1>
            <p className="text-xs sm:text-sm text-ink-muted">
              Completed on September 27, 2026 • 28 min practice drill •
              Evaluator: Marcus (AI Principal Cloud Architect)
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
              href="/practice/session/cloud"
              className="col-span-2 sm:col-span-1 flex h-9 sm:h-10 items-center justify-center gap-1.5 rounded-full bg-brand px-4 sm:px-5 text-xs sm:text-sm font-bold text-white shadow-[0_4px_12px_rgba(255,108,71,0.25)] hover:bg-[#eb4a19] transition-all cursor-pointer"
            >
              <RotateCcw className="size-3.5" />
              <span>Retake Drill</span>
            </Link>
          </div>
        </div>

        {/* Practice Progress Stepper Bar (Step 3 of 4 - 75% Complete) */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-brand">
              Step 3 of 4: Cloud Infrastructure Evaluation
            </span>
            <span className="text-ink-muted">75% Completed</span>
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
              className="h-full bg-[#ede6db] transition-all duration-300"
              style={{ width: "25%" }}
              title="Step 4 Behavioral: Pending"
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
                    strokeDashoffset={213 - (213 * 85) / 100}
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="font-display text-lg sm:text-2xl font-black text-ink">
                    85
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
                  Cloud Systems Resilience &amp; Global High Availability
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
                  <span className="text-ink-muted font-medium">67%</span>
                  <span>→</span>
                  <span className="text-[#10b981]">76%</span>
                  <span className="text-[11px] font-semibold text-[#10b981]">
                    (+9%)
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
              &quot;Comprehensive cloud architecture demonstration featuring
              robust multi-region VPC design, automated Route 53 DNS failover,
              and solid cross-region replication strategies. Demonstrated clear
              mastery of recovery objectives (RTO &lt; 5m, RPO &lt; 1m) while
              maintaining strict zero-trust security postures and egress
              bandwidth cost optimization. To reach Principal-level depth,
              elaborate on automated regional split-brain prevention and data
              sovereignty compliance.&quot;
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
              <span className="font-bold text-ink">Senior Cloud Ready</span>
            </div>

            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-ink-muted flex items-center gap-1.5">
                <Clock className="size-4 text-[#7c3aed]" /> Drill Duration
              </span>
              <span className="font-bold text-ink">28m 30s / 30m</span>
            </div>

            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-ink-muted flex items-center gap-1.5">
                <Cloud className="size-4 text-[#2563eb]" /> Topology Target
              </span>
              <span className="font-bold text-ink">
                Multi-Region Active-Active
              </span>
            </div>

            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-ink-muted flex items-center gap-1.5">
                <ShieldCheck className="size-4 text-[#10b981]" /> Target RTO /
                RPO
              </span>
              <span className="font-bold text-ink">
                RTO &lt; 5m · RPO &lt; 1m
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-line/60 flex items-center justify-between">
            <span className="text-xs text-ink-muted">Failover Automation</span>
            <span className="rounded bg-[#edf5ec] px-2 py-0.5 text-xs font-bold text-[#10b981]">
              Route 53 DNS Health-Checked
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
            Detailed assessment across the 6 core cloud infrastructure
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
                <strong>Resilient Active-Active Topology:</strong> Designed
                multi-AZ auto-scaling groups paired with multi-region Route 53
                DNS failover ensuring zero single points of failure.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="size-1.5 rounded-full bg-[#10b981] mt-2 shrink-0" />
              <p>
                <strong>Sub-Minute RPO Strategy:</strong> Leveraged Aurora
                Global Database storage-layer replication, keeping replication
                lag under 1 second without application overhead.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="size-1.5 rounded-full bg-[#10b981] mt-2 shrink-0" />
              <p>
                <strong>Zero-Trust Security Perimeter:</strong> Structured
                public/private/isolated subnets with strict security groups, NAT
                gateways, and mutual TLS between microservices.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="size-1.5 rounded-full bg-[#10b981] mt-2 shrink-0" />
              <p>
                <strong>Automated Health &amp; Synthetic Probing:</strong>{" "}
                Specified deep application-layer <code>/healthz</code> endpoints
                verifying database read/write connectivity before routing
                traffic.
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
                <strong>Data Sovereignty &amp; Regional Compliance:</strong>{" "}
                Proactively articulate data residency constraints (e.g. GDPR,
                CCPA) when replicating customer PII across geographic regions.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="size-1.5 rounded-full bg-brand mt-2 shrink-0" />
              <p>
                <strong>Automated Regional Failback Protocol:</strong> Detail
                the automated synchronization protocol and conflict resolution
                mechanisms required when failing back from secondary to primary
                region.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="size-1.5 rounded-full bg-brand mt-2 shrink-0" />
              <p>
                <strong>Idle Infrastructure Cost Guardrails:</strong> Clarify
                active-passive vs active-active cost tradeoffs to ensure
                secondary standby capacity remains economically viable.
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
            Step-by-step breakdown of how you structured the infrastructure
            architecture and addressed scalability probes.
          </p>
        </div>

        <div className="flex flex-col divide-y divide-line/60">
          {timelineMilestones.map((m) => (
            <div
              key={m.stage}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3.5 first:pt-1 last:pb-1"
            >
              <div className="flex items-start gap-3 min-w-0">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand/10 text-xs font-bold text-brand">
                  ✓
                </span>
                <div className="flex flex-col gap-0.5 min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
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
            Targeted drills recommended based on your cloud infrastructure
            performance.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <Link
            href="/practice/session/behavioral"
            className="flex flex-col justify-between gap-3 rounded-xl border border-line p-4 hover:border-brand hover:bg-[#fffbf8] transition-all group"
          >
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand">
                Next In Session
              </span>
              <h3 className="font-display font-bold text-sm text-ink group-hover:text-brand transition-colors">
                Behavioral &amp; Leadership (STAR)
              </h3>
              <p className="text-xs text-ink-muted leading-relaxed">
                Step 4 of your preparation roadmap: Master crisis management,
                conflict mediation, and blameless post-mortems.
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-brand">
              Continue to Behavioral <ChevronRight className="size-3.5" />
            </span>
          </Link>

          <Link
            href="/practice/session/cloud"
            className="flex flex-col justify-between gap-3 rounded-xl border border-line p-4 hover:border-brand hover:bg-[#fffbf8] transition-all group"
          >
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#2563eb]">
                Deep Dive Drill
              </span>
              <h3 className="font-display font-bold text-sm text-ink group-hover:text-brand transition-colors">
                Kubernetes Multi-Cluster Mesh
              </h3>
              <p className="text-xs text-ink-muted leading-relaxed">
                Practice service mesh (Istio) configuration and cross-region pod
                routing in high-load scenarios.
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-brand">
              Practice Cloud Drill <ChevronRight className="size-3.5" />
            </span>
          </Link>

          <Link
            href="/mock-interview/configure"
            className="flex flex-col justify-between gap-3 rounded-xl border border-line p-4 hover:border-brand hover:bg-[#fffbf8] transition-all group"
          >
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7c3aed]">
                Full-Length Simulation
              </span>
              <h3 className="font-display font-bold text-sm text-ink group-hover:text-brand transition-colors">
                Cloud Systems Architect Mock
              </h3>
              <p className="text-xs text-ink-muted leading-relaxed">
                Take a 45-minute live cloud systems mock interview with rigorous
                SRE and capacity planning probes.
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-brand">
              Start Cloud Mock <ChevronRight className="size-3.5" />
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
            href="/practice/session/behavioral"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-bold text-white shadow-[0_4px_14px_rgba(255,108,71,0.25)] hover:bg-[#eb4a19] transition-all cursor-pointer text-center"
          >
            <span>Continue to Behavioral →</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
