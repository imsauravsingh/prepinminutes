# PrepInMinutes — PostgreSQL Schema (User Authentication & Profiles)

## Overview

This directory contains the PostgreSQL reference schema for **User Authentication, Identity Management, Stateful Sessions, and Candidate Profiles** in PrepInMinutes.

> ⚠️ **Internal Reference Only:**  
> This schema is strictly maintained in the GitHub repository for architecture documentation, schema design, and internal modeling. It is **NOT** pushed or migrated to live production or Neon database servers.

---

## Directory Structure

```text
db/
├── schema.sql      # Production-grade PostgreSQL DDL script
└── README.md       # Architecture specification and entity relationships
```

---

## Entities & Table Specifications

### 1. `users`
Master identity record for candidates, interviewers, and administrators.
- **`id`** (`UUID`): Primary key generated via `gen_random_uuid()`.
- **`email`** (`VARCHAR(255)`): Unique, validated email address.
- **`email_verified_at`** (`TIMESTAMPTZ`): Verification timestamp.
- **`role`** (`ENUM user_role`): `candidate` | `interviewer` | `mentor` | `admin`.
- **`status`** (`ENUM account_status`): `active` | `suspended` | `pending_verification` | `deactivated`.
- **`deleted_at`** (`TIMESTAMPTZ`): Soft delete support for compliance and data retention.

### 2. `user_auth_identities`
Decouples user identities from identity providers (IdPs). A single user can link multiple login mechanisms:
- **`user_id`** (`UUID`): Foreign key referencing `users(id)` (`ON DELETE CASCADE`).
- **`provider`** (`ENUM auth_provider`): `clerk` | `email_password` | `google` | `github` | `linkedin`.
- **`provider_user_id`** (`VARCHAR(255)`): Unique external subject ID (e.g. Clerk user ID).
- **`password_hash`** (`VARCHAR(255)`): Argon2id/Bcrypt hash for local password accounts.
- **`metadata`** (`JSONB`): External OAuth profile attributes and claim tokens.

### 3. `user_sessions`
Stateful session store for token management and device auditing:
- **`user_id`** (`UUID`): Foreign key referencing `users(id)`.
- **`session_token`** (`VARCHAR(512)`): Unique cryptographic session identifier.
- **`ip_address`** (`INET`): Client IP for geo-anomaly detection.
- **`user_agent`** (`TEXT`): Browser/device string.
- **`expires_at`** (`TIMESTAMPTZ`): Absolute expiration deadline.
- **`revoked_at`** (`TIMESTAMPTZ`): Timestamp of manual or security revocation.

### 4. `user_profiles`
Rich candidate profile capturing interview targets, seniority, and preferences:
- **`user_id`** (`UUID`): 1:1 Foreign key referencing `users(id)`.
- **`first_name`**, **`last_name`**, **`display_name`**, **`avatar_url`**, **`bio`**, **`headline`**.
- **`target_role`** (`VARCHAR(150)`): Target position (e.g., *Staff Distributed Systems Architect*).
- **`target_seniority`** (`ENUM experience_level`): `entry_level` | `mid_level` | `senior` | `staff` | `principal`.
- **`target_companies`** (`TEXT[]`): Array of target companies (indexed with PostgreSQL `GIN`).
- **`target_timeline_weeks`** (`INTEGER`): Timeline constraint (1 to 52 weeks).
- **`weekly_goal_hours`** (`NUMERIC(4, 1)`): Weekly preparation commitment (1.0 to 80.0 hrs).
- **`preferences`** (`JSONB`): Configurable UI theme, coding language, and notification toggles.

### 5. `user_security_audit_logs`
Immutable append-only ledger for all security events:
- **`user_id`** (`UUID`): References `users(id)` (`ON DELETE SET NULL`).
- **`event_type`** (`VARCHAR(60)`): Event type (e.g., `LOGIN_SUCCESS`, `FAILED_PASSWORD_ATTEMPT`, `MFA_CHALLENGE`).
- **`metadata`** (`JSONB`): Contextual event attributes.

---

## Performance Indexes & Triggers

- **GIN Indexes**: Accelerated full-text/array queries on `target_companies` and `preferences`.
- **Composite Indexes**: Optimized active session lookup (`user_id, expires_at WHERE revoked_at IS NULL`).
- **Automated Triggers**: `trigger_set_timestamp()` automatically synchronizes `updated_at` timestamps on row mutation.
