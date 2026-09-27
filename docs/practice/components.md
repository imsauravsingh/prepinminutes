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

---

## 5. `PracticeCodingWorkspace`

```tsx
// Location: src/components/practice/PracticeCodingWorkspace.tsx
export function PracticeCodingWorkspace(): JSX.Element;
```

- **Features**: Problem description, language switch (`javascript` / `python`), test case runner, session countdown timer.
- **Submit Confirmation Modal**:
  - Modal prompt before evaluation submission.
  - Text:
    - **Title**: `Submit Coding Solution?`
    - **Description**: `Are you ready to submit your code for evaluation? Your implementation will be analyzed across test correctness, algorithmic complexity, and code quality.`
  - Buttons:
    - `Continue Session`: Cancels modal and resumes coding.
    - `Confirm & Submit`: Navigates to `/practice/session/coding/evaluation`.

---

## 6. `CodingEvaluation`

```tsx
// Location: src/components/practice/CodingEvaluation.tsx
export function CodingEvaluation(): JSX.Element;
```

- Complete evaluation report displaying score gauge (88/100), readiness growth (+5%), 6 evaluation dimensions, strengths/improvements, test execution suite summary, and mobile-responsive action bars.
