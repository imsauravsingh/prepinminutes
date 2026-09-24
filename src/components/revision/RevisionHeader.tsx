"use client";

import { User, Calendar, HelpCircle } from "lucide-react";

export function RevisionHeader() {
  return (
    <div className="flex w-full flex-col gap-2.5">
      {/* Row 1: Top Utility Actions (Need help & User Avatar) */}
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

        <div
          className="flex size-7 items-center justify-center rounded-full bg-[#eff6ff] text-[#2563eb] text-xs font-bold border border-[#dbeafe]"
          title="Account profile"
        >
          <span>S</span>
        </div>
      </div>

      {/* Row 2: Eyebrow + Title */}
      <div className="flex flex-col gap-0.5">
        <span className="text-xs font-extrabold uppercase tracking-wider text-brand">
          REVISION
        </span>
        <h1 className="font-display text-2xl font-extrabold text-ink sm:text-3xl lg:text-[34px] leading-tight">
          Revision
        </h1>
        <p className="text-xs sm:text-sm text-ink-muted leading-relaxed mt-0.5">
          Revisit the topics that need reinforcement before your interview.
        </p>
      </div>

      {/* Row 3: Candidate Meta Bar */}
      <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-ink-muted pt-1">
        <div className="flex items-center gap-1.5 font-medium text-ink">
          <User className="size-3.5 text-ink-muted shrink-0" />
          <span>Senior Software Engineer</span>
        </div>

        <div className="flex items-center gap-1.5 font-medium text-ink">
          {/* Multi-colored Google icon */}
          <svg className="size-3.5 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Google</span>
        </div>

        <div className="flex items-center gap-1.5 font-medium text-ink">
          <Calendar className="size-3.5 text-ink-muted shrink-0" />
          <span>Interview in 12 days</span>
        </div>
      </div>
    </div>
  );
}
