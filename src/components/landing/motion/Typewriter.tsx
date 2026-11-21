"use client";

import { useEffect, useState } from "react";
import { prefersReducedMotion, useInViewOnce } from "./InView";

/**
 * Types its text out once it scrolls into view, like the AI coach writing a
 * live insight. Screen readers always get the full text.
 */
export function Typewriter({ text, speed = 24, className = "" }: { text: string; speed?: number; className?: string }) {
  const [ref, seen] = useInViewOnce<HTMLSpanElement>(0.5);
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    if (!seen) return;
    if (prefersReducedMotion()) {
      const id = window.setTimeout(() => setCount(text.length), 0);
      return () => window.clearTimeout(id);
    }
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setCount(i);
      if (i >= text.length) window.clearInterval(id);
    }, speed);
    return () => window.clearInterval(id);
  }, [seen, text, speed]);

  const shown = count === null ? "" : text.slice(0, count);
  const typing = count !== null && count < text.length;

  return (
    <span ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {shown}
        <span className={`type-caret ${typing || count === null ? "" : "type-caret-done"}`} />
        {/* Reserve the final height so the card doesn't jump while typing. */}
        <span className="invisible">{text.slice(shown.length)}</span>
      </span>
    </span>
  );
}
