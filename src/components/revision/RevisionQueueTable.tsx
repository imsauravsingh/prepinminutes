"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Database,
  CodeXml,
  Cloud,
  Users,
  Clock,
  ArrowRight,
  ChevronDown,
  Layers,
} from "lucide-react";

type TabId = "queue" | "upcoming" | "at-risk" | "completed";

export function RevisionQueueTable() {
  const [activeTab, setActiveTab] = useState<TabId>("queue");

  const tabs = [
    { id: "queue" as TabId, label: "Revision Queue", count: 4 },
    { id: "upcoming" as TabId, label: "Upcoming", count: 6 },
    { id: "at-risk" as TabId, label: "At Risk", count: 4 },
    { id: "completed" as TabId, label: "Completed", count: 18 },
  ];

  const queueData = [
    {
      id: "q-1",
      icon: Database,
      iconBg: "bg-[#fff0ec] text-brand",
      name: "Scalability Fundamentals",
      area: "System Design",
      recallStrength: 46,
      barColor: "bg-[#ef4444]",
      recallColor: "text-[#ef4444]",
      lastReviewed: "5 days ago",
      relevance: "High",
      relevanceType: "high" as const,
      recommended: "10 min",
      href: "/practice/session/system-design",
    },
    {
      id: "q-2",
      icon: CodeXml,
      iconBg: "bg-[#edf5ec] text-[#10b981]",
      name: "Database Sharding",
      area: "System Design",
      recallStrength: 51,
      barColor: "bg-[#f59e0b]",
      recallColor: "text-[#f59e0b]",
      lastReviewed: "6 days ago",
      relevance: "High",
      relevanceType: "high" as const,
      recommended: "15 min",
      href: "/practice/session/system-design",
    },
    {
      id: "q-3",
      icon: Cloud,
      iconBg: "bg-[#eff6ff] text-[#2563eb]",
      name: "ECS Architecture",
      area: "AWS & Cloud",
      recallStrength: 58,
      barColor: "bg-[#f59e0b]",
      recallColor: "text-[#f59e0b]",
      lastReviewed: "5 days ago",
      relevance: "Medium",
      relevanceType: "medium" as const,
      recommended: "15 min",
      href: "/practice/session/cloud",
    },
    {
      id: "q-4",
      icon: Users,
      iconBg: "bg-[#f5f3ff] text-[#7c3aed]",
      name: "Leadership Stories",
      area: "Behavioral",
      recallStrength: 68,
      barColor: "bg-[#10b981]",
      recallColor: "text-[#10b981]",
      lastReviewed: "4 days ago",
      relevance: "Medium",
      relevanceType: "medium" as const,
      recommended: "10 min",
      href: "/practice/session/behavioral",
    },
  ];

  const atRiskData = [
    {
      id: "ar-1",
      icon: Database,
      iconBg: "bg-[#fff0ec] text-brand",
      name: "Scalability Fundamentals",
      area: "System Design",
      recallStrength: 46,
      barColor: "bg-[#ef4444]",
      recallColor: "text-[#ef4444]",
      lastReviewed: "5 days ago",
      relevance: "High",
      relevanceType: "high" as const,
      recommended: "10 min",
      href: "/practice/session/system-design",
    },
    {
      id: "ar-2",
      icon: CodeXml,
      iconBg: "bg-[#edf5ec] text-[#10b981]",
      name: "Dynamic Programming",
      area: "Coding Patterns",
      recallStrength: 48,
      barColor: "bg-[#ef4444]",
      recallColor: "text-[#ef4444]",
      lastReviewed: "7 days ago",
      relevance: "High",
      relevanceType: "high" as const,
      recommended: "20 min",
      href: "/practice/topics",
    },
  ];

  const upcomingData = [
    {
      id: "up-1",
      icon: Cloud,
      iconBg: "bg-[#eff6ff] text-[#2563eb]",
      name: "API Gateway & Lambda",
      area: "AWS & Cloud",
      recallStrength: 64,
      barColor: "bg-[#f59e0b]",
      recallColor: "text-[#f59e0b]",
      lastReviewed: "3 days ago",
      relevance: "Medium",
      relevanceType: "medium" as const,
      recommended: "15 min",
      href: "/practice/session/cloud",
    },
    {
      id: "up-2",
      icon: Users,
      iconBg: "bg-[#f5f3ff] text-[#7c3aed]",
      name: "Conflict Handling",
      area: "Behavioral",
      recallStrength: 70,
      barColor: "bg-[#10b981]",
      recallColor: "text-[#10b981]",
      lastReviewed: "2 days ago",
      relevance: "Medium",
      relevanceType: "medium" as const,
      recommended: "10 min",
      href: "/practice/session/behavioral",
    },
  ];

  const completedData = [
    {
      id: "comp-1",
      icon: Database,
      iconBg: "bg-[#fff0ec] text-brand",
      name: "CAP Theorem",
      area: "System Design",
      recallStrength: 92,
      barColor: "bg-[#10b981]",
      recallColor: "text-[#10b981]",
      lastReviewed: "1 day ago",
      relevance: "High",
      relevanceType: "high" as const,
      recommended: "Completed",
      href: "/practice/session/system-design",
    },
    {
      id: "comp-2",
      icon: Cloud,
      iconBg: "bg-[#eff6ff] text-[#2563eb]",
      name: "API Design Patterns",
      area: "System Design",
      recallStrength: 88,
      barColor: "bg-[#10b981]",
      recallColor: "text-[#10b981]",
      lastReviewed: "2 days ago",
      relevance: "Medium",
      relevanceType: "medium" as const,
      recommended: "Completed",
      href: "/practice/session/system-design",
    },
  ];

  const currentList =
    activeTab === "queue"
      ? queueData
      : activeTab === "upcoming"
        ? upcomingData
        : activeTab === "at-risk"
          ? atRiskData
          : completedData;

  return (
    <div className="w-full rounded-2xl border border-line bg-white p-5 sm:p-6 shadow-2xs flex flex-col gap-4 sm:gap-5">
      {/* Top Tabs Bar + Filter Dropdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line pb-3">
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar -mx-2 px-2 sm:mx-0 sm:px-0">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "bg-[#eff6ff] text-[#2563eb]"
                    : "text-ink-muted hover:text-ink hover:bg-cream/60"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                    isActive
                      ? "bg-[#ea580c] text-white"
                      : "bg-line text-ink-muted"
                  }`}
                >
                  {tab.count}
                </span>
                {isActive && (
                  <span className="absolute -bottom-3 left-0 right-0 h-0.5 bg-[#2563eb] hidden sm:block" />
                )}
              </button>
            );
          })}
        </div>

        {/* Filters Dropdown Button */}
        <button
          type="button"
          className="self-start sm:self-center inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-2.5 py-1 text-xs font-medium text-ink-muted hover:border-line-strong hover:text-ink hover:bg-cream/40 transition-all cursor-pointer"
        >
          <Layers className="size-3" />
          <span>Filters</span>
          <ChevronDown className="size-3" />
        </button>
      </div>

      {/* Subhead: Topics Due Today */}
      <div className="flex flex-col gap-0.5">
        <h3 className="font-display font-extrabold text-sm sm:text-base text-ink">
          {activeTab === "queue"
            ? "4 topics due today"
            : activeTab === "upcoming"
              ? "6 topics scheduled upcoming"
              : activeTab === "at-risk"
                ? "4 topics at risk"
                : "18 topics completed revision"}
        </h3>
        <p className="text-xs text-ink-muted">
          Topics to revise based on your recall strength, last review date, and
          interview relevance.
        </p>
      </div>

      {/* Responsive Table */}
      <div className="w-full overflow-x-auto no-scrollbar -mx-2 px-2 sm:mx-0 sm:px-0">
        <table className="w-full min-w-[540px] text-left text-xs">
          <thead>
            <tr className="border-b border-line text-ink-muted">
              <th className="pb-3 pt-1 font-semibold">Topic</th>
              <th className="pb-3 pt-1 font-semibold">Recall Strength</th>
              <th className="pb-3 pt-1 font-semibold">Last Reviewed</th>
              <th className="pb-3 pt-1 text-center font-semibold">
                Interview Relevance
              </th>
              <th className="pb-3 pt-1 text-center font-semibold">
                Recommended
              </th>
              <th className="pb-3 pt-1 text-right font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line/60">
            {currentList.map((row) => {
              const Icon = row.icon;

              return (
                <tr
                  key={row.id}
                  className="hover:bg-cream/40 transition-colors"
                >
                  {/* Topic: Icon + Title + Area */}
                  <td className="py-3.5 pr-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${row.iconBg}`}
                      >
                        <Icon className="size-4" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-display font-bold text-xs sm:text-sm text-ink truncate">
                          {row.name}
                        </span>
                        <span className="text-[11px] text-ink-muted">
                          {row.area}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Recall Strength: % + horizontal mini bar */}
                  <td className="py-3.5 pr-4">
                    <div className="flex flex-col gap-1 w-24">
                      <span
                        className={`font-mono font-bold text-xs ${row.recallColor}`}
                      >
                        {row.recallStrength}%
                      </span>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-line">
                        <div
                          className={`h-full rounded-full ${row.barColor}`}
                          style={{ width: `${row.recallStrength}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Last Reviewed */}
                  <td className="py-3.5 text-ink-muted whitespace-nowrap">
                    {row.lastReviewed}
                  </td>

                  {/* Interview Relevance */}
                  <td className="py-3.5 text-center">
                    {row.relevanceType === "high" ? (
                      <span className="inline-flex items-center rounded-full bg-[#fef2f2] px-2.5 py-0.5 text-[11px] font-semibold text-[#ef4444] border border-[#fee2e2]">
                        {row.relevance}
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-[#fffbeb] px-2.5 py-0.5 text-[11px] font-semibold text-[#d97706] border border-[#fef3c7]">
                        {row.relevance}
                      </span>
                    )}
                  </td>

                  {/* Recommended Duration */}
                  <td className="py-3.5 text-center">
                    <div className="inline-flex items-center gap-1 text-ink-muted text-xs">
                      <Clock className="size-3" />
                      <span className="font-mono">{row.recommended}</span>
                    </div>
                  </td>

                  {/* Action: Review Button */}
                  <td className="py-3.5 text-right">
                    <Link
                      href={row.href}
                      className="inline-flex items-center gap-1 rounded-md bg-[#fff0ec] px-3 py-1.5 text-xs font-semibold text-brand hover:bg-brand hover:text-white transition-colors cursor-pointer shadow-2xs"
                    >
                      <span>Review</span>
                      <ArrowRight className="size-3" />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
