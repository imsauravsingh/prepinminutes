import {
  FileText,
  Cpu,
  Calendar,
  Edit3,
  Award,
  AlertTriangle,
  BookOpen,
  CheckCircle,
  type LucideIcon,
} from "lucide-react";
import { PrepSection } from "./journey/PrepSection";
import { RevealOnView } from "./RevealOnView";

const steps: {
  icon: LucideIcon;
  color: string;
  number: string;
  title: string;
  description: string;
}[] = [
  { icon: FileText, color: "#3b82f6", number: "01", title: "Resume + JD", description: "Add your background" },
  { icon: Cpu, color: "#10b981", number: "02", title: "AI Analysis", description: "Skills extracted" },
  { icon: Calendar, color: "#ff6c47", number: "03", title: "Personal Plan", description: "Daily schedule" },
  { icon: Edit3, color: "#f59e0b", number: "04", title: "Practice", description: "Tailored drills" },
  { icon: Award, color: "#ef4444", number: "05", title: "Evaluation", description: "Answers graded" },
  { icon: AlertTriangle, color: "#8b5cf6", number: "06", title: "Weakness Alert", description: "Gaps found" },
  { icon: BookOpen, color: "#ec4899", number: "07", title: "Smart Revision", description: "Reinforced learning" },
  { icon: CheckCircle, color: "#06b6d4", number: "08", title: "Ready!", description: "Walk in confident" },
];

/** Hand-drawn marker arrow between two steps on the board. */
function MarkerArrow() {
  return (
    <svg aria-hidden="true" viewBox="0 0 36 16" className="hidden h-4 w-7 shrink-0 text-marker-blue lg:block">
      <path d="M2 9 C 12 5, 22 11, 31 8 M25 3 L32 8 L25 13" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function HowItWorks() {
  return (
    <PrepSection
      id="how-it-works"
      step={2}
      kicker="The plan"
      title="How PrepInMinutes works"
      intro="One continuous loop that takes you from a raw candidate to interview-confident, the same plan you saw on the whiteboard."
    >
      <RevealOnView className="w-full">
        <div className="whiteboard-frame w-full p-5 sm:p-8">
          <p className="mb-5 font-marker text-[28px] font-bold leading-none text-[#e2502e] sm:text-[32px]">
            Your prep pipeline
          </p>
          <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-4 lg:flex lg:items-center lg:gap-1">
            {steps.map((step, i) => (
              <RevealOnView key={step.number} delay={150 + i * 110} className="flex items-center lg:flex-1">
                <div
                  className="flex flex-1 flex-col gap-2 rounded-xl border-2 border-dashed bg-white/80 p-3.5"
                  style={{ borderColor: `${step.color}80` }}
                >
                  <div className="flex items-center justify-between">
                    <step.icon className="size-[18px]" style={{ color: step.color }} aria-hidden="true" />
                    <span className="font-marker text-lg font-bold leading-none" style={{ color: step.color }}>
                      {step.number}
                    </span>
                  </div>
                  <p className="font-display text-sm font-bold text-ink">{step.title}</p>
                  <p className="text-xs text-ink-muted">{step.description}</p>
                </div>
                {i < steps.length - 1 && <MarkerArrow />}
              </RevealOnView>
            ))}
          </div>
        </div>
      </RevealOnView>
    </PrepSection>
  );
}
