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
