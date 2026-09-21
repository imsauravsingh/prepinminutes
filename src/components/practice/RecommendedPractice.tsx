import { Clock, Sparkles } from "lucide-react";
import Link from "next/link";

type PracticeCardData = {
  title: string;
  category: string;
  categoryBg: string;
  categoryColor: string;
  accentColor: string;
  duration: string;
  description: string;
  whyText: string;
  href: string;
};

const cards: PracticeCardData[] = [
  {
    title: "Sliding Window Pattern",
    category: "Data Structures",
    categoryBg: "bg-[#fff0ec]",
    categoryColor: "text-[#ff6c47]",
    accentColor: "bg-[#ff6c47]",
    duration: "10 min",
    description:
      "Solve a targeted coding problem focusing on sliding window technique",
    whyText:
      "Why: Part of today's preparation plan — your coding patterns readiness is at 78% and this topic needs more practice.",
    href: "/practice/session/coding",
  },
  {
    title: "Load Balancing Strategies",
    category: "System Design",
    categoryBg: "bg-[#eff6ff]",
    categoryColor: "text-[#3b82f6]",
    accentColor: "bg-[#3b82f6]",
    duration: "10 min",
    description:
      "Design a scalable system scenario with follow-up architecture questions",
    whyText:
      "Why: System Design is your biggest preparation gap at 32% readiness. Load balancing is foundational for your Google interview.",
    href: "/practice/session/system-design",
  },
  {
    title: "Multi-Region Cloud Infrastructure & Resilience",
    category: "Cloud",
    categoryBg: "bg-[#eff6ff]",
    categoryColor: "text-[#2563eb]",
    accentColor: "bg-[#2563eb]",
    duration: "12 min",
    description:
      "Architect a resilient multi-region cloud deployment with auto-scaling, disaster recovery and zero-trust VPC",
    whyText:
      "Why: Cloud readiness is currently at 67% — master VPC networking, Kubernetes containerization and high-availability patterns.",
    href: "/practice/session/cloud",
  },
  {
    title: "Leadership & Conflict Resolution",
    category: "Behavioral",
    categoryBg: "bg-[#f5f3ff]",
    categoryColor: "text-[#8b5cf6]",
    accentColor: "bg-[#8b5cf6]",
    duration: "7 min",
    description:
      "Answer an interview question with AI evaluation of your STAR response",
    whyText:
      "Why: Recommended based on your preparation plan and previous evaluation — strengthen your behavioral storytelling.",
    href: "/practice/session/behavioral",
  },
];

export function RecommendedPractice() {
  return (
    <div className="flex w-full flex-col gap-4">
      {/* Section Titles */}
      <div className="flex flex-col gap-1">
        <h2 className="font-display text-lg font-extrabold text-ink sm:text-xl">
          Today&apos;s Recommended Practice
        </h2>
        <p className="text-xs text-ink-muted sm:text-sm">
          4 areas · ~39 min total · Generated from your Preparation Plan
        </p>
      </div>

      {/* Cards Stack */}
      <div className="flex flex-col gap-4">
        {cards.map((card) => (
          <div
            key={card.title}
            className="flex overflow-hidden rounded-2xl border border-line bg-white shadow-[0_4px_16px_rgba(30,28,26,0.03)]"
          >
            {/* Left accent bar */}
            <div
              className={`w-1.5 shrink-0 self-stretch ${card.accentColor}`}
              aria-hidden
            />

            {/* Card Content */}
            <div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
              {/* Header row */}
              <div className="flex items-center justify-between">
                <Link
                  href={card.href}
                  className={`rounded-md px-2 py-1 text-[11px] font-bold transition-opacity hover:opacity-85 ${card.categoryBg} ${card.categoryColor}`}
                >
                  {card.category}
                </Link>
                <div className="flex items-center gap-1.5 text-[13px] font-medium text-ink-muted">
                  <Clock className="size-3.5 text-ink-muted" />
                  <span>{card.duration}</span>
                </div>
              </div>

              {/* Title & Description */}
              <div className="flex flex-col gap-1.5">
                <Link
                  href={card.href}
                  className="font-display text-base font-bold text-ink transition-colors hover:text-brand sm:text-lg w-fit"
                >
                  {card.title}
                </Link>
                <p className="text-sm text-ink-muted">{card.description}</p>
              </div>

              <hr className="border-line" />

              {/* Footer row */}
              <div className="flex flex-col justify-between gap-2.5 sm:flex-row sm:items-center">
                <div className="flex items-start gap-2 text-xs text-ink-muted">
                  <Sparkles className="size-3.5 shrink-0 text-[#b0a898] mt-0.5" />
                  <span>{card.whyText}</span>
                </div>

                <Link
                  href={card.href}
                  className="shrink-0 text-[13px] font-semibold text-brand transition-colors hover:underline text-left sm:text-right"
                >
                  Start Practice →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
