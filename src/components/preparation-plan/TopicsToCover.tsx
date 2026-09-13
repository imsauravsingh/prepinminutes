import { RefreshCw } from "lucide-react";

type TopicItem = {
  title: string;
  typeAndDuration: string;
  status: "In Progress" | "Not Started";
};

const topics: TopicItem[] = [
  {
    title: "Scalability Fundamentals",
    typeAndDuration: "Reading · 10 min",
    status: "Not Started",
  },
  {
    title: "Load Balancing Strategies",
    typeAndDuration: "Reading · 8 min",
    status: "Not Started",
  },
  {
    title: "Database Sharding",
    typeAndDuration: "Practice · 20 min",
    status: "Not Started",
  },
  {
    title: "CAP Theorem",
    typeAndDuration: "Reading · 10 min",
    status: "In Progress",
  },
  {
    title: "Microservices Architecture",
    typeAndDuration: "Practice · 25 min",
    status: "Not Started",
  },
  {
    title: "Caching Strategies",
    typeAndDuration: "Reading · 12 min",
    status: "Not Started",
  },
  {
    title: "API Design Patterns",
    typeAndDuration: "Practice · 15 min",
    status: "Not Started",
  },
  {
    title: "Distributed Systems Trade-offs",
    typeAndDuration: "Reading · 10 min",
    status: "Not Started",
  },
];

export function TopicsToCover() {
  return (
    <div className="flex w-full flex-col gap-5 rounded-[20px] border border-line bg-white p-5 sm:p-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div className="flex flex-col gap-1">
          <h2 className="font-display text-base font-extrabold text-ink sm:text-lg">
            System Design - Topics to Cover
          </h2>
          <p className="max-w-2xl text-[13px] leading-5 text-ink-muted">
            Selected based on your resume experience gaps, Google&apos;s Senior
            SWE interview format, and your 28% score on distributed systems in
            your last evaluation.
          </p>
        </div>

        <button
          type="button"
          className="flex items-center gap-2 rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-ink-muted transition-colors hover:bg-cream"
        >
          <RefreshCw className="size-3.5 text-ink-muted" />
          <span>Sync with latest mock</span>
        </button>
      </div>

      <hr className="border-line" />

      {/* Topics list */}
      <div className="flex flex-col gap-3">
        {topics.map((item) => {
          const isInProgress = item.status === "In Progress";

          return (
            <div
              key={item.title}
              className="flex flex-col justify-between gap-2.5 rounded-[10px] border border-line bg-[#fbf9f4] p-3 sm:flex-row sm:items-center sm:px-4 sm:py-3"
            >
              {/* Left group */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Status indicator checkbox */}
                <div
                  className={`flex size-4 shrink-0 items-center justify-center rounded ${
                    isInProgress
                      ? "border border-[#f59e0b] bg-[#fef3c7]"
                      : "border border-[#b0a898]"
                  }`}
                >
                  {isInProgress && (
                    <div className="size-2 rounded-xs bg-[#f59e0b]" />
                  )}
                </div>

                <span className="text-sm font-semibold text-ink">
                  {item.title}
                </span>

                <span className="rounded border border-line bg-[#fbf9f4] px-1.5 py-0.5 text-[11px] font-bold text-ink-muted">
                  {item.typeAndDuration}
                </span>
              </div>

              {/* Right status badge */}
              <div className="flex sm:justify-end">
                <span
                  className={`rounded border px-2 py-0.5 text-[11px] font-bold ${
                    isInProgress
                      ? "border-[#f59e0b] bg-white text-[#f59e0b]"
                      : "border-[#b0a898] bg-white text-[#b0a898]"
                  }`}
                >
                  {item.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
