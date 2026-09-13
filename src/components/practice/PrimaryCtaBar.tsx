export function PrimaryCtaBar() {
  return (
    <div className="flex flex-col justify-between gap-4 rounded-2xl border border-line bg-[#faf6f0] p-4 sm:flex-row sm:items-center sm:p-5">
      <button
        type="button"
        className="flex items-center justify-center rounded-full bg-brand px-6 py-3 text-[15px] font-semibold text-white shadow-[0_4px_6px_rgba(255,108,71,0.2)] transition-opacity hover:opacity-90 w-fit"
      >
        Start Today&apos;s Practice →
      </button>

      <button
        type="button"
        className="text-sm font-semibold text-brand transition-colors hover:underline w-fit"
      >
        Choose a Topic →
      </button>
    </div>
  );
}
