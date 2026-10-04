# Frontend Architecture & Technical Foundation

This document defines the technical architecture of the PrepInMinutes frontend application for AI coding agents.

---

## 1. Technology Stack

- **Framework**: Next.js 16.3.2 (App Router with Turbopack)
- **Language**: TypeScript 5 (Strict Mode enabled)
- **Styling**: Tailwind CSS v4 with custom configuration and CSS variables
- **State Management**: React 19 Client State (`useState`, `useReducer`, `useEffect`, `useCallback`)
- **Authentication**: Clerk (`@clerk/nextjs` with `<AuthGate>` wrapper)
- **Icons**: `lucide-react`
- **Build Tooling**: Turbopack (`next dev --turbopack`, `next build`)

---

## 2. Directory Layout & Route Hierarchy

```
src/
├── app/                                    ← Next.js App Router root
│   ├── layout.tsx                          ← Root HTML shell with Geist font variables & ClerkProvider
│   ├── page.tsx                            ← Public landing page
│   ├── login/ & sign-up/                   ← Authentication routes
│   │
│   ├── dashboard/                          ← Dashboard module
│   │   ├── page.tsx                        ← Main multi-step dashboard (?step=1|2|3)
│   │   ├── plan-ready/page.tsx             ← Step 2: Personalized plan ready
│   │   └── start-preparing/page.tsx        ← Step 3: Preparation launchpad
│   │
│   ├── preparation-plan/                   ← Preparation Plan module
│   │   ├── page.tsx                        ← Main curriculum & roadmap
│   │   └── ready/page.tsx                  ← Plan ready celebration view
│   │
│   ├── practice/                           ← Self-paced practice hub
│   │   ├── page.tsx                        ← Practice landing
│   │   ├── choose-topic/page.tsx           ← Category & difficulty picker
│   │   └── session/                        ← Interactive practice sessions
│   │       ├── system-design/page.tsx      ← Live System Design workspace
│   │       ├── coding/page.tsx             ← Algorithmic coding drill
│   │       ├── behavioral/page.tsx         ← STAR behavioral drill
│   │       ├── cloud/page.tsx              ← Cloud infra drill
│   │       └── */evaluation/page.tsx       ← Immediate session evaluations
│   │
│   ├── mock-interview/                     ← Full-length mock interview ecosystem
│   │   ├── page.tsx                        ← Main mock hub (recommendations + history)
│   │   ├── configure/page.tsx              ← Step 1: Configuration stepper
│   │   ├── briefing/page.tsx               ← Step 2: Interview briefing & rubrics
│   │   ├── interview-session/page.tsx      ← Step 3: Live full-length interview session
│   │   ├── session/page.tsx                ← Route alias to interview-session
│   │   └── system-design/evaluation/       ← Comprehensive mock evaluation report
│   │       └── page.tsx
│   │
│   ├── evaluation/page.tsx                 ← Historical evaluations & readiness analytics
│   └── revision/page.tsx                   ← Spaced repetition & retention engine
│
├── components/                             ← Modular UI components by domain
│   ├── dashboard/                          ← Sidebar, Steppers, Workspaces, GoalCard
│   ├── preparation-plan/                   ← Timelines, ReadinessByArea, TopicModals
│   ├── practice/                           ← Workspaces, WhiteboardModal, CodeEditor
│   ├── mock-interview/                     ← Config form, Briefing diagram, Eval report
│   ├── evaluation/                         ← Charts, Gauges, Tables, Insights
│   └── revision/                           ← Queue table, Decay cards, Schedule
│
├── data/                                   ← Mock data stores & initial states
├── types/                                  ← TypeScript domain models & interfaces
└── lib/                                    ← Formatting utilities and helpers
```

---

## 3. Server vs. Client Component Conventions

To ensure zero hydration mismatches and optimal Turbopack compilation:

1. **Pages (`page.tsx`)**:
   - Serve as **Server Component wrappers** whenever possible.
   - Define Next.js `export const metadata: Metadata = { ... }`.
   - Wrap interactive content in `<AuthGate>` with `<Sidebar />` and the dedicated domain workspace.
2. **Workspaces & Forms (`Workspace.tsx`)**:
   - Must declare `"use client";` at line 1.
   - Handle internal interactivity, timers, audio recording state, whiteboard canvases, and modal dialogs.
3. **Data Fetching Pattern**:
   - Initial data: Passed via server loaders or deterministic mock data stores in `src/data/`.
   - Client updates: Managed via reactive React state and dispatched to API routes via REST endpoints.

---

## 4. Application Shell Layout Pattern

Every authenticated application screen must strictly follow this standard two-column layout shell:

```tsx
// src/app/<module>/page.tsx
import type { Metadata } from "next";
import { AuthGate } from "@/components/dashboard/AuthGate";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { ModuleWorkspace } from "@/components/<module>/ModuleWorkspace";

export const metadata: Metadata = {
  title: "Module Title | PrepInMinutes",
  description: "Module description...",
};

export default function ModulePage() {
  return (
    <AuthGate>
      <div className="flex flex-1 flex-col bg-[#fbf9f4] lg:flex-row lg:items-start min-h-screen">
        <Sidebar />
        <main className="flex flex-1 flex-col px-4 py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-10 min-w-0 bg-[#fbf9f4]">
          <ModuleWorkspace />
        </main>
      </div>
    </AuthGate>
  );
}
```

> **Rules for AI Agents**:
>
> - Never remove `<AuthGate>` or `<Sidebar />`.
> - Always include `min-w-0` on `<main>` to prevent child flex items from causing horizontal screen overflow.
> - Background color must remain `#fbf9f4` (warm paper cream).
