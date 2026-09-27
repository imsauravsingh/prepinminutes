# Practice Module — Interactive Tooling & Whiteboard Architecture

This document details the interactive tooling within practice sessions, focusing on the Whiteboard canvas (`WhiteboardModal.tsx`) and the Audio Waveform dock.

---

## 1. Full-Screen Whiteboard Modal (`WhiteboardModal.tsx`)

The Whiteboard provides candidates with an architectural canvas inspired by real technical interview tools (Excalidraw / Miro):

### Features & Capabilities

1. **Drawing Tools**:
   - `select`: Drag and move nodes, sticky notes, and shapes.
   - `pen`: Freehand ink with configurable stroke width and colors (`#7c3aed`, `#10b981`, `#ff5520`, `#1e1c1a`).
   - `highlighter`: Semi-transparent highlighting strokes.
   - `rectangle`, `circle`, `arrow`: Vector architecture primitives.
   - `sticky`: Draggable sticky notes with multiple color themes (yellow, purple, cyan, emerald, rose).
   - `eraser`: Vector and ink stroke eraser.
2. **Architecture Diagram Nodes**:
   - Pre-built system design nodes: `Client`, `CDN`, `Load Balancer`, `URL Service`, `MySQL Primary`, `Redis Cache`, `Analytics Warehouse`.
   - Visual bottleneck annotations (e.g. orange pulse on high-throughput database nodes).
3. **History & Undo/Redo**:
   - 25-step history stack snapshots (`undo` / `redo`) via `CanvasRenderingContext2D.getImageData`.
4. **PNG Export**:
   - Combines HTML5 2D canvas ink, shapes, sticky notes, and text into a high-resolution PNG download (`system-design-whiteboard.png`).

---

## 2. Audio Waveform & Speech Recording Dock

- **Visualizer**: 24 animated frequency bars (`WAVEFORM_HEIGHTS`) transitioning dynamically based on audio activity or pause state.
- **Controls**:
  - `Pause / Resume`: Freezes timer and audio recording.
  - `Central Mic Circle`: Prominent touch button (`size-12 sm:size-14 bg-[#7c3aed]`).
  - `Stop`: Triggers end session confirmation modal.
  - `Text Mode Toggle`: Toggles inline `<form>` enabling candidate to type technical responses instead of speaking.
