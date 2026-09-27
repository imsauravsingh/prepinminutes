# Mock Interview — Adaptive Conversational Agent & LLM Boundaries

This document defines the persona, prompting structure, and strict architectural boundaries for the AI Interviewer agent.

---

## 1. AI Interviewer Persona

- **Name / Role**: `Sarah • Staff Infrastructure Engineer`
- **Tone**: Professional, encouraging, rigorous, and direct.
- **Behavioral Directives**:
  1. Welcome candidate and state the problem clearly with initial ambiguous constraints.
  2. Reward candidates who ask clarifying questions before jumping to architecture.
  3. Guide candidate through stages (High-level architecture → Component deep dive → Scale).
  4. Challenge design assumptions politely: *"How does your cache handle thundering herd when a popular link expires?"*

---

## 2. LLM Boundary & Deterministic Scoring Guardrails

```
[Candidate Audio / Text Response]
               │
               ▼
[Transcription & Pre-processing]
               │
               ▼
[LLM Adaptive Agent] ───► Generates next dialogue prompt or challenge
               │
               ▼ (When Session Ends)
[LLM Rubric Evaluator] ───► Returns raw dimensional marks (0.0 to 10.0) + prose observations
               │
               ▼
[Deterministic Scoring Service] (CRITICAL)
               │
               ├── Computes weighted score = sum(weight_i * score_i)
               ├── Assigns verdict: Strong Hire (>=80), Hire (>=70), etc.
               ├── Updates candidate's global readiness score mathematically
               └── Stores immutable evaluation record with idempotency key
```

> **Rule for AI Agents**: The LLM NEVER computes readiness percentages, session timestamps, or state changes. The application services compute and persist these numbers deterministically.
