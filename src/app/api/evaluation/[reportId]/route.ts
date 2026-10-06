import { NextRequest, NextResponse } from "next/server";
import { db, withCandidateContext } from "@/server/db/client";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ reportId: string }> }
) {
  try {
    const clerkId = req.headers.get("x-candidate-clerk-id");
    if (!clerkId) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    const { reportId } = await params;
    if (!reportId) {
      return NextResponse.json({ error: "REPORT_ID_REQUIRED" }, { status: 400 });
    }

    const context = await withCandidateContext(clerkId);
    const profile = context.profile;
    if (!profile) {
      return NextResponse.json({ error: "PROFILE_NOT_FOUND" }, { status: 404 });
    }

    const report = await db.evaluationReport.findUnique({
      where: { id: reportId },
      include: {
        rubricScores: true,
        practiceSession: true,
        mockSession: true,
      },
    });

    if (!report) {
      return NextResponse.json({ error: "REPORT_NOT_FOUND" }, { status: 404 });
    }

    // Tenant authorization check
    const isOwner =
      report.candidateId === profile.id ||
      report.practiceSession?.candidateId === profile.id ||
      report.mockSession?.candidateId === profile.id;

    if (!isOwner) {
      return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      report,
    });
  } catch (error) {
    console.error("Evaluation report retrieval failed:", error);
    return NextResponse.json(
      {
        error: "FETCH_FAILED",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
