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
