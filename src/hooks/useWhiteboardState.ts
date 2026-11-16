"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type {
  BoardNode,
  StickyItem,
  TextItem,
  ShapeItem,
} from "@/components/practice/WhiteboardModal";

export interface WhiteboardStatePayload {
  boardNodes: BoardNode[];
  stickyNotes: StickyItem[];
  textItems: TextItem[];
  shapes: ShapeItem[];
  canvasDataUrl?: string | null;
  updatedAt?: string;
}

export interface UseWhiteboardStateOptions {
  topicSlug?: string;
  questionId?: string;
  debounceMs?: number;
  initialData?: Partial<WhiteboardStatePayload>;
}

export interface UseWhiteboardStateReturn {
  boardNodes: BoardNode[];
  setBoardNodes: React.Dispatch<React.SetStateAction<BoardNode[]>>;
  stickyNotes: StickyItem[];
  setStickyNotes: React.Dispatch<React.SetStateAction<StickyItem[]>>;
  textItems: TextItem[];
  setTextItems: React.Dispatch<React.SetStateAction<TextItem[]>>;
  shapes: ShapeItem[];
  setShapes: React.Dispatch<React.SetStateAction<ShapeItem[]>>;
  isSaved: boolean;
  isSaving: boolean;
  lastSavedAt: string | null;
  saveImmediate: () => void;
  clearWhiteboard: () => void;
  exportWhiteboardPayload: (canvasRef?: HTMLCanvasElement | null) => WhiteboardStatePayload;
}

const STORAGE_PREFIX = "pim_wb_";

export function getWhiteboardStorageKey(topicSlug?: string, questionId?: string): string {
  const cleanTopic = topicSlug || "default";
  const cleanQ = questionId || "q1";
  return `${STORAGE_PREFIX}${cleanTopic}_${cleanQ}`;
}

export function useWhiteboardState({
  topicSlug,
  questionId,
  debounceMs = 400,
  initialData,
}: UseWhiteboardStateOptions = {}): UseWhiteboardStateReturn {
  const storageKey = getWhiteboardStorageKey(topicSlug, questionId);

  const [boardNodes, setBoardNodes] = useState<BoardNode[]>(
    initialData?.boardNodes || []
  );
  const [stickyNotes, setStickyNotes] = useState<StickyItem[]>(
    initialData?.stickyNotes || []
  );
  const [textItems, setTextItems] = useState<TextItem[]>(
    initialData?.textItems || []
  );
  const [shapes, setShapes] = useState<ShapeItem[]>(
    initialData?.shapes || []
  );

  const [isSaved, setIsSaved] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);

  const isInitialMount = useRef(true);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Restore saved state on mount or key change
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed: WhiteboardStatePayload = JSON.parse(raw);
        setBoardNodes(Array.isArray(parsed.boardNodes) ? parsed.boardNodes : []);
        setStickyNotes(Array.isArray(parsed.stickyNotes) ? parsed.stickyNotes : []);
        setTextItems(Array.isArray(parsed.textItems) ? parsed.textItems : []);
        setShapes(Array.isArray(parsed.shapes) ? parsed.shapes : []);
        setLastSavedAt(parsed.updatedAt || null);
        setIsSaved(true);
      } else if (initialData) {
        // Fall back to provided initialData
        setBoardNodes(initialData.boardNodes || []);
        setStickyNotes(initialData.stickyNotes || []);
        setTextItems(initialData.textItems || []);
        setShapes(initialData.shapes || []);
        setIsSaved(true);
      } else {
        // Reset to clean canvas
        setBoardNodes([]);
        setStickyNotes([]);
        setTextItems([]);
        setShapes([]);
        setIsSaved(true);
      }
    } catch (e) {
      console.warn("Failed to restore whiteboard state from localStorage:", e);
    }
  }, [storageKey]);

  // 2. Immediate persist function
  const persistState = useCallback(
    (nodes: BoardNode[], stickies: StickyItem[], texts: TextItem[], shps: ShapeItem[]) => {
      if (typeof window === "undefined") return;

      try {
        setIsSaving(true);
        const timestamp = new Date().toISOString();
        const payload: WhiteboardStatePayload = {
          boardNodes: nodes,
          stickyNotes: stickies,
          textItems: texts,
          shapes: shps,
          updatedAt: timestamp,
        };
        localStorage.setItem(storageKey, JSON.stringify(payload));
        setLastSavedAt(timestamp);
        setIsSaved(true);
      } catch (e) {
        console.warn("Failed to persist whiteboard state:", e);
      } finally {
        setIsSaving(false);
      }
    },
    [storageKey]
  );

  // 3. Debounced auto-save whenever canvas items change
  useEffect(() => {
    // Skip on first mount to avoid immediately saving empty/restoring state
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    setIsSaved(false);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      persistState(boardNodes, stickyNotes, textItems, shapes);
    }, debounceMs);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [boardNodes, stickyNotes, textItems, shapes, persistState, debounceMs]);

  // 4. Force immediate save
  const saveImmediate = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    persistState(boardNodes, stickyNotes, textItems, shapes);
  }, [persistState, boardNodes, stickyNotes, textItems, shapes]);

  // 5. Clear whiteboard
  const clearWhiteboard = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    setBoardNodes([]);
    setStickyNotes([]);
    setTextItems([]);
    setShapes([]);
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(storageKey);
      } catch (e) {
        console.warn("Failed to remove whiteboard storage item:", e);
      }
    }
    setIsSaved(true);
    setLastSavedAt(null);
  }, [storageKey]);

  // 6. Export serialized snapshot payload with optional canvas PNG DataURL
  const exportWhiteboardPayload = useCallback(
    (canvasRef?: HTMLCanvasElement | null): WhiteboardStatePayload => {
      let canvasDataUrl: string | null = null;
      if (canvasRef) {
        try {
          canvasDataUrl = canvasRef.toDataURL("image/png");
        } catch {
          // Canvas tainting / inaccessible
        }
      }

      return {
        boardNodes,
        stickyNotes,
        textItems,
        shapes,
        canvasDataUrl,
        updatedAt: new Date().toISOString(),
      };
    },
    [boardNodes, stickyNotes, textItems, shapes]
  );

  return {
    boardNodes,
    setBoardNodes,
    stickyNotes,
    setStickyNotes,
    textItems,
    setTextItems,
    shapes,
    setShapes,
    isSaved,
    isSaving,
    lastSavedAt,
    saveImmediate,
    clearWhiteboard,
    exportWhiteboardPayload,
  };
}
