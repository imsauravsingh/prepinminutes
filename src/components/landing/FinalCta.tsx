import Image from "next/image";

export function FinalCta() {
  return (
    <section className="relative flex flex-col items-center gap-8 px-4 py-20 sm:gap-10 sm:px-10 lg:p-[120px]">
      <div aria-hidden className="absolute inset-0">
        <div className="absolute inset-0 bg-[#fbf9f4]/92" />
      </div>

      <div className="relative flex w-full max-w-[800px] flex-col items-center gap-4 text-center">
        <h2 className="font-display text-[32px] font-extrabold leading-[38px] text-ink sm:text-[40px] sm:leading-[46px] lg:text-5xl lg:leading-[56px]">
          Your next interview is closer than you think.
        </h2>
        <p className="text-base text-ink-muted sm:text-lg">
          Join thousands of candidates who prepared smarter, not harder.
          Accelerate your career today.
        </p>
      </div>

      <div className="relative flex flex-col items-center gap-4">
        <a
          href="#"
          className="rounded-full bg-brand px-6 py-3 text-[15px] font-semibold text-white shadow-[0_4px_6px_rgba(255,108,71,0.2)]"
        >
          Get Interview Ready →
        </a>
        <p className="text-sm text-ink-muted">
          No credit card required. Free to start.
        </p>
      </div>
    </section>
  );
}
