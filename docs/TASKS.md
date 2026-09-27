# PrepInMinutes — Master Task & Implementation Index

> **Platform Tag**: `prepinminutes`  
> **Last Synchronized**: September 28, 2026  
> **Status**: Active Living Document • 43/43 Static Routes Passing • Full-Stack Blueprint

This index is the **single source of truth** for tracking completed, in-progress, and roadmap tasks across PrepInMinutes. Whenever a task is implemented, modified, or tested, **mark it as done (`[x]`)** and update the associated file references and documentation links.

> [!NOTE] Current Platform Phase & Status
>
> - **Frontend UI & Workspaces**: **100% Completed**. All 43 App Router routes, navigation states, interactive workspaces (HTML5 whiteboard, coding editor with submit confirmation modal, audio docks, mock interviews, and modernized evaluation views) are implemented and compile cleanly.
> - **Backend APIs & Database (`src/app/api/`)**: **0% (Not Started / Blueprint Ready)**. No backend API endpoints (`src/app/api/`) or database models currently exist in the codebase. All REST contracts, Prisma models, domain engines, and worker queues are fully specified in **Part 2** below, ready for step-by-step implementation.

---

## 📌 Instructions for AI Agents & Developers

1. **Marking Tasks Done**: When completing any task, change `- [ ]` to `- [x]` and append the completion date.
2. **File References**: Always preserve absolute or project-relative clickable file links for both `src/` source code and `docs/` specifications.
3. **Cross-Checking Guidelines**: Refer to [`docs/architecture/agent-development-guidelines.md`](./architecture/agent-development-guidelines.md) before implementing changes.
4. **Deterministic Boundary**: Never allow an LLM to directly calculate scores, percentages, or memory decay intervals. Domain math belongs in `src/server/domain/`.

---

## 🚀 Part 1: Frontend & User Experience Registry

### 1. Application Shell, Navigation & Authentication

- [x] **Top-Level Route Map & Layout Shell**
  - **Source Files**: [`src/app/layout.tsx`](../src/app/layout.tsx), [`src/components/dashboard/Sidebar.tsx`](../src/components/dashboard/Sidebar.tsx)
  - **Documentation**: [`docs/architecture/navigation.md`](./architecture/navigation.md), [`docs/architecture/frontend-architecture.md`](./architecture/frontend-architecture.md)
  - **Details**: Standard two-column shell (`lg:flex-row`), `#fbf9f4` canvas, persistent desktop sidebar, and off-canvas mobile drawer.
- [x] **Strict Route Highlighting & Isolation**
  - **Source Files**: [`src/components/dashboard/Sidebar.tsx`](../src/components/dashboard/Sidebar.tsx)
  - **Documentation**: [`docs/architecture/navigation.md`](./architecture/navigation.md)
  - **Details**: Ensures only one primary navigation link is active at any time. Sub-pages like `/mock-interview/system-design/evaluation` highlight only **Mock Interview** and never Evaluation.
- [x] **Sidebar Promotional Card Removal**
  - **Source Files**: [`src/components/dashboard/Sidebar.tsx`](../src/components/dashboard/Sidebar.tsx)
  - **Documentation**: [`docs/architecture/navigation.md`](./architecture/navigation.md), [`docs/evaluation/agent-implementation.md`](./evaluation/agent-implementation.md)
  - **Details**: Removed "Stay consistent!" card across all evaluation routes (`isAnyEvaluationRoute`), mock interview routes, and revision routes for a focused, clean layout.
- [x] **Clerk Authentication Gate**
  - **Source Files**: [`src/components/dashboard/AuthGate.tsx`](../src/components/dashboard/AuthGate.tsx), [`src/app/login/page.tsx`](../src/app/login/page.tsx), [`src/app/sign-up/page.tsx`](../src/app/sign-up/page.tsx)
  - **Documentation**: [`docs/architecture/layers/02-edge-security-layer.md`](./architecture/layers/02-edge-security-layer.md)
  - **Details**: Protects candidate prep data; handles Clerk user profile menu, avatar rendering, and sign-out.

---

### 2. Candidate Dashboard & Onboarding (`/dashboard`)

- [x] **Multi-Step Onboarding Flow (`?step=1|2|3`)**
  - **Source Files**: [`src/components/dashboard/DashboardView.tsx`](../src/components/dashboard/DashboardView.tsx), [`src/components/dashboard/OnboardingFormCard.tsx`](../src/components/dashboard/OnboardingFormCard.tsx)
  - **Documentation**: [`docs/dashboard/ui-implementation.md`](./dashboard/ui-implementation.md), [`docs/dashboard/states.md`](./dashboard/states.md)
  - **Details**: Candidate targets role, seniority (0-2, 3-5, 6-9, 10+), target companies, timeline in weeks, and uploads resume.
- [x] **Readiness Meter & Goal Tracking**
  - **Source Files**: [`src/components/dashboard/StartPreparingWorkspace.tsx`](../src/components/dashboard/StartPreparingWorkspace.tsx), [`src/components/dashboard/GoalCard.tsx`](../src/components/dashboard/GoalCard.tsx)
  - **Documentation**: [`docs/dashboard/components.md`](./dashboard/components.md), [`docs/evaluation/readiness-scoring.md`](./evaluation/readiness-scoring.md)
  - **Details**: Circular readiness gauge displaying current hiring bar percentage, weekly goal hours, daily streak counter, and Next Best Action card.
- [x] **Hydration-Safe LocalStorage Synchronization**
  - **Source Files**: [`src/components/dashboard/DashboardView.tsx`](../src/components/dashboard/DashboardView.tsx)
  - **Documentation**: [`docs/dashboard/agent-implementation.md`](./dashboard/agent-implementation.md)
  - **Details**: Uses `useSyncExternalStore` to read onboarding state without SSR hydration mismatches.

---

### 3. Personalized Preparation Plan (`/preparation-plan`)

- [x] **Curriculum & Roadmap Generation**
  - **Source Files**: [`src/app/preparation-plan/page.tsx`](../src/app/preparation-plan/page.tsx), [`src/components/preparation-plan/PlanReadyWorkspace.tsx`](../src/components/preparation-plan/PlanReadyWorkspace.tsx)
  - **Documentation**: [`docs/my-preparation-plan/overview.md`](./my-preparation-plan/overview.md), [`docs/my-preparation-plan/plan-generation.md`](./my-preparation-plan/plan-generation.md)
  - **Details**: Domain-weighted syllabus across System Design, Algorithms, Behavioral (STAR), and Cloud based on target role seniority.
- [x] **Weekly Timeline & Study Hours Allocation**
  - **Source Files**: [`src/components/preparation-plan/PreparationPlanWorkspace.tsx`](../src/components/preparation-plan/PreparationPlanWorkspace.tsx)
  - **Documentation**: [`docs/my-preparation-plan/components.md`](./my-preparation-plan/components.md)
  - **Details**: Step-by-step weekly milestone tracker with completed vs remaining study hours.

---

### 4. Interactive Practice Hub (`/practice`)

- [x] **Domain Topic Picker (`/practice/choose-topic`)**
  - **Source Files**: [`src/components/practice/ChooseTopicWorkspace.tsx`](../src/components/practice/ChooseTopicWorkspace.tsx)
  - **Documentation**: [`docs/practice/overview.md`](./practice/overview.md), [`docs/practice/topic-practice.md`](./practice/topic-practice.md)
  - **Details**: Filter cards across System Design, Coding, Behavioral, and Cloud with difficulty tags.
- [x] **System Design Interactive Workspace (`/practice/session/system-design`)**
  - **Source Files**: [`src/components/practice/SystemDesignWorkspace.tsx`](../src/components/practice/SystemDesignWorkspace.tsx)
  - **Documentation**: [`docs/practice/practice-modes.md`](./practice/practice-modes.md)
  - **Details**: Live AI interviewer chat, ticking elapsed timer, dual voice/text dock, and end confirmation modal.
- [x] **Full-Screen Collaborative Whiteboard Engine**
  - **Source Files**: [`src/components/practice/WhiteboardModal.tsx`](../src/components/practice/WhiteboardModal.tsx)
  - **Documentation**: [`docs/architecture/layers/01-client-presentation-layer.md`](./architecture/layers/01-client-presentation-layer.md)
  - **Details**: Canvas render loop, vector shapes (DBs, load balancers, servers), sticky notes, pen/eraser, high-DPI retina scaling, PNG export, and window event listener cleanup.
- [x] **Coding Workspace & Streamlined Submit Confirmation Modal (`/practice/session/coding`)**
  - **Source Files**: [`src/components/practice/PracticeCodingWorkspace.tsx`](../src/components/practice/PracticeCodingWorkspace.tsx)
  - **Documentation**: [`docs/practice/practice-modes.md`](./practice/practice-modes.md), [`docs/practice/states.md`](./practice/states.md), [`docs/practice/agent-implementation.md`](./practice/agent-implementation.md)
  - **Details**:
    - Problem description, JavaScript (ES6) / Python 3 editor, test runner execution banner.
    - Confirmation Modal on Submit:
      - Title: `Submit Coding Solution?`
      - Description: `Are you ready to submit your code for evaluation? Your implementation will be analyzed across test correctness, algorithmic complexity, and code quality.`
      - Actions: `Continue Session` and `Confirm & Submit`.
    - Mobile touch-stacked action buttons (`flex-col-reverse sm:flex-row`).
- [x] **AI-Powered 3D/AR Coding Solution & Explanation System (Exclusive to `/practice/session/coding`)**
  - **Source Files**:
    - Master Explorer: [`src/components/practice/coding-ar/ARSolutionExplorer.tsx`](../src/components/practice/coding-ar/ARSolutionExplorer.tsx)
    - Three.js WebGL/WebXR Viewport: [`src/components/practice/coding-ar/ARSceneCanvas.tsx`](../src/components/practice/coding-ar/ARSceneCanvas.tsx)
    - Step Timeline & Playback Scrubber: [`src/components/practice/coding-ar/ARControls.tsx`](../src/components/practice/coding-ar/ARControls.tsx)
    - Synchronized Code Viewer: [`src/components/practice/coding-ar/SynchronizedCodeViewer.tsx`](../src/components/practice/coding-ar/SynchronizedCodeViewer.tsx)
    - Live Variables & State Inspector: [`src/components/practice/coding-ar/LiveVariablesInspector.tsx`](../src/components/practice/coding-ar/LiveVariablesInspector.tsx)
    - Concise What/Why/Result Card: [`src/components/practice/coding-ar/StepExplanationCard.tsx`](../src/components/practice/coding-ar/StepExplanationCard.tsx)
    - Algorithmic Complexity Explorer: [`src/components/practice/coding-ar/ComplexityVisualizer.tsx`](../src/components/practice/coding-ar/ComplexityVisualizer.tsx)
    - Interactive Checkpoint Quiz: [`src/components/practice/coding-ar/LearnWithARQuiz.tsx`](../src/components/practice/coding-ar/LearnWithARQuiz.tsx)
    - 3D Procedural Scene Builder: [`src/components/practice/coding-ar/renderers/SceneBuilder.ts`](../src/components/practice/coding-ar/renderers/SceneBuilder.ts)
    - 10 Reference Problems & Execution Traces: [`src/components/practice/coding-ar/problems/index.ts`](../src/components/practice/coding-ar/problems/index.ts)
  - **Documentation**: [`docs/practice/practice-modes.md`](./practice/practice-modes.md)
  - **Details**:
    - Strictly scoped to `/practice/session/coding`; non-destructive (user's code editor is never overwritten).
    - Procedural Three.js 3D rendering for 8 data structure families (Arrays, Sliding Windows, HashMaps, Stacks, Queues, Linked Lists, Trees, Call Stacks).
    - WebXR device detection with automatic fallback to interactive 3D WebGL (OrbitControls, zoom, camera reset, light/dark themes).
    - Step scrubber with auto-play (0.5x–2x speed), keyboard shortcuts (`Space`, `ArrowLeft`, `ArrowRight`, `R`), fullscreen expansion.
    - Synchronized code line highlights, variable inspector, Big-O comparison metrics, and checkpoint quizzes.
- [x] **Behavioral (STAR) & Cloud Infrastructure Workspaces**
  - **Source Files**: [`src/components/practice/BehavioralWorkspace.tsx`](../src/components/practice/BehavioralWorkspace.tsx), [`src/components/practice/CloudWorkspace.tsx`](../src/components/practice/CloudWorkspace.tsx)
  - **Documentation**: [`docs/practice/practice-modes.md`](./practice/practice-modes.md)
  - **Details**: STAR methodology coaching guides and AWS/GCP cloud architecture scenarios.

---

### 5. Full-Length Mock Interview Ecosystem (`/mock-interview/*`)

- [x] **Mock Interview Landing & History Hub (`/mock-interview`)**
  - **Source Files**: [`src/app/mock-interview/page.tsx`](../src/app/mock-interview/page.tsx), [`src/components/mock-interview/MockInterviewWorkspace.tsx`](../src/components/mock-interview/MockInterviewWorkspace.tsx)
  - **Documentation**: [`docs/mock-interview/overview.md`](./mock-interview/overview.md)
  - **Details**: Weakness-based recommendations, 5 interview categories, past interview table (desktop) and cards (mobile).
- [x] **3-Step Configuration Stepper (`/mock-interview/configure`)**
  - **Source Files**: [`src/components/mock-interview/configuration/MockInterviewConfigurationWorkspace.tsx`](../src/components/mock-interview/configuration/MockInterviewConfigurationWorkspace.tsx)
  - **Documentation**: [`docs/mock-interview/interview-flow.md`](./mock-interview/interview-flow.md)
  - **Details**: Select interview type, target role, difficulty, duration, and focus areas with live preview summary card.
- [x] **Pre-Interview Briefing Page (`/mock-interview/briefing`)**
  - **Source Files**: [`src/components/mock-interview/briefing/MockInterviewBriefingWorkspace.tsx`](../src/components/mock-interview/briefing/MockInterviewBriefingWorkspace.tsx)
  - **Documentation**: [`docs/mock-interview/interview-flow.md`](./mock-interview/interview-flow.md)
  - **Details**: 5-stage interview flow diagram, 6 evaluation criteria badges, essential preparation tips.
- [x] **Live Mock Interview Workspace (`/mock-interview/interview-session`)**
  - **Source Files**: [`src/components/mock-interview/session/MockInterviewSessionWorkspace.tsx`](../src/components/mock-interview/session/MockInterviewSessionWorkspace.tsx)
  - **Documentation**: [`docs/mock-interview/states.md`](./mock-interview/states.md)
  - **Details**: 4-stage progression track, Staff Engineer AI persona, animated 24-frequency waveform dock, embedded Whiteboard, tools drawer, and end session modal.
- [x] **Mock System Design Evaluation Report (`/mock-interview/system-design/evaluation`)**
  - **Source Files**: [`src/components/mock-interview/evaluation/MockSystemDesignEvaluationWorkspace.tsx`](../src/components/mock-interview/evaluation/MockSystemDesignEvaluationWorkspace.tsx)
  - **Documentation**: [`docs/mock-interview/components.md`](./mock-interview/components.md)
  - **Details**: 84/100 score gauge, Strong Hire badge, +6% readiness delta, 6-dimension rubric, concrete architectural strengths/improvements, stage progression timeline.

---

### 6. Evaluation Hub & Modernized Session Reports

- [x] **Evaluation Page Modernization Across All Domains**
  - **Source Files**:
    - [`src/components/practice/SystemDesignEvaluation.tsx`](../src/components/practice/SystemDesignEvaluation.tsx)
    - [`src/components/practice/CodingEvaluation.tsx`](../src/components/practice/CodingEvaluation.tsx)
    - [`src/components/practice/CloudEvaluation.tsx`](../src/components/practice/CloudEvaluation.tsx)
    - [`src/components/practice/BehavioralEvaluation.tsx`](../src/components/practice/BehavioralEvaluation.tsx)
    - [`src/components/mock-interview/evaluation/MockSystemDesignEvaluationWorkspace.tsx`](../src/components/mock-interview/evaluation/MockSystemDesignEvaluationWorkspace.tsx)
  - **Documentation**: [`docs/evaluation/components.md`](./evaluation/components.md), [`docs/evaluation/agent-implementation.md`](./evaluation/agent-implementation.md)
  - **Details**: Shared modern rubric layout, gauge score ring, baseline to target readiness pill, strengths/weaknesses cards, and recommendations.
- [x] **Mobile Responsiveness for Evaluation Views**
  - **Source Files**: All evaluation components listed above.
  - **Documentation**: [`docs/evaluation/agent-implementation.md`](./evaluation/agent-implementation.md)
  - **Details**: 2-column mobile quick action grid (`col-span-2` for Retake Drill), responsive SVG score gauge, `min-w-0` overflow guards, full-width touch bottom navigation.
- [x] **Main Evaluation Analytics Hub (`/evaluation`)**
  - **Source Files**: [`src/app/evaluation/page.tsx`](../src/app/evaluation/page.tsx), [`src/components/evaluation/EvaluationWorkspace.tsx`](../src/components/evaluation/EvaluationWorkspace.tsx)
  - **Documentation**: [`docs/evaluation/overview.md`](./evaluation/overview.md)
  - **Details**: Readiness growth trendlines, performance by area cards, and weekly evaluation logs.

---

### 7. Revision & Spaced Repetition Module (`/revision`)

- [x] **Revision Landing & Knowledge Health Queue**
  - **Source Files**: [`src/app/revision/page.tsx`](../src/app/revision/page.tsx), [`src/components/revision/RevisionWorkspace.tsx`](../src/components/revision/RevisionWorkspace.tsx)
  - **Documentation**: [`docs/revision/overview.md`](./revision/overview.md), [`docs/revision/revision-queue.md`](./revision/revision-queue.md)
  - **Details**: Spaced repetition schedule based on Ebbinghaus memory decay, automated weakness queuing for topics scoring $< 60\%$.
- [ ] **Interactive Rapid Recall Flashcard Modal**
  - **Target Source Files**: `src/components/revision/RecallDrillModal.tsx`, `src/app/api/revision/drill/submit/route.ts`
  - **Documentation**: [`docs/revision/recall-flow.md`](./revision/recall-flow.md)
  - **Planned Scope**: Micro-drills providing active recall testing with immediate spaced interval updates.

---

## ⚙️ Part 2: Backend Architecture & Implementation Blueprint

This section provides complete implementation specifications for backend engineers and AI coding agents.

### 8. Database & Persistence Layer (`prisma/`)

- [ ] **Task 8.1: Prisma Schema & Extensions**
  - **Target File**: `prisma/schema.prisma`
  - **Specification**: [`docs/architecture/layers/06-persistence-storage-layer.md`](./architecture/layers/06-persistence-storage-layer.md)
  - **Required Models**:
    - `User`: `id`, `clerkId` (unique), `email` (unique), `fullName`, `createdAt`.
    - `CandidateProfile`: `userId` (1:1 with User), `targetRole`, `experienceLevel`, `targetCompanies` (string array), `timelineWeeks`, `readinessScore` (int 0–100), `weeklyGoalHours`, `completedHours`, `streakDays`.
    - `PreparationPlan`: `candidateId`, `targetSeniority`, `status`, `weeksTotal`, `milestones` (JSON).
    - `Topic`: `domain` (system-design, coding, behavioral, cloud), `slug` (unique), `title`, `difficulty`, `estimatedMinutes`.
    - `PracticeSession`: `candidateId`, `domain`, `topicSlug`, `durationSeconds`, `status` (`ACTIVE`, `COMPLETED`, `ABANDONED`).
    - `MockInterviewSession`: `candidateId`, `interviewType`, `targetRole`, `difficulty`, `durationMinutes`, `status` (`CONFIGURING`, `ACTIVE`, `EVALUATING`, `COMPLETED`).
    - `EvaluationReport`: `practiceId` / `mockId` (1:1 unique), `overallScore`, `verdict`, `readinessDelta`, `evaluatorNotes`, `strengths`, `improvements`.
    - `RubricScore`: `reportId` (foreign key), `dimension` (enum), `score` (float 1.0–10.0), `assessment` (text).
    - `RevisionItem`: `candidateId`, `topicId`, `intervalDays`, `easeFactor` (float), `repetitions` (int), `nextReviewDate` (DateTime indexed).
    - `DocumentEmbedding`: `candidateId`, `docType` (`resume` | `job_description`), `content` (text), `embedding` (`vector(1536)`).
  - **Commands**:
    ```bash
    npx prisma migrate dev --name init_platform_schema
    npx prisma generate
    ```
- [ ] **Task 8.2: Database Client Singleton & Tenant Scoping**
  - **Target File**: `src/server/db/client.ts`
  - **Specification**: [`docs/architecture/layers/06-persistence-storage-layer.md`](./architecture/layers/06-persistence-storage-layer.md)
  - **Requirements**:
    - Global singleton client preventing connection exhaustion during Next.js hot reload.
    - Tenant isolation helper `withCandidateContext(clerkUserId)` guaranteeing queries always scope to authenticated candidate.
- [ ] **Task 8.3: Topic & Curriculum Catalog Seeding**
  - **Target File**: `prisma/seed.ts`
  - **Requirements**: Populate baseline catalogs for 40+ system design topics, 50+ algorithm patterns, 20+ STAR behavioral questions, and 25+ cloud infrastructure scenarios.

---

### 9. Edge Gateway, Auth & Idempotency Services

- [ ] **Task 9.1: Edge Middleware Token Verification & Route Matching**
  - **Target File**: `src/middleware.ts`
  - **Specification**: [`docs/architecture/layers/02-edge-security-layer.md`](./architecture/layers/02-edge-security-layer.md)
  - **Requirements**:
    - Wrap `clerkMiddleware()` with `createRouteMatcher` for public vs protected routes.
    - Extract user session token and inject `x-candidate-id` header into downstream requests.
- [ ] **Task 9.2: Distributed Rate Limiter**
  - **Target File**: `src/server/edge/rate-limiter.ts`
  - **Specification**: [`docs/architecture/layers/02-edge-security-layer.md`](./architecture/layers/02-edge-security-layer.md)
  - **Requirements**:
    - Upstash Redis sliding window limiter.
    - 60 requests/minute for general navigation; 10 requests/minute for `/api/ai/*` evaluation triggers.
    - Returns HTTP 429 with standard `Retry-After` header when tripped.
- [ ] **Task 9.3: Submission Idempotency Interceptor**
  - **Target File**: `src/server/edge/idempotency.ts`
  - **Specification**: [`docs/architecture/layers/02-edge-security-layer.md`](./architecture/layers/02-edge-security-layer.md)
  - **Requirements**:
    - Checks `Idempotency-Key` header on `/api/practice/session/submit` and `/api/mock-interview/session/end`.
    - Returns cached Redis response payload if duplicate request arrives within 24 hours.

---

### 10. REST API Contracts & Endpoint Implementations

- [ ] **Task 10.1: Candidate Profile & Onboarding API**
  - **Target File**: `src/app/api/onboarding/profile/route.ts`
  - **Method**: `POST`
  - **Request Body**:
    ```ts
    interface OnboardingRequest {
      targetRole: string;
      experienceLevel: "0-2" | "3-5" | "6-9" | "10+";
      timelineWeeks: number;
      targetCompanies: string[];
    }
    ```
  - **Response (`200 OK`)**:
    ```json
    { "success": true, "profileId": "cand_98124", "readinessScore": 45 }
    ```
- [ ] **Task 10.2: Resume Upload & Vector Embedding Pipeline**
  - **Target File**: `src/app/api/onboarding/resume/route.ts`
  - **Specification**: [`docs/architecture/layers/04-ai-orchestration-guardrails-layer.md`](./architecture/layers/04-ai-orchestration-guardrails-layer.md)
  - **Method**: `POST (multipart/form-data)`
  - **Requirements**:
    - Parse PDF/DOCX using `pdf-parse`.
    - Chunk text into 512-token segments (64-token overlap).
    - Generate 1,536-dimensional embeddings (`text-embedding-3-small`).
    - Save chunks into `DocumentEmbedding` table with `pgvector` indexing.
- [ ] **Task 10.3: Practice Session Submission Endpoint**
  - **Target File**: `src/app/api/practice/session/submit/route.ts`
  - **Specification**: [`docs/practice/states.md`](./practice/states.md)
  - **Method**: `POST`
  - **Headers**: `Idempotency-Key: ${sessionId}:${attempt}`
  - **Request Body**:
    ```json
    {
      "sessionId": "prac_sd_1029",
      "domain": "coding",
      "codeSnippet": "function maxSum(arr, k) { ... }",
      "language": "javascript",
      "durationSeconds": 1409
    }
    ```
  - **Logic**:
    - Validates idempotency key.
    - Transitions session status to `EVALUATING`.
    - Enqueues job to BullMQ `queue:evaluations`.
    - Returns HTTP 202 Accepted: `{ "status": "EVALUATING", "reportUrl": "/practice/session/coding/evaluation" }`.
- [ ] **Task 10.4: Mock Interview Lifecycle Endpoints**
  - **Target Files**:
    - `src/app/api/mock-interview/session/configure/route.ts` (`POST`)
    - `src/app/api/mock-interview/session/start/route.ts` (`POST`)
    - `src/app/api/mock-interview/session/end/route.ts` (`POST`)
  - **Specification**: [`docs/mock-interview/interview-flow.md`](./mock-interview/interview-flow.md)
  - **Transition Invariant**: State transitions must strictly follow `CONFIGURING` $\to$ `ACTIVE` $\to$ `EVALUATING` $\to$ `COMPLETED`. Illegal skips return HTTP 400.
- [ ] **Task 10.5: Evaluation Report Retrieval Endpoint**
  - **Target File**: `src/app/api/evaluation/[id]/route.ts`
  - **Method**: `GET`
  - **Response (`200 OK`)**: Conforms to `EvaluationRubricSchema` with overall score, verdict, readiness delta, strengths, improvements, and rubric dimensions.
- [ ] **Task 10.6: Spaced Repetition Queue & Recall Submission API**
  - **Target Files**:
    - `src/app/api/revision/queue/route.ts` (`GET`)
    - `src/app/api/revision/drill/submit/route.ts` (`POST`)
  - **Specification**: [`docs/revision/recall-flow.md`](./revision/recall-flow.md)
  - **Request Body (`POST`)**:
    ```json
    { "revisionItemId": "rev_3910", "quality": 4 }
    ```
  - **Logic**: Evaluates quality $q \in [0, 5]$, updates $EF$ and interval $I(n)$ via the SM-2 decay engine, and schedules `nextReviewDate`.

---

### 11. Real-Time Voice Streaming Gateway Service

- [ ] **Task 11.1: Standalone WebSocket Voice Gateway Server**
  - **Target File**: `src/server/websocket/voice-server.ts`
  - **Specification**: [`docs/architecture/layers/03-realtime-voice-media-layer.md`](./architecture/layers/03-realtime-voice-media-layer.md)
  - **Protocol**: `wss://stream.prepinminutes.com/v1/voice-session`
  - **Requirements**:
    - Authenticate Clerk JWT token during connection upgrade.
    - Ingress: Accept 100ms Opus audio buffers from candidate browser.
    - Pipe audio into Deepgram Nova-2 streaming WebSocket client.
    - Egress: Stream LLM token responses into Cartesia Sonic / ElevenLabs Turbo v2 TTS.
    - Return chunked audio frames back over the socket to client.
- [ ] **Task 11.2: Server-Side Barge-In Interruption Handler**
  - **Target File**: `src/server/websocket/barge-in-handler.ts`
  - **Specification**: [`docs/architecture/layers/03-realtime-voice-media-layer.md`](./architecture/layers/03-realtime-voice-media-layer.md)
  - **Requirements**:
    - Listens for `{"type": "control.interrupt"}` packet or VAD trigger.
    - Instantly executes `AbortController.abort()` on the running TTS audio stream.
    - Flushes outbound socket audio buffer within $< 150\text{ms}$.

---

### 12. AI Agent Orchestration & Guardrails Layer

- [ ] **Task 12.1: Adaptive Interviewer Agent State Machine**
  - **Target File**: `src/server/ai/interviewer-agent.ts`
  - **Specification**: [`docs/architecture/layers/04-ai-orchestration-guardrails-layer.md`](./architecture/layers/04-ai-orchestration-guardrails-layer.md)
  - **Requirements**:
    - Drives the 4 interview stages: Requirements (0–10m) $\to$ High-Level Design (10–25m) $\to$ Deep Dive (25–38m) $\to$ Scale & Bottlenecks (38–45m).
    - Staff Engineer persona ("Sarah") challenging single points of failure, partition limits, and Redis cache stampedes.
- [ ] **Task 12.2: Rubric Evaluator Agent & Strict Zod Validation**
  - **Target File**: `src/server/ai/evaluator-agent.ts`
  - **Specification**: [`docs/architecture/layers/04-ai-orchestration-guardrails-layer.md`](./architecture/layers/04-ai-orchestration-guardrails-layer.md)
  - **Schema**: Must validate LLM JSON output against `EvaluationRubricSchema`.
  - **Retry Policy**: On validation failure, auto-retries prompt with schema validation error up to 2 times before deterministic fallback.
- [ ] **Task 12.3: In-Context Candidate RAG Retrieval Service**
  - **Target File**: `src/server/ai/rag-pipeline.ts`
  - **Specification**: [`docs/architecture/layers/04-ai-orchestration-guardrails-layer.md`](./architecture/layers/04-ai-orchestration-guardrails-layer.md)
  - **Requirements**:
    - Queries `DocumentEmbedding` using cosine distance (`<=>` operator in SQL).
    - Injects candidate's past technologies and target company focus into the interviewer's system prompt.

---

### 13. Deterministic Domain Core Engines

- [ ] **Task 13.1: Mathematical Scoring & Rubric Service**
  - **Target File**: `src/server/domain/scoring-engine.ts`
  - **Specification**: [`docs/architecture/layers/05-deterministic-domain-core-layer.md`](./architecture/layers/05-deterministic-domain-core-layer.md)
  - **Formula**:
    $$S = 10 \times \sum_{i=1}^{6} (w_i \cdot s_i)$$
  - **Weights**: Technical Depth (0.25), Reasoning (0.25), Data Modeling (0.20), Communication (0.15), Scalability (0.15).
- [ ] **Task 13.2: Bayesian Candidate Readiness Trajectory Engine**
  - **Target File**: `src/server/domain/readiness-engine.ts`
  - **Specification**: [`docs/architecture/layers/05-deterministic-domain-core-layer.md`](./architecture/layers/05-deterministic-domain-core-layer.md)
  - **Formula**:
    $$R_{\text{new}} = \text{round}\Big( R_{\text{old}} \cdot (1 - \alpha) + S_{\text{session}} \cdot \alpha \cdot \beta_{\text{difficulty}} \Big)$$
  - **Invariants**: Computes $\Delta R = R_{\text{new}} - R_{\text{old}}$; output bounded strictly between $0$ and $100$.
- [ ] **Task 13.3: Spaced Repetition Decay Engine (SuperMemo SM-2)**
  - **Target File**: `src/server/domain/sm2-decay-engine.ts`
  - **Specification**: [`docs/architecture/layers/05-deterministic-domain-core-layer.md`](./architecture/layers/05-deterministic-domain-core-layer.md)
  - **Formulas**: Computes updated Easiness Factor ($EF \ge 1.3$) and next review interval $I(n)$.
  - **Trigger**: Automatically queues topics where session score was $< 60\%$.

---

### 14. Asynchronous Background Workers & Jobs

- [ ] **Task 14.1: BullMQ Evaluation Worker**
  - **Target File**: `src/server/workers/evaluation-worker.ts`
  - **Specification**: [`docs/architecture/layers/07-event-driven-analytics-jobs-layer.md`](./architecture/layers/07-event-driven-analytics-jobs-layer.md)
  - **Queue**: `queue:evaluations`
  - **Pipeline**:
    1. Consumes `mock.session.completed` / `practice.session.submitted`.
    2. Runs `evaluator-agent.ts` to get rubric feedback.
    3. Runs `scoring-engine.ts` and `readiness-engine.ts`.
    4. Writes `EvaluationReport` and `RubricScore` records.
    5. Dispatches event `evaluation.report.generated`.
- [ ] **Task 14.2: Automated PDF Report Generator Worker**
  - **Target File**: `src/server/workers/pdf-worker.ts`
  - **Queue**: `queue:pdf-export`
  - **Requirements**: Renders evaluation report template via Puppeteer, compiles PDF, uploads to S3 bucket, and stores signed URL.
- [ ] **Task 14.3: Daily Memory Decay & Streak Maintenance Cron**
  - **Target File**: `src/server/workers/decay-cron-worker.ts`
  - **Schedule**: `0 0 * * *` (Midnight UTC)
  - **Requirements**:
    - Scans `RevisionItem` table for items where `nextReviewDate <= NOW()`.
    - Updates knowledge health decay score.
    - Increments or resets candidate activity streaks based on daily study hour targets.

---

## 🔐 Part 3: Environment Variables & Secrets Manifest

Every environment variable required by the backend services must be defined in `.env.local` (development) or production secret manager:

```env
# ── 1. Database & Persistence ──
DATABASE_URL="postgresql://user:password@localhost:5432/prepinminutes?schema=public"
DIRECT_URL="postgresql://user:password@localhost:5432/prepinminutes?schema=public"

# ── 2. Redis & Caching ──
REDIS_URL="redis://localhost:6379"
UPSTASH_REDIS_REST_URL="https://your-upstash-redis.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your_upstash_token"

# ── 3. Authentication (Clerk) ──
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."

# ── 4. AI & LLM Providers ──
OPENAI_API_KEY="sk-proj-..."
ANTHROPIC_API_KEY="sk-ant-..."

# ── 5. Real-Time Audio Streaming (STT & TTS) ──
DEEPGRAM_API_KEY="your_deepgram_api_key"
ELEVENLABS_API_KEY="your_elevenlabs_api_key"
CARTESIA_API_KEY="your_cartesia_api_key"

# ── 6. Cloud Object Storage (S3 / Cloudflare R2) ──
AWS_ACCESS_KEY_ID="your_aws_access_key"
AWS_SECRET_ACCESS_KEY="your_aws_secret_key"
AWS_REGION="us-east-1"
AWS_S3_BUCKET="prepinminutes-assets"

# ── 7. Observability & Telemetry ──
SENTRY_DSN="https://...@sentry.io/..."
OTEL_EXPORTER_OTLP_ENDPOINT="http://localhost:4318"
```

---

## 🛠️ Part 4: Step-by-Step AI Agent Execution Guide

When an AI agent is instructed to implement any backend task:

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Locate Task in Part 2 of docs/TASKS.md                   │
│    (e.g., Task 10.3: Practice Session Submission Endpoint)  │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Read Layer Specification in docs/architecture/layers/    │
│    (Inspect exact schemas, formulas, and Zod definitions)   │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Implement Code in Target File Path                       │
│    (Preserve tenant isolation, idempotency, strict typing)  │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. Run Build & Unit Tests                                   │
│    (`npm run build` must compile cleanly with 0 errors)     │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. Mark Task Complete in docs/TASKS.md                      │
│    (Change `- [ ]` to `- [x]` and record completion date)   │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Platform Task Completion Summary

| Functional Area                   | Total Tasks | Completed (`[x]`) | In Progress (`[-]`) | Pending (`[ ]`) | Completion %        |
| --------------------------------- | ----------- | ----------------- | ------------------- | --------------- | ------------------- |
| **1. Application Shell & Nav**    | 4           | 4                 | 0                   | 0               | **100%**            |
| **2. Dashboard & Onboarding**     | 3           | 3                 | 0                   | 0               | **100%**            |
| **3. Preparation Plan**           | 2           | 2                 | 0                   | 0               | **100%**            |
| **4. Practice Hub**               | 5           | 5                 | 0                   | 0               | **100%**            |
| **5. Mock Interview Ecosystem**   | 5           | 5                 | 0                   | 0               | **100%**            |
| **6. Evaluation Hub & Reports**   | 3           | 3                 | 0                   | 0               | **100%**            |
| **7. Revision Module**            | 2           | 1                 | 0                   | 1               | **50%**             |
| **8. Database & Persistence**     | 3           | 0                 | 0                   | 3               | **0% (Spec Ready)** |
| **9. Edge Gateway & Security**    | 3           | 0                 | 0                   | 3               | **0% (Spec Ready)** |
| **10. REST API Contracts**        | 6           | 0                 | 0                   | 6               | **0% (Spec Ready)** |
| **11. Voice Streaming Gateway**   | 2           | 0                 | 0                   | 2               | **0% (Spec Ready)** |
| **12. AI Agent Orchestration**    | 3           | 0                 | 0                   | 3               | **0% (Spec Ready)** |
| **13. Deterministic Domain Core** | 3           | 0                 | 0                   | 3               | **0% (Spec Ready)** |
| **14. Asynchronous Workers**      | 3           | 0                 | 0                   | 3               | **0% (Spec Ready)** |
| **Total Platform Tasks**          | **47**      | **23**            | **0**               | **24**          | **48.9% Total**     |
