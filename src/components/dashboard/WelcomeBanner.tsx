"use client";

import { useUser } from "@clerk/react";
import { toTitleCase } from "@/lib/format";

const steps = [
  { label: "Set Goal", active: true },
  { label: "Add Profile", active: false },
  { label: "Get Plan", active: false },
];

export function WelcomeBanner() {
  const { user } = useUser();
  const firstName = user?.firstName ? toTitleCase(user.firstName) : "Candidate";

  return (
    <div className="flex w-full items-center justify-between rounded-3xl border border-line bg-white p-7">
      <div className="flex flex-1 flex-col gap-2">
        <p className="font-display text-[28px] font-extrabold text-ink">
          Welcome {firstName} 👋
        </p>
        <p className="text-[15px] text-ink-muted">
          Let&apos;s build your personalized interview preparation plan.
        </p>
      </div>

      <div className="flex flex-col items-end gap-2">
        <p className="text-xs font-semibold uppercase text-brand">Setup Progress · Step 1 of 3</p>
        <div className="flex items-center gap-3">
          {steps.map((step, i) => (
            <div key={step.label} className="flex items-center gap-3">
              <span
                className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                  step.active
                    ? "bg-brand text-white"
                    : "border border-[#ede6db] bg-cream text-ink-muted"
                }`}
              >
                {step.label}
              </span>
              {i < steps.length - 1 && <span className="text-xs text-line-strong">→</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
