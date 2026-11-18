"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Server,
  Network,
  Binary,
  Boxes,
  Users,
  Cloud,
  Layout,
  Cpu,
  Database,
  Sparkles,
  BookOpen,
  Clock,
  ChevronRight,
  Trophy,
  X,
  PlayCircle,
  AlertTriangle,
  Building2,
  Lock,
  Flame,
  Check,
  CheckCircle2,
  Mic,
  FileText,
  Zap,
  Code2,
  ChevronDown,
  ArrowRight,
  BrainCircuit,
  Plus,
} from "lucide-react";

export type NodeStatus = "mastered" | "in_progress" | "upcoming" | "locked";

export interface DomainTopic {
  id: string;
  title: string;
  subtitle: string;
  status: "mastered" | "in_progress" | "critical_gap" | "upcoming";
  durationMinutes: number;
  readinessScore: number;
  companyRelevance: string;
  priority: "High" | "Medium";
  practiceHref: string;
  type: "coding" | "system-design" | "behavioral";
  codeSnippet?: string;
  whatToImprove: string[];
  cheatSheetSummary: string[];
}

export interface DomainCategory {
  id: string;
  title: string;
  description: string;
  topics: DomainTopic[];
}

export interface DomainGraphNode {
  id: string;
  domainKey: string;
  title: string;
  subtitle: string;
  categoryBadge: string;
  domainSlug: string;
  status: NodeStatus;
  tier: 1 | 2 | 3 | 4;
  column: "left" | "center" | "right" | "wide";
  durationMinutes: number;
  totalSegments: number;
  completedSegments: number;
  scoreXP: number;
  readinessScore: number;
  weightPercent: number;
  companyRelevance: string;
  isPrimaryStack?: boolean;
  categories: DomainCategory[];
}

interface InteractiveRoadmapProps {
  targetRole: string;
  experienceLevel: string;
  targetCompany: string;
  timelineLabel: string;
  isFresher: boolean;
  completedActivities: number;
}

/**
 * Intelligent Multi-Factor Candidate Profile Evaluation Engine
 * Analyzes Role Specialization, Seniority, Target Company Bar, and Tech Stack to
 * automatically project all required interview domains onto the preparation graph.
 */
export function evaluateCandidateProfileDomains({
  targetRole,
  experienceLevel,
  isFresher,
  targetCompany,
  primaryLanguage = "Node.js",
}: {
  targetRole: string;
  experienceLevel: string;
  isFresher: boolean;
  targetCompany: string;
  primaryLanguage?: string;
}): {
  identifiedKeys: string[];
  personaLabel: string;
  reasons: string[];
} {
  const roleLower = (targetRole || "").toLowerCase();
  const expLower = (experienceLevel || "").toLowerCase();
  const compLower = (targetCompany || "").toLowerCase();

  const isSenior =
    expLower.includes("senior") ||
    expLower.includes("lead") ||
    expLower.includes("staff") ||
    expLower.includes("architect") ||
    expLower.includes("principal") ||
    expLower.includes("5") ||
    expLower.includes("6") ||
    expLower.includes("7") ||
    expLower.includes("8") ||
    expLower.includes("10+") ||
    expLower.includes("12+") ||
    roleLower.includes("senior") ||
    roleLower.includes("lead") ||
    roleLower.includes("staff") ||
    roleLower.includes("architect");

  const isFullStack =
    roleLower.includes("fullstack") ||
    roleLower.includes("full stack") ||
    (roleLower.includes("react") && roleLower.includes("node"));

  const isFrontend =
    roleLower.includes("frontend") ||
    roleLower.includes("ui") ||
    roleLower.includes("web developer");

  const isDevOps =
    roleLower.includes("devops") ||
    roleLower.includes("sre") ||
    roleLower.includes("cloud") ||
    roleLower.includes("infra") ||
    roleLower.includes("platform");

  const isAI =
    roleLower.includes("ai") ||
    roleLower.includes("ml") ||
    roleLower.includes("machine learning") ||
    roleLower.includes("genai") ||
    roleLower.includes("llm");

  const isData =
    roleLower.includes("data engineer") ||
    roleLower.includes("big data") ||
    roleLower.includes("etl");

  // 1. Fresher Evaluation (AI System Design & GenAI is now compulsory for all modern engineering loops)
  if (isFresher) {
    if (
      roleLower.includes("ai") ||
      roleLower.includes("ml") ||
      roleLower.includes("data") ||
      roleLower.includes("genai")
    ) {
      return {
        identifiedKeys: [
          "dsa",
          "ai-system-design",
          "cs-fundamentals",
          "nodejs-runtime",
          "behavioral",
        ],
        personaLabel: "Fresher AI & GenAI Systems Candidate",
        reasons: [
          "DSA (Data Structure & Algorithm) high weight (50% loop weight)",
          "AI System Design & GenAI Foundations (Vector Embeddings, RAG Pipelines & LLM APIs)",
          "Computer Science Fundamentals (OS, DBMS & Vector Indexing basics)",
          "STAR Behavioral Project Defense",
        ],
      };
    }
    if (isFrontend) {
      return {
        identifiedKeys: [
          "frontend-engineering",
          "nodejs-runtime",
          "dsa",
          "ai-system-design",
          "cs-fundamentals",
          "behavioral",
        ],
        personaLabel: "Fresher Frontend / Web Candidate",
        reasons: [
          "DSA (Data Structure & Algorithm) high weight (45% loop weight)",
          "Frontend & Web Architecture (DOM, CSS, JS engine foundations)",
          "AI System Design (Client-side AI streaming, LLM APIs & structured outputs)",
          "Computer Science Fundamentals (OS & Networking basics)",
          "Behavioral STAR project defense",
        ],
      };
    }
    return {
      identifiedKeys: [
        "dsa",
        "ai-system-design",
        "cs-fundamentals",
        "nodejs-runtime",
        "behavioral",
      ],
      personaLabel: "Fresher SDE / Campus Graduate",
      reasons: [
        "DSA (Data Structure & Algorithm) high weight (45% loop weight)",
        "AI System Design & GenAI Foundations: Prompt engineering, Vector Embeddings & RAG APIs (Modern Hiring Standard)",
        "Core CS Fundamentals: OS, DBMS, Concurrency & Networking",
        "Primary Stack Runtime Foundations (Node.js)",
        "STAR Behavioral project defense",
      ],
    };
  }

  // 2. Full Stack Engineer
  if (isFullStack) {
    return {
      identifiedKeys: [
        "nodejs-runtime",
        "frontend-engineering",
        "dsa",
        "lld",
        "system-design",
        "ai-system-design",
        "cloud-devops",
        "behavioral",
      ],
      personaLabel: isSenior
        ? "Senior Full Stack Architect"
        : "Full Stack Engineer",
      reasons: [
        "Dual-engine focus: Frontend Architecture (React/SSR/Web Vitals) + Node.js Runtime Internals",
        "Low-Level Design (LLD) & Machine Coding round mandatory for end-to-end component & API modeling",
        "System Design (HLD) & Distributed Scalability for backend microservices",
        "AI System Design & GenAI Infra (RAG pipelines, Vector Search & LLM Serving)",
        "Cloud, DevOps & Kubernetes (SRE) containerization and CI/CD deployment loop",
      ],
    };
  }

  // 3. Frontend Engineer
  if (isFrontend) {
    return {
      identifiedKeys: [
        "frontend-engineering",
        "nodejs-runtime",
        "dsa",
        "lld",
        "ai-system-design",
        "behavioral",
      ],
      personaLabel: isSenior
        ? "Staff / Senior Frontend Architect"
        : "Frontend Engineer",
      reasons: [
        "Frontend & Web Architecture (React Fiber, SSR, Core Web Vitals, Micro-frontends)",
        "JavaScript & TypeScript Core Engine Runtime Internals",
        "Low-Level Design (Design Systems, State Machines & Component Contracts)",
        "AI System Design (Client-side AI streaming, local models & tool calling)",
        "DSA targeted at client-side tree traversals & memory optimization",
      ],
    };
  }

  // 4. DevOps / Cloud / SRE Engineer
  if (isDevOps) {
    return {
      identifiedKeys: [
        "cloud-devops",
        "system-design",
        "ai-system-design",
        "nodejs-runtime",
        "dsa",
        "behavioral",
      ],
      personaLabel: isSenior
        ? "Principal SRE / Cloud Architect"
        : "Cloud & DevOps Engineer",
      reasons: [
        "Cloud, DevOps & Kubernetes (SRE, Multi-Region VPCs, Helm, Terraform)",
        "Distributed Systems & Reliability Architecture (SLIs/SLOs, Observability)",
        "AI System Design & GPU Cluster Infrastructure (vLLM, Triton, GPU scheduling)",
        "Scripting & Backend Runtime Internals",
        "Incident Leadership & P1 Outage Post-Mortems",
      ],
    };
  }

  // 5. AI / GenAI Engineer
  if (isAI) {
    return {
      identifiedKeys: [
        "ai-system-design",
        "nodejs-runtime",
        "system-design",
        "cloud-devops",
        "dsa",
        "behavioral",
      ],
      personaLabel: isSenior
        ? "Lead AI System Architect"
        : "AI & GenAI Systems Engineer",
      reasons: [
        "AI System Design (Vector DBs, RAG pipelines, LLM inference serving, GPU scheduling)",
        "Distributed Systems & Large-Scale Streaming",
        "Cloud & Container Infrastructure for High-Throughput Model Serving",
      ],
    };
  }

  // 6. Data Engineer
  if (isData) {
    return {
      identifiedKeys: [
        "data-engineering",
        "system-design",
        "ai-system-design",
        "cloud-devops",
        "nodejs-runtime",
        "dsa",
        "behavioral",
      ],
      personaLabel: isSenior ? "Staff Data Architect" : "Data Engineer",
      reasons: [
        "Data Engineering (Spark, Kafka streaming, Distributed ETL & Data Lakes)",
        "High-Level Distributed Scalability & Partitioning",
        "AI System Design (Vector Embeddings at scale & Feature Stores)",
        "Cloud Infrastructure & Pipeline Orchestration",
      ],
    };
  }

  // 7. Experienced / Senior Backend Engineer (Default standard)
  const defaultKeys = [
    "nodejs-runtime",
    "dsa",
    "lld",
    "system-design",
    "ai-system-design",
    "cloud-devops",
    "behavioral",
  ];

  return {
    identifiedKeys: defaultKeys,
    personaLabel: isSenior
      ? `Senior Backend / SDE-3 (${experienceLevel})`
      : `Backend Engineer (${experienceLevel})`,
    reasons: [
      `Evaluated for ${targetCompany} Senior Backend Loop:`,
      "Node.js Runtime Internals (Libuv, Streams, Worker Threads & V8 GC)",
      "Low-Level Design (LLD) & Machine Coding round (SOLID principles & GoF Design Patterns)",
      "High-Level System Design (HLD) & Distributed Scalability (Redis, Sharding, Kafka)",
      "AI System Design & GenAI Infra (Vector Search, RAG Pipelines, LLM Serving & Caching)",
      "Cloud, DevOps & Kubernetes (SRE, Multi-Region VPCs, Helm & CI/CD)",
      "DSA & STAR Incident Leadership",
    ],
  };
}

export function InteractiveRoadmap({
  targetRole,
  experienceLevel,
  targetCompany,
  timelineLabel,
  isFresher,
  completedActivities,
}: InteractiveRoadmapProps) {
  const company = targetCompany || "Google";
  const roleLower = (targetRole || "").toLowerCase();

  // Primary language selection (defaults to Node.js)
  const [selectedLanguage, setSelectedLanguage] = useState<string>("Node.js");
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);

  // Profile-driven domain evaluation
  const evaluationResult = useMemo(() => {
    return evaluateCandidateProfileDomains({
      targetRole,
      experienceLevel,
      isFresher,
      targetCompany: company,
      primaryLanguage: selectedLanguage,
    });
  }, [targetRole, experienceLevel, isFresher, company, selectedLanguage]);

  // Active domain keys in the graph - defaults to fully evaluated profile domains
  const [activeDomainKeys, setActiveDomainKeys] = useState<string[]>(
    () => evaluationResult.identifiedKeys,
  );

  // Sync if candidate profile props change
  useEffect(() => {
    setActiveDomainKeys(evaluationResult.identifiedKeys);
  }, [evaluationResult.identifiedKeys]);

  // Selected domain node whose category-wise topics are displayed in the slide-over drawer
  const [selectedDomainNode, setSelectedDomainNode] =
    useState<DomainGraphNode | null>(null);
  const [expandedSnippetTopicId, setExpandedSnippetTopicId] = useState<
    string | null
  >(null);

  // Available languages candidate can switch between
  const supportedLanguages = [
    {
      name: "Node.js",
      runtime: "V8 / Libuv (TypeScript & JavaScript)",
      badge: "Primary",
    },
    { name: "Java", runtime: "JVM (Spring Boot)", badge: "Enterprise" },
    { name: "Python", runtime: "CPython (FastAPI & Django)", badge: "Fast" },
    { name: "Go", runtime: "Goroutines & Channels", badge: "Cloud Native" },
  ];

  // Full Domain Master Catalog (Dynamic and expandable)
  const allAvailableDomains: Record<
    string,
    { name: string; icon: any; tier: 1 | 2 | 3 }
  > = {
    "nodejs-runtime": {
      name: `${selectedLanguage} Runtime Architecture`,
      icon: Server,
      tier: 1,
    },
    dsa: { name: "DSA (Data Structure & Algorithm)", icon: Binary, tier: 1 },
    lld: {
      name: "Low-Level Design & Machine Coding (LLD)",
      icon: Boxes,
      tier: 2,
    },
    "system-design": {
      name: "System Design & Distributed Scalability",
      icon: Network,
      tier: 2,
    },
    "cloud-devops": {
      name: "Cloud, DevOps & Kubernetes (SRE)",
      icon: Cloud,
      tier: 2,
    },
    "frontend-engineering": {
      name: "Frontend & Web Architecture",
      icon: Layout,
      tier: 1,
    },
    "ai-system-design": {
      name: "AI System Design & GenAI Infra",
      icon: Cpu,
      tier: 2,
    },
    "data-engineering": {
      name: "Data Engineering & Pipelines",
      icon: Database,
      tier: 2,
    },
    behavioral: { name: "STAR & Incident Leadership", icon: Users, tier: 3 },
  };

  const toggleDomain = (key: string) => {
    setActiveDomainKeys((prev) => {
      if (prev.includes(key)) {
        if (prev.length <= 1) return prev; // Keep at least one
        return prev.filter((k) => k !== key);
      }
      return [...prev, key];
    });
  };

  // Build the dynamic graph nodes corresponding to the active domains
  const { domainGraphNodes } = useMemo(() => {
    const nodes: DomainGraphNode[] = [];

    // 1. Node.js Runtime Architecture
    if (activeDomainKeys.includes("nodejs-runtime")) {
      nodes.push({
        id: "node-runtime-internals",
        domainKey: "nodejs-runtime",
        title: `${selectedLanguage} Runtime Architecture`,
        subtitle: "Libuv event loop, streams backpressure & worker threads",
        categoryBadge: `${selectedLanguage.toUpperCase()} · 30% WEIGHT`,
        domainSlug: "backend-engineering",
        isPrimaryStack: true,
        status: completedActivities >= 1 ? "mastered" : "in_progress",
        tier: 1,
        column: "left",
        durationMinutes: 50,
        totalSegments: 4,
        completedSegments: completedActivities >= 1 ? 4 : 2,
        scoreXP: 120,
        readinessScore: completedActivities >= 1 ? 92 : 68,
        weightPercent: 30,
        companyRelevance: `${company} Core Screen`,
        categories: [
          {
            id: "cat-node-eventloop",
            title: "Libuv & Concurrency Mechanics",
            description:
              "Event loop phases, microtask queue priority, and thread pool sizing.",
            topics: [
              {
                id: "node-event-loop-deep",
                title: "Libuv Event Loop & Macro/Microtask Queues",
                subtitle:
                  "Timers, Poll, Check (setImmediate) phases & process.nextTick priority",
                status: completedActivities >= 1 ? "mastered" : "in_progress",
                durationMinutes: 45,
                readinessScore: completedActivities >= 1 ? 92 : 68,
                companyRelevance: `${company} Core Screen`,
                priority: "High",
                practiceHref:
                  "/practice/session/coding?topic=javascript-event-loop-concurrency",
                type: "coding",
                codeSnippet: `// Node.js Execution Order Interview Trap:
setTimeout(() => console.log('1. Timer'), 0);
setImmediate(() => console.log('2. Check/Immediate'));
process.nextTick(() => console.log('3. Microtask Tick'));
Promise.resolve().then(() => console.log('4. Microtask Promise'));
// Output: 3. Tick -> 4. Promise -> 1. Timer / 2. Immediate`,
                whatToImprove: [
                  "process.nextTick starvation: microtask queue blocks I/O polling indefinitely.",
                  "Difference between setImmediate (Check phase) and setTimeout(fn, 0) inside I/O callbacks.",
                  "Thread pool sizing via UV_THREADPOOL_SIZE for crypto and fs operations.",
                ],
                cheatSheetSummary: [
                  "Libuv event loop runs in 6 distinct phases: Timers -> Pending -> Idle/Prepare -> Poll -> Check -> Close.",
                  "process.nextTick queue is processed immediately after current operation, before other microtasks.",
                  "setImmediate() always executes before setTimeout() when invoked within an I/O callback.",
                ],
              },
              {
                id: "node-worker-threads",
                title: "Worker Threads vs Cluster Module IPC",
                subtitle:
                  "SharedArrayBuffer, Atomics, multithreading vs fork() process isolation",
                status: "in_progress",
                durationMinutes: 45,
                readinessScore: 55,
                companyRelevance: `${company} Bar Raiser Deep Dive`,
                priority: "High",
                practiceHref:
                  "/practice/session/coding?topic=concurrency-patterns",
                type: "coding",
                codeSnippet: `// Worker Thread with Zero-Copy Shared Memory
import { Worker, isMainThread, parentPort } from 'worker_threads';

const sharedBuffer = new SharedArrayBuffer(4);
const sharedArray = new Int32Array(sharedBuffer);
Atomics.add(sharedArray, 0, 1);`,
                whatToImprove: [
                  "CPU-intensive task offloading: why clustering doesn't share memory without IPC.",
                  "Thread-safe synchronization using Atomics.wait() and Atomics.notify().",
                ],
                cheatSheetSummary: [
                  "Cluster creates multiple processes sharing master server port via IPC socket passing.",
                  "Worker Threads execute in isolated V8 contexts sharing the same process memory space.",
                ],
              },
            ],
          },
          {
            id: "cat-node-streams",
            title: "Streams, Buffers & Backpressure",
            description:
              "Zero-copy streaming, highWaterMark buffer tuning, and memory management.",
            topics: [
              {
                id: "node-stream-backpressure",
                title: "Streams, Buffers & Backpressure Handling",
                subtitle:
                  "Pipeline error handling, highWaterMark tuning & readable.pipe() leaks",
                status: "mastered",
                durationMinutes: 50,
                readinessScore: 90,
                companyRelevance: `${company} Practical Machine Coding`,
                priority: "High",
                practiceHref:
                  "/practice/session/coding?topic=asynchronous-io-patterns",
                type: "coding",
                codeSnippet: `import { pipeline } from 'stream/promises';
import { createReadStream, createWriteStream } from 'fs';

// Handling Backpressure correctly without memory buildup
await pipeline(
  createReadStream('huge-file.log', { highWaterMark: 64 * 1024 }),
  transformStream,
  createWriteStream('output.log')
);`,
                whatToImprove: [
                  "Memory explosion caused by stream.pipe() without drain event handling.",
                  "Difference between Buffer.alloc() (zero-filled) and Buffer.allocUnsafe().",
                ],
                cheatSheetSummary: [
                  "Backpressure occurs when consumer write buffer is full (write() returns false).",
                  "Always use stream/promises pipeline() to guarantee auto-destruction on errors.",
                ],
              },
            ],
          },
          {
            id: "cat-node-v8",
            title: "V8 Engine Profiling & Memory Leaks",
            description:
              "Heap snapshots, closure retainers, garbage collection and leak diagnosis.",
            topics: [
              {
                id: "node-v8-memory",
                title: "V8 Heap Profiler & Memory Leak Debugging",
                subtitle:
                  "Heap snapshots, unhandled rejections, closure retainers & Mark-Sweep GC",
                status: "critical_gap",
                durationMinutes: 40,
                readinessScore: 48,
                companyRelevance: `${company} Senior Production Diagnostic`,
                priority: "High",
                practiceHref:
                  "/practice/session/system-design?topic=microservices-and-distributed-transactions",
                type: "system-design",
                whatToImprove: [
                  "Retained size vs Shallow size in Chrome DevTools V8 heap snapshots.",
                  "Global event emitter listeners that fail to call removeListener().",
                ],
                cheatSheetSummary: [
                  "Memory leak signature: Steady climbing heapUsed over time without returning to baseline.",
                  "Always register process.on('unhandledRejection') to prevent silent crash exits.",
                ],
              },
            ],
          },
        ],
      });
    }

    // 2. Frontend & Web Architecture
    if (activeDomainKeys.includes("frontend-engineering")) {
      nodes.push({
        id: "node-frontend-engineering",
        domainKey: "frontend-engineering",
        title: "Frontend & Web Architecture",
        subtitle:
          "React Fiber, SSR/Next.js, Core Web Vitals, state management & micro-frontends",
        categoryBadge: "FRONTEND · 25% WEIGHT",
        domainSlug: "frontend-engineering",
        status: completedActivities >= 1 ? "in_progress" : "upcoming",
        tier:
          roleLower.includes("frontend") ||
          roleLower.includes("fullstack") ||
          roleLower.includes("full stack")
            ? 1
            : 2,
        column: "left",
        durationMinutes: 45,
        totalSegments: 4,
        completedSegments: completedActivities >= 1 ? 2 : 0,
        scoreXP: 115,
        readinessScore: completedActivities >= 1 ? 72 : 45,
        weightPercent: 25,
        companyRelevance: `${company} UI Architecture`,
        categories: [
          {
            id: "cat-react-internals",
            title: "React Fiber & Rendering Performance",
            description:
              "Reconciliation engine, Concurrent Mode, useTransition, and memory leaks.",
            topics: [
              {
                id: "topic-react-fiber",
                title: "React Fiber Architecture & Concurrent Rendering",
                subtitle:
                  "Diffing algorithm, work loops, priority lanes & useTransition non-blocking updates",
                status: "in_progress",
                durationMinutes: 40,
                readinessScore: 65,
                companyRelevance: `${company} UI Screen`,
                priority: "High",
                practiceHref: "/practice/session/coding?topic=react-internals",
                type: "coding",
                codeSnippet: `// Concurrent Rendering: Non-blocking state transition
import { useState, useTransition } from 'react';

function SearchResults({ query }) {
  const [filter, setFilter] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleSearch = (e) => {
    // 1. Urgent update: keep input typing responsive
    setFilter(e.target.value);

    // 2. Non-blocking transition: yield back to main thread
    startTransition(() => {
      setFilteredResults(heavyFilter(e.target.value));
    });
  };
}`,
                whatToImprove: [
                  "Avoiding cascading re-renders caused by unstable object references in Context providers.",
                  "Using startTransition to keep high-frequency inputs responsive under heavy DOM tree re-renders.",
                ],
                cheatSheetSummary: [
                  "Fiber represents a unit of work with child, sibling, and return pointers.",
                  "Reconciliation is interruptible in React 18+; commits to the DOM are always synchronous.",
                ],
              },
              {
                id: "topic-core-web-vitals",
                title: "Core Web Vitals & Next.js Hydration",
                subtitle:
                  "LCP, INP, CLS optimization, streaming SSR & partial hydration",
                status: "upcoming",
                durationMinutes: 45,
                readinessScore: 50,
                companyRelevance: `${company} Production Performance`,
                priority: "High",
                practiceHref:
                  "/practice/session/system-design?topic=web-performance",
                type: "system-design",
                whatToImprove: [
                  "Interaction to Next Paint (INP) bottlenecks caused by long JavaScript tasks > 50ms.",
                  "Hydration mismatches between server-rendered HTML and client VDOM.",
                ],
                cheatSheetSummary: [
                  "LCP (Largest Contentful Paint) target: < 2.5s; prioritize above-the-fold image loading.",
                  "INP measures user interaction latency across page lifecycle; target < 200ms.",
                ],
              },
            ],
          },
          {
            id: "cat-fe-architecture",
            title: "State Management & Micro-Frontends",
            description:
              "Server state (TanStack Query/SWR), client state, module federation, and design systems.",
            topics: [
              {
                id: "topic-fe-state-architecture",
                title: "Client State vs Server Cache Architecture",
                subtitle:
                  "Optimistic UI updates, cache invalidation & micro-frontend module federation",
                status: "upcoming",
                durationMinutes: 40,
                readinessScore: 45,
                companyRelevance: `${company} Architecture Round`,
                priority: "High",
                practiceHref:
                  "/practice/session/system-design?topic=frontend-architecture",
                type: "system-design",
                whatToImprove: [
                  "Mixing server cache state with UI state inside global Redux/Zustand stores.",
                  "Race conditions in parallel async fetches without abort controllers.",
                ],
                cheatSheetSummary: [
                  "Separate Server State (data on remote server) from Client State (ephemeral UI flags).",
                  "Use Module Federation for runtime micro-frontend sharing without monorepo coupling.",
                ],
              },
            ],
          },
        ],
      });
    }

    // 3. DSA (Data Structure & Algorithm)
    if (activeDomainKeys.includes("dsa")) {
      nodes.push({
        id: "node-dsa-algorithms",
        domainKey: "dsa",
        title: "DSA (Data Structure & Algorithm)",
        subtitle: "Sliding window, monotonic stacks, graph DAGs, trees & DP",
        categoryBadge: "DSA · 25% WEIGHT",
        domainSlug: "dsa",
        status: "mastered",
        tier: 1,
        column: "center",
        durationMinutes: 45,
        totalSegments: 4,
        completedSegments: 4,
        scoreXP: 100,
        readinessScore: 92,
        weightPercent: 25,
        companyRelevance: `${company} Standard`,
        categories: [
          {
            id: "cat-dsa-linear",
            title: "Linear Data Structures & Sliding Window",
            description:
              "Subarray constraints, frequency tracking, and monotonic queues.",
            topics: [
              {
                id: "dsa-sliding-window",
                title: "Sliding Window & Dynamic Expansion",
                subtitle:
                  "Dynamic size expansion, shrinkage condition & frequency tracking",
                status: "mastered",
                durationMinutes: 40,
                readinessScore: 92,
                companyRelevance: `${company} Standard`,
                priority: "High",
                practiceHref: "/practice/session/coding?topic=sliding-window",
                type: "coding",
                whatToImprove: [
                  "Exact K distinct elements pattern: atMost(K) - atMost(K-1).",
                ],
                cheatSheetSummary: [
                  "Expand window with right pointer until invalid; shrink with left.",
                ],
              },
              {
                id: "dsa-monotonic-stack",
                title: "Monotonic Stacks & Queues",
                subtitle:
                  "Next Greater Element and largest rectangle in histogram",
                status: "in_progress",
                durationMinutes: 40,
                readinessScore: 70,
                companyRelevance: `${company} Favorite`,
                priority: "High",
                practiceHref: "/practice/session/coding?topic=monotonic-stack",
                type: "coding",
                whatToImprove: [
                  "Maintaining strictly increasing vs decreasing element order.",
                ],
                cheatSheetSummary: [
                  "Monotonic stack reduces O(N^2) search to O(N) single-pass.",
                ],
              },
            ],
          },
          {
            id: "cat-dsa-graphs",
            title: "Trees, Graphs & Dynamic Programming",
            description:
              "Topological sorting, cycle detection, and subproblem memoization.",
            topics: [
              {
                id: "dsa-graph-bfs-dfs",
                title: "Graph BFS/DFS & Topological Sort (Kahn's)",
                subtitle:
                  "Course Schedule dependency DAGs, cycle detection & in-degree queues",
                status: "in_progress",
                durationMinutes: 45,
                readinessScore: 70,
                companyRelevance: `${company} High Frequency`,
                priority: "High",
                practiceHref: "/practice/session/coding?topic=graph-bfs-dfs",
                type: "coding",
                whatToImprove: [
                  "Cycle detection in directed graphs using 3-color states.",
                ],
                cheatSheetSummary: [
                  "Topological sort exists ONLY in Directed Acyclic Graphs (DAGs).",
                ],
              },
              {
                id: "dsa-dp-knapsack",
                title: "Dynamic Programming: Knapsack & Subsequence",
                subtitle:
                  "Recurrence relations, memoization tables & space compression",
                status: "upcoming",
                durationMinutes: 45,
                readinessScore: 50,
                companyRelevance: `${company} Hard Screen`,
                priority: "High",
                practiceHref:
                  "/practice/session/coding?topic=dynamic-programming-patterns",
                type: "coding",
                whatToImprove: [
                  "Formulating state transitions before writing code.",
                ],
                cheatSheetSummary: [
                  "DP = Optimal Substructure + Overlapping Subproblems.",
                ],
              },
            ],
          },
        ],
      });
    }

    // 3. CS Fundamentals (OS & DBMS) - specifically for Freshers or Foundations
    if (activeDomainKeys.includes("cs-fundamentals")) {
      nodes.push({
        id: "node-cs-fundamentals",
        domainKey: "cs-fundamentals",
        title: "CS Fundamentals: OS & DBMS",
        subtitle: "Processes, deadlocks, SQL joins & B-Tree indexing",
        categoryBadge: "CS CORE · 25% WEIGHT",
        domainSlug: "backend-engineering",
        status: "in_progress",
        tier: 1,
        column: "right",
        durationMinutes: 40,
        totalSegments: 4,
        completedSegments: 2,
        scoreXP: 100,
        readinessScore: 60,
        weightPercent: 25,
        companyRelevance: `${company} Core CS`,
        categories: [
          {
            id: "cat-fresher-dbms",
            title: "DBMS & SQL Query Mastery",
            description:
              "Multi-table joins, indexing, and ACID transaction guarantees.",
            topics: [
              {
                id: "fresher-sql-joins",
                title: "SQL Joins & Aggregations (GROUP BY, HAVING)",
                subtitle:
                  "INNER vs LEFT JOIN, aggregate filtering, and subqueries",
                status: "mastered",
                durationMinutes: 30,
                readinessScore: 92,
                companyRelevance: `${company} Standard`,
                priority: "High",
                practiceHref:
                  "/practice/session/coding?topic=sql-window-functions",
                type: "coding",
                whatToImprove: [
                  "WHERE filters rows before grouping; HAVING filters aggregated groups.",
                ],
                cheatSheetSummary: [
                  "LEFT JOIN returns all left rows plus matching right rows.",
                ],
              },
              {
                id: "fresher-db-indexing",
                title: "Database Indexing & B-Trees",
                subtitle:
                  "Primary keys, composite indexes, and index selectivity",
                status: "critical_gap",
                durationMinutes: 30,
                readinessScore: 40,
                companyRelevance: `${company} Interview Trap`,
                priority: "High",
                practiceHref:
                  "/practice/session/system-design?topic=database-indexing-and-query-optimization",
                type: "system-design",
                whatToImprove: [
                  "Leftmost prefix rule in composite indexes (colA, colB).",
                ],
                cheatSheetSummary: [
                  "B+ trees keep table pointers at leaf nodes linked for fast sequential scans.",
                ],
              },
            ],
          },
        ],
      });
    }

    // 4. System Design & Distributed Scalability
    if (activeDomainKeys.includes("system-design")) {
      nodes.push({
        id: "node-system-design",
        domainKey: "system-design",
        title: "System Design & Distributed Scalability",
        subtitle: "Sharding, consistent hashing, Redis caching & CAP theorem",
        categoryBadge: "SYS DESIGN · 30% WEIGHT",
        domainSlug: "system-design",
        status: "in_progress",
        tier: 2,
        column: "left",
        durationMinutes: 50,
        totalSegments: 4,
        completedSegments: 2,
        scoreXP: 130,
        readinessScore: 65,
        weightPercent: 30,
        companyRelevance: `${company} Core Architecture Round`,
        categories: [
          {
            id: "cat-sys-partitioning",
            title: "Data Partitioning & Scalability",
            description:
              "Consistent hashing, sharding strategies, and replication topologies.",
            topics: [
              {
                id: "sys-consistent-hashing",
                title: "Consistent Hashing & Virtual Nodes",
                subtitle:
                  "Rehashing minimization, ring partitions & hot-spot load distribution",
                status: "mastered",
                durationMinutes: 45,
                readinessScore: 90,
                companyRelevance: `${company} Core Round`,
                priority: "High",
                practiceHref:
                  "/practice/session/system-design?topic=microservices-and-distributed-transactions",
                type: "system-design",
                whatToImprove: [
                  "Virtual node allocation math to achieve uniform probability distribution.",
                ],
                cheatSheetSummary: [
                  "Consistent Hashing maps both servers and keys to a 360-degree hash ring.",
                  "When a node is added/removed, only k/N keys need remapping on average.",
                ],
              },
              {
                id: "sys-db-sharding",
                title: "Database Sharding & Partition Keys",
                subtitle:
                  "Horizontal partitioning, cross-shard joins & distributed primary keys",
                status: "in_progress",
                durationMinutes: 50,
                readinessScore: 60,
                companyRelevance: `${company} High Frequency`,
                priority: "High",
                practiceHref:
                  "/practice/session/system-design?topic=database-indexing-and-query-optimization",
                type: "system-design",
                whatToImprove: [
                  "Avoid partition skew by picking high-cardinality shard keys.",
                ],
                cheatSheetSummary: [
                  "Range-based sharding causes write hot spots on latest timestamps.",
                  "Hash-based sharding evenly distributes load but makes range scans expensive.",
                ],
              },
            ],
          },
          {
            id: "cat-sys-caching",
            title: "Caching Strategies & API Resilience",
            description:
              "Distributed rate limiters, token bucket, Redis clustering, and circuit breakers.",
            topics: [
              {
                id: "sys-rate-limiter",
                title: "Distributed Rate Limiter & Token Bucket",
                subtitle:
                  "Sliding window logs, Redis Lua atomic counters & client headers",
                status: "in_progress",
                durationMinutes: 40,
                readinessScore: 65,
                companyRelevance: `${company} Top Priority`,
                priority: "High",
                practiceHref:
                  "/practice/session/system-design?topic=load-balancing-and-reverse-proxies",
                type: "system-design",
                whatToImprove: [
                  "Race conditions during Redis read-increment-expire without Lua scripting.",
                ],
                cheatSheetSummary: [
                  "Token Bucket allows bursts up to bucket capacity while enforcing steady rate.",
                ],
              },
            ],
          },
        ],
      });
    }

    // 5. Low-Level Design (LLD) & Machine Coding
    if (activeDomainKeys.includes("lld")) {
      nodes.push({
        id: "node-lld-machine-coding",
        domainKey: "lld",
        title: "Low-Level Design & Machine Coding (LLD)",
        subtitle: "Design patterns, SOLID principles, UML & clean concurrency",
        categoryBadge: "LLD · HIGH FREQUENCY",
        domainSlug: "low-level-design",
        status: "upcoming",
        tier: 2,
        column: "center",
        durationMinutes: 45,
        totalSegments: 4,
        completedSegments: 0,
        scoreXP: 125,
        readinessScore: 45,
        weightPercent: 20,
        companyRelevance: `${company} Machine Coding Screen`,
        categories: [
          {
            id: "cat-lld-patterns",
            title: "Design Patterns & SOLID Principles",
            description:
              "Strategy, Factory, Observer, Decorator, and clean extensible class architecture.",
            topics: [
              {
                id: "lld-parking-lot",
                title: "Design a Multi-Floor Parking Lot System",
                subtitle:
                  "Slot allocation strategies, vehicle hierarchies & concurrency-safe ticketing",
                status: "in_progress",
                durationMinutes: 45,
                readinessScore: 60,
                companyRelevance: `${company} Classic LLD`,
                priority: "High",
                practiceHref: "/practice/session/system-design",
                type: "system-design",
                whatToImprove: [
                  "Enforcing Single Responsibility: separating payment processing from spot tracking.",
                ],
                cheatSheetSummary: [
                  "Use Strategy Pattern for dynamic vehicle pricing algorithms.",
                ],
              },
              {
                id: "lld-rate-limiter-class",
                title: "Machine Coding: In-Memory Rate Limiter",
                subtitle:
                  "Object-oriented implementation of token bucket and sliding log",
                status: "upcoming",
                durationMinutes: 40,
                readinessScore: 45,
                companyRelevance: `${company} Practical Code`,
                priority: "High",
                practiceHref: "/practice/session/coding",
                type: "coding",
                whatToImprove: [
                  "Thread-safe state mutation using mutex locks or synchronized blocks.",
                ],
                cheatSheetSummary: [
                  "Expose clean interfaces: isAllowed(userId) returning boolean.",
                ],
              },
            ],
          },
        ],
      });
    }

    // 6. Cloud, DevOps & Kubernetes (SRE)
    if (activeDomainKeys.includes("cloud-devops")) {
      nodes.push({
        id: "node-cloud-devops",
        domainKey: "cloud-devops",
        title: "Cloud, DevOps & Kubernetes (SRE)",
        subtitle: "Multi-region VPCs, K8s pod scheduling, Terraform & CI/CD",
        categoryBadge: "SRE · CLOUD TRACK",
        domainSlug: "cloud-devops",
        status: "upcoming",
        tier: 2,
        column: "right",
        durationMinutes: 45,
        totalSegments: 4,
        completedSegments: 0,
        scoreXP: 120,
        readinessScore: 40,
        weightPercent: 20,
        companyRelevance: `${company} Infrastructure Round`,
        categories: [
          {
            id: "cat-cloud-k8s",
            title: "Kubernetes & Multi-Region Resiliency",
            description:
              "Ingress controllers, autoscaling, node affinity, and active-active failover.",
            topics: [
              {
                id: "cloud-k8s-architecture",
                title: "Kubernetes Pod Scheduling, Ingress & Mesh",
                subtitle:
                  "Node affinity, taints/tolerations, Envoy proxy & traffic splitting",
                status: "upcoming",
                durationMinutes: 45,
                readinessScore: 40,
                companyRelevance: `${company} Infrastructure Standard`,
                priority: "High",
                practiceHref:
                  "/practice/session/cloud?topic=kubernetes-architecture",
                type: "system-design",
                whatToImprove: [
                  "Graceful termination timing: preStop hook vs SIGTERM drain in kubelet.",
                ],
                cheatSheetSummary: [
                  "Taints repel pods; Tolerations allow pods to schedule on tainted nodes.",
                ],
              },
            ],
          },
        ],
      });
    }

    // 7. AI System Design & GenAI Infra
    if (activeDomainKeys.includes("ai-system-design")) {
      nodes.push({
        id: "node-ai-system-design",
        domainKey: "ai-system-design",
        title: "AI System Design & GenAI Infra",
        subtitle:
          "Vector search, RAG pipelines, LLM serving, PagedAttention & quantization",
        categoryBadge: "GENAI · HIGH YIELD",
        domainSlug: "ai-system-design",
        status: "upcoming",
        tier: 2,
        column: "right",
        durationMinutes: 50,
        totalSegments: 4,
        completedSegments: 0,
        scoreXP: 135,
        readinessScore: 40,
        weightPercent: 20,
        companyRelevance: `${company} AI Platform & GenAI Track`,
        categories: [
          {
            id: "cat-ai-rag",
            title: "RAG, Vector DBs & Semantic Caching",
            description:
              "Chunking strategies, hybrid search (BM25 + dense), HNSW indexing, and cross-encoder re-ranking.",
            topics: [
              {
                id: "ai-rag-pipeline",
                title: "Design High-Throughput RAG & Vector Database",
                subtitle:
                  "HNSW indexing, cross-encoders, hallucination guardrails & semantic caching",
                status: "upcoming",
                durationMinutes: 50,
                readinessScore: 45,
                companyRelevance: `${company} AI Platform`,
                priority: "High",
                practiceHref:
                  "/practice/session/system-design?topic=vector-databases-and-rag-pipeline",
                type: "system-design",
                codeSnippet: `// RAG Semantic Cache & Hybrid Retrieval Pipeline
import { HNSWLib } from 'langchain/vectorstores/hnswlib';

// 1. Check semantic cache before invoking expensive LLM
const cached = await redisSemanticCache.get(queryEmbedding);
if (cached && cached.similarity > 0.95) return cached.response;

// 2. Hybrid Retrieval: Dense Vector (HNSW) + Sparse Keyword (BM25)
const [denseDocs, sparseDocs] = await Promise.all([
  vectorIndex.similaritySearch(queryEmbedding, 20),
  bm25Engine.search(rawQuery, 20),
]);

// 3. Reciprocal Rank Fusion (RRF) & Cross-Encoder Re-Ranking
const topKDocs = crossEncoder.rerank([...denseDocs, ...sparseDocs], 5);`,
                whatToImprove: [
                  "Latency bottlenecks in dense embedding generation during high-QPS user queries.",
                  "Context window fragmentation and lost-in-the-middle phenomenon in long prompts.",
                  "Vector database index rebuild lag during high-frequency document updates.",
                ],
                cheatSheetSummary: [
                  "HNSW provides logarithmic sub-millisecond approximate nearest neighbor search.",
                  "Hybrid Search (Dense + BM25) with Reciprocal Rank Fusion avoids semantic drift.",
                  "Cross-encoders are accurate but slow; use bi-encoders for retrieval, cross-encoders only for top-k rerank.",
                ],
              },
              {
                id: "ai-agent-protocols",
                title: "AI Agents & Production MCP Tool Calling",
                subtitle:
                  "Multi-agent durable execution, structured output validation & enterprise safety",
                status: "upcoming",
                durationMinutes: 45,
                readinessScore: 40,
                companyRelevance: `${company} Agent Systems`,
                priority: "High",
                practiceHref:
                  "/practice/session/system-design?topic=agentic-workflows",
                type: "system-design",
                whatToImprove: [
                  "Infinite tool invocation loops and unbounded context degradation in autonomous agents.",
                  "Lack of idempotency keys in financial/mutation tool calls by AI agents.",
                ],
                cheatSheetSummary: [
                  "Use durable state machines (Temporal/Inngest) to manage long-running multi-turn agent execution.",
                  "Enforce JSON Schema validation on model function calling with constrained sampling.",
                ],
              },
            ],
          },
          {
            id: "cat-llm-serving",
            title: "LLM Serving & Inference Optimizations",
            description:
              "Continuous batching, PagedAttention, KV cache management, and GPU scheduling.",
            topics: [
              {
                id: "llm-vllm-serving",
                title: "High-Throughput LLM Serving & PagedAttention",
                subtitle:
                  "PagedAttention (vLLM), continuous batching, FP8/AWQ quantization & speculative decoding",
                status: "upcoming",
                durationMinutes: 50,
                readinessScore: 35,
                companyRelevance: `${company} Core Model Infra`,
                priority: "High",
                practiceHref:
                  "/practice/session/system-design?topic=llm-serving-infra",
                type: "system-design",
                whatToImprove: [
                  "GPU memory fragmentation caused by static KV cache pre-allocation per request.",
                  "Time-to-First-Token (TTFT) vs Inter-Token-Latency (ITL) trade-offs under high concurrency.",
                ],
                cheatSheetSummary: [
                  "PagedAttention treats KV cache like virtual memory pages, reducing memory waste from 60% to < 4%.",
                  "Continuous Batching injects new prompt requests at iteration boundaries instead of waiting for full generation to finish.",
                  "Speculative decoding uses a small draft model to generate tokens validated in parallel by the target LLM.",
                ],
              },
            ],
          },
        ],
      });
    }

    // 8. Data Engineering & Big Data Systems
    if (activeDomainKeys.includes("data-engineering")) {
      nodes.push({
        id: "node-data-engineering",
        domainKey: "data-engineering",
        title: "Data Engineering & Big Data Systems",
        subtitle: "Spark, distributed ETL, Kafka streaming & data lakes",
        categoryBadge: "BIG DATA · PIPELINES",
        domainSlug: "data-engineering",
        status: "upcoming",
        tier: 2,
        column: "left",
        durationMinutes: 45,
        totalSegments: 4,
        completedSegments: 0,
        scoreXP: 120,
        readinessScore: 40,
        weightPercent: 20,
        companyRelevance: `${company} Data Platform`,
        categories: [
          {
            id: "cat-data-spark",
            title: "Distributed Stream & Batch Ingestion",
            description:
              "Apache Spark partitions, Kafka consumer groups, and lakehouse storage.",
            topics: [
              {
                id: "data-spark-streaming",
                title: "Apache Spark Partitioning & Shuffle Tuning",
                subtitle:
                  "Wide vs narrow transformations, broadcast joins & skew handling",
                status: "upcoming",
                durationMinutes: 45,
                readinessScore: 40,
                companyRelevance: `${company} Big Data Screen`,
                priority: "High",
                practiceHref: "/practice/session/system-design",
                type: "system-design",
                whatToImprove: [
                  "Preventing expensive disk shuffles by broadcasting small lookup tables.",
                ],
                cheatSheetSummary: [
                  "Narrow transformations (map, filter) execute in memory without shuffle.",
                ],
              },
            ],
          },
        ],
      });
    }

    // 9. STAR Behavioral & Incident Leadership
    if (activeDomainKeys.includes("behavioral")) {
      nodes.push({
        id: "node-behavioral-leadership",
        domainKey: "behavioral",
        title: "STAR & Incident Leadership",
        subtitle: "Handling P1 outages, blameless culture & technical conflict",
        categoryBadge: "STAR · 15% WEIGHT",
        domainSlug: "behavioral-leadership",
        status: "upcoming",
        tier: 3,
        column: "center",
        durationMinutes: 40,
        totalSegments: 4,
        completedSegments: 0,
        scoreXP: 100,
        readinessScore: 50,
        weightPercent: 15,
        companyRelevance: `${company} Culture Fit`,
        categories: [
          {
            id: "cat-beh-outages",
            title: "Incident Response & Production Leadership",
            description:
              "Post-mortems, root cause analysis, and blameless engineering culture.",
            topics: [
              {
                id: "beh-outage-response",
                title: "Handling High-Severity Production Outages",
                subtitle:
                  "Post-mortem root cause, blameless culture & mitigating blast radius",
                status: "mastered",
                durationMinutes: 30,
                readinessScore: 92,
                companyRelevance: `${company} Core Principle`,
                priority: "High",
                practiceHref: "/practice/session/behavioral",
                type: "behavioral",
                whatToImprove: [
                  "Quantifying blast radius and mean time to recovery (MTTR).",
                ],
                cheatSheetSummary: [
                  "STAR: Situation (15%), Task (10%), Action (55%), Result (20%).",
                ],
              },
            ],
          },
        ],
      });
    }

    // 10. Tier 4: Final Boss Mock Screen (Always included as the capstone)
    nodes.push({
      id: "node-final-mock",
      domainKey: "simulation",
      title: "Full 60-Min AI Voice Mock Interview Simulation",
      subtitle: `${company} Bar Raiser: System design probe, ${selectedLanguage} concurrency & behavioral`,
      categoryBadge: "SIMULATION · FINAL BOSS",
      domainSlug: "simulation",
      status: "upcoming",
      tier: 4,
      column: "wide",
      durationMinutes: 60,
      totalSegments: 4,
      completedSegments: 0,
      scoreXP: 250,
      readinessScore: 20,
      weightPercent: 100,
      companyRelevance: `${company} Final Bar Raiser`,
      categories: [
        {
          id: "cat-final-mock",
          title: "Complete Technical Simulation",
          description:
            "End-to-end technical discussion, trade-offs, and live scoring.",
          topics: [
            {
              id: "live-mock-session",
              title: "Live Technical Screen Simulation",
              subtitle:
                "Simulated tech screen with live follow-up probes and rubric scoring",
              status: "upcoming",
              durationMinutes: 60,
              readinessScore: 20,
              companyRelevance: `${company} Bar Raiser`,
              priority: "High",
              practiceHref: "/practice/session",
              type: "system-design",
              whatToImprove: [
                "Verbalizing trade-offs clearly before proposing solutions.",
              ],
              cheatSheetSummary: [
                "PEDAC/RESHADED framework for system design.",
              ],
            },
          ],
        },
      ],
    });

    return {
      domainGraphNodes: nodes,
    };
  }, [
    activeDomainKeys,
    selectedLanguage,
    isFresher,
    company,
    completedActivities,
    targetRole,
    roleLower,
    evaluationResult,
  ]);

  const tier1Nodes = domainGraphNodes.filter((n) => n.tier === 1);
  const tier2Nodes = domainGraphNodes.filter((n) => n.tier === 2);
  const tier3Nodes = domainGraphNodes.filter((n) => n.tier === 3);
  const tier4Nodes = domainGraphNodes.filter((n) => n.tier === 4);

  // Helper to render individual Domain Node Card in the Graph matching reference image
  const renderGraphNodeCard = (node: DomainGraphNode) => {
    const isMastered = node.status === "mastered";
    const isInProgress = node.status === "in_progress";
    const isSelected = selectedDomainNode?.id === node.id;

    return (
      <div
        key={node.id}
        onClick={() => {
          setSelectedDomainNode(node);
          setExpandedSnippetTopicId(null);
        }}
        className={`group relative flex flex-col justify-between rounded-2xl p-4 sm:p-5 transition-all duration-200 cursor-pointer select-none h-full ${
          isMastered
            ? "border-2 border-amber-400 bg-[#fffdf7] shadow-[0_8px_30px_rgba(245,158,11,0.12)] hover:shadow-[0_12px_36px_rgba(245,158,11,0.2)]"
            : isInProgress
              ? "border border-blue-200 bg-white shadow-[0_8px_30px_rgba(59,130,246,0.12)] hover:shadow-[0_12px_36px_rgba(59,130,246,0.2)]"
              : "border border-line bg-white shadow-sm hover:border-brand/40 hover:shadow-md"
        } ${isSelected ? "ring-2 ring-brand ring-offset-2" : ""}`}
      >
        {/* Top Accent Bar (Blue for In Progress, Gold for Mastered) */}
        <div
          className={`absolute inset-x-0 -top-px h-1.5 rounded-t-2xl ${
            isMastered
              ? "bg-amber-400"
              : isInProgress
                ? "bg-[#3b82f6]"
                : "bg-transparent"
          }`}
        />

        {/* Anchor Pins on Edges (Visual connection ports matching uploaded image) */}
        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 size-2.5 rounded-full border-2 border-white bg-cyan-400 shadow-xs" />
        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 size-2.5 rounded-full border-2 border-white bg-cyan-400 shadow-xs" />
        <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 size-2.5 rounded-full border-2 border-white bg-cyan-400 shadow-xs" />
        <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 size-2.5 rounded-full border-2 border-white bg-cyan-400 shadow-xs" />

        {/* Card Header: Icon + Category Badge + Sparkle for Mastered */}
        <div className="flex items-start justify-between gap-2 pt-1">
          <div className="flex items-center gap-2.5">
            <div
              className={`flex size-9 shrink-0 items-center justify-center rounded-xl shadow-xs ${
                isMastered
                  ? "bg-[#fef08a] text-amber-700"
                  : isInProgress
                    ? "bg-[#3b82f6] text-white"
                    : "bg-cream text-ink-muted"
              }`}
            >
              <BookOpen className="size-4.5" />
            </div>

            <div className="flex flex-col">
              <span
                className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-black tracking-wider uppercase w-fit ${
                  isMastered
                    ? "bg-[#fef08a] text-amber-900"
                    : isInProgress
                      ? "bg-[#3b82f6] text-white"
                      : "bg-[#f4efe8] text-ink-muted"
                }`}
              >
                {node.categoryBadge}
              </span>
            </div>
          </div>

          {isMastered && (
            <div className="flex items-center gap-1">
              <Sparkles className="size-4 text-amber-500 fill-amber-400 animate-pulse" />
            </div>
          )}
        </div>

        {/* Title & Subtitle */}
        <div className="flex flex-col gap-1 py-3">
          <h4 className="font-display text-sm sm:text-base font-bold text-ink leading-snug group-hover:text-brand transition-colors line-clamp-1">
            {node.title}
          </h4>
          <p className="text-xs text-ink-muted line-clamp-1 leading-relaxed">
            {node.subtitle}
          </p>
        </div>

        {/* Metadata Row: Duration & Details */}
        <div className="flex items-center justify-between text-xs text-ink-muted pb-3">
          <div className="flex items-center gap-1.5">
            <Clock className="size-3.5" />
            <span className="font-semibold">{node.durationMinutes} min</span>
          </div>

          <span className="text-[11px] font-bold text-ink-muted/80 truncate max-w-[120px]">
            {node.companyRelevance.split(" ")[0]} Priority
          </span>
        </div>

        {/* Segmented Progress Bar (4 dashes matching uploaded reference image) */}
        <div className="flex items-center gap-1.5 pb-4">
          {Array.from({ length: node.totalSegments }).map((_, idx) => {
            const isFilled = idx < node.completedSegments;
            return (
              <div
                key={idx}
                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                  isMastered
                    ? "bg-amber-400"
                    : isFilled
                      ? "bg-[#3b82f6]"
                      : "bg-[#f4efe8]"
                }`}
              />
            );
          })}
        </div>

        {/* Bottom Row: CTA Button + XP Score Pill */}
        <div className="flex items-center justify-between gap-2 pt-1 border-t border-line/60">
          {isMastered ? (
            <div className="inline-flex items-center gap-1.5 rounded-xl bg-amber-400 px-4 py-1.5 text-xs font-black text-amber-950 shadow-xs">
              <Trophy className="size-3.5 fill-amber-950" />
              <span>Mastered</span>
            </div>
          ) : isInProgress ? (
            <div className="inline-flex items-center gap-1.5 rounded-xl bg-[#3b82f6] px-4 py-1.5 text-xs font-black text-white shadow-xs group-hover:bg-blue-600 transition-colors">
              <ChevronRight className="size-3.5 stroke-[3]" />
              <span>Continue</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-white px-4 py-1.5 text-xs font-black text-ink shadow-2xs group-hover:bg-cream transition-colors">
              <ChevronRight className="size-3.5 stroke-[3] text-ink-muted" />
              <span>Inspect</span>
            </div>
          )}

          <div
            className={`flex items-center justify-center rounded-xl px-3 py-1 text-xs font-black tracking-tight ${
              isMastered
                ? "bg-[#fef08a] text-amber-900 border border-amber-300"
                : isInProgress
                  ? "bg-[#eff6ff] text-blue-700 border border-blue-200"
                  : "bg-[#fbf9f4] text-ink-muted border border-line"
            }`}
          >
            {node.scoreXP}
          </div>
        </div>
      </div>
    );
  };

  // Helper to render a tier's nodes with responsive balancing and centering of single orphan nodes
  const renderTierNodes = (nodes: DomainGraphNode[]) => {
    if (nodes.length === 0) return null;

    // Single domain in the tier: always centered with max-w-md
    if (nodes.length === 1) {
      return (
        <div className="flex justify-center w-full max-w-md mx-auto">
          <div className="w-full">{renderGraphNodeCard(nodes[0])}</div>
        </div>
      );
    }

    // 2 domains: balanced 2-column grid
    if (nodes.length === 2) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 max-w-4xl gap-5 lg:gap-8 w-full mx-auto">
          {nodes.map((node) => (
            <div key={node.id} className="w-full">
              {renderGraphNodeCard(node)}
            </div>
          ))}
        </div>
      );
    }

    // 3 or more domains:
    // In a 3-column layout on desktop:
    // If the last row has only 1 domain (e.g. 4th node in a 4-node set, or 7th in a 7-node set),
    // it gets `lg:col-start-2` so it sits in the middle column of that row instead of the left!
    // In a 2-column layout on tablet (md):
    // If the last row has only 1 domain (e.g. 3rd node or 5th node),
    // it gets `md:col-span-2 md:max-w-md md:mx-auto` so it is centered across the 2 columns!
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-8 w-full max-w-6xl mx-auto">
        {nodes.map((node, idx) => {
          const isAloneOnLastRow3Col =
            nodes.length % 3 === 1 && idx === nodes.length - 1;
          const isAloneOnLastRow2Col =
            nodes.length % 2 === 1 && idx === nodes.length - 1;

          let colClass = "w-full";
          if (isAloneOnLastRow3Col && isAloneOnLastRow2Col) {
            colClass =
              "w-full md:col-span-2 md:max-w-md md:mx-auto lg:col-span-1 lg:col-start-2 lg:max-w-none";
          } else if (isAloneOnLastRow3Col) {
            colClass = "w-full lg:col-start-2";
          } else if (isAloneOnLastRow2Col) {
            colClass =
              "w-full md:col-span-2 md:max-w-md md:mx-auto lg:col-span-1 lg:col-start-auto lg:max-w-none";
          }

          return (
            <div key={node.id} className={colClass}>
              {renderGraphNodeCard(node)}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <section className="relative flex flex-col gap-6 w-full rounded-3xl border border-line bg-[#faf8f5] p-5 sm:p-8 lg:p-10 shadow-[0_8px_30px_rgba(30,28,26,0.03)] overflow-hidden">
      {/* Subtle Dot Grid Canvas Pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage: "radial-gradient(#d6cfc4 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* 1. HEADER: AI Candidate Profile Calibration & Stack Switcher */}
      <div className="relative z-30 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 pb-4 border-b border-line">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand shadow-xs">
            <BrainCircuit className="size-5" />
          </div>

          <div className="flex items-center gap-2 flex-wrap min-w-0">
            <span className="inline-flex items-center gap-1 rounded-full bg-brand-soft px-2.5 py-1 text-[11px] font-extrabold text-brand uppercase tracking-wider">
              <Sparkles className="size-3" />
              AI Profile Evaluator
            </span>
            <span className="rounded-full bg-cream border border-line px-2.5 py-1 text-xs font-bold text-ink truncate">
              🎯 {evaluationResult.personaLabel}
            </span>
            <span className="text-xs font-semibold text-ink-muted truncate">
              · Calibrated for {targetRole} ({company} Bar)
            </span>
          </div>
        </div>

        {/* Primary Language / Tech Stack Switcher */}
        {!isFresher && (
          <div className="relative self-start sm:self-auto shrink-0 z-40">
            <button
              type="button"
              onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
              className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-bold shadow-xs transition-all cursor-pointer ${
                isLanguageDropdownOpen
                  ? "border-emerald-500 bg-[#dcfce7] text-emerald-950 ring-2 ring-emerald-500/20"
                  : "border-emerald-300 bg-[#f0fdf4] text-emerald-900 hover:bg-[#dcfce7]"
              }`}
              aria-expanded={isLanguageDropdownOpen}
            >
              <Code2 className="size-4 text-emerald-600" />
              <span className="text-[11px] font-medium text-emerald-800/80">
                Primary Stack:
              </span>
              <span className="font-extrabold text-emerald-950">
                {selectedLanguage}
              </span>
              <ChevronDown
                className={`size-3.5 text-emerald-700 transition-transform duration-200 ${
                  isLanguageDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isLanguageDropdownOpen && (
              <>
                {/* Backdrop to close dropdown on click outside */}
                <div
                  className="fixed inset-0 z-40 cursor-default"
                  onClick={() => setIsLanguageDropdownOpen(false)}
                  aria-hidden="true"
                />

                <div className="absolute left-0 sm:left-auto sm:right-0 top-full mt-2 z-50 w-72 rounded-2xl border border-slate-200 bg-white p-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.18)] ring-1 ring-black/5 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between px-3 py-1.5 border-b border-line mb-1.5">
                    <span className="text-[11px] font-extrabold text-ink uppercase tracking-wider">
                      Declared Tech Stack
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      {supportedLanguages.length} Available
                    </span>
                  </div>

                  <div className="flex flex-col gap-1 max-h-72 overflow-y-auto">
                    {supportedLanguages.map((lang) => {
                      const isSelected = selectedLanguage === lang.name;
                      return (
                        <button
                          key={lang.name}
                          type="button"
                          onClick={() => {
                            setSelectedLanguage(lang.name);
                            setIsLanguageDropdownOpen(false);
                          }}
                          className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-left transition-all cursor-pointer ${
                            isSelected
                              ? "bg-emerald-50 text-emerald-950 border border-emerald-300 shadow-xs"
                              : "hover:bg-cream text-ink border border-transparent"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div
                              className={`flex size-6 shrink-0 items-center justify-center rounded-lg ${
                                isSelected
                                  ? "bg-emerald-600 text-white"
                                  : "bg-slate-100 text-slate-500"
                              }`}
                            >
                              {isSelected ? (
                                <Check className="size-3.5 stroke-[3]" />
                              ) : (
                                <Code2 className="size-3.5" />
                              )}
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="truncate">{lang.name}</span>
                              <span className="text-[10px] text-ink-muted font-normal truncate">
                                {lang.runtime}
                              </span>
                            </div>
                          </div>
                          <span
                            className={`shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-bold border ${
                              isSelected
                                ? "bg-white border-emerald-300 text-emerald-800"
                                : "bg-white border-line text-ink-muted"
                            }`}
                          >
                            {lang.badge}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* 2. DYNAMIC DOMAIN CUSTOMIZATION TOOLBAR: Add or toggle any required interview domain */}
      <div className="relative z-10 flex flex-col gap-2.5 rounded-2xl border border-line/80 bg-white/80 p-3.5 backdrop-blur-xs">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-xs font-extrabold text-ink uppercase tracking-wider flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-brand" />
            <span>
              Active Interview Domains in Graph ({activeDomainKeys.length})
            </span>
          </span>
          <span className="text-[11px] text-ink-muted">
            Click to toggle or add any domain required for your specific
            interview loop:
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {Object.entries(allAvailableDomains).map(([key, dom]) => {
            const isActive = activeDomainKeys.includes(key);
            const DomIcon = dom.icon;

            return (
              <button
                key={key}
                type="button"
                onClick={() => toggleDomain(key)}
                className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? "bg-ink text-white shadow-xs ring-1 ring-ink"
                    : "bg-[#fbf9f4] text-ink-muted hover:text-ink hover:bg-cream border border-line"
                }`}
              >
                <DomIcon
                  className={`size-3.5 ${isActive ? "text-cyan-300" : "text-ink-muted"}`}
                />
                <span>{dom.name}</span>
                {isActive ? (
                  <span className="text-[10px] text-white/70 ml-1 font-normal">
                    ✕
                  </span>
                ) : (
                  <Plus className="size-3 text-ink-muted ml-0.5" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. THE VISUAL GRAPH FORMAT CANVAS (Adapts dynamically to all active domains) */}
      <div className="relative z-10 flex flex-col items-center gap-12 sm:gap-16 pt-4 pb-8 w-full max-w-6xl mx-auto">
        {/* TOP ROOT HUB: Circular Glowing Orb matching the uploaded image */}
        <div className="relative flex flex-col items-center">
          {/* Glowing Animated Ambient Ring */}
          <div className="absolute -inset-4 rounded-full bg-cyan-400/20 blur-xl animate-pulse" />

          {/* Main Circular Hub */}
          <div className="relative flex size-32 sm:size-36 flex-col items-center justify-center rounded-full border-4 border-cyan-400 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 p-3 text-center text-white shadow-[0_12px_40px_rgba(6,182,212,0.3)]">
            {/* Outer Anchor Pins */}
            <div className="absolute -top-1.5 size-3 rounded-full border-2 border-white bg-cyan-400" />
            <div className="absolute -bottom-1.5 size-3 rounded-full border-2 border-white bg-cyan-400" />
            <div className="absolute -left-1.5 size-3 rounded-full border-2 border-white bg-cyan-400" />
            <div className="absolute -right-1.5 size-3 rounded-full border-2 border-white bg-cyan-400" />
            <div className="absolute top-3 left-3 size-2.5 rounded-full border-2 border-white bg-cyan-400" />
            <div className="absolute top-3 right-3 size-2.5 rounded-full border-2 border-white bg-cyan-400" />
            <div className="absolute bottom-3 left-3 size-2.5 rounded-full border-2 border-white bg-cyan-400" />
            <div className="absolute bottom-3 right-3 size-2.5 rounded-full border-2 border-white bg-cyan-400" />

            <div className="flex size-9 items-center justify-center rounded-full bg-white/10 mb-1">
              <BookOpen className="size-5 text-cyan-300" />
            </div>

            <span className="font-display text-[10px] sm:text-[11px] font-black tracking-wider uppercase text-cyan-200">
              BEGIN YOUR JOURNEY
            </span>

            <span className="rounded-full bg-white/20 px-2 py-0.5 text-[9px] font-bold text-cyan-300 mt-1 uppercase tracking-widest">
              START HERE
            </span>
          </div>

          {/* SVG Connectors: Branching out from Root Hub to Tier 1 */}
          <div className="hidden lg:block absolute top-full left-1/2 -translate-x-1/2 w-[850px] h-16 pointer-events-none">
            <svg className="w-full h-full overflow-visible">
              <path
                d="M 425 0 C 425 35, 140 10, 140 64"
                fill="none"
                stroke="#818cf8"
                strokeWidth="2.5"
                strokeDasharray="5 5"
                className="opacity-75"
              />
              <path
                d="M 425 0 C 425 25, 425 40, 425 64"
                fill="none"
                stroke="#818cf8"
                strokeWidth="2.5"
                strokeDasharray="5 5"
                className="opacity-75"
              />
              <path
                d="M 425 0 C 425 35, 710 10, 710 64"
                fill="none"
                stroke="#818cf8"
                strokeWidth="2.5"
                strokeDasharray="5 5"
                className="opacity-75"
              />
            </svg>
          </div>
        </div>

        {/* TIER 1: Foundations & DSA (3 Branches: Left, Center, Right) */}
        {tier1Nodes.length > 0 && (
          <div className="w-full flex flex-col gap-3">
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-ink-muted/80 bg-cream border border-line px-3 py-1 rounded-full">
                Phase 01 · Runtime Foundations & DSA (Data Structure &
                Algorithm)
              </span>
            </div>

            {renderTierNodes(tier1Nodes)}
          </div>
        )}

        {/* SVG Connectors: Tier 1 to Tier 2 */}
        {tier2Nodes.length > 0 && (
          <div className="hidden lg:block w-[850px] h-12 -my-8 pointer-events-none">
            <svg className="w-full h-full overflow-visible">
              <path
                d="M 140 0 C 140 30, 215 20, 215 48"
                fill="none"
                stroke="#818cf8"
                strokeWidth="2"
                strokeDasharray="5 5"
                className="opacity-60"
              />
              <path
                d="M 425 0 C 425 25, 425 35, 425 48"
                fill="none"
                stroke="#818cf8"
                strokeWidth="2"
                strokeDasharray="5 5"
                className="opacity-60"
              />
              <path
                d="M 710 0 C 710 30, 635 20, 635 48"
                fill="none"
                stroke="#818cf8"
                strokeWidth="2"
                strokeDasharray="5 5"
                className="opacity-60"
              />
            </svg>
          </div>
        )}

        {/* TIER 2: Architecture, LLD, Systems & Cloud */}
        {tier2Nodes.length > 0 && (
          <div className="w-full flex flex-col gap-3">
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-ink-muted/80 bg-cream border border-line px-3 py-1 rounded-full">
                Phase 02 · Architecture, Distributed Systems & Specialized
                Domains
              </span>
            </div>

            {renderTierNodes(tier2Nodes)}
          </div>
        )}

        {/* SVG Connectors: Tier 2 to Tier 3 */}
        {tier3Nodes.length > 0 && (
          <div className="hidden lg:block w-[600px] h-12 -my-8 pointer-events-none">
            <svg className="w-full h-full overflow-visible">
              <path
                d="M 150 0 C 150 30, 300 20, 300 48"
                fill="none"
                stroke="#818cf8"
                strokeWidth="2"
                strokeDasharray="5 5"
                className="opacity-60"
              />
              <path
                d="M 450 0 C 450 30, 300 20, 300 48"
                fill="none"
                stroke="#818cf8"
                strokeWidth="2"
                strokeDasharray="5 5"
                className="opacity-60"
              />
            </svg>
          </div>
        )}

        {/* TIER 3: Staff-Level Leadership & STAR */}
        {tier3Nodes.length > 0 && (
          <div className="w-full flex flex-col gap-3 max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-purple bg-purple/10 border border-purple/20 px-3 py-1 rounded-full">
                Phase 03 · Incident Leadership & Culture Alignment
              </span>
            </div>

            {renderTierNodes(tier3Nodes)}
          </div>
        )}

        {/* SVG Connector: Tier 3 to Tier 4 Final Boss */}
        {tier4Nodes.length > 0 && (
          <div className="hidden lg:block w-[400px] h-12 -my-8 pointer-events-none">
            <svg className="w-full h-full overflow-visible">
              <path
                d="M 200 0 C 200 25, 200 35, 200 48"
                fill="none"
                stroke="#818cf8"
                strokeWidth="2.5"
                strokeDasharray="5 5"
                className="opacity-75"
              />
            </svg>
          </div>
        )}

        {/* TIER 4: Final Boss / Mock Interview Milestone */}
        {tier4Nodes.length > 0 && (
          <div className="w-full flex flex-col gap-3 max-w-2xl">
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-purple bg-purple/10 border border-purple/20 px-3 py-1 rounded-full">
                Phase 04 · Final Bar Raiser Mock Screen
              </span>
            </div>

            {tier4Nodes.map((bossNode) => (
              <div
                key={bossNode.id}
                onClick={() => {
                  setSelectedDomainNode(bossNode);
                  setExpandedSnippetTopicId(null);
                }}
                className="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border-2 border-purple/40 bg-gradient-to-r from-white via-[#faf5ff] to-white p-6 shadow-[0_12px_40px_rgba(139,92,246,0.15)] hover:border-purple cursor-pointer transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-purple text-white shadow-md">
                    <Mic className="size-7" />
                  </div>

                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-purple/20 px-2 py-0.5 text-[10px] font-black text-purple uppercase">
                        FINAL BOSS MILESTONE
                      </span>
                      <span className="text-xs font-bold text-ink-muted">
                        ⏱️ 60 min
                      </span>
                    </div>
                    <h3 className="font-display text-lg font-extrabold text-ink group-hover:text-purple transition-colors">
                      {bossNode.title}
                    </h3>
                    <p className="text-xs text-ink-muted">
                      {bossNode.subtitle}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
                  <div className="rounded-xl bg-purple/10 border border-purple/30 px-3.5 py-1.5 text-xs font-black text-purple">
                    +250 XP
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedDomainNode(bossNode);
                    }}
                    className="rounded-full bg-purple px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-purple/90 transition-all cursor-pointer"
                  >
                    Inspect Topics →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. SLIDE-OVER DRAWER (Category-Wise Topic List when Domain Node is Clicked) */}
      {selectedDomainNode && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-in fade-in transition-opacity"
          onClick={() => setSelectedDomainNode(null)}
        >
          <div
            className="flex w-full max-w-xl flex-col bg-white h-full shadow-2xl p-6 sm:p-7 overflow-y-auto animate-in slide-in-from-right duration-300 gap-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-line">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider">
                    {selectedDomainNode.categoryBadge}
                  </span>

                  <span className="rounded-full bg-cream px-2 py-0.5 text-xs font-bold text-ink-muted">
                    {selectedDomainNode.weightPercent}% Profile Weight
                  </span>
                </div>

                <h3 className="font-display text-xl font-extrabold text-ink leading-tight">
                  {selectedDomainNode.title}
                </h3>

                <p className="text-xs text-ink-muted leading-relaxed">
                  {selectedDomainNode.subtitle}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedDomainNode(null)}
                className="size-8 rounded-full bg-[#fbf9f4] hover:bg-cream flex items-center justify-center text-ink-muted hover:text-ink transition-colors cursor-pointer shrink-0"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Metrics Snapshot */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col rounded-2xl bg-[#fbf9f4] p-3.5 border border-line gap-1">
                <span className="text-xs text-ink-muted">Domain Readiness</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-display text-2xl font-extrabold text-ink">
                    {selectedDomainNode.readinessScore}%
                  </span>
                  <span className="text-[11px] text-ink-muted">
                    {selectedDomainNode.completedSegments}/
                    {selectedDomainNode.totalSegments} Milestones
                  </span>
                </div>
                <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-[#ede6db] mt-1">
                  <div
                    className={`h-full rounded-full ${
                      selectedDomainNode.readinessScore >= 70
                        ? "bg-[#10b981]"
                        : "bg-amber"
                    }`}
                    style={{ width: `${selectedDomainNode.readinessScore}%` }}
                  />
                </div>
              </div>

              <div className="flex flex-col rounded-2xl bg-[#fbf9f4] p-3.5 border border-line gap-1">
                <span className="text-xs text-ink-muted">
                  Target Company Bar
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-display text-2xl font-extrabold text-purple">
                    {company}
                  </span>
                </div>
                <span className="text-[11px] text-brand font-semibold mt-1">
                  ⚡ High-Yield Interview Focus
                </span>
              </div>
            </div>

            {/* CATEGORY-WISE TOPICS LIST */}
            <div className="flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <span className="font-display text-sm font-extrabold text-ink uppercase tracking-wider">
                  Curriculum Topics by Category
                </span>
                <span className="text-xs text-ink-muted">
                  {selectedDomainNode.categories.length} Categories
                </span>
              </div>

              {selectedDomainNode.categories.map((cat, catIdx) => {
                return (
                  <div
                    key={cat.id}
                    className="flex flex-col rounded-2xl border border-line bg-[#fdfcf9] p-4 gap-3.5"
                  >
                    {/* Category Header */}
                    <div className="flex items-start justify-between gap-2 border-b border-line pb-2.5">
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-2">
                          <span className="flex size-5 items-center justify-center rounded-full bg-ink text-white font-display text-[10px] font-bold">
                            {catIdx + 1}
                          </span>
                          <h4 className="font-display text-sm font-bold text-ink">
                            {cat.title}
                          </h4>
                        </div>
                        <p className="text-xs text-ink-muted line-clamp-1">
                          {cat.description}
                        </p>
                      </div>

                      <span className="rounded bg-cream px-2 py-0.5 text-[11px] font-bold text-ink-muted shrink-0">
                        {cat.topics.length} Topics
                      </span>
                    </div>

                    {/* Topics List under this Category */}
                    <div className="flex flex-col gap-3">
                      {cat.topics.map((topic) => {
                        const isMastered = topic.status === "mastered";
                        const isInProgress = topic.status === "in_progress";
                        const isCriticalGap = topic.status === "critical_gap";
                        const isSnippetOpen =
                          expandedSnippetTopicId === topic.id;

                        return (
                          <div
                            key={topic.id}
                            className={`flex flex-col rounded-xl border p-3.5 transition-all bg-white gap-2.5 ${
                              isCriticalGap
                                ? "border-red-200"
                                : isMastered
                                  ? "border-emerald-200"
                                  : isInProgress
                                    ? "border-blue-200"
                                    : "border-line"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex flex-col gap-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  {isMastered && (
                                    <span className="inline-flex items-center gap-1 rounded bg-[#ecfdf5] text-[#059669] px-2 py-0.5 text-[10px] font-bold">
                                      <CheckCircle2 className="size-3" />
                                      Mastered
                                    </span>
                                  )}
                                  {isInProgress && (
                                    <span className="inline-flex items-center gap-1 rounded bg-[#eff6ff] text-blue px-2 py-0.5 text-[10px] font-bold">
                                      <span className="size-1.5 rounded-full bg-blue animate-pulse" />
                                      In Progress
                                    </span>
                                  )}
                                  {isCriticalGap && (
                                    <span className="inline-flex items-center gap-1 rounded bg-red-100 text-red-700 px-2 py-0.5 text-[10px] font-bold">
                                      <Flame className="size-3 fill-red-500" />
                                      Critical Gap
                                    </span>
                                  )}
                                  <span className="text-[11px] font-semibold text-ink-muted">
                                    ⏱️ {topic.durationMinutes} min
                                  </span>
                                </div>

                                <h5 className="font-display text-sm font-bold text-ink leading-snug">
                                  {topic.title}
                                </h5>
                                <p className="text-xs text-ink-muted leading-relaxed">
                                  {topic.subtitle}
                                </p>
                              </div>

                              <Link
                                href={topic.practiceHref}
                                className="inline-flex items-center gap-1 rounded-full bg-brand px-3.5 py-1 text-xs font-bold text-white shadow-2xs hover:bg-[#fa552b] transition-all shrink-0 self-start"
                              >
                                <PlayCircle className="size-3.5" />
                                <span>Practice</span>
                              </Link>
                            </div>

                            {/* Code Snippet Toggle If Present */}
                            {topic.codeSnippet && (
                              <div className="pt-1">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setExpandedSnippetTopicId(
                                      isSnippetOpen ? null : topic.id,
                                    )
                                  }
                                  className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 hover:underline cursor-pointer"
                                >
                                  <Code2 className="size-3 text-emerald-600" />
                                  <span>
                                    {isSnippetOpen
                                      ? "Hide Code Trap"
                                      : `View ${selectedLanguage} Code Trap`}
                                  </span>
                                </button>

                                {isSnippetOpen && (
                                  <div className="mt-2 rounded-xl bg-slate-900 p-3 font-mono text-[10px] text-slate-100 overflow-x-auto leading-relaxed border border-slate-800">
                                    <pre>{topic.codeSnippet}</pre>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* What Google Tests Bullet */}
                            <div className="flex items-start gap-2 rounded-lg bg-[#fffbf2] p-2 text-[11px] text-amber-900 border border-amber/20">
                              <AlertTriangle className="size-3.5 text-amber-600 shrink-0 mt-0.5" />
                              <span>
                                <strong>Interview Trap:</strong>{" "}
                                {topic.whatToImprove[0]}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Full Domain Mock Action */}
            <div className="flex flex-col gap-2.5 pt-3 border-t border-line mt-auto">
              <Link
                href="/practice/session"
                className="flex items-center justify-center gap-2 rounded-2xl bg-purple px-5 py-3 text-sm font-bold text-white shadow-md hover:bg-purple/90 transition-all text-center"
              >
                <Mic className="size-4.5" />
                <span>
                  Launch Full AI Voice Mock for {selectedDomainNode.title}
                </span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
