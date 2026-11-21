"use client";

import { useEffect, useRef } from "react";
import { Caveat } from "next/font/google";
import {
  CHAR_BOX,
  CHAR_FRAMES,
  CUP,
  FRAME_LOOK_AT_VIEWER,
  GREENERY,
  HEAD,
  IDLE_LENGTH,
  IDLE_START,
  LAMP,
  SCENE_H,
  SCENE_W,
  angleToFrame,
  cyclicDelta,
  wrapFrame,
} from "./sceneGeometry";
import { SceneClock, SceneMonitor, SceneNotes, SceneWhiteboard } from "./SceneBoards";
import styles from "./HeroScene.module.css";

const marker = Caveat({ subsets: ["latin"], weight: ["500", "700"], variable: "--font-marker" });

const BG_SRC = "/hero/bg.webp";
const frameSrc = (i: number) => `/hero/char/c${String(i).padStart(3, "0")}.avif`;

/** How long the pointer must rest before he goes back to typing. */
const IDLE_AFTER_MS = 2600;

/** Scene point where the desktop headline card's bottom-left corner sits. */
const DOCK_ANCHOR = { x: 1040, y: 1046 };

type StageTransform = { s: number; tx: number; ty: number };

/** Which point of the scene to keep in view at each width. */
function focusFor(width: number) {
  if (width < 640) return { fx: 650, fy: 560 };
  if (width < 1024) return { fx: 1000, fy: 540 };
  return { fx: SCENE_W / 2, fy: SCENE_H / 2 };
}

export function HeroScene() {
  const heroRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const charRef = useRef<HTMLCanvasElement>(null);
  const steamRef = useRef<HTMLCanvasElement>(null);
  const leafRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  const stage = useRef<StageTransform>({ s: 1, tx: 0, ty: 0 });

  // Scale the 1920x1080 scene to cover the hero, keeping the focus point in view.
  useEffect(() => {
    const hero = heroRef.current;
    const scene = sceneRef.current;
    if (!hero || !scene) return;

    const fit = () => {
      const cw = hero.clientWidth;
      const ch = hero.clientHeight;
      const s = Math.max(cw / SCENE_W, ch / SCENE_H);
      const { fx, fy } = focusFor(cw);
      const tx = Math.min(0, Math.max(cw - SCENE_W * s, cw / 2 - fx * s));
      const ty = Math.min(0, Math.max(ch - SCENE_H * s, ch / 2 - fy * s));
      stage.current = { s, tx, ty };
      scene.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(${s})`;
      // Desktop headline card sits over the notebook, clear of the monitor and plants.
      const wrap = hero.parentElement;
      if (wrap) {
        const dockX = Math.max(16, tx + DOCK_ANCHOR.x * s);
        const dockBottom = Math.max(16, ch - (ty + DOCK_ANCHOR.y * s));
        wrap.style.setProperty("--dock-x", `${dockX}px`);
        wrap.style.setProperty("--dock-b", `${dockBottom}px`);
      }
    };

    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(hero);
    return () => ro.disconnect();
  }, []);

  // Character, greenery, and steam all run in one animation loop.
  useEffect(() => {
    const hero = heroRef.current;
    const charCanvas = charRef.current;
    const steamCanvas = steamRef.current;
    if (!hero || !charCanvas || !steamCanvas) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const charCtx = charCanvas.getContext("2d");
    const steamCtx = steamCanvas.getContext("2d");
    if (!charCtx || !steamCtx) return;

    // --- Character frames: idle typing frames load first. ---
    const frames: (HTMLImageElement | null)[] = Array(CHAR_FRAMES).fill(null);
    const order: number[] = [];
    for (let i = 0; i <= IDLE_LENGTH; i++) order.push(wrapFrame(IDLE_START + i));
    for (let i = 0; i < CHAR_FRAMES; i++) if (!order.includes(i)) order.push(i);
    let cancelled = false;
    let loadIdx = 0;
    const loadNext = () => {
      if (cancelled || loadIdx >= order.length) return;
      const i = order[loadIdx++];
      const img = new Image();
      img.decoding = "async";
      img.onload = () => {
        frames[i] = img;
        loadNext();
      };
      img.onerror = () => loadNext();
      img.src = frameSrc(i);
    };
    // A few parallel loaders keep the network busy without flooding it.
    for (let k = 0; k < 4; k++) loadNext();

    const nearestLoaded = (i: number) => {
      for (let d = 0; d < CHAR_FRAMES / 2; d++) {
        const a = frames[wrapFrame(i + d)];
        if (a) return a;
        const b = frames[wrapFrame(i - d)];
        if (b) return b;
      }
      return null;
    };

    // --- Gaze state. ---
    let current = 0; // frame 0 matches the background exactly
    let target = 0;
    let lastPointer = -Infinity;
    let idlePhase = 0;
    let drawn = -1;

    const onPointer = (e: PointerEvent) => {
      const rect = hero.getBoundingClientRect();
      if (e.clientY < rect.top - 200 || e.clientY > rect.bottom + 200) return;
      const { s, tx, ty } = stage.current;
      const px = (e.clientX - rect.left - tx) / s;
      const py = (e.clientY - rect.top - ty) / s;
      const dx = px - HEAD.x;
      const dy = py - HEAD.y;
      lastPointer = performance.now();
      if (Math.hypot(dx, dy) < 110) {
        target = FRAME_LOOK_AT_VIEWER;
      } else {
        target = angleToFrame((Math.atan2(-dy, dx) * 180) / Math.PI);
      }
    };
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("pointerdown", onPointer, { passive: true });

    // --- Greenery: leaf-only copies of the background, swayed row by row. ---
    type Leaf = {
      ctx: CanvasRenderingContext2D;
      layer: HTMLCanvasElement;
      clip: HTMLCanvasElement | null;
      cfg: (typeof GREENERY)[number];
    };
    const leaves: Leaf[] = [];
    // Potted-plant leaves: clearly green.
    const plantAlpha = (r: number, g: number, b: number) => (g - Math.max(r * 0.92, b) - 14) * 9;
    // Sunlit tree leaves outside: bright yellow-green, not pink wall, curtain, or wood.
    const outsideAlpha = (r: number, g: number, b: number) =>
      (r + g + b) / 3 > 110 && r < g * 1.18 ? (g - b - 30) * 6 : 0;
    const clamp255 = (v: number) => Math.max(0, Math.min(255, v));

    const bg = new Image();
    bg.decoding = "async";
    bg.onload = () => {
      GREENERY.forEach((cfg, idx) => {
        const ctx = leafRefs.current[idx]?.getContext("2d");
        if (!ctx) return;
        const layer = document.createElement("canvas");
        layer.width = cfg.w;
        layer.height = cfg.h;
        const lctx = layer.getContext("2d", { willReadFrequently: true });
        if (!lctx) return;
        lctx.drawImage(bg, cfg.x, cfg.y, cfg.w, cfg.h, 0, 0, cfg.w, cfg.h);
        const data = lctx.getImageData(0, 0, cfg.w, cfg.h);
        const p = data.data;

        let clip: HTMLCanvasElement | null = null;
        let clipData: ImageData | null = null;
        if (cfg.kind === "outside") {
          clip = document.createElement("canvas");
          clip.width = cfg.w;
          clip.height = cfg.h;
          clipData = new ImageData(cfg.w, cfg.h);
        }

        for (let j = 0; j < p.length; j += 4) {
          const r = p[j];
          const g = p[j + 1];
          const b = p[j + 2];
          if (cfg.kind === "outside") {
            // Leave the monstera to its own layer; it sits in front of the window.
            const a = plantAlpha(r, g, b) > 40 ? 0 : clamp255(outsideAlpha(r, g, b));
            p[j + 3] = a;
            if (clipData) clipData.data[j + 3] = a;
          } else {
            p[j + 3] = clamp255(plantAlpha(r, g, b));
          }
        }
        lctx.putImageData(data, 0, 0);

        if (clip && clipData) {
          const cctx = clip.getContext("2d");
          if (cctx) {
            // Grow the glass mask slightly so leaves can drift a few pixels.
            const raw = document.createElement("canvas");
            raw.width = cfg.w;
            raw.height = cfg.h;
            raw.getContext("2d")?.putImageData(clipData, 0, 0);
            cctx.filter = "blur(3px)";
            cctx.drawImage(raw, 0, 0);
            cctx.drawImage(raw, 0, 0);
            cctx.filter = "none";
          }
        }
        leaves.push({ ctx, layer, clip, cfg });
      });
    };
    bg.src = BG_SRC;

    const drawLeaves = (t: number) => {
      for (const { ctx, layer, clip, cfg } of leaves) {
        ctx.clearRect(0, 0, cfg.w, cfg.h);
        const outside = cfg.kind === "outside";
        const span = cfg.baseY - cfg.y;
        for (let y = 0; y < cfg.h; y += 2) {
          const sceneY = cfg.y + y;
          let fall = 1;
          if (!outside) {
            const lift = Math.max(0, Math.min(1, (cfg.baseY - sceneY) / span));
            fall = Math.pow(lift, 0.85);
          }
          const wave = outside
            ? Math.sin(t * cfg.speed + cfg.phase + sceneY * 0.006) * 0.6 +
              Math.sin(t * cfg.speed * 2.6 + cfg.phase * 3 + sceneY * 0.021) * 0.4
            : Math.sin(t * cfg.speed + cfg.phase + sceneY * 0.011) * 0.75 +
              Math.sin(t * cfg.speed * 2.3 + cfg.phase * 2 + sceneY * 0.027) * 0.25;
          const dx = cfg.amp * fall * wave;
          // Trees outside also bob gently, like branches lifting in the breeze.
          const dy = outside ? Math.sin(t * cfg.speed * 1.7 + sceneY * 0.01) * 1.4 : 0;
          ctx.drawImage(layer, 0, y, cfg.w, 2, dx, y + dy, cfg.w, 2);
        }
        if (clip) {
          // Keep outside leaves inside the glass: never over the window bars.
          ctx.globalCompositeOperation = "destination-in";
          ctx.drawImage(clip, 0, 0);
          ctx.globalCompositeOperation = "source-over";
        }
      }
    };

    // --- Steam from the coffee cup. ---
    type Puff = { x: number; y: number; r: number; life: number; max: number; seed: number };
    const puffs: Puff[] = [];
    const SW = steamCanvas.width;
    const SH = steamCanvas.height;
    const drawSteam = (dt: number) => {
      if (puffs.length < 26 && Math.random() < 0.22) {
        puffs.push({ x: SW / 2 + (Math.random() - 0.5) * 34, y: SH - 6, r: 5 + Math.random() * 4, life: 0, max: 2600 + Math.random() * 1400, seed: Math.random() * 6.28 });
      }
      steamCtx.clearRect(0, 0, SW, SH);
      for (let i = puffs.length - 1; i >= 0; i--) {
        const p = puffs[i];
        p.life += dt;
        const k = p.life / p.max;
        if (k >= 1) {
          puffs.splice(i, 1);
          continue;
        }
        p.y -= dt * 0.045;
        p.r += dt * 0.0075;
        const x = p.x + Math.sin(p.life * 0.0021 + p.seed) * 12 * k;
        const alpha = Math.sin(Math.PI * k) * 0.16;
        const grad = steamCtx.createRadialGradient(x, p.y, 0, x, p.y, p.r);
        grad.addColorStop(0, `rgba(255,255,255,${alpha})`);
        grad.addColorStop(1, "rgba(255,255,255,0)");
        steamCtx.fillStyle = grad;
        steamCtx.beginPath();
        steamCtx.arc(x, p.y, p.r, 0, Math.PI * 2);
        steamCtx.fill();
      }
    };

    // --- Main loop, paused while the hero is off screen or the tab is hidden. ---
    let raf = 0;
    let visible = true;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(64, now - last);
      last = now;

      const idle = now - lastPointer > IDLE_AFTER_MS;
      if (idle) {
        // Typing loop: ping-pong through the frames where he types.
        idlePhase += dt * 0.012;
        const span = IDLE_LENGTH * 2;
        const p = idlePhase % span;
        target = wrapFrame(IDLE_START + (p < IDLE_LENGTH ? p : span - p));
      }
      const d = cyclicDelta(current, target);
      const maxStep = (idle ? 0.35 : 0.9) * (dt / 16.7);
      current = wrapFrame(current + Math.sign(d) * Math.min(Math.abs(d), maxStep));

      const idx = Math.round(current) % CHAR_FRAMES;
      if (idx !== drawn) {
        const img = frames[idx] ?? nearestLoaded(idx);
        if (img) {
          charCtx.drawImage(img, 0, 0);
          drawn = frames[idx] ? idx : -1;
        }
      }

      drawLeaves(now);
      drawSteam(dt);
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (raf || !visible || document.hidden) return;
      last = performance.now();
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(hero);
    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVis);
    start();

    return () => {
      cancelled = true;
      stop();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("pointerdown", onPointer);
    };
  }, []);

  return (
    <section className={`${styles.wrap} ${marker.variable}`}>
      <div ref={heroRef} className={styles.hero}>
        <div ref={sceneRef} className={styles.scene} style={{ width: SCENE_W, height: SCENE_H }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- fixed-size scene layer, not a responsive image */}
          <img
            className={styles.bg}
            src={BG_SRC}
            width={SCENE_W}
            height={SCENE_H}
            alt="A candidate typing at a desk in a sunny study, preparing for an interview"
            fetchPriority="high"
          />

          <canvas
            ref={charRef}
            className={styles.layer}
            width={CHAR_BOX.w}
            height={CHAR_BOX.h}
            style={{ left: CHAR_BOX.x, top: CHAR_BOX.y, width: CHAR_BOX.w, height: CHAR_BOX.h }}
          />

          <SceneMonitor />

          {GREENERY.map((g, i) => (
            <canvas
              key={g.key}
              ref={(el) => {
                leafRefs.current[i] = el;
              }}
              className={styles.layer}
              width={g.w}
              height={g.h}
              style={{ left: g.x, top: g.y, width: g.w, height: g.h }}
            />
          ))}

          <SceneWhiteboard />
          <SceneNotes />
          <SceneClock />

          <div className={styles.lampGlow} style={{ left: LAMP.x - 230, top: LAMP.y - 170 }} />
          <div className={styles.lampPool} style={{ left: LAMP.x - 300, top: LAMP.y + 90 }} />

          <canvas
            ref={steamRef}
            className={styles.layer}
            width={170}
            height={250}
            style={{ left: CUP.x - 85, top: CUP.y - 244, width: 170, height: 250 }}
          />
        </div>
      </div>

      <div className={styles.dock}>
        <span className={styles.kicker}>🚀 AI interview coach</span>
        <h1 className={styles.title}>Stop guessing what to prepare. Start preparing with a plan.</h1>
        <p className={styles.sub}>
          Your resume, target role, and job description become a personal plan. Practice, get
          evaluated, and fix weak spots, all in minutes a day.
        </p>
        <div className={styles.actions}>
          <a href="/sign-up" className={styles.primary}>
            Get Interview Ready &rarr;
          </a>
          <a href="#how-it-works" className={styles.secondary}>
            See how it works
          </a>
        </div>
      </div>
    </section>
  );
}
