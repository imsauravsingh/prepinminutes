import Link from "next/link";

interface AreaItem {
  area: string;
  bulletColor: string;
  topic: string;
  duration: string;
}

const upcomingAreas: AreaItem[] = [
  {
    area: "Data Structures",
    bulletColor: "bg-brand",
    topic: "Sliding Window",
    duration: "10 min",
  },
  {
    area: "System Design",
    bulletColor: "bg-[#0b8a8f]",
    topic: "Load Balancing",
    duration: "10 min",
  },
  {
    area: "Behavioral",
    bulletColor: "bg-[#8b5cf6]",
    topic: "Leadership & Conflict",
    duration: "7 min",
  },
];

export function SessionIntro() {
  return (
    <div className="flex w-full flex-col gap-8 sm:gap-12">
      {/* Breadcrumb matching Figma node 109:7 (y: 40) */}
      <div>
        <Link
          href="/practice"
          className="inline-flex items-center text-sm font-semibold text-brand transition-colors hover:underline"
        >
          ← Back to Practice
        </Link>
      </div>

      {/* Centered Intro Container (intro-card-centered in Figma: y: 106, height: 505) */}
      <div className="mx-auto flex w-full max-w-[1064px] flex-col items-center gap-8 py-4 text-center sm:py-10">
        {/* Title Block (Frame in Figma: max-w-[680px], itemSpacing: 12) */}
        <div className="flex max-w-[680px] flex-col items-center gap-3">
          <h1 className="font-display text-3xl font-extrabold text-ink sm:text-[36px] sm:leading-tight">
            Today&apos;s Practice
          </h1>
          <p className="text-base font-semibold text-ink-muted">
            3 preparation areas · ~27 min
          </p>
          <p className="text-[15px] leading-relaxed text-ink-muted">
            Your practice is based on today&apos;s personalized preparation
            plan. PrepInMinutes will guide you through the most valuable
            activities in sequence.
          </p>
        </div>

        {/* Upcoming Areas List (upcoming-areas-list in Figma: max-w-[540px], itemSpacing: 12) */}
        <div className="flex w-full max-w-[540px] flex-col gap-3">
          {upcomingAreas.map((item) => (
            <div
              key={item.area}
              className="flex h-[50px] items-center gap-3 rounded-xl border border-line bg-white px-4 text-left shadow-[0_2px_8px_rgba(30,28,26,0.02)]"
            >
              <span
                className={`size-2 shrink-0 rounded-full ${item.bulletColor}`}
                aria-hidden
              />
              <span className="shrink-0 text-sm font-semibold text-ink">
                {item.area}
              </span>
              <span className="shrink-0 text-sm text-[#b0a898]">•</span>
              <span className="flex-1 truncate text-sm text-ink-muted">
                {item.topic}
              </span>
              <span className="ml-auto shrink-0 text-[13px] font-semibold text-[#b0a898]">
                {item.duration}
              </span>
            </div>
          ))}
        </div>

        {/* Start Practice CTA (start-practice-btn in Figma: padding 16px 32px) */}
        <div>
          <Link
            href="/practice/session/coding"
            className="flex items-center justify-center rounded-full bg-brand px-8 py-4 text-base font-semibold text-white shadow-[0_4px_12px_rgba(255,108,71,0.2)] transition-opacity hover:opacity-95 active:scale-[0.99]"
          >
            Start Practice →
          </Link>
        </div>
      </div>
    </div>
  );
}
