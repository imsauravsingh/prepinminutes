# Dashboard — State Machine & State Handling

This document specifies the client state machine, loading states, empty states, and error handling for the Dashboard module.

---

## 1. Onboarding Lifecycle State Machine

```mermaid
stateDiagram-v2
    [*] --> STEP_1_INCOMPLETE
    STEP_1_INCOMPLETE --> SUBMITTING_PROFILE: User submits setup form
    SUBMITTING_PROFILE --> GENERATING_PLAN: Profile validated
    SUBMITTING_PROFILE --> STEP_1_ERROR: Validation failed (missing role/resume)
    STEP_1_ERROR --> STEP_1_INCOMPLETE: User corrects fields

    GENERATING_PLAN --> STEP_2_PLAN_READY: Plan generated via async worker
    GENERATING_PLAN --> PLAN_GENERATION_FAILED: LLM / service timeout
    PLAN_GENERATION_FAILED --> STEP_1_INCOMPLETE: Retry submission

    STEP_2_PLAN_READY --> STEP_3_ACTIVE_PREPARING: User clicks "Start Preparing"
    STEP_3_ACTIVE_PREPARING --> STEP_1_INCOMPLETE: User clicks "Edit Setup / Role"
```

---

## 2. Storage & Persistence Invariant

In `src/components/dashboard/DashboardView.tsx`, the onboarding state uses `useSyncExternalStore` reading from `localStorage.getItem("prep_onboarding_completed")`:

- When `localStorage.getItem("prep_onboarding_completed") === "true"`, the user directly sees `StartPreparingWorkspace`.
- URL override query params:
  - `?setup=true` or `?edit=true`: forces `manualSetupMode = true`, rendering Step 1 form.
  - `?step=3`: sets `prep_onboarding_completed = "true"` in storage and renders Step 3 workspace.

---

## 3. Loading, Empty & Error States

| State                | Visual Treatment                                                                                                                                   | Trigger                             |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| **Initial Loading**  | Suspense fallback renders `<div className="h-24 w-full animate-pulse rounded-2xl bg-cream" />`                                                     | Page initial mount                  |
| **Resume Uploading** | Progress spinner inside dropzone with filename and cancel button                                                                                   | File selected                       |
| **Plan Generating**  | Stepper shows pulsing orange dot on Step 2 with message _"Analyzing resume and tailoring questions..."_                                            | Form submitted                      |
| **Empty Questions**  | If resume extraction returns no questions, display _"Practice general system design while your resume finishes parsing"_ with fallback drill cards | Extraction worker pending           |
| **Validation Error** | Red border on required inputs with error label below the input                                                                                     | User submits without selecting role |
