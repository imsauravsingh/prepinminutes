# Evaluation Hub — Mathematical Readiness Scoring Algorithm

This document defines the deterministic mathematical algorithm for calculating and updating candidate readiness percentages.

---

## 1. Mathematical Algorithm

The candidate's **Overall Readiness ($R_t \in [0, 100]$)** at time $t$ is calculated via an exponentially weighted moving average across domains, combined with practice completion coverage:

$$R_t = \alpha \cdot \sum_{d \in D} \left( w_d \cdot S_{d,t} \right) + (1 - \alpha) \cdot C_t$$

Where:
- $D = \{\text{System Design}, \text{Coding}, \text{Behavioral}, \text{Cloud}\}$
- $w_d$: Role-specific domain weight (e.g. Senior SWE: $w_{\text{SD}} = 0.40, w_{\text{Code}} = 0.35, w_{\text{Beh}} = 0.15, w_{\text{Cloud}} = 0.10$) with $\sum w_d = 1.0$.
- $S_{d,t}$: Recent evaluation score for domain $d$ (weighted average of last 5 attempts).
- $C_t$: Curriculum completion percentage ($\frac{\text{Completed Topics}}{\text{Total Topics}} \times 100$).
- $\alpha$: Scoring weight factor (typically $0.70$ for evaluation mastery, $0.30$ for coverage).

---

## 2. Readiness Delta Rules

1. **Upper Bound Limit**: A single practice session can increase overall readiness by at most $+3\%$.
2. **Mock Interview Weight**: A full 45-minute mock interview can increase readiness by up to $+8\%$ due to its comprehensive evaluation scope.
3. **Decay Impact**: Inactivity for more than 7 days applies a decay penalty ($\Delta R = -1.5\%$ per week of inactivity, bounded at a $40\%$ floor) until the candidate completes a revision drill.
