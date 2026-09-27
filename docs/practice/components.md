# Practice Module — Component Contracts & Interfaces

This document specifies the primary component contracts in `src/components/practice/`.

---

## 1. `ChooseTopicWorkspace`
```tsx
interface ChooseTopicWorkspaceProps {
  initialDomain?: "system-design" | "coding" | "behavioral" | "cloud";
}
```
- Renders domain category filters, topic cards, difficulty tags, and "Start Session" triggers.

---

## 2. `SystemDesignWorkspace`
```tsx
interface SystemDesignWorkspaceProps {
  sessionTitle?: string;
  targetRole?: string;
  initialSeconds?: number;
}
```
- Manages elapsed timer, AI chat stream, text input mode, whiteboard modal launch, secondary tool modal, and end confirmation modal.

---

## 3. `WhiteboardModal`
```tsx
interface WhiteboardModalProps {
  onClose: () => void;
}
```
- Full-screen collaborative canvas. Manages HTML5 canvas, node selection, shapes, sticky notes, and PNG export.

---

## 4. `SystemDesignEvaluation`
```tsx
interface SystemDesignEvaluationProps {
  score?: number;
  readinessDelta?: number;
  onContinueNext?: () => void;
}
```
- Displays immediate session evaluation: "What you did well", "Areas to improve", "Interview feedback", and readiness progression.
