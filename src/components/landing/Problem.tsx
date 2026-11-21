import { Layers, User, EyeOff, RotateCcw, Check, type LucideIcon } from "lucide-react";
import type { CSSProperties } from "react";
import { PrepSection } from "./journey/PrepSection";
import { RevealOnView } from "./RevealOnView";
import { TiltCard } from "./motion/TiltCard";

/**
 * Each common prep problem is a sticky note pinned to the wall, with a small
 * green "fix" note stuck on it, so the section reads as problem → fix and
 * leads into the plan (step 2).
 */
const problems: {
  icon: LucideIcon;
  note: string;
  pin: string;
  rot: number;
  title: string;
  description: string;
  fix: string;
}[] = [
  {
    icon: Layers,
    note: "var(--color-note-yellow)",
    pin: "#e2502e",
    rot: -2.2,
    title: "Too many topics",
    description: "Endless problems, articles, and roadmaps, with no idea which ones matter for your interview.",
    fix: "A focused plan from your resume and target role.",
  },
  {
    icon: User,
    note: "var(--color-note-coral)",
    pin: "#2563eb",
    rot: 1.6,
    title: "Generic questions",
    description: "Practicing questions that never come up, instead of scenarios for the role you want.",
    fix: "Questions tailored to your role, company, and level.",
  },
  {
    icon: EyeOff,
    note: "var(--color-note-blue)",
    pin: "#e2502e",
    rot: -1.2,
    title: "No feedback",
    description: "Practicing in the dark, so the same mistakes keep repeating without you noticing.",
    fix: "Every answer graded, with clear and specific feedback.",
  },
  {
    icon: RotateCcw,
    note: "#ffd6a5",
    pin: "#2563eb",
    rot: 2.1,
    title: "No structured revision",
    description: "Key concepts fade within days because nothing brings weak spots back for review.",
    fix: "Smart revision that brings weak topics back on time.",
  },
];

export function Problem() {
  return (
    <PrepSection
      step={1}
      kicker="The challenge"
      title="Interview preparation shouldn't feel random"
      intro="Most candidates spend hundreds of hours studying the wrong things, with no idea what is working. Here is what usually goes wrong, and how we fix it."
    >
      <div className="grid w-full grid-cols-1 gap-x-7 gap-y-12 pt-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-6">
        {problems.map(({ icon: Icon, note, pin, rot, title, description, fix }, i) => (
          <RevealOnView key={title} variant="drop" delay={i * 140} className="sticky-slot relative z-0 h-full hover:z-10">
            <TiltCard className="h-full" max={6}>
              <article
                className="sticky-note group relative flex h-full flex-col gap-3 px-6 pb-6 pt-8"
                style={{ "--note": note, "--pin": pin, "--rot": `${rot}deg` } as CSSProperties}
              >
                <span aria-hidden="true" className="sticky-pin" />

                <div className="flex items-center justify-between">
                  <span className="flex size-11 items-center justify-center rounded-full bg-white/55">
                    <Icon className="size-5 text-ink" aria-hidden="true" />
                  </span>
                  <span className="font-marker text-2xl font-bold leading-none text-ink/45">
                    #{i + 1}
                  </span>
                </div>

                <h3 className="font-marker text-[30px] font-bold leading-[1.05] text-ink">{title}</h3>
                <p className="text-[15px] leading-6 text-ink/80">{description}</p>

                {/* Small green note stuck on top: how PrepInMinutes fixes it. */}
                <div className="sticky-fix mt-auto flex items-start gap-2.5 self-end">
                  <span aria-hidden="true" className="sticky-fix-tape" />
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-success text-white">
                    <Check className="size-3" strokeWidth={3} aria-hidden="true" />
                  </span>
                  <p className="text-[13.5px] leading-5 text-ink">
                    <span className="font-bold text-[#0b7a53]">Fix: </span>
                    {fix}
                  </p>
                </div>
              </article>
            </TiltCard>
          </RevealOnView>
        ))}
      </div>

      <RevealOnView delay={600}>
        <p className="text-center font-marker text-[26px] font-bold text-marker-blue">
          So we turned the chaos into one clear plan &darr;
        </p>
      </RevealOnView>
    </PrepSection>
  );
}
