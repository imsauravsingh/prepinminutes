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
