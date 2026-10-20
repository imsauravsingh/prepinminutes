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
