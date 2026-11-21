"use client";

import { useEffect, useRef } from "react";

/** Background image that drifts slower than the page while scrolling. */
export function ParallaxImage({ src, className = "", strength = 0.12 }: { src: string; className?: string; strength?: number }) {
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = ref.current;
    if (!img || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const parent = img.parentElement;
      if (!parent) return;
      const r = parent.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return;
      const centre = r.top + r.height / 2 - window.innerHeight / 2;
      img.style.transform = `translate3d(0, ${(-centre * strength).toFixed(1)}px, 0) scale(1.12)`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, [strength]);

  return (
    // eslint-disable-next-line @next/next/no-img-element -- decorative background, scaled for parallax
    <img ref={ref} src={src} alt="" loading="lazy" className={className} style={{ transform: "scale(1.12)" }} />
  );
}
