-- =============================================================================
-- PrepInMinutes — Master PostgreSQL System Schema
-- Architecture: Stateless Access JWTs, Rotating Refresh Tokens & Knowledge Graph
-- Classification: Internal Reference Architecture (Repository-Only)
-- =============================================================================

BEGIN;


-- >>> MODULE: 01_auth_and_profiles.sql <<<
-- =============================================================================
-- Module 1: Authentication, Identity, Stateless JWT & Candidate Profiles
-- Architecture: Stateless Access JWTs + Rotating Refresh Token Ledger
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('candidate', 'interviewer', 'mentor', 'admin');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE account_status AS ENUM ('active', 'suspended', 'pending_verification', 'deactivated');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE auth_provider AS ENUM ('clerk', 'email_password', 'google', 'github', 'linkedin');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE experience_level AS ENUM ('intern', 'entry_level', 'mid_level', 'senior', 'staff', 'principal', 'distinguished');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 1. Users Table (Master identity with stateless token invalidation checkpoints)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL,
    email_verified_at TIMESTAMPTZ NULL,
    role user_role NOT NULL DEFAULT 'candidate',
    status account_status NOT NULL DEFAULT 'active',
    
    -- Stateless JWT Invalidation Controls
    -- Incrementing token_version immediately invalidates all existing access JWTs globally
    token_version INTEGER NOT NULL DEFAULT 1,
    -- JWTs issued before this timestamp are rejected (e.g. on password reset or global logout)
    token_valid_after TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ NULL,

    CONSTRAINT uq_users_email UNIQUE (email),
    CONSTRAINT chk_users_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

COMMENT ON TABLE users IS 'Master identity record. Access tokens are stateless JWTs validated via signature and token_version';
COMMENT ON COLUMN users.token_version IS 'Incremented to immediately revoke all active JWT access tokens across all devices in O(1)';
COMMENT ON COLUMN users.token_valid_after IS 'Global cutoff timestamp; any JWT issued before this date is rejected';

-- 2. User Authentication Identities (Clerk / OAuth / Local Passwords)
CREATE TABLE IF NOT EXISTS user_auth_identities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider auth_provider NOT NULL,
    provider_user_id VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NULL,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    last_sign_in_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_auth_provider_uid UNIQUE (provider, provider_user_id)
);

-- 3. Rotating Refresh Tokens (Stateful boundary ONLY for refresh tokens, not access JWTs)
CREATE TABLE IF NOT EXISTS user_refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL UNIQUE, -- SHA-256 hash of refresh token
    jti VARCHAR(255) NOT NULL UNIQUE,        -- JWT ID claim to enforce single-use
    family_id UUID NOT NULL,                 -- Rotation family ID for replay detection
    ip_address INET NULL,
    user_agent TEXT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    is_revoked BOOLEAN NOT NULL DEFAULT FALSE,
    revoked_reason VARCHAR(100) NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    revoked_at TIMESTAMPTZ NULL
);

COMMENT ON TABLE user_refresh_tokens IS 'Rotating refresh token ledger for issuing stateless access JWTs with replay detection';

-- 4. JWT Revocation Denylist (Optional explicit jti denylist for early JWT invalidation)
CREATE TABLE IF NOT EXISTS jwt_revoked_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    jti VARCHAR(255) NOT NULL UNIQUE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at TIMESTAMPTZ NOT NULL, -- Matched to JWT exp so records can be TTL-purged
    revoked_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    reason VARCHAR(100) NULL
);

-- 5. Candidate Profiles
CREATE TABLE IF NOT EXISTS candidate_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NULL,
    last_name VARCHAR(100) NULL,
    display_name VARCHAR(100) NULL,
    avatar_url TEXT NULL,
    bio TEXT NULL,
    headline VARCHAR(200) NULL,
    phone_number VARCHAR(30) NULL,
    country_code VARCHAR(10) NULL,
    timezone VARCHAR(50) NOT NULL DEFAULT 'UTC',

    target_role VARCHAR(150) NOT NULL DEFAULT 'Senior Software Engineer',
    target_seniority experience_level NOT NULL DEFAULT 'senior',
    target_companies TEXT[] NOT NULL DEFAULT '{}',
    target_timeline_weeks INTEGER NOT NULL DEFAULT 8,
    readiness_score NUMERIC(5, 2) NOT NULL DEFAULT 45.00,
    weekly_goal_hours NUMERIC(4, 1) NOT NULL DEFAULT 6.0,
    completed_hours NUMERIC(6, 1) NOT NULL DEFAULT 0.0,
    streak_days INTEGER NOT NULL DEFAULT 1,
    years_of_experience NUMERIC(3, 1) NULL,
    current_company VARCHAR(150) NULL,

    linkedin_url TEXT NULL,
    github_url TEXT NULL,
    portfolio_url TEXT NULL,
    resume_storage_key TEXT NULL,

    preferences JSONB NOT NULL DEFAULT '{
        "theme": "dark",
        "email_notifications": true,
        "daily_revision_reminders": true,
        "preferred_coding_language": "typescript",
        "audio_speed_multiplier": 1.0
    }'::jsonb,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_profiles_timeline CHECK (target_timeline_weeks > 0 AND target_timeline_weeks <= 52),
    CONSTRAINT chk_profiles_goal_hours CHECK (weekly_goal_hours >= 1.0 AND weekly_goal_hours <= 80.0),
    CONSTRAINT chk_profiles_readiness CHECK (readiness_score >= 0.00 AND readiness_score <= 100.00)
);

-- 6. User Security Audit Logs
CREATE TABLE IF NOT EXISTS user_security_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NULL REFERENCES users(id) ON DELETE SET NULL,
    event_type VARCHAR(60) NOT NULL, -- 'LOGIN_SUCCESS', 'JWT_REFRESH', 'LOGOUT', 'TOKEN_REVOKED'
    ip_address INET NULL,
    user_agent TEXT NULL,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_users_token_version ON users(id, token_version);
CREATE INDEX IF NOT EXISTS idx_auth_identities_lookup ON user_auth_identities(provider, provider_user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_family ON user_refresh_tokens(family_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_active ON user_refresh_tokens(user_id, expires_at) WHERE is_revoked = FALSE;
CREATE INDEX IF NOT EXISTS idx_jwt_revoked_jti ON jwt_revoked_tokens(jti);
CREATE INDEX IF NOT EXISTS idx_jwt_revoked_expires ON jwt_revoked_tokens(expires_at);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON candidate_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_target_role ON candidate_profiles(target_role);
CREATE INDEX IF NOT EXISTS idx_profiles_target_companies_gin ON candidate_profiles USING GIN(target_companies);
CREATE INDEX IF NOT EXISTS idx_profiles_preferences_gin ON candidate_profiles USING GIN(preferences);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_event ON user_security_audit_logs(user_id, event_type, created_at DESC);


-- >>> MODULE: 02_curriculum_knowledge_graph.sql <<<
-- =============================================================================
-- Module 2: Canonical Curriculum & Knowledge Graph
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "vector";

DO $$ BEGIN
    CREATE TYPE topic_difficulty AS ENUM ('EASY', 'MEDIUM', 'HARD', 'EXPERT');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 1. Curriculum Domains (System Design, Coding, Behavioral, Cloud)
CREATE TABLE IF NOT EXISTS curriculum_domains (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Curriculum Categories (e.g. Partitioning & Sharding, Concurrency, etc.)
CREATE TABLE IF NOT EXISTS curriculum_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    domain_id UUID NOT NULL REFERENCES curriculum_domains(id) ON DELETE CASCADE,
    slug VARCHAR(100) NOT NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_categories_domain_slug UNIQUE (domain_id, slug)
);

-- 3. Curriculum Topics (135 Canonical Curricula)
CREATE TABLE IF NOT EXISTS curriculum_topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    domain_id UUID NOT NULL REFERENCES curriculum_domains(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES curriculum_categories(id) ON DELETE CASCADE,
    slug VARCHAR(150) NOT NULL UNIQUE,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    duration_min INTEGER NOT NULL DEFAULT 15,
    difficulty topic_difficulty NOT NULL DEFAULT 'MEDIUM',
    rubric_atoms TEXT[] NOT NULL DEFAULT '{}',
    practice_href VARCHAR(255) NOT NULL DEFAULT '/practice',
    icon_name VARCHAR(100) NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 4. Curriculum Questions & Challenge Templates
CREATE TABLE IF NOT EXISTS curriculum_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    topic_id UUID NOT NULL REFERENCES curriculum_topics(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    prompt TEXT NOT NULL,
    target_level VARCHAR(50) NOT NULL DEFAULT 'senior',
    hints TEXT[] NOT NULL DEFAULT '{}',
    rubric_guide TEXT NOT NULL,
    starter_code JSONB NULL,
    test_cases JSONB NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 5. Curriculum Topic Embeddings (1,536-dimensional vectors for semantic matching)
CREATE TABLE IF NOT EXISTS topic_embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    topic_id UUID NOT NULL REFERENCES curriculum_topics(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    embedding vector(1536) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_curriculum_domains_slug ON curriculum_domains(slug);
CREATE INDEX IF NOT EXISTS idx_curriculum_categories_domain ON curriculum_categories(domain_id, order_index);
CREATE INDEX IF NOT EXISTS idx_curriculum_topics_domain ON curriculum_topics(domain_id);
CREATE INDEX IF NOT EXISTS idx_curriculum_topics_category ON curriculum_topics(category_id);
CREATE INDEX IF NOT EXISTS idx_curriculum_topics_slug ON curriculum_topics(slug);
CREATE INDEX IF NOT EXISTS idx_curriculum_questions_topic ON curriculum_questions(topic_id);
CREATE INDEX IF NOT EXISTS idx_topic_embeddings_topic ON topic_embeddings(topic_id);
CREATE INDEX IF NOT EXISTS idx_topic_embeddings_cosine ON topic_embeddings USING hnsw (embedding vector_cosine_ops);


-- >>> MODULE: 03_preparation_plans.sql <<<
-- =============================================================================
-- Module 3: Dynamic Preparation Plans & Milestones
-- =============================================================================

DO $$ BEGIN
    CREATE TYPE plan_status AS ENUM (
        'DRAFT',
        'ACTIVE',
        'ADAPTING',
        'PAUSED',
        'COMPLETED'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE adaptation_trigger AS ENUM (
        'MOCK_EVALUATION',
        'PRACTICE_DRILL',
        'TIMELINE_CHANGE',
        'MANUAL_REBALANCE'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 1. Preparation Plans
CREATE TABLE IF NOT EXISTS preparation_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID NOT NULL UNIQUE REFERENCES candidate_profiles(id) ON DELETE CASCADE,
    target_role VARCHAR(150) NOT NULL,
    target_seniority VARCHAR(50) NOT NULL DEFAULT 'senior',
    timeline_weeks INTEGER NOT NULL DEFAULT 8,
    status plan_status NOT NULL DEFAULT 'ACTIVE',
    domain_weights JSONB NOT NULL DEFAULT '{
        "system-design": 0.35,
        "coding": 0.35,
        "behavioral": 0.15,
        "cloud": 0.15
    }'::jsonb,
    weekly_milestones JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_plans_weeks CHECK (timeline_weeks > 0 AND timeline_weeks <= 52)
);

-- 2. Structured Plan Milestones (Relational breakdown of weeks)
CREATE TABLE IF NOT EXISTS plan_milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID NOT NULL REFERENCES preparation_plans(id) ON DELETE CASCADE,
    week_number INTEGER NOT NULL,
    title VARCHAR(200) NOT NULL,
    focus_domain VARCHAR(100) NOT NULL,
    target_hours NUMERIC(4, 1) NOT NULL DEFAULT 6.0,
    goals TEXT[] NOT NULL DEFAULT '{}',
    recommended_topic_slugs TEXT[] NOT NULL DEFAULT '{}',
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    completed_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_plan_week UNIQUE (plan_id, week_number)
);

-- 3. Plan Adaptation Events (Audits state machine triggers & recalibration)
CREATE TABLE IF NOT EXISTS plan_adaptation_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID NOT NULL REFERENCES preparation_plans(id) ON DELETE CASCADE,
    trigger_source adaptation_trigger NOT NULL,
    trigger_entity_id UUID NULL,
    score_threshold_triggered NUMERIC(5, 2) NULL,
    reason TEXT NOT NULL,
    rebalance_delta JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_plans_candidate_id ON preparation_plans(candidate_id);
CREATE INDEX IF NOT EXISTS idx_plans_status ON preparation_plans(status);
CREATE INDEX IF NOT EXISTS idx_plan_milestones_plan ON plan_milestones(plan_id, week_number);
CREATE INDEX IF NOT EXISTS idx_adaptation_events_plan ON plan_adaptation_events(plan_id, created_at DESC);


-- >>> MODULE: 04_practice_and_mock_sessions.sql <<<
-- =============================================================================
-- Module 4: Interactive Practice & Mock Interview Sessions
-- =============================================================================

DO $$ BEGIN
    CREATE TYPE practice_session_status AS ENUM (
        'ACTIVE',
        'COMPLETED',
        'ABANDONED'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE mock_interview_status AS ENUM (
        'CONFIGURING',
        'BRIEFING',
        'ACTIVE',
        'RECORDING_PAUSED',
        'TEXT_MODE',
        'EVALUATING',
        'COMPLETED',
        'ABANDONED'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 1. Practice Sessions (Coding, System Design Whiteboard, Behavioral, Cloud)
CREATE TABLE IF NOT EXISTS practice_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID NOT NULL REFERENCES candidate_profiles(id) ON DELETE CASCADE,
    topic_id UUID NULL REFERENCES curriculum_topics(id) ON DELETE SET NULL,
    domain VARCHAR(100) NOT NULL,
    topic_slug VARCHAR(150) NOT NULL,
    title VARCHAR(255) NOT NULL,
    duration_seconds INTEGER NOT NULL DEFAULT 0,
    status practice_session_status NOT NULL DEFAULT 'ACTIVE',
    whiteboard_url TEXT NULL,
    code_submission TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Mock Interview Sessions (Multi-Turn Voice & Text Simulation)
CREATE TABLE IF NOT EXISTS mock_interview_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID NOT NULL REFERENCES candidate_profiles(id) ON DELETE CASCADE,
    interview_type VARCHAR(100) NOT NULL,
    target_role VARCHAR(150) NOT NULL,
    difficulty VARCHAR(50) NOT NULL DEFAULT 'senior',
    duration_minutes INTEGER NOT NULL DEFAULT 45,
    status mock_interview_status NOT NULL DEFAULT 'CONFIGURING',
    recording_url TEXT NULL,
    transcript JSONB NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. Mock Interview Conversational Turn Transcripts
CREATE TABLE IF NOT EXISTS session_transcripts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mock_session_id UUID NOT NULL REFERENCES mock_interview_sessions(id) ON DELETE CASCADE,
    turn_index INTEGER NOT NULL,
    speaker VARCHAR(20) NOT NULL, -- 'ai' | 'candidate'
    content TEXT NOT NULL,
    audio_timestamp_ms INTEGER NOT NULL DEFAULT 0,
    sentiment_metrics JSONB NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_session_turn UNIQUE (mock_session_id, turn_index)
);

-- 4. Whiteboard Snapshots & Diagram History
CREATE TABLE IF NOT EXISTS session_whiteboard_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    practice_session_id UUID NULL REFERENCES practice_sessions(id) ON DELETE CASCADE,
    mock_session_id UUID NULL REFERENCES mock_interview_sessions(id) ON DELETE CASCADE,
    snapshot_index INTEGER NOT NULL DEFAULT 1,
    storage_url TEXT NOT NULL,
    svg_vector_data TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_practice_sessions_candidate ON practice_sessions(candidate_id, status);
CREATE INDEX IF NOT EXISTS idx_practice_sessions_topic ON practice_sessions(topic_slug);
CREATE INDEX IF NOT EXISTS idx_mock_sessions_candidate ON mock_interview_sessions(candidate_id, status);
CREATE INDEX IF NOT EXISTS idx_session_transcripts_session ON session_transcripts(mock_session_id, turn_index);
CREATE INDEX IF NOT EXISTS idx_whiteboard_snapshots_practice ON session_whiteboard_snapshots(practice_session_id);
CREATE INDEX IF NOT EXISTS idx_whiteboard_snapshots_mock ON session_whiteboard_snapshots(mock_session_id);


-- >>> MODULE: 05_evaluations_and_rubrics.sql <<<
-- =============================================================================
-- Module 5: Multi-Dimensional Evaluations, Rubrics & Readiness Trajectory
-- =============================================================================

DO $$ BEGIN
    CREATE TYPE evaluation_verdict AS ENUM (
        'Strong Hire',
        'Hire',
        'Leaning Hire',
        'Needs Practice',
        'No Hire'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 1. Evaluation Reports (Generated via Deterministic Rubrics & Gemini Reasoning)
CREATE TABLE IF NOT EXISTS evaluation_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID NOT NULL REFERENCES candidate_profiles(id) ON DELETE CASCADE,
    practice_id UUID NULL UNIQUE REFERENCES practice_sessions(id) ON DELETE CASCADE,
    mock_id UUID NULL UNIQUE REFERENCES mock_interview_sessions(id) ON DELETE CASCADE,

    overall_score NUMERIC(5, 2) NOT NULL,
    verdict evaluation_verdict NOT NULL,
    readiness_delta NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    evaluator_notes TEXT NOT NULL,
    strengths TEXT[] NOT NULL DEFAULT '{}',
    improvements TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_eval_overall_score CHECK (overall_score >= 0.00 AND overall_score <= 100.00),
    CONSTRAINT chk_eval_target_session CHECK (
        (practice_id IS NOT NULL AND mock_id IS NULL) OR 
        (practice_id IS NULL AND mock_id IS NOT NULL)
    )
);

-- 2. Rubric Scores (Breakdown across 5-6 dimensions)
CREATE TABLE IF NOT EXISTS rubric_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id UUID NOT NULL REFERENCES evaluation_reports(id) ON DELETE CASCADE,
    dimension VARCHAR(100) NOT NULL,
    score NUMERIC(4, 2) NOT NULL,
    assessment TEXT NOT NULL,
    missing_atoms TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_report_dimension UNIQUE (report_id, dimension),
    CONSTRAINT chk_rubric_score_bounds CHECK (score >= 1.00 AND score <= 10.00)
);

-- 3. Candidate Readiness Trajectory History (Bayesian EMA Audit Ledger)
CREATE TABLE IF NOT EXISTS readiness_trajectory_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID NOT NULL REFERENCES candidate_profiles(id) ON DELETE CASCADE,
    evaluation_report_id UUID NOT NULL REFERENCES evaluation_reports(id) ON DELETE CASCADE,
    previous_readiness NUMERIC(5, 2) NOT NULL,
    new_readiness NUMERIC(5, 2) NOT NULL,
    readiness_delta NUMERIC(5, 2) NOT NULL,
    alpha_rate NUMERIC(3, 2) NOT NULL, -- 0.40 (cold start) or 0.15 (converged)
    completed_sessions_count INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_trajectory_bounds CHECK (new_readiness >= 0.00 AND new_readiness <= 100.00)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_evaluation_reports_candidate ON evaluation_reports(candidate_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_evaluation_reports_practice ON evaluation_reports(practice_id);
CREATE INDEX IF NOT EXISTS idx_evaluation_reports_mock ON evaluation_reports(mock_id);
CREATE INDEX IF NOT EXISTS idx_rubric_scores_report ON rubric_scores(report_id);
CREATE INDEX IF NOT EXISTS idx_trajectory_history_candidate ON readiness_trajectory_history(candidate_id, created_at DESC);


-- >>> MODULE: 06_spaced_repetition_and_mastery.sql <<<
-- =============================================================================
-- Module 6: Candidate Topic Mastery & SuperMemo-2 Spaced Repetition
-- =============================================================================

DO $$ BEGIN
    CREATE TYPE mastery_status AS ENUM (
        'NOT_STARTED',
        'NEEDS_PRACTICE',
        'PRACTICED',
        'MASTERED'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE cognitive_stage AS ENUM (
        'RECALL',
        'APPLICATION',
        'TRADE_OFFS',
        'EXPERT'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 1. Candidate Topic Mastery (Longitudinal progress across 135 topics)
CREATE TABLE IF NOT EXISTS candidate_topic_masteries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID NOT NULL REFERENCES candidate_profiles(id) ON DELETE CASCADE,
    topic_id UUID NOT NULL REFERENCES curriculum_topics(id) ON DELETE CASCADE,

    mastery_score NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    status mastery_status NOT NULL DEFAULT 'NOT_STARTED',
    cognitive_stage cognitive_stage NOT NULL DEFAULT 'RECALL',
    total_attempts INTEGER NOT NULL DEFAULT 0,
    last_practiced_at TIMESTAMPTZ NULL,

    -- Spaced Repetition Tracking
    interval_days NUMERIC(5, 1) NOT NULL DEFAULT 1.0,
    ease_factor NUMERIC(4, 2) NOT NULL DEFAULT 2.50,
    next_review_date TIMESTAMPTZ NULL,

    -- Running Dimensional Averages
    avg_technical_depth NUMERIC(4, 2) NOT NULL DEFAULT 0.00,
    avg_tradeoffs NUMERIC(4, 2) NOT NULL DEFAULT 0.00,
    avg_data_modeling NUMERIC(4, 2) NOT NULL DEFAULT 0.00,
    avg_scalability NUMERIC(4, 2) NOT NULL DEFAULT 0.00,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_candidate_topic UNIQUE (candidate_id, topic_id),
    CONSTRAINT chk_mastery_score CHECK (mastery_score >= 0.00 AND mastery_score <= 100.00),
    CONSTRAINT chk_mastery_ef_floor CHECK (ease_factor >= 1.30)
);

-- 2. Revision Items (SuperMemo-2 Priority Active Queue)
CREATE TABLE IF NOT EXISTS revision_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID NOT NULL REFERENCES candidate_profiles(id) ON DELETE CASCADE,
    topic_id UUID NOT NULL REFERENCES curriculum_topics(id) ON DELETE CASCADE,
    topic_title VARCHAR(200) NOT NULL,
    domain VARCHAR(100) NOT NULL,
    interval_days NUMERIC(5, 1) NOT NULL DEFAULT 1.0,
    ease_factor NUMERIC(4, 2) NOT NULL DEFAULT 2.50,
    repetitions INTEGER NOT NULL DEFAULT 0,
    next_review_date TIMESTAMPTZ NOT NULL,
    last_reviewed_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_revision_ef_floor CHECK (ease_factor >= 1.30)
);

-- 3. Revision Drill Event Logs (Audit trail of every flashcard review attempt)
CREATE TABLE IF NOT EXISTS revision_drill_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    revision_item_id UUID NOT NULL REFERENCES revision_items(id) ON DELETE CASCADE,
    candidate_id UUID NOT NULL REFERENCES candidate_profiles(id) ON DELETE CASCADE,
    session_score NUMERIC(5, 2) NOT NULL,
    sm2_grade_q INTEGER NOT NULL, -- 0 to 5
    previous_interval NUMERIC(5, 1) NOT NULL,
    new_interval NUMERIC(5, 1) NOT NULL,
    previous_ef NUMERIC(4, 2) NOT NULL,
    new_ef NUMERIC(4, 2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_drill_grade CHECK (sm2_grade_q >= 0 AND sm2_grade_q <= 5)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_topic_masteries_candidate_status ON candidate_topic_masteries(candidate_id, status);
CREATE INDEX IF NOT EXISTS idx_topic_masteries_next_review ON candidate_topic_masteries(candidate_id, next_review_date);
CREATE INDEX IF NOT EXISTS idx_revision_items_due ON revision_items(candidate_id, next_review_date ASC);
CREATE INDEX IF NOT EXISTS idx_revision_drill_logs_item ON revision_drill_logs(revision_item_id, created_at DESC);


-- >>> MODULE: 07_document_embeddings_rag.sql <<<
-- =============================================================================
-- Module 7: Multimodal RAG Document Embeddings (pgvector)
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "vector";

DO $$ BEGIN
    CREATE TYPE document_type AS ENUM (
        'resume',
        'job_description',
        'interview_guide',
        'system_design_primer'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 1. Document Embeddings (Semantic Resume & Job Description Chunks)
CREATE TABLE IF NOT EXISTS document_embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID NOT NULL REFERENCES candidate_profiles(id) ON DELETE CASCADE,
    doc_type document_type NOT NULL DEFAULT 'resume',
    file_name VARCHAR(255) NULL,
    chunk_index INTEGER NOT NULL DEFAULT 0,
    content TEXT NOT NULL,
    embedding vector(1536) NOT NULL,
    storage_url TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_candidate_doc_chunk UNIQUE (candidate_id, doc_type, chunk_index)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_document_embeddings_candidate ON document_embeddings(candidate_id, doc_type);
-- HNSW Vector Index for Sub-Millisecond Cosine Similarity Search (<=>)
CREATE INDEX IF NOT EXISTS idx_document_embeddings_hnsw_cosine 
    ON document_embeddings 
    USING hnsw (embedding vector_cosine_ops)
    WITH (m = 16, ef_construction = 64);


-- >>> MODULE: 08_triggers_and_routines.sql <<<
-- =============================================================================
-- Module 8: Unified Automation Triggers & Maintenance Routines
-- =============================================================================

-- Automated timestamp synchronization trigger function
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers across all mutable tables
DROP TRIGGER IF EXISTS trg_users_updated_at ON users;
CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

DROP TRIGGER IF EXISTS trg_user_auth_identities_updated_at ON user_auth_identities;
CREATE TRIGGER trg_user_auth_identities_updated_at
    BEFORE UPDATE ON user_auth_identities
    FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

DROP TRIGGER IF EXISTS trg_candidate_profiles_updated_at ON candidate_profiles;
CREATE TRIGGER trg_candidate_profiles_updated_at
    BEFORE UPDATE ON candidate_profiles
    FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

DROP TRIGGER IF EXISTS trg_curriculum_domains_updated_at ON curriculum_domains;
CREATE TRIGGER trg_curriculum_domains_updated_at
    BEFORE UPDATE ON curriculum_domains
    FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

DROP TRIGGER IF EXISTS trg_curriculum_categories_updated_at ON curriculum_categories;
CREATE TRIGGER trg_curriculum_categories_updated_at
    BEFORE UPDATE ON curriculum_categories
    FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

DROP TRIGGER IF EXISTS trg_curriculum_topics_updated_at ON curriculum_topics;
CREATE TRIGGER trg_curriculum_topics_updated_at
    BEFORE UPDATE ON curriculum_topics
    FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

DROP TRIGGER IF EXISTS trg_curriculum_questions_updated_at ON curriculum_questions;
CREATE TRIGGER trg_curriculum_questions_updated_at
    BEFORE UPDATE ON curriculum_questions
    FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

DROP TRIGGER IF EXISTS trg_preparation_plans_updated_at ON preparation_plans;
CREATE TRIGGER trg_preparation_plans_updated_at
    BEFORE UPDATE ON preparation_plans
    FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

DROP TRIGGER IF EXISTS trg_plan_milestones_updated_at ON plan_milestones;
CREATE TRIGGER trg_plan_milestones_updated_at
    BEFORE UPDATE ON plan_milestones
    FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

DROP TRIGGER IF EXISTS trg_practice_sessions_updated_at ON practice_sessions;
CREATE TRIGGER trg_practice_sessions_updated_at
    BEFORE UPDATE ON practice_sessions
    FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

DROP TRIGGER IF EXISTS trg_mock_interview_sessions_updated_at ON mock_interview_sessions;
CREATE TRIGGER trg_mock_interview_sessions_updated_at
    BEFORE UPDATE ON mock_interview_sessions
    FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

DROP TRIGGER IF EXISTS trg_candidate_topic_masteries_updated_at ON candidate_topic_masteries;
CREATE TRIGGER trg_candidate_topic_masteries_updated_at
    BEFORE UPDATE ON candidate_topic_masteries
    FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

DROP TRIGGER IF EXISTS trg_revision_items_updated_at ON revision_items;
CREATE TRIGGER trg_revision_items_updated_at
    BEFORE UPDATE ON revision_items
    FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();


COMMIT;
-- =============================================================================
-- End of PrepInMinutes Master Schema
-- =============================================================================
