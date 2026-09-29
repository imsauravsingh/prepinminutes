# PrepInMinutes — AI Agent Developer Documentation Suite

Welcome to the **PrepInMinutes** Developer Documentation. This documentation suite is written specifically for **AI Coding Agents** and software engineers who build, extend, and maintain the PrepInMinutes platform while preserving its established UI design system, UX patterns, and deterministic business logic.

> [!NOTE] Current Implementation Phase
> The frontend user interface, interactive workspaces, and navigation shell are **100% complete** across all 43 Next.js routes. The backend API layer (`src/app/api/`), database models (Prisma), and background workers are currently **not implemented (0%)** and are fully blueprint-specified in [`docs/TASKS.md`](./TASKS.md) and [`docs/architecture/layers/`](./architecture/layers/) for immediate implementation.

---

## 🏛️ Core Architectural Principle

> **"LLM generates and interprets; deterministic application and domain services own scoring, prioritization, state transitions, readiness calculation, and analytics."**

When building or modifying features:

1. **Never let an LLM directly compute or mutate readiness scores.** All readiness points, progress percentages, and mastery numbers are owned by deterministic mathematical domain services.
2. **Never allow non-deterministic state machine transitions.** State machines (onboarding, practice sessions, mock interviews, spaced repetition) must validate transitions through deterministic guards.
3. **Preserve the established design system.** PrepInMinutes has an established design system (`#fbf9f4` canvas, `#ff5520` brand orange, `#1e1c1a` ink, `#7c3aed` purple, `#10b981` emerald, rounded card corners, fluid typography). Do not redesign or invent alternative shells.
4. **Enforce complete mobile responsiveness.** Every view must function flawlessly from 320px mobile viewports up to 4K ultra-wide desktop monitors.

---

## 📂 Documentation Directory Map

```
docs/
├── README.md                                  ← (You are here) Master documentation index
├── TASKS.md                                   ← Master Task & Implementation Index (with file references)
│
├── plan/                                      ← Phase-Wise Implementation Roadmap & Blueprints
│   ├── README.md                              ← Master Plan Index & execution roadmap
│   ├── 00-automation-test-framework.md        ← Phase 0: Test matrix, cloud smoke tests, math assertions
│   ├── 01-persistence-foundation.md           ← Phase 1: Prisma, Neon PostgreSQL, pgvector, schema & seed
│   ├── 02-server-infrastructure-clients.md    ← Phase 2: Prisma singleton, Upstash Redis, R2, Gemini SDK
│   ├── 03-deterministic-domain-core.md        ← Phase 3: Scoring rubric, Bayesian readiness, SM-2 decay
│   ├── 04-edge-security-and-middleware.md     ← Phase 4: Clerk auth guard, Upstash rate limiting, idempotency
│   ├── 05-onboarding-and-vector-pipeline.md   ← Phase 5: Profile APIs, resume parser & pgvector pipeline
│   ├── 06-session-and-evaluation-apis.md      ← Phase 6: Practice submission, mock end, evaluation & revision
│   ├── 07-realtime-voice-gateway.md           ← Phase 7: Deepgram STT, Cartesia TTS & VAD barge-in gateway
│   └── 08-frontend-integration-and-verification.md ← Phase 8: Frontend wiring, 43 routes verify & build
│
├── architecture/
│   ├── infrastructure-setup.md                ← Verified services, Neon, Upstash, R2, Gemini, Voice setup
│   ├── frontend-architecture.md               ← Next.js 16 App Router, client/server split, layouts
│   ├── ui-design-system.md                    ← Colors, typography, components, spacing, mobile rules
│   ├── navigation.md                          ← Sidebar active states, auth guards, mobile drawer
│   ├── agent-development-guidelines.md        ← Boundaries, deterministic rules, checklist for agents
│   └── layers/                                ← Layer-by-Layer Architectural Specifications
│       ├── README.md                          ← Master architectural map & layers index
│       ├── 01-client-presentation-layer.md    ← Next.js 16, React 19, Canvas Whiteboard, Audio dock
│       ├── 02-edge-security-layer.md          ← Edge Auth, Upstash rate limiting, Idempotency
│       ├── 03-realtime-voice-media-layer.md   ← WebSockets, Deepgram STT, Silero VAD, TTS stream
│       ├── 04-ai-orchestration-guardrails-layer.md ← Multi-agent graph, Zod schemas, RAG vectors
│       ├── 05-deterministic-domain-core-layer.md   ← Scoring math, Bayesian readiness, SM-2 decay
│       ├── 06-persistence-storage-layer.md    ← PostgreSQL + pgvector, Redis, S3/R2 storage
│       └── 07-event-driven-analytics-jobs-layer.md ← BullMQ async workers, crons, OpenTelemetry
│
├── dashboard/
│   ├── overview.md                            ← Dashboard mission, core metrics, user journey
│   ├── ui-implementation.md                   ← Layout, 3-step onboarding flow, card hierarchy
│   ├── components.md                          ← Component contracts & props (Stepper, Form, Preview, Workspace)
│   ├── states.md                              ← State machine, loading, empty, and error states
│   ├── api-contract.md                        ← REST/JSON schemas for profile, onboarding, and plan trigger
│   └── agent-implementation.md                ← Step-by-step developer implementation guide & verification
│
├── my-preparation-plan/
│   ├── overview.md                            ← Personalized plan mission, role mapping, time budget
│   ├── ui-implementation.md                   ← Weekly timeline, domain cards, next best action
│   ├── plan-generation.md                     ← Deterministic weighting vs LLM topic synthesis
│   ├── components.md                          ← Component contracts (PlanHeader, ReadinessByArea, Modals)
│   ├── states.md                              ← Plan lifecycle states, recalculation triggers
│   └── agent-implementation.md                ← Agent checklist for modifying or extending prep plans
│
├── practice/
│   ├── overview.md                            ← Practice hub, self-paced learning, topic selector
│   ├── practice-modes.md                      ← System Design, Coding, Behavioral, Cloud workflows
│   ├── topic-practice.md                      ← Interactive workspace (Whiteboard, Waveform, Audio, Code)
│   ├── components.md                          ← Component specifications (SystemDesignWorkspace, WhiteboardModal)
│   ├── states.md                              ← In-session state machine, pausing, timer, submission
│   └── agent-implementation.md                ← Developer instructions for practice modules
│
├── mock-interview/
│   ├── overview.md                            ← Full-length realistic simulation philosophy
│   ├── interview-flow.md                      ← Configure → Briefing → Live Session → Evaluation
│   ├── adaptive-agent.md                      ← Conversational AI boundaries, prompt templates, follow-ups
│   ├── components.md                          ← Component contracts (ConfigureForm, BriefingBar, SessionWorkspace, EvalReport)
│   ├── states.md                              ← Interview session state machine, timers, audio docks
│   └── agent-implementation.md                ← Implementation guide for adding interview types & reports
│
├── evaluation/
│   ├── overview.md                            ← Evaluation hub, feedback philosophy, analytics
│   ├── evaluation-model.md                    ← 6 core evaluation dimensions, rubric scoring
│   ├── readiness-scoring.md                   ← Mathematical readiness algorithm, moving average delta
│   ├── components.md                          ← Component contracts (Charts, Tables, Gauge, Insights)
│   └── agent-implementation.md                ← Agent checklist for evaluation reports
│
└── revision/
    ├── overview.md                            ← Spaced repetition, memory decay, retention science
    ├── revision-queue.md                      ← Queue scheduling algorithm (Ebbinghaus / SM-2 variant)
    ├── recall-flow.md                         ← Rapid reinforcement drill UI & completion handling
    ├── components.md                          ← Component contracts (KnowledgeHealth, RevisionQueueTable, Cards)
    └── agent-implementation.md                ← Implementation guide for revision and decay engines
```

---

## 🔄 The Autonomous Agent Workflow

When assigned an implementation or bug-fixing task:

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Read Domain Overview & UI Specification                  │
│    (e.g., docs/mock-interview/ui-implementation.md)         │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Inspect Component & API Contracts                        │
│    (e.g., docs/mock-interview/components.md & states.md)   │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Follow Deterministic / LLM Boundary Rules                │
│    (LLM generates prose; deterministic service scores)      │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. Implement Code Preserving Existing UI Tokens             │
│    (Desktop + Mobile viewports 320px–1440px)                │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. Execute Agent Implementation Checklist & Build           │
│    (`npm run build` must compile cleanly with 0 errors)     │
└─────────────────────────────────────────────────────────────┘
```
