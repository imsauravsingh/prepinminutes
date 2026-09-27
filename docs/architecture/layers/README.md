# Layer-by-Layer Architectural Specifications Index

This directory contains the in-depth architectural specifications for each of the 7 decoupled layers comprising the **PrepInMinutes** production platform.

---

## 🏛️ Architectural Map

```
┌────────────────────────────────────────────────────────────────────────┐
│ Layer 1: Client & Presentation Layer                                   │
│ Next.js 16.3 App Router • React 19 • Turbopack • HTML5 Canvas • Audio │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTPS / WSS
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ Layer 2: Edge, Security & Gateway Layer                                │
│ Cloudflare Edge • Clerk Auth • Upstash Redis Rate Limiter • Idemp-Key  │
└───────────────────┬────────────────────────────────┬───────────────────┘
                    │ WSS Streaming                  │ HTTPS API
                    ▼                                ▼
┌──────────────────────────────────────┐ ┌───────────────────────────────┐
│ Layer 3: Real-Time Voice & Media     │ │ Layer 5: Deterministic Domain │
│ WebSockets • Deepgram Nova-2 STT     │ │ Core Services                 │
│ Silero VAD • Cartesia/ElevenLabs TTS │ │ Scoring Math • Bayesian Traj  │
└───────────────────┬──────────────────┘ │ SM-2 Spaced Repetition Engine │
                    │ Context Stream     └───────────────┬───────────────┘
                    ▼                                    │
┌──────────────────────────────────────┐                 │
│ Layer 4: AI Agent Orchestration &    │                 │
│ Guardrails                           │                 │
│ LangGraph • Adaptive Interviewer     │                 │
│ Zod Output Schemas • RAG Vector      │                 │
└───────────────────┬──────────────────┘                 │
                    │ JSON Evaluations                   │
                    └─────────────────┬──────────────────┘
                                      │
                                      ▼
┌────────────────────────────────────────────────────────────────────────┐
│ Layer 6: Persistence & Storage Layer                                   │
│ PostgreSQL + pgvector • Redis Cache & Distributed Locks • S3 / R2 Blobs│
└─────────────────────────────────────┬──────────────────────────────────┘
                                      │ Event Bus
                                      ▼
┌────────────────────────────────────────────────────────────────────────┐
│ Layer 7: Event-Driven Analytics, Jobs & Telemetry                      │
│ BullMQ / Redis Workers • Daily Memory Decay Crons • OpenTelemetry OTel │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 📂 Layer Specifications Directory

| Layer       | Specification Document                                                                 | Primary Responsibilities & Technologies                                                                                                                                      |
| ----------- | -------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Layer 1** | [`01-client-presentation-layer.md`](./01-client-presentation-layer.md)                 | Next.js 16 App Router, React 19, Turbopack, Whiteboard Canvas engine, Code execution sandbox, 24-waveform audio visualizer, mobile-responsive fluid mechanics down to 320px. |
| **Layer 2** | [`02-edge-security-layer.md`](./02-edge-security-layer.md)                             | Cloudflare / Vercel Edge Runtime, Clerk Auth verification, Upstash Redis rate limiting, session idempotency token guards, zero-trust security headers.                       |
| **Layer 3** | [`03-realtime-voice-media-layer.md`](./03-realtime-voice-media-layer.md)               | WebSocket voice gateway, Deepgram Nova-2 streaming STT, Silero VAD barge-in interruption handling, Cartesia/ElevenLabs streaming TTS, $< 350\text{ms}$ latency budget.       |
| **Layer 4** | [`04-ai-orchestration-guardrails-layer.md`](./04-ai-orchestration-guardrails-layer.md) | Multi-agent state machines, Adaptive Interviewer Agent, strict Zod JSON evaluation schemas, prompt injection defenses, resume/JD RAG subsystem.                              |
| **Layer 5** | [`05-deterministic-domain-core-layer.md`](./05-deterministic-domain-core-layer.md)     | Pure business math, 6-dimension rubric weighting, candidate readiness moving average formulas ($\Delta R$), SuperMemo SM-2 memory decay calculations.                        |
| **Layer 6** | [`06-persistence-storage-layer.md`](./06-persistence-storage-layer.md)                 | PostgreSQL relational models (Prisma), `pgvector` embedding indexes, Redis keyspace and locking, S3/Cloudflare R2 private blob storage.                                      |
| **Layer 7** | [`07-event-driven-analytics-jobs-layer.md`](./07-event-driven-analytics-jobs-layer.md) | Asynchronous BullMQ background worker pools, PDF generation, nightly decay cron tasks, OpenTelemetry distributed tracing, Prometheus telemetry.                              |

---

## 🎯 Cross-Cutting Invariants

1. **The Separation of Concerns**:
   - LLMs generate language, conduct interviews, and formulate qualitative observations.
   - Deterministic domain services calculate scores, compute readiness trajectories, and manage state transitions.
2. **Mobile First**:
   - Every client capability must function smoothly on touch devices without horizontal scrolling or obscured buttons.
3. **Idempotency & Resiliency**:
   - All session finalizations require client-generated idempotency keys to ensure network retries never corrupt scores.
