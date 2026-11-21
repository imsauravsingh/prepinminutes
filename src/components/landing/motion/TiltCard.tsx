"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";

type TiltCardProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Maximum tilt in degrees. */
  max?: number;
};

/**
 * Tilts gently toward the pointer in 3D and shows a soft glare, so cards feel
 * like real objects you can pick up. Does nothing on touch or reduced motion.
 */
export function TiltCard({ children, className = "", style, max = 7 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--tilt-x", `${(-y * max).toFixed(2)}deg`);
    el.style.setProperty("--tilt-y", `${(x * max).toFixed(2)}deg`);
    el.style.setProperty("--glare-x", `${((x + 0.5) * 100).toFixed(1)}%`);
    el.style.setProperty("--glare-y", `${((y + 0.5) * 100).toFixed(1)}%`);
    el.dataset.tilting = "true";
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--tilt-x", "0deg");
    el.style.setProperty("--tilt-y", "0deg");
    el.dataset.tilting = "false";
  };

  return (
    <div ref={ref} className={`tilt-card ${className}`} style={style} onPointerMove={onMove} onPointerLeave={onLeave}>
      {children}
      <span aria-hidden="true" className="tilt-glare" />
    </div>
  );
}
