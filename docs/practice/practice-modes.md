# Practice Module — Practice Modes & Domain Workflows

This document defines the 4 specialized practice modes implemented in `src/components/practice/`.

---

## 1. System Design Mode (`SystemDesignWorkspace.tsx`)

- **Objective**: Design distributed architectures meeting specific throughput, storage, and latency constraints.
- **Key Interactivity**:
  - Ticking timer pill with pulsing indicator (`formatTimer(secondsElapsed) / 45:00`).
  - Chat dialogue with AI interviewer questions and hints.
  - Whiteboard Modal launcher: Replaces or overlays main view with a collaborative canvas.
  - Audio waveform recording dock with pause, resume, and text typing fallback.
  - End Session modal redirecting to immediate evaluation (`/session/system-design/evaluation`).

---

## 2. Coding Mode (`PracticeCodingWorkspace.tsx`)

- **Objective**: Implement clean, efficient algorithmic solutions (e.g. Sliding Window, Graphs, Dynamic Programming).
- **Key Interactivity**:
  - Problem description panel with constraints and sample inputs/outputs.
  - In-browser code editor with syntax highlighting and language picker (Python, TypeScript, Java, Go).
  - "Run Code" execution sandbox testing sample cases.
  - "Submit Solution" triggers a confirmation modal:
    - **Title**: `Submit Coding Solution?`
    - **Description**: `Are you ready to submit your code for evaluation? Your implementation will be analyzed across test correctness, algorithmic complexity, and code quality.`
    - **Actions**: `Continue Session` (dismisses modal) or `Confirm & Submit` (redirects to `/practice/session/coding/evaluation`).

---

## 3. Behavioral Mode (`BehavioralWorkspace.tsx`)

- **Objective**: Practice leadership and behavioral questions using the STAR framework.
- **Key Interactivity**:
  - Prompt: e.g., _"Tell me about a time you resolved a major production outage."_
  - STAR breakdown guides: Situation, Task, Action, Result input coaches.
  - Speech-to-text recording dock.

---

## 4. Cloud Infrastructure Mode (`CloudWorkspace.tsx`)

- **Objective**: Design highly available, fault-tolerant infrastructure on AWS/GCP.
- **Key Interactivity**:
  - Scenario architecture challenge (e.g. _Multi-region active-active database failover_).
  - Cloud service selection cards (ALB, Route53, RDS Aurora, SQS, ECS/EKS).
