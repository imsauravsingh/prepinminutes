# Layer 6: Persistence & Storage Layer Architecture

This document specifies the database schemas, relational models, vector extensions, caching strategies, and object storage partitions in **PrepInMinutes**.

---

## 1. Architectural Scope & Storage Tiers

PrepInMinutes utilizes a three-tier storage topology to balance ACID transactional safety, low-latency in-memory operations, and cost-effective binary asset storage:

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Relational & Vector Layer: PostgreSQL + pgvector         │
│ • User Profiles, Prep Plans, Topics, Sessions, Reports     │
│ • Resume & Job Description Embedding Chunks                 │
└─────────────────────────────────────────────────────────────┘
                               ▲
                               │
┌─────────────────────────────────────────────────────────────┐
│ 2. In-Memory Cache & Lock Layer: Redis                      │
│ • Active Session State, Distributed Locks (Redlock)         │
│ • Rate Limiting Counters, Idempotency Caches                │
└─────────────────────────────────────────────────────────────┘
                               ▲
                               │
┌─────────────────────────────────────────────────────────────┐
│ 3. Blob & Object Storage Layer: AWS S3 / Cloudflare R2      │
│ • Whiteboard PNG Exports, Audio Recordings, PDF Reports     │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. PostgreSQL Relational Schema (Prisma ORM)

```prisma
datasource db {
  provider   = "postgresql"
  url        = env("DATABASE_URL")
  extensions = [pgvector(map: "vector")]
}

generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["postgresqlExtensions"]
}

model User {
  id               String            @id @default(cuid())
  clerkId          String            @unique
  email            String            @unique
  fullName         String?
  createdAt        DateTime          @default(now())
  profile          CandidateProfile?
}

model CandidateProfile {
  id               String            @id @default(cuid())
  userId           String            @unique
  user             User              @relation(fields: [userId], references: [id], onDelete: Cascade)
  targetRole       String            // e.g. "Senior Software Engineer"
  experienceLevel  String            // "0-2", "3-5", "6-9", "10+"
  targetCompanies  String[]          // ["Google", "Meta", "Stripe"]
  timelineWeeks    Int               @default(8)
  readinessScore   Int               @default(45) // 0 - 100%
  weeklyGoalHours  Float             @default(6.0)
  completedHours   Float             @default(0.0)
  streakDays       Int               @default(1)

  plan             PreparationPlan?
  practiceSessions PracticeSession[]
  mockSessions     MockInterviewSession[]
  revisionItems    RevisionItem[]
  embeddings       DocumentEmbedding[]
}

model PracticeSession {
  id               String            @id @default(cuid())
  candidateId      String
  candidate        CandidateProfile  @relation(fields: [candidateId], references: [id], onDelete: Cascade)
  domain           String            // "system-design" | "coding" | "behavioral" | "cloud"
  topicSlug        String            // "max-sum-subarray"
  title            String
  durationSeconds  Int               @default(0)
  status           String            // "ACTIVE" | "COMPLETED" | "ABANDONED"
  evaluation       EvaluationReport?
  createdAt        DateTime          @default(now())
}

model MockInterviewSession {
  id               String            @id @default(cuid())
  candidateId      String
  candidate        CandidateProfile  @relation(fields: [candidateId], references: [id], onDelete: Cascade)
  interviewType    String            // "system-design" | "technical" | "behavioral"
  targetRole       String
  difficulty       String            // "senior" | "staff"
  durationMinutes  Int
  status           String            // "CONFIGURING" | "ACTIVE" | "EVALUATING" | "COMPLETED"
  evaluation       EvaluationReport?
  createdAt        DateTime          @default(now())
}

model EvaluationReport {
  id               String            @id @default(cuid())
  practiceId       String?           @unique
  practiceSession  PracticeSession?  @relation(fields: [practiceId], references: [id])
  mockId           String?           @unique
  mockSession      MockInterviewSession? @relation(fields: [mockId], references: [id])

  overallScore     Float             // e.g. 84.0 / 100
  verdict          String            // "Strong Hire" | "Hire" | "Needs Practice"
  readinessDelta   Int               // e.g. +6%
  evaluatorNotes   String            @db.Text
  strengths        String[]
  improvements     String[]
  rubricScores     RubricScore[]
  createdAt        DateTime          @default(now())
}

model RubricScore {
  id               String            @id @default(cuid())
  reportId         String
  report           EvaluationReport  @relation(fields: [reportId], references: [id], onDelete: Cascade)
  dimension        String            // "technical_depth", "reasoning_tradeoffs", etc.
  score            Float             // 1.0 - 10.0
  assessment       String            @db.Text
}

model RevisionItem {
  id               String            @id @default(cuid())
  candidateId      String
  candidate        CandidateProfile  @relation(fields: [candidateId], references: [id], onDelete: Cascade)
  topicId          String
  topicTitle       String
  domain           String
  intervalDays     Float             @default(1.0)
  easeFactor       Float             @default(2.5)
  repetitions      Int               @default(0)
  nextReviewDate   DateTime
  createdAt        DateTime          @default(now())

  @@index([candidateId, nextReviewDate])
}

model DocumentEmbedding {
  id               String                      @id @default(cuid())
  candidateId      String
  candidate        CandidateProfile            @relation(fields: [candidateId], references: [id], onDelete: Cascade)
  docType          String                      // "resume" | "job_description"
  content          String                      @db.Text
  embedding        Unsupported("vector(1536)")
  createdAt        DateTime                    @default(now())

  @@index([candidateId])
}
```

---

## 3. Redis In-Memory Cache Topology

### Keyspace Architecture

| Namespace          | Key Pattern               | TTL      | Data Structure | Purpose                                        |
| ------------------ | ------------------------- | -------- | -------------- | ---------------------------------------------- |
| **Active Session** | `session:{id}:state`      | 2 hours  | Hash           | In-progress timer, current stage, temp notes.  |
| **Idempotency**    | `idemp:{idempotencyKey}`  | 24 hours | String (JSON)  | Prevents duplicate evaluations on retry.       |
| **Rate Limiter**   | `rl:{tier}:{candidateId}` | 60 sec   | Sorted Set     | Sliding window rate limits.                    |
| **Revision Due**   | `rev:due:{candidateId}`   | None     | Sorted Set     | Elements scored by `nextReviewDate` timestamp. |

---

## 4. Object Storage (S3 / Cloudflare R2)

### Bucket Directory Structure

```
s3://prepinminutes-storage/
├── whiteboards/
│   └── {candidateId}/{sessionId}_{timestamp}.png
├── audio-recordings/
│   └── {candidateId}/{sessionId}.opus
└── evaluation-reports/
    └── {candidateId}/{reportId}.pdf
```

### Pre-Signed URL Access Pattern

- Whiteboards and audio recordings are never publicly accessible.
- The backend generates pre-signed GET URLs with a strict **15-minute expiration window** (`expiresIn: 900`).

---

## 5. Developer Implementation & Verification Checklist

- [ ] All database migrations run via `prisma migrate deploy` with zero downtime schema changes.
- [ ] Foreign keys cascade correctly on `User` deletion to uphold GDPR/CCPA data cleanup.
- [ ] Vector index on `DocumentEmbedding` uses HNSW (`m = 16, ef_construction = 64`) for fast cosine lookup.
- [ ] Redis keys specify explicit TTLs to avoid memory leaks.
