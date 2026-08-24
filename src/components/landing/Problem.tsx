import { Layers, User, EyeOff, RotateCcw, type LucideIcon } from "lucide-react";
import { Blob, RuledLines } from "./decorative";

const problems: {
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
}[] = [
  {
    icon: Layers,
    iconBg: "#e6f4f8",
    iconColor: "#3b82f6",
    title: "Too many topics",
    description:
      "Overwhelmed by what to study. Sifting through infinite lists of problems, articles, and roadmaps without knowing what matters.",
  },
  {
    icon: User,
    iconBg: "#edf5ec",
    iconColor: "#10b981",
    title: "Generic questions",
    description:
      "Practicing questions that never come up. Your target role needs custom scenarios, not cookie-cutter templates.",
  },
  {
    icon: EyeOff,
    iconBg: "#fdf0f4",
    iconColor: "#ec4899",
    title: "No feedback",
    description:
      "Practicing completely in the dark. Without detailed correction and evaluation, you keep repeating the same errors.",
  },
  {
    icon: RotateCcw,
    iconBg: "#fef7ea",
    iconColor: "#f59e0b",
    title: "No structured revision",
    description:
      "Forgetting key concepts just days later. Lack of dynamic reminders means you don't reinforce weak spots.",
  },
];

export function Problem() {
  return (
    <section className="relative overflow-hidden border-y border-line bg-cream px-4 py-16 sm:px-6 lg:px-[120px] lg:py-[100px]">
      {/* <RuledLines height={600} spacing={32} opacity={0.5} color="#d6cfc4" /> */}
      <Blob
        size={300}
        color="#FF6C47"
        opacity={0.08}
        className="-left-[140px] top-[159px] hidden sm:block"
      />

      <div className="relative flex flex-col items-center gap-10 lg:gap-16">
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-sm font-bold uppercase text-brand">
            The Challenge
          </p>
          <h2 className="font-display text-[28px] font-extrabold leading-[34px] text-ink sm:text-[34px] sm:leading-[40px] lg:text-[40px] lg:leading-[48px]">
            Interview preparation shouldn&apos;t feel random
          </h2>
          <p className="w-full max-w-[720px] text-base leading-[26px] text-ink-muted">
            Traditional interview prep is broken. Candidates spend hundreds of
            hours studying the wrong things in the dark, leading to high anxiety
            and poor performance.
          </p>
        </div>

        <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {problems.map(
            ({ icon: Icon, iconBg, iconColor, title, description }) => (
              <div
                key={title}
                className="flex flex-col gap-4 rounded-[20px] border border-line bg-white p-6 shadow-[0_8px_8px_rgba(107,102,97,0.03)] lg:p-7"
              >
                <div
                  className="flex size-11 items-center justify-center rounded-xl"
                  style={{ backgroundColor: iconBg }}
                >
                  <Icon className="size-5" style={{ color: iconColor }} />
                </div>
                <p className="font-display text-lg font-bold text-ink">
                  {title}
                </p>
                <p className="text-sm leading-[22px] text-ink-muted">
                  {description}
                </p>
              </div>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
