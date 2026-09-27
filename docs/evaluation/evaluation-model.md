# Evaluation Hub — Evaluation Model & Rubric Dimensions

This document defines the 6 core evaluation dimensions and scoring rubrics used across PrepInMinutes evaluations.

---

## 1. The 6 Evaluation Dimensions

| Dimension | Description | Typical Weight (Senior SWE) |
|-----------|-------------|----------------------------|
| **1. Technical Depth** | Mastery of underlying computer science concepts, protocols, storage engines, and internal mechanics. | 20% |
| **2. Reasoning & Trade-offs** | Ability to weigh alternatives (e.g. SQL vs NoSQL, CP vs AP), articulate why a solution was chosen, and justify compromises. | 20% |
| **3. Data Modeling & Architecture** | Sound relational/NoSQL schemas, caching strategies, stateless tier separation, and partitioning keys. | 20% |
| **4. Communication & Structure** | Structured presentation, active listening, asking clarifying questions, and explaining ideas clearly. | 15% |
| **5. Problem Solving & Estimation** | Back-of-the-envelope calculations (QPS, storage, bandwidth), identifying edge cases, and deriving requirements. | 15% |
| **6. Follow-up & Scalability** | Handling unexpected failures, multi-region replication, bottleneck identification, and stress points. | 10% |

---

## 2. Verdict Classifications

The deterministic scoring service maps weighted scores ($S \in [0, 100]$) to standard hiring recommendations:

- **Strong Hire ($\ge 80$)**: Candidate operates at or above the target level with minimal guidance.
- **Hire ($70 - 79$)**: Candidate demonstrates solid competence with minor gaps in secondary areas.
- **Lean Hire ($60 - 69$)**: Candidate meets baseline expectations but requires supervision on complex architectures.
- **No Hire ($< 60$)**: Fundamental gaps in core requirements, incorrect capacity estimations, or unaddressed bottlenecks.
