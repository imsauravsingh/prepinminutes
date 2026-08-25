import { Users2, Building2, Calendar, ChevronDown, ArrowRight } from "lucide-react";

export function GoalCard() {
  return (
    <div className="flex w-full flex-col gap-7 rounded-3xl border-[1.5px] border-brand bg-white p-8 shadow-[0px_16px_16px_rgba(255,108,71,0.05)]">
      <div className="flex flex-col gap-1.5">
        <p className="font-display text-[22px] font-extrabold text-ink">What are you preparing for?</p>
        <p className="text-sm text-ink-muted">
          We calibrate our questions and evaluations specifically to your target parameters.
        </p>
      </div>

      <div className="flex items-start gap-4">
        <div className="flex flex-1 flex-col gap-2">
          <p className="text-xs font-semibold uppercase text-ink">Target Role</p>
          <div className="flex items-center gap-2 rounded-lg border border-[#ede6db] bg-[#fbf9f4] p-3">
            <Users2 className="size-4 text-ink-muted" />
            <p className="text-sm text-ink-muted">Senior Software Engineer</p>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-2">
          <p className="text-xs font-semibold uppercase text-ink">Target Company</p>
          <div className="flex items-center justify-between rounded-lg border border-[#ede6db] bg-[#fbf9f4] p-3">
            <div className="flex items-center gap-2">
              <Building2 className="size-4 text-ink-muted" />
              <p className="text-sm text-ink-muted">Google</p>
            </div>
            <ChevronDown className="size-3.5 text-ink-muted" />
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-2">
          <p className="text-xs font-semibold uppercase text-ink">Interview Date</p>
          <div className="flex items-center justify-between rounded-lg border border-[#ede6db] bg-[#fbf9f4] p-3">
            <div className="flex items-center gap-2">
              <Calendar className="size-4 text-ink-muted" />
              <p className="text-sm text-ink-muted">Select date</p>
            </div>
            <ArrowRight className="size-3.5 text-ink-muted" />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-5">
        <button
          type="button"
          className="flex items-center justify-center rounded-full bg-brand px-6 py-3 text-[15px] font-semibold text-white shadow-[0px_4px_6px_rgba(255,108,71,0.2)]"
        >
          Create My Preparation Plan →
        </button>
        <a href="#" className="text-sm font-medium text-ink-muted underline">
          Skip for now
        </a>
      </div>
    </div>
  );
}
