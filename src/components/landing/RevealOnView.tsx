"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

type RevealOnViewProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
  /** "rise" fades up (default); "drop" pins it like a sticky note. */
  variant?: "rise" | "drop";
};

/**
 * Fades and rises its child in the first time it scrolls into view.
 * With reduced motion enabled, the child is never hidden.
 */
export function RevealOnView({ children, delay = 0, className, variant = "rise" }: RevealOnViewProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;

    el.classList.add("reveal-pending");
    if (variant === "drop") el.classList.add("reveal-drop");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.classList.add("in-view");
            observer.unobserve(el);
          }
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [variant]);

  return (
    <div
      ref={ref}
      className={className}
      style={{ "--enter-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}
