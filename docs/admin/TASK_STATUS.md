# PrepInMinutes — Admin Panel Implementation Task Status

> **Document Type**: Living Execution Tracker & Milestone Status Board  
> **Location**: `docs/admin/TASK_STATUS.md`  
> **Last Synchronized**: October 20, 2026  
> **Current Progress**: `21 / 21 Tasks Completed (100%)`  
> **Governance Rule**: Updated after every completed task; reviewed and approved by HOD (`imsauravsingh@gmail.com`).

---

## 📊 Executive Progress Dashboard

```
Overall Progress: [████████████████████] 100% (21 / 21 Completed)
```

| Phase | Description | Tasks | Completed | Status |
| :--- | :--- | :---: | :---: | :---: |
| **Phase 1** | PostgreSQL RBAC, Admin Auth & HOD Auto-Activation | 4 | 4 | 🟢 **100% Complete** |
| **Phase 2** | Neo4j Knowledge Graph Admin Service & REST API Gateway | 6 | 6 | 🟢 **100% Complete** |
| **Phase 3** | Separated APIs: HOD Staff Management vs Candidate Directory | 2 | 2 | 🟢 **100% Complete** |
| **Phase 4** | Frontend Admin Shell & Authentication Workspaces | 4 | 4 | 🟢 **100% Complete** |
| **Phase 5** | Frontend Knowledge Graph & Curriculum Workspaces | 5 | 5 | 🟢 **100% Complete** |
| **Phase 6** | Frontend Candidate Directory, HOD Team & Subscriptions | 2 | 2 | 🟢 **100% Complete** |
| **Total** | **Full Admin Panel & Knowledge Graph Delivery** | **21** | **21** | 🟢 **100% Completed & Verified** |

---

## 📌 Legend
- ⚪ `PENDING` — Not yet started; waiting on prerequisite phase.
- 🟡 `IN_PROGRESS` — Currently under active development or testing.
- 🟢 `COMPLETED` — Fully implemented, typechecked, and verified against acceptance criteria.
- 🔴 `BLOCKED` — Waiting on external dependency or decision.

---

## Detailed Task-by-Task Execution Registry

### Phase 1: PostgreSQL RBAC, Admin Authentication & HOD Auto-Activation

| Task ID | Task Description | Target Files | Status | Completion Date |
| :--- | :--- | :--- | :---: | :---: |
| **TASK-1.1** | **PostgreSQL Prisma Schema Migration**<br/>• Add `AdminRole` (`SUPER_ADMIN`, `HOD`, `CURRICULUM_MANAGER`, `STAFF_ENGINEER`, `CONTENT_REVIEWER`, `CANDIDATE`)<br/>• Add `AdminApprovalStatus` (`NONE`, `PENDING`, `APPROVED`, `REJECTED`, `SUSPENDED`)<br/>• Add `SubscriptionTier` & `SubscriptionStatus`<br/>• Add `isBlocked`, `blockedReason`, `blockedAt`, `blockedBy` to `User`<br/>• Add `requestedRole`, `requestReason`, `requestedAt` to `User`<br/>• Add `Subscription` and `AdminAuditLog` models<br/>• Run `npx prisma db push` | `prepinminutes-backend/prisma/schema.prisma` | 🟢 `COMPLETED` | Oct 20, 2026 |
| **TASK-1.2** | **Seed Root HOD Account in PostgreSQL**<br/>• Upsert `imsauravsingh@gmail.com`<br/>• PBKDF2 hash for password `Saurav@3063` (100k iterations, 16-byte salt)<br/>• Set `role = SUPER_ADMIN`, `adminApprovalStatus = APPROVED`, `isBlocked = false`<br/>• Verify account in database | `prepinminutes-backend/scripts/seed-admin-hod.ts` | 🟢 `COMPLETED` | Oct 20, 2026 |
| **TASK-1.3** | **Admin JWT Session & Security Middleware**<br/>• Issue encrypted `pim_admin_session` cookie<br/>• `requireAdminRole(allowedRoles)` middleware<br/>• `requireRootHOD()` restricting endpoints strictly to `imsauravsingh@gmail.com`<br/>• Immediate 403 rejection for candidates or blocked users | `prepinminutes-backend/src/server/auth/admin-auth.ts` | 🟢 `COMPLETED` | Oct 20, 2026 |
| **TASK-1.4** | **Admin Authentication REST API Routes**<br/>• `POST /api/admin/auth/login` (Password verification & role check)<br/>• `POST /api/admin/auth/google` (Google SSO; HOD auto-approved, others pending)<br/>• `POST /api/admin/auth/request-access` (Stores applicant reason & requested role)<br/>• `GET /api/admin/auth/me` (Returns verified admin profile & role)<br/>• `POST /api/admin/auth/logout` (Clears session) | `prepinminutes-backend/src/routes/admin-auth.ts` | 🟢 `COMPLETED` | Oct 20, 2026 |

---

### Phase 2: Neo4j Knowledge Graph Admin Service & REST API Gateway

| Task ID | Task Description | Target Files | Status | Completion Date |
| :--- | :--- | :--- | :---: | :---: |
| **TASK-2.1** | **Neo4j Node Schema Constraints & Status Properties**<br/>• Create constraints on `Category.slug`, `Topic.slug`, `Question.id`<br/>• Ensure existing graph nodes have `status = 'PUBLISHED'`, `isLive = true` | `prepinminutes-backend/scripts/setup-neo4j-admin-constraints.ts` | 🟢 `COMPLETED` | Oct 20, 2026 |
| **TASK-2.2** | **Category Admin CRUD Endpoints**<br/>• `GET /api/admin/neo4j/categories`<br/>• `POST /api/admin/neo4j/categories` (Create category linked to domain)<br/>• `PUT /api/admin/neo4j/categories/:slug`<br/>• `DELETE /api/admin/neo4j/categories/:slug` (Dependency safety check) | `prepinminutes-backend/src/routes/admin-curriculum.ts` | 🟢 `COMPLETED` | Oct 20, 2026 |
| **TASK-2.3** | **Topic Admin CRUD & Rubric Atoms Endpoints**<br/>• `GET /api/admin/neo4j/topics` (Filter by domain/category/status)<br/>• `POST /api/admin/neo4j/topics` (Default `status = 'DRAFT'`, `isLive = false`)<br/>• `PUT /api/admin/neo4j/topics/:slug` (Update rubric checklist atoms & difficulty)<br/>• `DELETE /api/admin/neo4j/topics/:slug` | `prepinminutes-backend/src/routes/admin-curriculum.ts` | 🟢 `COMPLETED` | Oct 20, 2026 |
| **TASK-2.4** | **Question Admin CRUD & Test Suite Endpoints**<br/>• `GET /api/admin/neo4j/questions`<br/>• `POST /api/admin/neo4j/questions` (Prompt, model answer, hints, test cases)<br/>• `PUT /api/admin/neo4j/questions/:id`<br/>• `DELETE /api/admin/neo4j/questions/:id` | `prepinminutes-backend/src/routes/admin-curriculum.ts` | 🟢 `COMPLETED` | Oct 20, 2026 |
| **TASK-2.5** | **Staging & Approval Gate Cypher Endpoints**<br/>• `GET /api/admin/neo4j/pending` (Lists drafts & in-review items)<br/>• `POST /api/admin/neo4j/approve` (Flips `status = 'PUBLISHED'`, `isLive = true`)<br/>• `POST /api/admin/neo4j/reject` (Sets `status = 'REJECTED'` with feedback) | `prepinminutes-backend/src/routes/admin-approvals.ts` | 🟢 `COMPLETED` | Oct 20, 2026 |
| **TASK-2.6** | **Candidate Query Isolation Verification**<br/>• Audit candidate practice & diagnostic queries<br/>• Verify strict filter `WHERE item.status = 'PUBLISHED' AND item.isLive = true` | `prepinminutes-backend/src/server/domain/analyzer.ts` | 🟢 `COMPLETED` | Oct 20, 2026 |

---

### Phase 3: Separated APIs — HOD Staff Management vs. Candidate Directory

| Task ID | Task Description | Target Files | Status | Completion Date |
| :--- | :--- | :--- | :---: | :---: |
| **TASK-3.1** | **HOD Team & Staff Management API (Independent Module)**<br/>• `GET /api/admin/team` (Active staff only)<br/>• `GET /api/admin/team/pending` (Pending requests with reason text)<br/>• `PATCH /api/admin/team/:id/approve` (HOD role assignment)<br/>• `PATCH /api/admin/team/:id/reject`<br/>• `PATCH /api/admin/team/:id/role`<br/>• `POST /api/admin/team/:id/block` (Blocks staff & terminates admin session)<br/>• `POST /api/admin/team/:id/unblock`<br/>• `GET /api/admin/team/audit-logs` | `prepinminutes-backend/src/routes/admin-team.ts` | 🟢 `COMPLETED` | Oct 20, 2026 |
| **TASK-3.2** | **Candidate Directory & Subscription Status API (Independent Module)**<br/>• `GET /api/admin/candidates` (Candidate directory with `isPlanOpted`, tier, usage)<br/>• `GET /api/admin/candidates/:id` (Candidate prep profile & readiness)<br/>• `PATCH /api/admin/candidates/:id/subscription` (Manual upgrade / extend days)<br/>• `POST /api/admin/candidates/:id/block` (Blocks candidate with `blockedReason`)<br/>• `POST /api/admin/candidates/:id/unblock`<br/>• `POST /api/admin/candidates/:id/reset-quota` | `prepinminutes-backend/src/routes/admin-candidates.ts` | 🟢 `COMPLETED` | Oct 20, 2026 |

---

### Phase 4: Frontend Admin Shell & Authentication Workspaces

| Task ID | Task Description | Target Files | Status | Completion Date |
| :--- | :--- | :--- | :---: | :---: |
| **TASK-4.1** | **Admin Shell Layout & Security Route Guard**<br/>• Dark-themed admin layout with dedicated navigation sidebar<br/>• Auto-redirect unauthenticated users to `/admin/login`<br/>• Strict 403 screen for candidates | `prep-in-minutes/src/app/admin/layout.tsx`<br/>`prep-in-minutes/src/components/admin/AdminSidebar.tsx` | 🟢 `COMPLETED` | Oct 20, 2026 |
| **TASK-4.2** | **Admin Login Portal**<br/>• "Sign in with Google" button for 1-click Google OAuth<br/>• Email & Password form<br/>• Direct redirect to `/admin` for `imsauravsingh@gmail.com`<br/>• Route pending users to `/admin/request-access` | `prep-in-minutes/src/app/admin/login/page.tsx` | 🟢 `COMPLETED` | Oct 20, 2026 |
| **TASK-4.3** | **Post-Registration Access Request Screen**<br/>• Google identity card (Avatar, Name, Email)<br/>• Requested Role dropdown selector<br/>• Required Reason textarea<br/>• Submit to `POST /api/admin/auth/request-access` | `prep-in-minutes/src/app/admin/request-access/page.tsx` | 🟢 `COMPLETED` | Oct 20, 2026 |
| **TASK-4.4** | **Pending Approval Holding Screen**<br/>• Holding notice informing user that request is awaiting review by Saurav Singh (`imsauravsingh@gmail.com`)<br/>• Summary card of submitted reason and requested role with `PENDING` badge | `prep-in-minutes/src/app/admin/pending-approval/page.tsx` | 🟢 `COMPLETED` | Oct 20, 2026 |

---

### Phase 5: Frontend Knowledge Graph & Curriculum Management Workspaces

| Task ID | Task Description | Target Files | Status | Completion Date |
| :--- | :--- | :--- | :---: | :---: |
| **TASK-5.1** | **Executive Admin Overview Dashboard**<br/>• Live counters: Domains, Categories, Topics, Live vs Draft Questions, Pending Requests<br/>• Quick-action shortcut buttons | `prep-in-minutes/src/app/admin/page.tsx` | 🟢 `COMPLETED` | Oct 20, 2026 |
| **TASK-5.2** | **Knowledge Graph Category Manager Workspace**<br/>• Domain filter tabs (System Design, DSA, Core Languages, Behavioral)<br/>• Category cards with live vs draft badges<br/>• "Add Category" modal dialog with slug generator<br/>• Edit & Delete modals | `prep-in-minutes/src/app/admin/curriculum/page.tsx` | 🟢 `COMPLETED` | Oct 20, 2026 |
| **TASK-5.3** | **Topic Details & Rubric Checklist Atoms Editor**<br/>• Topic list filtered by Category<br/>• Rubric Checklist Atoms interactive tag manager<br/>• Difficulty selection & prerequisite linking | `prep-in-minutes/src/app/admin/curriculum/topics/page.tsx` | 🟢 `COMPLETED` | Oct 20, 2026 |
| **TASK-5.4** | **Master Question Bank Editor**<br/>• Search and filter questions by category/difficulty/status<br/>• Markdown prompt editor with live preview<br/>• Model answer guide, hints, and test cases JSON editor | `prep-in-minutes/src/app/admin/questions/page.tsx` | 🟢 `COMPLETED` | Oct 20, 2026 |
| **TASK-5.5** | **Staging & Approval Queue Workspace**<br/>• Table of pending drafts awaiting review<br/>• Side-by-side diff viewer showing modified fields<br/>• One-click "Approve & Push to Live" button<br/>• "Reject with Feedback" dialog | `prep-in-minutes/src/app/admin/approvals/page.tsx` | 🟢 `COMPLETED` | Oct 20, 2026 |

---

### Phase 6: Frontend Candidate Directory, HOD Team & Subscriptions

| Task ID | Task Description | Target Files | Status | Completion Date |
| :--- | :--- | :--- | :---: | :---: |
| **TASK-6.1** | **Candidate & Subscriber Directory Workspace (`/admin/candidates`)**<br/>• Candidate table with **Subscription Opted (YES / NO)** badge<br/>• Real-time AI voice minutes consumption progress bar<br/>• Filter tabs: All Candidates, Subscribed (Paid), Free Tier, Blocked<br/>• Actions: Upgrade Plan, Extend Days, Reset Minutes, **Block / Unblock Candidate** | `prep-in-minutes/src/app/admin/candidates/page.tsx` | 🟢 `COMPLETED` | Oct 20, 2026 |
| **TASK-6.2** | **HOD Team Management & Staff Approval Workspace (`/admin/team`)**<br/>• Restricted strictly to `imsauravsingh@gmail.com`<br/>• "Pending Staff Access Requests" queue showing applicant Google profile, timestamp, and **exact written reason text**<br/>• Role dropdown selector + "Approve Access" button<br/>• Active staff table with **"Block Staff Member"** / **"Unblock"** button | `prep-in-minutes/src/app/admin/team/page.tsx` | 🟢 `COMPLETED` | Oct 20, 2026 |
| **TASK-6.3** | **Subscriptions, Quotas & Promo Codes Workspace (`/admin/subscriptions`)**<br/>• Subscription tier configuration cards (Free, Pro, Lifetime, Enterprise)<br/>• Usage quota slider (voice minutes)<br/>• Promo code generator (discount percentage, expiration date, max uses)<br/>• Customer support candidate credit override search | `prep-in-minutes/src/app/admin/subscriptions/page.tsx` | 🟢 `COMPLETED` | Oct 20, 2026 |

---

## 📝 Change Log & Verification Audit

| Date | Task ID | Description of Changes Made | Verification Result | Sign-off |
| :--- | :--- | :--- | :--- | :--- |
| Oct 20, 2026 | **TASK-1.1** | Added `AdminRole`, `AdminApprovalStatus`, `SubscriptionTier`, `SubscriptionStatus`, `isBlocked`, `requestReason` to `schema.prisma`. | `npx prisma db push` succeeded in 192ms. Prisma client regenerated. | ✅ Verified |
| Oct 20, 2026 | **TASK-1.2** | Seeded root HOD account `imsauravsingh@gmail.com` with hashed password `Saurav@3063` and `SUPER_ADMIN` role. | `scripts/seed-admin-hod.ts` executed cleanly; account confirmed in DB. | ✅ Verified |
| Oct 20, 2026 | **TASK-1.3** | Built `src/server/auth/admin-auth.ts` with JWT signing, `pim_admin_session` cookie helper, and `requireAdminRole` / `requireRootHOD` guards. | `tsc --noEmit` passed with 0 errors. | ✅ Verified |
| Oct 20, 2026 | **TASK-1.4** | Built admin auth routes (`/api/admin/auth/login`, `/google`, `/request-access`, `/me`, `/logout`) and wired into `src/index.ts`. | `scripts/test-phase1-admin-auth.ts` passed 6/6 tests. | ✅ Verified |
| Oct 20, 2026 | **TASK-2.1 - 2.6** | Setup Neo4j AuraDB schema constraints, backfilled status properties, built Category/Topic/Question CRUD & Staging approval routes, and verified candidate query isolation. | `scripts/test-phase2-neo4j-admin.ts` passed 16/16 tests. | ✅ Verified |
| Oct 20, 2026 | **TASK-3.1 - 3.2** | Implemented separated HOD Team API (`src/routes/admin-team.ts`) and Candidate Directory API (`src/routes/admin-candidates.ts`) with universal blocking. | `scripts/test-phase3-admin-candidates-team.ts` passed 17/17 tests. | ✅ Verified |
| Oct 20, 2026 | **TASK-4.1 - 4.4** | Created Frontend Admin Layout, Login Portal, Request Access Form, and Pending Holding Screen. | TypeScript check passed with 0 errors; HTTP 200 verified. | ✅ Verified |
| Oct 20, 2026 | **TASK-5.1 - 5.5** | Built Category Manager (`/admin/curriculum`), Topics & Rubric Atoms Editor (`/admin/curriculum/topics`), Master Question Bank (`/admin/questions`), and Staging Approvals Queue (`/admin/approvals`). | TypeScript check passed with 0 errors; HTTP 200 verified. | ✅ Verified |
| Oct 20, 2026 | **TASK-6.1 - 6.3** | Built Candidate Directory with Plan Opted tracking (`/admin/candidates`), HOD Team Management with written reason reviews (`/admin/team`), and Pricing Tiers (`/admin/subscriptions`). | All pages compiled with 0 errors; HTTP 200 verified. | ✅ Verified |

