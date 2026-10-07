-- =============================================================================
-- PrepInMinutes — PostgreSQL Database Schema
-- Module: User Authentication, Identity, Sessions & Candidate Profiles
-- Classification: Internal Reference Schema (File-Only / CI / Repository)
-- =============================================================================

-- Enable required PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- 1. Custom Enum Types
-- =============================================================================

DO $$ BEGIN
    CREATE TYPE user_role AS ENUM (
        'candidate',
        'interviewer',
        'mentor',
        'admin'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE account_status AS ENUM (
        'active',
        'suspended',
        'pending_verification',
        'deactivated'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE auth_provider AS ENUM (
        'clerk',
        'email_password',
        'google',
        'github',
        'linkedin'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE experience_level AS ENUM (
        'intern',
        'entry_level',
        'mid_level',
        'senior',
        'staff',
        'principal',
        'distinguished'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- =============================================================================
-- 2. Core Tables
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Table: users
-- Primary identity record for every candidate and system user
-- -----------------------------------------------------------------------------
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

COMMENT ON TABLE users IS 'Master user record holding identity credentials, access role, and account state';
COMMENT ON COLUMN users.id IS 'Immutable UUID v4 primary key';
COMMENT ON COLUMN users.email IS 'Unique, normalized lowercase email address';
COMMENT ON COLUMN users.deleted_at IS 'Soft delete timestamp for GDPR/CCPA compliance';

-- -----------------------------------------------------------------------------
-- Table: user_auth_identities
-- Decouples primary user record from authentication providers (Clerk, OAuth, Local)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_auth_identities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    provider auth_provider NOT NULL,
    provider_user_id VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NULL,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    last_sign_in_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_auth_identities_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT uq_auth_provider_uid UNIQUE (provider, provider_user_id)
);

COMMENT ON TABLE user_auth_identities IS 'Authentication provider linkage (supports multiple auth providers per user e.g. Clerk user ID, Google OAuth, Email/Password)';

-- -----------------------------------------------------------------------------
-- Table: user_sessions
-- Stateful session tracker for tracking active tokens, client telemetry & revoking access
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    session_token VARCHAR(512) NOT NULL,
    ip_address INET NULL,
    user_agent TEXT NULL,
    device_info JSONB NOT NULL DEFAULT '{}'::jsonb,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_active_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    revoked_at TIMESTAMPTZ NULL,

    CONSTRAINT fk_sessions_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT uq_sessions_token UNIQUE (session_token)
);

COMMENT ON TABLE user_sessions IS 'Active candidate authentication sessions, tokens, IP tracing, and revocation metadata';

-- -----------------------------------------------------------------------------
-- Table: user_profiles
-- Comprehensive candidate profile: roles, career targets, companies & settings
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    first_name VARCHAR(100) NULL,
    last_name VARCHAR(100) NULL,
    display_name VARCHAR(100) NULL,
    avatar_url TEXT NULL,
    bio TEXT NULL,
    headline VARCHAR(200) NULL,
    phone_number VARCHAR(30) NULL,
    country_code VARCHAR(10) NULL,
    timezone VARCHAR(50) NOT NULL DEFAULT 'UTC',
    
    -- Technical preparation & career targets
    target_role VARCHAR(150) NOT NULL DEFAULT 'Senior Software Engineer',
    target_seniority experience_level NOT NULL DEFAULT 'senior',
    target_companies TEXT[] NOT NULL DEFAULT '{}',
    target_timeline_weeks INTEGER NOT NULL DEFAULT 8,
    weekly_goal_hours NUMERIC(4, 1) NOT NULL DEFAULT 6.0,
    years_of_experience NUMERIC(3, 1) NULL,
    current_company VARCHAR(150) NULL,
    
    -- External links & assets
    linkedin_url TEXT NULL,
    github_url TEXT NULL,
    portfolio_url TEXT NULL,
    resume_storage_key TEXT NULL,

    -- Customizable candidate preferences (JSONB)
    preferences JSONB NOT NULL DEFAULT '{
        "theme": "dark",
        "email_notifications": true,
        "daily_revision_reminders": true,
        "preferred_coding_language": "typescript",
        "audio_speed_multiplier": 1.0
    }'::jsonb,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_profiles_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT uq_profiles_user UNIQUE (user_id),
    CONSTRAINT chk_profiles_timeline CHECK (target_timeline_weeks > 0 AND target_timeline_weeks <= 52),
    CONSTRAINT chk_profiles_goal_hours CHECK (weekly_goal_hours >= 1.0 AND weekly_goal_hours <= 80.0)
);

COMMENT ON TABLE user_profiles IS 'Candidate personal data, technical interview focus areas, target companies, and personal preferences';

-- -----------------------------------------------------------------------------
-- Table: user_security_audit_logs
-- Immutable append-only audit trail for compliance, security events & login tracking
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_security_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NULL,
    event_type VARCHAR(60) NOT NULL,
    ip_address INET NULL,
    user_agent TEXT NULL,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_audit_logs_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE SET NULL
);

COMMENT ON TABLE user_security_audit_logs IS 'Append-only audit log for authentication events, password updates, and security checkpoints';

-- =============================================================================
-- 3. Performance Indexes
-- =============================================================================

-- Users
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at DESC);

-- User Auth Identities
CREATE INDEX IF NOT EXISTS idx_auth_identities_user_id ON user_auth_identities(user_id);
CREATE INDEX IF NOT EXISTS idx_auth_identities_lookup ON user_auth_identities(provider, provider_user_id);

-- User Sessions
CREATE INDEX IF NOT EXISTS idx_sessions_user_active ON user_sessions(user_id, expires_at) WHERE revoked_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON user_sessions(expires_at);

-- User Profiles
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_target_role ON user_profiles(target_role);
CREATE INDEX IF NOT EXISTS idx_profiles_target_seniority ON user_profiles(target_seniority);
CREATE INDEX IF NOT EXISTS idx_profiles_target_companies_gin ON user_profiles USING GIN(target_companies);
CREATE INDEX IF NOT EXISTS idx_profiles_preferences_gin ON user_profiles USING GIN(preferences);

-- Security Audit Logs
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_event ON user_security_audit_logs(user_id, event_type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON user_security_audit_logs(created_at DESC);

-- =============================================================================
-- 4. Timestamp Automation Triggers
-- =============================================================================

CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_users_updated_at ON users;
CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamp();

DROP TRIGGER IF EXISTS trg_user_auth_identities_updated_at ON user_auth_identities;
CREATE TRIGGER trg_user_auth_identities_updated_at
    BEFORE UPDATE ON user_auth_identities
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamp();

DROP TRIGGER IF EXISTS trg_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER trg_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamp();
