"use client";

import { User, Calendar, HelpCircle, DollarSign } from "lucide-react";

export function EvaluationHeader() {
  return (
    <div className="flex w-full flex-col gap-2.5">
      {/* Row 1: Top Utility Actions (Need help & Credits/Subscription badge) */}
      <div className="flex items-center justify-end gap-3 text-xs text-ink-muted">
        <button
          type="button"
          onClick={() =>
            window.open("mailto:support@prepinminutes.com", "_blank")
          }
          className="flex items-center gap-1.5 hover:text-ink transition-colors cursor-pointer"
        >
          <span>Need help?</span>
          <HelpCircle className="size-3.5 text-ink-muted" />
        </button>

        <button
          type="button"
          aria-label="Billing & Credits"
          className="flex size-6 items-center justify-center rounded-full border border-line bg-white text-ink hover:border-line-strong hover:bg-cream transition-colors cursor-pointer"
          title="Credits & Subscription"
        >
          <DollarSign className="size-3 text-ink-muted" />
        </button>
      </div>

      {/* Row 2: Eyebrow + Title on left, Candidate Meta Bar on right */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-extrabold uppercase tracking-wider text-brand">
            EVALUATION
          </span>
          <h1 className="font-display text-2xl font-extrabold text-ink sm:text-3xl lg:text-[34px] leading-tight">
            Evaluation
          </h1>
        </div>

        {/* Candidate Meta Bar on the right */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-ink-muted pb-0.5">
          <div className="flex items-center gap-1.5 font-medium text-ink">
            <User className="size-3.5 text-ink-muted shrink-0" />
            <span>Senior Software Engineer</span>
          </div>

          <span className="text-line">•</span>

          <div className="flex items-center gap-1.5 font-medium text-ink">
            <span className="font-bold text-[#4285F4]">G</span>
            <span>Google</span>
          </div>

          <span className="text-line">•</span>

          <div className="flex items-center gap-1.5 font-medium text-ink-muted">
            <Calendar className="size-3.5 text-ink-muted shrink-0" />
            <span>Interview in 12 days</span>
          </div>
        </div>
      </div>

      {/* Row 3: Subtitle spanning underneath */}
      <p className="text-xs sm:text-sm text-ink-muted leading-relaxed max-w-4xl">
        See how your interview readiness is improving, understand your strengths
        and gaps, and get personalized next steps.
      </p>
    </div>
  );
}
