"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BarChart2,
  Sparkles,
  Database,
  Cloud,
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

const systemDesignTopics: Topic[] = [
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
    name: "Database Sharding",
    type: "Practice",
    estTime: "20 min",
    status: "Not Started",
  },
  {
    num: 4,
    name: "CAP Theorem",
    type: "Reading",
    estTime: "10 min",
    status: "Not Started",
  },
  {
    num: 5,
    name: "Microservices Architecture",
    type: "Practice",
    estTime: "25 min",
    status: "Not Started",
  },
];

export function ReadinessByArea() {
  const [expandedArea, setExpandedArea] = useState<string | null>(
    "system-design",
  );

  const toggleArea = (id: string) => {
    setExpandedArea(expandedArea === id ? null : id);
  };

  const areas = [
    {
      id: "system-design",
      title: "System Design",
      description:
        "Core architecture, scalability and distributed systems concepts.",
      readiness: 32,
      remaining: "8 topics remaining",
      barColor: "bg-[#ea580c]",
      icon: Database,
      iconBg: "bg-[#fff1ec]",
      iconColor: "text-[#ea580c]",
    },
    {
      id: "aws-cloud",
      title: "AWS & Cloud",
      description: "AWS services, architecture, deployment and best practices.",
      readiness: 67,
      remaining: "3 topics remaining",
      barColor: "bg-[#3b82f6]",
      icon: Cloud,
      iconBg: "bg-[#eff6ff]",
      iconColor: "text-[#3b82f6]",
    },
    {
      id: "coding-patterns",
      title: "Coding Patterns",
      description: "DSA patterns and problem solving techniques.",
      readiness: 78,
      remaining: "2 topics remaining",
      barColor: "bg-[#10b981]",
      icon: Code2,
      iconBg: "bg-[#ecfdf5]",
      iconColor: "text-[#10b981]",
    },
    {
      id: "behavioral",
      title: "Behavioral",
      description: "Leadership, communication and situational questions.",
      readiness: 91,
      remaining: "4 topics remaining",
      barColor: "bg-[#8b5cf6]",
      icon: Users,
      iconBg: "bg-[#f5f3ff]",
      iconColor: "text-[#8b5cf6]",
    },
  ];

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
              Track your progress in each area. Topics update based on the
              current phase of your timeline.
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
        {areas.map((area) => {
          const isExpanded = expandedArea === area.id;
          const Icon = area.icon;

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
                className="flex w-full items-center justify-between p-4 sm:p-5 text-left focus:outline-none"
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
                        {area.readiness}% Ready
                      </span>
                      <div className="hidden h-2 w-28 overflow-hidden rounded-full bg-[#f4efe8] sm:block sm:w-36 lg:w-48">
                        <div
                          className={`h-full rounded-full ${area.barColor} transition-all duration-300`}
                          style={{ width: `${area.readiness}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-[11px] text-ink-muted">
                      {area.remaining}
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

              {/* Expanded Nested Content (Topics to Cover for System Design) */}
              {isExpanded && area.id === "system-design" && (
                <div className="px-4 pb-4 sm:px-5 sm:pb-5">
                  <div className="rounded-xl border border-line bg-[#fdfcfb] p-4 sm:p-5">
                    {/* Inner header */}
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3">
                      <h3 className="font-display text-sm font-extrabold text-ink">
                        Topics to Cover (8)
                      </h3>
                      <span className="rounded-full bg-[#fff1ec] px-3 py-1 text-xs font-bold text-[#ea580c]">
                        Phase: Foundation Building
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
                          {systemDesignTopics.map((topic) => (
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
                        <span>View all 8 topics</span>
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
