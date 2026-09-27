# Practice Module — Agent Implementation Checklist

This document provides AI coding agents with strict implementation rules and verification steps for the Practice Hub.

---

## 1. Critical Invariants

1. **Whiteboard Cleanup**:
   - Always ensure `window.removeEventListener` is called for `mousemove` and `mouseup` in `WhiteboardModal.tsx` to prevent memory leaks and ghost drawing.
2. **Audio Dock Responsiveness**:
   - The 24 waveform bars must have `shrink-0` and the waveform container must specify `overflow-hidden` so it never forces horizontal page scrolling on mobile viewports (320px–375px).
3. **End Session & Submit Confirmation Modals**:
   - Both the practice session termination modal and the coding workspace submit modal (`PracticeCodingWorkspace.tsx`) must require explicit user confirmation before redirecting to evaluation.
   - Action buttons must stack vertically on mobile (`flex flex-col-reverse sm:flex-row items-stretch sm:items-center`) to prevent button cutoff.

---

## 2. Agent Checklist

- [ ] **Sidebar Highlighting**: Verify `/practice` highlights the **Practice** menu item and does NOT highlight Evaluation or Mock Interview.
- [ ] **Audio Dock Controls**: Pause toggles waveform opacity; Stop button opens confirmation dialog.
- [ ] **Text Mode**: Form submission correctly appends candidate message bubble to the conversation thread.
- [ ] **Whiteboard Launch**: Clicking "Whiteboard" renders the canvas; closing it restores the live conversation view.
- [ ] **Coding Workspace Submission**: Clicking "Submit Answer" on `/practice/session/coding` prompts a confirmation modal with problem/test summary before redirecting to `/practice/session/coding/evaluation`.
- [ ] **Build Validation**: Run `npm run build` and ensure exit code 0.
