import { Cpu } from "lucide-react";
import { Blob, DotGrid } from "./decorative";

const sparklineBars = [6, 10, 8, 14, 18];

const trendDays = [
  { label: "Day 1", height: 20 },
  { label: "Day 2", height: 35 },
  { label: "Day 3", height: 45 },
  { label: "Day 4", height: 30 },
  { label: "Day 5", height: 55 },
  { label: "Day 6", height: 68 },
  { label: "Day 7", height: 78 },
];

export function Hero() {
  return (
    <section className="relative flex items-center gap-12 overflow-hidden px-[120px] py-[100px]">
      <DotGrid size={500} className="left-0 top-0" />
      <Blob size={360} color="#93C5FD" opacity={0.12} className="left-[1000px] -top-[120px]" />
      <Blob size={200} color="#FF6C47" opacity={0.08} className="-left-20 top-[280px]" />

      <div className="relative flex flex-1 flex-col items-start gap-8">
        <div className="flex flex-col items-start gap-6">
          <span className="rounded-full border border-brand bg-brand-soft px-4 py-2 text-[13px] font-semibold text-brand">
            🚀 Powered by GPT-4 &amp; LLM Orchestration
          </span>
          <h1 className="font-display text-[54px] font-extrabold leading-[62px] text-ink">
            Stop guessing what to prepare. Start preparing with a plan.
          </h1>
          <p className="text-lg leading-7 text-ink-muted">
            PrepInMinutes analyzes your resume, target role, and job description to create a
            personalized interview preparation journey. Practice, get evaluated, identify
            weaknesses, and improve.
          </p>
        </div>
        <div className="flex items-center gap-6">
          <a
            href="#"
            className="rounded-full bg-brand px-6 py-3 text-[15px] font-semibold text-white shadow-[0_4px_6px_rgba(255,108,71,0.2)]"
          >
            Get Interview Ready →
          </a>
          <a href="#" className="text-[15px] font-semibold text-ink underline">
            See How It Works
          </a>
        </div>
      </div>

      <div className="relative flex-1 rounded-3xl border-[1.5px] border-line bg-white p-7 shadow-[0_16px_16px_rgba(107,102,97,0.08)]">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-success" />
              <p className="text-sm font-semibold text-ink">AI Preparation Coach Active</p>
            </div>
            <p className="text-[13px] text-ink-muted">Target: Staff Software Engineer</p>
          </div>

          <div className="h-px w-full bg-line" />

          <div className="flex gap-4">
            <div className="flex flex-1 flex-col gap-2 rounded-2xl bg-cream p-[18px]">
              <p className="text-[13px] text-ink-muted">Readiness Score</p>
              <div className="flex items-center gap-3">
                <p className="font-display text-[32px] font-extrabold text-success">78%</p>
                <div className="flex h-5 items-end gap-0.5">
                  {sparklineBars.map((h, i) => (
                    <span
                      key={i}
                      className="w-[3px] rounded-sm bg-success"
                      style={{ height: h }}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-2 rounded-2xl bg-cream p-[18px]">
              <p className="text-[13px] text-ink-muted">Preparation Tasks</p>
              <p className="font-display text-[28px] font-extrabold text-ink">4 / 6 Completed</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 rounded-2xl border border-brand bg-brand-soft p-5">
            <div className="flex items-center gap-2">
              <Cpu className="size-4 text-brand" />
              <p className="text-xs font-bold uppercase text-brand">AI Revision Coach</p>
            </div>
            <p className="text-[13px] leading-5 text-ink">
              &ldquo;Your system design answers are strong on architecture but weak on failure
              handling and trade-offs. Revise distributed systems.&rdquo;
            </p>
          </div>

          <div className="flex flex-col gap-3 rounded-2xl bg-cream p-5">
            <p className="text-[11px] font-semibold text-success">+18% this week</p>
            <p className="text-sm font-bold text-ink">Daily Active Readiness Trend</p>
            <div className="flex h-[60px] items-end justify-between pt-2.5">
              {trendDays.map((day, i) => (
                <div key={day.label} className="flex w-10 flex-col items-center gap-1.5">
                  <span
                    className={`w-3.5 rounded-[4px] ${
                      i === trendDays.length - 1 ? "bg-brand" : "bg-line"
                    }`}
                    style={{ height: day.height }}
                  />
                  <p className="text-[9px] text-ink-muted">{day.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
