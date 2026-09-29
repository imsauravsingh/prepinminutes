# Phase 3: Deterministic Domain Core Engines

## 📌 Executive Summary

Phase 3 builds the zero-hallucination mathematical domain services in `src/server/domain/`. Under PrepInMinutes' core architectural invariant, **LLMs never compute numerical scores, readiness percentages, or memory decay intervals directly**. All mathematical evaluations, hiring verdicts, Bayesian readiness updates, and spaced repetition intervals are computed by pure, deterministic TypeScript functions.

---

## 🎯 Phase Goals & Deliverables

1. **5-Dimension Scoring Engine (`src/server/domain/scoring.ts`)**:
   - Calculates deterministic weighted rubric scores ($0.0 - 100.0$) and assigns standard hiring verdicts (`Strong Hire`, `Hire`, `Needs Practice`).
2. **Bayesian Readiness Engine (`src/server/domain/readiness.ts`)**:
   - Updates candidate aggregate readiness ($0\text{–}100\%$) using an exponential moving average with domain confidence weighting and computes $\Delta\text{Readiness}$.
3. **SuperMemo-2 (SM-2) Spaced Repetition Engine (`src/server/domain/spaced-repetition.ts`)**:
   - Calculates memory decay intervals, updates ease factors ($EF$), and schedules exact UTC `nextReviewDate` timestamps.

---

## 🧮 1. The 5-Dimension Scoring Engine (`src/server/domain/scoring.ts`)

### Rubric Weights & Dimensional Matrix

| Dimension                       | Key                         |   Weight   | Focus Areas                                                              |
| :------------------------------ | :-------------------------- | :--------: | :----------------------------------------------------------------------- |
| **Technical Depth**             | `technical_depth`           | **$0.30$** | Algorithmic complexity, concurrency, protocol depth, cache semantics     |
| **Trade-offs & Reasoning**      | `tradeoffs_reasoning`       | **$0.25$** | Justification of choices, CAP theorem trade-offs, space vs. time         |
| **Communication & Structure**   | `communication_structure`   | **$0.20$** | Requirement clarification, structured decomposition, naming              |
| **Scalability & Failure Modes** | `scalability_failure_modes` | **$0.15$** | Single points of failure, partition tolerance, rate limits, backpressure |
| **Code / Diagram Quality**      | `code_diagram_quality`      | **$0.10$** | Clean code conventions, modularity, boundary handling, diagram layout    |

### Mathematical Formula

$$\text{Overall Score} = \sum_{i=1}^{5} \left( \text{Dimension Score}_i \times \text{Weight}_i \times 10 \right)$$

_Where each Dimension Score is rated on a continuous scale of $1.0$ to $10.0$, scaling the final score to $0.0 - 100.0$._

### Verdict Cutoffs

- **Strong Hire**: $\text{Overall Score} \ge 85.0$
- **Hire**: $70.0 \le \text{Overall Score} < 85.0$
- **Needs Practice**: $\text{Overall Score} < 70.0$

### Implementation Blueprint

```typescript
export interface RawDimensionScores {
  technical_depth: number; // 1.0 - 10.0
  tradeoffs_reasoning: number; // 1.0 - 10.0
  communication_structure: number; // 1.0 - 10.0
  scalability_failure_modes: number; // 1.0 - 10.0
  code_diagram_quality: number; // 1.0 - 10.0
}

export interface ComputedEvaluation {
  overallScore: number;
  verdict: "Strong Hire" | "Hire" | "Needs Practice";
  normalizedDimensions: Record<string, number>;
}

export function computeRubricScore(
  scores: RawDimensionScores,
): ComputedEvaluation {
  const weights: Record<keyof RawDimensionScores, number> = {
    technical_depth: 0.3,
    tradeoffs_reasoning: 0.25,
    communication_structure: 0.2,
    scalability_failure_modes: 0.15,
    code_diagram_quality: 0.1,
  };

  let totalWeightedScore = 0;

  for (const [dimension, weight] of Object.entries(weights) as [
    keyof RawDimensionScores,
    number,
  ][]) {
    const raw = Math.max(1.0, Math.min(10.0, scores[dimension] || 1.0));
    totalWeightedScore += raw * weight * 10;
  }

  const overallScore = Math.round(totalWeightedScore * 10) / 10;

  let verdict: "Strong Hire" | "Hire" | "Needs Practice" = "Needs Practice";
  if (overallScore >= 85.0) {
    verdict = "Strong Hire";
  } else if (overallScore >= 70.0) {
    verdict = "Hire";
  }

  return {
    overallScore,
    verdict,
    normalizedDimensions: { ...scores },
  };
}
```

---

## 📈 2. Bayesian Readiness Engine (`src/server/domain/readiness.ts`)

Calculates a candidate's readiness score using an adaptive exponential moving average that weighs recent performance against historical confidence.

### Formula

$$R_t = \alpha \cdot S_t + (1 - \alpha) \cdot R_{t-1}$$

Where:

- $R_t$: New readiness score ($0.0 - 100.0$)
- $S_t$: Performance score on current session ($0.0 - 100.0$)
- $R_{t-1}$: Prior readiness score
- $\alpha$: Dynamic learning rate:
  - If total completed sessions $N \le 3$: $\alpha = 0.40$ (rapid calibration)
  - If total completed sessions $N > 3$: $\alpha = 0.15$ (stable Bayesian convergence)

```typescript
export function calculateReadinessUpdate(
  currentReadiness: number,
  sessionScore: number,
  completedSessionsCount: number,
): { newReadiness: number; readinessDelta: number } {
  const alpha = completedSessionsCount <= 3 ? 0.4 : 0.15;
  const newReadinessRaw = alpha * sessionScore + (1 - alpha) * currentReadiness;

  const newReadiness =
    Math.round(Math.max(0, Math.min(100, newReadinessRaw)) * 10) / 10;
  const readinessDelta =
    Math.round((newReadiness - currentReadiness) * 10) / 10;

  return { newReadiness, readinessDelta };
}
```

---

## 🧠 3. SuperMemo-2 Spaced Repetition Engine (`src/server/domain/spaced-repetition.ts`)

Prevents knowledge decay by applying the SM-2 algorithm to schedule periodic recall drills.

### Algorithm Rules

1. **Grade ($q$)**: Derived from session score:
   - Score $\ge 85$: $q = 5$ (perfect response)
   - $70 \le$ Score $< 85$: $q = 4$ (correct with hesitation)
   - $55 \le$ Score $< 70$: $q = 3$ (serious difficulties)
   - Score $< 55$: $q = 2$ (incorrect)
2. **Ease Factor Update ($EF'$)**:
   $$EF' = EF + (0.1 - (5 - q) \cdot (0.08 + (5 - q) \cdot 0.02))$$
   _Constrained such that $EF' \ge 1.30$._
3. **Repetition Interval ($I$)**:
   - If $q < 3$: Reset repetition count to $0$, $I = 1\text{ day}$.
   - If $q \ge 3$:
     - Repetition 1: $I_1 = 1\text{ day}$
     - Repetition 2: $I_2 = 6\text{ days}$
     - Repetition $n > 2$: $I_n = I_{n-1} \times EF'$

```typescript
export interface SM2Input {
  repetitions: number;
  intervalDays: number;
  easeFactor: number;
  sessionScore: number;
}

export interface SM2Output {
  repetitions: number;
  intervalDays: number;
  easeFactor: number;
  nextReviewDate: Date;
}

export function computeSM2(input: SM2Input): SM2Output {
  const { repetitions, intervalDays, easeFactor, sessionScore } = input;

  let q = 2;
  if (sessionScore >= 85) q = 5;
  else if (sessionScore >= 70) q = 4;
  else if (sessionScore >= 55) q = 3;

  let newEF = easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  if (newEF < 1.3) newEF = 1.3;

  let newRepetitions: number;
  let newInterval: number;

  if (q < 3) {
    newRepetitions = 0;
    newInterval = 1;
  } else {
    newRepetitions = repetitions + 1;
    if (newRepetitions === 1) {
      newInterval = 1;
    } else if (newRepetitions === 2) {
      newInterval = 6;
    } else {
      newInterval = Math.round(intervalDays * newEF);
    }
  }

  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + newInterval);

  return {
    repetitions: newRepetitions,
    intervalDays: newInterval,
    easeFactor: Math.round(newEF * 100) / 100,
    nextReviewDate,
  };
}
```

---

## ✅ Phase 3 Verification Checklist

- [ ] Scoring unit test: all 5 dimensions at $10.0$ yields strictly $100.0$ with verdict `Strong Hire`.
- [ ] Scoring unit test: scores averaging below $70.0$ yields strictly `Needs Practice`.
- [ ] Readiness engine properly clamps values between $0.0$ and $100.0$.
- [ ] SM-2 engine never allows ease factor ($EF$) to dip below $1.3$.
- [ ] SM-2 correctly schedules next review to future UTC timestamp.
