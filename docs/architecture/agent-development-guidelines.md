# AI Agent Development Guidelines & Core Constraints

This document establishes the boundaries, verification standards, and operational guidelines that every AI coding agent must follow when implementing or modifying code in the PrepInMinutes repository.

---

## 1. The Cardinal Rule of System Boundaries

$$\textbf{LLM Boundary} \neq \textbf{Deterministic Service Boundary}$$

### What the LLM Owns

- Generating realistic, role-specific interview questions and hints.
- Interpreting candidate transcripts and freehand whiteboard diagrams.
- Drafting qualitative evaluation feedback and personalized improvement advice.
- Generating contextual flashcard questions and explanation prose.

### What Deterministic Services MUST Own

- **Scoring & Rubrics**: Weighting, point sums, and percentage calculations.
- **Readiness Calculations**: Moving averages, historical trendlines, and readiness deltas.
- **State Machine Transitions**: Timer progression, stage advancement, and lifecycle validation.
- **Spaced Repetition Decay**: Ebbinghaus decay formulas, review scheduling, and queue priority.
- **Analytics & Event Dispatching**: Structured event logging, idempotency keys, and audit trails.

> **Violation Example**: Prompting an LLM to "Calculate the candidate's new overall readiness percentage and return the updated number" is strictly forbidden. The LLM must return structured rubric evaluations (e.g., `technical_depth: 8.5/10`), and a deterministic backend service calculates the readiness delta mathematically.

---

## 2. UI Preservation Invariants

1. **Do Not Redesign Existing Screens**:
   - The application shell, fonts (`Geist`), colors (`#fbf9f4`, `#ff5520`, `#1e1c1a`), card radiuses (`rounded-2xl`, `rounded-3xl`), and borders (`border-line`) are established.
   - Any new screen must inherit these tokens directly.
2. **Preserve Sidebar State**:
   - Ensure new routes resolve unambiguously in `src/components/dashboard/Sidebar.tsx`.
   - Never highlight two primary links at once.
3. **Mobile First Verification**:
   - Every layout must be tested conceptually for 320px–375px screens.
   - Never rely on fixed desktop dimensions (`w-[600px]` without responsive prefixes).

---

## 3. Idempotency & Network Resilience

1. **Session Idempotency**:
   - End interview submissions must include an idempotency key (`idempotency_key = `${sessionId}:${attemptNumber}``) so retried network requests do not duplicate evaluation reports or inflate readiness scores.
2. **Resume Behavior**:
   - In-progress practice and mock sessions must persist elapsed seconds and current stage to local storage or API cache so a page reload allows the user to resume seamlessly.

---

## 4. Agent Implementation Checklist

Before completing any task, an AI agent must verify:

- [ ] **No Hydration Errors**: Next.js client components properly declare `"use client";` at line 1.
- [ ] **Route Isolation**: Sidebar correctly highlights only the current module.
- [ ] **Mobile Responsiveness**: Checked for 320px (iPhone SE), 390px (standard phone), 768px (tablet), and 1280px+ (desktop).
- [ ] **No Text Truncation / Overflow**: Added `min-w-0`, `break-words`, and flex wrapping on headers and chat bubbles.
- [ ] **TypeScript Types**: All props, states, and API responses have explicit TypeScript interfaces in `@/types/`.
- [ ] **Build Verification**: Run `npm run build` and ensure exit code is `0` with zero compilation errors.
