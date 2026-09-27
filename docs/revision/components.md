# Revision Module — Component Specifications & Contracts

This document specifies the primary component contracts in `src/components/revision/`.

---

## 1. Components & Props

### `RevisionWorkspace`

- Master layout rendering `TodayRevisionCards`, `KnowledgeHealthCard`, `RevisionQueueTable`, `UpcomingScheduleCard`, and `WhyTheseTopicsCard`.

### `TodayRevisionCards`

```tsx
interface RevisionCardItem {
  id: string;
  title: string;
  domain: string;
  urgency: "Overdue" | "Due Today" | "Upcoming";
  lastScore: number;
  estMinutes: number;
}
```

- Carousel or responsive grid of cards scheduled for today's review session.

### `KnowledgeHealthCard`

```tsx
interface KnowledgeHealthCardProps {
  healthPercentage: number; // e.g. 76
  retainedTopicsCount: number;
  atRiskTopicsCount: number;
}
```

- Displays overall retention gauge and decay alert banner.

### `RevisionQueueTable`

```tsx
interface RevisionQueueItem {
  id: string;
  topic: string;
  domain: string;
  difficulty: "Easy" | "Medium" | "Hard";
  status: "Overdue" | "Due Today" | "In 2 Days" | "In 5 Days";
  decayRisk: "High" | "Medium" | "Low";
  lastPracticedDate: string;
  reviewUrl: string;
}
```

- Sortable table of all tracked revision items with direct "Start Drill" buttons.
