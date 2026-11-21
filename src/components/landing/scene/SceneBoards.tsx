"use client";

import { useEffect, useState, type CSSProperties } from "react";
import {
  BOOK_LABELS,
  BOOK_LABEL_SIZE,
  CLOCK,
  MONITOR_QUAD,
  MONITOR_SIZE,
  WHITEBOARD_QUAD,
  WHITEBOARD_SIZE,
  quadMatrix,
} from "./sceneGeometry";
import styles from "./HeroScene.module.css";

const delay = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;

/** Whiteboard: today's prep plan, written, ticked, and erased in a loop. */
export function SceneWhiteboard() {
  const items = [
    "System Design: Load Balancer",
    "DSA: 2 medium problems",
    "Behavioral: STAR story",
    "Mock interview · 45 min",
  ];
  return (
    <div
      className={styles.whiteboard}
      style={{
        width: WHITEBOARD_SIZE.w,
        height: WHITEBOARD_SIZE.h,
        transform: quadMatrix(WHITEBOARD_SIZE.w, WHITEBOARD_SIZE.h, WHITEBOARD_QUAD),
      }}
      aria-hidden="true"
    >
      <p className={`${styles.wbTitle} ${styles.write}`} style={delay(0.2)}>
        Today&rsquo;s Prep Plan
      </p>
      <svg className={styles.wbUnderline} viewBox="0 0 260 14">
        <path className={styles.draw} style={delay(1.1)} pathLength={1} d="M4 9 C 70 3, 150 13, 256 6" />
      </svg>

      <ul className={styles.wbList}>
        {items.map((item, i) => (
          <li key={item}>
            <svg className={styles.wbBox} viewBox="0 0 24 24">
              <rect className={styles.drawBox} style={delay(1.4 + i * 0.5)} pathLength={1} x="3" y="3" width="18" height="18" rx="3" />
              <path className={styles.drawTick} style={delay(4.2 + i * 0.55)} pathLength={1} d="M6 12.5 L10.5 17 L19 7" />
            </svg>
            <span className={styles.write} style={delay(1.5 + i * 0.5)}>
              {item}
            </span>
          </li>
        ))}
      </ul>

      <svg className={styles.wbDiagram} viewBox="0 0 400 70">
        {[
          { x: 4, label: "Client" },
          { x: 104, label: "LB" },
          { x: 204, label: "API" },
          { x: 304, label: "DB" },
        ].map((n, i) => (
          <g key={n.label}>
            <rect className={styles.drawDiagram} style={delay(6.6 + i * 0.45)} pathLength={1} x={n.x} y="14" width="80" height="40" rx="9" />
            <text className={styles.fadeIn} style={delay(6.9 + i * 0.45)} x={n.x + 40} y="40" textAnchor="middle">
              {n.label}
            </text>
            {i < 3 && (
              <path className={styles.drawDiagram} style={delay(7.1 + i * 0.45)} pathLength={1} d={`M${n.x + 84} 34 H${n.x + 100} M${n.x + 94} 28 L${n.x + 100} 34 L${n.x + 94} 40`} />
            )}
          </g>
        ))}
      </svg>

      <p className={`${styles.wbScore} ${styles.write}`} style={delay(8.8)}>
        Readiness 62% &rarr; 78% &uarr;
      </p>
    </div>
  );
}

/** Desktop monitor: a live PrepInMinutes readiness screen, in perspective. */
export function SceneMonitor() {
  const skills = [
    { name: "System Design", v: 72 },
    { name: "DSA", v: 80 },
    { name: "Behavioral", v: 88 },
    { name: "Communication", v: 65 },
  ];
  const r = 52;
  const c = 2 * Math.PI * r;
  return (
    <div
      className={styles.monitor}
      style={{
        width: MONITOR_SIZE.w,
        height: MONITOR_SIZE.h,
        transform: quadMatrix(MONITOR_SIZE.w, MONITOR_SIZE.h, MONITOR_QUAD),
      }}
      aria-hidden="true"
    >
      <div className={styles.monBar}>
        <span className={styles.monLogo}>PrepInMinutes</span>
        <span className={styles.monLive}>
          <i /> AI coach live
        </span>
      </div>

      <div className={styles.monBody}>
        <div className={styles.monRing}>
          <svg viewBox="0 0 130 130">
            <circle cx="65" cy="65" r={r} className={styles.ringTrack} />
            <circle
              cx="65"
              cy="65"
              r={r}
              className={styles.ringFill}
              style={{ "--c": c, "--o": c * (1 - 0.78) } as CSSProperties}
            />
          </svg>
          <div className={styles.monRingText}>
            <b>78%</b>
            <span>Readiness</span>
          </div>
        </div>

        <div className={styles.monSkills}>
          {skills.map((s, i) => (
            <div key={s.name} className={styles.monSkill}>
              <div className={styles.monSkillHead}>
                <span>{s.name}</span>
                <span>{s.v}%</span>
              </div>
              <div className={styles.monTrack}>
                <i style={{ width: `${s.v}%`, ...delay(0.6 + i * 0.25) }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.monChart}>
        <svg viewBox="0 0 300 70" preserveAspectRatio="none">
          <path className={styles.chartArea} d="M0 62 L40 55 L80 58 L120 44 L160 40 L200 28 L240 24 L300 10 L300 70 L0 70 Z" />
          <path className={styles.chartLine} pathLength={1} d="M0 62 L40 55 L80 58 L120 44 L160 40 L200 28 L240 24 L300 10" />
        </svg>
      </div>

      <div className={styles.monNext}>
        <i /> Next up: <b>Mock interview</b> in 12 min
      </div>
      <div className={styles.monGlare} />
    </div>
  );
}

/** Wall clock showing the visitor's real local time. */
export function SceneClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    const first = window.setTimeout(tick, 0);
    const id = window.setInterval(tick, 1000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(id);
    };
  }, []);

  const size = CLOCK.r * 2;
  const ticks = Array.from({ length: 60 }, (_, i) => i);

  let hourDeg = 0;
  let minDeg = 0;
  let secDeg = 0;
  if (now) {
    const s = now.getSeconds();
    const m = now.getMinutes();
    const h = now.getHours() % 12;
    // Seconds count up without wrapping, so the hand never sweeps backwards.
    const totalSeconds = Math.floor(now.getTime() / 1000);
    secDeg = totalSeconds * 6;
    minDeg = m * 6 + s * 0.1;
    hourDeg = h * 30 + m * 0.5;
  }

  return (
    <div
      className={styles.clock}
      style={{ left: CLOCK.cx - CLOCK.r, top: CLOCK.cy - CLOCK.r, width: size, height: size }}
      role="img"
      aria-label={now ? `Clock showing ${now.toLocaleTimeString()}` : "Clock"}
    >
      <svg viewBox="-100 -100 200 200">
        {ticks.map((i) => (
          <line
            key={i}
            x1="0"
            y1={i % 5 === 0 ? -86 : -89}
            x2="0"
            y2="-94"
            className={i % 5 === 0 ? styles.tickMajor : styles.tickMinor}
            transform={`rotate(${i * 6})`}
          />
        ))}
        {[12, 3, 6, 9].map((n, i) => {
          const a = (i * Math.PI) / 2;
          return (
            <text key={n} x={Math.sin(a) * 70} y={-Math.cos(a) * 70 + 6} textAnchor="middle" className={styles.clockNum}>
              {n}
            </text>
          );
        })}
        <text x="0" y="34" textAnchor="middle" className={styles.clockBrand}>
          in minutes
        </text>
        {now && (
          <>
            <line x1="0" y1="10" x2="0" y2="-46" className={styles.hourHand} style={{ transform: `rotate(${hourDeg}deg)` }} />
            <line x1="0" y1="12" x2="0" y2="-68" className={styles.minHand} style={{ transform: `rotate(${minDeg}deg)` }} />
            <g className={styles.secHand} style={{ transform: `rotate(${secDeg}deg)` }}>
              <line x1="0" y1="18" x2="0" y2="-78" />
              <circle cx="0" cy="0" r="4" />
            </g>
          </>
        )}
        <circle cx="0" cy="0" r="6" className={styles.clockCap} />
      </svg>
    </div>
  );
}

/** Sticky notes on the wall and the whiteboard corner. */
export function SceneNotes() {
  const notes = [
    { text: "Mock @ 6 PM", color: "#ffe27a", x: 1212, y: 208, rot: -5, d: 0 },
    { text: "Revise CAP theorem", color: "#ff9f86", x: 1284, y: 296, rot: 4, d: 1.3 },
    { text: "STAR stories ✓", color: "#a5d8ff", x: 1222, y: 392, rot: -2, d: 2.4 },
  ];
  return (
    <>
      {notes.map((n) => (
        <div
          key={n.text}
          className={styles.note}
          style={
            {
              left: n.x,
              top: n.y,
              background: n.color,
              "--rot": `${n.rot}deg`,
              "--d": `${n.d}s`,
            } as CSSProperties
          }
          aria-hidden="true"
        >
          <span className={styles.noteTape} />
          {n.text}
        </div>
      ))}
    </>
  );
}

/** Printed titles on the spines of the two books next to the coffee cup. */
export function SceneBookLabels() {
  return (
    <>
      {BOOK_LABELS.map((book) => (
        <div
          key={book.key}
          className={styles.bookLabel}
          style={{
            width: BOOK_LABEL_SIZE.w,
            height: BOOK_LABEL_SIZE.h,
            transform: quadMatrix(BOOK_LABEL_SIZE.w, BOOK_LABEL_SIZE.h, book.quad),
          }}
          aria-hidden="true"
        >
          <span className={styles.bookTitle}>{book.title}</span>
          <span className={styles.bookBy}>by PrepInMinutes</span>
        </div>
      ))}
    </>
  );
}
