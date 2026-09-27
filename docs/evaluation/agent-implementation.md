# Evaluation Hub — Agent Implementation Checklist

This document provides AI coding agents with guidelines for maintaining and extending the Evaluation Hub.

---

## 1. Core Implementation Invariants

1. **Sidebar Isolation**:
   - `/evaluation` must highlight the **Evaluation** item in `Sidebar.tsx`.
   - It renders the contextual `"Track your progress"` bottom widget with bar chart SVG art.
   - It must never highlight Mock Interview or Practice.
2. **Chart Responsiveness**:
   - Ensure `EvaluationProgressChart` is wrapped in responsive SVG containers (`viewBox="0 0 ..."` and `w-full h-auto`) so charts scale smoothly on mobile screens without horizontal clipping.
3. **Table Mobile Fallback**:
   - `WeeklyProgressTable` must have `overflow-x-auto` to allow smooth horizontal swipe on small mobile screens.

---

## 2. Agent Checklist

- [ ] **Data Consistency**: Readiness percentage displayed in `InterviewReadinessCard` matches the latest entry in `EvaluationProgressChart`.
- [ ] **Links Integrity**: Clicking any item in `RecentEvaluationsList` navigates to the corresponding session report (e.g. `/mock-interview/system-design/evaluation` or `/practice/session/*/evaluation`).
- [ ] **Clean Layout**: No double sidebar highlighting; widgets adhere to color tokens.
- [ ] **Build Check**: `npm run build` succeeds with exit code 0.
