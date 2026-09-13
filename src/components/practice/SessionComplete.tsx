import Link from "next/link";
import { TrendingUp } from "lucide-react";

interface ResultItem {
  area: string;
  bulletColor: string;
  topic: string;
  badge: string;
  badgeBg: string;
  badgeColor: string;
  scoreDelta: string;
}

const sessionResults: ResultItem[] = [
  {
    area: "Data Structures",
    bulletColor: "bg-brand",
    topic: "Sliding Window",
    badge: "Improved",
    badgeBg: "bg-[#edf5ec]",
    badgeColor: "text-[#10b981]",
    scoreDelta: "64% → 71%",
  },
  {
    area: "System Design",
    bulletColor: "bg-[#0b8a8f]",
    topic: "Load Balancing",
    badge: "Needs Practice",
    badgeBg: "bg-[#fff0ec]",
    badgeColor: "text-brand",
    scoreDelta: "28% → 35%",
  },
  {
    area: "Behavioral",
    bulletColor: "bg-[#8b5cf6]",
    topic: "Leadership & Conflict",
    badge: "Strong",
    badgeBg: "bg-[#edf5ec]",
    badgeColor: "text-[#10b981]",
    scoreDelta: "52% → 60%",
  },
];

export function SessionComplete() {
  return (
    <div className="flex w-full flex-col gap-8 sm:gap-10">
      {/* Header Block */}
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-3xl font-extrabold text-ink sm:text-[36px] sm:leading-tight">
          Today&apos;s Practice Complete 🎉
        </h1>
        <p className="text-base font-semibold text-ink-muted">
          3 / 3 areas completed · 27 min
        </p>
      </div>

      {/* Session Results Card */}
      <div className="flex flex-col gap-5 rounded-2xl border border-line bg-white p-6 shadow-[0_4px_16px_rgba(30,28,26,0.03)] sm:p-8">
        <h2 className="font-display text-lg font-bold text-ink sm:text-xl">
          Session Results
        </h2>

        <div className="flex flex-col">
          {sessionResults.map((item, index) => (
            <div key={item.area}>
              {index > 0 && <hr className="border-line my-4" />}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                {/* Left Area & Topic */}
                <div className="flex items-center gap-3">
                  <span
                    className={`size-2.5 shrink-0 rounded-full ${item.bulletColor}`}
                    aria-hidden
                  />
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm sm:text-base text-ink">
                      {item.area}
                    </span>
                    <span className="text-xs sm:text-sm text-ink-muted">
                      {item.topic}
                    </span>
                  </div>
                </div>

                {/* Right Badge & Score Delta */}
                <div className="flex items-center gap-3 self-end sm:self-center">
                  <span
                    className={`rounded-md px-2.5 py-1 text-xs font-bold ${item.badgeBg} ${item.badgeColor}`}
                  >
                    {item.badge}
                  </span>
                  <span className="font-semibold text-sm text-ink">
                    {item.scoreDelta}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Readiness Summary & CTA Panel */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pt-1">
        {/* Overall Readiness Pill */}
        <div className="inline-flex items-center gap-3 rounded-xl border border-line bg-white px-5 py-3 shadow-[0_2px_8px_rgba(30,28,26,0.02)]">
          <span className="text-sm font-medium text-ink-muted">
            Overall Readiness
          </span>
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#b0a898]">68%</span>
            <span className="text-sm text-[#b0a898]">→</span>
            <span className="text-base font-bold text-ink">72%</span>
            <TrendingUp className="size-4 text-[#10b981]" />
          </div>
        </div>

        {/* View Recommendations CTA */}
        <div className="flex justify-end">
          <Link
            href="/preparation-plan"
            className="flex items-center justify-center rounded-full bg-brand px-8 py-3 text-[15px] font-semibold text-white shadow-[0_4px_12px_rgba(255,108,71,0.2)] transition-opacity hover:opacity-95 active:scale-[0.99]"
          >
            View Recommendations →
          </Link>
        </div>
      </div>
    </div>
  );
}
