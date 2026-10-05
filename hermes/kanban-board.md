# Hermes Kanban Board — PrepInMinutes Master Task Plan

> **Hermes Integration Board**: Full lifecycle tracking of PrepInMinutes full-stack implementation across 8 architectural phases.

---

## 📊 Board Overview & Columns

| Column                        | Description                                       | WIP Limit |
| :---------------------------- | :------------------------------------------------ | :-------: |
| 📋 **Backlog**                | Defined tasks queued for development              | $\infty$  |
| 🔄 **In Progress**            | Actively being coded                              |     2     |
| 🧪 **Testing & Verification** | Code written, automated test suite executing      |     2     |
| ✅ **Done (Cleared)**         | 100% tests passing, zero UI regressions, verified | $\infty$  |

---

## 🗂️ Task Breakdown by Phase

### Phase 1: Persistence Foundation (Neon PostgreSQL & pgvector)

- [ ] **`TASK-P1-01`**: **Database Schema Design (`prisma/schema.prisma`)**
  - **Column**: `In Progress`
  - **Domain**: Persistence & Storage
  - **Scope**: Author 10 core relational models (`User`, `CandidateProfile`, `PreparationPlan`, `Topic`, `PracticeSession`, `MockInterviewSession`, `EvaluationReport`, `RubricScore`, `RevisionItem`, `DocumentEmbedding`), PostgreSQL enums, and `pgvector(1536)` extension.
  - **Deliverable**: `prisma/schema.prisma`
  - **Clearance**: Passes `npx prisma validate`.

- [ ] **`TASK-P1-02`**: **Dual Connection Configuration & Prisma Adapters**
  - **Column**: `Backlog`
  - **Domain**: Infrastructure
  - **Scope**: Configure Neon pooled connection (`DATABASE_URL`) with `@prisma/adapter-neon` and direct connection (`DIRECT_URL`) for advisory lock migration safety.
  - **Deliverable**: `src/server/db/client.ts`
  - **Clearance**: Database connection smoke test returns live timestamp from Neon.

- [ ] **`TASK-P1-03`**: **Database Migration Push to Neon PostgreSQL**
  - **Column**: `Backlog`
  - **Domain**: Database Operations
  - **Scope**: Execute `npx prisma db push` to synchronize 10 tables and vector extension with live Neon cloud instance.
  - **Deliverable**: Live tables in Neon schema `public`.
  - **Clearance**: `SELECT tablename FROM pg_tables WHERE schemaname = 'public';` verifies all 10 tables.

- [ ] **`TASK-P1-04`**: **Curriculum Catalog Seeding (`prisma/seed.ts`)**
  - **Column**: `Backlog`
  - **Domain**: Catalog Content
  - **Scope**: Seed 135+ topics across System Design (40+), Algorithms (50+), Behavioral (20+), and Cloud (25+).
  - **Deliverable**: `prisma/seed.ts`
  - **Clearance**: `npx prisma db seed` inserts $>135$ records without constraint errors.

---

### Phase 2: Server Infrastructure Clients

- [ ] **`TASK-P2-01`**: **Prisma Client Singleton with Tenant Isolation**
  - **Column**: `Backlog`
  - **Scope**: Build `withCandidateContext(clerkUserId)` helper ensuring all queries are tenant-scoped.
  - **Deliverable**: `src/server/db/client.ts`

- [ ] **`TASK-P2-02`**: **Upstash Redis Client Singleton**
  - **Column**: `Backlog`
  - **Scope**: Centralized REST client with automatic retry and rate-limiting wrapper.
  - **Deliverable**: `src/server/redis/client.ts`

- [ ] **`TASK-P2-03`**: **Cloudflare R2 Object Storage S3 Client**
  - **Column**: `Backlog`
  - **Scope**: Presigned URL generator and multipart upload handler for whiteboard PNGs and audio.
  - **Deliverable**: `src/server/storage/r2.ts`

- [ ] **`TASK-P2-04`**: **Google Gemini SDK Singleton**
  - **Column**: `Backlog`
  - **Scope**: Client wrapper for `gemini-3.1-flash-lite` and `gemini-embedding-001`.
  - **Deliverable**: `src/server/ai/gemini.ts`

---

### Phase 3: Deterministic Domain Core

- [ ] **`TASK-P3-01`**: **5-Dimension Rubric Scoring Engine**
  - **Column**: `Backlog`
  - **Scope**: Mathematical calculation of 0–100 overall score using weighted harmonic mean.
  - **Deliverable**: `src/server/domain/scoring.ts`

- [ ] **`TASK-P3-02`**: **Bayesian Candidate Readiness Engine**
  - **Column**: `Backlog`
  - **Scope**: Prior readiness score updated via Bayesian evidence weighting per completed session.
  - **Deliverable**: `src/server/domain/readiness.ts`

- [ ] **`TASK-P3-03`**: **SuperMemo-2 Spaced Repetition Engine**
  - **Column**: `Backlog`
  - **Scope**: Calculates next review intervals and ease factor decay based on candidate grade.
  - **Deliverable**: `src/server/domain/spaced-repetition.ts`

---

### Phase 4: Edge Security & Middleware

- [ ] **`TASK-P4-01`**: **Clerk Edge Authentication Route Guard**
  - **Column**: `Backlog`
  - **Deliverable**: `src/middleware.ts`

- [ ] **`TASK-P4-02`**: **Upstash Sliding Window Rate Limiter**
  - **Column**: `Backlog`
  - **Deliverable**: `src/server/edge/rate-limiter.ts`

- [ ] **`TASK-P4-03`**: **Idempotency Key Interceptor**
  - **Column**: `Backlog`
  - **Deliverable**: `src/server/edge/idempotency.ts`

---

### Phase 5: Onboarding & Vector Pipeline

- [ ] **`TASK-P5-01`**: **Candidate Profile API (`/api/onboarding/profile`)**
  - **Column**: `Backlog`
  - **Deliverable**: `src/app/api/onboarding/profile/route.ts`

- [ ] **`TASK-P5-02`**: **Resume PDF Parser & 1536-dim Embedding Pipeline**
  - **Column**: `Backlog`
  - **Deliverable**: `src/app/api/onboarding/resume/route.ts`

- [ ] **`TASK-P5-03`**: **Personalized Prep Roadmap Synthesis API**
  - **Column**: `Backlog`
  - **Deliverable**: `src/app/api/plan/generate/route.ts`

---

### Phase 6: Session & Evaluation APIs

- [ ] **`TASK-P6-01`**: **Practice Session Submit & Evaluate API**
  - **Column**: `Backlog`
  - **Deliverable**: `src/app/api/practice/session/submit/route.ts`

- [ ] **`TASK-P6-02`**: **Mock Interview Session End & Grading API**
  - **Column**: `Backlog`
  - **Deliverable**: `src/app/api/mock-interview/session/end/route.ts`

- [ ] **`TASK-P6-03`**: **Evaluation Report Retrieval API**
  - **Column**: `Backlog`
  - **Deliverable**: `src/app/api/evaluation/[reportId]/route.ts`

- [ ] **`TASK-P6-04`**: **Revision Queue Synchronization API**
  - **Column**: `Backlog`
  - **Deliverable**: `src/app/api/revision/items/route.ts`

---

### Phase 7: Real-Time Voice Gateway

- [ ] **`TASK-P7-01`**: **Deepgram Nova-2 Streaming STT Bridge**
  - **Column**: `Backlog`
  - **Deliverable**: `src/server/voice/stt.ts`

- [ ] **`TASK-P7-02`**: **Cartesia Sonic Streaming TTS Bridge**
  - **Column**: `Backlog`
  - **Deliverable**: `src/server/voice/tts.ts`

- [ ] **`TASK-P7-03`**: **Voice Turn-Taking & Sub-100ms Barge-In Controller**
  - **Column**: `Backlog`
  - **Deliverable**: `src/server/voice/gateway.ts`

---

### Phase 8: Frontend-Backend Integration

- [ ] **`TASK-P8-01`**: **Wire Onboarding & Preparation Plan Screens**
  - **Column**: `Backlog`
  - **Scope**: Connect `/onboarding/*` and `/preparation-plan` to live APIs.

- [ ] **`TASK-P8-02`**: **Wire Practice, Whiteboard & Coding Workspaces**
  - **Column**: `Backlog`
  - **Scope**: Connect `/practice/*` and interactive canvas to live submission endpoints.

- [ ] **`TASK-P8-03`**: **Wire Evaluation & Revision Hubs**
  - **Column**: `Backlog`
  - **Scope**: Connect `/evaluation` and `/revision` to live report and queue endpoints.

- [ ] **`TASK-P8-04`**: **Full Platform End-to-End Verification**
  - **Column**: `Backlog`
  - **Scope**: Verify all 43 routes, run end-to-end smoke test, ensure 0 Turbopack errors.
