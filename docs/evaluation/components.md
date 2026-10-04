# Evaluation Hub — Component Specifications & Contracts

This document specifies the primary component contracts in `src/components/evaluation/`.

---

## 1. Component Tree & Contracts

### `EvaluationWorkspace`

- Master container rendering the full evaluation analytics dashboard.

### `EvaluationHeader`

- Eyebrow: `Evaluation & Performance Analytics`
- Title: `Track Your Interview Readiness & Progress`
- Subtitle: `Data-driven insights to measure readiness and eliminate weak areas.`

### `EvaluationProgressChart`

```tsx
interface EvaluationProgressChartProps {
  dataPoints?: { week: string; readiness: number; target: number }[];
}
```

- Line/Area chart displaying readiness trajectory against target company hiring bar.

### `InterviewReadinessCard`

```tsx
interface InterviewReadinessCardProps {
  percentage: number;
  growth: string; // e.g. "+8%"
}
```

- Circular SVG progress ring with growth pill and readiness status (_On Track / Needs Work_).

### `PerformanceByArea`

```tsx
interface AreaPerformance {
  domain: string;
  score: number;
  delta: string;
  status: "Mastered" | "Proficient" | "Needs Practice";
  tagColor: string;
}
```

- 4 domain cards displaying individual mastery scores and difficulty tags.

### `WeeklyProgressTable` & `RecentEvaluationsList`

- Displays session logs, dates, interview types, durations, scores, and links to detailed evaluation reports.

### `EvaluationInsights`

- 3 structured panels: _Your Top Strengths_, _Interview Performance Trends_, and _Your Focus for This Week_.

---

## 2. Interactive Session Evaluation Components

All post-session evaluation views share a unified modern design language, optimized for desktop and mobile viewports:

| Component                             | Path / Routes                                                                     | Evaluated Session             |
| ------------------------------------- | --------------------------------------------------------------------------------- | ----------------------------- |
| `SystemDesignEvaluation`              | `/practice/session/system-design/evaluation`, `/session/system-design/evaluation` | System Design Practice        |
| `CodingEvaluation`                    | `/practice/session/coding/evaluation`                                             | Coding Algorithms Drill       |
| `CloudEvaluation`                     | `/practice/session/cloud/evaluation`                                              | Cloud Infrastructure Practice |
| `BehavioralEvaluation`                | `/practice/session/behavioral/evaluation`, `/behavioral/evaluation`               | Behavioral STAR Practice      |
| `MockSystemDesignEvaluationWorkspace` | `/mock-interview/system-design/evaluation`, `/mock-interview/session/evaluation`  | Full Mock Interview           |

### Common Architecture & Responsive Layout

1. **Header & Quick Action Bar**:
   - Mobile: 2-column touch grid (`Share` & `Export PDF` on row 1, `↺ Retake Drill` spans 2 columns on row 2).
   - Desktop: Inline flex row with smooth transitions.
2. **Score Gauge & Readiness Impact**:
   - Responsive SVG score ring (`size-16 sm:size-20`) with badge (e.g. `Strong Hire` or `Passed`).
   - Readiness growth pill (`+5%` or `+6%`) showing baseline to target readiness.
3. **6-Dimension Evaluation Rubric**:
   - Numerical scores (e.g. `8.5 / 10`) with `shrink-0` to prevent badge wrapping.
   - Criteria descriptions with `min-w-0` to avoid horizontal layout breaking.
4. **Stage Timeline / Test Execution Suite**:
   - Milestones breakdown with timestamp badges and execution outcomes.
5. **Bottom Navigation**:
   - Mobile: Vertical stack `flex-col-reverse` with full-width primary CTA at the top.
   - Desktop: Inline flex row with "Back to Practice / Dashboard" on left and "Continue Prep Plan" on right.
