# My Preparation Plan — Component Specifications

This document defines the component interfaces and contracts used in `src/components/preparation-plan/`.

---

## 1. Components & Props

### `PreparationTimeline`

```tsx
interface PhaseItem {
  id: string; // e.g. "phase-1"
  number: number;
  title: string;
  durationLabel: string; // e.g. "Weeks 1 - 2"
  focusSummary: string;
  topicsCount: number;
  completedCount: number;
  isCurrent: boolean;
}

interface PreparationTimelineProps {
  selectedPhase: string;
  onSelectPhase: (phaseId: string) => void;
}
```

### `ReadinessByArea`

```tsx
interface DomainArea {
  id: string;
  name: string;
  icon: LucideIcon;
  readinessPercent: number;
  completedTopics: number;
  totalTopics: number;
  topics: {
    id: string;
    title: string;
    completed: boolean;
    score?: number;
    difficulty: "Easy" | "Medium" | "Hard";
  }[];
}

interface ReadinessByAreaProps {
  selectedPhase: string;
}
```

### `AreaTopicsModal`

```tsx
interface AreaTopicsModalProps {
  area: DomainArea;
  isOpen: boolean;
  onClose: () => void;
  onStartPractice: (topicId: string) => void;
}
```

- Full-screen or centered modal displaying the list of topics under the selected domain.
- Displays difficulty badges and "Practice Now →" link leading to `/practice/session/*`.
