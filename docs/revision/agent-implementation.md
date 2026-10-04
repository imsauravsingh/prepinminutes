# Revision Module — Agent Implementation Checklist

This document provides AI coding agents with strict implementation rules for the Revision Module.

---

## 1. Critical Rules & Invariants

1. **Sidebar Isolation**:
   - `/revision` must ONLY highlight **Revision** in `Sidebar.tsx`.
   - The bottom support widget is suppressed (`null`) to maintain a focused review interface.
2. **Deterministic Schedule Updates**:
   - When a user finishes a recall drill, never randomize or ask an LLM to guess the next review date.
   - Always run the SM-2 interval calculator in a deterministic domain service.
3. **Responsive Table**:
   - `RevisionQueueTable` must wrap in `overflow-x-auto` with touch scroll to support 320px–375px mobile screens.

---

## 2. Agent Checklist

- [ ] **Sidebar Verification**: Only the Revision menu item is highlighted on `/revision`.
- [ ] **Table Responsiveness**: Check table scroll on mobile viewport.
- [ ] **Quick Drill Triggers**: Clicking "Revise Now" launches the rapid reinforcement modal or routes to the targeted practice drill.
- [ ] **Build Validation**: Run `npm run build` and ensure exit code 0.
