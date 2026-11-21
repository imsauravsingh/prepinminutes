import { JOURNEY_TOTAL } from "./journey/PrepSection";
import { RevealOnView } from "./RevealOnView";
import { ParallaxImage } from "./motion/ParallaxImage";
import { HERO_BG_URL } from "./scene/heroAssets";

/**
 * The last stop: back at the same desk from the hero, now ready to start.
 * Reuses the hero background so the page opens and closes in one room.
 */
export function FinalCta() {
  return (
    <section
      data-journey-stop
      data-reached="false"
      className="journey-stop relative overflow-hidden px-4 py-20 sm:px-10 lg:px-[120px] lg:py-28"
    >
      <span aria-hidden="true" className="journey-badge absolute left-[38px] top-[108px] z-10 hidden lg:flex">
        {String(JOURNEY_TOTAL).padStart(2, "0")}
      </span>

      <div aria-hidden="true" className="absolute inset-0">
        <ParallaxImage src={HERO_BG_URL} className="size-full object-cover object-[30%_45%] will-change-transform" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(250,246,240,0.2)_0%,rgba(250,246,240,0.55)_45%,rgba(250,246,240,0.9)_70%)] max-lg:bg-[linear-gradient(180deg,rgba(250,246,240,0.35)_0%,rgba(250,246,240,0.92)_55%)]" />
      </div>

      <div className="relative flex min-h-[380px] items-end justify-end lg:min-h-[440px] lg:items-center">
        <RevealOnView className="w-full max-w-[560px]">
          <div className="flex flex-col gap-5 rounded-3xl border border-white/80 bg-white/75 p-6 shadow-[0_24px_48px_rgba(96,60,36,0.18)] backdrop-blur-md sm:p-9">
            <p className="flex items-center gap-2">
              <span className="font-marker text-[28px] font-bold leading-none text-brand">Your desk is ready</span>
              <span className="rounded-full border border-brand/30 bg-white/70 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-brand lg:hidden">
                Step {JOURNEY_TOTAL}/{JOURNEY_TOTAL}
              </span>
            </p>
            <h2 className="font-display text-[30px] font-extrabold leading-[36px] text-ink sm:text-[40px] sm:leading-[46px]">
              Your next interview is closer than you think.
            </h2>
            <p className="text-base leading-7 text-ink-muted sm:text-lg">
              Join candidates who prepare smarter, not harder. Get your personal plan in minutes.
            </p>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
              <a
                href="/sign-up"
                className="btn-shine rounded-full bg-brand px-7 py-3.5 text-[15px] font-semibold text-white shadow-[0_8px_18px_rgba(255,108,71,0.35)] transition-transform hover:-translate-y-0.5"
              >
                Get Interview Ready &rarr;
              </a>
              <span className="text-sm text-ink-muted">No credit card required. Free to start.</span>
            </div>
          </div>
        </RevealOnView>
      </div>
    </section>
  );
}
