"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  User,
  Calendar,
  TrendingUp,
  Clock,
  Database,
  Cloud,
  CodeXml,
  Users,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
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
  Cpu,
  Binary,
  Server,
  Layout,
  Smartphone,
  BookOpen,
  Flame,
  LayoutGrid,
  ListFilter,
  type LucideIcon,
} from "lucide-react";
import { useCurriculum } from "@/hooks/useCurriculum";
import { getPracticeSessionUrl } from "@/lib/practice-router";

type AreaType =
  | "system-design"
  | "ai-system-design"
  | "low-level-design"
  | "dsa"
  | "backend-engineering"
  | "frontend-engineering"
  | "cloud-devops"
  | "behavioral-leadership"
  | "data-engineering"
  | "mobile-engineering"
  | string;
type StatusType =
  | "Needs Practice"
  | "Not Practiced"
  | "Practiced"
  | "In Progress";
type PriorityType = "High" | "Medium" | "Low";

export interface DomainVisualMeta {
  shortName: string;
  icon: LucideIcon;
  badgeBg: string;
  badgeColor: string;
  activeRing: string;
  activeBorder: string;
}

export const DOMAIN_VISUAL_MAP: Record<string, DomainVisualMeta> = {
  "system-design": {
    shortName: "System Design",
    icon: Network,
    badgeBg: "bg-blue-500/10",
    badgeColor: "text-blue-600",
    activeRing: "ring-blue-500",
    activeBorder: "border-blue-500",
  },
  "ai-system-design": {
    shortName: "AI System Design",
    icon: Cpu,
    badgeBg: "bg-purple-500/10",
    badgeColor: "text-purple-600",
    activeRing: "ring-purple-500",
    activeBorder: "border-purple-500",
  },
  "low-level-design": {
    shortName: "Low-Level Design",
    icon: Boxes,
    badgeBg: "bg-emerald-500/10",
    badgeColor: "text-emerald-600",
    activeRing: "ring-emerald-500",
    activeBorder: "border-emerald-500",
  },
  "dsa": {
    shortName: "DSA & Algorithms",
    icon: Binary,
    badgeBg: "bg-amber-500/10",
    badgeColor: "text-amber-600",
    activeRing: "ring-amber-500",
    activeBorder: "border-amber-500",
  },
  "backend-engineering": {
    shortName: "Backend",
    icon: Server,
    badgeBg: "bg-cyan-500/10",
    badgeColor: "text-cyan-600",
    activeRing: "ring-cyan-500",
    activeBorder: "border-cyan-500",
  },
  "frontend-engineering": {
    shortName: "Frontend",
    icon: Layout,
    badgeBg: "bg-rose-500/10",
    badgeColor: "text-rose-600",
    activeRing: "ring-rose-500",
    activeBorder: "border-rose-500",
  },
  "cloud-devops": {
    shortName: "Cloud & DevOps",
    icon: Cloud,
    badgeBg: "bg-indigo-500/10",
    badgeColor: "text-indigo-600",
    activeRing: "ring-indigo-500",
    activeBorder: "border-indigo-500",
  },
  "behavioral-leadership": {
    shortName: "Behavioral",
    icon: Users,
    badgeBg: "bg-orange-500/10",
    badgeColor: "text-orange-600",
    activeRing: "ring-orange-500",
    activeBorder: "border-orange-500",
  },
  "data-engineering": {
    shortName: "Data Engineering",
    icon: Database,
    badgeBg: "bg-teal-500/10",
    badgeColor: "text-teal-600",
    activeRing: "ring-teal-500",
    activeBorder: "border-teal-500",
  },
  "mobile-engineering": {
    shortName: "Mobile",
    icon: Smartphone,
    badgeBg: "bg-violet-500/10",
    badgeColor: "text-violet-600",
    activeRing: "ring-violet-500",
    activeBorder: "border-violet-500",
  },
};

export interface Topic {
  id: string;
  slug?: string;
  topicId?: string;
  area: AreaType;
  title: string;
  description: string;
  pillar?: string;
  categoryName?: string;
  categorySlug?: string;
  readiness: number;
  duration: number; // in minutes
  status: StatusType;
  priority: PriorityType | "P0" | "P1";
  difficulty?: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT";
  trend?: "SURGING" | "HOT" | "STABLE" | "COOLING";
  rubricAtomsCount?: number;
  questionsCount?: number;
  isStarred?: boolean;
  practiceHref: string;
  icon: LucideIcon;
}

export interface CategoryGroup {
  slug: string;
  name: string;
  pillar: string;
  sortOrder: number;
  topicsCount: number;
  topics: Topic[];
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
  {
    id: "sd-9",
    area: "system-design",
    title: "Message Queues & Event Streaming",
    description: "Kafka vs RabbitMQ, partitioned logs, pub/sub and consumer lag.",
    readiness: 45,
    duration: 15,
    status: "Needs Practice",
    priority: "High",
    practiceHref: "/practice/session/system-design",
    icon: Layers,
  },
  {
    id: "sd-10",
    area: "system-design",
    title: "Consistent Hashing & DHT",
    description: "Dynamo style ring hashing, virtual nodes and hash rebalancing.",
    readiness: 70,
    duration: 12,
    status: "Practiced",
    priority: "Medium",
    practiceHref: "/practice/session/system-design",
    icon: Database,
  },
  {
    id: "sd-11",
    area: "system-design",
    title: "Rate Limiting & Throttling",
    description: "Token bucket, leaky bucket, sliding window log algorithms.",
    readiness: 55,
    duration: 12,
    status: "In Progress",
    priority: "High",
    practiceHref: "/practice/session/system-design",
    icon: Network,
  },
  {
    id: "sd-12",
    area: "system-design",
    title: "Distributed Consensus & Raft",
    description: "Leader election, log replication, safety guarantees and Paxos.",
    readiness: 30,
    duration: 25,
    status: "Not Practiced",
    priority: "High",
    practiceHref: "/practice/session/system-design",
    icon: Boxes,
  },
  {
    id: "sd-13",
    area: "system-design",
    title: "Content Delivery Networks (CDN)",
    description: "Edge caching, POP architecture, cache invalidation and anycast.",
    readiness: 82,
    duration: 10,
    status: "Practiced",
    priority: "Low",
    practiceHref: "/practice/session/system-design",
    icon: HardDrive,
  },
  {
    id: "sd-14",
    area: "system-design",
    title: "Search Indexing & Elasticsearch",
    description: "Inverted indexes, document scoring, Lucene segments and sharding.",
    readiness: 38,
    duration: 20,
    status: "Needs Practice",
    priority: "Medium",
    practiceHref: "/practice/session/system-design",
    icon: Database,
  },
  {
    id: "sd-15",
    area: "system-design",
    title: "SQL vs NoSQL Trade-offs",
    description: "ACID vs BASE, column families, document stores, key-value models.",
    readiness: 65,
    duration: 15,
    status: "Practiced",
    priority: "Medium",
    practiceHref: "/practice/session/system-design",
    icon: Database,
  },
  {
    id: "sd-16",
    area: "system-design",
    title: "Resiliency & Circuit Breakers",
    description: "Fault isolation, bulkheads, fallback policies, exponential jitter.",
    readiness: 52,
    duration: 15,
    status: "Not Practiced",
    priority: "High",
    practiceHref: "/practice/session/system-design",
    icon: Network,
  },
  {
    id: "sd-17",
    area: "system-design",
    title: "Distributed Transactions & Sagas",
    description: "Two-phase commits, saga orchestrators, compensating actions.",
    readiness: 25,
    duration: 25,
    status: "Needs Practice",
    priority: "High",
    practiceHref: "/practice/session/system-design",
    icon: Boxes,
  },
  {
    id: "sd-18",
    area: "system-design",
    title: "Real-Time WebSockets & SSE",
    description: "Stateful connections, presence detection, socket gateway clusters.",
    readiness: 60,
    duration: 12,
    status: "In Progress",
    priority: "Medium",
    practiceHref: "/practice/session/system-design",
    icon: Network,
  },
  {
    id: "sd-19",
    area: "system-design",
    title: "Unique ID Generation at Scale",
    description: "Twitter Snowflake, UUIDv7, timestamp ordering and high throughput.",
    readiness: 75,
    duration: 10,
    status: "Practiced",
    priority: "Low",
    practiceHref: "/practice/session/system-design",
    icon: Code,
  },
  {
    id: "sd-20",
    area: "system-design",
    title: "Data Lake & Batch Processing",
    description: "MapReduce paradigms, Parquet columnar storage, streaming ETL.",
    readiness: 34,
    duration: 20,
    status: "Not Practiced",
    priority: "Medium",
    practiceHref: "/practice/session/system-design",
    icon: HardDrive,
  },
  {
    id: "sd-21",
    area: "system-design",
    title: "Disaster Recovery & Geo-Replication",
    description: "Multi-region active-active, RPO/RTO tradeoffs, split-brain mitigation.",
    readiness: 40,
    duration: 18,
    status: "Needs Practice",
    priority: "High",
    practiceHref: "/practice/session/system-design",
    icon: Layers,
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

export function ChooseTopicWorkspace() {
  const [selectedArea, setSelectedArea] = useState<string>("system-design");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [selectedPriority, setSelectedPriority] = useState<string>("all");
  const [selectedTime, setSelectedTime] = useState<string>("all");
  const [sortFilter, setSortFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grouped" | "flat">("grouped");
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});
  const [whyTooltipOpen, setWhyTooltipOpen] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // SWR Curriculum Hook (Phase 3 & Phase 4 Edge Cache)
  const {
    domains,
    activeDomain,
    categories,
    allTopics: curriculumTopics,
    isLoading: isCurriculumLoading,
    isValidating,
    toggleStar,
  } = useCurriculum(selectedArea);

  // Scroll button visibility
  const updateScrollButtons = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  }, []);

  useEffect(() => {
    updateScrollButtons();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollButtons, { passive: true });
    window.addEventListener("resize", updateScrollButtons);
    return () => {
      el.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, [updateScrollButtons, domains]);

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = 300;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  // Display domains with dynamic counts or baseline canonical fallbacks
  const displayDomains = useMemo(() => {
    if (domains && domains.length > 0) {
      return domains.map((d) => ({
        slug: d.slug,
        name: d.name,
        shortName: d.shortName || DOMAIN_VISUAL_MAP[d.slug]?.shortName || d.name,
        description: d.description,
        topicsCount: d.topicsCount,
        categoriesCount: d.categoriesCount,
        version: d.version,
        readiness:
          d.slug === "system-design"
            ? 42
            : d.slug === "cloud-devops"
              ? 67
              : d.slug === "dsa"
                ? 78
                : d.slug === "behavioral-leadership"
                  ? 91
                  : 55,
      }));
    }
    return Object.entries(DOMAIN_VISUAL_MAP).map(([slug, meta]) => ({
      slug,
      name: meta.shortName,
      shortName: meta.shortName,
      description: `Comprehensive interview preparation for ${meta.shortName}`,
      topicsCount: slug === "system-design" ? 62 : slug === "cloud-devops" ? 50 : 35,
      categoriesCount: 12,
      version: "1.0",
      readiness: 50,
    }));
  }, [domains]);

  // Current active domain detail
  const currentDomainDetail = useMemo(() => {
    return (
      displayDomains.find((d) => d.slug === selectedArea) ||
      displayDomains[0]
    );
  }, [displayDomains, selectedArea]);

  // Selected area info (backward compatibility for legacy references)
  const currentAreaInfo = useMemo(() => {
    return {
      id: currentDomainDetail.slug,
      name: currentDomainDetail.shortName,
      readiness: currentDomainDetail.readiness,
      topicCount: currentDomainDetail.topicsCount,
    };
  }, [currentDomainDetail]);

  // Topics belonging to current area (dynamically from live curriculum or fallback)
  const areaTopics = useMemo<Topic[]>(() => {
    if (curriculumTopics && curriculumTopics.length > 0) {
      return curriculumTopics.map((t) => ({
        id: t.slug,
        slug: t.slug,
        topicId: t.topicId || t.slug.toUpperCase().slice(0, 6),
        area: selectedArea as AreaType,
        title: t.title,
        description: `Covers ${t.rubricAtomsCount} rubric atoms across ${t.questionsCount} interview questions.`,
        readiness: t.readiness ?? (t.priority === "P0" ? 45 : 60),
        duration: t.durationMin || 15,
        status: (t.status || "Not Practiced") as StatusType,
        priority: t.priority,
        difficulty: t.difficulty,
        trend: t.trend,
        rubricAtomsCount: t.rubricAtomsCount,
        questionsCount: t.questionsCount,
        isStarred: t.isStarred,
        practiceHref: t.practiceHref || getPracticeSessionUrl(selectedArea, t.slug),
        icon: DOMAIN_VISUAL_MAP[selectedArea]?.icon || Database,
      }));
    }
    const matched = ALL_TOPICS.filter((t) => t.area === selectedArea);
    if (matched.length > 0) return matched;
    return ALL_TOPICS.filter((t) => t.area === "system-design");
  }, [curriculumTopics, selectedArea]);

  // Counts for filter checkboxes based on current area
  const filterCounts = useMemo(() => {
    return {
      status: {
        all: areaTopics.length,
        notPracticed: areaTopics.filter((t) => t.status === "Not Practiced").length,
        needsPractice: areaTopics.filter((t) => t.status === "Needs Practice").length,
        inProgress: areaTopics.filter((t) => t.status === "In Progress").length,
        practiced: areaTopics.filter((t) => t.status === "Practiced").length,
        starred: areaTopics.filter((t) => t.isStarred).length,
      },
      difficulty: {
        beginner: areaTopics.filter((t) => t.difficulty === "BEGINNER").length,
        intermediate: areaTopics.filter((t) => t.difficulty === "INTERMEDIATE").length,
        advanced: areaTopics.filter((t) => t.difficulty === "ADVANCED").length,
        expert: areaTopics.filter((t) => t.difficulty === "EXPERT").length,
      },
      priority: {
        p0: areaTopics.filter((t) => t.priority === "P0" || t.priority === "High").length,
        p1: areaTopics.filter((t) => t.priority === "P1" || t.priority === "Medium").length,
      },
      time: {
        under10: areaTopics.filter((t) => t.duration <= 10).length,
        between10And20: areaTopics.filter(
          (t) => t.duration > 10 && t.duration <= 20,
        ).length,
        over20: areaTopics.filter((t) => t.duration >= 20).length,
      },
    };
  }, [areaTopics]);

  // Filtered topic list
  const filteredTopics = useMemo(() => {
    return areaTopics
      .filter((topic) => {
        // Search query (matches title, topicId, description)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle = topic.title.toLowerCase().includes(q);
          const matchId = (topic.topicId || "").toLowerCase().includes(q);
          const matchDesc = topic.description.toLowerCase().includes(q);
          if (!matchTitle && !matchId && !matchDesc) return false;
        }

        // Status
        if (selectedStatus === "starred") {
          if (!topic.isStarred) return false;
        } else if (selectedStatus !== "all" && topic.status !== selectedStatus) {
          return false;
        }

        // Difficulty
        if (
          selectedDifficulty !== "all" &&
          (topic.difficulty || "INTERMEDIATE").toUpperCase() !==
            selectedDifficulty.toUpperCase()
        ) {
          return false;
        }

        // Priority
        if (selectedPriority !== "all") {
          if (
            selectedPriority === "P0" &&
            topic.priority !== "P0" &&
            topic.priority !== "High"
          ) {
            return false;
          }
          if (
            selectedPriority === "P1" &&
            topic.priority !== "P1" &&
            topic.priority !== "Medium"
          ) {
            return false;
          }
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

        return true;
      })
      .sort((a, b) => {
        if (sortFilter === "high") {
          const pOrder: Record<string, number> = {
            P0: 0,
            High: 0,
            P1: 1,
            Medium: 1,
            Low: 2,
          };
          return (pOrder[a.priority] ?? 1) - (pOrder[b.priority] ?? 1);
        }
        if (sortFilter === "readiness-asc") {
          return a.readiness - b.readiness;
        }
        if (sortFilter === "readiness-desc") {
          return b.readiness - a.readiness;
        }
        if (sortFilter === "questions-desc") {
          return (b.questionsCount ?? 20) - (a.questionsCount ?? 20);
        }
        // Recommended default: P0 first, then lowest readiness
        if (
          (a.priority === "P0" || a.priority === "High") &&
          b.priority !== "P0" &&
          b.priority !== "High"
        ) {
          return -1;
        }
        if (
          (b.priority === "P0" || b.priority === "High") &&
          a.priority !== "P0" &&
          a.priority !== "High"
        ) {
          return 1;
        }
        return a.readiness - b.readiness;
      });
  }, [
    areaTopics,
    searchQuery,
    selectedStatus,
    selectedDifficulty,
    selectedPriority,
    selectedTime,
    sortFilter,
  ]);

  // Grouped by Category from live curriculum hierarchy
  const categoryGroups = useMemo<CategoryGroup[]>(() => {
    if (categories && categories.length > 0) {
      const filteredSlugs = new Set(filteredTopics.map((t) => t.id));
      return categories
        .map((cat) => {
          const catTopics = cat.topics
            .filter((t) => filteredSlugs.has(t.slug))
            .map((t) => {
              const matchedAreaTopic = filteredTopics.find(
                (at) => at.id === t.slug
              );
              return (
                matchedAreaTopic || {
                  id: t.slug,
                  slug: t.slug,
                  topicId: t.topicId,
                  area: selectedArea as AreaType,
                  title: t.title,
                  description: `Covers ${t.rubricAtomsCount} rubric atoms across ${t.questionsCount} interview questions.`,
                  pillar: cat.pillar,
                  categoryName: cat.name,
                  categorySlug: cat.slug,
                  readiness: t.readiness ?? (t.priority === "P0" ? 45 : 60),
                  duration: t.durationMin || 15,
                  status: (t.status || "Not Practiced") as StatusType,
                  priority: t.priority,
                  difficulty: t.difficulty,
                  trend: t.trend,
                  rubricAtomsCount: t.rubricAtomsCount,
                  questionsCount: t.questionsCount,
                  isStarred: t.isStarred,
                  practiceHref:
                    t.practiceHref ||
                    getPracticeSessionUrl(selectedArea, t.slug),
                  icon: DOMAIN_VISUAL_MAP[selectedArea]?.icon || Database,
                }
              );
            });

          return {
            slug: cat.slug,
            name: cat.name,
            pillar: cat.pillar,
            sortOrder: cat.sortOrder,
            topicsCount: catTopics.length,
            topics: catTopics,
          };
        })
        .filter((cat) => cat.topics.length > 0);
    }

    if (filteredTopics.length > 0) {
      return [
        {
          slug: "core-curriculum",
          name: `${currentDomainDetail.shortName} Core Curriculum`,
          pillar: "core",
          sortOrder: 1,
          topicsCount: filteredTopics.length,
          topics: filteredTopics,
        },
      ];
    }

    return [];
  }, [categories, filteredTopics, selectedArea, currentDomainDetail]);

  const toggleCategoryCollapse = (categorySlug: string) => {
    setCollapsedCategories((prev) => ({
      ...prev,
      [categorySlug]: !prev[categorySlug],
    }));
  };

  // Pagination State (10 records per page for flat list)
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Reset page when any filter, search, sort, or area changes
  useEffect(() => {
    setCurrentPage(1);
  }, [
    selectedArea,
    searchQuery,
    selectedStatus,
    selectedDifficulty,
    selectedPriority,
    selectedTime,
    sortFilter,
  ]);

  const totalPages = Math.ceil(filteredTopics.length / pageSize);

  // Paginated topics slice for flat view
  const paginatedTopics = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredTopics.slice(startIndex, startIndex + pageSize);
  }, [filteredTopics, currentPage]);

  const renderStatusBadge = (status: StatusType) => {
    switch (status) {
      case "Needs Practice":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#fff0ec] px-2.5 py-0.5 text-[10px] sm:text-[11px] font-semibold text-[#ef4444] border border-[#fecaca] whitespace-nowrap">
            <span className="size-1.5 rounded-full bg-[#ef4444]" />
            <span>Needs Practice</span>
          </span>
        );
      case "In Progress":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#fef3c7] px-2.5 py-0.5 text-[10px] sm:text-[11px] font-semibold text-[#d97706] border border-[#fde68a] whitespace-nowrap">
            <span className="size-1.5 rounded-full bg-[#d97706] animate-pulse" />
            <span>In Progress</span>
          </span>
        );
      case "Practiced":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#edf5ec] px-2.5 py-0.5 text-[10px] sm:text-[11px] font-semibold text-[#10b981] border border-[#d1fae5] whitespace-nowrap">
            <Check className="size-3 text-[#10b981] stroke-[2.5]" />
            <span>Practiced</span>
          </span>
        );
      case "Not Practiced":
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#eff6ff] px-2.5 py-0.5 text-[10px] sm:text-[11px] font-semibold text-[#3b82f6] border border-[#dbeafe] whitespace-nowrap">
            <span className="size-1.5 rounded-full bg-[#3b82f6]" />
            <span>Not Practiced</span>
          </span>
        );
    }
  };

  const renderTopicCard = (topic: Topic) => {
    const TopicIcon = topic.icon || Database;
    const isP0 = topic.priority === "P0" || topic.priority === "High";

    return (
      <div
        key={topic.id}
        className="flex flex-col lg:flex-row lg:items-center justify-between gap-3.5 sm:gap-4 rounded-2xl border border-line bg-white p-3.5 sm:p-4.5 shadow-2xs hover:border-brand/40 hover:shadow-xs transition-all"
      >
        {/* Left Side: Icon + Topic Metadata */}
        <div className="flex items-start gap-3 min-w-0 flex-1">
          {/* Domain Theme Icon */}
          <div className="flex size-9 sm:size-10 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand mt-0.5 sm:mt-0">
            <TopicIcon className="size-4.5 sm:size-5" />
          </div>

          <div className="flex flex-col min-w-0 flex-1 gap-1">
            {/* Top Tag Row: TopicId + Priority + Difficulty + Trend + Star */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {/* Canonical Topic ID */}
              {topic.topicId && (
                <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-line text-ink-muted">
                  {topic.topicId}
                </span>
              )}

              {/* Priority Badge */}
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold border ${
                  isP0
                    ? "bg-red-500/10 text-red-600 border-red-500/20"
                    : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                }`}
              >
                {isP0 ? "P0 Core" : "P1 Advanced"}
              </span>

              {/* Difficulty Badge */}
              {topic.difficulty && (
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    topic.difficulty === "BEGINNER"
                      ? "bg-emerald-500/10 text-emerald-600"
                      : topic.difficulty === "INTERMEDIATE"
                        ? "bg-blue-500/10 text-blue-600"
                        : topic.difficulty === "ADVANCED"
                          ? "bg-purple-500/10 text-purple-600"
                          : "bg-rose-500/10 text-rose-600 font-extrabold"
                  }`}
                >
                  {topic.difficulty}
                </span>
              )}

              {/* Trend Indicator */}
              {topic.trend === "SURGING" && (
                <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-orange-600 bg-orange-500/10 px-1.5 py-0.5 rounded-full">
                  <Flame className="size-2.5 fill-orange-500 text-orange-500" />
                  <span>Surging</span>
                </span>
              )}
              {topic.trend === "HOT" && (
                <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-red-600 bg-red-500/10 px-1.5 py-0.5 rounded-full">
                  <TrendingUp className="size-2.5 text-red-500" />
                  <span>Hot</span>
                </span>
              )}

              {/* Interactive Star Button */}
              <button
                type="button"
                onClick={() => toggleStar(topic.slug || topic.id)}
                title={topic.isStarred ? "Remove from starred" : "Star topic"}
                className="p-0.5 text-ink-muted hover:text-amber-500 transition-colors cursor-pointer ml-auto sm:ml-0"
              >
                <Star
                  className={`size-3.5 transition-transform active:scale-125 ${
                    topic.isStarred ? "fill-amber-400 text-amber-400" : "text-ink-muted/50 hover:text-amber-400"
                  }`}
                />
              </button>
            </div>

            {/* Title & Description */}
            <div className="flex flex-col gap-0.5">
              <span className="font-display font-bold text-sm sm:text-base text-ink hover:text-brand transition-colors">
                {topic.title}
              </span>
              <p className="text-xs text-ink-muted line-clamp-1 leading-relaxed">
                {topic.description}
              </p>
            </div>

            {/* Metadata Footer: Rubrics & Questions & Time */}
            <div className="flex items-center gap-3 text-[11px] text-ink-muted pt-0.5 flex-wrap">
              {typeof topic.rubricAtomsCount === "number" && (
                <span className="flex items-center gap-1 font-medium">
                  <span className="text-brand font-bold">🎯</span>
                  <span>{topic.rubricAtomsCount} Rubric Atoms</span>
                </span>
              )}
              {typeof topic.questionsCount === "number" && (
                <>
                  <span className="text-line">•</span>
                  <span className="flex items-center gap-1 font-medium">
                    <BookOpen className="size-3 text-brand" />
                    <span>{topic.questionsCount} Questions</span>
                  </span>
                </>
              )}
              <span className="text-line">•</span>
              <span className="flex items-center gap-1 font-medium">
                <Clock className="size-3 text-ink-muted" />
                <span>{topic.duration} min</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Status + Readiness Bar + Practice CTA */}
        <div className="flex items-center justify-between lg:justify-end gap-3 sm:gap-4 shrink-0 border-t border-line/60 lg:border-t-0 pt-2.5 lg:pt-0">
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Readiness Gauge */}
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-ink-muted uppercase font-bold">Readiness</span>
                <span className="text-xs font-mono font-bold text-ink">{topic.readiness}%</span>
              </div>
              <div className="h-1.5 w-16 sm:w-20 overflow-hidden rounded-full bg-line">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    topic.readiness >= 75
                      ? "bg-[#10b981]"
                      : topic.readiness >= 50
                        ? "bg-[#3b82f6]"
                        : "bg-brand"
                  }`}
                  style={{ width: `${topic.readiness}%` }}
                />
              </div>
            </div>

            {/* Status Badge */}
            <div className="shrink-0">{renderStatusBadge(topic.status)}</div>
          </div>

          {/* Practice CTA Button */}
          <Link
            href={topic.practiceHref}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-line bg-white px-4 py-2 text-xs font-bold text-ink shadow-2xs hover:border-brand hover:text-white hover:bg-brand transition-all whitespace-nowrap cursor-pointer group/cta"
          >
            <span>Practice</span>
            <ArrowRight className="size-3 group-hover/cta:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    );
  };

  return (
    <div className="flex w-full flex-col gap-6 sm:gap-8 max-w-[1400px] mx-auto pb-12">
      {/* 1. Top Header Row matching design */}
      {/* 1. Top Header Row matching design */}
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
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
              <User className="size-3.5 text-ink-muted shrink-0" />
              <span>Senior Software Engineer</span>
            </div>
            <span className="text-line">•</span>
            <div className="flex items-center gap-1.5 font-medium text-ink">
              <span className="font-bold text-[#4285F4]">G</span>
              <span>Google</span>
            </div>
            <span className="text-line">•</span>
            <div className="flex items-center gap-1.5 font-medium text-ink-muted">
              <Calendar className="size-3.5 text-ink-muted shrink-0" />
              <span>Interview in 12 days</span>
            </div>
          </div>
        </div>

        {/* Right: Overall Readiness Widget */}
        <div className="flex items-center gap-3.5 rounded-2xl border border-line bg-white p-3.5 sm:px-5 sm:py-3.5 shadow-xs shrink-0 w-full sm:w-auto">
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
        {/* LEFT COLUMN: Choose by Area + Topics Table */}
        <div className="flex flex-1 flex-col gap-6 sm:gap-7 w-full min-w-0">
          {/* Section: 10-Domain Responsive Track (TASK-P4-02) */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <h2 className="font-display text-base sm:text-lg font-extrabold text-ink">
                    Choose Domain ({displayDomains.length})
                  </h2>
                  {isValidating && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-medium text-brand animate-pulse">
                      Syncing...
                    </span>
                  )}
                </div>
                <p className="text-xs text-ink-muted">
                  Select a canonical engineering domain to explore topics and interview questions.
                </p>
              </div>

              {/* Scroll Navigation Chevrons (Desktop & Tablet) */}
              <div className="hidden sm:flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleScroll("left")}
                  disabled={!canScrollLeft}
                  aria-label="Scroll left"
                  className={`flex size-8 items-center justify-center rounded-xl border transition-all ${
                    canScrollLeft
                      ? "border-line bg-white text-ink hover:border-brand hover:text-brand shadow-2xs cursor-pointer"
                      : "border-line/40 bg-cream/20 text-ink-muted/30 cursor-not-allowed"
                  }`}
                >
                  <ChevronLeft className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleScroll("right")}
                  disabled={!canScrollRight}
                  aria-label="Scroll right"
                  className={`flex size-8 items-center justify-center rounded-xl border transition-all ${
                    canScrollRight
                      ? "border-line bg-white text-ink hover:border-brand hover:text-brand shadow-2xs cursor-pointer"
                      : "border-line/40 bg-cream/20 text-ink-muted/30 cursor-not-allowed"
                  }`}
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </div>

            {/* Zero-CLS Skeleton Loading State */}
            {isCurriculumLoading && domains.length === 0 ? (
              <div className="flex items-stretch gap-2.5 sm:gap-3.5 overflow-x-auto pb-2 pt-0.5 px-0.5 no-scrollbar">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex min-w-[210px] sm:min-w-[230px] max-w-[260px] shrink-0 flex-col justify-between rounded-2xl border border-line bg-white p-3.5 shadow-2xs animate-pulse"
                  >
                    <div className="flex items-center justify-between">
                      <div className="size-9 sm:size-10 rounded-xl bg-line-subtle" />
                      <div className="h-5 w-16 rounded-full bg-line-subtle" />
                    </div>
                    <div className="mt-3 flex flex-col gap-2">
                      <div className="h-4 w-28 rounded bg-line-subtle" />
                      <div className="h-2 w-full rounded-full bg-line-subtle mt-2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Horizontally Scrollable 10-Domain Pill Track */
              <div
                ref={scrollRef}
                className="flex items-stretch gap-2.5 sm:gap-3.5 overflow-x-auto scroll-smooth pb-2 pt-0.5 px-0.5 no-scrollbar"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {displayDomains.map((domain) => {
                  const isSelected = selectedArea === domain.slug;
                  const visualMeta = DOMAIN_VISUAL_MAP[domain.slug] || {
                    shortName: domain.shortName || domain.name,
                    icon: Database,
                    badgeBg: "bg-blue-500/10",
                    badgeColor: "text-blue-600",
                    activeRing: "ring-blue-500",
                    activeBorder: "border-blue-500",
                  };
                  const IconComponent = visualMeta.icon;

                  return (
                    <button
                      key={domain.slug}
                      id={`domain-pill-${domain.slug}`}
                      type="button"
                      onClick={(e) => {
                        setSelectedArea(domain.slug);
                        setSelectedStatus("all");
                        setSelectedTime("all");
                        setSelectedPriority("all");
                        (e.currentTarget as HTMLElement).scrollIntoView({
                          behavior: "smooth",
                          inline: "center",
                          block: "nearest",
                        });
                      }}
                      className={`group flex min-w-[210px] sm:min-w-[230px] max-w-[260px] shrink-0 flex-col justify-between rounded-2xl border p-3 sm:p-3.5 text-left transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? `border-brand bg-white shadow-xs ring-2 ring-brand/20 ${visualMeta.activeBorder}`
                          : "border-line bg-white hover:border-line-strong hover:bg-cream/40"
                      }`}
                    >
                      {/* Top Row: Icon + Topics Count Badge */}
                      <div className="flex items-center justify-between gap-2">
                        <div
                          className={`flex size-9 sm:size-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
                            isSelected
                              ? "bg-brand text-white shadow-xs"
                              : `${visualMeta.badgeBg} ${visualMeta.badgeColor}`
                          }`}
                        >
                          <IconComponent className="size-4 sm:size-5" />
                        </div>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] sm:text-[11px] font-semibold transition-colors shrink-0 ${
                            isSelected
                              ? "bg-brand/10 text-brand font-bold"
                              : "bg-line text-ink-muted"
                          }`}
                        >
                          {domain.topicsCount} topics
                        </span>
                      </div>

                      {/* Middle: Domain Name */}
                      <div className="mt-2.5">
                        <span
                          className={`font-display text-xs sm:text-sm font-bold block transition-colors truncate ${
                            isSelected ? "text-brand" : "text-ink group-hover:text-brand"
                          }`}
                        >
                          {visualMeta.shortName}
                        </span>

                        {/* Bottom: Readiness Percentage & Progress Bar */}
                        <div className="mt-2 flex items-center justify-between text-[10px] sm:text-[11px] text-ink-muted">
                          <span>Readiness</span>
                          <span className="font-mono font-bold text-ink">
                            {domain.readiness ?? 50}%
                          </span>
                        </div>
                        <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-line">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              (domain.readiness ?? 50) >= 75
                                ? "bg-[#10b981]"
                                : (domain.readiness ?? 50) >= 50
                                  ? "bg-[#3b82f6]"
                                  : "bg-brand"
                            }`}
                            style={{ width: `${domain.readiness ?? 50}%` }}
                          />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Active Domain Header Summary Banner (TASK-P4-02) */}
          {currentDomainDetail && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-line bg-gradient-to-r from-white via-white to-cream/40 p-4 sm:p-5 shadow-2xs">
              <div className="flex items-start gap-3.5">
                <div
                  className={`p-2.5 rounded-xl shrink-0 ${
                    DOMAIN_VISUAL_MAP[currentDomainDetail.slug]?.badgeBg || "bg-brand/10"
                  } ${DOMAIN_VISUAL_MAP[currentDomainDetail.slug]?.badgeColor || "text-brand"}`}
                >
                  {(() => {
                    const VisualIcon =
                      DOMAIN_VISUAL_MAP[currentDomainDetail.slug]?.icon || Database;
                    return <VisualIcon className="size-5 sm:size-6" />;
                  })()}
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="font-display text-base sm:text-lg font-bold text-ink">
                      {currentDomainDetail.name}
                    </h2>
                    <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-extrabold text-brand uppercase tracking-wider">
                      v{currentDomainDetail.version || "1.0"}
                    </span>
                  </div>
                  <p className="text-xs text-ink-muted max-w-2xl leading-relaxed">
                    {currentDomainDetail.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
                <div className="flex items-center gap-1.5 rounded-xl border border-line bg-white px-3 py-1.5 text-xs font-semibold text-ink shadow-2xs">
                  <Layers className="size-3.5 text-ink-muted" />
                  <span>{currentDomainDetail.categoriesCount} Categories</span>
                </div>
                <div className="flex items-center gap-1.5 rounded-xl border border-line bg-white px-3 py-1.5 text-xs font-semibold text-ink shadow-2xs">
                  <BookOpen className="size-3.5 text-brand" />
                  <span>{currentDomainDetail.topicsCount} Topics</span>
                </div>
              </div>
            </div>
          )}

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

            {/* Search Bar, View Mode Toggle & Sort Controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Search input with canonical ID support */}
              <div className="relative flex-1">
                <Search className="size-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search topics by title, ID (e.g. SYS018), or keywords..."
                  className="w-full rounded-xl border border-line bg-white pl-10 pr-9 py-2.5 text-xs text-ink outline-none transition-colors focus:border-brand"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink cursor-pointer"
                    title="Clear search"
                  >
                    <X className="size-3.5" />
                  </button>
                )}
              </div>

              {/* View Mode Toggle: Grouped by Category vs Flat List */}
              <div className="flex items-center rounded-xl border border-line bg-white p-1 shrink-0 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setViewMode("grouped")}
                  className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                    viewMode === "grouped"
                      ? "bg-brand text-white shadow-xs"
                      : "text-ink-muted hover:text-ink"
                  }`}
                  title="Group by Category"
                >
                  <LayoutGrid className="size-3.5" />
                  <span className="hidden xs:inline">By Category</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("flat")}
                  className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                    viewMode === "flat"
                      ? "bg-brand text-white shadow-xs"
                      : "text-ink-muted hover:text-ink"
                  }`}
                  title="Flat List View"
                >
                  <ListFilter className="size-3.5" />
                  <span className="hidden xs:inline">Flat List</span>
                </button>
              </div>

              {/* Sort Selector */}
              <div className="relative shrink-0">
                <select
                  value={sortFilter}
                  onChange={(e) => setSortFilter(e.target.value)}
                  aria-label="Sort topics list"
                  className="w-full sm:w-auto appearance-none rounded-xl border border-line bg-white pl-3.5 pr-8 py-2.5 text-xs font-semibold text-ink outline-none cursor-pointer hover:bg-cream transition-colors"
                >
                  <option value="all">Sort: Recommended</option>
                  <option value="high">Sort: High Priority (P0 First)</option>
                  <option value="readiness-asc">Sort: Lowest Readiness First</option>
                  <option value="readiness-desc">Sort: Highest Readiness First</option>
                  <option value="questions-desc">Sort: Most Questions First</option>
                </select>
                <ChevronDown className="size-3.5 text-ink-muted absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Filter Section: Status Chips + Secondary Dropdowns */}
            <div className="flex flex-col gap-2.5 sm:gap-3 rounded-2xl border border-line bg-white p-3 sm:p-4 shadow-2xs">
              {/* Row 1: Status Filter Chips + Clear All CTA */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0 -mx-1 px-1 sm:mx-0 sm:px-0">
                  {[
                    { id: "all", label: "All Topics", count: areaTopics.length },
                    {
                      id: "Needs Practice",
                      label: "Needs Practice",
                      count: filterCounts.status.needsPractice,
                    },
                    {
                      id: "In Progress",
                      label: "In Progress",
                      count: filterCounts.status.inProgress,
                    },
                    {
                      id: "Not Practiced",
                      label: "Not Practiced",
                      count: filterCounts.status.notPracticed,
                    },
                    {
                      id: "Practiced",
                      label: "Practiced",
                      count: filterCounts.status.practiced,
                    },
                    {
                      id: "starred",
                      label: "★ Starred",
                      count: filterCounts.status.starred,
                    },
                  ].map((chip) => {
                    const isChipActive = selectedStatus === chip.id;
                    return (
                      <button
                        key={chip.id}
                        type="button"
                        onClick={() => setSelectedStatus(chip.id)}
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 sm:px-3 py-1.5 text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                          isChipActive
                            ? "bg-brand text-white shadow-2xs"
                            : "border border-line bg-white text-ink-muted hover:border-line-strong hover:bg-cream hover:text-ink"
                        }`}
                      >
                        <span>{chip.label}</span>
                        <span
                          className={`rounded-full px-1.5 py-0.5 text-[10px] leading-none ${
                            isChipActive
                              ? "bg-white/25 text-white font-bold"
                              : "bg-line text-ink-muted"
                          }`}
                        >
                          {chip.count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Clear all filters shortcut */}
                {(selectedStatus !== "all" ||
                  selectedDifficulty !== "all" ||
                  selectedPriority !== "all" ||
                  selectedTime !== "all" ||
                  searchQuery.trim() !== "") && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedStatus("all");
                      setSelectedDifficulty("all");
                      setSelectedPriority("all");
                      setSelectedTime("all");
                      setSearchQuery("");
                    }}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:underline transition-colors shrink-0 self-end sm:self-auto cursor-pointer"
                  >
                    <X className="size-3" />
                    <span>Clear filters</span>
                  </button>
                )}
              </div>

              {/* Row 2: Secondary Dropdown Filters (Difficulty, Priority, Time) + Results Counter */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-2 sm:pt-2.5 border-t border-line/60 text-xs">
                <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap w-full sm:w-auto">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted flex items-center gap-1 shrink-0">
                    <Filter className="size-3 text-ink-muted" />
                    <span className="hidden xs:inline">Filter:</span>
                  </span>

                  {/* Difficulty Pill Select */}
                  <div className="relative flex-1 sm:flex-initial">
                    <select
                      value={selectedDifficulty}
                      onChange={(e) => setSelectedDifficulty(e.target.value)}
                      aria-label="Filter by difficulty"
                      className={`w-full appearance-none rounded-full border pl-3 pr-7 py-1 text-xs font-semibold outline-none cursor-pointer transition-colors ${
                        selectedDifficulty !== "all"
                          ? "border-brand bg-[#fff0ec] text-brand"
                          : "border-line bg-white text-ink-muted hover:border-line-strong hover:text-ink"
                      }`}
                    >
                      <option value="all">Difficulty: All</option>
                      <option value="BEGINNER">Beginner ({filterCounts.difficulty.beginner})</option>
                      <option value="INTERMEDIATE">Intermediate ({filterCounts.difficulty.intermediate})</option>
                      <option value="ADVANCED">Advanced ({filterCounts.difficulty.advanced})</option>
                      <option value="EXPERT">Expert ({filterCounts.difficulty.expert})</option>
                    </select>
                    <ChevronDown className="size-3 text-ink-muted absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>

                  {/* Priority Pill Select */}
                  <div className="relative flex-1 sm:flex-initial">
                    <select
                      value={selectedPriority}
                      onChange={(e) => setSelectedPriority(e.target.value)}
                      aria-label="Filter by priority"
                      className={`w-full appearance-none rounded-full border pl-3 pr-7 py-1 text-xs font-semibold outline-none cursor-pointer transition-colors ${
                        selectedPriority !== "all"
                          ? "border-brand bg-[#fff0ec] text-brand"
                          : "border-line bg-white text-ink-muted hover:border-line-strong hover:text-ink"
                      }`}
                    >
                      <option value="all">Priority: All</option>
                      <option value="P0">P0 Core ({filterCounts.priority.p0})</option>
                      <option value="P1">P1 Advanced ({filterCounts.priority.p1})</option>
                    </select>
                    <ChevronDown className="size-3 text-ink-muted absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>

                  {/* Time Required Pill Select */}
                  <div className="relative flex-1 sm:flex-initial">
                    <select
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      aria-label="Filter by time"
                      className={`w-full appearance-none rounded-full border pl-3 pr-7 py-1 text-xs font-semibold outline-none cursor-pointer transition-colors ${
                        selectedTime !== "all"
                          ? "border-brand bg-[#fff0ec] text-brand"
                          : "border-line bg-white text-ink-muted hover:border-line-strong hover:text-ink"
                      }`}
                    >
                      <option value="all">Time: All</option>
                      <option value="<=10">≤ 10 min ({filterCounts.time.under10})</option>
                      <option value="10-20">10–20 min ({filterCounts.time.between10And20})</option>
                      <option value=">=20">≥ 20 min ({filterCounts.time.over20})</option>
                    </select>
                    <ChevronDown className="size-3 text-ink-muted absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Results Count Indicator */}
                <div className="text-[11px] text-ink-muted flex items-center justify-between sm:justify-start shrink-0">
                  <span>
                    Showing <span className="font-bold text-ink">{filteredTopics.length}</span> of {areaTopics.length} topics
                    {viewMode === "grouped" && categoryGroups.length > 0 && (
                      <span className="ml-1 text-ink-muted font-normal">
                        ({categoryGroups.length} {categoryGroups.length === 1 ? "category" : "categories"})
                      </span>
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Dynamic Content View: Category-Grouped vs Flat List */}
            {filteredTopics.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-line bg-white p-12 text-center shadow-2xs">
                <Search className="size-8 text-ink-muted mb-2 opacity-50" />
                <p className="font-display font-bold text-sm text-ink">
                  No matching topics found
                </p>
                <p className="text-xs text-ink-muted mt-1 max-w-sm">
                  We couldn't find any topics matching your active search and filter criteria. Try clearing some filters.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedStatus("all");
                    setSelectedDifficulty("all");
                    setSelectedPriority("all");
                    setSelectedTime("all");
                  }}
                  className="mt-4 rounded-full bg-brand px-4 py-2 text-xs font-semibold text-white hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
                >
                  Reset All Filters
                </button>
              </div>
            ) : viewMode === "grouped" ? (
              /* Grouped by Category View */
              <div className="flex flex-col gap-6">
                {categoryGroups.map((cat) => {
                  const isCollapsed = !!collapsedCategories[cat.slug];

                  return (
                    <div
                      key={cat.slug}
                      className="flex flex-col gap-3 rounded-2xl border border-line/80 bg-white/70 p-4 sm:p-5 shadow-2xs backdrop-blur-xs transition-all hover:border-line"
                    >
                      {/* Category Header Row */}
                      <div className="flex items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={() => toggleCategoryCollapse(cat.slug)}
                          className="flex items-center gap-2.5 text-left group/btn cursor-pointer min-w-0"
                          aria-expanded={!isCollapsed}
                          aria-label={`${isCollapsed ? "Expand" : "Collapse"} ${cat.name}`}
                        >
                          <div className="flex size-7 items-center justify-center rounded-lg border border-line bg-white text-ink-muted group-hover/btn:text-ink group-hover/btn:border-brand/40 transition-colors shrink-0">
                            {isCollapsed ? (
                              <ChevronRight className="size-4" />
                            ) : (
                              <ChevronDown className="size-4" />
                            )}
                          </div>
                          <div className="flex items-center gap-2 min-w-0 flex-wrap">
                            <h3 className="font-display text-sm sm:text-base font-bold text-ink group-hover/btn:text-brand transition-colors truncate">
                              {cat.name}
                            </h3>
                            {cat.pillar && (
                              <span className="rounded-full bg-cream px-2 py-0.5 text-[10px] font-semibold text-ink-muted uppercase tracking-wider shrink-0 border border-line/60">
                                {cat.pillar}
                              </span>
                            )}
                          </div>
                        </button>

                        {/* Category Topics Count */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="rounded-full bg-brand/10 px-2.5 py-0.5 text-[11px] font-bold text-brand">
                            {cat.topics.length} {cat.topics.length === 1 ? "topic" : "topics"}
                          </span>
                        </div>
                      </div>

                      {/* Category Topics Grid / Stack */}
                      {!isCollapsed && (
                        <div className="flex flex-col gap-2.5 pt-1">
                          {cat.topics.map((topic) => renderTopicCard(topic))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Flat List View with Pagination */
              <div className="flex flex-col gap-3.5">
                <div className="flex flex-col gap-2.5">
                  {paginatedTopics.map((topic) => renderTopicCard(topic))}
                </div>

                {/* Pagination Controls */}
                {filteredTopics.length > pageSize && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 rounded-2xl border border-line bg-white p-3.5 sm:px-5 sm:py-3.5 shadow-2xs mt-1">
                    {/* Topic Count Text */}
                    <div className="text-xs text-ink-muted text-center sm:text-left">
                      Showing{" "}
                      <span className="font-bold text-ink">
                        {(currentPage - 1) * pageSize + 1}
                      </span>
                      –
                      <span className="font-bold text-ink">
                        {Math.min(currentPage * pageSize, filteredTopics.length)}
                      </span>{" "}
                      of{" "}
                      <span className="font-bold text-ink">
                        {filteredTopics.length}
                      </span>{" "}
                      topics
                    </div>

                    {/* Pagination Buttons */}
                    <div className="flex items-center gap-1 sm:gap-1.5">
                      {/* Previous Button */}
                      <button
                        type="button"
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="inline-flex items-center gap-1 rounded-full border border-line bg-white px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-ink shadow-2xs hover:bg-cream disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
                        aria-label="Previous page"
                      >
                        <ChevronLeft className="size-3.5" />
                        <span className="hidden sm:inline">Previous</span>
                      </button>

                      {/* Page Numbers */}
                      <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                          const isCurrent = pageNum === currentPage;
                          return (
                            <button
                              key={pageNum}
                              type="button"
                              onClick={() => setCurrentPage(pageNum)}
                              className={`flex size-7.5 sm:size-8 items-center justify-center rounded-full text-xs font-bold transition-all cursor-pointer ${
                                isCurrent
                                  ? "bg-brand text-white shadow-xs"
                                  : "border border-line bg-white text-ink hover:bg-cream"
                              }`}
                              aria-label={`Page ${pageNum}`}
                              aria-current={isCurrent ? "page" : undefined}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                      </div>

                      {/* Next Button */}
                      <button
                        type="button"
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="inline-flex items-center gap-1 rounded-full border border-line bg-white px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-ink shadow-2xs hover:bg-cream disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
                        aria-label="Next page"
                      >
                        <span className="hidden sm:inline">Next</span>
                        <ChevronRight className="size-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Current Phase + Practice Filters + Practice Adapts (Sticky) */}
        <div className="w-full lg:w-[320px] shrink-0 flex flex-col gap-4 sm:gap-5">
          {/* Card 1: Current Phase */}
          <div className="flex flex-col gap-4 rounded-2xl sm:rounded-3xl border border-line bg-white p-4 sm:p-6 shadow-xs">
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
                  <div className="absolute right-0 top-6 z-20 w-64 max-w-[calc(100vw-3rem)] rounded-xl border border-line bg-white p-3 text-xs text-ink-muted shadow-lg animate-in fade-in">
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
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-line">
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

          {/* Card: "Your practice adapts" */}
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
