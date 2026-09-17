"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Download,
  Trash2,
  X,
  MousePointer,
  Pencil,
  Highlighter,
  Type,
  Square,
  Circle,
  ArrowUpRight,
  StickyNote,
  Eraser,
  RotateCcw,
  RotateCw,
  Maximize2,
  Grid,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

interface WhiteboardModalProps {
  onClose: () => void;
}

type ToolType =
  | "select"
  | "pen"
  | "highlighter"
  | "text"
  | "rectangle"
  | "circle"
  | "arrow"
  | "sticky"
  | "eraser";

const STROKE_COLORS = [
  { id: "purple", value: "#7c3aed" },
  { id: "blue", value: "#3b82f6" },
  { id: "emerald", value: "#10b981" },
  { id: "orange", value: "#ff6c47" },
  { id: "red", value: "#ef4444" },
  { id: "black", value: "#1e1c1a" },
];

export function WhiteboardModal({ onClose }: WhiteboardModalProps) {
  const [selectedTool, setSelectedTool] = useState<ToolType>("select");
  const [strokeColor, setStrokeColor] = useState("#7c3aed");
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [showGrid, setShowGrid] = useState(true);

  // Drawing state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [redoStack, setRedoStack] = useState<ImageData[]>([]);

  // Setup canvas resolution and context
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, []);

  const saveCanvasState = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory((prev) => [...prev.slice(-15), imageData]);
    setRedoStack([]);
  }, []);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (selectedTool === "select") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    saveCanvasState();
    setIsDrawing(true);

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);

    if (selectedTool === "eraser") {
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineWidth = strokeWidth * 6;
    } else if (selectedTool === "highlighter") {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = strokeColor + "55"; // translucent
      ctx.lineWidth = strokeWidth * 4;
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = strokeWidth;
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handleMouseUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.closePath();
  };

  const handleClearAll = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    saveCanvasState();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleUndo = () => {
    const canvas = canvasRef.current;
    if (!canvas || history.length === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const currentImg = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setRedoStack((prev) => [...prev, currentImg]);

    const previousImg = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));
    ctx.putImageData(previousImg, 0, 0);
  };

  const handleRedo = () => {
    const canvas = canvasRef.current;
    if (!canvas || redoStack.length === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const nextImg = redoStack[redoStack.length - 1];
    setRedoStack((prev) => prev.slice(0, -1));

    const currentImg = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory((prev) => [...prev, currentImg]);
    ctx.putImageData(nextImg, 0, 0);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "url-shortener-whiteboard.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="flex w-full flex-col overflow-hidden rounded-[24px] border border-[#ede6db] bg-white shadow-[0_8px_30px_rgba(30,28,26,0.06)]">
      {/* 1. Header Bar matching node 196:219 */}
      <div className="flex flex-col gap-3 border-b border-[#f4efe8] bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
        {/* Left: Title, Saved Badge, and Description */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <h1 className="font-display text-xl font-extrabold text-ink sm:text-[22px]">
              Whiteboard
            </h1>
            <span className="flex items-center gap-1.5 rounded-full bg-[#edf5ec] px-2.5 py-0.5 text-xs font-semibold text-[#10b981]">
              <span className="size-1.5 rounded-full bg-[#10b981]" />
              Saved 2 min ago
            </span>
          </div>
          <p className="text-xs text-ink-muted sm:text-[13px]">
            Think, sketch and calculate your ideas. This is your personal
            working space.
          </p>
        </div>

        {/* Right: Actions (Download, Clear All, Close) */}
        <div className="flex items-center gap-2.5 self-start sm:self-center">
          <button
            type="button"
            onClick={handleDownload}
            className="flex h-8 items-center gap-1.5 rounded-full border border-[#ede6db] bg-[#fbf9f4] px-3.5 text-xs font-semibold text-ink shadow-sm transition-colors hover:bg-[#ede6db]"
          >
            <Download className="size-3.5 text-ink-muted" />
            <span>Download</span>
          </button>

          <button
            type="button"
            onClick={handleClearAll}
            className="flex h-8 items-center gap-1.5 rounded-full border border-red-500 bg-white px-3.5 text-xs font-semibold text-red-500 shadow-sm transition-colors hover:bg-red-50"
          >
            <Trash2 className="size-3.5 text-red-500" />
            <span>Clear All</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-full border border-[#ede6db] bg-[#fbf9f4] text-ink shadow-sm transition-colors hover:bg-[#ede6db]"
            aria-label="Close whiteboard"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>

      {/* 2. Workspace Body: Left Toolbar + Main Canvas Area */}
      <div className="flex min-h-[580px] w-full flex-col sm:flex-row">
        {/* Left Toolbar */}
        <div className="flex w-full sm:w-[100px] shrink-0 flex-row sm:flex-col items-center justify-between sm:justify-start gap-1 sm:gap-2 border-b sm:border-b-0 sm:border-r border-[#f4efe8] bg-[#fbf9f4] p-2.5 overflow-x-auto sm:overflow-y-auto">
          {/* Tool buttons */}
          <div className="flex sm:flex-col gap-1 w-full">
            {[
              { id: "select", label: "Select", icon: MousePointer },
              { id: "pen", label: "Pen", icon: Pencil },
              { id: "highlighter", label: "Highlighter", icon: Highlighter },
              { id: "text", label: "Text", icon: Type },
              { id: "rectangle", label: "Rectangle", icon: Square },
              { id: "circle", label: "Circle", icon: Circle },
              { id: "arrow", label: "Arrow", icon: ArrowUpRight },
              { id: "sticky", label: "Sticky Note", icon: StickyNote },
              { id: "eraser", label: "Eraser", icon: Eraser },
            ].map((tool) => {
              const Icon = tool.icon;
              const isActive = selectedTool === tool.id;
              return (
                <button
                  key={tool.id}
                  type="button"
                  onClick={() => setSelectedTool(tool.id as ToolType)}
                  className={`flex sm:w-full flex-col items-center justify-center gap-1 rounded-xl p-2 text-[11px] font-medium transition-all ${
                    isActive
                      ? "border border-brand bg-white text-brand shadow-sm font-semibold"
                      : "text-ink-muted hover:bg-white/60 hover:text-ink"
                  }`}
                >
                  <Icon className="size-4" />
                  <span className="text-[10px] leading-none">{tool.label}</span>
                </button>
              );
            })}
          </div>

          <hr className="hidden sm:block w-full border-[#ede6db] my-1" />

          {/* Stroke section */}
          <div className="hidden sm:flex flex-col items-center gap-2 w-full pt-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted">
              Stroke
            </span>

            {/* Colors */}
            <div className="grid grid-cols-3 gap-1.5">
              {STROKE_COLORS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setStrokeColor(c.value)}
                  className={`size-4 rounded-full transition-transform ${
                    strokeColor === c.value
                      ? "ring-2 ring-brand ring-offset-1 scale-110"
                      : "opacity-80 hover:opacity-100"
                  }`}
                  style={{ backgroundColor: c.value }}
                  aria-label={c.id}
                />
              ))}
            </div>

            {/* Thickness */}
            <div className="flex items-center gap-1.5 pt-1">
              {[2, 4, 8].map((w) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => setStrokeWidth(w)}
                  className={`flex size-5 items-center justify-center rounded border transition-colors ${
                    strokeWidth === w
                      ? "border-brand bg-white"
                      : "border-transparent text-ink-muted hover:bg-white"
                  }`}
                >
                  <div
                    className="rounded-full bg-ink"
                    style={{ width: `${w * 1.5}px`, height: `${w * 1.5}px` }}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Canvas Area */}
        <div className="relative flex flex-1 flex-col overflow-hidden bg-[#fdfdfb]">
          {/* Scrollable blueprint container */}
          <div
            className="relative flex-1 overflow-auto p-6 sm:p-8"
            style={{
              backgroundImage: showGrid
                ? "radial-gradient(#d1c7b7 1.2px, transparent 1.2px)"
                : "none",
              backgroundSize: "24px 24px",
              transform: `scale(${zoomLevel / 100})`,
              transformOrigin: "top left",
            }}
          >
            {/* Freehand HTML5 Drawing Canvas overlay */}
            <canvas
              ref={canvasRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              className={`absolute inset-0 size-full z-20 ${
                selectedTool === "select"
                  ? "cursor-default"
                  : "cursor-crosshair"
              }`}
            />

            {/* Underlying Architecture Blueprint Content */}
            <div className="relative z-10 flex flex-col gap-8 select-none pointer-events-auto">
              {/* Title */}
              <div className="inline-block self-start">
                <h2 className="font-display text-2xl font-extrabold text-[#7c3aed]">
                  URL Shortener — Initial Thoughts
                </h2>
                <div className="h-0.5 w-full bg-[#7c3aed] mt-1" />
              </div>

              {/* Two Column Layout: Requirements & System Architecture */}
              <div className="flex flex-col xl:flex-row gap-8 items-start">
                {/* Left Column: Requirements, Back of the Envelope, Key Components */}
                <div className="flex flex-col gap-6 w-full max-w-[420px]">
                  {/* Requirements */}
                  <div className="flex flex-col gap-2">
                    <span className="font-display text-xs font-bold uppercase tracking-wider text-ink">
                      Requirements
                    </span>
                    <ul className="flex flex-col gap-1 text-xs text-ink/90 leading-relaxed font-sans">
                      <li>• 100M URLs generated per day</li>
                      <li>• 200M redirects/day (read-heavy 2:1 ratio)</li>
                      <li>• Low latency (global availability)</li>
                      <li>• Support custom aliases (/myblog)</li>
                      <li>• Basic analytics (total + unique clicks)</li>
                    </ul>
                  </div>

                  {/* Back of the envelope */}
                  <div className="flex flex-col gap-2">
                    <span className="font-display text-xs font-bold uppercase tracking-wider text-ink">
                      Back of the Envelope
                    </span>
                    <ul className="flex flex-col gap-1 text-xs text-ink/90 leading-relaxed font-sans">
                      <li>• Writes: 100M / 86400s ≈ 1,157 writes/sec</li>
                      <li>• Reads: 200M / 86400s ≈ 2,314 redirects/sec</li>
                      <li>• Peak Traffic (10x) ≈ 23,140 redirects/sec</li>
                    </ul>
                  </div>

                  {/* Key components */}
                  <div className="flex flex-col gap-2">
                    <span className="font-display text-xs font-bold uppercase tracking-wider text-ink">
                      Key Components
                    </span>
                    <ul className="flex flex-col gap-1 text-xs text-ink/90 leading-relaxed font-sans">
                      <li>• API Gateway / Load Balancer</li>
                      <li>• Shortening Service (Base62 Token generator)</li>
                      <li>• Database (NoSQL vs Relational / Redis cache)</li>
                      <li>• Analytics Collector (Kafka/Kinesis pipeline)</li>
                    </ul>
                  </div>
                </div>

                {/* Center Column: System Architecture Flow Diagram */}
                <div className="flex flex-col items-center gap-3 w-full max-w-[460px]">
                  {/* Tier 1: Client */}
                  <div className="w-52 rounded-xl border border-[#93c5fd] bg-[#eff6ff] p-3 text-center text-xs font-semibold text-[#1e40af] shadow-xs">
                    Client (Web/Mobile)
                  </div>

                  <span className="text-[#b0a898] text-sm">↕</span>

                  {/* Tier 2: CDN */}
                  <div className="relative w-52 rounded-xl border border-[#c084fc] bg-[#f5f3ff] p-3 text-center text-xs font-semibold text-[#6b21a8] shadow-xs">
                    CDN (Static + Redirects)
                    {/* Callout text */}
                    <div className="hidden sm:block absolute -right-48 top-1 text-left text-[11px] font-medium text-emerald-700 italic leading-snug">
                      Global users:
                      <br />
                      Use CDN for low latency redirects
                    </div>
                  </div>

                  <span className="text-[#b0a898] text-sm">↕</span>

                  {/* Tier 3: Load Balancer */}
                  <div className="w-52 rounded-xl border border-[#fca5a5] bg-[#fef2f2] p-3 text-center text-xs font-semibold text-[#991b1b] shadow-xs">
                    Load Balancer
                  </div>

                  <span className="text-[#b0a898] text-sm">↕</span>

                  {/* Tier 4: URL Service with highlight ring */}
                  <div className="relative w-52 rounded-xl border-2 border-[#f59e0b] bg-[#fffbeb] p-3 text-center text-xs font-bold text-[#92400e] shadow-sm ring-2 ring-blue-500/50">
                    URL Service (Write/Read)
                    {/* Callout text */}
                    <div className="hidden sm:block absolute -left-28 top-2.5 text-right text-[11px] font-bold text-blue-600">
                      Core bottleneck!
                    </div>
                  </div>

                  <span className="text-[#b0a898] text-sm">↕</span>

                  {/* Tier 5: Storage & Analytics */}
                  <div className="grid grid-cols-3 gap-2 w-full">
                    <div className="rounded-xl border border-[#6ee7b7] bg-[#ecfdf5] p-2.5 text-center text-[11px] font-semibold text-[#065f46] shadow-xs">
                      MySQL (Primary DB)
                    </div>
                    <div className="rounded-xl border border-[#fda4af] bg-[#fff1f2] p-2.5 text-center text-[11px] font-semibold text-[#9f1239] shadow-xs">
                      Redis (Cache)
                    </div>
                    <div className="rounded-xl border border-[#5eead4] bg-[#f0fdfa] p-2.5 text-center text-[11px] font-semibold text-[#115e59] shadow-xs">
                      Analytics Warehouse
                    </div>
                  </div>
                </div>

                {/* Right Column: Sticky Notes */}
                <div className="flex flex-col gap-3 w-full max-w-[240px]">
                  {/* Yellow Note */}
                  <div className="rounded-lg border border-[#fde047] bg-[#fef9c3] p-3.5 text-xs text-amber-950 shadow-sm flex flex-col gap-1.5 rotate-[-1deg]">
                    <span className="font-bold text-amber-900">Notes:</span>
                    <ol className="flex flex-col gap-1 leading-relaxed">
                      <li>1. Base62 for short URL token generation.</li>
                      <li>2. Cache hottest 20% URLs.</li>
                      <li>3. Keep service stateless.</li>
                    </ol>
                  </div>

                  {/* Purple Note */}
                  <div className="rounded-lg border border-[#ddd6fe] bg-[#f5f3ff] p-3 text-xs text-purple-900 shadow-sm leading-relaxed rotate-[1deg]">
                    Need Geodistribution for write master databases to avoid
                    cross-region replication latency.
                  </div>

                  {/* Cyan Note */}
                  <div className="rounded-lg border border-[#a5f3fc] bg-[#ecfeff] p-3 text-xs text-cyan-900 shadow-sm leading-relaxed rotate-[-0.5deg]">
                    Use Redis Cluster with eviction policy set to volatile-lru.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Bottom-Right Controls */}
          <div className="absolute bottom-4 right-4 z-30 flex items-center gap-2 rounded-full border border-[#ede6db] bg-white px-3 py-1.5 shadow-lg">
            {/* Undo & Redo */}
            <button
              type="button"
              onClick={handleUndo}
              disabled={history.length === 0}
              className="flex size-7 items-center justify-center rounded-full hover:bg-[#faf6f0] text-ink-muted disabled:opacity-40 transition-colors"
              aria-label="Undo"
            >
              <RotateCcw className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={handleRedo}
              disabled={redoStack.length === 0}
              className="flex size-7 items-center justify-center rounded-full hover:bg-[#faf6f0] text-ink-muted disabled:opacity-40 transition-colors"
              aria-label="Redo"
            >
              <RotateCw className="size-3.5" />
            </button>

            <span className="h-4 w-px bg-[#ede6db]" />

            {/* Zoom */}
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.max(50, z - 10))}
              className="flex size-7 items-center justify-center rounded-full hover:bg-[#faf6f0] text-ink-muted transition-colors"
              aria-label="Zoom out"
            >
              <ZoomOut className="size-3.5" />
            </button>
            <span className="text-xs font-mono font-semibold text-ink px-1">
              {zoomLevel}%
            </span>
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.min(150, z + 10))}
              className="flex size-7 items-center justify-center rounded-full hover:bg-[#faf6f0] text-ink-muted transition-colors"
              aria-label="Zoom in"
            >
              <ZoomIn className="size-3.5" />
            </button>

            <span className="h-4 w-px bg-[#ede6db]" />

            {/* Fullscreen / Fit */}
            <button
              type="button"
              onClick={() => setZoomLevel(100)}
              className="flex size-7 items-center justify-center rounded-full hover:bg-[#faf6f0] text-ink-muted transition-colors"
              aria-label="Reset zoom"
            >
              <Maximize2 className="size-3.5" />
            </button>

            {/* Grid Toggle */}
            <button
              type="button"
              onClick={() => setShowGrid(!showGrid)}
              className={`flex size-7 items-center justify-center rounded-full transition-colors ${
                showGrid
                  ? "bg-[#faf6f0] text-brand"
                  : "text-ink-muted hover:bg-[#faf6f0]"
              }`}
              aria-label="Toggle grid"
            >
              <Grid className="size-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
