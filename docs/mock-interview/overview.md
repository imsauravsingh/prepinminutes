# Mock Interview Module — Overview

The **Mock Interview Module** (`/mock-interview/*`) provides a full-length, end-to-end simulation of real software engineering interviews. It models the behavioral dynamics, technical depth, architectural trade-offs, and time pressure experienced at top-tier tech companies.

---

## 1. Core Principles

1. **Realistic Atmosphere**: Timed 45-minute sessions, structured progression stages (Requirements → Architecture → Data Modeling → Bottlenecks), and live audio recording.
2. **Dynamic Adaptation**: An AI Interviewer persona (e.g. *Sarah • Staff Infrastructure Engineer*) asking targeted follow-up questions based on candidate answers.
3. **Rigorous Rubric Evaluation**: Comprehensive scoring across 6 key dimensions (Technical Depth, Reasoning, Data Modeling, Communication, Problem Solving, Follow-up Handling) with a definitive hiring verdict (*Strong Hire*, *Hire*, *Lean Hire*, *No Hire*).
4. **Complete Flow**:
   $$\text{Hub} \longrightarrow \text{Configure} \longrightarrow \text{Briefing} \longrightarrow \text{Live Session} \longrightarrow \text{Evaluation Report}$$

---

## 2. Route Structure

- `/mock-interview`: Main hub with recommended mock and historical attempts.
- `/mock-interview/configure`: Step 1 of interview setup.
- `/mock-interview/briefing`: Step 2 pre-interview orientation.
- `/mock-interview/interview-session`: Step 3 live interview workspace (aliased at `/mock-interview/session`).
- `/mock-interview/system-design/evaluation`: Comprehensive evaluation report (aliased at `/mock-interview/interview-session/evaluation` and `/mock-interview/session/evaluation`).
