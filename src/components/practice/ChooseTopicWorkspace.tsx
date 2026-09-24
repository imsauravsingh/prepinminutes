"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  User,
  Calendar,
  TrendingUp,
  Sparkles,
  Clock,
  Database,
  Cloud,
  CodeXml,
  Users,
  Search,
  ChevronDown,
  Star,
  BarChart3,
  Network,
  Layers,
  Boxes,
  HardDrive,
  Code,
  Filter,
  Lightbulb,
  Check,
  ArrowRight,
  HelpCircle,
  SlidersHorizontal,
  X,
  type LucideIcon,
} from "lucide-react";

type AreaType = "system-design" | "cloud" | "coding" | "behavioral";
type StatusType =
  | "Needs Practice"
  | "Not Practiced"
  | "Practiced"
  | "In Progress";
type PriorityType = "High" | "Medium" | "Low";

interface Topic {
  id: string;
  area: AreaType;
  title: string;
  description: string;
  readiness: number;
  duration: number; // in minutes
  status: StatusType;
  priority: PriorityType;
  isStarred?: boolean;
  practiceHref: string;
  icon: LucideIcon;
}

const ALL_TOPICS: Topic[] = [
  // 1. System Design Topics (8 items matching design)
  {
    id: "sd-1",
    area: "system-design",
    title: "Scalability Fundamentals",
    description: "Scaling strategies, bottlenecks and trade-offs.",
    readiness: 42,
    duration: 15,
    status: "Needs Practice",
    priority: "High",
    isStarred: true,
    practiceHref: "/practice/session/system-design",
    icon: BarChart3,
  },
  {
    id: "sd-2",
    area: "system-design",
    title: "Load Balancing Strategies",
    description: "Load balancing algorithms and real-world use cases.",
    readiness: 58,
    duration: 10,
    status: "Not Practiced",
    priority: "Medium",
    practiceHref: "/practice/session/system-design",
    icon: Network,
  },
  {
    id: "sd-3",
    area: "system-design",
    title: "Database Sharding",
    description: "Partitioning data for scale and performance.",
    readiness: 35,
    duration: 20,
    status: "Needs Practice",
    priority: "High",
    practiceHref: "/practice/session/system-design",
    icon: Database,
  },
  {
    id: "sd-4",
    area: "system-design",
    title: "CAP Theorem",
    description: "Consistency, availability and partition tolerance.",
    readiness: 76,
    duration: 10,
    status: "Practiced",
    priority: "Low",
    practiceHref: "/practice/session/system-design",
    icon: Layers,
  },
  {
    id: "sd-5",
    area: "system-design",
    title: "Microservices Architecture",
    description: "Designing and scaling microservices systems.",
    readiness: 48,
    duration: 25,
    status: "Needs Practice",
    priority: "Medium",
    practiceHref: "/practice/session/system-design",
    icon: Boxes,
  },
  {
    id: "sd-6",
    area: "system-design",
    title: "Caching Strategies",
    description: "Caching, invalidation and distributed cache systems.",
    readiness: 28,
    duration: 15,
    status: "Not Practiced",
    priority: "High",
    practiceHref: "/practice/session/system-design",
    icon: HardDrive,
  },
  {
    id: "sd-7",
    area: "system-design",
    title: "Distributed Systems Trade-offs",
    description: "Trade-offs and real-world architecture decisions.",
    readiness: 40,
    duration: 20,
    status: "Not Practiced",
    priority: "Medium",
    practiceHref: "/practice/session/system-design",
    icon: Network,
  },
  {
    id: "sd-8",
    area: "system-design",
    title: "API Design Patterns",
    description: "Designing scalable and maintainable APIs.",
    readiness: 62,
    duration: 15,
    status: "Not Practiced",
    priority: "Low",
    practiceHref: "/practice/session/system-design",
    icon: Code,
  },

  // 2. AWS & Cloud Topics (5 items)
  {
    id: "cloud-1",
    area: "cloud",
    title: "Multi-Region VPC & High Availability",
    description: "VPC peering, transit gateways, Route 53 latency routing.",
    readiness: 67,
    duration: 12,
    status: "Needs Practice",
    priority: "High",
    isStarred: true,
    practiceHref: "/practice/session/cloud",
    icon: Cloud,
  },
  {
    id: "cloud-2",
    area: "cloud",
    title: "Kubernetes (EKS) & Auto-scaling",
    description: "HPA, Karpenter node provisioning, and pod disruption.",
    readiness: 72,
    duration: 15,
    status: "Not Practiced",
    priority: "Medium",
    practiceHref: "/practice/session/cloud",
    icon: Boxes,
  },
  {
    id: "cloud-3",
    area: "cloud",
    title: "Serverless Event-Driven Patterns",
    description: "Lambda functions, SQS queues, and idempotent workers.",
    readiness: 80,
    duration: 10,
    status: "Practiced",
    priority: "Low",
    practiceHref: "/practice/session/cloud",
    icon: Layers,
  },
  {
    id: "cloud-4",
    area: "cloud",
    title: "Cloud Data Sovereignty & GDPR",
    description: "Cross-region replication lag, data residency, zero-trust.",
    readiness: 55,
    duration: 20,
    status: "Needs Practice",
    priority: "High",
    practiceHref: "/practice/session/cloud",
    icon: Database,
  },
  {
    id: "cloud-5",
    area: "cloud",
    title: "FinOps & Cloud Cost Optimization",
    description: "Spot instances, reserved capacity, and elastic scaling.",
    readiness: 60,
    duration: 15,
    status: "Not Practiced",
    priority: "Medium",
    practiceHref: "/practice/session/cloud",
    icon: BarChart3,
  },

  // 3. Coding Patterns Topics (8 items)
  {
    id: "code-1",
    area: "coding",
    title: "Sliding Window Pattern",
    description: "Fixed and dynamic window techniques with O(n) runtime.",
    readiness: 78,
    duration: 10,
    status: "Practiced",
    priority: "High",
    isStarred: true,
    practiceHref: "/practice/session/coding",
    icon: CodeXml,
  },
  {
    id: "code-2",
    area: "coding",
    title: "Two Pointers & Fast/Slow",
    description:
      "Array cycle detection, palindromes, and interval intersections.",
    readiness: 82,
    duration: 12,
    status: "Practiced",
    priority: "Medium",
    practiceHref: "/practice/session/coding",
    icon: CodeXml,
  },
  {
    id: "code-3",
    area: "coding",
    title: "Monotonic Stack & Queue",
    description: "Next greater element, daily temperatures, histogram area.",
    readiness: 65,
    duration: 15,
    status: "Needs Practice",
    priority: "High",
    practiceHref: "/practice/session/coding",
    icon: Layers,
  },
  {
    id: "code-4",
    area: "coding",
    title: "Top K Frequent Elements (Heaps)",
    description: "Min/Max heap priority queues and streaming elements.",
    readiness: 70,
    duration: 15,
    status: "Not Practiced",
    priority: "Medium",
    practiceHref: "/practice/session/coding",
    icon: BarChart3,
  },
  {
    id: "code-5",
    area: "coding",
    title: "Dynamic Programming: Knapsack & Grid",
    description: "Memoization, tabulation, and state transition equations.",
    readiness: 50,
    duration: 25,
    status: "Needs Practice",
    priority: "High",
    practiceHref: "/practice/session/coding",
    icon: Boxes,
  },
  {
    id: "code-6",
    area: "coding",
    title: "Graph Traversal (BFS & DFS)",
    description: "Cycle detection, connected components, topological sorting.",
    readiness: 74,
    duration: 20,
    status: "Not Practiced",
    priority: "Medium",
    practiceHref: "/practice/session/coding",
    icon: Network,
  },
  {
    id: "code-7",
    area: "coding",
    title: "Binary Search on Answer Space",
    description: "Finding minimum capacity, split array largest sum.",
    readiness: 68,
    duration: 15,
    status: "Not Practiced",
    priority: "Medium",
    practiceHref: "/practice/session/coding",
    icon: Code,
  },
  {
    id: "code-8",
    area: "coding",
    title: "Trie & Prefix Tree Implementation",
    description: "Autocomplete, prefix matching, and word dictionary search.",
    readiness: 75,
    duration: 10,
    status: "Practiced",
    priority: "Low",
    practiceHref: "/practice/session/coding",
    icon: HardDrive,
  },

  // 4. Behavioral Topics (4 items)
  {
    id: "beh-1",
    area: "behavioral",
    title: "Leadership & Conflict Resolution",
    description: "Disagreeing constructively and driving team alignment.",
    readiness: 60,
    duration: 7,
    status: "Needs Practice",
    priority: "High",
    isStarred: true,
    practiceHref: "/practice/session/behavioral",
    icon: Users,
  },
  {
    id: "beh-2",
    area: "behavioral",
    title: "Delivering Under Ambiguity & Deadlines",
    description:
      "Navigating shifting requirements and prioritizing customer impact.",
    readiness: 85,
    duration: 10,
    status: "Practiced",
    priority: "High",
    practiceHref: "/practice/session/behavioral",
    icon: Clock,
  },
  {
    id: "beh-3",
    area: "behavioral",
    title: "Handling Technical Debt vs Velocity",
    description:
      "Negotiating tradeoffs between engineering rigor and product pace.",
    readiness: 70,
    duration: 10,
    status: "Not Practiced",
    priority: "Medium",
    practiceHref: "/practice/session/behavioral",
    icon: BarChart3,
  },
  {
    id: "beh-4",
    area: "behavioral",
    title: "Mentorship & Engineering Culture",
    description:
      "Fostering psychological safety and conducting effective code reviews.",
    readiness: 90,
    duration: 8,
    status: "Practiced",
    priority: "Low",
    practiceHref: "/practice/session/behavioral",
    icon: Star,
  },
];

const AREAS_CONFIG: {
  id: AreaType;
  name: string;
  readiness: number;
  topicCount: number;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  arrowColor: string;
  activeBorder: string;
  activeBg: string;
}[] = [
  {
    id: "system-design",
    name: "System Design",
    readiness: 32,
    topicCount: 8,
    icon: Database,
    iconBg: "bg-[#fff0ec]",
    iconColor: "text-[#ff6c47]",
    arrowColor: "text-[#ff6c47]",
    activeBorder: "border-[#ff6c47]",
    activeBg: "bg-[#fffaf8]",
  },
  {
    id: "cloud",
    name: "AWS & Cloud",
    readiness: 67,
    topicCount: 5,
    icon: Cloud,
    iconBg: "bg-[#eff6ff]",
    iconColor: "text-[#2563eb]",
    arrowColor: "text-[#2563eb]",
    activeBorder: "border-[#2563eb]",
    activeBg: "bg-[#f8faff]",
  },
  {
    id: "coding",
    name: "Coding Patterns",
    readiness: 78,
    topicCount: 8,
    icon: CodeXml,
    iconBg: "bg-[#edf7f4]",
    iconColor: "text-[#0b8a8f]",
    arrowColor: "text-[#0b8a8f]",
    activeBorder: "border-[#0b8a8f]",
    activeBg: "bg-[#f7fbf9]",
  },
  {
    id: "behavioral",
    name: "Behavioral",
    readiness: 91,
    topicCount: 4,
    icon: Users,
    iconBg: "bg-[#f5f3ff]",
    iconColor: "text-[#8b5cf6]",
    arrowColor: "text-[#8b5cf6]",
    activeBorder: "border-[#8b5cf6]",
    activeBg: "bg-[#faf8ff]",
  },
];

export function ChooseTopicWorkspace() {
  const [selectedArea, setSelectedArea] = useState<AreaType>("system-design");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedTime, setSelectedTime] = useState<string>("all");
  const [selectedPriority, setSelectedPriority] = useState<string>("all");
  const [sortFilter, setSortFilter] = useState<string>("all");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [whyTooltipOpen, setWhyTooltipOpen] = useState(false);

  // Selected area info
  const currentAreaInfo = useMemo(() => {
    return AREAS_CONFIG.find((a) => a.id === selectedArea) || AREAS_CONFIG[0];
  }, [selectedArea]);

  // Topics belonging to current area
  const areaTopics = useMemo(() => {
    return ALL_TOPICS.filter((t) => t.area === selectedArea);
  }, [selectedArea]);

  // Counts for filter checkboxes based on current area
  const filterCounts = useMemo(() => {
    return {
      status: {
        notPracticed: areaTopics.filter((t) => t.status === "Not Practiced")
          .length,
        needsPractice: areaTopics.filter((t) => t.status === "Needs Practice")
          .length,
        inProgress: areaTopics.filter((t) => t.status === "In Progress").length,
        practiced: areaTopics.filter((t) => t.status === "Practiced").length,
      },
      time: {
        under10: areaTopics.filter((t) => t.duration <= 10).length,
        between10And20: areaTopics.filter(
          (t) => t.duration > 10 && t.duration <= 20,
        ).length,
        over20: areaTopics.filter((t) => t.duration >= 20).length,
      },
      priority: {
        high: areaTopics.filter((t) => t.priority === "High").length,
        medium: areaTopics.filter((t) => t.priority === "Medium").length,
        low: areaTopics.filter((t) => t.priority === "Low").length,
      },
    };
  }, [areaTopics]);

  // Filtered topic list
  const filteredTopics = useMemo(() => {
    return areaTopics
      .filter((topic) => {
        // Search query
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          const matchTitle = topic.title.toLowerCase().includes(query);
          const matchDesc = topic.description.toLowerCase().includes(query);
          if (!matchTitle && !matchDesc) return false;
        }

        // Status
        if (selectedStatus !== "all" && topic.status !== selectedStatus) {
          return false;
        }

        // Time
        if (selectedTime === "<=10" && topic.duration > 10) return false;
        if (
          selectedTime === "10-20" &&
          (topic.duration <= 10 || topic.duration > 20)
        ) {
          return false;
        }
        if (selectedTime === ">=20" && topic.duration < 20) return false;

        // Priority
        if (selectedPriority !== "all" && topic.priority !== selectedPriority) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortFilter === "high") {
          const priorityOrder: Record<PriorityType, number> = {
            High: 0,
            Medium: 1,
            Low: 2,
          };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        if (sortFilter === "readiness-asc") {
          return a.readiness - b.readiness;
        }
        if (sortFilter === "readiness-desc") {
          return b.readiness - a.readiness;
        }
        return 0;
      });
  }, [
    areaTopics,
    searchQuery,
    selectedStatus,
    selectedTime,
    selectedPriority,
    sortFilter,
  ]);

  return (
    <div className="flex w-full flex-col gap-6 sm:gap-8 max-w-[1400px] mx-auto pb-12">
      {/* 1. Top Header Row matching design */}
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
        {/* Left: Eyebrow + Title + Subtitle + Meta Info Bar */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-extrabold uppercase tracking-wider text-brand">
            PRACTICE
          </span>
          <h1 className="font-display text-2xl font-extrabold text-ink sm:text-3xl lg:text-[34px] leading-tight">
            Choose a Topic
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
            Practice what matters most. Pick a topic and start practicing with
            AI-powered feedback.
          </p>

          {/* Candidate Meta Bar */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-1 text-xs text-ink-muted">
            <div className="flex items-center gap-1.5 font-medium text-ink">
              <User className="size-3.5 text-ink-muted" />
              <span>Senior Software Engineer</span>
            </div>
            <span className="text-line">•</span>
            <div className="flex items-center gap-1.5 font-medium text-ink">
              <span className="font-bold text-[#4285F4]">G</span>
              <span>Google</span>
            </div>
            <span className="text-line">•</span>
            <div className="flex items-center gap-1.5 font-medium text-ink-muted">
              <Calendar className="size-3.5 text-ink-muted" />
              <span>Interview in 12 days</span>
            </div>
          </div>
        </div>

        {/* Right: Overall Readiness Widget */}
        <div className="flex items-center gap-3.5 rounded-2xl border border-line bg-white p-3.5 sm:px-5 sm:py-3.5 shadow-xs shrink-0 self-start sm:self-auto">
          {/* Circular SVG Gauge 68% */}
          <div className="relative flex size-12 sm:size-14 shrink-0 items-center justify-center">
            <svg className="size-full -rotate-90" viewBox="0 0 52 52">
              <circle
                cx="26"
                cy="26"
                r="21"
                stroke="#f4efe8"
                strokeWidth="4"
                fill="none"
              />
              <circle
                cx="26"
                cy="26"
                r="21"
                stroke="#ff6c47"
                strokeWidth="4"
                strokeDasharray={132}
                strokeDashoffset={42} // 68%
                strokeLinecap="round"
                fill="none"
              />
            </svg>
            <span className="absolute font-bold text-xs sm:text-sm text-ink">
              68%
            </span>
          </div>

          <div className="flex flex-col gap-0.5">
            <span className="font-display font-bold text-xs sm:text-sm text-ink">
              Overall Readiness
            </span>
            <div className="flex items-center gap-1 text-[11px] text-ink-muted">
              <span>Updated after your latest practice</span>
              <TrendingUp className="size-3 text-[#10b981]" />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Two-Column Layout (Main Content + Right Sidebar) */}
      <div className="flex flex-col lg:flex-row items-start gap-6 sm:gap-7 w-full">
        {/* LEFT COLUMN: Hero Recommendation + Choose by Area + Topics Table */}
        <div className="flex flex-1 flex-col gap-6 sm:gap-7 w-full min-w-0">
          {/* Hero Card: "Recommended for you" */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 rounded-3xl border border-[#ffd8cc] bg-gradient-to-r from-[#fff7f4] via-[#fffbf9] to-white p-5 sm:p-6 shadow-[0_4px_20px_rgba(255,108,71,0.06)] relative overflow-hidden">
            {/* Mascot Visual */}
            <div className="relative size-24 sm:size-28 shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-[#fff5f0] to-[#ffe8de] flex items-center justify-center border border-[#fed7aa]/50 shadow-inner">
              <Image
                src="/images/dashboard/assessment-hero-card.png"
                alt="AI Practice Coach"
                width={280}
                height={140}
                className="max-w-none absolute -left-2 sm:-left-3 top-1/2 -translate-y-1/2 h-[135%] w-auto object-cover select-none pointer-events-none"
              />
            </div>

            {/* Middle Info */}
            <div className="flex flex-1 flex-col gap-2 min-w-0">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-[#fef3c7] px-2.5 py-0.5 text-[11px] font-bold text-[#b45309] w-fit">
                <Sparkles className="size-3 text-[#d97706]" />
                <span>Recommended for you</span>
              </div>

              <h2 className="font-display text-lg sm:text-xl font-extrabold text-ink">
                Scalability Fundamentals
              </h2>

              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-md bg-[#fff0ec] px-2 py-0.5 font-bold text-brand">
                  System Design
                </span>
                <span className="inline-flex items-center gap-1 rounded-md bg-[#fef2f2] px-2 py-0.5 font-bold text-[#ef4444]">
                  <span className="text-[10px]">❖</span>
                  <span>High Priority</span>
                </span>
                <span className="inline-flex items-center gap-1 font-medium text-ink-muted">
                  <Clock className="size-3 text-ink-muted" />
                  <span>15 min</span>
                </span>
              </div>

              <p className="text-xs text-ink-muted leading-relaxed">
                Your readiness is 42%. This is a high-impact topic in your
                current phase (Foundation Building). Practicing now will
                strengthen multiple related topics.
              </p>
            </div>

            {/* Right Metric & CTA */}
            <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 w-full sm:w-auto shrink-0 border-t border-[#f4efe8] sm:border-t-0 pt-3 sm:pt-0">
              <div className="flex flex-col items-start sm:items-end gap-1">
                <div className="flex items-baseline gap-1.5">
                  <span className="font-display text-2xl font-extrabold text-ink">
                    42%
                  </span>
                  <span className="text-xs text-ink-muted font-medium">
                    Your readiness
                  </span>
                </div>
                <div className="h-1.5 w-28 overflow-hidden rounded-full bg-[#ede6db]">
                  <div
                    className="h-full bg-brand rounded-full transition-all duration-300"
                    style={{ width: "42%" }}
                  />
                </div>
              </div>

              <Link
                href="/practice/session/system-design"
                className="inline-flex items-center justify-center rounded-full bg-brand px-6 py-2.5 text-xs font-bold text-white shadow-[0_4px_12px_rgba(255,108,71,0.25)] transition-all hover:opacity-95 active:scale-95 whitespace-nowrap"
              >
                Start Practice →
              </Link>
            </div>
          </div>

          {/* Section: Choose by Area */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-0.5">
              <h2 className="font-display text-base sm:text-lg font-extrabold text-ink">
                Choose by Area
              </h2>
              <p className="text-xs text-ink-muted">
                Select an area to see relevant topics based on your preparation
                plan.
              </p>
            </div>

            {/* 4 Area Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {AREAS_CONFIG.map((area) => {
                const isSelected = selectedArea === area.id;
                const IconComponent = area.icon;

                return (
                  <button
                    key={area.id}
                    type="button"
                    onClick={() => {
                      setSelectedArea(area.id);
                      setSelectedStatus("all");
                      setSelectedTime("all");
                      setSelectedPriority("all");
                    }}
                    className={`flex items-center justify-between p-4 rounded-2xl border text-left transition-all relative overflow-hidden ${
                      isSelected
                        ? `border-2 ${area.activeBorder} ${area.activeBg} shadow-sm ring-2 ring-brand/10`
                        : "border-line bg-white hover:border-[#b0a898]/40 hover:bg-[#faf6f0]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${area.iconBg} ${area.iconColor}`}
                      >
                        <IconComponent className="size-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-display text-xs sm:text-[13px] font-bold text-ink">
                          {area.name}
                        </span>
                        <div className="flex items-center gap-1 text-[11px] text-ink-muted">
                          <span className="font-bold text-ink">
                            {area.readiness}%
                          </span>
                          <span>Ready</span>
                        </div>
                        <span className="text-[11px] text-ink-muted mt-0.5">
                          {area.topicCount} topics
                        </span>
                      </div>
                    </div>

                    <ArrowRight
                      className={`size-4 shrink-0 transition-transform ${
                        isSelected
                          ? `${area.arrowColor} translate-x-0.5`
                          : "text-ink-muted"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section: Dynamic Topic List */}
          <div className="flex flex-col gap-3.5">
            <div className="flex flex-col gap-0.5">
              <h2 className="font-display text-base sm:text-lg font-extrabold text-ink">
                {currentAreaInfo.name} Topics
              </h2>
              <p className="text-xs text-ink-muted">
                Practice specific topics with AI feedback. Topics are
                prioritized based on your preparation plan.
              </p>
            </div>

            {/* Search Bar & Dropdown Controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="size-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search topics..."
                  className="w-full rounded-xl border border-line bg-white pl-10 pr-4 py-2.5 text-xs text-ink outline-none transition-colors focus:border-brand"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink"
                  >
                    <X className="size-3.5" />
                  </button>
                )}
              </div>

              {/* Sort/Filter Dropdown & Mobile Filter Button */}
              <div className="flex items-center gap-2">
                {/* Mobile Filter Toggle Button */}
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                  className="lg:hidden flex items-center gap-1.5 rounded-xl border border-line bg-white px-3.5 py-2.5 text-xs font-semibold text-ink shadow-2xs hover:bg-[#faf6f0]"
                >
                  <SlidersHorizontal className="size-3.5 text-brand" />
                  <span>Filters</span>
                </button>

                {/* Dropdown Selector */}
                <div className="relative">
                  <select
                    value={sortFilter}
                    onChange={(e) => setSortFilter(e.target.value)}
                    aria-label="Filter topics list"
                    className="appearance-none rounded-xl border border-line bg-white pl-3.5 pr-8 py-2.5 text-xs font-semibold text-ink outline-none cursor-pointer hover:bg-[#faf6f0] transition-colors"
                  >
                    <option value="all">All Topics</option>
                    <option value="high">High Priority First</option>
                    <option value="readiness-asc">
                      Lowest Readiness First
                    </option>
                    <option value="readiness-desc">
                      Highest Readiness First
                    </option>
                  </select>
                  <ChevronDown className="size-3.5 text-ink-muted absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Mobile Expanded Filters Panel */}
            {mobileFilterOpen && (
              <div className="lg:hidden flex flex-col gap-4 rounded-2xl border border-line bg-white p-4 shadow-sm animate-in fade-in">
                <div className="flex items-center justify-between pb-2 border-b border-line">
                  <span className="font-display font-bold text-xs text-ink uppercase tracking-wider">
                    Quick Filters
                  </span>
                  <button
                    type="button"
                    onClick={() => setMobileFilterOpen(false)}
                    className="text-ink-muted hover:text-ink text-xs font-semibold"
                  >
                    Close
                  </button>
                </div>

                {/* Status Chips */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-[11px] font-bold text-ink-muted uppercase">
                    Status
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      "all",
                      "Needs Practice",
                      "Not Practiced",
                      "Practiced",
                    ].map((status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => setSelectedStatus(status)}
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold transition-colors ${
                          selectedStatus === status
                            ? "bg-brand text-white"
                            : "bg-[#f4efe8] text-ink hover:bg-[#eae3d8]"
                        }`}
                      >
                        {status === "all" ? "All" : status}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Priority Chips */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-[11px] font-bold text-ink-muted uppercase">
                    Priority
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {["all", "High", "Medium", "Low"].map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setSelectedPriority(p)}
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold transition-colors ${
                          selectedPriority === p
                            ? "bg-brand text-white"
                            : "bg-[#f4efe8] text-ink hover:bg-[#eae3d8]"
                        }`}
                      >
                        {p === "all" ? "All" : p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Topic Cards Rows Stack */}
            <div className="flex flex-col gap-2.5">
              {filteredTopics.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-line bg-white p-12 text-center">
                  <Search className="size-8 text-ink-muted mb-2 opacity-50" />
                  <p className="font-display font-bold text-sm text-ink">
                    No topics found
                  </p>
                  <p className="text-xs text-ink-muted mt-1">
                    Try adjusting your search query or practice filters.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedStatus("all");
                      setSelectedTime("all");
                      setSelectedPriority("all");
                    }}
                    className="mt-4 rounded-full bg-brand px-4 py-2 text-xs font-semibold text-white hover:opacity-90"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                filteredTopics.map((topic) => {
                  const TopicIcon = topic.icon;

                  return (
                    <div
                      key={topic.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 rounded-2xl border border-line bg-white p-3.5 sm:px-5 sm:py-3.5 shadow-2xs hover:border-[#b0a898]/40 hover:shadow-xs transition-all"
                    >
                      {/* Left: Icon + Title & Description */}
                      <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#eff6ff] text-[#2563eb]">
                          <TopicIcon className="size-5" />
                        </div>

                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-display font-bold text-xs sm:text-sm text-ink truncate">
                              {topic.title}
                            </span>
                            {topic.isStarred && (
                              <Star className="size-3.5 fill-amber-400 text-amber-400 shrink-0" />
                            )}
                          </div>
                          <span className="text-xs text-ink-muted line-clamp-1">
                            {topic.description}
                          </span>
                        </div>
                      </div>

                      {/* Right Meta Stack: Readiness + Duration + Status Badge + Action CTA */}
                      <div className="flex flex-wrap sm:flex-nowrap items-center justify-between sm:justify-end gap-3 sm:gap-4 shrink-0 border-t border-line/50 sm:border-t-0 pt-2 sm:pt-0">
                        {/* Readiness & Mini Progress Bar */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-ink w-8 text-right">
                            {topic.readiness}%
                          </span>
                          <div className="h-1.5 w-14 overflow-hidden rounded-full bg-[#ede6db]">
                            <div
                              className={`h-full rounded-full ${
                                topic.readiness >= 70
                                  ? "bg-[#10b981]"
                                  : topic.readiness >= 45
                                    ? "bg-[#f59e0b]"
                                    : "bg-[#ff6c47]"
                              }`}
                              style={{ width: `${topic.readiness}%` }}
                            />
                          </div>
                        </div>

                        {/* Duration */}
                        <div className="flex items-center gap-1 text-xs text-ink-muted w-14">
                          <Clock className="size-3.5 text-ink-muted shrink-0" />
                          <span>{topic.duration} min</span>
                        </div>

                        {/* Status Badge */}
                        <div className="w-24 flex justify-start sm:justify-center">
                          {topic.status === "Needs Practice" && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-[#fff0ec] px-2.5 py-0.5 text-[11px] font-semibold text-[#ef4444] border border-[#fecaca]">
                              <span className="size-1.5 rounded-full bg-[#ef4444]" />
                              <span>Needs Practice</span>
                            </span>
                          )}
                          {topic.status === "Not Practiced" && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-[#eff6ff] px-2.5 py-0.5 text-[11px] font-semibold text-[#3b82f6] border border-[#dbeafe]">
                              <span className="size-1.5 rounded-full bg-[#3b82f6]" />
                              <span>Not Practiced</span>
                            </span>
                          )}
                          {topic.status === "Practiced" && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-[#edf5ec] px-2.5 py-0.5 text-[11px] font-semibold text-[#10b981] border border-[#d1fae5]">
                              <Check className="size-3 text-[#10b981] stroke-[2.5]" />
                              <span>Practiced</span>
                            </span>
                          )}
                          {topic.status === "In Progress" && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-[#fef3c7] px-2.5 py-0.5 text-[11px] font-semibold text-[#d97706] border border-[#fde68a]">
                              <span className="size-1.5 rounded-full bg-[#d97706] animate-pulse" />
                              <span>In Progress</span>
                            </span>
                          )}
                        </div>

                        {/* Practice Button */}
                        <Link
                          href={topic.practiceHref}
                          className="flex items-center justify-center gap-1 rounded-full border border-line bg-white px-4 py-1.5 text-xs font-semibold text-ink shadow-2xs hover:border-brand hover:text-brand hover:bg-[#fff9f7] transition-all whitespace-nowrap ml-auto sm:ml-0"
                        >
                          <span>Practice</span>
                          <ArrowRight className="size-3" />
                        </Link>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Current Phase + Practice Filters + Practice Adapts (Sticky) */}
        <div className="w-full lg:w-[320px] shrink-0 flex flex-col gap-5">
          {/* Card 1: Current Phase */}
          <div className="flex flex-col gap-4 rounded-3xl border border-line bg-white p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
                Current Phase
              </span>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setWhyTooltipOpen(!whyTooltipOpen)}
                  className="flex items-center gap-1 text-[11px] font-semibold text-[#2563eb] hover:underline"
                >
                  <HelpCircle className="size-3 text-[#2563eb]" />
                  <span>Why this topic?</span>
                </button>
                {whyTooltipOpen && (
                  <div className="absolute right-0 top-6 z-20 w-64 rounded-xl border border-line bg-white p-3 text-xs text-ink-muted shadow-lg animate-in fade-in">
                    <p className="font-semibold text-ink mb-1">
                      Adaptive Phase Sequencing
                    </p>
                    <p className="leading-relaxed">
                      Foundation building focuses on core architectural building
                      blocks first so complex scenarios become intuitive.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#fff0ec] text-brand border border-[#ffd8cc]">
                <Calendar className="size-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-extrabold text-sm text-ink">
                  Days 1-4
                </span>
                <span className="font-bold text-xs text-ink">
                  Foundation Building
                </span>
                <span className="text-[11px] text-ink-muted mt-0.5">
                  Focus on core concepts and basics.
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 pt-1">
              <div className="flex items-center justify-between text-xs font-semibold text-ink">
                <span>6 / 10 topics completed</span>
                <span className="font-bold text-brand">60%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#ede6db]">
                <div
                  className="h-full bg-brand rounded-full transition-all duration-300"
                  style={{ width: "60%" }}
                />
              </div>
            </div>

            <Link
              href="/preparation-plan"
              className="mt-1 flex items-center justify-center gap-1.5 rounded-full border border-[#2563eb] bg-white py-2 text-xs font-bold text-[#2563eb] hover:bg-[#eff6ff] transition-colors"
            >
              <span>View full timeline</span>
              <ArrowRight className="size-3" />
            </Link>
          </div>

          {/* Card 2: Practice Filters (Desktop) */}
          <div className="hidden lg:flex flex-col gap-4 rounded-3xl border border-line bg-white p-5 sm:p-6 shadow-xs">
            <div className="flex items-center gap-2 pb-1 border-b border-line">
              <Filter className="size-4 text-brand" />
              <h3 className="font-display font-bold text-sm text-ink">
                Practice Filters
              </h3>
            </div>

            {/* Filter Group: Status */}
            <div className="flex flex-col gap-2.5">
              <span className="text-xs font-bold text-ink">Status</span>
              <div className="flex flex-col gap-2 text-xs">
                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="statusFilter"
                      checked={selectedStatus === "all"}
                      onChange={() => setSelectedStatus("all")}
                      className="size-3.5 accent-[#ff6c47]"
                    />
                    <span className="text-ink group-hover:text-brand font-medium">
                      All Topics
                    </span>
                  </div>
                </label>

                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="statusFilter"
                      checked={selectedStatus === "Not Practiced"}
                      onChange={() => setSelectedStatus("Not Practiced")}
                      className="size-3.5 accent-[#ff6c47]"
                    />
                    <span className="text-ink-muted group-hover:text-ink">
                      Not Practiced
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-ink-muted">
                    {filterCounts.status.notPracticed}
                  </span>
                </label>

                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="statusFilter"
                      checked={selectedStatus === "Needs Practice"}
                      onChange={() => setSelectedStatus("Needs Practice")}
                      className="size-3.5 accent-[#ff6c47]"
                    />
                    <span className="text-ink-muted group-hover:text-ink">
                      Needs Practice
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-ink-muted">
                    {filterCounts.status.needsPractice}
                  </span>
                </label>

                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="statusFilter"
                      checked={selectedStatus === "In Progress"}
                      onChange={() => setSelectedStatus("In Progress")}
                      className="size-3.5 accent-[#ff6c47]"
                    />
                    <span className="text-ink-muted group-hover:text-ink">
                      In Progress
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-ink-muted">
                    {filterCounts.status.inProgress}
                  </span>
                </label>

                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="statusFilter"
                      checked={selectedStatus === "Practiced"}
                      onChange={() => setSelectedStatus("Practiced")}
                      className="size-3.5 accent-[#ff6c47]"
                    />
                    <span className="text-ink-muted group-hover:text-ink">
                      Practiced
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-ink-muted">
                    {filterCounts.status.practiced}
                  </span>
                </label>
              </div>
            </div>

            {/* Filter Group: Time Required */}
            <div className="flex flex-col gap-2.5 pt-2 border-t border-line">
              <span className="text-xs font-bold text-ink">Time Required</span>
              <div className="flex flex-col gap-2 text-xs">
                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="timeFilter"
                      checked={selectedTime === "all"}
                      onChange={() => setSelectedTime("all")}
                      className="size-3.5 accent-[#ff6c47]"
                    />
                    <span className="text-ink group-hover:text-brand font-medium">
                      All
                    </span>
                  </div>
                </label>

                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="timeFilter"
                      checked={selectedTime === "<=10"}
                      onChange={() => setSelectedTime("<=10")}
                      className="size-3.5 accent-[#ff6c47]"
                    />
                    <span className="text-ink-muted group-hover:text-ink">
                      ≤ 10 min
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-ink-muted">
                    {filterCounts.time.under10}
                  </span>
                </label>

                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="timeFilter"
                      checked={selectedTime === "10-20"}
                      onChange={() => setSelectedTime("10-20")}
                      className="size-3.5 accent-[#ff6c47]"
                    />
                    <span className="text-ink-muted group-hover:text-ink">
                      10 – 20 min
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-ink-muted">
                    {filterCounts.time.between10And20}
                  </span>
                </label>

                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="timeFilter"
                      checked={selectedTime === ">=20"}
                      onChange={() => setSelectedTime(">=20")}
                      className="size-3.5 accent-[#ff6c47]"
                    />
                    <span className="text-ink-muted group-hover:text-ink">
                      ≥ 20 min
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-ink-muted">
                    {filterCounts.time.over20}
                  </span>
                </label>
              </div>
            </div>

            {/* Filter Group: Priority */}
            <div className="flex flex-col gap-2.5 pt-2 border-t border-line">
              <span className="text-xs font-bold text-ink">Priority</span>
              <div className="flex flex-col gap-2 text-xs">
                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="priorityFilter"
                      checked={selectedPriority === "all"}
                      onChange={() => setSelectedPriority("all")}
                      className="size-3.5 accent-[#ff6c47]"
                    />
                    <span className="text-ink group-hover:text-brand font-medium">
                      All
                    </span>
                  </div>
                </label>

                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="priorityFilter"
                      checked={selectedPriority === "High"}
                      onChange={() => setSelectedPriority("High")}
                      className="size-3.5 accent-[#ff6c47]"
                    />
                    <span className="text-ink-muted group-hover:text-ink">
                      High
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-ink-muted">
                    {filterCounts.priority.high}
                  </span>
                </label>

                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="priorityFilter"
                      checked={selectedPriority === "Medium"}
                      onChange={() => setSelectedPriority("Medium")}
                      className="size-3.5 accent-[#ff6c47]"
                    />
                    <span className="text-ink-muted group-hover:text-ink">
                      Medium
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-ink-muted">
                    {filterCounts.priority.medium}
                  </span>
                </label>

                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="priorityFilter"
                      checked={selectedPriority === "Low"}
                      onChange={() => setSelectedPriority("Low")}
                      className="size-3.5 accent-[#ff6c47]"
                    />
                    <span className="text-ink-muted group-hover:text-ink">
                      Low
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-ink-muted">
                    {filterCounts.priority.low}
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Card 3: "Your practice adapts" */}
          <div className="flex items-start gap-3 rounded-2xl border border-[#dbeafe] bg-[#eff6ff] p-4 text-xs">
            <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#2563eb] text-white">
              <Lightbulb className="size-4" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-display font-bold text-xs text-[#1e3a8a]">
                Your practice adapts
              </span>
              <p className="text-[11px] leading-relaxed text-[#3b82f6]">
                As you complete topics, we&apos;ll recommend the next best
                topics for maximum improvement.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
