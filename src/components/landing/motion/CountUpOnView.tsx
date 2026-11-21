"use client";

import { useEffect, useState } from "react";
import { prefersReducedMotion, useInViewOnce } from "./InView";

/** Counts from 0 to `value` the first time it scrolls into view. */
export function CountUpOnView({ value, duration = 1400, suffix = "%", className }: { value: number; duration?: number; suffix?: string; className?: string }) {
  const [ref, seen] = useInViewOnce<HTMLSpanElement>(0.5);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!seen) return;
    if (prefersReducedMotion()) {
      const id = window.setTimeout(() => setCurrent(value), 0);
      return () => window.clearTimeout(id);
    }
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      setCurrent(Math.round(value * (1 - Math.pow(1 - t, 3))));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [seen, value, duration]);

  return (
    <span ref={ref} className={className} aria-label={`${value}${suffix}`}>
      {current}
      {suffix}
    </span>
  );
}
