import { ArrowRight, CheckCircle } from "lucide-react";
import { PrepSection } from "./journey/PrepSection";
import { RevealOnView } from "./RevealOnView";

const actions = [
  {
    title: "Revise distributed systems",
    description: "Failures, network partitions, and a CAP theorem review.",
  },
  {
    title: "Practice payment system design",
    description: "Reliable ledgers and dual-write mitigation drills.",
  },
  {
    title: "Take a mock interview",
    description: "45-minute scenario focused on resilience and trade-offs.",
  },
];

const highlights = [
  "Targeted problem sets that match your weak spots",
  "Quick concept cards for fast revision",
  "Adaptive mock sessions that focus on hard scenarios",
];

export function AiCoach() {
  return (
    <PrepSection
      step={3}
      kicker="The coach"
      title="Your preparation should adapt to you"
      intro="PrepInMinutes keeps updating your schedule and mock interviews based on how you actually perform, so you never waste weeks on the wrong focus."
    >
      <div className="flex w-full flex-col items-stretch gap-10 lg:flex-row lg:items-center lg:gap-14">
        <RevealOnView className="flex-1">
          {/* Styled like the monitor on the desk in the hero scene. */}
          <div className="monitor-frame flex flex-col gap-5 p-5 sm:p-7">
            <div className="flex items-center justify-between">
              <span className="font-display text-[15px] font-extrabold text-[#ff8a6b]">PrepInMinutes</span>
              <span className="flex items-center gap-2 text-[13px] text-[#a7f3d0]">
                <i className="live-dot" aria-hidden="true" /> AI coach live
              </span>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-4 sm:p-5">
              <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#aab2cc]">
                Coach insight · updated 2 min ago
              </p>
              <p className="text-[17px] font-medium leading-7 text-white">
                &ldquo;Your system design answers are strong on architecture but weak on failure
                handling and trade-offs.&rdquo;
              </p>
            </div>

            <div className="flex flex-col gap-2.5">
              <p className="text-[11px] font-bold uppercase tracking-wide text-[#aab2cc]">Recommended next</p>
              {actions.map((action, i) => (
                <RevealOnView key={action.title} delay={250 + i * 140}>
                  <div className="flex items-center gap-3.5 rounded-xl bg-white/[0.06] p-3.5 transition-colors hover:bg-white/10">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-extrabold text-white">
                      {i + 1}
                    </span>
                    <div className="flex-1">
                      <p className="font-display text-sm font-bold text-white">{action.title}</p>
                      <p className="text-[13px] text-[#cfd5ea]">{action.description}</p>
                    </div>
                    <ArrowRight className="size-4 shrink-0 text-[#aab2cc]" aria-hidden="true" />
                  </div>
                </RevealOnView>
              ))}
            </div>

            <a
              href="/sign-up"
              className="rounded-full bg-brand py-3 text-center text-[15px] font-semibold text-white shadow-[0_6px_14px_rgba(255,108,71,0.35)] transition-transform hover:-translate-y-0.5"
            >
              Start this plan &rarr;
            </a>
          </div>
        </RevealOnView>

        <RevealOnView delay={150} className="flex flex-1 flex-col gap-6">
          <h3 className="font-display text-2xl font-extrabold leading-8 text-ink sm:text-[32px] sm:leading-10">
            Smart coaching that removes the guesswork.
          </h3>
          <p className="text-base leading-[26px] text-ink-muted sm:text-[17px] sm:leading-7">
            The AI reviews your practice answers, grades your reasoning, and flags the gaps that
            matter most. You always know what to revise, when to practice, and when you are ready
            for a real mock.
          </p>
          <ul className="flex flex-col gap-4">
            {highlights.map((highlight) => (
              <li key={highlight} className="flex items-center gap-3">
                <CheckCircle className="size-5 shrink-0 text-success" aria-hidden="true" />
                <span className="text-[15px] text-ink sm:text-base">{highlight}</span>
              </li>
            ))}
          </ul>
        </RevealOnView>
      </div>
    </PrepSection>
  );
}
