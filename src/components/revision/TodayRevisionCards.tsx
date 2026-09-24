"use client";

import Link from "next/link";
import {
  Target,
  ArrowRight,
  Database,
  CodeXml,
  Cloud,
  Users,
  Clock,
} from "lucide-react";

export function TodayRevisionCards() {
  const topics = [
    {
      id: "scalability-fundamentals",
      badgeNumber: "1",
      badgeBg: "bg-[#ef4444]",
      icon: Database,
      iconBg: "bg-[#fff0ec] text-brand border border-[#ffd8cc]",
      title: "Scalability Fundamentals",
      area: "System Design",
      priority: "High Priority",
      priorityType: "high" as const,
      recallStrength: 46,
      recallColor: "text-[#ef4444]",
      barColor: "bg-[#ef4444]",
      lastReviewed: "5 days ago",
      whyNow:
        "Your recall has dropped and you struggled with scalability reasoning in your last evaluation.",
      duration: "10 min",
      primaryButton: true,
      href: "/practice/session/system-design",
    },
    {
      id: "database-sharding",
      badgeNumber: "2",
      badgeBg: "bg-[#f97316]",
      icon: CodeXml,
      iconBg: "bg-[#edf5ec] text-[#10b981] border border-[#d1fae5]",
      title: "Database Sharding",
      area: "System Design",
      priority: "High Priority",
      priorityType: "high" as const,
      recallStrength: 51,
      recallColor: "text-[#f59e0b]",
      barColor: "bg-[#f59e0b]",
      lastReviewed: "6 days ago",
      whyNow:
        "You had difficulty explaining shard rebalancing and trade-offs in your last practice.",
      duration: "15 min",
      primaryButton: false,
      href: "/practice/session/system-design",
    },
    {
      id: "ecs-architecture",
      badgeNumber: "3",
      badgeBg: "bg-[#eab308]",
      icon: Cloud,
      iconBg: "bg-[#eff6ff] text-[#2563eb] border border-[#dbeafe]",
      title: "ECS Architecture",
      area: "AWS & Cloud",
      priority: "Medium",
      priorityType: "medium" as const,
      recallStrength: 58,
      recallColor: "text-[#f59e0b]",
      barColor: "bg-[#f59e0b]",
      lastReviewed: "5 days ago",
      whyNow: "Important for your target role and your recall is declining.",
      duration: "15 min",
      primaryButton: false,
      href: "/practice/session/cloud",
    },
    {
      id: "leadership-stories",
      badgeNumber: "4",
      badgeBg: "bg-[#eab308]",
      icon: Users,
      iconBg: "bg-[#f5f3ff] text-[#7c3aed] border border-[#ede9fe]",
      title: "Leadership Stories",
      area: "Behavioral",
      priority: "Medium",
      priorityType: "medium" as const,
      recallStrength: 68,
      recallColor: "text-[#10b981]",
      barColor: "bg-[#10b981]",
      lastReviewed: "4 days ago",
      whyNow: "Helps improve your behavioral readiness for senior roles.",
      duration: "10 min",
      primaryButton: false,
      href: "/practice/session/behavioral",
    },
  ];

  return (
    <div className="w-full rounded-2xl border border-line bg-white p-5 sm:p-6 shadow-2xs flex flex-col gap-5">
      {/* Header: Target Icon + Title + View All Topics Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#fff0ec] text-brand border border-[#ffd8cc]">
            <Target className="size-5" />
          </div>
          <div className="flex flex-col">
            <h2 className="font-display text-base sm:text-lg font-extrabold text-ink">
              What should you revise today?
            </h2>
            <p className="text-xs text-ink-muted">
              4 topics selected for you based on your recall strength, recent
              performance and interview timeline.
            </p>
          </div>
        </div>

        <Link
          href="/practice/topics"
          className="inline-flex items-center gap-1.5 self-start sm:self-center rounded-full border border-line bg-white px-3.5 py-1.5 text-xs font-semibold text-brand hover:border-brand hover:bg-[#fff0ec]/30 transition-all cursor-pointer shadow-2xs"
        >
          <span>View all topics</span>
          <ArrowRight className="size-3.5" />
        </Link>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
        {topics.map((t) => {
          const Icon = t.icon;

          return (
            <div
              key={t.id}
              className="relative flex flex-col justify-between rounded-xl border border-line bg-[#fdfbf7]/60 p-4 sm:p-4.5 hover:border-line-strong hover:bg-cream/40 transition-all"
            >
              {/* Badge Number (Overhanging top-left) */}
              <div
                className={`absolute -top-2 -left-2 size-5 rounded-full ${t.badgeBg} text-white text-[11px] font-bold flex items-center justify-center ring-2 ring-white shadow-xs`}
              >
                {t.badgeNumber}
              </div>

              <div className="flex flex-col gap-3">
                {/* Header: Icon + Title */}
                <div className="flex items-center gap-3">
                  <div
                    className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${t.iconBg}`}
                  >
                    <Icon className="size-4.5" />
                  </div>
                  <h3 className="font-display font-extrabold text-sm text-ink leading-snug">
                    {t.title}
                  </h3>
                </div>

                {/* Pills: Area + Priority */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="rounded-md border border-[#dbeafe] bg-[#eff6ff] px-2 py-0.5 text-[10px] font-semibold text-[#2563eb]">
                    {t.area}
                  </span>

                  {t.priorityType === "high" ? (
                    <span className="rounded-md border border-[#fee2e2] bg-[#fef2f2] px-2 py-0.5 text-[10px] font-semibold text-[#ef4444]">
                      {t.priority}
                    </span>
                  ) : (
                    <span className="rounded-md border border-[#fef3c7] bg-[#fffbeb] px-2 py-0.5 text-[10px] font-semibold text-[#d97706]">
                      {t.priority}
                    </span>
                  )}
                </div>

                {/* Recall Strength + Progress Bar */}
                <div className="flex flex-col gap-1.5 pt-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-ink-muted">Recall strength</span>
                    <span className={`font-mono font-bold ${t.recallColor}`}>
                      {t.recallStrength}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-line">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${t.barColor}`}
                      style={{ width: `${t.recallStrength}%` }}
                    />
                  </div>
                </div>

                {/* Last Reviewed */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-ink-muted">Last reviewed</span>
                  <span className="font-medium text-ink">{t.lastReviewed}</span>
                </div>

                {/* Why Now? Block */}
                <div className="flex flex-col gap-1 pt-1.5 border-t border-line/60">
                  <span className="text-xs font-bold text-ink">Why now?</span>
                  <p className="text-xs text-ink-muted leading-relaxed line-clamp-3">
                    {t.whyNow}
                  </p>
                </div>

                {/* Duration */}
                <div className="flex items-center gap-1.5 text-xs text-ink-muted">
                  <Clock className="size-3.5" />
                  <span className="font-mono">{t.duration}</span>
                </div>
              </div>

              {/* Bottom CTA Button */}
              <div className="mt-4 pt-1">
                <Link
                  href={t.href}
                  className={`flex w-full items-center justify-center gap-1.5 rounded-lg py-2.5 text-xs font-bold transition-all active:scale-[0.99] cursor-pointer ${
                    t.primaryButton
                      ? "bg-brand text-white shadow-2xs hover:opacity-90"
                      : "bg-[#ffece6] text-brand hover:bg-brand hover:text-white"
                  }`}
                >
                  <span>Start Recall</span>
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
