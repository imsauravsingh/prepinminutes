# Dashboard — UI Implementation Specification

This document details the visual hierarchy, screen layouts, responsive behavior, and layout tokens of the Dashboard module.

---

## 1. Page Shell & Layout Grid

```tsx
<div className="flex flex-1 flex-col bg-[#fbf9f4] lg:flex-row lg:items-start min-h-screen">
  <Sidebar />
  <main className="flex flex-1 flex-col gap-7 sm:gap-8 px-4 py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-10 min-w-0 bg-[#fbf9f4]">
    {/* Dynamic Workspace Content */}
  </main>
</div>
```

---

## 2. Layouts by Step

### Step 1: Onboarding / Set Up Layout

- **Header (`OnboardingHeader.tsx`)**:
  - Eyebrow: `Welcome, Candidate! 👋`
  - Title: `Set up your preparation plan`
  - Stepper indicator: 3 connected dots (`Set Up` → `Next Step` → `Start Preparing`)
- **Main Form Card (`OnboardingFormCard.tsx`)**:
  - Two-column grid on desktop (`grid-cols-1 md:grid-cols-2 gap-5`):
    - Target Role selection dropdown (Senior SWE, Staff SWE, Backend, Full Stack).
    - Experience level radio pills (0-2y, 3-5y, 6-9y, 10+y).
    - Preparation timeline selector (2 weeks, 1 month, 2 months, 3+ months).
    - Target companies tag input.
  - Resume upload dropzone (PDF/DOCX, max 5MB) with drag-and-drop states.
  - Optional Job Description textarea.
  - Primary CTA: "Generate My Preparation Plan →"
- **Support Card (`OnboardingHelpCard.tsx`)**:
  - 3 guidance bullets on how the AI tailors questions to the resume.

### Step 2: Plan Ready Layout (`PlanReadyWorkspace.tsx`)

- Celebration banner: "Your Personalized Plan is Ready!" with green check badge.
- Summary grid (3 metric cards: Target Role, Estimated Hours, Overall Readiness Baseline).
- Domain emphasis cards (System Design, Coding, Behavioral).
- CTAs: "Review Full Plan" (`/preparation-plan`) and "Continue to Dashboard" (`/dashboard?step=3`).

### Step 3: Preparation Launchpad (`StartPreparingWorkspace.tsx`)

- **Readiness Hero**: Circular progress gauge (`68% Readiness`) paired with days-remaining countdown.
- **Next Best Action Card**: Highlighted primary drill (e.g. _System Design: URL Shortener_).
- **Resume-Tailored Questions Carousel**: Cards highlighting questions extracted from candidate's uploaded experience.
- **Domain Quick Drill Launchers**: Quick 15-minute practice cards for Coding, Behavioral, and System Design.

---

## 3. Responsive Breakpoints

| Viewport                    | Behavior                                                                                                                   |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| **Mobile (< 640px)**        | Stepper labels become compact or icons; form inputs stack as single-column; primary CTAs stretch to full-width (`w-full`). |
| **Tablet (640px – 1023px)** | Two-column form fields; stepper shows full labels; resume dropzone is horizontal.                                          |
| **Desktop (1024px+)**       | Two-column layout with sidebar; main content capped with `max-w-[1400px]`.                                                 |
