# Revision Module — Overview

The **Revision Module** (`/revision`) implements a continuous retention and spaced repetition engine. It prevents knowledge decay by automatically re-surfacing previously learned topics at scientifically optimized intervals.

---

## 1. Core Mission

Technical interview preparation is susceptible to the **Ebbinghaus Forgetting Curve**: candidates forget up to 70% of studied material within 7 days if not reviewed.

PrepInMinutes solves this by:
1. **Automated Weakness Capture**: Every topic where a candidate scored poorly in practice or mock interviews is automatically flagged.
2. **Interval-Based Scheduling**: Review intervals expand dynamically upon successful recall (Day 1 → Day 3 → Day 7 → Day 14 → Day 30).
3. **Knowledge Health Score**: A single metric representing aggregate retention health across all covered topics.

---

## 2. Interaction With Practice & Evaluation

```
[Practice / Mock Evaluation < 70%]
                │
                ▼
  [Added to Revision Queue]
                │
                ▼ (Scheduled after interval)
  [Due in "Today's Revision"]
                │
                ▼
  [Candidate Completes Drill]
      ├── Pass (>= 80%) ──► Interval Expands (e.g. 3d -> 7d)
      └── Fail (< 70%)   ──► Interval Resets to Day 1
```
