# My Preparation Plan — UI Implementation Specification

This document details the visual structure, layout components, and responsive design of the Preparation Plan workspace (`/preparation-plan`).

---

## 1. Page Layout & Component Tree

```tsx
<main className="flex flex-1 flex-col gap-8 px-4 py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-10 min-w-0 w-full">
  <PlanHeader />
  <PreparationProgress />
  <PreparationTimeline
    selectedPhase={selectedPhase}
    onSelectPhase={setSelectedPhase}
  />
  <ReadinessByArea selectedPhase={selectedPhase} />
  <PlanUpdatedCallout />
</main>
```

---

## 2. Visual Breakdown

1. **Header (`PlanHeader.tsx`)**:
   - Breadcrumb: `Preparation Plan • Senior Software Engineer`
   - Title: `Your Personalized Preparation Roadmap`
   - Meta bar: Target role, timeline (e.g. *6 Weeks*), estimated hours (*48 Hours Total*), and primary CTA "Start Next Practice Session →".
2. **Progress Gauge (`PreparationProgress.tsx`)**:
   - Overall plan completion bar (e.g. *14 of 42 Topics Completed • 33%*).
   - Time spent vs remaining.
3. **Phased Timeline (`PreparationTimeline.tsx`)**:
   - Horizontal phase cards on desktop (`Phase 1`, `Phase 2`, `Phase 3`).
   - Active phase indicator with orange border and badge.
   - Clicking a phase triggers `setSelectedPhase(phaseId)` and updates the domain cards below.
4. **Readiness by Area (`ReadinessByArea.tsx`)**:
   - 4 domain cards (System Design, Algorithms, Behavioral, Cloud).
   - Each card displays:
     - Area name and icon
     - Current mastery percentage bar (e.g. *64% Readiness*)
     - Covered topics count (e.g. *4/6 Topics*)
     - "View Topics" button that launches the full-screen / modal topic list (`AreaTopicsModal.tsx`).
5. **Plan Updated Callout (`PlanUpdatedCallout.tsx`)**:
   - Subtly notifies candidate when the plan was last adapted based on evaluation feedback.
