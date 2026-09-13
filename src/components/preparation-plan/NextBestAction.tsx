export function NextBestAction() {
  return (
    <div className="flex w-full flex-col gap-4 rounded-[20px] border border-brand bg-white p-5 shadow-[0_12px_24px_rgba(255,108,71,0.06)] sm:p-6">
      <h2 className="font-display text-base font-extrabold text-ink sm:text-lg">
        Scalability Fundamentals - System Design
      </h2>
      <p className="text-[13px] leading-5 text-ink-muted">
        Based on your resume gaps and Google&apos;s interview focus areas,
        system design is your biggest opportunity to improve. Start with
        scalability - it&apos;s foundational for 60% of system design questions.
      </p>

      <div className="flex items-center gap-2">
        <span className="rounded-full border border-line bg-[#fbf9f4] px-2.5 py-1 text-[11px] font-bold text-ink-muted">
          Reading + Practice · 15 min
        </span>
      </div>

      <div>
        <button
          type="button"
          className="flex items-center justify-center rounded-full bg-brand px-6 py-2.5 text-[15px] font-semibold text-white shadow-[0px_4px_6px_rgba(255,108,71,0.2)] transition-opacity hover:opacity-90"
        >
          Start Now →
        </button>
      </div>
    </div>
  );
}
