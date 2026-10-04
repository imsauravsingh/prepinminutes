"use client";

export function EvaluationHeader() {
  return (
    <div className="flex w-full flex-col gap-1 sm:gap-1.5">
      {/* Eyebrow + Title */}
      <div className="flex flex-col gap-0.5">
        <span className="text-xs font-extrabold uppercase tracking-wider text-brand">
          EVALUATION
        </span>
        <h1 className="font-display text-2xl font-extrabold text-ink sm:text-3xl lg:text-[34px] leading-tight">
          Evaluation
        </h1>
      </div>

      {/* Subtitle spanning underneath */}
      <p className="text-xs sm:text-sm text-ink-muted leading-relaxed max-w-4xl">
        See how your interview readiness is improving, understand your strengths
        and gaps, and get personalized next steps.
      </p>
    </div>
  );
}
