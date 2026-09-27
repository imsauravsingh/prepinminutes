# Dashboard — Agent Implementation Checklist & Verification Guide

This document guides AI coding agents in extending, modifying, or testing the Dashboard module.

---

## 1. Implementation Principles

1. **Deterministic Onboarding State**:
   - The onboarding transition from Step 1 to Step 3 must always be driven by verifiable candidate input (e.g. role selected and valid timeline).
   - Never allow LLM hallucinated transitions.
2. **Readiness Rendering**:
   - The readiness circular gauge on Step 3 must render the mathematical score provided by the API (0–100%).
   - Do not estimate or invent readiness numbers client-side.

---

## 2. Agent Checklist

- [ ] **Auth Enforcement**: Verify that unauthenticated visitors are redirected by `<AuthGate>` to `/login`.
- [ ] **LocalStorage Invariant**: Verify that `useSyncExternalStore` in `DashboardView.tsx` reads `prep_onboarding_completed` without React hydration errors.
- [ ] **Query Parameter Handling**:
  - `?step=1`: Renders `OnboardingFormCard`.
  - `?step=3`: Sets completed flag in localStorage and renders `StartPreparingWorkspace`.
  - `?setup=true` or `?edit=true`: Renders form even if completed flag was set.
- [ ] **Mobile Responsiveness**:
  - Check `DashboardStepper` on 320px viewport: pills must not clip or cause horizontal page scroll.
  - Check `OnboardingFormCard` inputs on mobile: inputs must take 100% width.
- [ ] **Verification**: Run `npm run build` to confirm 0 compilation errors.
