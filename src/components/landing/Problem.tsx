import { Layers, User, EyeOff, RotateCcw, type LucideIcon } from "lucide-react";
import type { CSSProperties } from "react";
import { PrepSection } from "./journey/PrepSection";
import { RevealOnView } from "./RevealOnView";
import { TiltCard } from "./motion/TiltCard";

const problems: {
  icon: LucideIcon;
  note: string;
  rot: number;
  title: string;
  description: string;
}[] = [
  {
    icon: Layers,
    note: "var(--color-note-yellow)",
    rot: -2.2,
    title: "Too many topics",
    description:
      "Overwhelmed by what to study. Sifting through endless problems, articles, and roadmaps without knowing what matters.",
  },
  {
    icon: User,
    note: "var(--color-note-coral)",
    rot: 1.6,
    title: "Generic questions",
    description:
      "Practicing questions that never come up. Your target role needs custom scenarios, not cookie-cutter templates.",
  },
  {
    icon: EyeOff,
    note: "var(--color-note-blue)",
    rot: -1.2,
    title: "No feedback",
    description:
      "Practicing in the dark. Without detailed correction and evaluation, you keep repeating the same mistakes.",
  },
  {
    icon: RotateCcw,
    note: "var(--color-note-green)",
    rot: 2.1,
    title: "No structured revision",
    description:
      "Forgetting key concepts days later. Without reminders, weak spots never get reinforced.",
  },
];

export function Problem() {
  return (
    <PrepSection
      step={1}
      kicker="The challenge"
      title="Interview preparation shouldn't feel random"
      intro="Most candidates spend hundreds of hours studying the wrong things, with no idea what is working. That leads to anxiety and poor performance."
    >
      <div className="grid w-full grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {problems.map(({ icon: Icon, note, rot, title, description }, i) => (
          <RevealOnView key={title} variant="drop" delay={i * 120} className="h-full">
            <TiltCard className="h-full rounded-[4px_4px_18px_4px]" max={9}>
            <article
              className="sticky-note relative flex h-full flex-col gap-3 rounded-[4px_4px_18px_4px] p-6 pt-8"
              style={{ background: note, "--rot": `${rot}deg` } as CSSProperties}
            >
              <span aria-hidden="true" className="sticky-tape" />
              <span className="flex size-10 items-center justify-center rounded-full bg-white/60">
                <Icon className="size-5 text-ink" aria-hidden="true" />
              </span>
              <h3 className="font-display text-lg font-bold text-ink">{title}</h3>
              <p className="text-[15px] leading-6 text-ink/80">{description}</p>
            </article>
            </TiltCard>
          </RevealOnView>
        ))}
      </div>

      <RevealOnView delay={300}>
        <p className="text-center font-marker text-[26px] font-bold text-marker-blue">
          So we turned the chaos into one clear plan &darr;
        </p>
      </RevealOnView>
    </PrepSection>
  );
}
