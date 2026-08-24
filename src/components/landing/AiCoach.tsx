import { ArrowRight, CheckCircle } from "lucide-react";

const actions = [
  {
    title: "Revise distributed systems",
    description: "Read failures, partitioned networks, CAP theorem review.",
  },
  {
    title: "Practice payment system design",
    description: "Design reliable ledger, dual-write mitigation drills.",
  },
  {
    title: "Take a mock interview",
    description: "45-min scenario with focus on system resilience & trade-offs.",
  },
];

const highlights = [
  "Targeted problem sets matching specific weaknesses",
  "Conceptual crash cards for rapid revision loops",
  "Adaptive mock sessions emphasizing difficult scenarios",
];

export function AiCoach() {
  return (
    <section className="border-y border-line bg-cream px-[120px] py-[100px]">
      <div className="flex flex-col items-center gap-16">
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-sm font-bold uppercase text-brand">Adaptive Coaching</p>
          <h2 className="font-display text-[40px] font-extrabold leading-[48px] text-ink">
            Your preparation should adapt to you
          </h2>
          <p className="w-[720px] text-base leading-[26px] text-ink-muted">
            PrepInMinutes continuously updates your study schedule and mocks based on your real
            performance metrics, saving you weeks of misaligned focus.
          </p>
        </div>

        <div className="flex w-full items-center gap-12">
          <div className="flex flex-1 flex-col gap-6 rounded-3xl border-[1.5px] border-brand bg-white p-8 shadow-[0_12px_12px_rgba(255,108,71,0.07)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-brand" />
                <p className="text-[13px] font-semibold text-ink-muted">Coach Insight Session</p>
              </div>
              <p className="text-[11px] text-ink-muted">Updated 2m ago</p>
            </div>

            <div className="rounded-2xl bg-cream p-5">
              <p className="text-lg font-medium leading-7 text-ink">
                &ldquo;Your system design answers are strong on architecture but weak on failure
                handling and trade-offs.&rdquo;
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <p className="text-xs font-bold uppercase text-ink-muted">Recommended Actions:</p>
              {actions.map((action, i) => (
                <div key={action.title} className="flex items-center gap-4 rounded-xl bg-cream p-4">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-xs font-extrabold text-brand">
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <p className="font-display text-sm font-bold text-ink">{action.title}</p>
                    <p className="text-xs text-ink-muted">{action.description}</p>
                  </div>
                  <ArrowRight className="size-3.5 shrink-0 text-ink-muted" />
                </div>
              ))}
            </div>

            <a
              href="#"
              className="rounded-full bg-brand py-3 text-center text-[15px] font-semibold text-white shadow-[0_4px_6px_rgba(255,108,71,0.2)]"
            >
              Start Recommendation →
            </a>
          </div>

          <div className="flex flex-1 flex-col gap-6">
            <h3 className="font-display text-[32px] font-extrabold leading-10 text-ink">
              Smart coaching designed to eliminate study guesswork.
            </h3>
            <p className="text-base leading-[26px] text-ink-muted">
              Our AI engine continuously parses your practical answers, grades your conceptual
              logic, and flags high-leverage knowledge deficiencies. You get clear instructions on
              what systems to revise, when to practice, and when to book real mocks.
            </p>
            <div className="flex flex-col gap-4">
              {highlights.map((highlight) => (
                <div key={highlight} className="flex items-center gap-2.5">
                  <CheckCircle className="size-4 shrink-0 text-success" />
                  <p className="text-[15px] text-ink">{highlight}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
