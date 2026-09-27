# Revision Module — Spaced Repetition Queue & Scheduling Algorithm

This document defines the mathematical spaced repetition scheduling algorithm powering the Revision Queue.

---

## 1. Scheduling Algorithm (SM-2 Variant)

Each revision topic has an interval factor $I_n$ (in days) and an ease factor $E \ge 1.3$:

$$I_1 = 1 \text{ day}$$
$$I_2 = 3 \text{ days}$$
$$I_n = I_{n-1} \times E \quad (\text{for } n > 2)$$

Where:

- $E$ is adjusted based on candidate score $q \in [0, 5]$:
  $$E' = E + (0.1 - (5 - q) \cdot (0.08 + (5 - q) \cdot 0.02))$$
- If candidate score $q < 3$ ($< 60\%$), $I_n$ resets to $I_1 = 1$, moving the item to the immediate revision queue.

---

## 2. Priority Queue Ranking Formula

When displaying topics in `RevisionQueueTable.tsx`, priority $P$ is determined deterministically:

$$P = \frac{\text{Days Overdue} \times \text{Domain Weight}}{\text{Last Evaluation Score}}$$

Topics with high overdue days in heavily weighted domains (e.g. System Design for Senior SWE) bubble to the top with red "Overdue" badges.
