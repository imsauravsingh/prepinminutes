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
  StickyNote as StickyIcon,
  Eraser,
  Undo2,
  Redo2,
  Maximize2,
  Grid,
  ZoomIn,
  ZoomOut,
  Check,
  FileText,
} from "lucide-react";

interface WhiteboardModalProps {
  onClose: () => void;
}

export type ToolType =
  | "select"
  | "pen"
  | "highlighter"
  | "text"
  | "rectangle"
  | "circle"
  | "arrow"
  | "sticky"
  | "eraser";

// System Design Architecture & Note Nodes (React Flow Style)
export interface BoardNode {
  id: string;
  type: "architecture" | "note-box";
  title: string;
  subtitle?: string;
  annotation?: string;
  x: number;
  y: number;
  width: number;
  height?: number;
  borderColor: string;
  bgColor: string;
  textColor: string;
  isBottleneck?: boolean;
}

export interface StickyItem {
  id: string;
  x: number;
  y: number;
  text: string;
  color: "yellow" | "purple" | "cyan" | "emerald" | "rose";
}

export interface TextItem {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
  fontSize: number;
}

// Vector Shapes: Rectangle, Circle, and Connector Arrow
export interface ShapeItem {
  id: string;
  type: "rectangle" | "circle" | "arrow";
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  strokeWidth: number;
  text?: string; // centered text for rectangles
  sourceId?: string; // connected source node or rectangle ID
  targetId?: string; // connected target node or rectangle ID
}

interface HistorySnapshot {
  canvasImageData: ImageData | null;
  boardNodes: BoardNode[];
  stickyNotes: StickyItem[];
  textItems: TextItem[];
  shapes: ShapeItem[];
}

const BOARD_WIDTH = 1500;
const BOARD_HEIGHT = 920;

const STROKE_COLORS = [
  { id: "purple", value: "#7c3aed" },
  { id: "blue", value: "#3b82f6" },
  { id: "emerald", value: "#10b981" },
  { id: "orange", value: "#ff6c47" },
  { id: "red", value: "#ef4444" },
  { id: "black", value: "#1e1c1a" },
];

const STICKY_COLORS = {
  yellow: "bg-[#fef9c3] border-[#fde047] text-amber-950",
  purple: "bg-[#f5f3ff] border-[#ddd6fe] text-purple-950",
  cyan: "bg-[#ecfeff] border-[#a5f3fc] text-cyan-950",
  emerald: "bg-[#ecfdf5] border-[#a7f3d0] text-emerald-950",
  rose: "bg-[#fff1f2] border-[#fecdd3] text-rose-950",
};

const INITIAL_NODES: BoardNode[] = [
  // Left Column Requirements
  {
    id: "req-card",
    type: "note-box",
    title: "REQUIREMENTS",
    subtitle:
      "• 100M URLs generated per day\n• 200M redirects/day (read-heavy 2:1 ratio)\n• Low latency (global availability)\n• Support custom aliases (/myblog)\n• Basic analytics (total + unique clicks)",
    x: 40,
    y: 110,
    width: 370,
    borderColor: "#ede6db",
    bgColor: "#ffffff",
    textColor: "#1e1c1a",
  },
  {
    id: "calc-card",
    type: "note-box",
    title: "BACK OF THE ENVELOPE",
    subtitle:
      "• Writes: 100M / 86400s ≈ 1,157 writes/sec\n• Reads: 200M / 86400s ≈ 2,314 redirects/sec\n• Peak Traffic (10x) ≈ 23,140 redirects/sec",
    x: 40,
    y: 285,
    width: 370,
    borderColor: "#ede6db",
    bgColor: "#ffffff",
    textColor: "#1e1c1a",
  },
  {
    id: "comp-card",
    type: "note-box",
    title: "KEY COMPONENTS",
    subtitle:
      "• API Gateway / Load Balancer\n• Shortening Service (Base62 Token generator)\n• Database (NoSQL vs Relational / Redis cache)\n• Analytics Collector (Kafka/Kinesis pipeline)",
    x: 40,
    y: 435,
    width: 370,
    borderColor: "#ede6db",
    bgColor: "#ffffff",
    textColor: "#1e1c1a",
  },

  // Architecture Diagram Nodes (Draggable & Selectable)
  {
    id: "node-client",
    type: "architecture",
    title: "Client (Web/Mobile)",
    x: 570,
    y: 110,
    width: 220,
    borderColor: "#93c5fd",
    bgColor: "#eff6ff",
    textColor: "#1e40af",
  },
  {
    id: "node-cdn",
    type: "architecture",
    title: "CDN (Static + Redirects)",
    annotation: "Global users:\nUse CDN for low latency redirects",
    x: 570,
    y: 195,
    width: 220,
    borderColor: "#c084fc",
    bgColor: "#f5f3ff",
    textColor: "#6b21a8",
  },
  {
    id: "node-lb",
    type: "architecture",
    title: "Load Balancer",
    x: 570,
    y: 295,
    width: 220,
    borderColor: "#fca5a5",
    bgColor: "#fef2f2",
    textColor: "#991b1b",
  },
  {
    id: "node-url-service",
    type: "architecture",
    title: "URL Service (Write/Read)",
    annotation: "Core bottleneck!",
    isBottleneck: true,
    x: 570,
    y: 395,
    width: 220,
    borderColor: "#f59e0b",
    bgColor: "#fffbeb",
    textColor: "#92400e",
  },
  {
    id: "node-mysql",
    type: "architecture",
    title: "MySQL (Primary DB)",
    x: 450,
    y: 515,
    width: 140,
    borderColor: "#6ee7b7",
    bgColor: "#ecfdf5",
    textColor: "#065f46",
  },
  {
    id: "node-redis",
    type: "architecture",
    title: "Redis (Cache)",
    x: 610,
    y: 515,
    width: 140,
    borderColor: "#fda4af",
    bgColor: "#fff1f2",
    textColor: "#9f1239",
  },
  {
    id: "node-analytics",
    type: "architecture",
    title: "Analytics Warehouse",
    x: 770,
    y: 515,
    width: 155,
    borderColor: "#5eead4",
    bgColor: "#f0fdfa",
    textColor: "#115e59",
  },
];

export function WhiteboardModal({ onClose }: WhiteboardModalProps) {
  // Toolbar state
  const [selectedTool, setSelectedTool] = useState<ToolType>("select");
  const [strokeColor, setStrokeColor] = useState("#7c3aed");
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [showGrid, setShowGrid] = useState(true);

  // Interactive Elements state
  const [boardNodes, setBoardNodes] = useState<BoardNode[]>(INITIAL_NODES);
  const [stickyNotes, setStickyNotes] = useState<StickyItem[]>([
    {
      id: "note-1",
      x: 1010,
      y: 110,
      text: "Notes:\n1. Base62 for short URL token generation.\n2. Cache hottest 20% URLs.\n3. Keep service stateless.",
      color: "yellow",
    },
    {
      id: "note-2",
      x: 1010,
      y: 260,
      text: "Need Geodistribution for write master databases to avoid cross-region replication latency.",
      color: "purple",
    },
    {
      id: "note-3",
      x: 1010,
      y: 385,
      text: "Use Redis Cluster with eviction policy set to volatile-lru.",
      color: "cyan",
    },
  ]);
  const [textItems, setTextItems] = useState<TextItem[]>([]);
  const [shapes, setShapes] = useState<ShapeItem[]>([]);

  // Selection & Hover state
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [hoveredElementId, setHoveredElementId] = useState<string | null>(null);
  const idCounterRef = useRef(100);

  // Excalidraw-style Centered Rectangle Text Editing
  const [editingShapeId, setEditingShapeId] = useState<string | null>(null);
  const [editingShapeText, setEditingShapeText] = useState("");

  // Editing Board Node (e.g. Requirements, Back of the Envelope)
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const [editingNodeData, setEditingNodeData] = useState<{ title: string; subtitle: string }>({
    title: "",
    subtitle: "",
  });

  // Drag-and-Connect Arrow State (from one rectangle/node to another)
  const [connectingState, setConnectingState] = useState<{
    sourceId: string;
    startX: number;
    startY: number;
  } | null>(null);
  const [connectTargetHoverId, setConnectTargetHoverId] = useState<string | null>(null);

  // Simple Inline Text Input Box (Text tool or double-click on empty canvas)
  const [activeTextInput, setActiveTextInput] = useState<{
    id?: string; // if editing existing text item
    x: number;
    y: number;
    text: string;
    mode: "plain" | "card"; // plain text vs Requirements-style card box
    title?: string;
  } | null>(null);
  const textInputRef = useRef<HTMLTextAreaElement | null>(null);

  // Dragging state for Select tool
  const [draggedItems, setDraggedItems] = useState<{
    ids: string[];
    startMouseX: number;
    startMouseY: number;
    initialPositions: { id: string; x: number; y: number; x2?: number; y2?: number }[];
  } | null>(null);
  const hasDraggedRef = useRef(false);

  // Marquee Selection Box
  const [marquee, setMarquee] = useState<{
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  } | null>(null);

  // Canvas & Board DOM references
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const boardRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // Freehand / Live shape drawing state
  const [isDrawingMouseDown, setIsDrawingMouseDown] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [currentMouse, setCurrentMouse] = useState<{ x: number; y: number } | null>(null);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const hasDrawnStrokeRef = useRef(false);
  const preActionSnapshotRef = useRef<HistorySnapshot | null>(null);

  // Unified Undo / Redo History Stacks
  const [historyStack, setHistoryStack] = useState<HistorySnapshot[]>([]);
  const [redoStack, setRedoStack] = useState<HistorySnapshot[]>([]);

  // Initialize Canvas 2D context
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, []);

  // Compute exact board coordinates for any MouseEvent
  const getBoardCoords = useCallback(
    (e: React.MouseEvent | MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };
      const rect = canvas.getBoundingClientRect();
      const scale = zoomLevel / 100;

      const x = (e.clientX - rect.left) / scale;
      const y = (e.clientY - rect.top) / scale;

      return {
        x: Math.round(Math.max(0, Math.min(BOARD_WIDTH, x))),
        y: Math.round(Math.max(0, Math.min(BOARD_HEIGHT, y))),
      };
    },
    [zoomLevel]
  );

  // Take a full snapshot of the board state
  const captureCurrentSnapshot = useCallback((): HistorySnapshot => {
    const canvas = canvasRef.current;
    let canvasImageData: ImageData | null = null;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        try {
          canvasImageData = ctx.getImageData(0, 0, BOARD_WIDTH, BOARD_HEIGHT);
        } catch {
          canvasImageData = null;
        }
      }
    }
    return {
      canvasImageData,
      boardNodes: boardNodes.map((n) => ({ ...n })),
      stickyNotes: stickyNotes.map((s) => ({ ...s })),
      textItems: textItems.map((t) => ({ ...t })),
      shapes: shapes.map((sh) => ({ ...sh })),
    };
  }, [boardNodes, stickyNotes, textItems, shapes]);

  // Save current state to history stack
  const pushStateToHistory = useCallback(() => {
    const snapshot = captureCurrentSnapshot();
    setHistoryStack((prev) => [...prev.filter(Boolean).slice(-25), snapshot]);
    setRedoStack([]);
  }, [captureCurrentSnapshot]);

  // Focus textarea when text input opens
  useEffect(() => {
    if (activeTextInput && textInputRef.current) {
      textInputRef.current.focus();
      textInputRef.current.select();
    }
  }, [activeTextInput]);

  // Helper: Get bounding box and center for any Node or Rectangle
  const getElementBounds = useCallback(
    (id: string) => {
      const node = boardNodes.find((n) => n.id === id);
      if (node) {
        const height = node.type === "note-box" ? 140 : 50;
        return {
          x: node.x,
          y: node.y,
          width: node.width,
          height,
          cx: node.x + node.width / 2,
          cy: node.y + height / 2,
        };
      }
      const shape = shapes.find((s) => s.id === id);
      if (shape && (shape.type === "rectangle" || shape.type === "circle")) {
        const x = Math.min(shape.x1, shape.x2);
        const y = Math.min(shape.y1, shape.y2);
        const width = Math.max(20, Math.abs(shape.x2 - shape.x1));
        const height = Math.max(20, Math.abs(shape.y2 - shape.y1));
        return {
          x,
          y,
          width,
          height,
          cx: x + width / 2,
          cy: y + height / 2,
        };
      }
      return null;
    },
    [boardNodes, shapes]
  );

  // Helper: Calculate closest anchor ports between two elements for dynamic connection arrows
  const getConnectedEndpoints = useCallback(
    (sourceId: string, targetId: string) => {
      const bA = getElementBounds(sourceId);
      const bB = getElementBounds(targetId);
      if (!bA || !bB) return null;

      const anchorsA = [
        { x: bA.cx, y: bA.y }, // Top
        { x: bA.x + bA.width, y: bA.cy }, // Right
        { x: bA.cx, y: bA.y + bA.height }, // Bottom
        { x: bA.x, y: bA.cy }, // Left
      ];

      const anchorsB = [
        { x: bB.cx, y: bB.y }, // Top
        { x: bB.x + bB.width, y: bB.cy }, // Right
        { x: bB.cx, y: bB.y + bB.height }, // Bottom
        { x: bB.x, y: bB.cy }, // Left
      ];

      let bestDist = Infinity;
      let bestPair = { from: anchorsA[0], to: anchorsB[0] };

      for (const a of anchorsA) {
        for (const b of anchorsB) {
          const dist = Math.hypot(b.x - a.x, b.y - a.y);
          if (dist < bestDist) {
            bestDist = dist;
            bestPair = { from: a, to: b };
          }
        }
      }

      return bestPair;
    },
    [getElementBounds]
  );

  // Commit text from inline text editor
  const commitTextInput = useCallback(() => {
    if (!activeTextInput) return;
    const trimmed = activeTextInput.text.trim();

    if (trimmed) {
      pushStateToHistory();

      if (activeTextInput.mode === "card") {
        // Create or update a Requirements-style Note Box card
        idCounterRef.current += 1;
        const newCard: BoardNode = {
          id: activeTextInput.id || `card-${idCounterRef.current}`,
          type: "note-box",
          title: (activeTextInput.title || "NOTES").toUpperCase(),
          subtitle: trimmed,
          x: activeTextInput.x,
          y: activeTextInput.y,
          width: 370,
          borderColor: "#ede6db",
          bgColor: "#ffffff",
          textColor: "#1e1c1a",
        };
        setBoardNodes((prev) => [...prev, newCard]);
        setSelectedItemIds([newCard.id]);
      } else if (activeTextInput.id) {
        // Editing existing plain text
        setTextItems((prev) =>
          prev.map((item) =>
            item.id === activeTextInput.id ? { ...item, text: trimmed } : item
          )
        );
        setSelectedItemIds([activeTextInput.id]);
      } else {
        // Creating new plain text item
        idCounterRef.current += 1;
        const newText: TextItem = {
          id: `text-${idCounterRef.current}`,
          x: activeTextInput.x,
          y: activeTextInput.y,
          text: trimmed,
          color: strokeColor,
          fontSize: 15,
        };
        setTextItems((prev) => [...prev, newText]);
        setSelectedItemIds([newText.id]);
      }
      setSelectedTool("select");
    } else if (activeTextInput.id) {
      pushStateToHistory();
      setTextItems((prev) => prev.filter((item) => item.id !== activeTextInput.id));
      setSelectedItemIds([]);
    }

    setActiveTextInput(null);
  }, [activeTextInput, strokeColor, pushStateToHistory]);

  // Commit centered rectangle text
  const commitShapeText = useCallback(() => {
    if (!editingShapeId) return;
    pushStateToHistory();
    setShapes((prev) =>
      prev.map((sh) =>
        sh.id === editingShapeId ? { ...sh, text: editingShapeText.trim() } : sh
      )
    );
    setEditingShapeId(null);
    setEditingShapeText("");
  }, [editingShapeId, editingShapeText, pushStateToHistory]);

  // Commit editing board node card (Requirements, Back of the envelope, etc.)
  const commitNodeEdit = useCallback(() => {
    if (!editingNodeId) return;
    pushStateToHistory();
    setBoardNodes((prev) =>
      prev.map((n) =>
        n.id === editingNodeId
          ? {
              ...n,
              title: editingNodeData.title.trim() || n.title,
              subtitle: editingNodeData.subtitle.trim() || n.subtitle,
            }
          : n
      )
    );
    setEditingNodeId(null);
  }, [editingNodeId, editingNodeData, pushStateToHistory]);

  // Canvas Mouse Down: handles drawing start, shape drag start, or text/sticky placement
  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (e.button !== 0) return;
    const { x, y } = getBoardCoords(e);

    // Commit any active open editors first
    if (editingShapeId) commitShapeText();
    if (editingNodeId) commitNodeEdit();

    // 1. Text Tool: spawn inline text editor at click point
    if (selectedTool === "text") {
      if (activeTextInput) commitTextInput();
      setActiveTextInput({ x, y, text: "", mode: "plain" });
      return;
    }

    // 2. Sticky Note Tool: spawn editable sticky note centered on click
    if (selectedTool === "sticky") {
      pushStateToHistory();
      idCounterRef.current += 1;
      const newSticky: StickyItem = {
        id: `note-${idCounterRef.current}`,
        x: Math.max(20, Math.min(BOARD_WIDTH - 230, x - 100)),
        y: Math.max(20, Math.min(BOARD_HEIGHT - 160, y - 50)),
        text: "New idea or note...",
        color: "yellow",
      };
      setStickyNotes((prev) => [...prev, newSticky]);
      setSelectedItemIds([newSticky.id]);
      setSelectedTool("select");
      return;
    }

    // 3. Select Tool on empty space: start Marquee Selection Box
    if (selectedTool === "select") {
      setSelectedItemIds([]);
      setMarquee({ x1: x, y1: y, x2: x, y2: y });
      return;
    }

    // 4. Drawing & Shape Tools
    setIsDrawingMouseDown(true);
    setDragStart({ x, y });
    setCurrentMouse({ x, y });
    lastPointRef.current = { x, y };
    hasDrawnStrokeRef.current = false;
    preActionSnapshotRef.current = captureCurrentSnapshot();

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (selectedTool === "pen" || selectedTool === "highlighter" || selectedTool === "eraser") {
      ctx.beginPath();
      ctx.moveTo(x, y);

      if (selectedTool === "eraser") {
        ctx.globalCompositeOperation = "destination-out";
        ctx.lineWidth = strokeWidth * 8;
      } else if (selectedTool === "highlighter") {
        ctx.globalCompositeOperation = "source-over";
        ctx.strokeStyle = strokeColor + "40";
        ctx.lineWidth = strokeWidth * 4.5;
      } else {
        ctx.globalCompositeOperation = "source-over";
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = strokeWidth;
      }
    }
  };

  // Double-Click on empty canvas: quick-spawn text editor right at double-click point!
  const handleBoardDoubleClick = (e: React.MouseEvent) => {
    if (selectedTool !== "select" && selectedTool !== "text") return;
    const { x, y } = getBoardCoords(e);
    setActiveTextInput({ x, y, text: "", mode: "plain" });
  };

  // Start drag-to-connect from an element's connection port dot
  const handleStartConnection = (
    e: React.MouseEvent,
    sourceId: string,
    startX: number,
    startY: number
  ) => {
    e.stopPropagation();
    e.preventDefault();
    setConnectingState({ sourceId, startX, startY });
    setCurrentMouse({ x: startX, y: startY });
  };

  // Item Mouse Down: handles selection, multi-item dragging, or eraser deletion
  const handleItemMouseDown = (
    e: React.MouseEvent,
    id: string,
    type: "node" | "sticky" | "text" | "shape"
  ) => {
    if (e.button !== 0) return;
    e.stopPropagation();

    // Eraser Tool deletes the item immediately
    if (selectedTool === "eraser") {
      pushStateToHistory();
      if (type === "sticky") {
        setStickyNotes((prev) => prev.filter((item) => item.id !== id));
      } else if (type === "text") {
        setTextItems((prev) => prev.filter((item) => item.id !== id));
      } else if (type === "shape") {
        setShapes((prev) =>
          prev.filter((item) => item.id !== id && item.sourceId !== id && item.targetId !== id)
        );
      } else if (type === "node") {
        setBoardNodes((prev) => prev.filter((item) => item.id !== id));
        setShapes((prev) =>
          prev.filter((item) => item.sourceId !== id && item.targetId !== id)
        );
      }
      setSelectedItemIds([]);
      return;
    }

    // Text Tool clicked on an existing text item: edit it!
    if (selectedTool === "text" && type === "text") {
      const target = textItems.find((t) => t.id === id);
      if (target) {
        setActiveTextInput({
          id: target.id,
          x: target.x,
          y: target.y,
          text: target.text,
          mode: "plain",
        });
      }
      return;
    }

    // Text Tool clicked on a rectangle: edit rectangle text!
    if (selectedTool === "text" && type === "shape") {
      const target = shapes.find((t) => t.id === id);
      if (target && target.type === "rectangle") {
        setEditingShapeId(target.id);
        setEditingShapeText(target.text || "");
        return;
      }
    }

    // Select Tool: select & initiate drag
    if (selectedTool === "select") {
      const { x, y } = getBoardCoords(e);
      let targetIds = selectedItemIds;

      if (e.shiftKey) {
        targetIds = targetIds.includes(id)
          ? targetIds.filter((i) => i !== id)
          : [...targetIds, id];
        setSelectedItemIds(targetIds);
      } else if (!selectedItemIds.includes(id)) {
        targetIds = [id];
        setSelectedItemIds([id]);
      }

      const initialPositions: { id: string; x: number; y: number; x2?: number; y2?: number }[] = [];
      targetIds.forEach((targetId) => {
        const node = boardNodes.find((n) => n.id === targetId);
        if (node) initialPositions.push({ id: node.id, x: node.x, y: node.y });

        const sticky = stickyNotes.find((s) => s.id === targetId);
        if (sticky) initialPositions.push({ id: sticky.id, x: sticky.x, y: sticky.y });

        const text = textItems.find((t) => t.id === targetId);
        if (text) initialPositions.push({ id: text.id, x: text.x, y: text.y });

        const shape = shapes.find((sh) => sh.id === targetId);
        if (shape) initialPositions.push({ id: shape.id, x: shape.x1, y: shape.y1, x2: shape.x2, y2: shape.y2 });
      });

      preActionSnapshotRef.current = captureCurrentSnapshot();
      hasDraggedRef.current = false;
      setDraggedItems({
        ids: targetIds,
        startMouseX: x,
        startMouseY: y,
        initialPositions,
      });
    }
  };

  // Global Mouse Move: continuous drawing, marquee selection, or element dragging
  const handleGlobalMouseMove = useCallback(
    (e: MouseEvent) => {
      const { x, y } = getBoardCoords(e);

      // 1. Drag-to-connect arrow in progress
      if (connectingState) {
        setCurrentMouse({ x, y });

        // Detect if hovering over a connectable element (rectangle or node)
        let hoveredId: string | null = null;
        boardNodes.forEach((n) => {
          if (n.id !== connectingState.sourceId && x >= n.x && x <= n.x + n.width && y >= n.y && y <= n.y + 70) {
            hoveredId = n.id;
          }
        });
        shapes.forEach((sh) => {
          if (sh.id !== connectingState.sourceId && (sh.type === "rectangle" || sh.type === "circle")) {
            const minX = Math.min(sh.x1, sh.x2);
            const maxX = Math.max(sh.x1, sh.x2);
            const minY = Math.min(sh.y1, sh.y2);
            const maxY = Math.max(sh.y1, sh.y2);
            if (x >= minX && x <= maxX && y >= minY && y <= maxY) {
              hoveredId = sh.id;
            }
          }
        });
        setConnectTargetHoverId(hoveredId);
        return;
      }

      // 2. Marquee selection drag
      if (marquee) {
        setMarquee((prev) => (prev ? { ...prev, x2: x, y2: y } : null));

        const minX = Math.min(marquee.x1, x);
        const maxX = Math.max(marquee.x1, x);
        const minY = Math.min(marquee.y1, y);
        const maxY = Math.max(marquee.y1, y);

        const selected: string[] = [];
        boardNodes.forEach((n) => {
          if (n.x + n.width >= minX && n.x <= maxX && n.y + 60 >= minY && n.y <= maxY) {
            selected.push(n.id);
          }
        });
        stickyNotes.forEach((s) => {
          if (s.x + 210 >= minX && s.x <= maxX && s.y + 110 >= minY && s.y <= maxY) {
            selected.push(s.id);
          }
        });
        textItems.forEach((t) => {
          if (t.x + 100 >= minX && t.x <= maxX && t.y + 30 >= minY && t.y <= maxY) {
            selected.push(t.id);
          }
        });
        shapes.forEach((sh) => {
          const sMinX = Math.min(sh.x1, sh.x2);
          const sMaxX = Math.max(sh.x1, sh.x2);
          const sMinY = Math.min(sh.y1, sh.y2);
          const sMaxY = Math.max(sh.y1, sh.y2);
          if (sMaxX >= minX && sMinX <= maxX && sMaxY >= minY && sMinY <= maxY) {
            selected.push(sh.id);
          }
        });

        setSelectedItemIds(selected);
        return;
      }

      // 3. Element dragging in Select mode
      if (draggedItems) {
        hasDraggedRef.current = true;
        const dx = x - draggedItems.startMouseX;
        const dy = y - draggedItems.startMouseY;

        setBoardNodes((prev) =>
          prev.map((item) => {
            const init = draggedItems.initialPositions.find((p) => p.id === item.id);
            return init
              ? {
                  ...item,
                  x: Math.max(10, Math.min(BOARD_WIDTH - item.width, init.x + dx)),
                  y: Math.max(10, Math.min(BOARD_HEIGHT - 80, init.y + dy)),
                }
              : item;
          })
        );

        setStickyNotes((prev) =>
          prev.map((item) => {
            const init = draggedItems.initialPositions.find((p) => p.id === item.id);
            return init
              ? {
                  ...item,
                  x: Math.max(10, Math.min(BOARD_WIDTH - 220, init.x + dx)),
                  y: Math.max(10, Math.min(BOARD_HEIGHT - 120, init.y + dy)),
                }
              : item;
          })
        );

        setTextItems((prev) =>
          prev.map((item) => {
            const init = draggedItems.initialPositions.find((p) => p.id === item.id);
            return init
              ? {
                  ...item,
                  x: Math.max(10, Math.min(BOARD_WIDTH - 100, init.x + dx)),
                  y: Math.max(10, Math.min(BOARD_HEIGHT - 40, init.y + dy)),
                }
              : item;
          })
        );

        setShapes((prev) =>
          prev.map((item) => {
            const init = draggedItems.initialPositions.find((p) => p.id === item.id);
            if (!init) return item;
            const initX2 = init.x2 ?? (init.x + (item.x2 - item.x1));
            const initY2 = init.y2 ?? (init.y + (item.y2 - item.y1));
            return {
              ...item,
              x1: init.x + dx,
              y1: init.y + dy,
              x2: initX2 + dx,
              y2: initY2 + dy,
            };
          })
        );
        return;
      }

      // 4. Canvas drawing / shape preview
      if (!isDrawingMouseDown || !dragStart) return;
      setCurrentMouse({ x, y });

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      if (selectedTool === "pen" || selectedTool === "highlighter" || selectedTool === "eraser") {
        if (lastPointRef.current) {
          ctx.beginPath();
          ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
          ctx.lineTo(x, y);
          ctx.stroke();
          hasDrawnStrokeRef.current = true;
        }
        lastPointRef.current = { x, y };
      }
    },
    [connectingState, marquee, draggedItems, isDrawingMouseDown, dragStart, getBoardCoords, selectedTool, boardNodes, stickyNotes, textItems, shapes]
  );

  // Global Mouse Up: commit marquee, drag-to-connect, drags, shapes, or drawings
  const handleGlobalMouseUp = useCallback(() => {
    // 1. Complete Drag-to-Connect Arrow
    if (connectingState) {
      if (connectTargetHoverId && connectTargetHoverId !== connectingState.sourceId) {
        pushStateToHistory();
        idCounterRef.current += 1;
        const newConnector: ShapeItem = {
          id: `shape-${idCounterRef.current}`,
          type: "arrow",
          sourceId: connectingState.sourceId,
          targetId: connectTargetHoverId,
          x1: connectingState.startX,
          y1: connectingState.startY,
          x2: currentMouse?.x || connectingState.startX + 100,
          y2: currentMouse?.y || connectingState.startY,
          color: strokeColor,
          strokeWidth: 2,
        };
        setShapes((prev) => [...prev, newConnector]);
        setSelectedItemIds([newConnector.id]);
        setSelectedTool("select");
      }
      setConnectingState(null);
      setConnectTargetHoverId(null);
      return;
    }

    // 2. Finish Marquee selection
    if (marquee) {
      setMarquee(null);
    }

    // 3. Finish item dragging
    if (draggedItems) {
      if (hasDraggedRef.current && preActionSnapshotRef.current) {
        const snap = preActionSnapshotRef.current;
        setHistoryStack((prev) => [...prev.filter(Boolean).slice(-25), snap]);
        setRedoStack([]);
      }
      setDraggedItems(null);
      hasDraggedRef.current = false;
      preActionSnapshotRef.current = null;
    }

    // 4. Finish canvas drawing & shapes
    if (!isDrawingMouseDown) return;
    setIsDrawingMouseDown(false);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (selectedTool === "pen" || selectedTool === "highlighter" || selectedTool === "eraser") {
      ctx.closePath();
      if (hasDrawnStrokeRef.current && preActionSnapshotRef.current) {
        const snap = preActionSnapshotRef.current;
        setHistoryStack((prev) => [...prev.filter(Boolean).slice(-25), snap]);
        setRedoStack([]);
      }
    }

    // Commit vector shape (Rectangle, Circle, Arrow)
    if (dragStart && currentMouse) {
      const { x: x1, y: y1 } = dragStart;
      const { x: x2, y: y2 } = currentMouse;
      const dist = Math.hypot(x2 - x1, y2 - y1);

      if (dist > 8 && (selectedTool === "rectangle" || selectedTool === "circle" || selectedTool === "arrow")) {
        pushStateToHistory();
        idCounterRef.current += 1;
        const newShapeId = `shape-${idCounterRef.current}`;
        const isRectOrCircle = selectedTool === "rectangle" || selectedTool === "circle";
        const newShape: ShapeItem = {
          id: newShapeId,
          type: selectedTool,
          x1: isRectOrCircle ? Math.min(x1, x2) : x1,
          y1: isRectOrCircle ? Math.min(y1, y2) : y1,
          x2: isRectOrCircle ? Math.max(x1, x2) : x2,
          y2: isRectOrCircle ? Math.max(y1, y2) : y2,
          color: strokeColor,
          strokeWidth,
          text: "",
        };
        // Auto-save immediately into shapes state and history
        setShapes((prev) => [...prev, newShape]);
        setSelectedItemIds([]);
      }
    }

    setDragStart(null);
    setCurrentMouse(null);
    lastPointRef.current = null;
    hasDrawnStrokeRef.current = false;
    preActionSnapshotRef.current = null;
  }, [
    connectingState,
    connectTargetHoverId,
    marquee,
    draggedItems,
    isDrawingMouseDown,
    selectedTool,
    dragStart,
    currentMouse,
    strokeColor,
    strokeWidth,
    pushStateToHistory,
  ]);

  // Window listeners for smooth, uninterrupted mouse events
  useEffect(() => {
    window.addEventListener("mousemove", handleGlobalMouseMove);
    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleGlobalMouseMove);
      window.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [handleGlobalMouseMove, handleGlobalMouseUp]);

  const canUndo = historyStack.filter(Boolean).length > 0;
  const canRedo = redoStack.filter(Boolean).length > 0;

  // Undo Functionality
  const handleUndo = useCallback(() => {
    const validStack = historyStack.filter(Boolean);
    if (validStack.length === 0) {
      if (historyStack.length > 0) setHistoryStack([]);
      return;
    }

    const previousSnapshot = validStack[validStack.length - 1];
    setHistoryStack(validStack.slice(0, -1));

    if (!previousSnapshot) return;

    const currentSnapshot = captureCurrentSnapshot();
    setRedoStack((prev) => [...prev.filter(Boolean).slice(-25), currentSnapshot]);

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        if (previousSnapshot.canvasImageData) {
          try {
            ctx.putImageData(previousSnapshot.canvasImageData, 0, 0);
          } catch {
            ctx.clearRect(0, 0, BOARD_WIDTH, BOARD_HEIGHT);
          }
        } else {
          ctx.clearRect(0, 0, BOARD_WIDTH, BOARD_HEIGHT);
        }
      }
    }

    if (previousSnapshot.boardNodes) setBoardNodes(previousSnapshot.boardNodes);
    if (previousSnapshot.stickyNotes) setStickyNotes(previousSnapshot.stickyNotes);
    if (previousSnapshot.textItems) setTextItems(previousSnapshot.textItems);
    if (previousSnapshot.shapes) setShapes(previousSnapshot.shapes);
    setSelectedItemIds([]);
    setActiveTextInput(null);
    setEditingShapeId(null);
    setEditingNodeId(null);
  }, [historyStack, captureCurrentSnapshot]);

  // Redo Functionality
  const handleRedo = useCallback(() => {
    const validRedo = redoStack.filter(Boolean);
    if (validRedo.length === 0) {
      if (redoStack.length > 0) setRedoStack([]);
      return;
    }

    const nextSnapshot = validRedo[validRedo.length - 1];
    setRedoStack(validRedo.slice(0, -1));

    if (!nextSnapshot) return;

    const currentSnapshot = captureCurrentSnapshot();
    setHistoryStack((prev) => [...prev.filter(Boolean).slice(-25), currentSnapshot]);

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        if (nextSnapshot.canvasImageData) {
          try {
            ctx.putImageData(nextSnapshot.canvasImageData, 0, 0);
          } catch {
            ctx.clearRect(0, 0, BOARD_WIDTH, BOARD_HEIGHT);
          }
        } else {
          ctx.clearRect(0, 0, BOARD_WIDTH, BOARD_HEIGHT);
        }
      }
    }

    if (nextSnapshot.boardNodes) setBoardNodes(nextSnapshot.boardNodes);
    if (nextSnapshot.stickyNotes) setStickyNotes(nextSnapshot.stickyNotes);
    if (nextSnapshot.textItems) setTextItems(nextSnapshot.textItems);
    if (nextSnapshot.shapes) setShapes(nextSnapshot.shapes);
    setSelectedItemIds([]);
  }, [redoStack, captureCurrentSnapshot]);

  // Keyboard Shortcuts (Undo/Redo & Delete selected items)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isInputActive =
        activeEl && (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA");

      if (isInputActive) return;

      // Undo: Ctrl/Cmd + Z
      if ((e.metaKey || e.ctrlKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      }
      // Redo: Ctrl/Cmd + Y or Ctrl/Cmd + Shift + Z
      else if (
        (e.metaKey || e.ctrlKey) &&
        (e.key === "y" || (e.key === "z" && e.shiftKey))
      ) {
        e.preventDefault();
        handleRedo();
      }
      // Delete selected items with Delete or Backspace key
      else if ((e.key === "Delete" || e.key === "Backspace") && selectedItemIds.length > 0) {
        e.preventDefault();
        pushStateToHistory();
        setStickyNotes((prev) => prev.filter((s) => !selectedItemIds.includes(s.id)));
        setTextItems((prev) => prev.filter((t) => !selectedItemIds.includes(t.id)));
        setShapes((prev) =>
          prev.filter((sh) => !selectedItemIds.includes(sh.id))
        );
        setSelectedItemIds([]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleUndo, handleRedo, selectedItemIds, pushStateToHistory]);

  // Clear All
  const handleClearAll = () => {
    pushStateToHistory();
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.clearRect(0, 0, BOARD_WIDTH, BOARD_HEIGHT);
    }
    setStickyNotes([]);
    setTextItems([]);
    setShapes([]);
    setSelectedItemIds([]);
    setEditingShapeId(null);
    setEditingNodeId(null);
  };

  // Export / Download composite canvas snapshot
  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const exportCanvas = document.createElement("canvas");
    exportCanvas.width = BOARD_WIDTH;
    exportCanvas.height = BOARD_HEIGHT;
    const ctx = exportCanvas.getContext("2d");
    if (!ctx) return;

    // 1. Background fill
    ctx.fillStyle = "#fdfdfb";
    ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);

    // 2. Grid dots
    if (showGrid) {
      ctx.fillStyle = "#d1c7b7";
      for (let x = 12; x < exportCanvas.width; x += 24) {
        for (let y = 12; y < exportCanvas.height; y += 24) {
          ctx.beginPath();
          ctx.arc(x, y, 0.7, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // 3. Title
    ctx.fillStyle = "#7c3aed";
    ctx.font = "bold 22px Outfit, sans-serif";
    ctx.fillText("URL Shortener — Initial Thoughts", 40, 50);

    // 4. Draw freehand drawing
    ctx.drawImage(canvas, 0, 0);

    // 5. Draw Board Nodes (Requirements & Architecture Boxes)
    boardNodes.forEach((n) => {
      ctx.save();
      const bounds = getElementBounds(n.id);
      if (bounds) {
        ctx.fillStyle = n.bgColor;
        ctx.strokeStyle = n.borderColor;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        if (typeof ctx.roundRect === "function") {
          ctx.roundRect(bounds.x, bounds.y, bounds.width, bounds.height, 10);
        } else {
          ctx.rect(bounds.x, bounds.y, bounds.width, bounds.height);
        }
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = n.textColor;
        ctx.font = "bold 13px Geist, sans-serif";
        ctx.fillText(n.title, bounds.x + 14, bounds.y + 24);

        if (n.subtitle) {
          ctx.font = "11px Geist, sans-serif";
          ctx.fillStyle = "#4a4642";
          const lines = n.subtitle.split("\n");
          lines.forEach((l, i) => {
            ctx.fillText(l, bounds.x + 14, bounds.y + 45 + i * 16);
          });
        }
      }
      ctx.restore();
    });

    // 6. Draw Shapes & Connected Arrows
    shapes.forEach((sh) => {
      ctx.save();
      ctx.strokeStyle = sh.color;
      ctx.lineWidth = sh.strokeWidth;

      if (sh.type === "rectangle") {
        ctx.fillStyle = sh.color + "15";
        const rx = Math.min(sh.x1, sh.x2);
        const ry = Math.min(sh.y1, sh.y2);
        const rw = Math.abs(sh.x2 - sh.x1);
        const rh = Math.abs(sh.y2 - sh.y1);
        ctx.beginPath();
        if (typeof ctx.roundRect === "function") {
          ctx.roundRect(rx, ry, rw, rh, 8);
        } else {
          ctx.rect(rx, ry, rw, rh);
        }
        ctx.fill();
        ctx.stroke();

        if (sh.text) {
          ctx.fillStyle = sh.color;
          ctx.font = "bold 14px Geist, sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(sh.text, rx + rw / 2, ry + rh / 2);
        }
      } else if (sh.type === "circle") {
        ctx.fillStyle = sh.color + "15";
        const cx = (sh.x1 + sh.x2) / 2;
        const cy = (sh.y1 + sh.y2) / 2;
        const rx = Math.abs(sh.x2 - sh.x1) / 2;
        const ry = Math.abs(sh.y2 - sh.y1) / 2;
        ctx.beginPath();
        ctx.ellipse(cx, cy, Math.max(1, rx), Math.max(1, ry), 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      } else if (sh.type === "arrow") {
        let fromX = sh.x1;
        let fromY = sh.y1;
        let toX = sh.x2;
        let toY = sh.y2;

        if (sh.sourceId && sh.targetId) {
          const endpoints = getConnectedEndpoints(sh.sourceId, sh.targetId);
          if (endpoints) {
            fromX = endpoints.from.x;
            fromY = endpoints.from.y;
            toX = endpoints.to.x;
            toY = endpoints.to.y;
          }
        }

        const headlen = Math.max(12, sh.strokeWidth * 3.5);
        const angle = Math.atan2(toY - fromY, toX - fromX);

        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        ctx.stroke();

        ctx.fillStyle = sh.color;
        ctx.beginPath();
        ctx.moveTo(toX, toY);
        ctx.lineTo(
          toX - headlen * Math.cos(angle - Math.PI / 6),
          toY - headlen * Math.sin(angle - Math.PI / 6)
        );
        ctx.lineTo(
          toX - headlen * Math.cos(angle + Math.PI / 6),
          toY - headlen * Math.sin(angle + Math.PI / 6)
        );
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
    });

    // 7. Draw custom text items
    textItems.forEach((t) => {
      ctx.fillStyle = t.color;
      ctx.font = `bold ${t.fontSize}px Geist, sans-serif`;
      ctx.fillText(t.text, t.x, t.y + t.fontSize);
    });

    // 8. Draw sticky notes
    stickyNotes.forEach((s) => {
      ctx.fillStyle =
        s.color === "yellow"
          ? "#fef9c3"
          : s.color === "purple"
          ? "#f5f3ff"
          : s.color === "cyan"
          ? "#ecfeff"
          : s.color === "emerald"
          ? "#ecfdf5"
          : "#fff1f2";
      ctx.strokeStyle = "#e2e8f0";
      ctx.lineWidth = 1;
      ctx.beginPath();
      if (typeof ctx.roundRect === "function") {
        ctx.roundRect(s.x, s.y, 200, 110, 8);
      } else {
        ctx.rect(s.x, s.y, 200, 110);
      }
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#1e1c1a";
      ctx.font = "11px Geist, sans-serif";
      const lines = s.text.split("\n");
      lines.forEach((l, i) => {
        ctx.fillText(l, s.x + 12, s.y + 24 + i * 16);
      });
    });

    // 9. Trigger download
    const link = document.createElement("a");
    link.download = "system-design-whiteboard.png";
    link.href = exportCanvas.toDataURL("image/png");
    link.click();
  };

  // Cursor style
  const getCursorClass = () => {
    switch (selectedTool) {
      case "select":
        return "cursor-default";
      case "text":
        return "cursor-text";
      case "sticky":
        return "cursor-copy";
      case "eraser":
        return "cursor-pointer";
      case "pen":
      case "highlighter":
      case "rectangle":
      case "circle":
      case "arrow":
      default:
        return "cursor-crosshair";
    }
  };

  return (
    <div className="flex w-full flex-col overflow-hidden rounded-[24px] border border-[#ede6db] bg-white shadow-[0_8px_30px_rgba(30,28,26,0.06)]">
      {/* 1. Whiteboard Header */}
      <div className="flex flex-col gap-3 border-b border-[#f4efe8] bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
        {/* Title, Saved Badge & Subtitle */}
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
            Think, sketch and calculate your ideas. This is your personal working space.
          </p>
        </div>

        {/* Action Controls: Undo, Redo, Download, Clear All, Close */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          {/* Header Undo */}
          <button
            type="button"
            onClick={handleUndo}
            disabled={!canUndo}
            className="flex h-8 items-center gap-1 rounded-full border border-[#ede6db] bg-[#fbf9f4] px-2.5 text-xs font-semibold text-ink shadow-xs transition-colors hover:bg-[#ede6db] disabled:pointer-events-none disabled:opacity-40"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="size-3.5" />
            <span className="hidden md:inline">Undo</span>
          </button>

          {/* Header Redo */}
          <button
            type="button"
            onClick={handleRedo}
            disabled={!canRedo}
            className="flex h-8 items-center gap-1 rounded-full border border-[#ede6db] bg-[#fbf9f4] px-2.5 text-xs font-semibold text-ink shadow-xs transition-colors hover:bg-[#ede6db] disabled:pointer-events-none disabled:opacity-40"
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="size-3.5" />
            <span className="hidden md:inline">Redo</span>
          </button>

          <span className="hidden sm:block h-4 w-px bg-[#ede6db] mx-0.5" />

          {/* Download */}
          <button
            type="button"
            onClick={handleDownload}
            className="flex h-8 items-center gap-1.5 rounded-full border border-[#ede6db] bg-[#fbf9f4] px-3.5 text-xs font-semibold text-ink shadow-xs transition-colors hover:bg-[#ede6db]"
          >
            <Download className="size-3.5 text-ink-muted" />
            <span>Download</span>
          </button>

          {/* Clear All */}
          <button
            type="button"
            onClick={handleClearAll}
            className="flex h-8 items-center gap-1.5 rounded-full border border-red-500 bg-white px-3.5 text-xs font-semibold text-red-500 shadow-xs transition-colors hover:bg-red-50"
          >
            <Trash2 className="size-3.5 text-red-500" />
            <span>Clear All</span>
          </button>

          {/* Close Modal */}
          <button
            type="button"
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-full border border-[#ede6db] bg-[#fbf9f4] text-ink shadow-xs transition-colors hover:bg-[#ede6db]"
            aria-label="Close whiteboard"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>

      {/* 2. Workspace Body: Left Toolbar + Canvas Area */}
      <div className="relative flex min-h-[620px] w-full flex-col sm:flex-row">
        {/* Left Toolbar */}
        <div className="flex w-full sm:w-[104px] shrink-0 flex-row sm:flex-col items-center justify-between sm:justify-start gap-1 sm:gap-2 border-b sm:border-b-0 sm:border-r border-[#f4efe8] bg-[#fbf9f4] p-2.5 overflow-x-auto sm:overflow-y-auto z-40">
          {/* 9 Interactive Tools */}
          <div className="flex sm:flex-col gap-1 w-full">
            {[
              { id: "select", label: "Select", icon: MousePointer },
              { id: "pen", label: "Pen", icon: Pencil },
              { id: "highlighter", label: "Highlighter", icon: Highlighter },
              { id: "text", label: "Text", icon: Type },
              { id: "rectangle", label: "Rectangle", icon: Square },
              { id: "circle", label: "Circle", icon: Circle },
              { id: "arrow", label: "Arrow", icon: ArrowUpRight },
              { id: "sticky", label: "Sticky Note", icon: StickyIcon },
              { id: "eraser", label: "Eraser", icon: Eraser },
            ].map((tool) => {
              const Icon = tool.icon;
              const isActive = selectedTool === tool.id;
              return (
                <button
                  key={tool.id}
                  type="button"
                  onClick={() => {
                    if (activeTextInput) commitTextInput();
                    if (editingShapeId) commitShapeText();
                    if (editingNodeId) commitNodeEdit();
                    setSelectedTool(tool.id as ToolType);
                  }}
                  className={`flex sm:w-full flex-col items-center justify-center gap-1 rounded-xl p-2 text-[11px] font-medium transition-all ${
                    isActive
                      ? "border border-brand bg-white text-brand shadow-xs font-semibold ring-1 ring-brand/30"
                      : "text-ink-muted hover:bg-white/60 hover:text-ink"
                  }`}
                  title={tool.label}
                >
                  <Icon className="size-4" />
                  <span className="text-[10px] leading-none">{tool.label}</span>
                </button>
              );
            })}
          </div>

          <hr className="hidden sm:block w-full border-[#ede6db] my-1" />

          {/* Stroke Palette & Size Selector */}
          <div className="hidden sm:flex flex-col items-center gap-2 w-full pt-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted">
              Stroke
            </span>

            {/* Color Swatches */}
            <div className="grid grid-cols-3 gap-1.5">
              {STROKE_COLORS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    setStrokeColor(c.value);
                    if (selectedItemIds.length > 0) {
                      setTextItems((prev) =>
                        prev.map((t) =>
                          selectedItemIds.includes(t.id) ? { ...t, color: c.value } : t
                        )
                      );
                      setShapes((prev) =>
                        prev.map((sh) =>
                          selectedItemIds.includes(sh.id) ? { ...sh, color: c.value } : sh
                        )
                      );
                    }
                  }}
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

            {/* Thickness Buttons */}
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
                  title={`${w}px`}
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

        {/* Scrollable Canvas Viewport */}
        <div
          ref={scrollContainerRef}
          className="relative flex-1 overflow-auto bg-[#fdfdfb]"
        >
          {/* Scaled Board Workspace (1500 x 920) */}
          <div
            ref={boardRef}
            onDoubleClick={handleBoardDoubleClick}
            style={{
              width: `${BOARD_WIDTH}px`,
              height: `${BOARD_HEIGHT}px`,
              transform: `scale(${zoomLevel / 100})`,
              transformOrigin: "top left",
              backgroundImage: showGrid
                ? "radial-gradient(#d1c7b7 1.2px, transparent 1.2px)"
                : "none",
              backgroundSize: "24px 24px",
            }}
            className="relative shrink-0 p-8 select-none"
          >
            {/* Title Header on Canvas */}
            <div className="absolute left-10 top-8 z-10 select-none">
              <h2 className="font-display text-2xl font-extrabold text-[#7c3aed]">
                URL Shortener — Initial Thoughts
              </h2>
              <div className="h-0.5 w-full bg-[#7c3aed] mt-1" />
            </div>

            {/* 1. Architecture Flow Connector Lines (Static background guidelines) */}
            <svg
              width={BOARD_WIDTH}
              height={BOARD_HEIGHT}
              className="absolute inset-0 pointer-events-none z-10"
            >
              <line x1="680" y1="160" x2="680" y2="195" stroke="#d1c7b7" strokeWidth="2" strokeDasharray="3 3" />
              <line x1="680" y1="245" x2="680" y2="295" stroke="#d1c7b7" strokeWidth="2" strokeDasharray="3 3" />
              <line x1="680" y1="345" x2="680" y2="395" stroke="#d1c7b7" strokeWidth="2" strokeDasharray="3 3" />
              <line x1="680" y1="445" x2="520" y2="515" stroke="#d1c7b7" strokeWidth="2" strokeDasharray="3 3" />
              <line x1="680" y1="445" x2="680" y2="515" stroke="#d1c7b7" strokeWidth="2" strokeDasharray="3 3" />
              <line x1="680" y1="445" x2="845" y2="515" stroke="#d1c7b7" strokeWidth="2" strokeDasharray="3 3" />
            </svg>

            {/* 2. Interactive Architecture & Note Nodes (Selectable, Movable, Connectable, Double-click Editable) */}
            {boardNodes.map((node) => {
              const isSelected = selectedItemIds.includes(node.id);
              const isHovered = hoveredElementId === node.id || isSelected;
              const isConnectTarget = connectTargetHoverId === node.id;
              const bounds = getElementBounds(node.id);

              return (
                <div
                  key={node.id}
                  onMouseEnter={() => setHoveredElementId(node.id)}
                  onMouseLeave={() => setHoveredElementId(null)}
                  onMouseDown={(e) => handleItemMouseDown(e, node.id, "node")}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    setEditingNodeId(node.id);
                    setEditingNodeData({
                      title: node.title,
                      subtitle: node.subtitle || "",
                    });
                  }}
                  className={`absolute z-20 transition-shadow select-none group ${
                    node.type === "note-box"
                      ? "rounded-2xl border p-4 shadow-2xs bg-white"
                      : "rounded-xl border p-3 text-center shadow-2xs"
                  } ${
                    isConnectTarget
                      ? "ring-4 ring-brand ring-offset-2 scale-[1.02]"
                      : isSelected
                      ? "ring-2 ring-brand shadow-md"
                      : selectedTool === "eraser"
                      ? "hover:opacity-75 hover:ring-2 hover:ring-red-400"
                      : ""
                  } ${selectedTool === "select" ? "cursor-move" : ""}`}
                  style={{
                    left: `${node.x}px`,
                    top: `${node.y}px`,
                    width: `${node.width}px`,
                    borderColor: isSelected ? "#7c3aed" : node.borderColor,
                    backgroundColor: node.bgColor,
                    color: node.textColor,
                    pointerEvents:
                      selectedTool === "select" || selectedTool === "eraser"
                        ? "auto"
                        : "none",
                  }}
                  title="Double-click to edit card"
                >
                  {/* Connection Handles (Excalidraw / React Flow style 4 ports) */}
                  {(isHovered || isSelected) && selectedTool === "select" && bounds && (
                    <>
                      {/* Top Port */}
                      <button
                        type="button"
                        onMouseDown={(e) => handleStartConnection(e, node.id, bounds.cx, bounds.y)}
                        className="absolute -top-2 left-1/2 -translate-x-1/2 size-3.5 rounded-full bg-brand border-2 border-white shadow-md hover:scale-125 cursor-crosshair z-30"
                        title="Drag to connect arrow"
                      />
                      {/* Right Port */}
                      <button
                        type="button"
                        onMouseDown={(e) => handleStartConnection(e, node.id, bounds.x + bounds.width, bounds.cy)}
                        className="absolute top-1/2 -right-2 -translate-y-1/2 size-3.5 rounded-full bg-brand border-2 border-white shadow-md hover:scale-125 cursor-crosshair z-30"
                        title="Drag to connect arrow"
                      />
                      {/* Bottom Port */}
                      <button
                        type="button"
                        onMouseDown={(e) => handleStartConnection(e, node.id, bounds.cx, bounds.y + bounds.height)}
                        className="absolute -bottom-2 left-1/2 -translate-x-1/2 size-3.5 rounded-full bg-brand border-2 border-white shadow-md hover:scale-125 cursor-crosshair z-30"
                        title="Drag to connect arrow"
                      />
                      {/* Left Port */}
                      <button
                        type="button"
                        onMouseDown={(e) => handleStartConnection(e, node.id, bounds.x, bounds.cy)}
                        className="absolute top-1/2 -left-2 -translate-y-1/2 size-3.5 rounded-full bg-brand border-2 border-white shadow-md hover:scale-125 cursor-crosshair z-30"
                        title="Drag to connect arrow"
                      />
                    </>
                  )}

                  {node.type === "note-box" ? (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="font-display text-xs font-bold uppercase tracking-wider text-ink">
                          {node.title}
                        </span>
                        <span className="text-[10px] text-ink-muted opacity-0 group-hover:opacity-100 transition-opacity">
                          ✎ double-click to edit
                        </span>
                      </div>
                      <p className="whitespace-pre-line text-xs leading-relaxed text-ink/90 font-sans">
                        {node.subtitle}
                      </p>
                    </div>
                  ) : (
                    <div className="relative flex flex-col items-center justify-center">
                      <span className="text-xs font-bold">{node.title}</span>
                      {node.annotation && (
                        <div
                          className={`absolute text-[11px] font-medium leading-snug whitespace-pre-line ${
                            node.isBottleneck
                              ? "-left-28 top-0.5 text-right font-bold text-blue-600"
                              : "-right-48 top-0 text-left text-emerald-700 italic"
                          }`}
                        >
                          {node.annotation}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {/* 3. Interactive Vector Shapes & Connected Arrows (Excalidraw style) */}
            <svg
              width={BOARD_WIDTH}
              height={BOARD_HEIGHT}
              className="absolute inset-0 z-20 pointer-events-none"
            >
              {shapes.map((sh) => {
                const isSelected = selectedItemIds.includes(sh.id);
                const isConnectTarget = connectTargetHoverId === sh.id;
                const rx = Math.min(sh.x1, sh.x2);
                const ry = Math.min(sh.y1, sh.y2);
                const rw = Math.max(20, Math.abs(sh.x2 - sh.x1));
                const rh = Math.max(20, Math.abs(sh.y2 - sh.y1));
                const cx = rx + rw / 2;
                const cy = ry + rh / 2;

                return (
                  <g
                    key={sh.id}
                    onMouseEnter={() => setHoveredElementId(sh.id)}
                    onMouseLeave={() => setHoveredElementId(null)}
                    onMouseDown={(e) => handleItemMouseDown(e as unknown as React.MouseEvent, sh.id, "shape")}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      if (sh.type === "rectangle") {
                        setEditingShapeId(sh.id);
                        setEditingShapeText(sh.text || "");
                      }
                    }}
                    className={
                      selectedTool === "select" || selectedTool === "eraser" || selectedTool === "text"
                        ? "pointer-events-auto cursor-pointer"
                        : "pointer-events-none"
                    }
                  >
                    {/* Rectangle Shape */}
                    {sh.type === "rectangle" && (
                      <>
                        <rect
                          x={rx}
                          y={ry}
                          width={rw}
                          height={rh}
                          fill={sh.color + "15"}
                          stroke={isConnectTarget ? "#7c3aed" : isSelected ? "#7c3aed" : sh.color}
                          strokeWidth={isConnectTarget || isSelected ? sh.strokeWidth + 2 : sh.strokeWidth}
                          rx="8"
                        />
                        {/* Centered Text inside Rectangle */}
                        {sh.text && editingShapeId !== sh.id && (
                          <text
                            x={cx}
                            y={cy}
                            textAnchor="middle"
                            dominantBaseline="central"
                            fill={sh.color}
                            fontSize="14"
                            fontWeight="600"
                            className="select-none font-sans"
                          >
                            {sh.text}
                          </text>
                        )}
                        {!sh.text && isSelected && editingShapeId !== sh.id && (
                          <text
                            x={cx}
                            y={cy}
                            textAnchor="middle"
                            dominantBaseline="central"
                            fill="#9ca3af"
                            fontSize="11"
                            className="select-none italic"
                          >
                            double-click to add text
                          </text>
                        )}
                      </>
                    )}

                    {/* Circle Shape */}
                    {sh.type === "circle" && (
                      <ellipse
                        cx={cx}
                        cy={cy}
                        rx={rw / 2}
                        ry={rh / 2}
                        fill={sh.color + "15"}
                        stroke={isSelected ? "#7c3aed" : sh.color}
                        strokeWidth={isSelected ? sh.strokeWidth + 2 : sh.strokeWidth}
                      />
                    )}

                    {/* Arrow / Connected Arrow */}
                    {sh.type === "arrow" && (() => {
                      let fromX = sh.x1;
                      let fromY = sh.y1;
                      let toX = sh.x2;
                      let toY = sh.y2;

                      // Dynamically calculate endpoints if connected between two nodes/rectangles
                      if (sh.sourceId && sh.targetId) {
                        const endpoints = getConnectedEndpoints(sh.sourceId, sh.targetId);
                        if (endpoints) {
                          fromX = endpoints.from.x;
                          fromY = endpoints.from.y;
                          toX = endpoints.to.x;
                          toY = endpoints.to.y;
                        }
                      }

                      const dx = toX - fromX;
                      const dy = toY - fromY;
                      const angle = Math.atan2(dy, dx);
                      const headlen = Math.max(12, sh.strokeWidth * 3.5);
                      const p1 = `${toX},${toY}`;
                      const p2 = `${toX - headlen * Math.cos(angle - Math.PI / 6)},${toY - headlen * Math.sin(angle - Math.PI / 6)}`;
                      const p3 = `${toX - headlen * Math.cos(angle + Math.PI / 6)},${toY - headlen * Math.sin(angle + Math.PI / 6)}`;

                      return (
                        <g>
                          <line
                            x1={fromX}
                            y1={fromY}
                            x2={toX}
                            y2={toY}
                            stroke={isSelected ? "#7c3aed" : sh.color}
                            strokeWidth={isSelected ? sh.strokeWidth + 2 : sh.strokeWidth}
                          />
                          <polygon
                            points={`${p1} ${p2} ${p3}`}
                            fill={isSelected ? "#7c3aed" : sh.color}
                          />
                        </g>
                      );
                    })()}
                  </g>
                );
              })}

              {/* Dynamic Connecting Arrow Preview (while dragging connection port) */}
              {connectingState && currentMouse && (() => {
                const { startX, startY } = connectingState;
                const toX = currentMouse.x;
                const toY = currentMouse.y;
                const dx = toX - startX;
                const dy = toY - startY;
                const angle = Math.atan2(dy, dx);
                const headlen = 14;
                const p1 = `${toX},${toY}`;
                const p2 = `${toX - headlen * Math.cos(angle - Math.PI / 6)},${toY - headlen * Math.sin(angle - Math.PI / 6)}`;
                const p3 = `${toX - headlen * Math.cos(angle + Math.PI / 6)},${toY - headlen * Math.sin(angle + Math.PI / 6)}`;

                return (
                  <g className="pointer-events-none">
                    <line
                      x1={startX}
                      y1={startY}
                      x2={toX}
                      y2={toY}
                      stroke={strokeColor}
                      strokeWidth={2.5}
                      strokeDasharray="4 4"
                    />
                    <polygon points={`${p1} ${p2} ${p3}`} fill={strokeColor} />
                  </g>
                );
              })()}
            </svg>

            {/* Excalidraw-Style Connection Ports for Rectangles (visible on hover / select) */}
            {selectedTool === "select" &&
              shapes
                .filter((sh) => sh.type === "rectangle" && (hoveredElementId === sh.id || selectedItemIds.includes(sh.id)))
                .map((sh) => {
                  const bounds = getElementBounds(sh.id);
                  if (!bounds) return null;
                  return (
                    <div key={`ports-${sh.id}`} className="absolute pointer-events-none z-30 inset-0">
                      {/* Top Port */}
                      <button
                        type="button"
                        onMouseDown={(e) => handleStartConnection(e, sh.id, bounds.cx, bounds.y)}
                        className="absolute size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand border-2 border-white shadow-md hover:scale-125 cursor-crosshair pointer-events-auto"
                        style={{ left: `${bounds.cx}px`, top: `${bounds.y}px` }}
                        title="Drag to connect arrow"
                      />
                      {/* Right Port */}
                      <button
                        type="button"
                        onMouseDown={(e) => handleStartConnection(e, sh.id, bounds.x + bounds.width, bounds.cy)}
                        className="absolute size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand border-2 border-white shadow-md hover:scale-125 cursor-crosshair pointer-events-auto"
                        style={{ left: `${bounds.x + bounds.width}px`, top: `${bounds.cy}px` }}
                        title="Drag to connect arrow"
                      />
                      {/* Bottom Port */}
                      <button
                        type="button"
                        onMouseDown={(e) => handleStartConnection(e, sh.id, bounds.cx, bounds.y + bounds.height)}
                        className="absolute size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand border-2 border-white shadow-md hover:scale-125 cursor-crosshair pointer-events-auto"
                        style={{ left: `${bounds.cx}px`, top: `${bounds.y + bounds.height}px` }}
                        title="Drag to connect arrow"
                      />
                      {/* Left Port */}
                      <button
                        type="button"
                        onMouseDown={(e) => handleStartConnection(e, sh.id, bounds.x, bounds.cy)}
                        className="absolute size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand border-2 border-white shadow-md hover:scale-125 cursor-crosshair pointer-events-auto"
                        style={{ left: `${bounds.x}px`, top: `${bounds.cy}px` }}
                        title="Drag to connect arrow"
                      />
                    </div>
                  );
                })}

            {/* 4. HTML5 Drawing Canvas Layer (Pen, Highlighter, Eraser) */}
            <canvas
              ref={canvasRef}
              width={BOARD_WIDTH}
              height={BOARD_HEIGHT}
              style={{
                width: `${BOARD_WIDTH}px`,
                height: `${BOARD_HEIGHT}px`,
                pointerEvents: selectedTool === "select" ? "none" : "auto",
              }}
              onMouseDown={handleCanvasMouseDown}
              className={`absolute inset-0 z-20 ${getCursorClass()}`}
            />

            {/* 5. Live Shape Preview Overlay (while dragging Rectangle/Circle/Arrow) */}
            {isDrawingMouseDown && dragStart && currentMouse && (
              <svg
                width={BOARD_WIDTH}
                height={BOARD_HEIGHT}
                style={{ width: `${BOARD_WIDTH}px`, height: `${BOARD_HEIGHT}px` }}
                className="absolute inset-0 pointer-events-none z-30"
              >
                {selectedTool === "rectangle" && (
                  <rect
                    x={Math.min(dragStart.x, currentMouse.x)}
                    y={Math.min(dragStart.y, currentMouse.y)}
                    width={Math.abs(currentMouse.x - dragStart.x)}
                    height={Math.abs(currentMouse.y - dragStart.y)}
                    fill={strokeColor + "20"}
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    rx="8"
                  />
                )}
                {selectedTool === "circle" && (
                  <ellipse
                    cx={(dragStart.x + currentMouse.x) / 2}
                    cy={(dragStart.y + currentMouse.y) / 2}
                    rx={Math.abs(currentMouse.x - dragStart.x) / 2}
                    ry={Math.abs(currentMouse.y - dragStart.y) / 2}
                    fill={strokeColor + "20"}
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                  />
                )}
                {selectedTool === "arrow" && (() => {
                  const dx = currentMouse.x - dragStart.x;
                  const dy = currentMouse.y - dragStart.y;
                  const angle = Math.atan2(dy, dx);
                  const headlen = Math.max(12, strokeWidth * 3.5);
                  const p1 = `${currentMouse.x},${currentMouse.y}`;
                  const p2 = `${currentMouse.x - headlen * Math.cos(angle - Math.PI / 6)},${currentMouse.y - headlen * Math.sin(angle - Math.PI / 6)}`;
                  const p3 = `${currentMouse.x - headlen * Math.cos(angle + Math.PI / 6)},${currentMouse.y - headlen * Math.sin(angle + Math.PI / 6)}`;
                  return (
                    <g>
                      <line
                        x1={dragStart.x}
                        y1={dragStart.y}
                        x2={currentMouse.x}
                        y2={currentMouse.y}
                        stroke={strokeColor}
                        strokeWidth={strokeWidth}
                      />
                      <polygon points={`${p1} ${p2} ${p3}`} fill={strokeColor} />
                    </g>
                  );
                })()}
              </svg>
            )}

            {/* 6. Marquee Selection Box */}
            {marquee && (
              <div
                className="absolute z-40 border-2 border-brand/80 bg-brand/10 pointer-events-none rounded"
                style={{
                  left: `${Math.min(marquee.x1, marquee.x2)}px`,
                  top: `${Math.min(marquee.y1, marquee.y2)}px`,
                  width: `${Math.abs(marquee.x2 - marquee.x1)}px`,
                  height: `${Math.abs(marquee.y2 - marquee.y1)}px`,
                }}
              />
            )}

            {/* 7. Excalidraw-Style Centered Inline Textarea inside Rectangle */}
            {editingShapeId && (() => {
              const bounds = getElementBounds(editingShapeId);
              if (!bounds) return null;
              const activeShape = shapes.find((s) => s.id === editingShapeId);
              return (
                <div
                  className="absolute z-50 flex items-center justify-center pointer-events-auto"
                  style={{
                    left: `${bounds.x}px`,
                    top: `${bounds.y}px`,
                    width: `${bounds.width}px`,
                    height: `${bounds.height}px`,
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <textarea
                    autoFocus
                    value={editingShapeText}
                    onChange={(e) => {
                      const val = e.target.value;
                      setEditingShapeText(val);
                      setShapes((prev) =>
                        prev.map((s) => (s.id === editingShapeId ? { ...s, text: val } : s))
                      );
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        commitShapeText();
                      }
                      if (e.key === "Escape") {
                        setEditingShapeId(null);
                      }
                    }}
                    onBlur={commitShapeText}
                    placeholder="Type text in rectangle..."
                    className="w-4/5 text-center resize-none bg-transparent font-sans text-sm font-semibold outline-none leading-tight border-b-2 border-brand"
                    style={{ color: activeShape?.color || strokeColor }}
                    rows={2}
                  />
                </div>
              );
            })()}

            {/* 8. Editing Board Node Card (Requirements / Back of the Envelope in-place) */}
            {editingNodeId && (() => {
              const node = boardNodes.find((n) => n.id === editingNodeId);
              if (!node) return null;
              return (
                <div
                  className="absolute z-50 flex flex-col gap-2 rounded-2xl border-2 border-brand bg-white p-4 shadow-2xl pointer-events-auto"
                  style={{
                    left: `${node.x}px`,
                    top: `${node.y}px`,
                    width: `${node.width}px`,
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="text"
                    value={editingNodeData.title}
                    onChange={(e) =>
                      setEditingNodeData((prev) => ({ ...prev, title: e.target.value }))
                    }
                    placeholder="CARD TITLE"
                    className="w-full font-display text-xs font-bold uppercase tracking-wider outline-none text-ink border-b pb-1"
                  />
                  <textarea
                    autoFocus
                    value={editingNodeData.subtitle}
                    onChange={(e) =>
                      setEditingNodeData((prev) => ({ ...prev, subtitle: e.target.value }))
                    }
                    rows={5}
                    placeholder="• Add requirement or calculation..."
                    className="w-full resize-none font-sans text-xs leading-relaxed text-ink/90 outline-none"
                  />
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-ink-muted">Enter lines with •</span>
                    <button
                      type="button"
                      onClick={commitNodeEdit}
                      className="flex items-center gap-1 rounded-full bg-brand px-3 py-1 text-xs font-bold text-white hover:opacity-90"
                    >
                      <Check className="size-3.5" />
                      <span>Save Card</span>
                    </button>
                  </div>
                </div>
              );
            })()}

            {/* 9. Simple Inline Text & Note Card Creator */}
            {activeTextInput && (
              <div
                className="absolute z-50 flex flex-col gap-2 rounded-xl border-2 border-brand bg-white p-3 shadow-xl pointer-events-auto"
                style={{
                  left: `${activeTextInput.x}px`,
                  top: `${activeTextInput.y}px`,
                  minWidth: activeTextInput.mode === "card" ? "340px" : "220px",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Mode Selector: Plain Text vs Requirements-style Note Card */}
                <div className="flex items-center justify-between border-b pb-1.5 text-[11px]">
                  <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
                    <button
                      type="button"
                      onClick={() =>
                        setActiveTextInput((prev) => (prev ? { ...prev, mode: "plain" } : null))
                      }
                      className={`px-2 py-0.5 rounded font-medium transition-colors ${
                        activeTextInput.mode === "plain"
                          ? "bg-white shadow-xs font-bold text-ink"
                          : "text-ink-muted hover:text-ink"
                      }`}
                    >
                      <Type className="size-3 inline mr-1" />
                      Text
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setActiveTextInput((prev) => (prev ? { ...prev, mode: "card" } : null))
                      }
                      className={`px-2 py-0.5 rounded font-medium transition-colors ${
                        activeTextInput.mode === "card"
                          ? "bg-white shadow-xs font-bold text-ink"
                          : "text-ink-muted hover:text-ink"
                      }`}
                    >
                      <FileText className="size-3 inline mr-1" />
                      Note Card
                    </button>
                  </div>

                  <span className="text-[10px] text-ink-muted">Enter ↵ to save</span>
                </div>

                {/* Card Title (only if in Note Card mode) */}
                {activeTextInput.mode === "card" && (
                  <input
                    type="text"
                    value={activeTextInput.title || ""}
                    onChange={(e) =>
                      setActiveTextInput((prev) =>
                        prev ? { ...prev, title: e.target.value } : null
                      )
                    }
                    placeholder="CARD TITLE (e.g. REQUIREMENTS)"
                    className="w-full font-display text-xs font-bold uppercase tracking-wider text-ink outline-none border-b pb-1"
                  />
                )}

                {/* Text Content */}
                <textarea
                  ref={textInputRef}
                  value={activeTextInput.text}
                  onChange={(e) =>
                    setActiveTextInput((prev) =>
                      prev ? { ...prev, text: e.target.value } : null
                    )
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey && activeTextInput.mode === "plain") {
                      e.preventDefault();
                      commitTextInput();
                    }
                    if (e.key === "Escape") {
                      setActiveTextInput(null);
                    }
                  }}
                  placeholder={
                    activeTextInput.mode === "card"
                      ? "• 100M URLs per day\n• Low latency\n• Cache hot 20%..."
                      : "Type text here..."
                  }
                  rows={activeTextInput.mode === "card" ? 4 : 2}
                  className="w-full resize-none bg-transparent font-sans text-sm font-semibold outline-none leading-normal"
                  style={{ color: strokeColor }}
                />

                <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                  <span className="text-[10px] text-ink-muted">
                    {activeTextInput.mode === "card" ? "Shift+Enter for new line" : "Enter to commit"}
                  </span>
                  <button
                    type="button"
                    onClick={commitTextInput}
                    className="flex items-center gap-1 rounded-full bg-brand px-3 py-1 text-xs font-bold text-white hover:opacity-90 transition-opacity"
                  >
                    <Check className="size-3" />
                    <span>Done</span>
                  </button>
                </div>
              </div>
            )}

            {/* 10. Placed Custom Text Items */}
            {textItems.map((item) => {
              const isSelected = selectedItemIds.includes(item.id);
              if (activeTextInput?.id === item.id) return null;
              return (
                <div
                  key={item.id}
                  onMouseDown={(e) => handleItemMouseDown(e, item.id, "text")}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    setActiveTextInput({
                      id: item.id,
                      x: item.x,
                      y: item.y,
                      text: item.text,
                      mode: "plain",
                    });
                  }}
                  className={`absolute z-30 select-none px-2 py-1 rounded transition-all group ${
                    isSelected && selectedTool === "select"
                      ? "ring-2 ring-brand bg-white/80 shadow-xs cursor-move"
                      : selectedTool === "eraser"
                      ? "hover:line-through hover:opacity-50 cursor-pointer"
                      : selectedTool === "select"
                      ? "cursor-move hover:bg-black/5"
                      : "cursor-text"
                  }`}
                  style={{
                    left: `${item.x}px`,
                    top: `${item.y}px`,
                    color: item.color,
                    fontSize: `${item.fontSize}px`,
                    pointerEvents:
                      selectedTool === "select" ||
                      selectedTool === "eraser" ||
                      selectedTool === "text"
                        ? "auto"
                        : "none",
                  }}
                  title="Double-click to edit text"
                >
                  <span className="font-semibold">{item.text}</span>
                  {isSelected && selectedTool === "select" && (
                    <span className="ml-1 text-[10px] font-normal opacity-60">
                      (double-click to edit)
                    </span>
                  )}
                </div>
              );
            })}

            {/* 11. Placed Interactive Sticky Notes */}
            {stickyNotes.map((note) => {
              const isSelected = selectedItemIds.includes(note.id);
              return (
                <div
                  key={note.id}
                  onMouseDown={(e) => handleItemMouseDown(e, note.id, "sticky")}
                  className={`absolute z-30 flex flex-col gap-1.5 rounded-xl border p-3.5 shadow-xs transition-shadow ${
                    STICKY_COLORS[note.color]
                  } ${
                    isSelected && selectedTool === "select"
                      ? "ring-2 ring-brand shadow-md cursor-move"
                      : selectedTool === "eraser"
                      ? "hover:opacity-60 hover:ring-2 hover:ring-red-400 cursor-pointer"
                      : selectedTool === "select"
                      ? "cursor-move"
                      : ""
                  }`}
                  style={{
                    left: `${note.x}px`,
                    top: `${note.y}px`,
                    width: "210px",
                    pointerEvents:
                      selectedTool === "select" || selectedTool === "eraser"
                        ? "auto"
                        : "none",
                  }}
                >
                  {/* Header & Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {(["yellow", "purple", "cyan", "emerald", "rose"] as const).map(
                        (c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              pushStateToHistory();
                              setStickyNotes((prev) =>
                                prev.map((item) =>
                                  item.id === note.id ? { ...item, color: c } : item
                                )
                              );
                            }}
                            className={`size-2.5 rounded-full transition-transform ${
                              c === "yellow"
                                ? "bg-amber-400"
                                : c === "purple"
                                ? "bg-purple-400"
                                : c === "cyan"
                                ? "bg-cyan-400"
                                : c === "emerald"
                                ? "bg-emerald-400"
                                : "bg-rose-400"
                            } ${note.color === c ? "scale-125 ring-1 ring-black/20" : "hover:scale-110"}`}
                          />
                        )
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        pushStateToHistory();
                        setStickyNotes((prev) =>
                          prev.filter((item) => item.id !== note.id)
                        );
                        setSelectedItemIds((prev) =>
                          prev.filter((id) => id !== note.id)
                        );
                      }}
                      className="flex size-4 items-center justify-center rounded-full hover:bg-black/10 text-ink/60"
                      title="Delete note"
                    >
                      <X className="size-3" />
                    </button>
                  </div>

                  <textarea
                    value={note.text}
                    onChange={(e) => {
                      setStickyNotes((prev) =>
                        prev.map((item) =>
                          item.id === note.id ? { ...item, text: e.target.value } : item
                        )
                      );
                    }}
                    onFocus={() => {
                      if (selectedTool !== "select") setSelectedTool("select");
                      setSelectedItemIds([note.id]);
                    }}
                    className="w-full resize-none bg-transparent font-sans text-xs leading-relaxed outline-none"
                    rows={4}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Floating Bottom-Right Controls matching Figma Node 196:219 */}
        <div className="absolute bottom-4 right-4 z-40 flex items-center gap-2">
          {/* Dedicated Undo & Redo Pill */}
          <div className="flex items-center gap-1 rounded-full border border-[#ede6db] bg-white p-1 shadow-lg">
            <button
              type="button"
              onClick={handleUndo}
              disabled={!canUndo}
              className="flex size-7 items-center justify-center rounded-full hover:bg-[#faf6f0] text-ink disabled:opacity-30 disabled:pointer-events-none transition-colors"
              title="Undo (Ctrl+Z)"
              aria-label="Undo"
            >
              <Undo2 className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={handleRedo}
              disabled={!canRedo}
              className="flex size-7 items-center justify-center rounded-full hover:bg-[#faf6f0] text-ink disabled:opacity-30 disabled:pointer-events-none transition-colors"
              title="Redo (Ctrl+Y)"
              aria-label="Redo"
            >
              <Redo2 className="size-3.5" />
            </button>
          </div>

          {/* Dedicated Zoom & Viewport Controls Pill */}
          <div className="flex items-center gap-1.5 rounded-full border border-[#ede6db] bg-white px-2.5 py-1 shadow-lg">
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.max(50, z - 10))}
              className="flex size-6 items-center justify-center rounded-full hover:bg-[#faf6f0] text-ink-muted transition-colors"
              aria-label="Zoom out"
            >
              <ZoomOut className="size-3.5" />
            </button>
            <span className="text-xs font-mono font-bold text-ink px-1">
              {zoomLevel}%
            </span>
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.min(150, z + 10))}
              className="flex size-6 items-center justify-center rounded-full hover:bg-[#faf6f0] text-ink-muted transition-colors"
              aria-label="Zoom in"
            >
              <ZoomIn className="size-3.5" />
            </button>

            <span className="h-3.5 w-px bg-[#ede6db]" />

            <button
              type="button"
              onClick={() => setZoomLevel(100)}
              className="flex size-6 items-center justify-center rounded-full hover:bg-[#faf6f0] text-ink-muted transition-colors"
              title="Reset Zoom"
              aria-label="Reset zoom"
            >
              <Maximize2 className="size-3.5" />
            </button>

            <button
              type="button"
              onClick={() => setShowGrid(!showGrid)}
              className={`flex size-6 items-center justify-center rounded-full transition-colors ${
                showGrid
                  ? "bg-[#faf6f0] text-brand"
                  : "text-ink-muted hover:bg-[#faf6f0]"
              }`}
              title="Toggle Grid"
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
