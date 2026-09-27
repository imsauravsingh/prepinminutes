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
