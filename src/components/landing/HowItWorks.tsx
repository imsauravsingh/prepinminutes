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
import type { CSSProperties } from "react";
import { PrepSection } from "./journey/PrepSection";
import { RevealOnView } from "./RevealOnView";

const steps: {
  icon: LucideIcon;
  color: string;
  title: string;
  description: string;
}[] = [
  { icon: FileText, color: "#3b82f6", title: "Resume + JD", description: "Add your background" },
  { icon: Cpu, color: "#10b981", title: "AI Analysis", description: "Skills extracted" },
  { icon: Calendar, color: "#ff6c47", title: "Personal Plan", description: "Daily schedule" },
  { icon: Edit3, color: "#f59e0b", title: "Practice", description: "Tailored drills" },
  { icon: Award, color: "#ef4444", title: "Evaluation", description: "Answers graded" },
  { icon: AlertTriangle, color: "#8b5cf6", title: "Weakness Alert", description: "Gaps found" },
  { icon: BookOpen, color: "#ec4899", title: "Smart Revision", description: "Reinforced learning" },
  { icon: CheckCircle, color: "#06b6d4", title: "Ready!", description: "Walk in confident" },
];

/** Seconds each card stays highlighted as the loop flows through the pipeline. */
const STEP_SECONDS = 1.2;

export function HowItWorks() {
  return (
    <PrepSection
      id="how-it-works"
      step={2}
      kicker="The plan"
      title="How PrepInMinutes works"
      intro="One continuous loop that takes you from a raw candidate to interview-confident. Watch your plan flow from step to step."
    >
      <div
        className="flow-pipeline relative w-full lg:pb-10"
        style={{ "--flow-total": `${steps.length * STEP_SECONDS}s`, "--flow-steps": steps.length } as CSSProperties}
      >
        {/* Rail under the cards with a pulse that reaches each card as it lights up (desktop). */}
        <RevealOnView className="absolute inset-0 hidden lg:block">
          <div aria-hidden="true" className="flow-track">
            <span className="flow-track-pulse" />
          </div>
        </RevealOnView>

        <ol className="relative grid w-full grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8 lg:gap-3">
          {steps.map((step, i) => (
            <li key={step.title} className="flex">
              <RevealOnView variant="pop" delay={i * 140} className="flex w-full">
                <div
                  className="flow-card group flex w-full flex-col items-center gap-2.5 rounded-2xl p-4 text-center"
                  style={{ "--c": step.color, "--i": i } as CSSProperties}
                >
                  <span className="flow-icon flex size-12 items-center justify-center rounded-full">
                    <step.icon className="size-[22px]" aria-hidden="true" />
                  </span>
                  <span className="font-marker text-xl font-bold leading-none" style={{ color: step.color }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="font-display text-[15px] font-bold leading-tight text-ink">{step.title}</p>
                  <p className="text-[13px] leading-snug text-ink-muted">{step.description}</p>
                </div>
              </RevealOnView>
            </li>
          ))}
        </ol>
      </div>

      <RevealOnView delay={900}>
        <p className="text-center font-marker text-[26px] font-bold text-marker-blue">
          &hellip;and the loop repeats until you&rsquo;re ready &#8635;
        </p>
      </RevealOnView>
    </PrepSection>
  );
}
