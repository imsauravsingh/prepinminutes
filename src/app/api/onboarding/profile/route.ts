import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db/client";
import { checkRateLimit } from "@/server/edge/rate-limiter";
import { z } from "zod";

const ProfileSchema = z.object({
  targetRole: z.string().min(2, "Target role must be at least 2 characters"),
  experienceLevel: z.enum(["0-2", "3-5", "6-9", "10+"]).default("3-5"),
  targetCompanies: z.array(z.string()).default([]),
  timelineWeeks: z.number().int().min(1).max(52).default(8),
  weeklyGoalHours: z.number().min(1).max(60).default(6),
});

export async function POST(req: NextRequest) {
  try {
    const clerkId = req.headers.get("x-candidate-clerk-id");
    if (!clerkId) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    // Rate limit check: general API tier
    const rl = await checkRateLimit(clerkId, "general");
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "RATE_LIMIT_EXCEEDED", retryAfter: rl.resetSeconds },
        { status: 429 }
      );
    }

    const body = await req.json();
    const validated = ProfileSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { error: "VALIDATION_FAILED", details: validated.error.issues },
        { status: 400 }
      );
    }

    const data = validated.data;

    // Upsert User record
    const user = await db.user.upsert({
      where: { clerkId },
      update: {},
      create: {
        clerkId,
        email: `${clerkId}@placeholder.local`,
      },
    });

    // Upsert CandidateProfile record
    const profile = await db.candidateProfile.upsert({
      where: { userId: user.id },
      update: {
        targetRole: data.targetRole,
        experienceLevel: data.experienceLevel,
        targetCompanies: data.targetCompanies,
        timelineWeeks: data.timelineWeeks,
        weeklyGoalHours: data.weeklyGoalHours,
      },
      create: {
        userId: user.id,
        targetRole: data.targetRole,
        experienceLevel: data.experienceLevel,
        targetCompanies: data.targetCompanies,
        timelineWeeks: data.timelineWeeks,
        weeklyGoalHours: data.weeklyGoalHours,
        readinessScore: 45,
      },
    });

    return NextResponse.json({ success: true, profile });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "INTERNAL_ERROR", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const clerkId = req.headers.get("x-candidate-clerk-id");
    if (!clerkId) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { clerkId },
      include: {
        profile: {
          include: {
            plan: true,
          },
        },
      },
    });

    if (!user || !user.profile) {
      return NextResponse.json(
        { error: "PROFILE_NOT_FOUND" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      profile: user.profile,
      plan: user.profile.plan,
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json(
      { error: "INTERNAL_ERROR", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
