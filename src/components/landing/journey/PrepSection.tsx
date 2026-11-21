import type { ReactNode } from "react";
import { RevealOnView } from "../RevealOnView";

export const JOURNEY_TOTAL = 6;

type PrepSectionProps = {
  id?: string;
  step: number;
  /** Short handwritten label, e.g. "The challenge". */
  kicker: string;
  title: ReactNode;
  intro?: ReactNode;
  children: ReactNode;
  className?: string;
};

/**
 * One stop on the landing-page prep journey: a step badge on the rail, a
 * handwritten kicker like the whiteboard, a readable heading, and content that
 * reveals as it scrolls in.
 */
export function PrepSection({ id, step, kicker, title, intro, children, className = "" }: PrepSectionProps) {
  return (
    <section
      id={id}
      data-journey-stop
      data-reached="false"
      className={`journey-stop relative scroll-mt-24 px-4 py-16 sm:px-6 lg:px-[120px] lg:py-24 ${className}`}
    >
      {/* Step badge sits on the rail (desktop only). */}
      <span aria-hidden="true" className="journey-badge absolute left-[38px] top-[108px] hidden lg:flex">
        {String(step).padStart(2, "0")}
      </span>

      <div className="relative flex flex-col items-center gap-10 lg:gap-14">
        <RevealOnView className="flex w-full max-w-[760px] flex-col items-center gap-3 text-center">
          <p className="flex items-center gap-2">
            <span className="font-marker text-[26px] font-bold leading-none text-brand sm:text-[30px]">
              {kicker}
            </span>
            <span className="rounded-full border border-brand/30 bg-white/70 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-brand lg:hidden">
              Step {step}/{JOURNEY_TOTAL}
            </span>
          </p>
          <h2 className="font-display text-[28px] font-extrabold leading-[34px] text-ink sm:text-[34px] sm:leading-[40px] lg:text-[40px] lg:leading-[48px]">
            {title}
          </h2>
          {intro && <p className="text-base leading-[26px] text-ink-muted sm:text-[17px] sm:leading-7">{intro}</p>}
        </RevealOnView>

        {children}
      </div>
    </section>
  );
}
