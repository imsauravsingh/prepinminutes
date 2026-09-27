# My Preparation Plan — Plan Generation & LLM Boundaries

This document defines how preparation plans are generated, how LLM suggestions are combined with deterministic rules, and the strict boundaries between AI synthesis and mathematical weighting.

---

## 1. Generation Pipeline Architecture

```
[Candidate Profile: Role, Experience, Timeline, Resume, JD]
                             │
                             ▼
     ┌─────────────────────────────────────────────────┐
     │ 1. Deterministic Domain Weighting Service       │
     │    - SRE: 40% System Design, 30% Coding, etc.   │
     │    - Calculates total hours & week allocations │
     └───────────────────────┬─────────────────────────┘
                             │
                             ▼
     ┌─────────────────────────────────────────────────┐
     │ 2. LLM Topic Synthesis Service (Prompt)         │
     │    - Extracts unique resume tech stacks         │
     │    - Recommends tailored problem scenarios      │
     │    - Proposes topic titles & descriptions       │
     └───────────────────────┬─────────────────────────┘
                             │
                             ▼
     ┌─────────────────────────────────────────────────┐
     │ 3. Deterministic Validation & Normalization     │
     │    - Validates schema & difficulty levels       │
     │    - Sequences phases chronologically           │
     │    - Sets initial readiness baseline = 25%      │
     └─────────────────────────────────────────────────┘
```

---

## 2. LLM vs. Deterministic Boundaries

| Responsibility | Owner | Rule |
|----------------|-------|------|
| **Curriculum Topics** | LLM | Generates relevant topic names based on resume/JD (e.g. *PostgreSQL Sharding at Scale*). |
| **Domain Weighting** | Deterministic Service | Senior role = 45% System Design, 35% Coding, 20% Behavioral. LLM cannot override percentages. |
| **Phase Scheduling** | Deterministic Service | Hours per week = Total Hours / Timeline Weeks. Phase duration mapped mathematically. |
| **Topic Completion** | Deterministic Service | A topic is marked complete ONLY after candidate achieves $\ge 70\%$ in a practice or mock evaluation. |
