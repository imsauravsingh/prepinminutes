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
    <section className="border-y border-line bg-cream px-4 py-16 sm:px-6 lg:px-[120px] lg:py-[100px]">
      <div className="flex flex-col items-center gap-10 lg:gap-16">
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-sm font-bold uppercase text-brand">Metric Readout</p>
          <h2 className="font-display text-[28px] font-extrabold leading-[34px] text-ink sm:text-[34px] sm:leading-[40px] lg:text-[40px] lg:leading-[48px]">
            Know where you stand before the interview
          </h2>
          <p className="w-full max-w-[720px] text-base leading-[26px] text-ink-muted">
            Stop relying on gut feelings. Our predictive Readiness Score correlates with real hire
            results at tier-1 technology partners.
          </p>
        </div>

        <div className="flex w-full flex-col items-center gap-10 lg:flex-row lg:gap-16">
          <div className="relative flex size-64 shrink-0 items-center justify-center rounded-full border-[1.5px] border-line bg-white shadow-[0_16px_16px_rgba(107,102,97,0.04)] sm:size-80 lg:size-[400px]">
            <div className="relative flex size-[85%] items-center justify-center">
              <ProgressRing percentage={78} />
              <div className="absolute flex flex-col items-center gap-1 sm:gap-2">
                <p className="font-display text-[40px] font-extrabold text-ink sm:text-[52px] lg:text-[64px]">
                  78%
                </p>
                <p className="text-xs font-bold uppercase text-brand sm:text-sm">
                  Interview Ready
                </p>
              </div>
            </div>
          </div>

          <div className="flex w-full flex-1 flex-col gap-6">
            {dimensions.map((dim) => (
              <div key={dim.label} className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-3 text-ink">
                  <p className="font-display text-sm font-bold sm:text-base">{dim.label}</p>
                  <p className="shrink-0 text-[15px] font-semibold">{dim.value}%</p>
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
