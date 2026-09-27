# Revision Module — Rapid Recall Flow & Interactive Drill

This document specifies the rapid reinforcement workflow when a candidate clicks "Revise Now" on a queue item.

---

## 1. Recall Drill Workflow

1. **Card Presentation**: Candidate receives a quick concept challenge card (e.g. _"Explain how consistent hashing prevents massive key redistribution when adding cache nodes"_).
2. **Recall Attempt**: Candidate records a 60-second audio snippet or selects key architecture trade-offs.
3. **Instant Rubric Check**: AI evaluates the core concept match and checks off required technical points (e.g. _Hash ring, Virtual nodes, Rebalance overhead_).
4. **Immediate Feedback**:
   - High Recall ($q \ge 4$): Success animation, interval expands (e.g. next review in 7 days), Knowledge Health score increases.
   - Low Recall ($q < 3$): Key concept summary displayed, item remains due tomorrow.

---

## 2. LLM vs. Deterministic Boundary

- **LLM**: Evaluates candidate's written or spoken answer against key concepts and highlights missing details.
- **Deterministic Service**: Calculates new interval $I_{n+1}$, updates `next_review_at` timestamp, and recalculates the candidate's Knowledge Health score.
