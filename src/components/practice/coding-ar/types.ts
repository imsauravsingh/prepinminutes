// Type definitions for the AR Coding Visualization System
// Strictly scoped to /practice/session/coding

export type OperationType =
  | "read"
  | "write"
  | "compare"
  | "lookup"
  | "insert"
  | "delete"
  | "swap"
  | "move"
  | "push"
  | "pop"
  | "enqueue"
  | "dequeue"
  | "slide"
  | "recursive_call"
  | "recursive_return"
  | "branch"
  | "return";

export type DataStructureType =
  | "array"
  | "hash_map"
  | "two_pointer"
  | "sliding_window"
  | "stack"
  | "queue"
  | "linked_list"
  | "tree"
  | "graph"
  | "call_stack";

export interface DataStructureState {
  type: DataStructureType;
  id: string;
  name: string;
  data: any;
  highlightIndices?: number[];
  pointers?: Record<string, number | string>; // e.g. { i: 1, left: 0, right: 3 }
  activeKey?: string | number;
}

export interface VisualAction {
  targetId: string;
  action: "highlight" | "pulse" | "fly_to" | "connect" | "delete" | "swap";
  from?: { x: number; y: number; z: number };
  to?: { x: number; y: number; z: number };
  color?: string;
  durationMs?: number;
}

export interface QuizCheckpoint {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ExecutionStep {
  id: string;
  stepNumber: number;
  codeLine: number; // 1-indexed line in the solution code
  operation: OperationType;
  variables: Record<string, string | number | boolean | null>;
  dataStructures: DataStructureState[];
  explanation: {
    what: string;
    why?: string;
    result?: string;
  };
  visualActions?: VisualAction[];
  quizCheckpoint?: QuizCheckpoint;
}

export interface ProblemComplexity {
  timeComplexity: string; // e.g. "O(n)"
  timeExplanation: string;
  timeElements: { label: string; count: string; description: string }[];
  spaceComplexity: string; // e.g. "O(n)" or "O(1)"
  spaceExplanation: string;
  spaceElements: { label: string; usage: string; description: string }[];
}

export interface ARProblem {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  pattern: string; // e.g. "Sliding Window", "HashMap", "Two Pointer"
  summary: string;
  intuition: string;
  approach: string[];
  takeaway: string;
  initialCodeJS: string;
  initialCodePY: string;
  recommendedCodeJS: string;
  recommendedCodePY: string;
  complexity: ProblemComplexity;
  executionSteps: ExecutionStep[];
}
