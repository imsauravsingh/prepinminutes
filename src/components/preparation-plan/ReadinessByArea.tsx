"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BarChart2,
  Sparkles,
  Database,
  MessageSquare,
  Code2,
  Users,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Circle,
} from "lucide-react";

type Topic = {
  num: number;
  name: string;
  type: "Reading" | "Practice";
  estTime: string;
  status: "Not Started" | "In Progress" | "Completed";
};

type AreaData = {
  id: string;
  title: string;
  description: string;
  icon: typeof Database;
  iconBg: string;
  iconColor: string;
  barColor: string;
  phaseStats: Record<
    string,
    { readiness: number; remaining: string; topics: Topic[] }
  >;
};

const phaseNames: Record<string, string> = {
  "phase-1": "Foundation Building",
  "phase-2": "Skill Deepening",
  "phase-3": "Mock & Polish",
  "phase-4": "Final Review",
};

const areasData: AreaData[] = [
  {
    id: "system-design",
    title: "System Design",
    description:
      "Core architecture, scalability and distributed systems concepts.",
    icon: Database,
    iconBg: "bg-[#fff1ec]",
    iconColor: "text-[#ea580c]",
    barColor: "bg-[#ea580c]",
    phaseStats: {
      "phase-1": {
        readiness: 32,
        remaining: "5 topics remaining",
        topics: [
          {
            num: 1,
            name: "Scalability Fundamentals",
            type: "Reading",
            estTime: "10 min",
            status: "Not Started",
          },
          {
            num: 2,
            name: "Load Balancing Strategies",
            type: "Reading",
            estTime: "8 min",
            status: "Not Started",
          },
          {
            num: 3,
            name: "Database Sharding & Partitioning",
            type: "Practice",
            estTime: "20 min",
            status: "Not Started",
          },
          {
            num: 4,
            name: "CAP Theorem & Consistency Models",
            type: "Reading",
            estTime: "10 min",
            status: "Not Started",
          },
          {
            num: 5,
            name: "Microservices vs Monoliths Architecture",
            type: "Practice",
            estTime: "25 min",
            status: "Not Started",
          },
        ],
      },
      "phase-2": {
        readiness: 48,
        remaining: "5 topics remaining",
        topics: [
          {
            num: 1,
            name: "Distributed Caching (Redis & Memcached)",
            type: "Reading",
            estTime: "15 min",
            status: "Not Started",
          },
          {
            num: 2,
            name: "Message Queues & Event-Driven Architecture",
            type: "Practice",
            estTime: "25 min",
            status: "Not Started",
          },
          {
            num: 3,
            name: "Distributed Transactions & Saga Pattern",
            type: "Practice",
            estTime: "30 min",
            status: "Not Started",
          },
          {
            num: 4,
            name: "CDN & Edge Computing Strategy",
            type: "Reading",
            estTime: "12 min",
            status: "Not Started",
          },
          {
            num: 5,
            name: "API Rate Limiting & Gateway Architecture",
            type: "Practice",
            estTime: "20 min",
            status: "Not Started",
          },
        ],
      },
      "phase-3": {
        readiness: 72,
        remaining: "4 topics remaining",
        topics: [
          {
            num: 1,
            name: "Full Design Mock: URL Shortener at Global Scale",
            type: "Practice",
            estTime: "35 min",
            status: "Not Started",
          },
          {
            num: 2,
            name: "Full Design Mock: Video Streaming Platform (Netflix/YouTube)",
            type: "Practice",
            estTime: "45 min",
            status: "Not Started",
          },
          {
            num: 3,
            name: "Full Design Mock: Real-Time Chat & Notification System",
            type: "Practice",
            estTime: "40 min",
            status: "Not Started",
          },
          {
            num: 4,
            name: "Distributed Failover & High Availability Drill",
            type: "Reading",
            estTime: "15 min",
            status: "Not Started",
          },
        ],
      },
      "phase-4": {
        readiness: 90,
        remaining: "3 topics remaining",
        topics: [
          {
            num: 1,
            name: "System Design Latency & Scale Numbers Cheat Sheet",
            type: "Reading",
            estTime: "10 min",
            status: "Not Started",
          },
          {
            num: 2,
            name: "Top 10 Architecture Trade-offs Comparison",
            type: "Reading",
            estTime: "12 min",
            status: "Not Started",
          },
          {
            num: 3,
            name: "Framework Walkthrough: 4-Step System Design Template",
            type: "Reading",
            estTime: "8 min",
            status: "Not Started",
          },
        ],
      },
    },
  },
  {
    id: "communication",
    title: "Communication",
    description:
      "Technical articulation, stakeholder management and design trade-offs.",
    icon: MessageSquare,
    iconBg: "bg-[#eff6ff]",
    iconColor: "text-[#3b82f6]",
    barColor: "bg-[#3b82f6]",
    phaseStats: {
      "phase-1": {
        readiness: 67,
        remaining: "4 topics remaining",
        topics: [
          {
            num: 1,
            name: "Requirements Clarification & Scope Negotiation",
            type: "Reading",
            estTime: "8 min",
            status: "Not Started",
          },
          {
            num: 2,
            name: "Diagramming While Explaining: Visual Articulation",
            type: "Practice",
            estTime: "15 min",
            status: "Not Started",
          },
          {
            num: 3,
            name: "Driving the Narrative: Taking Initiative in Interviews",
            type: "Reading",
            estTime: "10 min",
            status: "Not Started",
          },
          {
            num: 4,
            name: "Handling Ambiguity & Unknown Constraints",
            type: "Practice",
            estTime: "18 min",
            status: "Not Started",
          },
        ],
      },
      "phase-2": {
        readiness: 75,
        remaining: "4 topics remaining",
        topics: [
          {
            num: 1,
            name: "Articulating Engineering Trade-offs Under Pushback",
            type: "Practice",
            estTime: "20 min",
            status: "Not Started",
          },
          {
            num: 2,
            name: "Verbalizing Back-of-the-envelope Estimations",
            type: "Practice",
            estTime: "15 min",
            status: "Not Started",
          },
          {
            num: 3,
            name: "Explaining Technical Bottlenecks to Non-Technical Interviewers",
            type: "Reading",
            estTime: "12 min",
            status: "Not Started",
          },
          {
            num: 4,
            name: "Active Listening: Catching & Using Interviewer Hints",
            type: "Practice",
            estTime: "15 min",
            status: "Not Started",
          },
        ],
      },
      "phase-3": {
        readiness: 85,
        remaining: "3 topics remaining",
        topics: [
          {
            num: 1,
            name: "Full Mock Interview: 45-min Continuous Communication Run",
            type: "Practice",
            estTime: "45 min",
            status: "Not Started",
          },
          {
            num: 2,
            name: "Defending Architectural Trade-offs in Front of Senior Panel",
            type: "Practice",
            estTime: "30 min",
            status: "Not Started",
          },
          {
            num: 3,
            name: "Concise Summarization: The 60-Second Architecture Pitch",
            type: "Reading",
            estTime: "10 min",
            status: "Not Started",
          },
        ],
      },
      "phase-4": {
        readiness: 95,
        remaining: "2 topics remaining",
        topics: [
          {
            num: 1,
            name: "Golden Rules for Clear Verbal Communication",
            type: "Reading",
            estTime: "7 min",
            status: "Not Started",
          },
          {
            num: 2,
            name: "Confidence & Executive Presence Quick Checklist",
            type: "Reading",
            estTime: "5 min",
            status: "Not Started",
          },
        ],
      },
    },
  },
  {
    id: "coding-patterns",
    title: "Coding Patterns",
    description:
      "DSA patterns, algorithm optimization and problem solving techniques.",
    icon: Code2,
    iconBg: "bg-[#ecfdf5]",
    iconColor: "text-[#10b981]",
    barColor: "bg-[#10b981]",
    phaseStats: {
      "phase-1": {
        readiness: 78,
        remaining: "4 topics remaining",
        topics: [
          {
            num: 1,
            name: "Two Pointers & Sliding Window Fundamentals",
            type: "Practice",
            estTime: "25 min",
            status: "Not Started",
          },
          {
            num: 2,
            name: "Fast & Slow Pointers (Cycle Detection)",
            type: "Practice",
            estTime: "20 min",
            status: "Not Started",
          },
          {
            num: 3,
            name: "Binary Search on Unknown Search Spaces",
            type: "Practice",
            estTime: "25 min",
            status: "Not Started",
          },
          {
            num: 4,
            name: "Prefix Sums & Frequency Hashing Patterns",
            type: "Reading",
            estTime: "12 min",
            status: "Not Started",
          },
        ],
      },
      "phase-2": {
        readiness: 84,
        remaining: "5 topics remaining",
        topics: [
          {
            num: 1,
            name: "Tree & Graph Traversals: BFS / DFS in Matrix",
            type: "Practice",
            estTime: "30 min",
            status: "Not Started",
          },
          {
            num: 2,
            name: "Top 'K' Elements Using Heaps & Priority Queues",
            type: "Practice",
            estTime: "25 min",
            status: "Not Started",
          },
          {
            num: 3,
            name: "Dynamic Programming: Knapsack & Partition Subsets",
            type: "Practice",
            estTime: "35 min",
            status: "Not Started",
          },
          {
            num: 4,
            name: "Monotonic Stack & Next Greater Element",
            type: "Practice",
            estTime: "25 min",
            status: "Not Started",
          },
          {
            num: 5,
            name: "Trie & Prefix Tree Implementation",
            type: "Practice",
            estTime: "20 min",
            status: "Not Started",
          },
        ],
      },
      "phase-3": {
        readiness: 89,
        remaining: "3 topics remaining",
        topics: [
          {
            num: 1,
            name: "Hard Graph Pattern: Course Schedule & Topological Sort",
            type: "Practice",
            estTime: "35 min",
            status: "Not Started",
          },
          {
            num: 2,
            name: "Advanced 2D Dynamic Programming: Subsequence Problems",
            type: "Practice",
            estTime: "30 min",
            status: "Not Started",
          },
          {
            num: 3,
            name: "Timed Mock Coding Interview (LeetCode Hard)",
            type: "Practice",
            estTime: "45 min",
            status: "Not Started",
          },
        ],
      },
      "phase-4": {
        readiness: 96,
        remaining: "2 topics remaining",
        topics: [
          {
            num: 1,
            name: "Big-O Time & Space Complexity Reference Card",
            type: "Reading",
            estTime: "6 min",
            status: "Not Started",
          },
          {
            num: 2,
            name: "Edge Cases Checklist (Empty, Duplicates, Integer Overflow)",
            type: "Reading",
            estTime: "8 min",
            status: "Not Started",
          },
        ],
      },
    },
  },
  {
    id: "behavioral",
    title: "Behavioral",
    description:
      "Leadership, cultural fit, STAR storytelling and situational questions.",
    icon: Users,
    iconBg: "bg-[#f5f3ff]",
    iconColor: "text-[#8b5cf6]",
    barColor: "bg-[#8b5cf6]",
    phaseStats: {
      "phase-1": {
        readiness: 91,
        remaining: "4 topics remaining",
        topics: [
          {
            num: 1,
            name: "STAR Method Mastery: Situation, Task, Action, Result",
            type: "Reading",
            estTime: "8 min",
            status: "Not Started",
          },
          {
            num: 2,
            name: "Crafting Your 'Tell Me About Yourself' 2-Minute Narrative",
            type: "Practice",
            estTime: "15 min",
            status: "Not Started",
          },
          {
            num: 3,
            name: "Brainstorming Your 5 Core Impact & Complexity Stories",
            type: "Practice",
            estTime: "20 min",
            status: "Not Started",
          },
          {
            num: 4,
            name: "Discussing Mistakes, Failures, and Retrospectives",
            type: "Reading",
            estTime: "10 min",
            status: "Not Started",
          },
        ],
      },
      "phase-2": {
        readiness: 93,
        remaining: "4 topics remaining",
        topics: [
          {
            num: 1,
            name: "Handling Disagreements with Staff Engineers & Tech Leads",
            type: "Practice",
            estTime: "18 min",
            status: "Not Started",
          },
          {
            num: 2,
            name: "Demonstrating Ownership & Execution Under Pressure",
            type: "Practice",
            estTime: "20 min",
            status: "Not Started",
          },
          {
            num: 3,
            name: "Balancing Tech Debt vs Business Deadlines",
            type: "Reading",
            estTime: "12 min",
            status: "Not Started",
          },
          {
            num: 4,
            name: "Mentoring Junior Engineers & Improving Team Culture",
            type: "Practice",
            estTime: "15 min",
            status: "Not Started",
          },
        ],
      },
      "phase-3": {
        readiness: 96,
        remaining: "3 topics remaining",
        topics: [
          {
            num: 1,
            name: "Senior SWE Leadership & Influence Mock Interview",
            type: "Practice",
            estTime: "30 min",
            status: "Not Started",
          },
          {
            num: 2,
            name: "Deep Dive: 'Tell Me About a High-Stakes Production Outage'",
            type: "Practice",
            estTime: "25 min",
            status: "Not Started",
          },
          {
            num: 3,
            name: "Navigating Organizational Politics & Conflicting Priorities",
            type: "Reading",
            estTime: "15 min",
            status: "Not Started",
          },
        ],
      },
      "phase-4": {
        readiness: 100,
        remaining: "2 topics remaining",
        topics: [
          {
            num: 1,
            name: "Quick Reference: 10 Story Prompts & Metrics to Remember",
            type: "Reading",
            estTime: "8 min",
            status: "Not Started",
          },
          {
            num: 2,
            name: "High-Signal Questions to Ask Your Google Interviewers",
            type: "Reading",
            estTime: "10 min",
            status: "Not Started",
          },
        ],
      },
    },
  },
];

interface ReadinessByAreaProps {
  selectedPhase?: string;
}

export function ReadinessByArea({
  selectedPhase = "phase-1",
}: ReadinessByAreaProps) {
  const [expandedArea, setExpandedArea] = useState<string | null>(
    "system-design",
  );

  const toggleArea = (id: string) => {
    setExpandedArea(expandedArea === id ? null : id);
  };

  const currentPhaseName = phaseNames[selectedPhase] || "Foundation Building";

  return (
    <div className="flex w-full flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <div className="flex items-start gap-2.5">
          <BarChart2 className="mt-0.5 size-5 text-ink shrink-0" />
          <div className="flex flex-col">
            <h2 className="font-display text-base font-extrabold text-ink sm:text-lg">
              Readiness by Area
            </h2>
            <p className="text-xs text-ink-muted">
              Showing topics tailored to{" "}
              <span className="font-semibold text-ink">{currentPhaseName}</span>
              . Topics and readiness update based on the selected timeline
              phase.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-ink-muted self-start sm:self-auto">
          <Sparkles className="size-3.5 text-[#f59e0b]" />
          <span>Completing topics will update readiness</span>
        </div>
      </div>

      {/* Accordion Categories */}
      <div className="flex w-full flex-col gap-3">
        {areasData.map((area) => {
          const isExpanded = expandedArea === area.id;
          const Icon = area.icon;
          const phaseData =
            area.phaseStats[selectedPhase] || area.phaseStats["phase-1"];
          const topics = phaseData.topics;

          return (
            <div
              key={area.id}
              className={`w-full rounded-2xl border transition-all ${
                isExpanded
                  ? "border-[#ffdecb] bg-white shadow-[0_4px_16px_rgba(30,28,26,0.04)]"
                  : "border-line bg-white shadow-[0_2px_8px_rgba(30,28,26,0.02)] hover:border-line-strong"
              }`}
            >
              {/* Clickable Card Header */}
              <button
                type="button"
                onClick={() => toggleArea(area.id)}
                className="flex w-full items-center justify-between p-4 sm:p-5 text-left focus:outline-none cursor-pointer"
                aria-expanded={isExpanded}
              >
                {/* Left side: Icon, Title, Description */}
                <div className="flex items-center gap-3.5 min-w-0 pr-4 sm:pr-8">
                  <div
                    className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${area.iconBg} ${area.iconColor}`}
                  >
                    <Icon className="size-5" />
                  </div>
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="font-display text-sm sm:text-base font-extrabold text-ink">
                      {area.title}
                    </span>
                    <span className="truncate text-xs text-ink-muted sm:whitespace-normal">
                      {area.description}
                    </span>
                  </div>
                </div>

                {/* Right side: Readiness percentage, Progress bar, remaining, chevron */}
                <div className="flex items-center gap-4 sm:gap-6 shrink-0">
                  <div className="flex flex-col items-end gap-1.5">
                    <div className="flex items-center gap-3">
                      <span className="font-display text-xs sm:text-sm font-extrabold text-ink">
                        {phaseData.readiness}% Ready
                      </span>
                      <div className="hidden h-2 w-28 overflow-hidden rounded-full bg-[#f4efe8] sm:block sm:w-36 lg:w-48">
                        <div
                          className={`h-full rounded-full ${area.barColor} transition-all duration-300`}
                          style={{ width: `${phaseData.readiness}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-[11px] text-ink-muted">
                      {phaseData.remaining}
                    </span>
                  </div>

                  <div className="flex size-7 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-cream">
                    {isExpanded ? (
                      <ChevronUp className="size-4" />
                    ) : (
                      <ChevronDown className="size-4" />
                    )}
                  </div>
                </div>
              </button>

              {/* Expanded Nested Content (Topics Table for this Area & Phase) */}
              {isExpanded && (
                <div className="px-4 pb-4 sm:px-5 sm:pb-5">
                  <div className="rounded-xl border border-line bg-[#fdfcfb] p-4 sm:p-5">
                    {/* Inner header */}
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3">
                      <h3 className="font-display text-sm font-extrabold text-ink">
                        Topics to Cover ({topics.length})
                      </h3>
                      <span className="rounded-full bg-[#fff1ec] px-3 py-1 text-xs font-bold text-[#ea580c]">
                        Phase: {currentPhaseName}
                      </span>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-line text-ink-muted/80">
                            <th className="pb-2.5 font-medium w-8">#</th>
                            <th className="pb-2.5 font-medium">Topic</th>
                            <th className="pb-2.5 font-medium w-24">Type</th>
                            <th className="pb-2.5 font-medium w-28">
                              Est. Time
                            </th>
                            <th className="pb-2.5 font-medium w-32">Status</th>
                            <th className="pb-2.5 font-medium w-24 text-right">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-line">
                          {topics.map((topic) => (
                            <tr
                              key={topic.num}
                              className="group hover:bg-cream/40 transition-colors"
                            >
                              <td className="py-3 font-semibold text-ink-muted">
                                {topic.num}
                              </td>
                              <td className="py-3 font-semibold text-ink">
                                {topic.name}
                              </td>
                              <td className="py-3">
                                {topic.type === "Reading" ? (
                                  <span className="inline-flex rounded border border-[#dbeafe] bg-[#eff6ff] px-2 py-0.5 text-[11px] font-semibold text-[#2563eb]">
                                    Reading
                                  </span>
                                ) : (
                                  <span className="inline-flex rounded border border-[#a7f3d0] bg-[#ecfdf5] px-2 py-0.5 text-[11px] font-semibold text-[#059669]">
                                    Practice
                                  </span>
                                )}
                              </td>
                              <td className="py-3 text-ink-muted">
                                {topic.estTime}
                              </td>
                              <td className="py-3">
                                <span className="inline-flex items-center gap-1.5 text-[11px] text-ink-muted">
                                  <Circle className="size-3 text-ink-muted/60" />
                                  <span>{topic.status}</span>
                                </span>
                              </td>
                              <td className="py-3 text-right">
                                <Link
                                  href="/practice"
                                  className="inline-flex items-center gap-1 rounded-lg border border-line bg-white px-3 py-1 text-xs font-semibold text-ink shadow-xs transition-colors hover:border-line-strong hover:bg-cream"
                                >
                                  <span>Start</span>
                                  <ArrowRight className="size-3 text-ink" />
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Footer link */}
                    <div className="pt-3 text-center">
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#2563eb] hover:underline"
                      >
                        <span>View all {topics.length} topics</span>
                        <ArrowRight className="size-3" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
