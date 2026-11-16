"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
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
  Terminal,
  FileCode,
  Loader2,
} from "lucide-react";
import { backendApi, EvaluationReportDetail } from "@/lib/api-client";

interface CodingCriterionItem {
  title: string;
  score: string;
  rating: string;
  percent: number;
  icon: any;
  color: string;
  bg: string;
  feedback: string;
  missingAtoms?: string[];
}

export function CodingEvaluation() {
  const searchParams = useSearchParams();
  const reportIdParam = searchParams.get("id");
  const [liveReport, setLiveReport] = useState<EvaluationReportDetail | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(reportIdParam));
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!reportIdParam) return;
    let isMounted = true;
    backendApi
      .getEvaluationReport(reportIdParam)
      .then((res) => {
        if (isMounted && res.success && res.report) {
          setLiveReport(res.report);
        }
      })
      .catch((err) => {
        console.warn("Failed to load live coding evaluation report:", err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [reportIdParam]);

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
      title: "Algorithmic Correctness",
      score: "9.0 / 10",
      rating: "Exceptional",
      percent: 90,
      icon: CodeXml,
      color: "text-[#2563eb]",
      bg: "bg-[#eff6ff]",
      feedback:
        "Flawlessly applied the two-pointer sliding window pattern, dynamically contracting the left pointer while preserving subarray sum invariants.",
    },
    {
      title: "Time Complexity (O(N))",
      score: "9.0 / 10",
      rating: "Exceptional",
      percent: 90,
      icon: Target,
      color: "text-[#10b981]",
      bg: "bg-[#edf5ec]",
      feedback:
        "Avoided nested re-computations by maintaining a running sum, achieving optimal O(N) linear time over brute-force O(N²).",
    },
    {
      title: "Space Complexity (O(1))",
      score: "8.5 / 10",
      rating: "Strong",
      percent: 85,
      icon: Layers,
      color: "text-[#7c3aed]",
      bg: "bg-[#f5f3ff]",
      feedback:
        "Kept auxiliary space to O(1) constant variables without allocating temporary slices or auxiliary queues.",
    },
    {
      title: "Edge Case Robustness",
      score: "8.0 / 10",
      rating: "Good",
      percent: 80,
      icon: ShieldCheck,
      color: "text-[#ff6c47]",
      bg: "bg-[#fff0ec]",
      feedback:
        "Handled empty arrays, single elements, and target sum greater than total array sum; should proactively test all-negative arrays.",
    },
    {
      title: "Code Cleanliness & Idioms",
      score: "8.5 / 10",
      rating: "Strong",
      percent: 85,
      icon: FileCode,
      color: "text-[#0d9488]",
      bg: "bg-[#e6fbf9]",
      feedback:
        "Descriptive variable naming (`windowStart`, `currentSum`, `minLen`), clean early exits, and idiomatic TypeScript syntax.",
    },
    {
      title: "Problem Solving & Verbalization",
      score: "8.5 / 10",
      rating: "Strong",
      percent: 85,
      icon: Lightbulb,
      color: "text-[#2563eb]",
      bg: "bg-[#eff6ff]",
      feedback:
        "Articulated approach before typing code, walked through a small trace example, and stated time/space trade-offs proactively.",
    },
  ];

  const timelineMilestones = [
    {
      stage: "Step 1",
      name: "Problem Comprehension & Invariant Definition",
      time: "4 min",
      status: "Completed",
      score: "9.5 / 10",
      highlight:
        "Identified that elements are positive, establishing that expanding the window monotonically increases the running sum.",
    },
    {
      stage: "Step 2",
      name: "Algorithm Design & Complexity Analysis",
      time: "6 min",
      status: "Completed",
      score: "9.0 / 10",
      highlight:
        "Proactively derived O(N) linear runtime and O(1) space constraints before typing any code.",
    },
    {
      stage: "Step 3",
      name: "Implementation & Clean Coding",
      time: "11 min",
      status: "Completed",
      score: "8.5 / 10",
      highlight:
        "Implemented clean while-loop window contraction without off-by-one index errors.",
    },
    {
      stage: "Step 4",
      name: "Dry Run & Edge Case Verification",
      time: "7 min",
      status: "Completed",
      score: "8.5 / 10",
      highlight:
        "Verified 15/15 test cases including boundary values: array length 1, zero elements, and unreachable target sums.",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] gap-3">
        <Loader2 className="size-8 text-brand animate-spin" />
        <span className="text-sm font-semibold text-ink-muted">Loading Evaluation Report...</span>
      </div>
    );
  }

  const displayTitle = liveReport?.title || liveReport?.practiceSession?.title || "Practice Evaluation: Maximum Sum Subarray & Window Optimization";
  const displayDomain = liveReport?.practiceSession?.domain || "Data Structures & Algorithms";
  const displayScore = liveReport ? Math.round(liveReport.overallScore) : 86;
  const displayVerdict = liveReport?.verdict || "Strong Hire";
  const displayPrior = liveReport?.priorReadinessScore ?? 64;
  const displayNew = liveReport?.newReadinessScore ?? 71;
  const displayDelta = liveReport?.readinessDelta ?? 7;
  const displayPercentile = liveReport?.percentileRank ? `Top ${100 - liveReport.percentileRank}%` : "Top 10%";
  const displayEvaluator = liveReport ? `${liveReport.evaluatorName} (${liveReport.evaluatorRole})` : "Alex (AI Senior Algorithms Coach)";
  const displayNotes = liveReport?.evaluatorNotes || "The candidate demonstrated strong algorithmic intuition by identifying the sliding window pattern within 4 minutes. Code is concise, readable, and executes in optimal O(N) time with O(1) space. Test suite passed 15/15 cases on the first run. To demonstrate Staff-level depth, proactively explain how the algorithm adapts if the array contains negative numbers (where prefix sums with monotonic deque are required).";

  const dynamicCriteria: CodingCriterionItem[] =
    liveReport?.rubricScores && liveReport.rubricScores.length > 0
      ? liveReport.rubricScores.map((scoreItem) => {
          const scoreOutOf10 = Math.min(10, Math.max(1, scoreItem.score));
          const percent = Math.round(scoreOutOf10 * 10);
          const rating =
            scoreOutOf10 >= 8.5
              ? "Exceptional"
              : scoreOutOf10 >= 7.0
              ? "Strong"
              : scoreOutOf10 >= 5.5
              ? "Good"
              : "Needs Practice";

          let icon = CodeXml;
          let color = "text-[#2563eb]";
          let bg = "bg-[#eff6ff]";

          const dim = scoreItem.dimension.toLowerCase();
          if (dim.includes("time") || dim.includes("complexity") || dim.includes("optimal")) {
            icon = Target;
            color = "text-[#10b981]";
            bg = "bg-[#edf5ec]";
          } else if (dim.includes("space") || dim.includes("memory") || dim.includes("auxiliary")) {
            icon = Layers;
            color = "text-[#7c3aed]";
            bg = "bg-[#f5f3ff]";
          } else if (dim.includes("edge") || dim.includes("robust") || dim.includes("corner")) {
            icon = ShieldCheck;
            color = "text-[#ff6c47]";
            bg = "bg-[#fff0ec]";
          } else if (dim.includes("clean") || dim.includes("idiom") || dim.includes("style")) {
            icon = FileCode;
            color = "text-[#0d9488]";
            bg = "bg-[#e6fbf9]";
          } else if (dim.includes("reasoning") || dim.includes("verbal") || dim.includes("problem")) {
            icon = Lightbulb;
            color = "text-[#2563eb]";
            bg = "bg-[#eff6ff]";
          }

          const formattedTitle = scoreItem.dimension
            .replace(/_/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase());

          return {
            title: formattedTitle,
            score: `${scoreOutOf10.toFixed(1)} / 10`,
            rating,
            percent,
            icon,
            color,
            bg,
            feedback: scoreItem.assessment || "Assessed against FAANG bar raiser algorithmic criteria.",
            missingAtoms: scoreItem.missingAtoms || [],
          };
        })
      : evaluationCriteria;

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
            href="/practice/session/coding"
            className="font-medium text-ink-muted hover:text-brand transition-colors"
          >
            Coding Session
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
                {displayDomain}
              </span>
              <span className="rounded-md bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-[#2563eb]">
                Sliding Window · Optimal Subarray
              </span>
            </div>
            <h1 className="font-display text-xl sm:text-2xl lg:text-3xl font-extrabold text-ink tracking-tight break-words">
              {displayTitle}
            </h1>
            <p className="text-xs sm:text-sm text-ink-muted">
              Evaluator: {displayEvaluator}
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
              href="/practice/session/coding"
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
                    strokeDashoffset={213 - (213 * Math.min(100, Math.max(0, displayScore))) / 100}
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="font-display text-lg sm:text-2xl font-black text-ink">
                    {displayScore}
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
                    {displayVerdict}
                  </span>
                  <span className="text-[11px] sm:text-xs font-semibold text-ink-muted">
                    Percentile: {displayPercentile}
                  </span>
                </div>
                <h2 className="font-display text-sm sm:text-base lg:text-lg font-bold text-ink leading-snug">
                  Algorithmic Problem Solving Mastery
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
                  <span className="text-ink-muted font-medium">{displayPrior}%</span>
                  <span>→</span>
                  <span className="text-[#10b981]">{displayNew}%</span>
                  <span className="text-[11px] font-semibold text-[#10b981]">
                    ({displayDelta >= 0 ? `+${displayDelta}%` : `${displayDelta}%`})
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
              &quot;{displayNotes}&quot;
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
              <span className="font-bold text-ink">
                Ready for Hard Problems
              </span>
            </div>

            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-ink-muted flex items-center gap-1.5">
                <Clock className="size-4 text-[#7c3aed]" /> Drill Duration
              </span>
              <span className="font-bold text-ink">28m 10s / 30m</span>
            </div>

            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-ink-muted flex items-center gap-1.5">
                <ShieldCheck className="size-4 text-[#10b981]" /> Test Cases
                Passed
              </span>
              <span className="font-bold text-ink">15 / 15 (100%)</span>
            </div>

            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-ink-muted flex items-center gap-1.5">
                <Terminal className="size-4 text-[#2563eb]" /> Language Used
              </span>
              <span className="font-bold text-ink">TypeScript</span>
            </div>
          </div>

          <div className="pt-2 border-t border-line/60 flex items-center justify-between">
            <span className="text-xs text-ink-muted">Complexity Target</span>
            <span className="rounded bg-[#edf5ec] px-2 py-0.5 text-xs font-bold text-[#10b981]">
              O(N) Time · O(1) Space
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
            Detailed assessment across the 6 core algorithmic coding dimensions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {dynamicCriteria.map((item) => {
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
                  {item.missingAtoms && item.missingAtoms.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1.5 border-t border-line/40">
                      <span className="text-[10px] uppercase font-bold text-rose-500 mr-1">Missing:</span>
                      {item.missingAtoms.map((atom: string) => (
                        <span
                          key={atom}
                          className="px-2 py-0.5 rounded-md bg-rose-50 border border-rose-200 text-[10px] font-medium text-rose-700"
                        >
                          {atom}
                        </span>
                      ))}
                    </div>
                  )}
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
                <strong>Optimal Pattern Recognition:</strong> Immediately
                identified that the problem satisfies the monotonic window
                property, avoiding nested $O(N^2)$ brute-force sub-array
                generation.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="size-1.5 rounded-full bg-[#10b981] mt-2 shrink-0" />
              <p>
                <strong>Zero Index Drift:</strong> Managed `windowStart` and
                `windowEnd` pointers with zero off-by-one errors during
                left-pointer while-loop contractions.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="size-1.5 rounded-full bg-[#10b981] mt-2 shrink-0" />
              <p>
                <strong>O(1) Constant Space:</strong> Maintained running
                accumulator variables without allocating additional memory
                arrays, achieving strictly optimal space efficiency.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="size-1.5 rounded-full bg-[#10b981] mt-2 shrink-0" />
              <p>
                <strong>Proactive Test Coverage:</strong> Manually traced an
                example array with single elements and target sum equal to array
                sum before clicking submit.
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
                <strong>Handling Negative Integers:</strong> Be prepared to
                explain why standard sliding window fails with negative numbers
                (monotonicity breaks), and how prefix sums + hash maps resolve
                this.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="size-1.5 rounded-full bg-brand mt-2 shrink-0" />
              <p>
                <strong>Monotonic Queue Variant:</strong> For fixed-size sliding
                window maximums ($K$), discuss $O(N)$ implementation using a
                double-ended queue (deque) holding indices.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="size-1.5 rounded-full bg-brand mt-2 shrink-0" />
              <p>
                <strong>Early Mathematical Break:</strong> When target is 0 and
                array has positive elements, return 0 immediately without
                iterating the array.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="size-1.5 rounded-full bg-brand mt-2 shrink-0" />
              <p>
                <strong>Integer Overflow Handling:</strong> When summing large
                arrays in languages with bounded integer types (e.g. C++/Java),
                proactively declare 64-bit integer accumulators (`long long`).
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
            Time allocation across the 4 stages of the algorithmic problem
            solving drill.
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
            Targeted drills recommended based on your sliding window
            performance.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <Link
            href="/practice/session/system-design"
            className="flex flex-col justify-between gap-3 rounded-xl border border-line p-4 hover:border-brand hover:bg-[#fffbf8] transition-all group"
          >
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#0d9488]">
                System Design
              </span>
              <h3 className="font-display font-bold text-sm text-ink group-hover:text-brand transition-colors">
                System Design: Load Balancing
              </h3>
              <p className="text-xs text-ink-muted leading-relaxed">
                Step 2 of your preparation roadmap: Reverse proxies & L4/L7 load
                balancing.
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-brand">
              Continue to System Design <ChevronRight className="size-3.5" />
            </span>
          </Link>

          <Link
            href="/practice/session/coding"
            className="flex flex-col justify-between gap-3 rounded-xl border border-line p-4 hover:border-brand hover:bg-[#fffbf8] transition-all group"
          >
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#2563eb]">
                Advanced Algorithms
              </span>
              <h3 className="font-display font-bold text-sm text-ink group-hover:text-brand transition-colors">
                Sliding Window Maximum (Hard)
              </h3>
              <p className="text-xs text-ink-muted leading-relaxed">
                Master monotonic deques to solve sliding window max in strictly
                linear time.
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
                Technical Coding Mock Interview
              </h3>
              <p className="text-xs text-ink-muted leading-relaxed">
                Experience a live 45-minute live coding challenge with AI
                follow-up questions.
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-brand">
              Start Coding Mock <ChevronRight className="size-3.5" />
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
            href="/practice/session/system-design"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-bold text-white shadow-[0_4px_14px_rgba(255,108,71,0.25)] hover:bg-[#eb4a19] transition-all cursor-pointer text-center"
          >
            <span>Continue to System Design →</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
