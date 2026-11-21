"use client";

import { useEffect, useState } from "react";

type CountUpPercentProps = {
  value: number;
  duration?: number;
  className?: string;
};

/**
 * Counts from 0 up to `value` once on mount. With reduced motion enabled,
 * it shows the final value immediately.
 */
export function CountUpPercent({ value, duration = 1200, className }: CountUpPercentProps) {
  const [current, setCurrent] = useState(value);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setCurrent(Math.round(value * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, duration]);

  return <span className={className}>{current}%</span>;
}
