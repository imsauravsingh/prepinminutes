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
