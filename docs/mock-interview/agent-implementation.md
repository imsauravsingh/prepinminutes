# Mock Interview — Agent Implementation Checklist

This document provides AI coding agents with strict implementation rules for the Mock Interview module.

---

## 1. Critical Rules & Invariants

1. **Sidebar Isolation**:
   - Every page under `/mock-interview/*` must ONLY highlight **Mock Interview** in `Sidebar.tsx`.
   - The Evaluation menu item must remain INACTIVE even on `/mock-interview/system-design/evaluation`.
   - The "Stay consistent!" widget must remain HIDDEN across all mock interview views.
2. **Mobile Responsiveness**:
   - `MockInterviewSessionWorkspace`: Ensure header breadcrumb has `flex-wrap` so long titles wrap cleanly on 320px screens.
   - `MockSystemDesignEvaluationWorkspace`: Executive summary grid must stack into a clean 1-column layout on `< lg` screens.
   - Modals: Action buttons must stack vertically as `flex-col-reverse` on mobile.

---

## 2. Verification Checklist

- [ ] **Configure Navigation**: Changing configuration parameters updates the live preview card in real time.
- [ ] **Briefing CTA**: Clicking "Start Interview →" correctly routes to `/mock-interview/interview-session`.
- [ ] **Live Workspace Controls**:
  - Mic toggle animates waveform.
  - Pause stops timer and flattens waveform.
  - Whiteboard button launches canvas.
  - "End Interview" button triggers confirmation modal.
- [ ] **Evaluation Linking**: Clicking "End Now & View Report" routes directly to `/mock-interview/system-design/evaluation`.
- [ ] **Build Validation**: `npm run build` exits with code 0.
