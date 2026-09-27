# <prepinminutes>

# PrepInMinutes — Application Features & Change Registry

> **Platform Tag**: `prepinminutes`  
> **Last Updated**: September 27, 2026  
> **Repository**: `imsauravsingh/prepinminutes`  
> **Status**: Production Ready • Zero Build Errors • Fully Responsive

---

## 📌 Executive Summary

PrepInMinutes is an AI-powered interview preparation platform for software engineers. It unifies resume intelligence, job description parsing, custom learning roadmaps, interactive practice sessions with whiteboard canvases, full-length live mock interviews, and evaluation reports into a cohesive workflow:

$$\text{Understand} \longrightarrow \text{Plan} \longrightarrow \text{Practice} \longrightarrow \text{Mock Interview} \longrightarrow \text{Evaluate} \longrightarrow \text{Revise}$$

---

## 🚀 Complete Feature Inventory

### 1. Application Shell & Navigation
- **Persistent Sidebar Navigation**:
  - Direct routes: Dashboard (`/dashboard`), Preparation Plan (`/preparation-plan`), Practice (`/practice`), Mock Interview (`/mock-interview`), Evaluation (`/evaluation`), and Revision (`/revision`).
  - Active route highlighting logic with strict isolation so sub-pages (e.g. mock interview evaluations) only highlight their respective parent module.
  - Contextual widget management: "Your Prep Plan" on dashboard, "Track your progress" on evaluation, and clean suppression of promotional widgets on mock interview and revision pages.
  - Clerk User Avatar integration with account management dropdown and sign-out.
  - Mobile off-canvas drawer with touch-friendly backdrop dismissal.
- **Authentication & Security (`<AuthGate>`)**:
  - Full Clerk authentication flow protecting all candidate sessions and preparation plans.
  - Clean public landing page and sign-up/login redirection.

---

### 2. Candidate Dashboard (`/dashboard`)
- **Readiness Meter**: Real-time circular percentage ring displaying overall interview readiness.
- **Role & Company Alignment**: Displays candidate's target role (e.g., Senior Software Engineer), target companies (FAANG/Tier-1), and countdown timeline.
- **Three-Step Onboarding Flow**:
  - Step 1: Set Up Profile & Resume.
  - Step 2: Review Personalized Preparation Plan.
  - Step 3: Start Preparing & Topic Drills.
- **Quick Practice & Recent Activity Cards**: Instant access to resume-based questions, coding drills, and system design topics.

---

### 3. Preparation Plan (`/preparation-plan`)
- **Personalized Learning Roadmaps**: Structured curriculum tailored to candidate's target seniority (Senior, Staff, Principal).
- **Domain Weighting**: Prioritized breakdown across System Design, Algorithms & Data Structures, Behavioral/Leadership (STAR), and Cloud Architecture.
- **Progress Tracking**: Completed vs remaining milestones with estimated study hours.

---

### 4. Practice Hub & Interactive Workspaces (`/practice`)
- **Topic Selection (`/practice/choose-topic`)**: Interactive cards across System Design, Coding, Behavioral, and Cloud.
- **Interactive Practice Sessions**:
  - **System Design (`/practice/session/system-design`)**:
    - Live conversational workspace with AI interviewer prompts.
    - Full-screen interactive **Whiteboard Modal** with drawing tools (pen, highlighter, eraser), architecture shapes (load balancers, CDNs, DBs, caches), sticky notes, and PNG export.
    - Audio waveform dock and dual-mode voice/text input.
    - Architecture diagram launcher, code snippet scratchpad, and session notes drawer.
  - **Coding Drills (`/practice/session/coding`)**: Algorithmic problem solving (e.g. Sliding Window) with immediate solution evaluation.
  - **Behavioral Practice (`/practice/session/behavioral`)**: STAR methodology coaching with structure scoring.
  - **Cloud Architecture (`/practice/session/cloud`)**: High-availability infrastructure scenarios.
- **Practice Evaluation Reports (`/practice/session/*/evaluation`)**: Instant feedback on strengths, improvement areas, and readiness score updates.

---

### 5. Mock Interview Module (`/mock-interview/*`)
A dedicated full-length interview simulation ecosystem designed for desktop and mobile devices:

#### A. Main Mock Interview Page (`/mock-interview`)
- **Hero Recommendation Card**: Dynamic banner featuring recommended mock interview based on preparation weak spots (e.g., Senior SWE System Design - URL Shortener).
- **Interview Type Grid**: 5 specialized categories:
  - Technical (30–45 min)
  - System Design (45–60 min)
  - Behavioral (20–40 min)
  - Resume-Based (30–45 min)
  - Mixed (45–60 min)
- **Recent Mock Interviews**:
  - Desktop table view with date, role, focus area, duration, circular score ring, and report links.
  - Responsive mobile card view for `< md` screens.

#### B. Mock Configuration Page (`/mock-interview/configure`)
- 3-step progress stepper: *1. Configure* → *2. Briefing* → *3. Interview*.
- Configurable parameters:
  - Interview Type (Technical, System Design, Behavioral, Resume, Mixed).
  - Target Role selector (Senior SWE, Staff SWE, Backend, Full Stack, Frontend, EM).
  - Difficulty Level (Junior, Mid-Level, Senior, Staff, Principal).
  - Duration selector (15, 30, 45, 60 minutes).
  - Multi-select Focus Areas (Scalability, Trade-offs, Failure Handling, Caching, Concurrency, etc.).
- Live preview summary card (stacked naturally on mobile, sticky on desktop).

#### C. Pre-Interview Briefing Page (`/mock-interview/briefing`)
- Interactive 5-stage interview flow diagram (vertical with down connectors on mobile, horizontal with right connectors on desktop).
- 6 AI evaluation criteria badges (Technical Depth, Reasoning, Trade-offs, Communication, Problem Solving, Follow-up Handling).
- Advice card with 3 essential tips before starting.
- Bottom action bar with full-width mobile CTAs navigating to the live session.

#### D. Live Mock Interview Workspace (`/mock-interview/interview-session`)
- Breadcrumb header with 4-stage progression track (`1: Requirements`, `2: High-Level Architecture`, `3: Deep Dive`, `4: Bottlenecks & Scale`).
- AI Interviewer profile badge (`Sarah • Staff Infrastructure Engineer`) and pulsing timer pill (`formatTimer / 45:00`).
- Realistic conversational stream with AI prompts, candidate responses, and clarifying questions.
- Audio dock with 24 animated frequency waveform bars, pause/resume, mic toggle, stop button, and inline text typing mode.
- Embedded Whiteboard integration (`@/components/practice/WhiteboardModal`).
- Interview tools drawer (Architecture Diagram, Code Block, Scratchpad Notes).
- Real-time tips and circular completion ring.
- Graceful end-of-interview confirmation modal.

#### E. Mock System Design Evaluation (`/mock-interview/system-design/evaluation`)
- **Executive Summary**: 84/100 score ring with **Strong Hire** badge (Top 12% percentile).
- **Readiness Impact Tracker**: +6% growth (68% → 74%).
- **AI Evaluator Assessment**: Personalized written breakdown from Staff Infrastructure Engineer evaluator.
- **6-Dimension Rubric**: Technical Depth (8.5/10), Reasoning & Trade-offs (8.5/10), Data Modeling & Architecture (9.0/10), Communication (9.0/10), Problem Solving (8.5/10), Follow-up & Scalability (8.0/10).
- **Detailed Strengths & Improvement Areas**: Concrete architectural insights (Base62 calculations, Redis 80/20 caching, Snowflake distributed IDs, cache stampede mitigation, Kafka click tracking).
- **Stage Progression Timeline**: Score mapping across 4 interview stages.
- **Targeted Practice Recommendations & Export Actions**: Share link, export PDF, retake mock, and explore practice drills.
- Route aliases: `/mock-interview/interview-session/evaluation` and `/mock-interview/session/evaluation`.

---

### 6. Evaluation Hub (`/evaluation`)
- Overall readiness progress chart over time.
- Breakdown by performance area (Algorithms, System Design, Behavioral, Code Quality).
- Activity logs and weekly score improvements.

---

### 7. Revision Module (`/revision`)
- Weakness detection engine identifying recurring candidate gaps from past practice sessions.
- Spaced repetition revision queues for reinforced retention.

---

## 📱 Mobile & Responsive Architecture

Every page and component has been audited and built to adhere to responsive design principles:
1. **Narrow Viewports (320px – 375px)**:
   - Header breadcrumbs wrap gracefully without horizontal scrollbars.
   - Conversation header keeps avatar on the left and timer pill on the right without overlapping.
   - Text inputs and waveform bars have `min-w-0` and `shrink-0` bounds to prevent blowout.
   - Modals utilize `max-h-[90vh]` with scrollable interiors.
   - Confirmation modal CTA buttons stack vertically as `flex-col-reverse` for thumb-friendly reach.
2. **Tablets & Laptops (640px – 1024px)**:
   - Grid layouts smoothly transition from 1-column to 2-column or 3-column.
   - Whiteboard canvas and tools adapt cleanly.
3. **Desktop (1024px+)**:
   - Multi-column layouts (8/4 grid splits, sticky preview panels, wide whiteboard canvases).

---

## 🛠️ Tech Stack & Key Libraries

- **Framework**: Next.js 16.3.2 (App Router with Turbopack)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS with custom font tokens (`Geist`, `Geist_Mono`)
- **Authentication**: `@clerk/nextjs`
- **Icons**: `lucide-react`
- **Build Status**: 43/43 static routes passing with zero warnings or errors.

---

## 🏷️ Change Log Summary (Tag: `prepinminutes`)

| Date | Scope | Description |
|------|-------|-------------|
| 2026-09-27 | Mock Interview Evaluation | Created `/mock-interview/system-design/evaluation` with complete rubric scoring, readiness impact, and strengths/weaknesses. |
| 2026-09-27 | Sidebar Navigation | Fixed `isEvaluationRoute` to exclude mock interview routes so only "Mock Interview" stays highlighted. |
| 2026-09-27 | Sidebar Cleanup | Removed "Stay consistent!" widget from mock interview routes for an uncluttered layout. |
| 2026-09-27 | Live Mock Session | Cloned and tailored `/mock-interview/interview-session` with full audio dock, whiteboard, and tools. |
| 2026-09-27 | Mobile Responsiveness | Upgraded all mock interview pages with mobile touch padding, fluid headers, and responsive modals. |
| 2026-09-27 | Mock Briefing & Config | Built `/mock-interview/configure` and `/mock-interview/briefing` multi-step interview launcher. |
| 2026-09-27 | Mock Interview Main | Built desktop and mobile `/mock-interview` hub with recommendations and past history table/cards. |

</prepinminutes>
