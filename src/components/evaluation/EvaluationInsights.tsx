"use client";

import Link from "next/link";
import {
  Award,
  BarChart3,
  Target,
  Users,
  Cloud,
  Database,
  CodeXml,
  Check,
  AlertCircle,
  Clock,
  ChevronRight,
  ArrowRight,
} from "lucide-react";

export function EvaluationInsights() {
  const interviewCriteria = [
    { label: "Communication", status: "Good", type: "positive" },
    {
      label: "Explanation Structure",
      status: "Needs Practice",
      type: "warning",
    },
    { label: "Technical Depth", status: "Strong", type: "positive" },
    {
      label: "Trade-off Reasoning",
      status: "Needs Attention",
      type: "danger",
    },
    { label: "Follow-up Handling", status: "Good", type: "positive" },
    { label: "Confidence & Clarity", status: "Good", type: "positive" },
    { label: "Example Usage", status: "Strong", type: "positive" },
    { label: "Answer Relevance", status: "Good", type: "positive" },
  ];

  const focusAreas = [
    {
      id: "fa-1",
      area: "System Design",
      readiness: "42% Ready",
      readinessColor: "text-brand",
      icon: Database,
      iconBg: "bg-[#fff0ec] text-brand",
      description:
        "Trade-off reasoning and scalability explanations need more practice.",
      href: "/practice/topics?area=system-design",
    },
    {
      id: "fa-2",
      area: "AWS & Cloud",
      readiness: "67% Ready",
      readinessColor: "text-[#2563eb]",
      icon: Cloud,
      iconBg: "bg-[#eff6ff] text-[#2563eb]",
      description: "Architecture and design questions need more practice.",
      href: "/practice/topics?area=aws-cloud",
    },
    {
      id: "fa-3",
      area: "Coding Patterns",
      readiness: "74% Ready",
      readinessColor: "text-[#10b981]",
      icon: CodeXml,
      iconBg: "bg-[#edf5ec] text-[#10b981]",
      description: "Problem-solving speed and edge cases need attention.",
      href: "/practice/topics?area=coding-patterns",
    },
  ];

  const recommendedTopics = [
    {
      title: "Scalability Fundamentals",
      duration: "15 min",
      icon: Database,
      iconColor: "text-brand",
      href: "/practice/topics",
    },
    {
      title: "Load Balancing Strategies",
      duration: "10 min",
      icon: Cloud,
      iconColor: "text-[#2563eb]",
      href: "/practice/topics",
    },
    {
      title: "Database Sharding",
      duration: "20 min",
      icon: Users,
      iconColor: "text-[#7c3aed]",
      href: "/practice/topics",
    },
  ];

  return (
    <div className="flex flex-col gap-3.5">
      {/* Section Title & Subtitle */}
      <div className="flex flex-col gap-0.5">
        <h2 className="font-display text-base sm:text-lg font-bold text-ink">
          Your Evaluation Insights
        </h2>
        <p className="text-xs text-ink-muted">
          Key takeaways from your recent evaluations and practice sessions.
        </p>
      </div>

      {/* 3 Columns Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Card 1: Your Strengths */}
        <div className="flex flex-col justify-between gap-5 rounded-2xl border border-line bg-white p-5 sm:p-6 shadow-2xs">
          <div className="flex flex-col gap-4">
            {/* Header */}
            <div className="flex items-start gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#fef9c3] text-[#ca8a04]">
                <Award className="size-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-base text-ink">
                  Your Strengths
                </span>
                <span className="text-xs text-ink-muted mt-0.5">
                  Areas where you&apos;re performing well. Keep it up!
                </span>
              </div>
            </div>

            {/* Strengths List */}
            <div className="flex flex-col gap-3 pt-2">
              {/* Strength 1: Behavioral */}
              <div className="flex flex-col gap-1.5 rounded-xl border border-line/70 bg-[#fdfbf7] p-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-[#f5f3ff] text-[#7c3aed]">
                      <Users className="size-3.5" />
                    </div>
                    <span className="font-display font-bold text-sm text-ink">
                      Behavioral
                    </span>
                  </div>
                  <span className="font-mono font-bold text-sm text-ink">
                    91%
                  </span>
                </div>
                <p className="text-xs text-ink-muted leading-relaxed pl-9">
                  Strong structured answers with relevant examples.
                </p>
              </div>

              {/* Strength 2: AWS & Cloud */}
              <div className="flex flex-col gap-1.5 rounded-xl border border-line/70 bg-[#fdfbf7] p-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-[#eff6ff] text-[#2563eb]">
                      <Cloud className="size-3.5" />
                    </div>
                    <span className="font-display font-bold text-sm text-ink">
                      AWS &amp; Cloud
                    </span>
                  </div>
                  <span className="font-mono font-bold text-sm text-ink">
                    84%
                  </span>
                </div>
                <p className="text-xs text-ink-muted leading-relaxed pl-9">
                  Good understanding of core services and architecture concepts.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Action Button */}
          <Link
            href="/practice/topics?area=behavioral"
            className="flex items-center justify-center gap-1.5 rounded-xl border border-line py-2.5 text-xs font-semibold text-ink hover:border-[#2563eb] hover:text-[#2563eb] hover:bg-[#eff6ff]/30 transition-all cursor-pointer"
          >
            <span>View all strengths</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        {/* Card 2: Interview Performance */}
        <div className="flex flex-col justify-between gap-5 rounded-2xl border border-line bg-white p-5 sm:p-6 shadow-2xs">
          <div className="flex flex-col gap-4">
            {/* Header */}
            <div className="flex items-start gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#fffbeb] text-[#d97706]">
                <BarChart3 className="size-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-base text-ink">
                  Interview Performance
                </span>
                <span className="text-xs text-ink-muted mt-0.5">
                  How you perform in an interview based on your answers.
                </span>
              </div>
            </div>

            {/* Checklist of 8 Criteria */}
            <div className="grid grid-cols-1 gap-2 pt-1">
              {interviewCriteria.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between text-xs py-0.5"
                >
                  <span className="text-ink-muted font-medium">
                    {item.label}
                  </span>

                  {item.type === "positive" && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#edf5ec] px-2 py-0.5 text-[11px] font-semibold text-[#10b981] border border-[#d1fae5]">
                      <Check className="size-2.5 stroke-[2.5]" />
                      <span>{item.status}</span>
                    </span>
                  )}

                  {item.type === "warning" && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#fffbeb] px-2 py-0.5 text-[11px] font-semibold text-[#d97706] border border-[#fef3c7]">
                      <AlertCircle className="size-2.5" />
                      <span>{item.status}</span>
                    </span>
                  )}

                  {item.type === "danger" && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#fff0ec] px-2 py-0.5 text-[11px] font-semibold text-[#ef4444] border border-[#fee2e2]">
                      <AlertCircle className="size-2.5" />
                      <span>{item.status}</span>
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Action Button */}
          <Link
            href="/practice/session/behavioral"
            className="flex items-center justify-center gap-1.5 rounded-xl border border-line py-2.5 text-xs font-semibold text-ink hover:border-[#2563eb] hover:text-[#2563eb] hover:bg-[#eff6ff]/30 transition-all cursor-pointer"
          >
            <span>View detailed feedback</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        {/* Card 3: Your Focus */}
        <div className="flex flex-col justify-between gap-5 rounded-2xl border border-line bg-white p-5 sm:p-6 shadow-2xs">
          <div className="flex flex-col gap-4">
            {/* Header */}
            <div className="flex items-start gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#fff0ec] text-[#ef4444]">
                <Target className="size-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-base text-ink">
                  Your Focus
                </span>
                <span className="text-xs text-ink-muted mt-0.5">
                  Areas that currently need the most attention based on your
                  evaluations and target interview.
                </span>
              </div>
            </div>

            {/* Focus Items List */}
            <div className="flex flex-col gap-2.5 pt-1">
              {focusAreas.map((fa) => {
                const Icon = fa.icon;
                return (
                  <Link
                    key={fa.id}
                    href={fa.href}
                    className="group flex items-start justify-between gap-2.5 rounded-xl border border-line/60 bg-[#fdfbf7] p-2.5 hover:border-line-strong hover:bg-cream transition-all"
                  >
                    <div className="flex items-start gap-2.5 min-w-0 flex-1">
                      <div
                        className={`flex size-7 shrink-0 items-center justify-center rounded-lg ${fa.iconBg} mt-0.5`}
                      >
                        <Icon className="size-3.5" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-display font-bold text-xs text-ink truncate group-hover:text-brand transition-colors">
                            {fa.area}
                          </span>
                          <span
                            className={`font-mono text-[11px] font-bold ${fa.readinessColor}`}
                          >
                            {fa.readiness}
                          </span>
                        </div>
                        <p className="text-[11px] text-ink-muted leading-tight mt-0.5">
                          {fa.description}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="size-3.5 text-ink-muted group-hover:text-ink mt-1 shrink-0 transition-colors" />
                  </Link>
                );
              })}
            </div>

            {/* Recommended Topics for You sub-block */}
            <div className="flex flex-col gap-2 pt-2 border-t border-line/60">
              <div className="flex items-center justify-between text-xs">
                <span className="font-display font-bold text-ink">
                  Recommended topics for you
                </span>
                <Link
                  href="/practice/topics"
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#2563eb] hover:underline"
                >
                  <span>View all</span>
                  <ArrowRight className="size-2.5" />
                </Link>
              </div>

              <div className="flex flex-col divide-y divide-line/40">
                {recommendedTopics.map((topic) => {
                  const TopicIcon = topic.icon;

                  return (
                    <Link
                      key={topic.title}
                      href={topic.href}
                      className="group flex items-center justify-between py-1.5 hover:text-brand transition-colors text-xs"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <TopicIcon
                          className={`size-3.5 ${topic.iconColor} shrink-0`}
                        />
                        <span className="font-medium text-ink truncate group-hover:text-brand">
                          {topic.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 text-ink-muted text-[11px]">
                        <span className="flex items-center gap-1">
                          <Clock className="size-3" />
                          <span>{topic.duration}</span>
                        </span>
                        <ChevronRight className="size-3" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bottom Primary CTA Button */}
          <Link
            href="/practice/topics"
            className="flex items-center justify-center gap-2 rounded-xl bg-brand py-3 text-xs font-bold text-white hover:opacity-90 shadow-xs transition-all active:scale-[0.99] cursor-pointer"
          >
            <span>Start Practicing Focus Areas</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
