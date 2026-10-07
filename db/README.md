# PrepInMinutes — Master PostgreSQL System Schema

## 📌 Architectural Overview

This directory contains the production-grade PostgreSQL reference architecture for **PrepInMinutes**, synthesized directly from the system specifications across [`docs/`](../docs/).

> 🔒 **Repository-Only Constraint:**  
> This schema is strictly maintained in the GitHub repository for architecture documentation, design parity, and internal modeling. It is **NOT** pushed or migrated to any live database server.

---

## 📂 Directory Layout

```text
db/
├── schema.sql                               # Master consolidated DDL script (24 tables, transactional)
├── README.md                                # Full architecture, ERD & indexing reference
└── modules/
    ├── 01_auth_and_profiles.sql             # Users, identities, sessions, candidate profiles & audit
    ├── 02_curriculum_knowledge_graph.sql    # Domains, categories, topics, questions & topic vectors
    ├── 03_preparation_plans.sql             # Plans, weekly milestones & dynamic adaptation events
    ├── 04_practice_and_mock_sessions.sql    # Practice drills, mock interviews, transcripts & whiteboards
    ├── 05_evaluations_and_rubrics.sql       # Evaluation reports, 6 rubric dimensions & readiness history
    ├── 06_spaced_repetition_and_mastery.sql # Candidate topic masteries, SM-2 revision items & drill logs
    ├── 07_document_embeddings_rag.sql       # Resumes, JD chunks & pgvector HNSW cosine indexes
    └── 08_triggers_and_routines.sql         # Automated PL/pgSQL timestamp synchronization triggers
```

---

## 🏛️ Comprehensive Table & Entity Inventory (25 Tables)

| Module | Table Name | Purpose & Cardinality |
| :--- | :--- | :--- |
| **1. Auth & Profiles** | `users` | Root identity record. Supports soft-deletes (`deleted_at`), `token_version` for instant $O(1)$ global JWT invalidation, and `token_valid_after` cutoff. |
| | `user_auth_identities` | Decoupled identity providers (`clerk`, `google`, `github`, `email_password`). |
| | `user_refresh_tokens` | Rotating refresh token ledger with family-based replay detection and single-use `jti`. Access tokens remain 100% stateless JWTs. |
| | `jwt_revoked_tokens` | Fast denylist of explicit revoked `jti` identifiers for immediate single-token invalidation prior to natural expiration. |
| | `candidate_profiles` | Candidate career targets, seniority, target companies, weekly goals, and JSONB preferences. |
| | `user_security_audit_logs` | Append-only ledger auditing logins, token refreshes, role changes, and revocations. |
| **2. Knowledge Graph** | `curriculum_domains` | Top-level domains (`system-design`, `coding`, `behavioral`, `cloud`). |
| | `curriculum_categories` | Hierarchical categories within domains (e.g. Partitioning & Sharding, Concurrency). |
| | `curriculum_topics` | 135 canonical topics with rubric atoms, durations, and difficulty levels. |
| | `curriculum_questions` | Interview question templates, prompts, starter code, and test cases. |
| | `topic_embeddings` | 1,536-dimensional semantic vectors for topic matching and RAG retrieval. |
| **3. Preparation Plans**| `preparation_plans` | Multi-week preparation syllabus with domain weightings and state machine tracking. |
| | `plan_milestones` | Relational breakdown of weekly goals, focus areas, and recommended topics. |
| | `plan_adaptation_events`| Audit trail of automated re-balancing triggers (`MOCK_EVALUATION`, `PRACTICE_DRILL`). |
| **4. Sessions** | `practice_sessions` | Interactive workspace sessions (coding, system design whiteboard, behavioral). |
| | `mock_interview_sessions`| End-to-end full mock interview simulations (configuring, active, evaluating, completed). |
| | `session_transcripts` | Granular turn-by-turn conversational history (`ai` vs `candidate`) with audio timestamps. |
| | `session_whiteboard_snapshots` | Versioned whiteboard diagram assets (storage URLs and raw SVG vector data). |
| **5. Evaluations** | `evaluation_reports` | Evaluation output from deterministic engines and Gemini reasoning. |
| | `rubric_scores` | Breakdown across 6 rubric dimensions with specific missing atom concepts. |
| | `readiness_trajectory_history` | Audit log of Bayesian EMA updates ($\Delta R$) with dual-alpha calibration tracking. |
| **6. Spaced Repetition**| `candidate_topic_masteries` | Longitudinal mastery progress across topics with cognitive stage tracking. |
| | `revision_items` | SuperMemo-2 (SM-2) prioritized active queue with next review dates and ease factors. |
| | `revision_drill_logs` | Audit trail of every flashcard recall attempt and interval expansion. |
| **7. Vector RAG** | `document_embeddings` | Resumes and job description text chunks embedded into 1,536-dim vector space. |

---

## ⚡ Indexing & Vector Search Strategy

1. **HNSW Cosine Vector Indexing**:
   ```sql
   CREATE INDEX idx_document_embeddings_hnsw_cosine 
       ON document_embeddings 
       USING hnsw (embedding vector_cosine_ops)
       WITH (m = 16, ef_construction = 64);
   ```
2. **PostgreSQL GIN Inverted Indexes**:
   - `candidate_profiles USING GIN (target_companies)`
   - `candidate_profiles USING GIN (preferences)`
3. **Filtered Composite B-Tree Indexes**:
   - `user_sessions (user_id, expires_at) WHERE revoked_at IS NULL`
   - `users (status) WHERE deleted_at IS NULL`
   - `revision_items (candidate_id, next_review_date ASC)`

---

## 🔄 Automated Triggers & Data Integrity

- **PL/pgSQL Trigger (`trigger_set_timestamp`)**: Automatically updates `updated_at = CURRENT_TIMESTAMP` across all 13 mutable entities before any update operation.
- **Cascading Referential Integrity**: All candidate-scoped tables configure `ON DELETE CASCADE` referencing `users(id)` or `candidate_profiles(id)` for full compliance with data cleanup and privacy laws.
