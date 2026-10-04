# Phase 6: Session Execution & Evaluation APIs

## 📌 Executive Summary

Phase 6 connects interactive candidate sessions (coding challenges, system design whiteboards, behavioral answers, and mock interviews) to the evaluation pipeline. It combines **Google Gemini 3.1 Flash-Lite** structured JSON analysis with our **Phase 3 deterministic scoring and SM-2 spaced repetition engines**, persisting complete evaluation reports and updating candidate readiness in real-time.

---

## 🎯 Phase Goals & Deliverables

1. **Practice Submission & Evaluation API (`src/app/api/practice/session/submit/route.ts`)**:
   - Evaluates solution drafts $\rightarrow$ computes 5-dimension rubric $\rightarrow$ calculates readiness delta ($\Delta$) $\rightarrow$ schedules next SM-2 review date $\rightarrow$ writes `EvaluationReport`.
2. **Mock Interview End Session API (`src/app/api/mock-interview/session/end/route.ts`)**:
   - Concludes full mock interviews and analyzes multi-turn conversational transcripts against target seniority standards.
3. **Evaluation Report Retrieval API (`src/app/api/evaluation/[reportId]/route.ts`)**:
   - Provides comprehensive breakdown for the `/evaluation` UI (radar dimensions, strengths, improvements).
4. **Revision Queue Sync API (`src/app/api/revision/items/route.ts`)**:
   - Queries overdue topics (`nextReviewDate <= NOW()`) to drive the candidate's daily spaced repetition drills on `/revision`.

---

## 📝 1. Practice Submission & Evaluation API (`src/app/api/practice/session/submit/route.ts`)

```typescript
import { NextRequest, NextResponse } from "next/server";
import { db, withCandidateContext } from "@/server/db/client";
import { ai } from "@/server/ai/gemini";
import { computeRubricScore } from "@/server/domain/scoring";
import { calculateReadinessUpdate } from "@/server/domain/readiness";
import { computeSM2 } from "@/server/domain/spaced-repetition";
import { checkRateLimit } from "@/server/edge/rate-limiter";
import { checkIdempotency, saveIdempotency } from "@/server/edge/idempotency";

export async function POST(req: NextRequest) {
  try {
    const clerkId = req.headers.get("x-candidate-clerk-id");
    if (!clerkId)
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

    const context = await withCandidateContext(clerkId);

    // Idempotency check
    const idempotencyKey = req.headers.get("idempotency-key");
    if (idempotencyKey) {
      const cached = await checkIdempotency(idempotencyKey);
      if (cached) return NextResponse.json(JSON.parse(cached));
    }

    // Rate limit check (10 evaluations / min)
    const rateCheck = await checkRateLimit(context.userId, "ai_eval", 10, 60);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: "RATE_LIMIT_EXCEEDED" },
        { status: 429 },
      );
    }

    const { domain, topicSlug, solutionDraft, whiteboardUrl, durationSeconds } =
      await req.json();

    // 1. Evaluate via Gemini Flash-Lite with Structured JSON Output
    const prompt = `
      You are an expert technical interviewer evaluating a ${domain} solution for topic "${topicSlug}".
      Candidate Submission:
      ${solutionDraft || "(Candidate provided diagram at " + whiteboardUrl + ")"}

      Provide score ratings (1.0 to 10.0) across 5 dimensions, plus qualitative feedback:
      - technical_depth
      - tradeoffs_reasoning
      - communication_structure
      - scalability_failure_modes
      - code_diagram_quality
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const llmFeedback = JSON.parse(response.text || "{}");

    // 2. Deterministic Rubric Computation
    const evaluation = computeRubricScore({
      technical_depth: llmFeedback.technical_depth || 5.0,
      tradeoffs_reasoning: llmFeedback.tradeoffs_reasoning || 5.0,
      communication_structure: llmFeedback.communication_structure || 5.0,
      scalability_failure_modes: llmFeedback.scalability_failure_modes || 5.0,
      code_diagram_quality: llmFeedback.code_diagram_quality || 5.0,
    });

    // 3. Deterministic Bayesian Readiness Update
    const currentReadiness = context.profile?.readinessScore || 0;
    const completedCount = await db.practiceSession.count({
      where: { userId: context.userId },
    });
    const { newReadiness, readinessDelta } = calculateReadinessUpdate(
      currentReadiness,
      evaluation.overallScore,
      completedCount,
    );

    // 4. Update Profile Readiness in DB
    await db.candidateProfile.update({
      where: { userId: context.userId },
      data: { readinessScore: newReadiness },
    });

    // 5. Persist Session & Evaluation Report
    const session = await db.practiceSession.create({
      data: {
        userId: context.userId,
        domain,
        topicSlug,
        solutionDraft,
        whiteboardUrl,
        durationSeconds: durationSeconds || 0,
        status: "evaluated",
      },
    });

    const report = await db.evaluationReport.create({
      data: {
        practiceSessionId: session.id,
        overallScore: evaluation.overallScore,
        verdict: evaluation.verdict,
        readinessDelta,
        evaluatorNotes:
          llmFeedback.evaluatorNotes || "Detailed evaluation logged.",
        strengths: llmFeedback.strengths || [],
        improvements: llmFeedback.improvements || [],
        rubricScores: {
          create: Object.entries(evaluation.normalizedDimensions).map(
            ([dim, score]) => ({
              dimension: dim,
              score,
              assessment:
                llmFeedback[`${dim}_notes`] ||
                "Evaluated against standard rubrics.",
            }),
          ),
        },
      },
      include: { rubricScores: true },
    });

    // 6. SuperMemo-2 Spaced Repetition Scheduling
    const topic = await db.topic.findUnique({ where: { slug: topicSlug } });
    if (topic) {
      const existingRevision = await db.revisionItem.findFirst({
        where: { userId: context.userId, topicId: topic.id },
      });

      const sm2Result = computeSM2({
        repetitions: existingRevision?.repetitions || 0,
        intervalDays: existingRevision?.intervalDays || 1,
        easeFactor: existingRevision?.easeFactor || 2.5,
        sessionScore: evaluation.overallScore,
      });

      await db.revisionItem.upsert({
        where: { id: existingRevision?.id || "new_cuid" },
        update: {
          repetitions: sm2Result.repetitions,
          intervalDays: sm2Result.intervalDays,
          easeFactor: sm2Result.easeFactor,
          lastReviewedDate: new Date(),
          nextReviewDate: sm2Result.nextReviewDate,
        },
        create: {
          userId: context.userId,
          topicId: topic.id,
          repetitions: sm2Result.repetitions,
          intervalDays: sm2Result.intervalDays,
          easeFactor: sm2Result.easeFactor,
          lastReviewedDate: new Date(),
          nextReviewDate: sm2Result.nextReviewDate,
        },
      });
    }

    const responsePayload = {
      success: true,
      sessionId: session.id,
      reportId: report.id,
      overallScore: report.overallScore,
      verdict: report.verdict,
      readinessDelta: report.readinessDelta,
      newReadiness,
      report,
    };

    if (idempotencyKey) {
      await saveIdempotency(idempotencyKey, responsePayload);
    }

    return NextResponse.json(responsePayload);
  } catch (error) {
    console.error("Session evaluation error:", error);
    return NextResponse.json({ error: "EVALUATION_FAILED" }, { status: 500 });
  }
}
```

---

## 📊 2. Evaluation Report Fetch API (`src/app/api/evaluation/[reportId]/route.ts`)

```typescript
import { NextRequest, NextResponse } from "next/server";
import { db, withCandidateContext } from "@/server/db/client";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ reportId: string }> },
) {
  try {
    const { reportId } = await params;
    const clerkId = req.headers.get("x-candidate-clerk-id");
    if (!clerkId)
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

    const context = await withCandidateContext(clerkId);

    const report = await db.evaluationReport.findUnique({
      where: { id: reportId },
      include: {
        rubricScores: true,
        practiceSession: true,
        mockInterviewSession: true,
      },
    });

    if (!report) {
      return NextResponse.json({ error: "REPORT_NOT_FOUND" }, { status: 404 });
    }

    // Verify ownership
    const ownerId =
      report.practiceSession?.userId || report.mockInterviewSession?.userId;
    if (ownerId !== context.userId) {
      return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
    }

    return NextResponse.json({ success: true, report });
  } catch (error) {
    console.error("Error fetching report:", error);
    return NextResponse.json({ error: "FETCH_REPORT_FAILED" }, { status: 500 });
  }
}
```

---

## 🔄 3. Revision Queue Sync API (`src/app/api/revision/items/route.ts`)

Returns due items for the candidate's active daily recall practice:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { db, withCandidateContext } from "@/server/db/client";

export async function GET(req: NextRequest) {
  try {
    const clerkId = req.headers.get("x-candidate-clerk-id");
    if (!clerkId)
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

    const context = await withCandidateContext(clerkId);

    const dueItems = await db.revisionItem.findMany({
      where: {
        userId: context.userId,
        nextReviewDate: { lte: new Date() },
      },
      include: {
        topic: true,
      },
      orderBy: { nextReviewDate: "asc" },
    });

    return NextResponse.json({
      success: true,
      totalDue: dueItems.length,
      items: dueItems,
    });
  } catch (error) {
    console.error("Error fetching revision items:", error);
    return NextResponse.json(
      { error: "REVISION_QUEUE_FAILED" },
      { status: 500 },
    );
  }
}
```

---

## ✅ Phase 6 Verification Checklist

- [ ] Submitting code to `/api/practice/session/submit` stores session and evaluation in Neon.
- [ ] Rubric scores adhere strictly to the 5-dimension weights and formula.
- [ ] Candidate profile readiness updates by exact $\Delta\text{Readiness}$.
- [ ] SM-2 `RevisionItem` is created/updated with accurate `nextReviewDate`.
- [ ] Tenant access controls prevent Candidate A from accessing Candidate B's report (`403 Forbidden`).
