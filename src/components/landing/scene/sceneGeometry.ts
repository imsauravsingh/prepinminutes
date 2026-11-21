/**
 * Geometry for the hero "Prep Room" scene.
 *
 * Every coordinate is in scene pixels: the background frame is 1920x1080 and
 * the whole scene scales as one block, so overlays stay glued to their objects
 * at any screen size.
 */

export const SCENE_W = 1920;
export const SCENE_H = 1080;

export type Point = readonly [number, number];
export type Quad = readonly [Point, Point, Point, Point]; // TL, TR, BR, BL

/** Inner screen of the angled desktop monitor (right edge is nearer, so taller). */
export const MONITOR_QUAD: Quad = [
  [1403, 407],
  [1879, 326],
  [1864, 754],
  [1384, 726],
];
export const MONITOR_SIZE = { w: 512, h: 400 };

/** Writable area of the whiteboard (inside the metal frame). */
export const WHITEBOARD_QUAD: Quad = [
  [815, 205],
  [1178, 208],
  [1162, 493],
  [816, 495],
];
export const WHITEBOARD_SIZE = { w: 440, h: 360 };

/** Wall clock face. */
export const CLOCK = { cx: 1605, cy: 180, r: 124 };

/** Lamp bulb opening, used for the glow. */
export const LAMP = { x: 1246, y: 628 };

/** Coffee cup rim centre, used for the steam source. */
export const CUP = { x: 612, y: 914 };

/** Character crop: frames are cut from the video at this box. */
export const CHAR_BOX = { x: 210, y: 140, w: 870, h: 860 };
export const CHAR_FRAMES = 95;

/** Approximate centre of the character's head, used for gaze direction. */
export const HEAD = { x: 640, y: 330 };

/**
 * Regions with greenery that sway in the wind.
 * - "outside": tree leaves seen through the window. They move everywhere and
 *   are clipped to the glass, so they never draw over the window bars.
 * - "plant": potted plants. `baseY` (the pot) stays still and the tips move most.
 */
export const GREENERY = [
  { key: "outside", kind: "outside", x: 0, y: 0, w: 340, h: 790, baseY: 0, amp: 6, speed: 0.0009, phase: 0.6 },
  { key: "monstera", kind: "plant", x: 0, y: 0, w: 400, h: 790, baseY: 725, amp: 11, speed: 0.0011, phase: 0 },
  { key: "desk-plant", kind: "plant", x: 1700, y: 610, w: 220, h: 215, baseY: 812, amp: 7, speed: 0.0014, phase: 1.7 },
] as const;

/**
 * Builds a CSS matrix3d that maps a w x h element onto a quad, so flat content
 * gets the same perspective as the object in the picture.
 */
export function quadMatrix(w: number, h: number, quad: Quad): string {
  const [[x0, y0], [x1, y1], [x2, y2], [x3, y3]] = quad;
  const dx1 = x1 - x2;
  const dx2 = x3 - x2;
  const dx3 = x0 - x1 + x2 - x3;
  const dy1 = y1 - y2;
  const dy2 = y3 - y2;
  const dy3 = y0 - y1 + y2 - y3;

  let g = 0;
  let hh = 0;
  if (dx3 !== 0 || dy3 !== 0) {
    const det = dx1 * dy2 - dx2 * dy1;
    g = (dx3 * dy2 - dx2 * dy3) / det;
    hh = (dx1 * dy3 - dx3 * dy1) / det;
  }
  const a = x1 - x0 + g * x1;
  const b = x3 - x0 + hh * x3;
  const c = x0;
  const d = y1 - y0 + g * y1;
  const e = y3 - y0 + hh * y3;
  const f = y0;

  const m = [a / w, d / w, 0, g / w, b / h, e / h, 0, hh / h, 0, 0, 1, 0, c, f, 0, 1];
  return `matrix3d(${m.map((v) => +v.toFixed(8)).join(",")})`;
}

/**
 * Gaze keyframes: screen angle in degrees (0 = right, 90 = up) to the frame
 * index where the character looks that way. Frames run in one continuous
 * circle, so moving between neighbours always passes through real poses.
 */
const GAZE_KEYS: readonly (readonly [number, number])[] = [
  [0, 57],
  [45, 42],
  [90, 36],
  [135, 32],
  [180, 27],
  [225, 21],
  [270, 9],
  [315, 82],
  [360, 57],
];

/** Frame used when the pointer is right on the face: looking at the viewer. */
export const FRAME_LOOK_AT_VIEWER = 30;

/** Idle typing loop: frames where he looks at the laptop and types. */
export const IDLE_START = 72;
export const IDLE_LENGTH = 33;

/** Signed shortest distance between two frame indices on the loop. */
export function cyclicDelta(from: number, to: number, n = CHAR_FRAMES): number {
  let d = (((to - from) % n) + n) % n;
  if (d > n / 2) d -= n;
  return d;
}

export function wrapFrame(v: number, n = CHAR_FRAMES): number {
  return ((v % n) + n) % n;
}

export function angleToFrame(angle: number): number {
  const a = ((angle % 360) + 360) % 360;
  for (let i = 0; i < GAZE_KEYS.length - 1; i++) {
    const [a0, f0] = GAZE_KEYS[i];
    const [a1, f1] = GAZE_KEYS[i + 1];
    if (a >= a0 && a <= a1) {
      const t = (a - a0) / (a1 - a0);
      return wrapFrame(f0 + cyclicDelta(f0, f1) * t);
    }
  }
  return GAZE_KEYS[0][1];
}
