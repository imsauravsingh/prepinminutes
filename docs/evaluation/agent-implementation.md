# Evaluation Hub — Agent Implementation Checklist

This document provides AI coding agents with guidelines for maintaining and extending the Evaluation Hub.

---

## 1. Core Implementation Invariants

1. **Sidebar Isolation & Promotional Card Removal**:
   - `/evaluation` must highlight the **Evaluation** item in `Sidebar.tsx`.
   - It must never highlight Mock Interview or Practice.
   - **No Promotional Cards**: All evaluation routes (`isAnyEvaluationRoute = pathname === "/evaluation" || pathname.startsWith("/evaluation/") || pathname.includes("/evaluation")`), as well as mock interview and revision routes, **MUST NOT** render the "Stay consistent!" sidebar card.
   - Sub-interview evaluations (e.g. `/mock-interview/system-design/evaluation`) must isolate highlighting to "Mock Interview" and not highlight Evaluation.
2. **Evaluation Page Mobile Responsiveness**:
   - Quick Action Bar: On mobile `< sm`, format as a 2-column touch grid with `↺ Retake Drill` spanning 2 columns (`col-span-2`).
   - Bottom Action Bar: Use `flex-col-reverse sm:flex-row items-stretch sm:items-center` so mobile buttons have full width with primary CTA on top.
   - Dimension Badges & Timeline: All flex containers must include `min-w-0` and score badges must include `shrink-0` to prevent horizontal text overflow on 320px–375px screens.
3. **Chart Responsiveness**:
   - Ensure `EvaluationProgressChart` is wrapped in responsive SVG containers (`viewBox="0 0 ..."` and `w-full h-auto`) so charts scale smoothly on mobile screens without horizontal clipping.
4. **Table Mobile Fallback**:
   - `WeeklyProgressTable` must have `overflow-x-auto` to allow smooth horizontal swipe on small mobile screens.

---

## 2. Agent Checklist

- [ ] **Data Consistency**: Readiness percentage displayed in `InterviewReadinessCard` matches the latest entry in `EvaluationProgressChart`.
- [ ] **Links Integrity**: Clicking any item in `RecentEvaluationsList` navigates to the corresponding session report (e.g. `/mock-interview/system-design/evaluation` or `/practice/session/*/evaluation`).
- [ ] **Sidebar Cleanliness**: Verify the "Stay consistent!" card is NOT visible on `/evaluation` or any session evaluation page.
- [ ] **Mobile Touch Test**: Quick actions and bottom navigation buttons on evaluation pages wrap cleanly without horizontal scrollbars.
- [ ] **Build Check**: `npm run build` succeeds with exit code 0.
