# Architecture Specification: TASK-P5-03 — Multi-Domain Code Editor & Whiteboard Workspace Synchronization

> **Version**: 1.0.0  
> **Status**: COMPLETED & VERIFIED  
> **Target Release**: Phase 5 (Interactive Practice & Live Question Injection)  
> **Dependencies**: `TASK-P5-01` (Dynamic Question Loader), `TASK-P5-02` (AiInterviewAgent Rubric Injection)  
> **Applicable Workspaces**:
> 1. `PracticeCodingWorkspace.tsx` (`/practice/session/coding`)
> 2. `WhiteboardModal.tsx` (Shared interactive whiteboard canvas across Architecture, Coding & Cloud)
> 3. `SystemDesignWorkspace.tsx` (`/practice/session/system-design`)
> 4. `CloudWorkspace.tsx` (`/practice/session/cloud`)

---

## 1. Executive Summary & Problem Statement

In `TASK-P5-01` and `TASK-P5-02`, we successfully unlocked the 7,420-question Knowledge Graph and introduced the **`AiInterviewAgent`** to evaluate technical turns against official rubric atoms. 

However, during active practice, candidates faced two severe UX and technical hurdles:
1. **The Language Monoculture**: The code editor was restricted to basic JavaScript and Python stubs. Candidates preparing for FAANG interviews in **TypeScript**, **Node.js**, **Java**, **C++**, or **Go** had no language support or idiom-calibrated starter templates. Furthermore, toggling languages destructively cleared all user code.
2. **Whiteboard Canvas Volatility**: Closing the whiteboard modal, switching questions, or reloading the browser completely wiped the user's architectural diagrams, sticky notes, and system topology.

`TASK-P5-03` resolves both bottlenecks with:
- **Universal 7-Language Code Engine**: First-class support for **TypeScript**, **JavaScript**, **Node.js**, **Python**, **Java**, **C++**, and **Go** with domain-calibrated starter templates (DSA algorithms, LLD OOP, and Frontend React).
- **Session-Aware Isolated Code Buffers**: Non-destructive language switching preserving candidate code in `sessionStorage` and `localStorage` under `pim_code_${topic}_${qId}_${lang}`.
- **Persistent Whiteboard Engine**: Debounced auto-save (400ms) to `localStorage` under `pim_wb_${topic}_${qId}` with live visual save indicators.
- **Evaluation Snapshot Serialization**: Whiteboard data export (JSON topology + high-resolution PNG DataURL) preparing visual artifacts for submission in `TASK-P5-04`.

---

## 2. Core Architecture & Component Contracts

### 2.1 Multi-Language Template Generator (`src/lib/code-templates.ts`)

```typescript
export type SupportedLanguage =
  | "typescript"
  | "javascript"
  | "nodejs"
  | "python"
  | "java"
  | "cpp"
  | "go";

export interface LanguageConfig {
  id: SupportedLanguage;
  label: string;
  extension: string;
  monacoLanguage: string;
  badge: string;
  defaultVersion: string;
}

export const SUPPORTED_LANGUAGES: LanguageConfig[] = [
  { id: "typescript", label: "TypeScript", extension: ".ts", monacoLanguage: "typescript", badge: "TS 5.x", defaultVersion: "5.4" },
  { id: "javascript", label: "JavaScript", extension: ".js", monacoLanguage: "javascript", badge: "ES2024", defaultVersion: "ES2024" },
  { id: "nodejs", label: "Node.js", extension: ".js", monacoLanguage: "javascript", badge: "Node v20", defaultVersion: "v20 LTS" },
  { id: "python", label: "Python", extension: ".py", monacoLanguage: "python", badge: "Python 3.12", defaultVersion: "3.12" },
  { id: "java", label: "Java", extension: ".java", monacoLanguage: "java", badge: "Java 21", defaultVersion: "OpenJDK 21" },
  { id: "cpp", label: "C++", extension: ".cpp", monacoLanguage: "cpp", badge: "C++20", defaultVersion: "GCC 13 / C++20" },
  { id: "go", label: "Go", extension: ".go", monacoLanguage: "go", badge: "Go 1.22", defaultVersion: "1.22" },
];
```

### 2.2 Template Generation Calibrations

1. **Data Structures & Algorithms (DSA)**:
   - TypeScript: `export class Solution { public methodName(nums: number[], target?: number): number }`
   - JavaScript: `function methodName(nums, target) { ... }` with JSDoc annotations
   - Node.js: `class Solution { static solve(nums, target) { ... } }` with `perf_hooks` metrics
   - Python: `class Solution: def methodName(self, nums: List[int], target: Optional[int]) -> int:`
   - Java: `public class Solution { public int methodName(int[] nums, int target) { ... } }`
   - C++: `class Solution { public: int methodName(const std::vector<int>& nums, int target) { ... } };`
   - Go: `func MethodName(nums []int, target int) int { ... }`
2. **Low-Level Design (LLD)**:
   - TypeScript: Abstract interface `I<Name>Service` with concrete implementation class.
   - JavaScript / Node.js: ES6 Class with `EventEmitter` lifecycle hooks and async dispatcher.
   - Python: Abstract base class inheriting from `abc.ABC` with `@abstractmethod`.
   - Java: Thread-safe class using `ConcurrentHashMap` and `synchronized` execution.
   - C++: Class using `std::mutex` and `std::lock_guard`.
   - Go: Struct with `sync.RWMutex` read/write locking.
3. **Frontend Engineering**:
   - TypeScript: `React.FC<Props>` functional component with TypeScript interface and state hooks.
   - JavaScript: Component with JSDoc props and state hooks.
   - Node.js: Server-Side Renderer (SSR) mock server.

### 2.3 Persistent Whiteboard Hook Contract (`src/hooks/useWhiteboardState.ts`)

```typescript
export interface WhiteboardStatePayload {
  boardNodes: BoardNode[];
  stickyNotes: StickyItem[];
  textItems: TextItem[];
  shapes: ShapeItem[];
  canvasDataUrl?: string | null;
  updatedAt?: string;
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
```

---

## 3. Storage Invariants & Security

1. **Storage Isolation**:
   - Code Storage Key: `pim_code_${topicSlug}_${questionId}_${lang}`
   - Whiteboard Storage Key: `pim_wb_${topicSlug}_${questionId}`
2. **Debounce Interval**:
   - Changes are auto-persisted after **400ms** of inactivity, preventing main-thread stuttering or storage saturation.
3. **Memory Fallback**:
   - In environments where `localStorage` or `sessionStorage` is restricted or during SSR, an in-memory buffer (`IN_MEMORY_BUFFER_STORE`) ensures 0 runtime crashes.
4. **Graceful Failover**:
   - When switching to an unpracticed language, the generator immediately synthesizes a clean, calibrated template matching the active question.

---

## 4. Verification & Testing

- Automated test suite: `scripts/test-code-editor-whiteboard-sync.ts`
- Tests executed across all 7 languages, 3 domain archetypes, buffer switching isolation, and whiteboard JSON round-trips.
