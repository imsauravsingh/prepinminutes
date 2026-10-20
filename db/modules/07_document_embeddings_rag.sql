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
