import { ProgressRing } from "./decorative";

const dimensions = [
  { label: "Technical Core", value: 85, color: "#3b82f6" },
  { label: "System Design & Architecture", value: 72, color: "#8b5cf6" },
  { label: "Algorithmic Problem Solving", value: 80, color: "#10b981" },
  { label: "Executive Communication & Soft Skills", value: 65, color: "#ec4899" },
  { label: "Behavioral & Leadership", value: 88, color: "#f59e0b" },
];

export function ReadinessScore() {
  return (
    <section className="border-y border-line bg-cream px-[120px] py-[100px]">
      <div className="flex flex-col items-center gap-16">
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-sm font-bold uppercase text-brand">Metric Readout</p>
          <h2 className="font-display text-[40px] font-extrabold leading-[48px] text-ink">
            Know where you stand before the interview
          </h2>
          <p className="w-[720px] text-base leading-[26px] text-ink-muted">
            Stop relying on gut feelings. Our predictive Readiness Score correlates with real hire
            results at tier-1 technology partners.
          </p>
        </div>

        <div className="flex w-full items-center gap-16">
          <div className="relative flex size-[400px] shrink-0 items-center justify-center rounded-full border-[1.5px] border-line bg-white shadow-[0_16px_16px_rgba(107,102,97,0.04)]">
            <div className="relative flex size-80 items-center justify-center">
              <ProgressRing percentage={78} />
              <div className="absolute flex flex-col items-center gap-2">
                <p className="font-display text-[64px] font-extrabold text-ink">78%</p>
                <p className="text-sm font-bold uppercase text-brand">Interview Ready</p>
              </div>
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-6">
            {dimensions.map((dim) => (
              <div key={dim.label} className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-ink">
                  <p className="font-display text-base font-bold">{dim.label}</p>
                  <p className="text-[15px] font-semibold">{dim.value}%</p>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-line">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${dim.value}%`, backgroundColor: dim.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
