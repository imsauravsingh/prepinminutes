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
