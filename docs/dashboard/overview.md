# Dashboard Module — Overview

The **Dashboard** (`/dashboard`) is the central mission control and entry point for candidates on the PrepInMinutes platform. It orchestrates onboarding, presents personalized preparation plans, and acts as the daily launchpad for practice sessions.

---

## 1. Core Purpose & User Journey

1. **Orientation**: Greet the candidate with their target role (e.g., *Senior Software Engineer*) and target companies (e.g., *Google, Meta, Tier-1 Tech*).
2. **Three-Stage Progression Flow**:
   - **Step 1: Set Up (`/dashboard?step=1` or default)**: Collect target role, experience level, preparation timeline, target companies, resume, and job description.
   - **Step 2: Next Step / Plan Ready (`/dashboard/plan-ready` or `/dashboard?step=2`)**: Present the synthesized AI preparation plan with domain focus areas and time commitments.
   - **Step 3: Start Preparing (`/dashboard/start-preparing` or `/dashboard?step=3`)**: The daily preparation cockpit with readiness percentage gauges, next actions, resume-tailored questions, and practice launchers.
3. **Readiness Anchor**: Display the candidate's real-time overall interview readiness gauge, calculated deterministically from recent practice and mock interview performance.

---

## 2. Key Personas & Role Profiles

- **Senior / Staff Software Engineers**: Focus on distributed system design, architecture trade-offs, and behavioral leadership.
- **Backend / Full Stack Engineers**: Focus on database modeling, API architecture, concurrency, and algorithms.
- **Career Changers / Interviewees on Deadlines**: Need condensed 2–4 week intensive preparation tracks.

---

## 3. High-Level Architecture Interaction

```
[Candidate Submits Form]
         │
         ▼
[Deterministic Validation Service] ──(Validates Role, Experience, Timeline)
         │
         ▼
[Async Worker Queue] ───► [LLM Plan Synthesis] (Suggests curriculum focus)
         │                         │
         ▼                         ▼
[Plan Generation Service] ◄────────┘ (Computes domain weighting & hours)
         │
         ▼
[Dashboard Switches to Step 2 / Step 3]
```
