# Layer 6: Persistence & Storage Layer Architecture

This document specifies the database schemas, relational models, PostgreSQL `snake_case` naming conventions (`@@map` / `@map`), vector extensions, caching strategies, and object storage partitions in **PrepInMinutes**.

---

## 1. Architectural Scope & Storage Tiers

PrepInMinutes utilizes a four-tier polyglot storage topology balancing graph traversals, ACID transactional safety, low-latency caching, and binary asset storage:

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Curriculum Knowledge Graph: Neo4j AuraDB (Cypher 5.x)    │
│ • Canonical Domains, Categories, Topics, Questions          │
│ • Prerequisite DAGs ([:PREREQUISITE_OF]), Component Edges  │
│ • Sub-10ms topological traversal, zero candidate PII        │
└─────────────────────────────────────────────────────────────┘
                               ▲
                               │ (foreign key reference via topic_id, question_id)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Relational & Vector Layer: PostgreSQL (Neon) + pgvector  │
│ • Candidate Profiles, Preparation Plans, Daily Plan Tasks   │
│ • Practice & Mock Sessions, Evaluations, Rubric Scores      │
│ • Resume, Job Description & Topic 1536-dim Vector Chunks    │
└─────────────────────────────────────────────────────────────┘
                               ▲
                               │
┌─────────────────────────────────────────────────────────────┐
│ 3. In-Memory Cache & Lock Layer: Upstash Redis              │
│ • Active Session State, Distributed Locks                   │
│ • Rate Limiting Counters, Idempotency Caches                │
└─────────────────────────────────────────────────────────────┘
                               ▲
                               │
┌─────────────────────────────────────────────────────────────┐
│ 4. Blob & Object Storage Layer: Cloudflare R2 (S3 API)      │
│ • Whiteboard PNG Exports, Audio Recordings, Resume PDFs     │
└─────────────────────────────────────────────────────────────┘
```

> [!NOTE]
> **Polyglot Graph + Relational Architecture**:  
> The curriculum hierarchy and question inventory are canonical in **Neo4j AuraDB**. In PostgreSQL, candidate attempt history, daily plan tasks, topic masteries, and practice sessions reference Neo4j via string identifiers (`topic_id` and `question_id`), ensuring zero duplication of curriculum rubrics and instant graph-backed personalization.

---

## 2. PostgreSQL Naming Convention & 17-Table Catalog

| # | Domain Group | Prisma Model (TypeScript) | PostgreSQL Table (`@@map`) | Primary Foreign Keys (`@map`) |
| :--- | :--- | :--- | :--- | :--- |
| **1** | **Auth** | `User` | `users` | — (`clerk_id` unique, `email` unique) |
| **2** | **Candidate** | `CandidateProfile` | `candidate_profiles` | `user_id` → `users.id` |
| **3** | **Roadmap** | `PreparationPlan` | `preparation_plans` | `candidate_id` → `candidate_profiles.id` |
| **4** | **Roadmap** | `DailyPlanTask` | `daily_plan_tasks` | `plan_id` → `preparation_plans.id`, `topic_id` → `curriculum_topics.id` |
| **5** | **Curriculum** | `CurriculumDomain` | `curriculum_domains` | — (`slug` unique) |
| **6** | **Curriculum** | `CurriculumCategory` | `curriculum_categories` | `domain_id` → `curriculum_domains.id` |
| **7** | **Curriculum** | `CurriculumTopic` | `curriculum_topics` | `domain_id` → `curriculum_domains.id`, `category_id` → `curriculum_categories.id` |
| **8** | **Curriculum** | `CurriculumQuestion` | `curriculum_questions` | `topic_id` → `curriculum_topics.id` |
| **9** | **Vectors** | `TopicEmbedding` | `topic_embeddings` | `topic_id` → `curriculum_topics.id` |
| **10** | **Vectors** | `DocumentEmbedding` | `document_embeddings` | `candidate_id` → `candidate_profiles.id` |
| **11** | **Mastery** | `CandidateTopicMastery` | `candidate_topic_masteries` | `candidate_id` → `candidate_profiles.id`, `topic_id` → `curriculum_topics.id` |
| **12** | **Analytics** | `WeeklyAreaSnapshot` | `weekly_area_snapshots` | `candidate_id` → `candidate_profiles.id` |
| **13** | **Sessions** | `PracticeSession` | `practice_sessions` | `candidate_id` → `candidate_profiles.id`, `topic_id` → `curriculum_topics.id` |
| **14** | **Sessions** | `MockInterviewSession` | `mock_interview_sessions` | `candidate_id` → `candidate_profiles.id` |
| **15** | **Evaluation** | `EvaluationReport` | `evaluation_reports` | `candidate_id`, `practice_id` → `practice_sessions.id`, `mock_id` → `mock_interview_sessions.id` |
| **16** | **Evaluation** | `RubricScore` | `rubric_scores` | `report_id` → `evaluation_reports.id` |
| **17** | **Revision** | `RevisionItem` | `revision_items` | `candidate_id` → `candidate_profiles.id`, `topic_id` → `curriculum_topics.id` |

---

## 3. PostgreSQL Relational Schema (`prisma/schema.prisma`)

See [`prisma/schema.prisma`](../../../prisma/schema.prisma) for the complete 17-table definition with `@map` and `@@map` directives.

---

## 4. Redis In-Memory Cache Topology

### Keyspace Architecture

| Namespace          | Key Pattern               | TTL      | Data Structure | Purpose                                        |
| ------------------ | ------------------------- | -------- | -------------- | ---------------------------------------------- |
| **Active Session** | `session:{id}:state`      | 2 hours  | Hash           | In-progress timer, current stage, temp notes.  |
| **Idempotency**    | `idemp:{idempotencyKey}`  | 24 hours | String (JSON)  | Prevents duplicate evaluations on retry.       |
| **Rate Limiter**   | `rl:{tier}:{candidateId}` | 60 sec   | Sorted Set     | Sliding window rate limits.                    |
| **Revision Due**   | `rev:due:{candidateId}`   | None     | Sorted Set     | Elements scored by `nextReviewDate` timestamp. |

---

## 5. Object Storage (Cloudflare R2)

### Bucket Directory Structure

```
s3://prepinminutes-assets/
├── resumes/
│   └── {candidateId}-{timestamp}.pdf
├── whiteboards/
│   └── {candidateId}/{sessionId}_{timestamp}.png
├── audio-recordings/
│   └── {candidateId}/{sessionId}.opus
└── evaluation-reports/
    └── {candidateId}/{reportId}.pdf
```

### Pre-Signed URL Access Pattern

- Whiteboards and audio recordings are never publicly accessible.
- The backend generates pre-signed GET/PUT URLs with a strict **15-minute expiration window** (`expiresIn: 900`).
