import type { CSSProperties } from "react";
import { PrepSection } from "./journey/PrepSection";
import { RevealOnView } from "./RevealOnView";
import { CountUpOnView } from "./motion/CountUpOnView";

const dimensions = [
  { label: "Technical Core", value: 85, color: "#3b82f6" },
  { label: "System Design & Architecture", value: 72, color: "#ff6c47" },
  { label: "Algorithmic Problem Solving", value: 80, color: "#10b981" },
  { label: "Communication & Soft Skills", value: 65, color: "#ec4899" },
  { label: "Behavioral & Leadership", value: 88, color: "#f59e0b" },
];

const ticks = Array.from({ length: 60 }, (_, i) => i);
const SCORE = 78;
const RING_R = 80;
const RING_C = 2 * Math.PI * RING_R;

export function ReadinessScore() {
  return (
    <PrepSection
      step={4}
      kicker="The scoreboard"
      title="Know where you stand before the interview"
      intro="No more gut feelings. Your Readiness Score shows exactly how close you are, and which skills need one more round."
    >
      <div className="flex w-full flex-col items-center gap-12 lg:flex-row lg:gap-16">
        {/* Styled like the wall clock in the hero scene: coral rim, white face, ticks. */}
        <RevealOnView className="shrink-0">
          <div className="relative flex size-64 items-center justify-center rounded-full border-[14px] border-[#e8673f] bg-white shadow-[0_18px_36px_rgba(96,60,36,0.16),inset_0_0_0_2px_#f3c4b3] sm:size-80 lg:size-[380px]">
            <svg aria-hidden="true" viewBox="-100 -100 200 200" className="absolute inset-0 size-full">
              {ticks.map((i) => (
                <line
                  key={i}
                  x1="0"
                  y1={i % 5 === 0 ? -84 : -88}
                  x2="0"
                  y2="-93"
                  stroke={i % 5 === 0 ? "#3a2f2a" : "#cbbfb6"}
                  strokeWidth={i % 5 === 0 ? 2.4 : 1}
                  strokeLinecap="round"
                  transform={`rotate(${i * 6})`}
                />
              ))}
            </svg>
            <div className="relative flex size-[74%] items-center justify-center">
              <svg aria-hidden="true" viewBox="0 0 200 200" className="absolute inset-0 size-full -rotate-90">
                <circle cx="100" cy="100" r={RING_R} fill="none" stroke="#f4efe8" strokeWidth="16" />
                <circle
                  cx="100"
                  cy="100"
                  r={RING_R}
                  fill="none"
                  stroke="#ff6c47"
                  strokeWidth="16"
                  strokeLinecap="round"
                  className="score-ring-fill"
                  style={{ "--c": RING_C, "--o": RING_C * (1 - SCORE / 100) } as CSSProperties}
                />
              </svg>
              <div className="absolute flex flex-col items-center gap-1">
                <p className="font-display text-[40px] font-extrabold text-ink sm:text-[52px] lg:text-[60px]">
                  <CountUpOnView value={SCORE} />
                </p>
                <p className="font-marker text-xl font-bold text-brand sm:text-2xl">interview ready</p>
              </div>
            </div>
          </div>
        </RevealOnView>

        <RevealOnView delay={150} className="flex w-full flex-1 flex-col gap-6">
          {dimensions.map((dim, i) => (
            <div key={dim.label} className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-3 text-ink">
                <p className="font-display text-[15px] font-bold sm:text-base">{dim.label}</p>
                <p className="shrink-0 text-[15px] font-semibold">{dim.value}%</p>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#efe3d8]">
                <div
                  className="bar-fill-x h-full rounded-full"
                  style={
                    {
                      width: `${dim.value}%`,
                      background: `linear-gradient(90deg, ${dim.color}, ${dim.color}b3)`,
                      "--enter-delay": `${200 + i * 120}ms`,
                    } as CSSProperties
                  }
                />
              </div>
            </div>
          ))}
        </RevealOnView>
      </div>
    </PrepSection>
  );
}
