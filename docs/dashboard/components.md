# Dashboard — Component Specifications & Contracts

This document specifies the component hierarchy, TypeScript props, and interfaces used in the Dashboard module (`src/components/dashboard/`).

---

## 1. Component Hierarchy

```
DashboardView
├── [If Step 1: Incomplete]
│   ├── OnboardingHeader
│   │   └── DashboardStepper
│   ├── OnboardingFormCard
│   │   ├── TargetRoleSelector
│   │   ├── ExperienceSelector
│   │   ├── TimelineSelector
│   │   └── ResumeDropzone
│   └── OnboardingHelpCard
│
├── [If Step 2: Plan Ready]
│   └── PlanReadyWorkspace
│       ├── PlanMetricSummary
│       ├── DomainFocusList
│       └── PlanActionButtons
│
└── [If Step 3: Completed / Preparing]
    └── StartPreparingWorkspace
        ├── ReadinessOverviewCard
        ├── GoalCard
        ├── NextBestActionCard
        ├── ResumeQuestionsList
        └── QuickPracticeLaunchers
```

---

## 2. Component Contracts & Interfaces

### `DashboardStepper`
```tsx
interface DashboardStepperProps {
  currentStep: 1 | 2 | 3;
  onStepClick?: (step: 1 | 2 | 3) => void;
  allowNavigation?: boolean;
}
```
- Renders horizontal connected pills: `1. Set Up` → `2. Next Step` → `3. Start Preparing`.
- On mobile `< 640px`, labels scale down to `text-[10px]` with reduced horizontal margins.

### `OnboardingFormCard`
```tsx
interface OnboardingFormData {
  targetRole: string;
  experienceLevel: "0-2" | "3-5" | "6-9" | "10+";
  timelineWeeks: number;
  targetCompanies: string[];
  resumeFile: File | null;
  jobDescriptionText?: string;
}

interface OnboardingFormCardProps {
  initialData?: Partial<OnboardingFormData>;
  onSubmitSuccess?: () => void;
}
```

### `StartPreparingWorkspace`
```tsx
interface StartPreparingWorkspaceProps {
  onEditSetup: () => void; // Triggered when candidate clicks "Edit Setup / Role"
}
```
- Renders the active candidate dashboard.
- Contains the edit trigger which switches `DashboardView` back to manual setup mode.

### `GoalCard`
```tsx
interface GoalCardProps {
  weeklyGoalHours: number;
  completedHours: number;
  dailyStreak: number;
}
```
