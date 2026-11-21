"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

type TiltCardProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Maximum tilt in degrees. */
  max?: number;
};

/**
 * Tilts gently toward the pointer in 3D, so cards feel like real objects you
 * can pick up. Does nothing on touch or reduced motion.
 *
 * The pointer is tracked on the parent element, which never moves. If the
 * tilting card tracked itself, its edges would slide out from under the cursor
 * and the effect would flicker on and off.
 */
export function TiltCard({ children, className = "", style, max = 7 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const host = el?.parentElement;
    if (!el || !host) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let target = { x: 0, y: 0 };

    const apply = () => {
      raf = 0;
      el.style.setProperty("--tilt-x", `${target.x.toFixed(2)}deg`);
      el.style.setProperty("--tilt-y", `${target.y.toFixed(2)}deg`);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = host.getBoundingClientRect();
      if (!r.width || !r.height) return;
      const x = Math.max(-0.5, Math.min(0.5, (e.clientX - r.left) / r.width - 0.5));
      const y = Math.max(-0.5, Math.min(0.5, (e.clientY - r.top) / r.height - 0.5));
      target = { x: -y * max, y: x * max };
      el.dataset.tilting = "true";
      schedule();
    };
    const onLeave = () => {
      target = { x: 0, y: 0 };
      el.dataset.tilting = "false";
      schedule();
    };

    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
    };
  }, [max]);

  return (
    <div ref={ref} className={`tilt-card ${className}`} style={style}>
      {children}
    </div>
  );
}
