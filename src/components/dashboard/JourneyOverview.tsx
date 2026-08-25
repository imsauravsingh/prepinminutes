import { User, Cpu, BookOpen, Keyboard, CheckCircle2, TrendingUp, ArrowRight, type LucideIcon } from "lucide-react";

const flowSteps: { icon: LucideIcon; label: string; active?: boolean }[] = [
  { icon: User, label: "Your Profile", active: true },
  { icon: Cpu, label: "AI Analysis" },
  { icon: BookOpen, label: "Prep Plan" },
  { icon: Keyboard, label: "Practice" },
  { icon: CheckCircle2, label: "Evaluate" },
  { icon: TrendingUp, label: "Improve" },
];

export function JourneyOverview() {
  return (
    <div className="flex w-full flex-col gap-5 rounded-[20px] border border-line bg-white p-7">
      <p className="font-display text-base font-bold text-ink">Here&apos;s what happens after setup</p>

      <div className="flex w-full items-center gap-2">
        {flowSteps.map((step, i) => (
          <div key={step.label} className="flex flex-1 items-center gap-2">
            <div className="flex flex-1 flex-col items-center gap-1.5">
              <span className="flex size-8 items-center justify-center rounded-full border border-line bg-[#fbf9f4]">
                <step.icon className="size-3.5 text-ink-muted" />
              </span>
              <p
                className={`text-[11px] ${step.active ? "font-semibold text-ink" : "font-medium text-ink-muted"}`}
              >
                {step.label}
              </p>
            </div>
            {i < flowSteps.length - 1 && (
              <ArrowRight className="size-3.5 shrink-0 text-line-strong" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
