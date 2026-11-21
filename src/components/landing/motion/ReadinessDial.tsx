"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { prefersReducedMotion, useInViewOnce } from "./InView";

/** Skill scores at the default overall readiness (78%). */
const DIMENSIONS = [
  { label: "Technical Core", base: 85, color: "#3b82f6" },
  { label: "System Design & Architecture", base: 72, color: "#ff6c47" },
  { label: "Algorithmic Problem Solving", base: 80, color: "#10b981" },
  { label: "Communication & Soft Skills", base: 65, color: "#ec4899" },
  { label: "Behavioral & Leadership", base: 88, color: "#f59e0b" },
];

const DEFAULT_SCORE = 78;
const RING_R = 80;
const RING_C = 2 * Math.PI * RING_R;
const TICKS = Array.from({ length: 60 }, (_, i) => i);

/**
 * Each skill follows the overall score: it scales down to 0 below the default,
 * and climbs toward 100 above it, so stronger skills stay ahead.
 */
function skillAt(base: number, overall: number) {
  if (overall <= DEFAULT_SCORE) return Math.round((base * overall) / DEFAULT_SCORE);
  return Math.round(base + ((100 - base) * (overall - DEFAULT_SCORE)) / (100 - DEFAULT_SCORE));
}

function statusFor(score: number) {
  if (score >= 80) return "interview ready";
  if (score >= 60) return "almost there";
  if (score >= 35) return "building up";
  return "just starting";
}

const clamp = (v: number) => Math.max(0, Math.min(100, v));

/**
 * The readiness "wall clock": drag the knob around the ring (or use arrow keys)
 * to change the overall score, and every skill bar updates with it.
 */
export function ReadinessDial() {
  const [sectionRef, seen] = useInViewOnce<HTMLDivElement>(0.35);
  const [score, setScore] = useState(0);
  const [touched, setTouched] = useState(false);
  const [dragging, setDragging] = useState(false);
  const dialRef = useRef<SVGSVGElement>(null);
  const lastRef = useRef(0);

  // First visit: count up from 0 to the default score.
  useEffect(() => {
    if (!seen || touched) return;
    if (prefersReducedMotion()) {
      const id = window.setTimeout(() => setScore(DEFAULT_SCORE), 0);
      return () => window.clearTimeout(id);
    }
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 1400);
      setScore(Math.round(DEFAULT_SCORE * (1 - Math.pow(1 - t, 3))));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [seen, touched]);

  const scoreFromPointer = (clientX: number, clientY: number) => {
    const svg = dialRef.current;
    if (!svg) return null;
    const r = svg.getBoundingClientRect();
    const dx = clientX - (r.left + r.width / 2);
    const dy = clientY - (r.top + r.height / 2);
    // 0 at 12 o'clock, increasing clockwise.
    let deg = (Math.atan2(dx, -dy) * 180) / Math.PI;
    if (deg < 0) deg += 360;
    let next = Math.round((deg / 360) * 100);
    // Don't wrap across 12 o'clock: stick at 0 or 100 instead of jumping.
    const prev = lastRef.current;
    if (prev > 75 && next < 25) next = 100;
    if (prev < 25 && next > 75) next = 0;
    return clamp(next);
  };

  const setFromUser = (value: number | ((prev: number) => number)) => {
    setTouched(true);
    setScore((prev) => {
      const next = clamp(typeof value === "function" ? value(prev) : value);
      lastRef.current = next;
      return next;
    });
  };

  const onPointerDown = (e: PointerEvent<SVGSVGElement>) => {
    lastRef.current = score;
    const v = scoreFromPointer(e.clientX, e.clientY);
    if (v === null) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    setFromUser(v);
  };

  const onPointerMove = (e: PointerEvent<SVGSVGElement>) => {
    if (!dragging) return;
    const v = scoreFromPointer(e.clientX, e.clientY);
    if (v !== null) setFromUser(v);
  };

  const onPointerUp = () => setDragging(false);

  const onKeyDown = (e: KeyboardEvent<SVGSVGElement>) => {
    const steps: Record<string, number> = { ArrowUp: 1, ArrowRight: 1, ArrowDown: -1, ArrowLeft: -1, PageUp: 10, PageDown: -10 };
    if (e.key in steps) setFromUser((prev) => prev + steps[e.key]);
    else if (e.key === "Home") setFromUser(0);
    else if (e.key === "End") setFromUser(100);
    else return;
    e.preventDefault();
  };

  const angle = (score / 100) * 2 * Math.PI;
  const knobX = 100 + RING_R * Math.sin(angle);
  const knobY = 100 - RING_R * Math.cos(angle);

  return (
    <div ref={sectionRef} className="flex w-full flex-col items-center gap-12 lg:flex-row lg:gap-16">
      <div className="flex shrink-0 flex-col items-center gap-4">
        {/* Styled like the wall clock in the hero scene: coral rim, white face, ticks. */}
        <div className="relative flex size-64 items-center justify-center rounded-full border-[14px] border-[#e8673f] bg-white shadow-[0_18px_36px_rgba(96,60,36,0.16),inset_0_0_0_2px_#f3c4b3] sm:size-80 lg:size-[380px]">
          <svg aria-hidden="true" viewBox="-100 -100 200 200" className="pointer-events-none absolute inset-0 size-full">
            {TICKS.map((i) => (
              <line
                key={i}
                x1="0"
                y1={i % 5 === 0 ? -84 : -88}
                x2="0"
                y2="-93"
                stroke={i % 5 === 0 ? "#3a2f2a" : "#cbbfb6"}
                strokeWidth={i % 5 === 0 ? 2.4 : 1}
                strokeLinecap="round"
                transform={`rotate(${i * 6})`}
              />
            ))}
          </svg>

          <div className="relative flex size-[74%] items-center justify-center">
            <svg
              ref={dialRef}
              viewBox="0 0 200 200"
              role="slider"
              tabIndex={0}
              aria-label="Overall readiness score"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={score}
              aria-valuetext={`${score}%, ${statusFor(score)}`}
              className={`readiness-dial absolute inset-0 size-full touch-none rounded-full outline-none ${dragging ? "cursor-grabbing" : "cursor-grab"}`}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              onKeyDown={onKeyDown}
            >
              <circle cx="100" cy="100" r={RING_R} fill="none" stroke="#f4efe8" strokeWidth="16" />
              <circle
                cx="100"
                cy="100"
                r={RING_R}
                fill="none"
                stroke="#ff6c47"
                strokeWidth="16"
                strokeLinecap="round"
                strokeDasharray={RING_C}
                strokeDashoffset={RING_C * (1 - score / 100)}
                transform="rotate(-90 100 100)"
                className={dragging ? "" : "readiness-arc"}
              />
              {/* Wide invisible ring so the whole band is easy to grab. */}
              <circle cx="100" cy="100" r={RING_R} fill="none" stroke="transparent" strokeWidth="40" />
              <g className={`readiness-knob ${dragging ? "is-dragging" : ""}`}>
                <circle cx={knobX} cy={knobY} r="13" fill="#fff" stroke="#ff6c47" strokeWidth="4" />
                <circle cx={knobX} cy={knobY} r="4" fill="#ff6c47" />
              </g>
            </svg>

            <div className="pointer-events-none flex flex-col items-center gap-1">
              <p className="font-display text-[40px] font-extrabold tabular-nums text-ink sm:text-[52px] lg:text-[60px]">
                {score}%
              </p>
              <p className="font-marker text-xl font-bold text-brand sm:text-2xl">{statusFor(score)}</p>
            </div>
          </div>
        </div>

        <p className="flex items-center gap-2 font-marker text-[22px] font-bold text-marker-blue">
          <span aria-hidden="true">&#8635;</span> Drag the ring to try a score
        </p>
      </div>

      <div className="flex w-full flex-1 flex-col gap-6">
        {DIMENSIONS.map((dim) => {
          const value = skillAt(dim.base, score);
          return (
            <div key={dim.label} className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-3 text-ink">
                <p className="font-display text-[15px] font-bold sm:text-base">{dim.label}</p>
                <p className="shrink-0 text-[15px] font-semibold tabular-nums">{value}%</p>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#efe3d8]">
                <div
                  className={`h-full rounded-full ${dragging ? "" : "readiness-bar"}`}
                  style={{ width: `${value}%`, background: `linear-gradient(90deg, ${dim.color}, ${dim.color}b3)` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
