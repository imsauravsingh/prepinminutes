import { NextRequest, NextResponse } from "next/server";
import { db, withCandidateContext } from "@/server/db/client";
import { ai } from "@/server/ai/gemini";
import { computeRubricScore } from "@/server/domain/scoring";
import { calculateReadinessUpdate } from "@/server/domain/readiness";
import { checkRateLimit } from "@/server/edge/rate-limiter";

export async function POST(req: NextRequest) {
  try {
    const clerkId = req.headers.get("x-candidate-clerk-id");
    if (!clerkId) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    const rl = await checkRateLimit(clerkId, "ai_eval");
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "RATE_LIMIT_EXCEEDED", retryAfter: rl.resetSeconds },
        { status: 429 }
      );
    }

    const context = await withCandidateContext(clerkId);
    const profile = context.profile;
    if (!profile) {
      return NextResponse.json(
        { error: "PROFILE_REQUIRED", message: "Candidate profile required." },
        { status: 400 }
      );
    }

    const { sessionId, transcript, durationMinutes = 30 } = await req.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: "SESSION_ID_REQUIRED", message: "sessionId is required." },
        { status: 400 }
      );
    }

    // Verify session exists and belongs to candidate
    const session = await db.mockInterviewSession.findUnique({
      where: { id: sessionId },
    });

    if (!session || session.candidateId !== profile.id) {
      return NextResponse.json(
        { error: "NOT_FOUND", message: "Mock interview session not found or unauthorized." },
        { status: 404 }
      );
    }

    // Evaluate full mock transcript via Gemini
    const transcriptText = Array.isArray(transcript)
      ? transcript
          .map((t: { speaker?: string; text?: string }) => `${t.speaker?.toUpperCase() || "CANDIDATE"}: ${t.text}`)
          .join("\n")
      : typeof transcript === "string"
      ? transcript
      : "Multi-turn technical interview session concluded.";

    const prompt = `
You are the PrepInMinutes Senior Bar Raiser conducting post-interview debrief for:
- Role: ${session.targetRole} (${session.difficulty} difficulty)
- Type: ${session.interviewType}

Transcript:
${transcriptText}

Evaluate strictly across 5 dimensions (1.0 to 10.0 scale):
- technical_depth
- tradeoffs_reasoning
- communication_structure
- scalability_failure_modes
- code_diagram_quality

Return ONLY a valid JSON object matching this schema:
{
  "technical_depth": 8.0,
  "tradeoffs_reasoning": 7.5,
  "communication_structure": 8.5,
  "scalability_failure_modes": 7.0,
  "code_diagram_quality": 6.5,
  "evaluatorNotes": "Comprehensive architectural mastery exhibited.",
  "strengths": ["Clear communication", "Structured breakdown"],
  "improvements": ["Deepen failure mode analysis"]
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: prompt,
      config: { responseMimeType: "application/json" },
    });

    const llmFeedback = JSON.parse(response.text || "{}");

    // Deterministic rubric evaluation
    const evaluation = computeRubricScore({
      technical_depth: Number(llmFeedback.technical_depth) || 5.0,
      tradeoffs_reasoning: Number(llmFeedback.tradeoffs_reasoning) || 5.0,
      communication_structure: Number(llmFeedback.communication_structure) || 5.0,
      scalability_failure_modes: Number(llmFeedback.scalability_failure_modes) || 5.0,
      code_diagram_quality: Number(llmFeedback.code_diagram_quality) || 5.0,
    });

    // Bayesian readiness trajectory update
    const totalSessions = await db.mockInterviewSession.count({
      where: { candidateId: profile.id, status: "COMPLETED" },
    });

    const { newReadiness, readinessDelta } = calculateReadinessUpdate(
      profile.readinessScore,
      evaluation.overallScore,
      totalSessions
    );

    // Update candidate readiness
    await db.candidateProfile.update({
      where: { id: profile.id },
      data: { readinessScore: newReadiness },
    });

    // Mark mock session as completed
    await db.mockInterviewSession.update({
      where: { id: sessionId },
      data: {
        status: "COMPLETED",
        durationMinutes: Number(durationMinutes) || session.durationMinutes,
        transcript: transcript || session.transcript,
      },
    });

    // Persist EvaluationReport
    const evaluationReport = await db.evaluationReport.create({
      data: {
        candidateId: profile.id,
        mockId: sessionId,
        overallScore: evaluation.overallScore,
        verdict: evaluation.verdict,
        readinessDelta: Math.round(readinessDelta),
        evaluatorNotes:
          llmFeedback.evaluatorNotes || "Comprehensive mock interview debrief completed.",
        strengths: Array.isArray(llmFeedback.strengths) ? llmFeedback.strengths : [],
        improvements: Array.isArray(llmFeedback.improvements)
          ? llmFeedback.improvements
          : [],
        rubricScores: {
          create: Object.entries(evaluation.normalizedDimensions).map(
            ([dimension, score]) => ({
              dimension,
              score,
              assessment: `${dimension} evaluated at score ${score}/10`,
              missingAtoms: [],
            })
          ),
        },
      },
      include: {
        rubricScores: true,
      },
    });

    return NextResponse.json({
      success: true,
      sessionId,
      reportId: evaluationReport.id,
      overallScore: evaluationReport.overallScore,
      verdict: evaluationReport.verdict,
      readinessDelta: evaluationReport.readinessDelta,
      newReadiness,
      report: evaluationReport,
    });
  } catch (error) {
    console.error("Mock interview conclusion failed:", error);
    return NextResponse.json(
      {
        error: "MOCK_EVALUATION_FAILED",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
