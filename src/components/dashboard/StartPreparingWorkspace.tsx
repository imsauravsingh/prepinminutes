"use client";

import { useState, useEffect, useMemo } from "react";
import { PrepHomeOverview } from "@/components/dashboard/PrepHomeOverview";
import { usePrepDashboard } from "@/hooks/usePrepDashboard";
import { useNextStepFlow } from "@/lib/useNextStepFlow";
import {
  evaluateCandidateProfileDomains,
} from "@/components/dashboard/InteractiveRoadmap";
import { backendApi } from "@/lib/api-client";
import {
  BookOpen,
  Code2,
  MessageSquare,
  Users2,
  Layers,
  RotateCcw,
  Loader2,
} from "lucide-react";

interface StartPreparingWorkspaceProps {
  onEditSetup?: () => void;
}

export function StartPreparingWorkspace({
  onEditSetup,
}: StartPreparingWorkspaceProps) {
  const { enabled: showNextStep } = useNextStepFlow();
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
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);

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
          localStorage.removeItem("pim_primary_language");
          localStorage.removeItem("pim_fresher_prompt_dismissed");
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

  // AI-Driven Primary Language Detection for Freshers and General Profiles
  const detectedLanguageInfo = useMemo(() => {
    if (profile?.primaryLanguage) {
      return {
        recommendedLanguage: profile.primaryLanguage,
        detectedLanguages: [profile.primaryLanguage],
        rationale: "Selected in your profile setup",
      };
    }

    const textToScan = [
      profile?.fresherForte || "",
      profile?.jobDescriptionText || "",
      profile?.targetRole || "",
      Array.isArray(profile?.skills)
        ? profile.skills.join(" ")
        : profile?.skills || "",
      profile?.resumeText || "",
      JSON.stringify(profile?.resumeParsedJson || ""),
    ]
      .join(" ")
      .toLowerCase();

    const scores: Record<string, number> = {
      Python: 0,
      Java: 0,
      "C++": 0,
      "Node.js": 0,
      Go: 0,
    };

    // Python mentions
    if (textToScan.includes("python")) scores.Python += 3;
    if (
      textToScan.includes("django") ||
      textToScan.includes("fastapi") ||
      textToScan.includes("flask")
    ) {
      scores.Python += 2;
    }
    if (
      textToScan.includes("pytorch") ||
      textToScan.includes("pandas") ||
      textToScan.includes("numpy")
    ) {
      scores.Python += 1;
    }

    // Java mentions (exclude javascript)
    const javaMatches = textToScan.match(/\bjava\b/g);
    if (javaMatches) scores.Java += javaMatches.length * 3;
    if (
      textToScan.includes("spring") ||
      textToScan.includes("springboot") ||
      textToScan.includes("jvm") ||
      textToScan.includes("hibernate")
    ) {
      scores.Java += 2;
    }

    // C++ mentions
    if (
      textToScan.includes("c++") ||
      textToScan.includes("cpp") ||
      textToScan.includes("stl")
    ) {
      scores["C++"] += 3;
    }

    // Node.js / JavaScript / TypeScript mentions
    if (textToScan.includes("node") || textToScan.includes("nodejs")) {
      scores["Node.js"] += 3;
    }
    if (
      textToScan.includes("typescript") ||
      textToScan.includes("javascript") ||
      textToScan.includes("react") ||
      textToScan.includes("express")
    ) {
      scores["Node.js"] += 2;
    }

    // Go mentions
    if (textToScan.includes("golang") || textToScan.includes("goroutine")) {
      scores.Go += 3;
    }

    const detected = Object.keys(scores).filter((k) => scores[k] > 0);
    detected.sort((a, b) => scores[b] - scores[a]);

    if (detected.length > 0 && scores[detected[0]] > 0) {
      const top = detected[0];
      return {
        recommendedLanguage: top,
        detectedLanguages: detected,
        rationale: `AI detected strongest experience in ${top} from your projects & skills`,
      };
    }

    return {
      recommendedLanguage: "Python",
      detectedLanguages: ["Python", "Java", "C++", "Node.js"],
      rationale:
        "AI Recommended: Most widely tested language in entry-level coding rounds",
    };
  }, [profile]);

  // Selected language state (synced with localStorage & roadmap)
  const [selectedLanguage, setSelectedLanguage] = useState<string>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("pim_primary_language");
        if (saved) return saved;
      } catch {}
    }
    return profile?.primaryLanguage || detectedLanguageInfo.recommendedLanguage;
  });

  // Prompt banner visibility state for freshers (prompt to choose or skip)
  const [showFresherPrompt, setShowFresherPrompt] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      try {
        if (localStorage.getItem("pim_fresher_prompt_dismissed") === "true")
          return false;
        if (localStorage.getItem("pim_primary_language")) return false;
      } catch {}
    }
    return true;
  });

  const handleConfirmLanguage = (lang: string) => {
    setSelectedLanguage(lang);
    setShowFresherPrompt(false);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("pim_primary_language", lang);
        localStorage.setItem("pim_fresher_prompt_dismissed", "true");
      } catch {}
    }
  };

  const handleSkipLanguagePrompt = () => {
    setShowFresherPrompt(false);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("pim_fresher_prompt_dismissed", "true");
      } catch {}
    }
  };

  const handleLanguageChange = (lang: string) => {
    setSelectedLanguage(lang);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("pim_primary_language", lang);
      } catch {}
    }
  };

  const displayRole = profile?.targetRole
    ? isFresher && profile?.fresherForte
      ? `${profile.targetRole} • ${profile.fresherForte.split(" (")[0]}`
      : profile.targetRole
    : activePlan?.targetRole || "Software Engineer / SDE";

  const displayExperience = profile?.experienceLevel || "0-1 years";

  // Dynamic Timeline Resolution: Accurately parse user's chosen timeline from profile & active plan
  const rawTimelineLabel =
    profile?.timelineLabel || activePlan?.timelineLabel || null;
  const rawTimelineWeeks =
    profile?.timelineWeeks || activePlan?.timelineWeeks || null;

  const { displayTimeline, totalTimelineDays } = useMemo(() => {
    const label = String(rawTimelineLabel || "").trim().toLowerCase();
    const weeks = Number(rawTimelineWeeks || 0);

    // 1. Explicit 2-3 months or 2 months or 8 weeks (60 days)
    // Note: Must check 2-3 months BEFORE 3 months because "2-3 months" contains "3 month" substring!
    if (
      label.includes("2-3") ||
      label.includes("2 month") ||
      label === "2 months" ||
      label.includes("8 week") ||
      weeks === 8
    ) {
      return {
        displayTimeline: label.includes("2-3")
          ? "2-3 months"
          : label.includes("2 month")
            ? "2 months"
            : "2-3 months",
        totalTimelineDays: 60,
      };
    }

    // 2. Explicit 3+ months or 3 months or 12+ weeks (90 days)
    if (
      label.includes("3+") ||
      (label.includes("3 month") && !label.includes("2-3")) ||
      label.includes("12 week") ||
      label.includes("14 week") ||
      weeks >= 12
    ) {
      return {
        displayTimeline: "3+ months",
        totalTimelineDays: 90,
      };
    }

    // 3. 1-2 weeks or 2 weeks (14 days)
    if (
      label.includes("1-2 week") ||
      label.includes("2 week") ||
      label.includes("1 week") ||
      (weeks > 0 && weeks <= 2)
    ) {
      return {
        displayTimeline: "1-2 weeks",
        totalTimelineDays: 14,
      };
    }

    // 4. 1 month or 4 weeks (30 days)
    if (label.includes("1 month") || label.includes("4 week") || weeks === 4) {
      return {
        displayTimeline: "1 month",
        totalTimelineDays: 30,
      };
    }

    // 5. Dynamic fallback if weeks are provided
    if (weeks > 0) {
      const days = weeks * 7;
      const derived =
        weeks >= 12
          ? "3+ months"
          : weeks >= 7
            ? "2-3 months"
            : weeks >= 3
              ? "1 month"
              : "1-2 weeks";
      return { displayTimeline: derived, totalTimelineDays: days };
    }

    // 6. If raw label exists, pass it through cleanly
    if (rawTimelineLabel) {
      return { displayTimeline: rawTimelineLabel, totalTimelineDays: 60 };
    }

    return { displayTimeline: "2-3 months", totalTimelineDays: 60 };
  }, [rawTimelineLabel, rawTimelineWeeks]);

  const targetCompanies =
    profile?.targetCompanies || activePlan?.targetCompanies || [];
  const displayCompany =
    Array.isArray(targetCompanies) && targetCompanies.length > 0
      ? targetCompanies[0]
      : ""; // no made-up default company

  // Dynamic Candidate Domains Evaluation to derive exact curriculum topics
  const evaluatedDomains = useMemo(() => {
    return evaluateCandidateProfileDomains({
      targetRole: displayRole,
      experienceLevel: displayExperience,
      isFresher,
      targetCompany: displayCompany,
    });
  }, [displayRole, displayExperience, isFresher, displayCompany]);

  // Topic counts mapped to each domain's curriculum in the roadmap
  const DOMAIN_TOPIC_COUNTS: Record<string, number> = {
    "nodejs-runtime": 3,
    "frontend-engineering": 3,
    dsa: 4,
    "cs-fundamentals": 2,
    "system-design": 3,
    lld: 2,
    "cloud-devops": 2,
    "ai-system-design": 3,
    "data-engineering": 2,
    behavioral: 2,
  };

  // Real total topics dynamically calculated from candidate's active roadmap domains
  const totalRoadmapTopics = useMemo(() => {
    return evaluatedDomains.identifiedKeys.reduce(
      (sum, key) => sum + (DOMAIN_TOPIC_COUNTS[key] || 2),
      0
    );
  }, [evaluatedDomains]);

  // Dynamic Completed Metrics: Starts strictly from zero 0 for fresh candidates
  const completedActivities = Number(
    profile?.completedActivities ?? activePlan?.completedActivitiesCount ?? 0,
  );
  const totalActivities = totalRoadmapTopics;
  const progressPercent =
    totalActivities > 0
      ? Math.round((completedActivities / totalActivities) * 100)
      : 0;
  const daysCompleted = Number(
    profile?.completedDays ??
      activePlan?.completedDays ??
      (completedActivities > 0 ? 1 : 0),
  );

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

  // Real dashboard data: setup + generated plan + published curriculum + progress.
  const prep = usePrepDashboard({
    profile,
    activePlan,
    roleDomainKeys: evaluatedDomains.identifiedKeys,
    ready: !isLoading,
  });
  const realAreas = prep.areas.map((a) => ({
    slug: a.slug,
    name: a.name,
    description: a.description,
    href: a.nextHref,
    progress: a.progress,
    remaining: `${a.total - a.done} of ${a.total} topics left`,
    companyNote:
      a.companyTopics > 0
        ? `${a.companyNames.length === 1 ? a.companyNames[0] : "Company"} focus: ${a.companyTopics} topic${a.companyTopics === 1 ? "" : "s"}`
        : undefined,
    color: "bg-brand",
    border: "border-[#f0e8de]",
    bg: "bg-[#fbf7f2]",
    iconColor: "text-brand",
    icon: Layers,
  }));
  const realToday = prep.todayTasks.map((t) => ({
    id: t.id,
    title: t.title,
    subtitle: t.subtitle,
    duration: t.duration,
    href: t.href,
    icon: BookOpen,
    badge: "",
  }));

  return (
    <div className="flex w-full flex-col gap-8">
      {/* 1. Overview: welcome hero, prep areas, readiness and today's plan */}
      {/* No generated plan yet (e.g. generation failed during setup): offer to create it. */}
      {!isLoading && !activePlan && (
        <div className="flex flex-col gap-3 rounded-2xl border border-brand/30 bg-[#fff6f2] p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-display text-base font-extrabold text-ink">Your weekly plan isn&apos;t ready yet</p>
            <p className="text-[13px] text-ink-muted">
              Your topics below come from your setup. Generate your plan to get a week-by-week focus.
            </p>
          </div>
          <button
            type="button"
            disabled={isGeneratingPlan}
            onClick={async () => {
              setIsGeneratingPlan(true);
              try {
                await backendApi.generatePlan({});
                const res = await backendApi.getProfile();
                if (res.activePlan) setActivePlan(res.activePlan);
              } catch (err) {
                console.warn("Plan generation failed:", err);
              } finally {
                setIsGeneratingPlan(false);
              }
            }}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60 cursor-pointer"
          >
            {isGeneratingPlan ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
            {isGeneratingPlan ? "Generating…" : "Generate my plan"}
          </button>
        </div>
      )}

      <PrepHomeOverview
        displayRole={displayRole}
        displayTimeline={displayTimeline}
        // Always the candidate's own data; no hard-coded sample cards.
        daysRemaining={prep.daysRemaining}
        progressPercent={prep.readiness}
        completedTopics={prep.doneTopics}
        totalTopics={prep.totalTopics}
        areas={realAreas}
        today={realToday}
        onTaskToggle={(id, isDone) => prep.setTopicDone(id, isDone)}
        milestone={prep.milestone}
        loading={prep.loading}
        doneTodayIds={prep.doneTodayIds}
        weekProgress={prep.weekProgress}
        // Only the candidate's own target company; no "Google" fallback here.
        targetCompany={
          Array.isArray(targetCompanies) && targetCompanies.length > 0 ? String(targetCompanies[0]).trim() : ""
        }
        onEditSetup={onEditSetup}
        onReset={() => setShowResetModal(true)}
      />

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
