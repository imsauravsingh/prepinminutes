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
