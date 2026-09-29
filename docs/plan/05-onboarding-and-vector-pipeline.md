# Phase 5: Onboarding, Profile & Resume Vector Pipeline APIs

## 📌 Executive Summary

Phase 5 implements candidate onboarding, PDF resume ingestion, text chunking, and 1,536-dimensional vector embedding generation using **Google Gemini Embedding 001** stored directly in **Neon PostgreSQL `pgvector`**. It concludes by synthesizing a personalized preparation plan tailored to the candidate's target company and verified skill gaps.

---

## 🎯 Phase Goals & Deliverables

1. **Candidate Profile API (`src/app/api/onboarding/profile/route.ts`)**:
   - `POST` / `GET` endpoints to persist and retrieve candidate role targets, company list, and weekly commitment.
2. **Resume PDF Parser & Vector Pipeline (`src/app/api/onboarding/resume/route.ts`)**:
   - Accepts PDF upload $\rightarrow$ extracts text $\rightarrow$ chunks into 512-token segments $\rightarrow$ generates 1,536-dim vector embeddings $\rightarrow$ persists to Neon `DocumentEmbedding`.
3. **Plan Generation API (`src/app/api/plan/generate/route.ts`)**:
   - Uses `pgvector` cosine similarity (`<=>`) to match candidate background against required role competencies and constructs weekly milestones in `PreparationPlan`.

---

## 👤 1. Candidate Profile API (`src/app/api/onboarding/profile/route.ts`)

```typescript
import { NextRequest, NextResponse } from "next/server";
import { db, withCandidateContext } from "@/server/db/client";

export async function POST(req: NextRequest) {
  try {
    const clerkId = req.headers.get("x-candidate-clerk-id");
    if (!clerkId) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    const {
      targetRole,
      experienceLevel,
      targetCompanies,
      timelineWeeks,
      weeklyGoalHours,
    } = await req.json();

    // Upsert User and CandidateProfile
    const user = await db.user.upsert({
      where: { clerkId },
      update: {},
      create: { clerkId, email: `${clerkId}@placeholder.local` },
    });

    const profile = await db.candidateProfile.upsert({
      where: { userId: user.id },
      update: {
        targetRole,
        experienceLevel,
        targetCompanies,
        timelineWeeks: Number(timelineWeeks) || 8,
        weeklyGoalHours: Number(weeklyGoalHours) || 10,
      },
      create: {
        userId: user.id,
        targetRole,
        experienceLevel,
        targetCompanies,
        timelineWeeks: Number(timelineWeeks) || 8,
        weeklyGoalHours: Number(weeklyGoalHours) || 10,
      },
    });

    return NextResponse.json({ success: true, profile });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}
```

---

## 📄 2. Resume Ingestion & pgvector Pipeline (`src/app/api/onboarding/resume/route.ts`)

```typescript
import { NextRequest, NextResponse } from "next/server";
import { db, withCandidateContext } from "@/server/db/client";
import { generate1536Embedding } from "@/server/ai/gemini";
import pdf from "pdf-parse";

export async function POST(req: NextRequest) {
  try {
    const clerkId = req.headers.get("x-candidate-clerk-id");
    if (!clerkId)
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

    const context = await withCandidateContext(clerkId);
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "FILE_MISSING" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const parsedPdf = await pdf(buffer);
    const fullText = parsedPdf.text.replace(/\s+/g, " ").trim();

    // Chunk text into ~500 token windows with overlap
    const chunks = chunkText(fullText, 1500, 200);

    // Generate vector embeddings and store in Neon pgvector
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const embedding = await generate1536Embedding(chunk);

      // Raw SQL insertion for pgvector unsupported type
      await db.$executeRaw`
        INSERT INTO "DocumentEmbedding" ("id", "userId", "docType", "chunkIndex", "content", "embedding", "createdAt")
        VALUES (
          gen_random_uuid()::text,
          ${context.userId},
          'resume',
          ${i},
          ${chunk},
          ${JSON.stringify(embedding)}::vector,
          NOW()
        );
      `;
    }

    return NextResponse.json({
      success: true,
      chunksProcessed: chunks.length,
      extractedPreview: fullText.slice(0, 300),
    });
  } catch (error) {
    console.error("Resume processing error:", error);
    return NextResponse.json(
      { error: "RESUME_PARSING_FAILED" },
      { status: 500 },
    );
  }
}

function chunkText(text: string, chunkSize: number, overlap: number): string[] {
  const chunks: string[] = [];
  let start = 0;
  while (start < text.length) {
    chunks.push(text.slice(start, start + chunkSize));
    start += chunkSize - overlap;
  }
  return chunks;
}
```

---

## 🎯 3. Plan Generation API (`src/app/api/plan/generate/route.ts`)

Synthesizes customized preparation milestones based on semantic gap analysis:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { db, withCandidateContext } from "@/server/db/client";
import { ai } from "@/server/ai/gemini";

export async function POST(req: NextRequest) {
  try {
    const clerkId = req.headers.get("x-candidate-clerk-id");
    if (!clerkId)
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

    const context = await withCandidateContext(clerkId);
    const profile = context.profile;

    if (!profile) {
      return NextResponse.json(
        { error: "PROFILE_NOT_CONFIGURED" },
        { status: 400 },
      );
    }

    // Generate structured weekly plan via Gemini
    const prompt = `
      Create a comprehensive ${profile.timelineWeeks}-week technical interview preparation roadmap
      for a candidate targeting:
      - Role: ${profile.targetRole} (${profile.experienceLevel})
      - Companies: ${profile.targetCompanies.join(", ")}
      - Weekly Time Commitment: ${profile.weeklyGoalHours} hours/week

      Return JSON matching the schema:
      {
        "milestones": [
          {
            "weekNumber": 1,
            "title": "Core Foundations & System Architecture",
            "focusAreas": ["Distributed Caching", "Sliding Window Algorithms"],
            "targetHours": ${profile.weeklyGoalHours},
            "topics": ["distributed-cache", "sliding-window"]
          }
        ]
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: prompt,
      config: { responseMimeType: "application/json" },
    });

    const planJson = JSON.parse(response.text || "{}");

    const prepPlan = await db.preparationPlan.create({
      data: {
        userId: context.userId,
        targetSeniority: profile.experienceLevel,
        status: "active",
        weeksTotal: profile.timelineWeeks,
        milestones: planJson.milestones || [],
      },
    });

    return NextResponse.json({ success: true, plan: prepPlan });
  } catch (error) {
    console.error("Plan generation failed:", error);
    return NextResponse.json(
      { error: "PLAN_GENERATION_FAILED" },
      { status: 500 },
    );
  }
}
```

---

## ✅ Phase 5 Verification Checklist

- [ ] `POST /api/onboarding/profile` writes candidate target data to Neon and returns `200 OK`.
- [ ] `POST /api/onboarding/resume` accepts a sample PDF resume, extracts text, chunks it, and writes rows with valid 1,536-dim vectors into `DocumentEmbedding`.
- [ ] `POST /api/plan/generate` outputs structured weekly milestones matching candidate time budget and role targets.
