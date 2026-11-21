"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Wraps the landing sections in one continuous "prep journey".
 *
 * A coral marker line runs down the left gutter (desktop) and fills as the
 * visitor scrolls, and each section's step badge lights up once it is reached,
 * so moving between sections feels like moving along one path.
 */
export function JourneyRail({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = root.getBoundingClientRect();
      const focusY = window.innerHeight * 0.55;
      const p = Math.max(0, Math.min(1, (focusY - rect.top) / rect.height));
      root.style.setProperty("--journey-p", p.toFixed(4));

      root.querySelectorAll<HTMLElement>("[data-journey-stop]").forEach((stop) => {
        const reached = stop.getBoundingClientRect().top < focusY;
        stop.dataset.reached = reached ? "true" : "false";
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div ref={ref} className="journey relative">
      {/* The rail: a dashed track with a coral fill and a pen-tip marker at the head. */}
      <div aria-hidden="true" className="journey-rail pointer-events-none absolute bottom-24 left-[56px] top-10 hidden w-[3px] lg:block">
        <span className="journey-track" />
        <span className="journey-fill" />
        <span className="journey-head" />
      </div>

      <div aria-hidden="true" className="relative hidden lg:block">
        <span className="journey-start font-marker">Your prep journey starts here</span>
      </div>

      {children}
    </div>
  );
}
