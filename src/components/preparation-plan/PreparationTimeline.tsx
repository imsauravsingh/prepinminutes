"use client";

import { Calendar, Clock, ArrowRight } from "lucide-react";

export type Phase = {
  id: string;
  days: string;
  phase: string;
  description: string;
  status: "In Progress" | "Not Started";
  icon: typeof Clock;
  iconBg: string;
  iconColor: string;
  textColor: string;
};

export const phases: Phase[] = [
  {
    id: "phase-1",
    days: "Days 1–4",
    phase: "Foundation Building",
    description: "Core concepts & basics",
    status: "In Progress",
    icon: Clock,
    iconBg: "bg-[#ffede6]",
    iconColor: "text-[#ea580c]",
    textColor: "text-[#ea580c]",
  },
  {
    id: "phase-2",
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
    id: "phase-3",
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
    id: "phase-4",
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

interface PreparationTimelineProps {
  selectedPhase: string;
  onSelectPhase: (phaseId: string) => void;
}

export function PreparationTimeline({
  selectedPhase,
  onSelectPhase,
}: PreparationTimelineProps) {
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
              Your preparation plan is divided into focused phases. Click a
              phase to view its specific topics and updated readiness.
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

      {/* Clickable Phase Cards in 4-column responsive desktop grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 w-full">
        {phases.map((item) => {
          const Icon = item.icon;
          const isActive = selectedPhase === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectPhase(item.id)}
              className={`flex h-full flex-col justify-between gap-4 rounded-2xl p-4 sm:p-5 text-left transition-all cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                isActive
                  ? "border-2 border-[#ff8c73] bg-[#fffbf9] shadow-[0_4px_16px_rgba(234,88,12,0.08)] scale-[1.01]"
                  : "border border-line bg-white shadow-[0_2px_8px_rgba(30,28,26,0.03)] hover:border-[#ff8c73]/60 hover:bg-[#faf8f5]/60 hover:shadow-md"
              }`}
              aria-pressed={isActive}
            >
              {/* Top days badge */}
              <div className="flex items-center justify-between w-full">
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

                {isActive && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#ea580c] bg-[#fff1ec] px-1.5 py-0.5 rounded">
                    Active
                  </span>
                )}
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
                {isActive ? (
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
            </button>
          );
        })}
      </div>
    </div>
  );
}
