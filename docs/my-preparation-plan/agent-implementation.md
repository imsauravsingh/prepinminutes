# My Preparation Plan — Agent Implementation Checklist

This document guides AI coding agents in extending or modifying the Preparation Plan module.

---

## 1. Rules for AI Agents

1. **State Isolation**: When candidate switches phases in `PreparationTimeline`, ensure `selectedPhase` filters the topic counts and badges in `ReadinessByArea` without page reloads.
2. **Modal Backdrop & Mobile Touch**:
   - `AreaTopicsModal` must lock body scroll when opened.
   - On screens `< 640px`, topic list cards must display full topic titles without horizontal clipping.
3. **Sidebar Highlighting**:
   - Ensure `/preparation-plan` activates `isPlanRoute` in `Sidebar.tsx`.
   - Never highlight Practice or Dashboard simultaneously.

---

## 2. Verification Checklist

- [ ] **Phase Selection**: Clicking Phase 1, Phase 2, or Phase 3 updates active tab indicator and filters domain readiness topics.
- [ ] **Modal Launcher**: Clicking "View Topics" opens `AreaTopicsModal` with correct domain title and list of topics.
- [ ] **Direct Navigation**: Clicking "Practice Now →" on a topic navigates to the corresponding practice session (e.g. `/practice/session/system-design`).
- [ ] **Build Check**: `npm run build` succeeds with exit code 0.
