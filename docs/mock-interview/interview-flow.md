# Mock Interview — 4-Stage End-to-End Interview Flow

This document details the progressive user journey through the Mock Interview ecosystem.

---

## 1. Step 1: Configuration (`/mock-interview/configure`)

Candidates specify interview parameters via `InterviewConfigurationForm.tsx`:

- **Interview Type**: System Design, Technical Coding, Behavioral, Resume-Based, Mixed.
- **Target Role**: Senior Software Engineer, Staff Software Engineer, Backend Engineer, Full Stack, Frontend, EM.
- **Difficulty Level**: Junior, Mid-Level, Senior, Staff, Principal.
- **Duration**: 15 min (Express), 30 min (Standard), 45 min (Comprehensive), 60 min (Extended).
- **Focus Areas**: Multi-select pills (e.g. _Scalability_, _Trade-offs_, _Failure Handling_, _Database Modeling_).
- **Live Preview Card**: Updates reactively to show the interview configuration summary.
- **Next CTA**: "Continue to Briefing →" (`/mock-interview/briefing`).

---

## 2. Step 2: Briefing (`/mock-interview/briefing`)

Prepares candidates mentally and technically before the timer begins:

- **Interactive 5-Stage Diagram (`HowTheInterviewWorksSection.tsx`)**:
  1. _Problem Statement & Scoping_ (5m)
  2. _Clarifications & Requirements_ (5m)
  3. _High-Level Architecture_ (15m)
  4. _Deep Dive & Component Modeling_ (10m)
  5. _Bottlenecks, Scaling & Q&A_ (10m)
- **Evaluation Criteria Badges (`WhatAiWillEvaluateSection.tsx`)**:
  - Highlights the 6 dimensions evaluated by the AI.
- **Guidance Banner (`BeforeYouStartCard.tsx`)**:
  - Practical reminders: speak clearly, ask clarifying questions, state trade-offs explicitly.
- **Action Bar**: "Back to Configuration" and primary "Start Interview →".

---

## 3. Step 3: Live Interview Session (`/mock-interview/interview-session`)

Simulates the real interview room via `MockInterviewSessionWorkspace.tsx`:

- 45-minute countdown progress track at the top.
- Left Column: AI conversational thread and audio frequency waveform recording dock with pause/stop controls and text typing fallback.
- Right Column: Whiteboard launcher, architecture diagram canvas, code block scratchpad, session notes drawer, live tips, and circular session progress gauge.
- End Interview confirmation modal.

---

## 4. Step 4: Evaluation Report (`/mock-interview/system-design/evaluation`)

Delivers actionable, rubric-grounded assessment via `MockSystemDesignEvaluationWorkspace.tsx`:

- Overall Mock Score ring (`84 / 100`) and verdict badge (`Strong Hire`).
- Readiness impact calculation: e.g. System Design readiness grows `+6%` (68% → 74%).
- 6-dimension scoring breakdown with progress bars and qualitative observations.
- Key Strengths vs Staff-Level Growth Areas.
- Interview milestone timeline.
- Recommended practice drills with direct links to `/practice`.
