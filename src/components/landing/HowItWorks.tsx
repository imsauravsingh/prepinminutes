import {
  FileText,
  Cpu,
  Calendar,
  Edit3,
  Award,
  AlertTriangle,
  BookOpen,
  CheckCircle,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { Blob, RuledLines } from "./decorative";

const steps: {
  icon: LucideIcon;
  color: string;
  number: string;
  title: string;
  description: string;
}[] = [
  { icon: FileText, color: "#3b82f6", number: "01", title: "Resume + JD", description: "Input background" },
  { icon: Cpu, color: "#10b981", number: "02", title: "AI Analysis", description: "Skill extraction" },
  { icon: Calendar, color: "#ff6c47", number: "03", title: "Personal Plan", description: "Dynamic schedule" },
  { icon: Edit3, color: "#f59e0b", number: "04", title: "Practice", description: "Tailored drills" },
  { icon: Award, color: "#ef4444", number: "05", title: "Evaluation", description: "Answers graded" },
  { icon: AlertTriangle, color: "#8b5cf6", number: "06", title: "Weakness Alert", description: "Identify gaps" },
  { icon: BookOpen, color: "#ec4899", number: "07", title: "Smart Revision", description: "Reinforced learning" },
  { icon: CheckCircle, color: "#06b6d4", number: "08", title: "Ready!", description: "Enter confident" },
];

export function HowItWorks() {
  return (
    <section className="relative overflow-hidden px-[120px] py-[100px]">
      <RuledLines height={500} spacing={28} opacity={0.4} color="#c9c2b6" />
      <Blob size={280} color="#93C5FD" opacity={0.12} className="left-[1280px] top-20" />

      <div className="relative flex flex-col items-center gap-16">
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-sm font-bold uppercase text-brand">Workflow pipeline</p>
          <h2 className="font-display text-[40px] font-extrabold leading-[48px] text-ink">
            How PrepInMinutes Works
          </h2>
          <p className="w-[720px] text-base leading-[26px] text-ink-muted">
            A highly intelligent continuous loop designed to take you from a raw candidate to
            fully interview-confident.
          </p>
        </div>

        <div className="flex w-full items-center gap-2">
          {steps.map((step, i) => (
            <div key={step.number} className="flex flex-1 items-center">
              <div
                className="flex flex-1 flex-col gap-2.5 rounded-2xl border-[1.5px] bg-white p-4"
                style={{
                  borderColor: step.color,
                  boxShadow: `0 6px 6px ${step.color}14`,
                }}
              >
                <div className="flex items-center justify-between">
                  <step.icon className="size-[18px]" style={{ color: step.color }} />
                  <p className="text-[11px] font-extrabold text-ink-muted">{step.number}</p>
                </div>
                <p className="truncate font-display text-[13px] font-bold text-ink">
                  {step.title}
                </p>
                <p className="truncate text-[11px] text-ink-muted">{step.description}</p>
              </div>
              {i < steps.length - 1 && (
                <ArrowRight className="mx-1 size-3 shrink-0 text-ink-muted" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
