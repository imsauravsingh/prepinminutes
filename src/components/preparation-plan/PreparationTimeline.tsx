type PhaseCard = {
  days: string;
  isCurrent?: boolean;
  phase: string;
  description: string;
  completed: string;
};

const phases: PhaseCard[] = [
  {
    days: "Days 1-4",
    isCurrent: true,
    phase: "Foundation Building",
    description: "System Design basics, Data Structures review",
    completed: "1/6 completed",
  },
  {
    days: "Days 5-8",
    phase: "Skill Deepening",
    description: "Advanced system design, Behavioral prep, Coding patterns",
    completed: "0/5 completed",
  },
  {
    days: "Days 9-11",
    phase: "Mock & Polish",
    description: "Full mock interviews, weakness review",
    completed: "0/4 completed",
  },
  {
    days: "Day 12",
    phase: "Final Review",
    description: "Light review, confidence building",
    completed: "0/2 completed",
  },
];

export function PreparationTimeline() {
  return (
    <div className="flex w-full flex-col gap-4">
      <h2 className="font-display text-lg font-extrabold text-ink sm:text-xl">
        Preparation Timeline
      </h2>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {phases.map((item) => (
          <div
            key={item.days}
            className={`flex flex-col justify-between gap-3 rounded-2xl p-5 ${
              item.isCurrent
                ? "border border-brand bg-[#fff0ec]"
                : "border border-line bg-white"
            }`}
          >
            {/* Header row */}
            <div className="flex items-center justify-between">
              <span
                className={`font-display text-[13px] font-extrabold ${
                  item.isCurrent ? "text-brand" : "text-[#b0a898]"
                }`}
              >
                {item.days}
              </span>
              {item.isCurrent && (
                <span className="rounded-full bg-brand px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                  CURRENT PHASE
                </span>
              )}
            </div>

            {/* Middle details */}
            <div className="flex flex-col gap-1">
              <p className="font-display text-base font-extrabold text-ink">
                {item.phase}
              </p>
              <p className="text-xs leading-4 text-ink-muted">
                {item.description}
              </p>
            </div>

            {/* Completed badge */}
            <div className="w-fit rounded-full border border-line bg-[#fbf9f4] px-2.5 py-1 text-[11px] font-bold text-ink-muted">
              {item.completed}
            </div>
          </div>
        ))}
      </div>

      <p className="text-[13px] text-ink-muted">
        Timeline adapts based on your practice and evaluation results
      </p>
    </div>
  );
}
