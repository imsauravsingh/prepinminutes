"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { DashboardStepper } from "@/components/dashboard/DashboardStepper";
import { InteractiveRoadmap } from "@/components/dashboard/InteractiveRoadmap";
import { backendApi } from "@/lib/api-client";
import {
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
  RotateCcw,
  Loader2,
  Target,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Flame,
  ArrowRight,
  Trophy,
} from "lucide-react";

interface StartPreparingWorkspaceProps {
  onEditSetup?: () => void;
}

export function StartPreparingWorkspace({
  onEditSetup,
}: StartPreparingWorkspaceProps) {
  const [profile, setProfile] = useState<Record<string, any> | null>(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem("pim_profile_cache");
        if (cached) return JSON.parse(cached);
      } catch {}
    }
    return null;
  });
  const [activePlan, setActivePlan] = useState<Record<string, any> | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [showResetModal, setShowResetModal] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    backendApi
      .getProfile()
      .then((res) => {
        if (!isMounted) return;
        if (res.profile) {
          setProfile(res.profile);
          if (typeof window !== "undefined") {
            try {
              localStorage.setItem(
                "pim_profile_cache",
                JSON.stringify(res.profile),
              );
            } catch {}
          }
        }
        if (res.activePlan) setActivePlan(res.activePlan);
      })
      .catch((err) => console.warn("Failed to load profile in dashboard:", err))
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleResetProfile = async () => {
    setIsResetting(true);
    try {
      await backendApi.resetProfile();
      if (typeof window !== "undefined") {
        try {
          localStorage.removeItem("pim_profile_cache");
          localStorage.removeItem("prep_onboarding_completed");
        } catch {}
      }
      setShowResetModal(false);
      if (onEditSetup) {
        onEditSetup();
      } else {
        window.location.href = "/dashboard?setup=true";
      }
    } catch (err) {
      console.error("Failed to reset profile:", err);
    } finally {
      setIsResetting(false);
    }
  };

  const isFresher =
    String(profile?.experienceLevel || "")
      .toLowerCase()
      .includes("0 years") ||
    String(profile?.experienceLevel || "")
      .toLowerCase()
      .includes("fresher");

  const displayRole = profile?.targetRole
    ? isFresher && profile?.fresherForte
      ? `${profile.targetRole} • ${profile.fresherForte.split(" (")[0]}`
      : profile.targetRole
    : activePlan?.targetRole || "Software Engineer / SDE";

  const displayExperience = profile?.experienceLevel || "0-1 years";
  const displayTimeline =
    profile?.timelineLabel || activePlan?.timelineLabel || "1 month";
  const targetCompanies =
    profile?.targetCompanies || activePlan?.targetCompanies || [];
  const displayCompany =
    Array.isArray(targetCompanies) && targetCompanies.length > 0
      ? targetCompanies[0]
      : "Google";

  // Dynamic Completed Metrics: Starts strictly from zero 0 for fresh candidates
  const completedActivities = Number(
    profile?.completedActivities ?? activePlan?.completedActivitiesCount ?? 0,
  );
  const totalActivities = Number(activePlan?.totalActivitiesCount ?? 24);
  const progressPercent =
    totalActivities > 0
      ? Math.round((completedActivities / totalActivities) * 100)
      : 0;
  const daysCompleted = Number(
    profile?.completedDays ??
      activePlan?.completedDays ??
      (completedActivities > 0 ? 1 : 0),
  );

  // Derive total days from timeline
  const deriveDaysFromTimeline = (label: string): number => {
    const l = label.toLowerCase();
    if (l.includes("2 week")) return 14;
    if (l.includes("1 month") || l.includes("4 week")) return 28;
    if (l.includes("2 month") || l.includes("8 week")) return 56;
    if (l.includes("3 month") || l.includes("12 week")) return 84;
    if (l.includes("6 month") || l.includes("24 week")) return 168;
    return 28;
  };
  const totalTimelineDays = deriveDaysFromTimeline(displayTimeline);
  const daysRemaining = Math.max(0, totalTimelineDays - daysCompleted);

  // Circular progress calculation from real candidate progress (starts from 0)
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    progressPercent === 0
      ? circumference
      : circumference - (circumference * progressPercent) / 100;

  // Today's Formatted Live Date
  const todayFormatted = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  // Dynamically tailor today's activities based on role / forte
  const getTodayActivities = () => {
    const roleLower = (profile?.targetRole || "").toLowerCase();
    const forteLower = (profile?.fresherForte || "").toLowerCase();

    if (
      roleLower.includes("data analyst") ||
      forteLower.includes("data analytics") ||
      forteLower.includes("sql")
    ) {
      return [
        {
          title: "SQL Mastery: Complex Joins & Aggregations",
          subtitle: "Master multi-table joins, subqueries and window functions",
          duration: "10 min",
          href: "/practice/session/coding?topic=sql-window-functions",
          icon: BookOpen,
          bg: "bg-[#ffe4e8]",
          textColor: "text-pink",
          badge: "SQL",
        },
        {
          title: "Data Analytics: Metric Definition & KPIs",
          subtitle: "Walk through churn, cohort retention and funnel drop-offs",
          duration: "10 min",
          href: "/practice/topics?domain=data-engineering&search=analytics",
          icon: Code2,
          bg: "bg-[#eff6ff]",
          textColor: "text-blue",
          badge: "Analytics",
        },
        {
          title: "Behavioral: Presenting Insights to Stakeholders",
          subtitle:
            "Practice explaining data findings to non-technical leadership",
          duration: "5 min",
          href: "/practice/session/behavioral",
          icon: MessageSquare,
          bg: "bg-[#f5f3ff]",
          textColor: "text-purple",
          badge: "STAR",
        },
      ];
    }

    if (
      roleLower.includes("cloud") ||
      roleLower.includes("devops") ||
      forteLower.includes("cloud") ||
      forteLower.includes("devops")
    ) {
      return [
        {
          title: "Cloud Infrastructure: VPC & Multi-Region Resiliency",
          subtitle: "Architect cross-region disaster recovery and auto-scaling",
          duration: "10 min",
          href: "/practice/session/cloud",
          icon: BookOpen,
          bg: "bg-[#eff6ff]",
          textColor: "text-blue",
          badge: "VPC",
        },
        {
          title: "DevOps: Kubernetes Pod Scheduling & Ingress",
          subtitle:
            "Configure node affinity, taint/tolerations and ingress controllers",
          duration: "10 min",
          href: "/practice/session/cloud?topic=kubernetes-architecture",
          icon: Code2,
          bg: "bg-[#e0e7ff]",
          textColor: "text-indigo-600",
          badge: "K8s",
        },
        {
          title: "Behavioral: Production Incident Management & Post-Mortem",
          subtitle: "Structure answers around high-severity outage triage",
          duration: "5 min",
          href: "/practice/session/behavioral",
          icon: MessageSquare,
          bg: "bg-[#f5f3ff]",
          textColor: "text-purple",
          badge: "STAR",
        },
      ];
    }

    if (
      roleLower.includes("machine learning") ||
      roleLower.includes("ai") ||
      forteLower.includes("ai") ||
      forteLower.includes("machine learning")
    ) {
      return [
        {
          title: "AI System Design: Vector Search & RAG Architecture",
          subtitle:
            "Chunking, hybrid BM25 + dense search and re-ranking pipelines",
          duration: "10 min",
          href: "/practice/session/system-design?topic=vector-databases-and-rag-pipeline",
          icon: BookOpen,
          bg: "bg-[#faf5ff]",
          textColor: "text-purple-600",
          badge: "RAG",
        },
        {
          title: "ML Fundamentals: Transformer Self-Attention & Loss",
          subtitle:
            "Explain multi-head attention, backprop and gradient clipping",
          duration: "10 min",
          href: "/practice/session/coding?topic=dynamic-programming-patterns",
          icon: Code2,
          bg: "bg-[#eff6ff]",
          textColor: "text-blue",
          badge: "Math/ML",
        },
        {
          title: "Behavioral: Delivering ML Prototypes into Production",
          subtitle:
            "Explain trade-offs between model accuracy and inference latency",
          duration: "5 min",
          href: "/practice/session/behavioral",
          icon: MessageSquare,
          bg: "bg-[#f5f3ff]",
          textColor: "text-purple",
          badge: "STAR",
        },
      ];
    }

    if (
      roleLower.includes("frontend") ||
      forteLower.includes("web development") ||
      roleLower.includes("fullstack")
    ) {
      return [
        {
          title: "Frontend Architecture: SSR vs Hydration & Core Web Vitals",
          subtitle: "Optimize LCP, INP and CLS with streaming SSR",
          duration: "10 min",
          href: "/practice/session/system-design?topic=micro-frontends-and-rendering-strategies",
          icon: BookOpen,
          bg: "bg-[#ffe4e8]",
          textColor: "text-pink",
          badge: "Web Arch",
        },
        {
          title: "Coding Practice: Reactive UI & State Management",
          subtitle: "Design concurrent state caches and debounced event queues",
          duration: "10 min",
          href: "/practice/session/coding?topic=two-pointers",
          icon: Code2,
          bg: "bg-[#eff6ff]",
          textColor: "text-blue",
          badge: "React/TS",
        },
        {
          title: "Behavioral: Alignment with Product & Design Teams",
          subtitle: "Navigate scope trade-offs under tight sprint deadlines",
          duration: "5 min",
          href: "/practice/session/behavioral",
          icon: MessageSquare,
          bg: "bg-[#f5f3ff]",
          textColor: "text-purple",
          badge: "STAR",
        },
      ];
    }

    // Default: Software Engineer / SDE / Backend Architecture
    return [
      {
        title: "System Design: Load Balancing Strategies",
        subtitle: "L4 vs L7 routing, consistent hashing and health checks",
        duration: "10 min",
        href: "/practice/session/system-design?topic=Load%20Balancing%20Strategies",
        icon: BookOpen,
        bg: "bg-[#ffe4e8]",
        textColor: "text-pink",
        badge: "Architecture",
      },
      {
        title: "Coding Practice: Two Pointers & Sliding Window",
        subtitle: "Solve 1-2 medium array/string problems optimally in O(N)",
        duration: "10 min",
        href: "/practice/session/coding?topic=two-pointers",
        icon: Code2,
        bg: "bg-[#eff6ff]",
        textColor: "text-blue",
        badge: "Algorithms",
      },
      {
        title: "Behavioral: Conflict Resolution & Cross-Functional Ownership",
        subtitle: "Practice structuring technical disagreement using STAR",
        duration: "5 min",
        href: "/practice/session/behavioral",
        icon: MessageSquare,
        bg: "bg-[#f5f3ff]",
        textColor: "text-purple",
        badge: "STAR",
      },
    ];
  };

  const todayActivities = getTodayActivities();

  // Dynamically tailor the 4 preparation areas with progress starting at 0%
  const getPreparationAreas = () => {
    const roleLower = (profile?.targetRole || "").toLowerCase();
    const forteLower = (profile?.fresherForte || "").toLowerCase();
    const isCompleted = completedActivities > 0;

    if (
      roleLower.includes("data analyst") ||
      forteLower.includes("data analytics") ||
      forteLower.includes("sql")
    ) {
      return [
        {
          name: "SQL & Relational Modeling",
          progress: isCompleted ? 25 : 0,
          remaining: isCompleted ? "6 topics remaining" : "8 topics remaining",
          color: "bg-brand",
          border: "border-[#ffe4dc]",
          bg: "bg-[#fff8f6]",
          iconColor: "text-brand",
          icon: Layers,
        },
        {
          name: "Data Analytics & KPIs",
          progress: isCompleted ? 20 : 0,
          remaining: isCompleted ? "9 topics remaining" : "12 topics remaining",
          color: "bg-blue",
          border: "border-[#dbeafe]",
          bg: "bg-[#f0f7ff]",
          iconColor: "text-blue",
          icon: Code2,
        },
        {
          name: "Python for Data Analysis",
          progress: 0,
          remaining: "10 topics remaining",
          color: "bg-purple",
          border: "border-[#f3e8ff]",
          bg: "bg-[#faf5ff]",
          iconColor: "text-purple",
          icon: Users2,
        },
        {
          name: "Behavioral & Communication",
          progress: 0,
          remaining: "6 topics remaining",
          color: "bg-[#10b981]",
          border: "border-[#dcfce7]",
          bg: "bg-[#f0fdf4]",
          iconColor: "text-[#10b981]",
          icon: MessageSquare,
        },
      ];
    }

    if (
      roleLower.includes("cloud") ||
      roleLower.includes("devops") ||
      forteLower.includes("cloud") ||
      forteLower.includes("devops")
    ) {
      return [
        {
          name: "Cloud Architecture",
          progress: isCompleted ? 25 : 0,
          remaining: isCompleted ? "6 topics remaining" : "8 topics remaining",
          color: "bg-brand",
          border: "border-[#ffe4dc]",
          bg: "bg-[#fff8f6]",
          iconColor: "text-brand",
          icon: Layers,
        },
        {
          name: "Kubernetes & Containers",
          progress: isCompleted ? 15 : 0,
          remaining: isCompleted
            ? "10 topics remaining"
            : "12 topics remaining",
          color: "bg-blue",
          border: "border-[#dbeafe]",
          bg: "bg-[#f0f7ff]",
          iconColor: "text-blue",
          icon: Code2,
        },
        {
          name: "CI/CD & Infrastructure as Code",
          progress: 0,
          remaining: "10 topics remaining",
          color: "bg-purple",
          border: "border-[#f3e8ff]",
          bg: "bg-[#faf5ff]",
          iconColor: "text-purple",
          icon: Users2,
        },
        {
          name: "Behavioral & Incident Leadership",
          progress: 0,
          remaining: "8 topics remaining",
          color: "bg-[#10b981]",
          border: "border-[#dcfce7]",
          bg: "bg-[#f0fdf4]",
          iconColor: "text-[#10b981]",
          icon: MessageSquare,
        },
      ];
    }

    if (
      roleLower.includes("frontend") ||
      forteLower.includes("web development") ||
      roleLower.includes("fullstack")
    ) {
      return [
        {
          name: "Frontend Architecture",
          progress: isCompleted ? 20 : 0,
          remaining: isCompleted ? "6 topics remaining" : "8 topics remaining",
          color: "bg-brand",
          border: "border-[#ffe4dc]",
          bg: "bg-[#fff8f6]",
          iconColor: "text-brand",
          icon: Layers,
        },
        {
          name: "React, TypeScript & State",
          progress: isCompleted ? 15 : 0,
          remaining: isCompleted
            ? "10 topics remaining"
            : "12 topics remaining",
          color: "bg-blue",
          border: "border-[#dbeafe]",
          bg: "bg-[#f0f7ff]",
          iconColor: "text-blue",
          icon: Code2,
        },
        {
          name: "API Design & Performance",
          progress: 0,
          remaining: "10 topics remaining",
          color: "bg-purple",
          border: "border-[#f3e8ff]",
          bg: "bg-[#faf5ff]",
          iconColor: "text-purple",
          icon: Users2,
        },
        {
          name: "Behavioral & Collaboration",
          progress: 0,
          remaining: "8 topics remaining",
          color: "bg-[#10b981]",
          border: "border-[#dcfce7]",
          bg: "bg-[#f0fdf4]",
          iconColor: "text-[#10b981]",
          icon: MessageSquare,
        },
      ];
    }

    // Default: Software Engineer / SDE / Backend Architecture
    return [
      {
        name: "System Design",
        progress: isCompleted ? 20 : 0,
        remaining: isCompleted ? "6 topics remaining" : "8 topics remaining",
        color: "bg-brand",
        border: "border-[#ffe4dc]",
        bg: "bg-[#fff8f6]",
        iconColor: "text-brand",
        icon: Layers,
      },
      {
        name: "Coding & Algorithms",
        progress: isCompleted ? 15 : 0,
        remaining: isCompleted ? "10 topics remaining" : "12 topics remaining",
        color: "bg-blue",
        border: "border-[#dbeafe]",
        bg: "bg-[#f0f7ff]",
        iconColor: "text-blue",
        icon: Code2,
      },
      {
        name: "Cloud & Microservices",
        progress: 0,
        remaining: "10 topics remaining",
        color: "bg-purple",
        border: "border-[#f3e8ff]",
        bg: "bg-[#faf5ff]",
        iconColor: "text-purple",
        icon: Users2,
      },
      {
        name: "Behavioral & Leadership",
        progress: 0,
        remaining: "8 topics remaining",
        color: "bg-[#10b981]",
        border: "border-[#dcfce7]",
        bg: "bg-[#f0fdf4]",
        iconColor: "text-[#10b981]",
        icon: MessageSquare,
      },
    ];
  };

  const preparationAreas = getPreparationAreas();

  return (
    <div className="flex w-full flex-col gap-8">
      {/* 1. Header & Stepper (Step 3 of 3) */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Left: Step kicker & Title */}
        <div className="flex flex-col gap-1.5 max-w-2xl">
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

        {/* Right side: Stepper */}
        <div className="shrink-0 self-start lg:self-center">
          <DashboardStepper currentStep={3} onEditSetup={onEditSetup} />
        </div>
      </div>

      {/* 2. User Profile, Readiness Progress & Countdown Header Card */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 rounded-2xl border border-line bg-white p-5 sm:p-6 shadow-[0_4px_16px_rgba(30,28,26,0.03)]">
        {/* Left: Circular Readiness Progress Percentage Ring */}
        <div className="flex items-center gap-3.5 shrink-0 pr-0 lg:pr-5 lg:border-r border-line">
          <div className="relative flex size-14 shrink-0 items-center justify-center">
            <svg className="size-full -rotate-90" viewBox="0 0 90 90">
              <circle
                cx="45"
                cy="45"
                r={radius}
                className="stroke-[#f4efe8]"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="45"
                cy="45"
                r={radius}
                className="stroke-brand transition-all duration-700 ease-out"
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-display text-xs font-black text-ink">
                {progressPercent}%
              </span>
            </div>
          </div>

          <div className="flex flex-col min-w-0">
            <span className="text-[10px] font-bold text-ink-muted uppercase tracking-wider">
              Readiness
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-display text-sm font-extrabold text-ink">
                {progressPercent >= 80
                  ? "Exam Ready"
                  : progressPercent >= 35
                    ? "In Progress"
                    : "Starting Out"}
              </span>
              <span className="text-[11px] text-ink-muted font-medium">
                ({completedActivities}/{totalActivities})
              </span>
            </div>
          </div>
        </div>

        {/* Center: Parameters Grid (Target Role, Experience, Countdown, Target Company) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 flex-1">
          {/* Target Role */}
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#f5f3ff] text-purple">
              <Briefcase className="size-5" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs text-ink-muted">Target Role</span>
              <span className="font-display text-sm sm:text-[15px] font-bold text-ink truncate">
                {displayRole}
              </span>
            </div>
          </div>

          {/* Experience */}
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#eff6ff] text-blue">
              <TrendingUp className="size-5" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs text-ink-muted">Experience</span>
              <span className="font-display text-sm sm:text-[15px] font-bold text-ink truncate">
                {displayExperience}
              </span>
            </div>
          </div>

          {/* Countdown & Preparation Timeline */}
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand">
              <Clock className="size-5" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs text-ink-muted">Countdown</span>
              <div className="flex items-baseline gap-1.5 flex-wrap">
                <span className="font-display text-sm sm:text-[15px] font-bold text-ink truncate">
                  {daysRemaining} Days
                </span>
                <span className="text-[10px] text-ink-muted font-semibold truncate">
                  ({displayTimeline})
                </span>
              </div>
            </div>
          </div>

          {/* Target Company */}
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#eff6ff] text-blue relative">
              <Building2 className="size-5" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs text-ink-muted">Target Company</span>
              <div className="flex items-center gap-1.5">
                <span className="font-display text-sm sm:text-[15px] font-bold text-ink truncate">
                  {displayCompany}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Action Buttons: Edit & Reset Profile */}
        <div className="flex items-center gap-2 self-start lg:self-auto shrink-0 flex-wrap">
          {onEditSetup ? (
            <button
              type="button"
              onClick={onEditSetup}
              className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3.5 py-1.5 font-semibold text-ink shadow-xs transition-colors hover:bg-cream text-xs cursor-pointer"
            >
              <Pencil className="size-3 text-ink-muted" />
              <span>Edit Details</span>
            </button>
          ) : (
            <Link
              href="/dashboard?setup=true"
              className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3.5 py-1.5 font-semibold text-ink shadow-xs transition-colors hover:bg-cream text-xs cursor-pointer"
            >
              <Pencil className="size-3 text-ink-muted" />
              <span>Edit Details</span>
            </Link>
          )}

          <button
            type="button"
            onClick={() => setShowResetModal(true)}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#ede6db] bg-[#fbf9f4] px-3.5 py-1.5 font-semibold text-ink shadow-2xs hover:bg-[#fff0ec] hover:text-brand hover:border-brand/40 text-xs transition-colors cursor-pointer"
          >
            <RotateCcw className="size-3 text-ink-muted" />
            <span>Reset Profile</span>
          </button>
        </div>
      </div>

      {/* 3. MAIN DASHBOARD CENTERPIECE: Visual Branching Skill Tree (Matching Uploaded UI) */}
      <InteractiveRoadmap
        targetRole={displayRole}
        experienceLevel={displayExperience}
        targetCompany={displayCompany}
        timelineLabel={displayTimeline}
        isFresher={isFresher}
        completedActivities={completedActivities}
      />

      {/* 5. Two-Column Split: Today's Preparation (Left) + Critical Gaps & AI Advice (Right) */}
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
                  Today&apos;s AI Recommended Sprint
                </h3>
                <span className="text-xs text-ink-muted sm:text-sm">
                  A high-yield 25-minute sprint tailored for {displayRole}.
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
              <div className="flex items-center gap-1.5 text-xs text-ink-muted font-medium">
                <Calendar className="size-3.5" />
                <span>{todayFormatted}</span>
              </div>
              <span className="rounded-full bg-brand-soft px-2.5 py-0.5 text-xs font-bold text-brand">
                25 min
              </span>
            </div>
          </div>

          {/* Activities List */}
          <div className="flex flex-col gap-3">
            {todayActivities.map((act, idx) => {
              const ActIcon = act.icon;
              return (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-line bg-white p-3.5 shadow-2xs hover:border-brand/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${act.bg} ${act.textColor}`}
                    >
                      <ActIcon className="size-5" />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-2">
                        <h4 className="font-display text-sm font-bold text-ink">
                          {act.title}
                        </h4>
                        <span className="rounded bg-cream px-1.5 py-0.5 text-[10px] font-bold text-ink-muted tracking-wide">
                          {act.badge}
                        </span>
                      </div>
                      <p className="text-xs text-ink-muted">{act.subtitle}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
                    <span className="text-xs font-semibold text-ink-muted">
                      {act.duration}
                    </span>
                    <Link
                      href={act.href}
                      className="rounded-full bg-brand px-4 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-[#fa552b] transition-colors"
                    >
                      Start →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Motivation Callout */}
          <div className="flex items-center gap-3 rounded-xl border border-brand/20 bg-brand-soft/60 p-3.5 text-xs">
            <span className="text-xl">📣</span>
            <div className="flex flex-col">
              <span className="font-bold text-ink">
                Complete today&apos;s sprint to unlock the next skill tree node!
              </span>
              <span className="text-ink-muted">
                Your skill tree updates node statuses in real-time as you practice.
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Weaknesses & AI Diagnostic Recommendations (span 5) */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-4 rounded-2xl border border-line bg-white p-5 sm:p-6 shadow-[0_4px_16px_rgba(30,28,26,0.03)]">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-red-50 text-red-600">
                <Flame className="size-4.5 fill-red-500" />
              </div>
              <h3 className="font-display text-lg font-extrabold text-ink">
                Critical Gaps & AI Advice
              </h3>
            </div>

            <Link
              href="/preparation-plan"
              className="text-xs font-semibold text-blue hover:underline"
            >
              Full Analytics →
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            {/* Gap 1 */}
            <div className="flex flex-col gap-1.5 rounded-xl border border-red-200 bg-[#fffbfb] p-3.5">
              <div className="flex items-center justify-between">
                <span className="font-display text-xs font-bold text-red-800 flex items-center gap-1.5">
                  <AlertTriangle className="size-3.5 text-red-600" />
                  <span>
                    {isFresher
                      ? "Algorithm Time Complexity & Edge Cases"
                      : "Database Indexing & Query Plans"}
                  </span>
                </span>
                <span className="text-[10px] font-bold text-red-600 bg-red-100 rounded px-1.5 py-0.5">
                  Critical Gap
                </span>
              </div>
              <p className="text-xs text-ink-muted leading-relaxed">
                {isFresher
                  ? "Frequent edge-case misses with 0, null, and duplicate inputs in binary search & tree traversals."
                  : "Struggled with composite index ordering (leftmost prefix rule) and identifying full table scans."}
              </p>
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] font-bold text-emerald-700">
                  +14% Readiness Lift
                </span>
                <Link
                  href="/practice/session/coding?topic=dynamic-programming-patterns"
                  className="text-xs font-bold text-brand hover:underline"
                >
                  Start Diagnostic Drill →
                </Link>
              </div>
            </div>

            {/* Gap 2 */}
            <div className="flex flex-col gap-1.5 rounded-xl border border-amber/30 bg-[#fffdfa] p-3.5">
              <div className="flex items-center justify-between">
                <span className="font-display text-xs font-bold text-amber-900 flex items-center gap-1.5">
                  <Clock className="size-3.5 text-amber" />
                  <span>
                    {isFresher
                      ? "Clean Code & Modular Functions"
                      : "Concurrency & Race Condition Prevention"}
                  </span>
                </span>
                <span className="text-[10px] font-bold text-amber-700 bg-amber-100 rounded px-1.5 py-0.5">
                  Focus Next
                </span>
              </div>
              <p className="text-xs text-ink-muted leading-relaxed">
                {isFresher
                  ? "Practice splitting monolithic problem solvers into pure helper functions before coding."
                  : "Review thread pool saturation, deadlock Coffman conditions, and CAS primitives."}
              </p>
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] font-bold text-emerald-700">
                  +9% Readiness Lift
                </span>
                <Link
                  href="/practice/session/system-design"
                  className="text-xs font-bold text-brand hover:underline"
                >
                  Review Architecture →
                </Link>
              </div>
            </div>
          </div>

          {/* Motivational Quote */}
          <div className="rounded-xl border border-line bg-[#fbf9f4] p-3 flex flex-col gap-0.5 text-xs">
            <p className="italic text-ink font-medium leading-snug">
              “Focus on fixing one critical gap per day — consistency compounds exponentially.”
            </p>
            <span className="text-[10px] text-ink-muted">— James Clear</span>
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
              href="/practice/topics"
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

      {/* Reset Profile Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="flex w-full max-w-md flex-col rounded-2xl border border-[#ede6db] bg-white p-6 shadow-xl gap-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
                <RotateCcw className="size-5" />
              </div>
              <div className="flex flex-col">
                <h3 className="font-display font-bold text-base text-ink">
                  Reset Profile & Re-evaluate?
                </h3>
                <span className="text-xs text-ink-muted">
                  Clear current plan and re-evaluate
                </span>
              </div>
            </div>

            <p className="text-xs text-ink-muted leading-relaxed">
              Are you sure you want to reset your candidate profile? Your
              current active preparation plan will be archived, and you can
              reconfigure your target role, experience level, or fresher forte
              from the start.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                disabled={isResetting}
                className="rounded-full border border-[#ede6db] px-4 py-2 text-xs font-semibold text-ink hover:bg-[#faf6f0] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResetProfile}
                disabled={isResetting}
                className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-red-700 disabled:opacity-50 cursor-pointer"
              >
                {isResetting && <Loader2 className="size-3.5 animate-spin" />}
                <span>Yes, Reset Profile</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
