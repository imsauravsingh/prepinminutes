"use client";

import Link from "next/link";
import {
  BarChart2,
  Database,
  Cloud,
  CodeXml,
  Users,
  ArrowRight,
} from "lucide-react";

export function RevisionByArea() {
  const areas = [
    {
      id: "system-design",
      name: "System Design",
      icon: Database,
      iconBg: "bg-[#fff0ec] text-brand",
      recallStrength: 46,
      recallColor: "text-[#ef4444]",
      barColor: "bg-[#ef4444]",
      topicsDue: 4,
      topicsDueLabel: "topics due",
      keyTopics: ["Scalability", "Database Sharding", "CAP Theorem"],
      href: "/practice/topics?area=system-design",
    },
    {
      id: "aws-cloud",
      name: "AWS & Cloud",
      icon: Cloud,
      iconBg: "bg-[#eff6ff] text-[#2563eb]",
      recallStrength: 68,
      recallColor: "text-[#2563eb]",
      barColor: "bg-[#2563eb]",
      topicsDue: 2,
      topicsDueLabel: "topics due",
      keyTopics: ["ECS", "S3", "API Gateway"],
      href: "/practice/topics?area=aws-cloud",
    },
    {
      id: "coding-patterns",
      name: "Coding Patterns",
      icon: CodeXml,
      iconBg: "bg-[#edf5ec] text-[#10b981]",
      recallStrength: 72,
      recallColor: "text-[#10b981]",
      barColor: "bg-[#10b981]",
      topicsDue: 3,
      topicsDueLabel: "topics due",
      keyTopics: ["Arrays & Strings", "Trees", "Dynamic Programming"],
      href: "/practice/topics?area=coding-patterns",
    },
    {
      id: "behavioral",
      name: "Behavioral",
      icon: Users,
      iconBg: "bg-[#f5f3ff] text-[#7c3aed]",
      recallStrength: 88,
      recallColor: "text-[#7c3aed]",
      barColor: "bg-[#7c3aed]",
      topicsDue: 1,
      topicsDueLabel: "topic due",
      keyTopics: ["STAR Method", "Leadership", "Conflict Handling"],
      href: "/practice/topics?area=behavioral",
    },
  ];

  return (
    <div className="w-full rounded-2xl border border-line bg-white p-5 sm:p-6 shadow-2xs flex flex-col gap-4 sm:gap-5">
      {/* Header: BarChart Icon + Title + Subtitle */}
      <div className="flex items-center gap-2.5">
        <div className="flex size-7 items-center justify-center rounded-lg bg-[#fffbeb] text-[#f59e0b]">
          <BarChart2 className="size-4" />
        </div>
        <div className="flex flex-col">
          <h3 className="font-display text-base font-extrabold text-ink">
            Revision by Area
          </h3>
          <p className="text-xs text-ink-muted">
            Recall strength and pending topics in each area.
          </p>
        </div>
      </div>

      {/* 2x2 Grid of Area Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {areas.map((area) => {
          const Icon = area.icon;

          return (
            <div
              key={area.id}
              className="flex flex-col justify-between rounded-xl border border-line bg-[#fdfbf7]/60 p-4 hover:border-line-strong hover:bg-cream/40 transition-all"
            >
              <div>
                {/* Top: Icon + Name & Topics Due Count */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${area.iconBg}`}
                    >
                      <Icon className="size-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-display font-bold text-xs sm:text-sm text-ink">
                        {area.name}
                      </span>
                      <div className="flex items-center gap-1">
                        <span
                          className={`font-mono text-xs font-bold ${area.recallColor}`}
                        >
                          {area.recallStrength}%
                        </span>
                        <span className="text-[11px] text-ink-muted">
                          Recall strength
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end">
                    <span className="font-display font-extrabold text-lg sm:text-xl text-ink leading-tight">
                      {area.topicsDue}
                    </span>
                    <span className="text-[10px] text-ink-muted">
                      {area.topicsDueLabel}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-line">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${area.barColor}`}
                    style={{ width: `${area.recallStrength}%` }}
                  />
                </div>

                {/* Key Topics List */}
                <div className="mt-3.5 flex flex-col gap-1.5 pt-2 border-t border-line/60">
                  <span className="text-[11px] font-semibold text-ink-muted">
                    Key topics:
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {area.keyTopics.map((topic) => (
                      <span
                        key={topic}
                        className="rounded-md border border-line/80 bg-white px-2 py-0.5 text-[11px] font-medium text-ink shadow-2xs"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Navigation Arrow */}
              <div className="mt-3 flex justify-end">
                <Link
                  href={area.href}
                  className="flex size-6 items-center justify-center rounded-full text-[#2563eb] hover:bg-cream transition-colors"
                  aria-label={`View ${area.name} topics`}
                >
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
