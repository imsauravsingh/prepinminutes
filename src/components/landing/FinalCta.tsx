import Image from "next/image";

export function FinalCta() {
  return (
    <section className="relative flex flex-col items-center gap-10 p-[120px]">
      <div aria-hidden className="absolute inset-0">
        <Image
          src="/images/final-cta-bg.png"
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[#fbf9f4]/92" />
      </div>

      <div className="relative flex w-[800px] flex-col items-center gap-4 text-center">
        <h2 className="font-display text-5xl font-extrabold leading-[56px] text-ink">
          Your next interview is closer than you think.
        </h2>
        <p className="text-lg text-ink-muted">
          Join thousands of candidates who prepared smarter, not harder. Accelerate your career
          today.
        </p>
      </div>

      <div className="relative flex flex-col items-center gap-4">
        <a
          href="#"
          className="rounded-full bg-brand px-6 py-3 text-[15px] font-semibold text-white shadow-[0_4px_6px_rgba(255,108,71,0.2)]"
        >
          Get Interview Ready →
        </a>
        <p className="text-sm text-ink-muted">No credit card required. Free to start.</p>
      </div>
    </section>
  );
}
