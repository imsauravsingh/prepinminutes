import { Calendar, Clock, ArrowRight } from "lucide-react";

type Phase = {
  days: string;
  phase: string;
  description: string;
  status: "In Progress" | "Not Started";
  icon: typeof Clock;
  iconBg: string;
  iconColor: string;
  textColor: string;
  isActive?: boolean;
};

const phases: Phase[] = [
  {
    days: "Days 1–4",
    phase: "Foundation Building",
    description: "Core concepts & basics",
    status: "In Progress",
    icon: Clock,
    iconBg: "bg-[#ffede6]",
    iconColor: "text-[#ea580c]",
    textColor: "text-[#ea580c]",
    isActive: true,
  },
  {
    days: "Days 5–8",
    phase: "Skill Deepening",
    description: "Advanced topics & practice",
    status: "Not Started",
    icon: Clock,
    iconBg: "bg-[#eff6ff]",
    iconColor: "text-[#3b82f6]",
    textColor: "text-[#3b82f6]",
  },
  {
    days: "Days 9–11",
    phase: "Mock & Polish",
    description: "Full mocks & weak areas",
    status: "Not Started",
    icon: Calendar,
    iconBg: "bg-[#ecfdf5]",
    iconColor: "text-[#10b981]",
    textColor: "text-[#10b981]",
  },
  {
    days: "Day 12",
    phase: "Final Review",
    description: "Quick revision & confidence",
    status: "Not Started",
    icon: Calendar,
    iconBg: "bg-[#f5f3ff]",
    iconColor: "text-[#8b5cf6]",
    textColor: "text-[#8b5cf6]",
  },
];

export function PreparationTimeline() {
  return (
    <div className="flex w-full flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div className="flex items-start gap-2.5">
          <Calendar className="mt-0.5 size-5 text-ink shrink-0" />
          <div className="flex flex-col">
            <h2 className="font-display text-base font-extrabold text-ink sm:text-lg">
              Preparation Timeline
            </h2>
            <p className="text-xs text-ink-muted">
              Your preparation plan is divided into focused phases. As you
              complete topics, your readiness by area will update.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="flex w-fit items-center gap-1.5 self-start sm:self-auto rounded-lg border border-line bg-white px-3 py-1.5 text-xs font-semibold text-[#2563eb] shadow-xs transition-colors hover:bg-cream"
        >
          <span>View full timeline</span>
          <ArrowRight className="size-3.5" />
        </button>
      </div>

      {/* Phase Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 w-full">
        {phases.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.days}
              className={`flex h-full flex-col justify-between gap-4 rounded-2xl p-4 sm:p-5 shadow-[0_2px_8px_rgba(30,28,26,0.03)] transition-all ${
                item.isActive
                  ? "border border-[#ff8c73] bg-[#fffbf9]"
                  : "border border-line bg-white"
              }`}
            >
              {/* Top days badge */}
              <div className="flex items-center gap-2">
                <div
                  className={`flex size-5 items-center justify-center rounded-full ${item.iconBg} ${item.iconColor}`}
                >
                  <Icon className="size-3" />
                </div>
                <span className={`text-xs font-bold ${item.textColor}`}>
                  {item.days}
                </span>
              </div>

              {/* Details */}
              <div className="flex flex-col gap-0.5">
                <span className="font-display text-sm font-extrabold text-ink">
                  {item.phase}
                </span>
                <span className="text-xs text-ink-muted">
                  {item.description}
                </span>
              </div>

              {/* Status Pill */}
              <div>
                {item.status === "In Progress" ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fff1ec] px-2.5 py-0.5 text-[11px] font-semibold text-[#ea580c]">
                    <span className="size-1.5 rounded-full bg-[#ea580c]" />
                    In Progress
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f4f2ee] px-2.5 py-0.5 text-[11px] font-medium text-[#78716c]">
                    <span className="size-1.5 rounded-full border border-[#78716c] bg-transparent" />
                    Not Started
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
