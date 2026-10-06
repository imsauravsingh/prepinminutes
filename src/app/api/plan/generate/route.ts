import { NextRequest, NextResponse } from "next/server";
import { db, withCandidateContext } from "@/server/db/client";
import { ai } from "@/server/ai/gemini";
import { checkRateLimit } from "@/server/edge/rate-limiter";

export async function POST(req: NextRequest) {
  try {
    const clerkId = req.headers.get("x-candidate-clerk-id");
    if (!clerkId) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    // Rate limit check: expensive AI generation tier
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
        {
          error: "PROFILE_NOT_CONFIGURED",
          message: "Please complete your candidate profile before generating a plan.",
        },
        { status: 400 }
      );
    }

    // Fetch existing curriculum domains and sample topics to ground the plan
    const domains = await db.curriculumDomain.findMany({
      include: {
        categories: {
          take: 3,
          include: {
            topics: {
              take: 5,
              select: { id: true, title: true, slug: true, difficulty: true },
            },
          },
        },
      },
    });

    const topicCatalog = domains.map((d) => ({
      domain: d.name,
      sampleTopics: d.categories.flatMap((c) => c.topics.map((t) => t.title)),
    }));

    const prompt = `
You are the PrepInMinutes Principal Interview Architect. Generate a realistic, rigorous ${profile.timelineWeeks}-week preparation plan tailored to the candidate profile below.

CANDIDATE TARGET:
- Target Role: ${profile.targetRole}
- Experience Level: ${profile.experienceLevel}
- Target Companies: ${profile.targetCompanies.length > 0 ? profile.targetCompanies.join(", ") : "Top Tech / FAANG"}
- Timeline: ${profile.timelineWeeks} weeks
- Weekly Commitment: ${profile.weeklyGoalHours} hours/week

AVAILABLE CURRICULUM TOPICS IN REPOSITORY:
${JSON.stringify(topicCatalog, null, 2)}

Produce a valid JSON object matching the exact schema:
{
  "domainWeights": {
    "system-design": 0.40,
    "coding": 0.35,
    "behavioral": 0.15,
    "cloud": 0.10
  },
  "weeklyMilestones": [
    {
      "weekNumber": 1,
      "title": "Core Foundations & Systems Architecture",
      "focusDomain": "System Design",
      "targetHours": ${profile.weeklyGoalHours},
      "goals": ["Master distributed consensus", "Design high-throughput rate limiters"],
      "recommendedTopics": ["Distributed Caching", "Sliding Window Rate Limiter"]
    }
  ]
}

Ensure there are exactly ${profile.timelineWeeks} milestones (one per week). Return ONLY valid JSON.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const planJson = JSON.parse(response.text || "{}");

    // Upsert PreparationPlan bound to candidateProfile
    const plan = await db.preparationPlan.upsert({
      where: { candidateId: profile.id },
      update: {
        targetRole: profile.targetRole,
        targetSeniority: profile.experienceLevel,
        timelineWeeks: profile.timelineWeeks,
        weeklyMilestones: planJson.weeklyMilestones || [],
        domainWeights: planJson.domainWeights || {
          "system-design": 0.35,
          coding: 0.35,
          behavioral: 0.15,
          cloud: 0.15,
        },
      },
      create: {
        candidateId: profile.id,
        targetRole: profile.targetRole,
        targetSeniority: profile.experienceLevel,
        timelineWeeks: profile.timelineWeeks,
        weeklyMilestones: planJson.weeklyMilestones || [],
        domainWeights: planJson.domainWeights || {
          "system-design": 0.35,
          coding: 0.35,
          behavioral: 0.15,
          cloud: 0.15,
        },
      },
    });

    return NextResponse.json({ success: true, plan });
  } catch (error) {
    console.error("Preparation plan generation failed:", error);
    return NextResponse.json(
      {
        error: "PLAN_GENERATION_FAILED",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
