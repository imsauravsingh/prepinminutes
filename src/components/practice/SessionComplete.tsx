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
    bulletColor: "bg-[#ff6c47]",
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
    badgeColor: "text-[#ff6c47]",
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
    <div className="mx-auto flex w-full max-w-[1064px] flex-col gap-10">
      {/* Centered Header Block matching Figma node 109:786 */}
      <div className="flex flex-col items-center gap-3 text-center">
        <h1 className="font-display text-3xl font-extrabold text-ink sm:text-[36px] sm:leading-tight">
          Today&apos;s Practice Complete 🎉
        </h1>
        <p className="text-base font-semibold text-ink-muted">
          3 / 3 areas completed · 27 min
        </p>
      </div>

      {/* Summary Card (summary-card) */}
      <div className="flex flex-col gap-5 rounded-[20px] border border-line bg-white p-6 shadow-[0_4px_16px_rgba(30,28,26,0.03)] sm:p-8">
        <h2 className="font-display text-[18px] font-extrabold text-ink">
          Session Results
        </h2>

        <hr className="border-line" />

        {sessionResults.map((item, index) => (
          <div key={item.area} className="flex flex-col gap-5">
            {index > 0 && <hr className="border-line" />}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              {/* Area info with indicator dot */}
              <div className="flex items-center gap-3">
                <span
                  className={`size-2.5 shrink-0 rounded-full ${item.bulletColor}`}
                  aria-hidden
                />
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-semibold text-ink">
                    {item.area}
                  </span>
                  <span className="text-xs text-ink-muted">{item.topic}</span>
                </div>
              </div>

              {/* Badge and score delta */}
              <div className="flex items-center gap-4 self-end sm:self-center">
                <span
                  className={`rounded px-2 py-0.5 text-[11px] font-bold ${item.badgeBg} ${item.badgeColor}`}
                >
                  {item.badge}
                </span>
                <span className="text-sm font-semibold text-ink">
                  {item.scoreDelta}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Readiness Summary Panel (readiness-summary-panel) */}
      <div className="flex flex-col gap-5 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Overall Readiness Metric */}
        <div className="flex flex-col gap-1">
          <span className="text-sm font-semibold text-ink-muted">
            Overall Readiness
          </span>
          <div className="flex items-center gap-3">
            <span className="font-sans text-[32px] font-medium leading-none text-[#b0a898]">
              68%
            </span>
            <span className="text-lg text-[#b0a898]">→</span>
            <span className="font-display text-[36px] font-extrabold leading-none text-ink">
              72%
            </span>
            <TrendingUp className="size-4 text-[#10b981] stroke-[2.5]" />
          </div>
        </div>

        {/* View Recommendations CTA */}
        <div className="flex justify-start sm:justify-end">
          <Link
            href="/preparation-plan"
            className="flex items-center justify-center rounded-full bg-brand pl-9 pr-8 py-3.5 text-[15px] font-semibold text-white shadow-[0_4px_12px_rgba(255,108,71,0.2)] transition-opacity hover:opacity-95 active:scale-[0.99]"
          >
            View Recommendations →
          </Link>
        </div>
      </div>
    </div>
  );
}
