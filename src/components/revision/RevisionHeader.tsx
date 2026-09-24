"use client";

export function RevisionHeader() {
  return (
    <div className="flex w-full flex-col gap-1 sm:gap-1.5">
      {/* Eyebrow + Title */}
      <div className="flex flex-col gap-0.5">
        <span className="text-xs font-extrabold uppercase tracking-wider text-brand">
          REVISION
        </span>
        <h1 className="font-display text-2xl font-extrabold text-ink sm:text-3xl lg:text-[34px] leading-tight">
          Revision
        </h1>
      </div>

      {/* Subtitle */}
      <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
        Revisit the topics that need reinforcement before your interview.
      </p>
    </div>
  );
}
