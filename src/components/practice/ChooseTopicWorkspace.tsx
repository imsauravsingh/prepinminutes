"use client";

import { useState, useMemo, useEffect } from "react";
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

const AREAS_CONFIG: {
  id: AreaType;
  name: string;
  readiness: number;
  topicCount: number;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
}[] = [
  {
    id: "system-design",
    name: "System Design",
    readiness: 32,
    topicCount: 21,
    icon: Database,
    iconBg: "bg-[#fff0ec]",
    iconColor: "text-brand",
  },
  {
    id: "cloud",
    name: "AWS & Cloud",
    readiness: 67,
    topicCount: 5,
    icon: Cloud,
    iconBg: "bg-[#eff6ff]",
    iconColor: "text-[#2563eb]",
  },
  {
    id: "coding",
    name: "Coding Patterns",
    readiness: 78,
    topicCount: 8,
    icon: CodeXml,
    iconBg: "bg-[#edf7f4]",
    iconColor: "text-[#0b8a8f]",
  },
  {
    id: "behavioral",
    name: "Behavioral",
    readiness: 91,
    topicCount: 4,
    icon: Users,
    iconBg: "bg-[#f5f3ff]",
    iconColor: "text-[#8b5cf6]",
  },
];

export function ChooseTopicWorkspace() {
  const [selectedArea, setSelectedArea] = useState<AreaType>("system-design");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedTime, setSelectedTime] = useState<string>("all");
  const [selectedPriority, setSelectedPriority] = useState<string>("all");
  const [sortFilter, setSortFilter] = useState<string>("all");
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

  // Pagination State (10 records per page)
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Reset page when any filter, search, sort, or area changes
  useEffect(() => {
    setCurrentPage(1);
  }, [
    selectedArea,
    searchQuery,
    selectedStatus,
    selectedTime,
    selectedPriority,
    sortFilter,
  ]);

  const totalPages = Math.ceil(filteredTopics.length / pageSize);

  // Paginated topics slice
  const paginatedTopics = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredTopics.slice(startIndex, startIndex + pageSize);
  }, [filteredTopics, currentPage]);

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
          {/* Section: Choose by Area */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-0.5">
              <h2 className="font-display text-base sm:text-lg font-extrabold text-ink">
                Choose by Area
              </h2>
              <p className="text-xs text-ink-muted">
                Select an area to explore and practice specific interview
                topics.
              </p>
            </div>

            {/* 4 Clean Area Selection Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
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
                    className={`group flex flex-col justify-between rounded-2xl border p-3 sm:p-4 text-left transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? "border-brand bg-white shadow-xs ring-1 ring-brand"
                        : "border-line bg-white hover:border-line-strong hover:bg-cream/40"
                    }`}
                  >
                    {/* Top Row: Icon + Topics Count Badge */}
                    <div className="flex items-center justify-between gap-1.5 sm:gap-2">
                      <div
                        className={`flex size-8.5 sm:size-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
                          isSelected
                            ? "bg-brand text-white shadow-xs"
                            : `${area.iconBg} ${area.iconColor}`
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
                        {area.topicCount} topics
                      </span>
                    </div>

                    {/* Middle: Area Name */}
                    <div className="mt-2.5 sm:mt-3">
                      <span className="font-display text-xs sm:text-sm font-bold text-ink block group-hover:text-brand transition-colors truncate">
                        {area.name}
                      </span>

                      {/* Bottom: Readiness Percentage & Progress Bar */}
                      <div className="mt-2 flex items-center justify-between text-[10px] sm:text-[11px] text-ink-muted">
                        <span>Readiness</span>
                        <span className="font-mono font-bold text-ink">
                          {area.readiness}%
                        </span>
                      </div>
                      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-line">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            area.readiness >= 75
                              ? "bg-[#10b981]"
                              : area.readiness >= 50
                                ? "bg-[#3b82f6]"
                                : "bg-brand"
                          }`}
                          style={{ width: `${area.readiness}%` }}
                        />
                      </div>
                    </div>
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

            {/* Search Bar & Sort Controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="size-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search topics by title or keywords..."
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

              {/* Sort Selector */}
              <div className="relative shrink-0">
                <select
                  value={sortFilter}
                  onChange={(e) => setSortFilter(e.target.value)}
                  aria-label="Sort topics list"
                  className="w-full sm:w-auto appearance-none rounded-xl border border-line bg-white pl-3.5 pr-8 py-2.5 text-xs font-semibold text-ink outline-none cursor-pointer hover:bg-cream transition-colors"
                >
                  <option value="all">Sort: Recommended</option>
                  <option value="high">Sort: High Priority First</option>
                  <option value="readiness-asc">Sort: Lowest Readiness First</option>
                  <option value="readiness-desc">Sort: Highest Readiness First</option>
                </select>
                <ChevronDown className="size-3.5 text-ink-muted absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Filter Section: Directly below Search & above Topic List */}
            <div className="flex flex-col gap-2.5 sm:gap-3 rounded-2xl border border-line bg-white p-3 sm:p-4 shadow-2xs">
              {/* Row 1: Status Filter Chips + Clear All CTA */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0 -mx-1 px-1 sm:mx-0 sm:px-0">
                  {[
                    { id: "all", label: "All", count: areaTopics.length },
                    {
                      id: "Needs Practice",
                      label: "Needs Practice",
                      count: filterCounts.status.needsPractice,
                    },
                    {
                      id: "Not Practiced",
                      label: "Not Practiced",
                      count: filterCounts.status.notPracticed,
                    },
                    {
                      id: "In Progress",
                      label: "In Progress",
                      count: filterCounts.status.inProgress,
                    },
                    {
                      id: "Practiced",
                      label: "Practiced",
                      count: filterCounts.status.practiced,
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
                  selectedTime !== "all" ||
                  selectedPriority !== "all" ||
                  searchQuery.trim() !== "") && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedStatus("all");
                      setSelectedTime("all");
                      setSelectedPriority("all");
                      setSearchQuery("");
                    }}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:underline transition-colors shrink-0 self-end sm:self-auto cursor-pointer"
                  >
                    <X className="size-3" />
                    <span>Clear filters</span>
                  </button>
                )}
              </div>

              {/* Row 2: Secondary Dropdown Filters (Time & Priority) + Results Counter */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-2 sm:pt-2.5 border-t border-line/60 text-xs">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted flex items-center gap-1 shrink-0">
                    <Filter className="size-3 text-ink-muted" />
                    <span className="hidden xs:inline">Filter:</span>
                  </span>

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
                      <option value="High">High ({filterCounts.priority.high})</option>
                      <option value="Medium">Medium ({filterCounts.priority.medium})</option>
                      <option value="Low">Low ({filterCounts.priority.low})</option>
                    </select>
                    <ChevronDown className="size-3 text-ink-muted absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Results Count Indicator */}
                <div className="text-[11px] text-ink-muted flex items-center justify-between sm:justify-start">
                  <span>
                    Showing <span className="font-bold text-ink">{filteredTopics.length}</span> of {areaTopics.length} topics
                  </span>
                </div>
              </div>
            </div>

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
                paginatedTopics.map((topic) => {
                  const TopicIcon = topic.icon;

                  const statusBadge = (
                    <>
                      {topic.status === "Needs Practice" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#fff0ec] px-2 sm:px-2.5 py-0.5 text-[10px] sm:text-[11px] font-semibold text-[#ef4444] border border-[#fecaca] whitespace-nowrap">
                          <span className="size-1.5 rounded-full bg-[#ef4444]" />
                          <span>Needs Practice</span>
                        </span>
                      )}
                      {topic.status === "Not Practiced" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#eff6ff] px-2 sm:px-2.5 py-0.5 text-[10px] sm:text-[11px] font-semibold text-[#3b82f6] border border-[#dbeafe] whitespace-nowrap">
                          <span className="size-1.5 rounded-full bg-[#3b82f6]" />
                          <span>Not Practiced</span>
                        </span>
                      )}
                      {topic.status === "Practiced" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#edf5ec] px-2 sm:px-2.5 py-0.5 text-[10px] sm:text-[11px] font-semibold text-[#10b981] border border-[#d1fae5] whitespace-nowrap">
                          <Check className="size-2.5 sm:size-3 text-[#10b981] stroke-[2.5]" />
                          <span>Practiced</span>
                        </span>
                      )}
                      {topic.status === "In Progress" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#fef3c7] px-2 sm:px-2.5 py-0.5 text-[10px] sm:text-[11px] font-semibold text-[#d97706] border border-[#fde68a] whitespace-nowrap">
                          <span className="size-1.5 rounded-full bg-[#d97706] animate-pulse" />
                          <span>In Progress</span>
                        </span>
                      )}
                    </>
                  );

                  return (
                    <div
                      key={topic.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 rounded-2xl border border-line bg-white p-3.5 sm:px-5 sm:py-3.5 shadow-2xs hover:border-[#b0a898]/40 hover:shadow-xs transition-all"
                    >
                      {/* Left: Icon + Title & Description + Mobile Status Badge */}
                      <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                        <div className="flex size-9 sm:size-10 shrink-0 items-center justify-center rounded-xl bg-[#eff6ff] text-[#2563eb]">
                          <TopicIcon className="size-4.5 sm:size-5" />
                        </div>

                        <div className="flex flex-col min-w-0 flex-1">
                          <div className="flex items-center justify-between sm:justify-start gap-1.5">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <span className="font-display font-bold text-xs sm:text-sm text-ink truncate">
                                {topic.title}
                              </span>
                              {topic.isStarred && (
                                <Star className="size-3.5 fill-amber-400 text-amber-400 shrink-0" />
                              )}
                            </div>

                            {/* Mobile-only Top Status Badge */}
                            <div className="sm:hidden shrink-0">
                              {statusBadge}
                            </div>
                          </div>

                          <span className="text-xs text-ink-muted line-clamp-1 mt-0.5 sm:mt-0">
                            {topic.description}
                          </span>
                        </div>
                      </div>

                      {/* Right Meta Stack: Readiness + Duration + Desktop Status Badge + Action CTA */}
                      <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 shrink-0 border-t border-line/60 sm:border-t-0 pt-2.5 sm:pt-0">
                        <div className="flex items-center gap-3 sm:gap-4">
                          {/* Readiness & Mini Progress Bar */}
                          <div className="flex items-center gap-1.5 sm:gap-2">
                            <span className="text-xs font-bold text-ink w-7 sm:w-8 text-right font-mono">
                              {topic.readiness}%
                            </span>
                            <div className="h-1.5 w-10 sm:w-14 overflow-hidden rounded-full bg-line">
                              <div
                                className={`h-full rounded-full ${
                                  topic.readiness >= 70
                                    ? "bg-[#10b981]"
                                    : topic.readiness >= 45
                                      ? "bg-[#f59e0b]"
                                      : "bg-brand"
                                }`}
                                style={{ width: `${topic.readiness}%` }}
                              />
                            </div>
                          </div>

                          {/* Duration */}
                          <div className="flex items-center gap-1 text-xs text-ink-muted">
                            <Clock className="size-3.5 text-ink-muted shrink-0" />
                            <span>{topic.duration} min</span>
                          </div>

                          {/* Status Badge (Desktop only in right stack) */}
                          <div className="hidden sm:flex sm:w-24 sm:justify-center">
                            {statusBadge}
                          </div>
                        </div>

                        {/* Practice Button */}
                        <Link
                          href={topic.practiceHref}
                          className="flex items-center justify-center gap-1 rounded-full border border-line bg-white px-3.5 sm:px-4 py-1.5 text-xs font-semibold text-ink shadow-2xs hover:border-brand hover:text-brand hover:bg-[#fff9f7] transition-all whitespace-nowrap ml-auto sm:ml-0"
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

            {/* Pagination Controls (shown when more than 10 records) */}
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
