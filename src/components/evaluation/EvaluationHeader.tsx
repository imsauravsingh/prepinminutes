"use client";

import { User, Calendar, HelpCircle, DollarSign } from "lucide-react";

export function EvaluationHeader() {
  return (
    <div className="flex w-full flex-col gap-4">
      {/* Top Utility Row (Need help & Credits/Subscription badge) */}
      <div className="flex items-center justify-between sm:justify-end gap-3 text-xs text-ink-muted">
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

      {/* Main Title & Subtitle + Candidate Meta Info Row */}
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        {/* Left: Eyebrow + Title + Subtitle */}
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-extrabold uppercase tracking-wider text-brand">
            EVALUATION
          </span>
          <h1 className="font-display text-2xl font-extrabold text-ink sm:text-3xl lg:text-[34px] leading-tight">
            Evaluation
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted leading-relaxed max-w-3xl">
            See how your interview readiness is improving, understand your
            strengths and gaps, and get personalized next steps.
          </p>
        </div>

        {/* Right: Candidate Meta Bar */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-ink-muted shrink-0 pb-0.5">
          <div className="flex items-center gap-1.5 font-medium text-ink">
            <User className="size-3.5 text-ink-muted shrink-0" />
            <span>Senior Software Engineer</span>
          </div>

          <span className="text-line hidden xs:inline" aria-hidden>
            •
          </span>

          <div className="flex items-center gap-1.5 font-medium text-ink">
            <svg className="size-3.5 shrink-0" viewBox="0 0 24 24" aria-hidden>
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.94 0 12s.45 3.84 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>Google</span>
          </div>

          <span className="text-line hidden xs:inline" aria-hidden>
            •
          </span>

          <div className="flex items-center gap-1.5 font-medium text-ink-muted">
            <Calendar className="size-3.5 text-ink-muted shrink-0" />
            <span>Interview in 12 days</span>
          </div>
        </div>
      </div>
    </div>
  );
}
