import { NextRequest, NextResponse } from "next/server";
import { db, withCandidateContext } from "@/server/db/client";
import { computeSM2 } from "@/server/domain/spaced-repetition";

export async function GET(req: NextRequest) {
  try {
    const clerkId = req.headers.get("x-candidate-clerk-id");
    if (!clerkId) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    const context = await withCandidateContext(clerkId);
    const profile = context.profile;
    if (!profile) {
      return NextResponse.json({ error: "PROFILE_NOT_FOUND" }, { status: 404 });
    }

    const searchParams = req.nextUrl.searchParams;
    const dueOnly = searchParams.get("dueOnly") !== "false";

    const whereClause: { candidateId: string; nextReviewDate?: { lte: Date } } = {
      candidateId: profile.id,
    };

    if (dueOnly) {
      whereClause.nextReviewDate = { lte: new Date() };
    }

    const items = await db.revisionItem.findMany({
      where: whereClause,
      include: {
        topic: {
          select: {
            id: true,
            title: true,
            slug: true,
            difficulty: true,
            practiceHref: true,
          },
        },
      },
      orderBy: { nextReviewDate: "asc" },
    });

    return NextResponse.json({
      success: true,
      totalDue: items.length,
      items,
    });
  } catch (error) {
    console.error("Revision items fetch error:", error);
    return NextResponse.json(
      {
        error: "FETCH_FAILED",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const clerkId = req.headers.get("x-candidate-clerk-id");
    if (!clerkId) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    const context = await withCandidateContext(clerkId);
    const profile = context.profile;
    if (!profile) {
      return NextResponse.json({ error: "PROFILE_NOT_FOUND" }, { status: 404 });
    }

    const { revisionItemId, sessionScore } = await req.json();

    if (!revisionItemId || sessionScore === undefined) {
      return NextResponse.json(
        { error: "INVALID_BODY", message: "revisionItemId and sessionScore are required." },
        { status: 400 }
      );
    }

    const item = await db.revisionItem.findUnique({
      where: { id: revisionItemId },
    });

    if (!item || item.candidateId !== profile.id) {
      return NextResponse.json(
        { error: "NOT_FOUND", message: "Revision item not found or unauthorized." },
        { status: 404 }
      );
    }

    // Compute updated interval and ease factor via deterministic SM-2
    const sm2Output = computeSM2({
      repetitions: item.repetitions,
      intervalDays: item.intervalDays,
      easeFactor: item.easeFactor,
      sessionScore: Number(sessionScore),
    });

    const updatedItem = await db.revisionItem.update({
      where: { id: revisionItemId },
      data: {
        repetitions: sm2Output.repetitions,
        intervalDays: sm2Output.intervalDays,
        easeFactor: sm2Output.easeFactor,
        nextReviewDate: sm2Output.nextReviewDate,
        lastReviewedAt: new Date(),
      },
    });

    // Update topic mastery
    await db.candidateTopicMastery.updateMany({
      where: {
        candidateId: profile.id,
        topicId: item.topicId,
      },
      data: {
        lastPracticedAt: new Date(),
        intervalDays: sm2Output.intervalDays,
        easeFactor: sm2Output.easeFactor,
        nextReviewDate: sm2Output.nextReviewDate,
        status: Number(sessionScore) >= 70 ? "PRACTICED" : "NEEDS_PRACTICE",
      },
    });

    return NextResponse.json({
      success: true,
      updatedItem,
      sm2Output,
    });
  } catch (error) {
    console.error("Revision item update error:", error);
    return NextResponse.json(
      {
        error: "UPDATE_FAILED",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
