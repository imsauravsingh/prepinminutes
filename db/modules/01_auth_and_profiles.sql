-- =============================================================================
-- Module 1: Authentication, Identity, Sessions & Candidate Profiles
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

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL,
    email_verified_at TIMESTAMPTZ NULL,
    role user_role NOT NULL DEFAULT 'candidate',
    status account_status NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ NULL,

    CONSTRAINT uq_users_email UNIQUE (email),
    CONSTRAINT chk_users_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- 2. User Authentication Identities (Clerk / OAuth / Local)
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

-- 3. User Sessions
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(512) NOT NULL UNIQUE,
    ip_address INET NULL,
    user_agent TEXT NULL,
    device_info JSONB NOT NULL DEFAULT '{}'::jsonb,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_active_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    revoked_at TIMESTAMPTZ NULL
);

-- 4. Candidate Profiles
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

-- 5. User Security Audit Logs
CREATE TABLE IF NOT EXISTS user_security_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NULL REFERENCES users(id) ON DELETE SET NULL,
    event_type VARCHAR(60) NOT NULL,
    ip_address INET NULL,
    user_agent TEXT NULL,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_auth_identities_lookup ON user_auth_identities(provider, provider_user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user_active ON user_sessions(user_id, expires_at) WHERE revoked_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON candidate_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_target_role ON candidate_profiles(target_role);
CREATE INDEX IF NOT EXISTS idx_profiles_target_companies_gin ON candidate_profiles USING GIN(target_companies);
CREATE INDEX IF NOT EXISTS idx_profiles_preferences_gin ON candidate_profiles USING GIN(preferences);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_event ON user_security_audit_logs(user_id, event_type, created_at DESC);
