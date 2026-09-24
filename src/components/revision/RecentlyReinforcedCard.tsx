"use client";

import Link from "next/link";
import {
  CheckCircle2,
  Database,
  Cloud,
  Users,
  Clock,
  ArrowRight,
  Check,
} from "lucide-react";

export function RecentlyReinforcedCard() {
  const reinforcedItems = [
    {
      id: "re-1",
      icon: Database,
      iconBg: "bg-[#fff0ec] text-brand",
      title: "CAP Theorem",
      area: "System Design",
      reviewedTime: "Reviewed 1 day ago",
      score: "92%",
      badgeText: "Strong recall",
      href: "/practice/session/system-design",
    },
    {
      id: "re-2",
      icon: Cloud,
      iconBg: "bg-[#eff6ff] text-[#2563eb]",
      title: "API Design Patterns",
      area: "System Design",
      reviewedTime: "Reviewed 2 days ago",
      score: "88%",
      badgeText: "Strong recall",
      href: "/practice/session/system-design",
    },
    {
      id: "re-3",
      icon: Users,
      iconBg: "bg-[#f5f3ff] text-[#7c3aed]",
      title: "STAR Method",
      area: "Behavioral",
      reviewedTime: "Reviewed 2 days ago",
      score: "90%",
      badgeText: "Strong recall",
      href: "/practice/session/behavioral",
    },
  ];

  return (
    <div className="w-full rounded-2xl border border-line bg-white p-5 sm:p-6 shadow-2xs flex flex-col gap-4">
      {/* Header: Green CheckCircle Icon + Title + View All Link */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-[#edf5ec] text-[#10b981] mt-0.5">
            <CheckCircle2 className="size-4" />
          </div>
          <div className="flex flex-col">
            <h3 className="font-display font-extrabold text-sm sm:text-base text-ink">
              Recently Reinforced
            </h3>
            <p className="text-xs text-ink-muted">
              Topics you&apos;ve recently revised and are retaining well.
            </p>
          </div>
        </div>

        <Link
          href="/practice/topics"
          className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#2563eb] hover:underline shrink-0"
        >
          <span>View all</span>
          <ArrowRight className="size-2.5" />
        </Link>
      </div>

      {/* 3 Reinforced Items */}
      <div className="flex flex-col divide-y divide-line/60">
        {reinforcedItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.id}
              href={item.href}
              className="group flex items-center justify-between gap-3 py-3 hover:bg-cream/30 px-1 rounded-xl transition-colors"
            >
              {/* Left: Icon + Title + Area + Reviewed Time */}
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${item.iconBg}`}
                >
                  <Icon className="size-4" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-display font-bold text-xs sm:text-sm text-ink truncate group-hover:text-brand transition-colors">
                    {item.title}
                  </span>
                  <div className="flex items-center gap-2 text-[11px] text-ink-muted">
                    <span>{item.area}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="size-3" />
                      <span>{item.reviewedTime}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Score + Strong Recall Badge */}
              <div className="flex flex-col items-end shrink-0 gap-1">
                <span className="font-mono font-bold text-xs sm:text-sm text-[#10b981]">
                  {item.score}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-[#edf5ec] px-2 py-0.5 text-[10px] font-semibold text-[#10b981] border border-[#d1fae5]">
                  <Check className="size-2.5 stroke-[2.5]" />
                  <span>{item.badgeText}</span>
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
