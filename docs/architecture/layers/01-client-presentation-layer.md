# Layer 1: Client & Presentation Layer Architecture

This document specifies the technical architecture, component lifecycle, rendering patterns, and interactive engines of the **PrepInMinutes** frontend presentation layer.

---

## 1. Architectural Scope & Objectives

The Client & Presentation Layer runs on modern web and mobile browsers. It is built to deliver:

1. **Sub-second Initial Page Loads**: SSR + Static pre-rendering powered by Next.js 16.3 and Turbopack.
2. **Deterministic UI State**: Zero hydration mismatches, isolated navigation routes, and explicit state machines.
3. **Multimodal Rich Interactivity**:
   - In-browser code editing and execution sandbox.
   - Interactive HTML5 Whiteboard canvas with vector primitives and PNG export.
   - Low-latency audio dock with animated 24-frequency waveform visualization.
4. **Universal Mobile Responsiveness**: Flawless touch layouts from compact 320px viewports (iPhone SE) to 4K ultra-wide monitors.

---

## 2. Framework & Core Technologies

| Technology       | Version / Specification        | Architectural Purpose                                                            |
| ---------------- | ------------------------------ | -------------------------------------------------------------------------------- |
| **Next.js**      | 16.3.2 (App Router, Turbopack) | Hybrid SSR/SSG rendering, Edge middleware, file-system routing.                  |
| **React**        | 19.x (Strict Mode)             | Server vs Client component boundaries, `useActionState`, `useSyncExternalStore`. |
| **TypeScript**   | 5.x (Strict Mode)              | End-to-end type safety, exhaustive union discrimination for state machines.      |
| **Tailwind CSS** | v4                             | Utility-first responsive design tokens, CSS variables, fluid typography.         |
| **Lucide React** | Latest                         | High-clarity SVG icon system with uniform stroke widths.                         |
| **Clerk SDK**    | `@clerk/nextjs`                | Authentication gate, user session token management, profile modal.               |

---

## 3. Server vs. Client Component Boundary

```
[ App Router Root (layout.tsx) ]  ← Server Component (HTML Shell, Metadata, Font Variables)
        │
        ▼
   [ <AuthGate> ]                  ← Client Component (Clerk Auth State Guard)
        │
        ▼
 [ Shell Grid: Sidebar + Main ]    ← Server/Client Hybrid
        ├── <Sidebar />            ← Client Component (Route Active Detection, Off-canvas Drawer)
        └── <ModuleWorkspace />    ← Client Component ("use client" for Interactivity & Timers)
```

### Server Component Rules

- All `page.tsx` files serve as server component wrappers defining route `Metadata`.
- They must not import browser-only APIs (`window`, `document`, `navigator`, `localStorage`).
- Initial data hydration is passed via serializable props to client workspaces.

### Client Component Rules

- Must declare `"use client";` at line 1.
- Encapsulate interactive state: form inputs, live timers, audio recording, canvas nodes, and modals.
- Must prevent hydration flickers by using `useSyncExternalStore` or `useEffect` for local storage reads.

---

## 4. Specialized Interactive Engines

### 4.1. HTML5 Canvas Whiteboard Engine (`WhiteboardModal.tsx`)

The Whiteboard provides a full-screen architecture diagramming surface:

```
┌─────────────────────────────────────────────────────────────┐
│ Whiteboard Modal                                            │
│ ┌───────────────┐ ┌───────────────────────────────────────┐ │
│ │ Tool Palette  │ │ <canvas id="whiteboard-surface" />    │ │
│ │ • Pen / Brush │ │ - RequestAnimationFrame Render Loop   │ │
│ │ • Eraser      │ │ - Vector Node List: shapes, text, DBs │ │
│ │ • Shapes (DB) │ │ - Coordinate Normalization (DPI scale)│ │
│ │ • Sticky Note │ │ - PNG Blob Exporter                   │ │
│ └───────────────┘ └───────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

1. **Resolution & Retina Scaling**:
   ```ts
   const dpr = window.devicePixelRatio || 1;
   canvas.width = rect.width * dpr;
   canvas.height = rect.height * dpr;
   ctx.scale(dpr, dpr);
   ```
2. **Event Decoupling & Memory Safety**:
   - `mousemove` and `mouseup` listeners are bound to `window` during drag/draw operations.
   - **Mandatory Cleanup**:
     ```ts
     useEffect(() => {
       return () => {
         window.removeEventListener("mousemove", handlePointerMove);
         window.removeEventListener("mouseup", handlePointerUp);
       };
     }, []);
     ```
3. **Cloud Export Pipeline**:
   - Generates high-res image via `canvas.toBlob("image/png")`.
   - Sends multipart blob to `/api/storage/whiteboard/upload` returning an S3/R2 presigned URI.

---

### 4.2. In-Browser Code Workspace Engine (`PracticeCodingWorkspace.tsx`)

The Coding Workspace provides candidate code writing, execution, and confirmation mechanics:

1. **Editor Model**:
   - Multi-language switch: `javascript` (ES6) and `python` (Python 3).
   - Tab-key trap prevention and monospaced code styling (`font-mono text-xs sm:text-sm`).
2. **Local Sandbox Execution**:
   - Evaluates input code against structured test fixtures with execution timeouts.
   - Status reporting: `idle` → `running` → `success` / `error`.
3. **Submission Confirmation Modal**:
   - Prevents accidental early submission.
   - **Contract**:
     ```tsx
     // Title
     <h3>Submit Coding Solution?</h3>
     // Body
     <p>Are you ready to submit your code for evaluation? Your implementation will be analyzed across test correctness, algorithmic complexity, and code quality.</p>
     // Actions
     <button onClick={() => setShowSubmitModal(false)}>Continue Session</button>
     <button onClick={handleConfirmSubmit}>Confirm & Submit</button>
     ```
   - ESC key listener closes modal; backdrop click closes modal; disabled during `isSubmitting`.

---

### 4.3. Real-Time Audio Dock & Waveform Engine

1. **Web Audio API Pipeline**:
   ```ts
   const audioContext = new (
     window.AudioContext || window.webkitAudioContext
   )();
   const analyser = audioContext.createAnalyser();
   analyser.fftSize = 64; // 32 frequency bins
   const dataArray = new Uint8Array(analyser.frequencyBinCount);
   ```
2. **Waveform Visualization**:
   - Renders 24 vertical SVG bars animating height dynamically based on frequency amplitudes.
   - When paused, bars transition to 40% opacity with flat 4px heights.
   - In text mode, the dock seamlessly swaps the waveform for an inline prompt text input.
3. **Mobile Layout Guards**:
   - Waveform bars have `shrink-0`.
   - Waveform container specifies `overflow-hidden` so it never forces horizontal page scroll on small viewports.

---

## 5. Design System Tokens & Responsive Rules

```
Canvas Background:   #fbf9f4  (Warm Paper Cream)
Brand Orange:        #ff5520  (Vibrant Action)
Ink Primary:         #1e1c1a  (High-Contrast Charcoal)
Ink Muted:           #6b6661  (Subtle Secondary)
Border Line:         #ede6db  (Soft Card Framing)
Emerald Accent:      #10b981  (Success / Passing Score)
Purple Accent:       #7c3aed  (Interview Stage Trackers)
Card Radiuses:       rounded-2xl (16px), rounded-3xl (24px)
```

### Breakpoint Matrix

- **`< 640px` (Mobile)**:
  - 1-column stacked layouts (`flex-col`, `grid-cols-1`).
  - Evaluation quick actions convert to 2-column grid (`col-span-2` for Retake Drill).
  - Bottom action bars stack vertically as `flex-col-reverse` (primary button on top).
  - Modal padding: `p-4 sm:p-6`.
- **`640px – 1024px` (Tablet)**:
  - 2-column cards, adaptive whiteboard panels.
  - Sidebar remains off-canvas mobile drawer with hamburger trigger.
- **`≥ 1024px` (Desktop)**:
  - Persistent fixed sidebar (260px width) with sticky position.
  - Multi-column 8/4 grid splits for interview workspace and inspector drawers.

---

## 6. Client State Machine & Hydration Safety

To avoid SSR hydration mismatches when reading from browser `localStorage` or `sessionStorage`:

```tsx
// Pattern: Safe External Store Subscription
function useOnboardingStatus() {
  return useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener("storage", onStoreChange);
      return () => window.removeEventListener("storage", onStoreChange);
    },
    () => localStorage.getItem("prep_onboarding_completed") === "true",
    () => false, // Server Snapshot (Defaults to false on server)
  );
}
```

---

## 7. Developer Implementation & Verification Checklist

- [ ] Every page has a server `page.tsx` exporting standard Next.js `metadata`.
- [ ] Every interactive workspace starts with `"use client";` at line 1.
- [ ] No `window` or `document` calls outside `useEffect` or client event callbacks.
- [ ] Flex headers and badges include `min-w-0` to avoid horizontal layout breaking on 320px screens.
- [ ] Confirmation modals stack buttons vertically on mobile (`flex-col-reverse sm:flex-row`).
- [ ] Build verification: `npm run build` succeeds with exit code 0.
