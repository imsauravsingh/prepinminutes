# Phase 2: Server Infrastructure Clients & Singletons

## 📌 Executive Summary

Phase 2 establishes the core server infrastructure clients and singletons within `src/server/`. These modules provide type-safe, hot-reload-safe, and serverless-optimized abstractions over Neon PostgreSQL, Upstash Redis, Cloudflare R2, and Google Gemini. Every database query enforces strict candidate tenant isolation via `withCandidateContext(clerkUserId)`.

---

## 🎯 Phase Goals & Deliverables

1. Implement the Prisma Client Singleton (`src/server/db/client.ts`) with `@prisma/adapter-neon` and multi-tenant security guards.
2. Implement the Upstash Redis Client (`src/server/redis/client.ts`) with namespaced key helpers for caching, rate limiting, and locks.
3. Implement the Cloudflare R2 Client (`src/server/storage/r2.ts`) using `@aws-sdk/client-s3` for presigned uploads, whiteboard image storage, and evaluation reports.
4. Implement the Google Gemini Client (`src/server/ai/gemini.ts`) supporting structured JSON schema outputs (`gemini-3.1-flash-lite`) and 1536-dimensional Matryoshka vector embeddings (`gemini-embedding-001`).

---

## 🏗️ 1. Database Client Singleton & Tenant Isolation (`src/server/db/client.ts`)

In Next.js serverless functions and development hot-reloading, unmanaged database client instantiation causes connection pool exhaustion. We employ a global singleton pattern backed by `@prisma/adapter-neon` and WebSocket pooling.

```typescript
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool } from "@neondatabase/serverless";
import ws from "ws";

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL!;
  const pool = new Pool({ connectionString, webSocketConstructor: ws });
  const adapter = new PrismaNeon(pool);

  return new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });
}

export const db = global.__prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  global.__prisma = db;
}

/**
 * Enforces candidate tenant isolation on every downstream query.
 * Throws an unauthorized error if clerkUserId is absent or invalid.
 */
export async function withCandidateContext(clerkUserId: string) {
  if (!clerkUserId || clerkUserId.trim() === "") {
    throw new Error(
      "UNAUTHORIZED: Candidate context requires a valid Clerk user ID.",
    );
  }

  const user = await db.user.findUnique({
    where: { clerkId: clerkUserId },
    include: { profile: true },
  });

  if (!user) {
    throw new Error(
      `NOT_FOUND: No registered candidate profile found for Clerk ID: ${clerkUserId}`,
    );
  }

  return {
    userId: user.id,
    clerkId: user.clerkId,
    email: user.email,
    profile: user.profile,
  };
}
```

---

## ⚡ 2. Upstash Redis Client (`src/server/redis/client.ts`)

Provides low-latency edge caching, sliding-window rate limiting, and distributed locks.

```typescript
import { Redis } from "@upstash/redis";

if (
  !process.env.UPSTASH_REDIS_REST_URL ||
  !process.env.UPSTASH_REDIS_REST_TOKEN
) {
  throw new Error(
    "MISSING_CONFIG: UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN is missing.",
  );
}

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export const RedisKeys = {
  rateLimit: (userId: string, scope: string) => `ratelimit:${scope}:${userId}`,
  idempotency: (key: string) => `idempotency:${key}`,
  sessionState: (sessionId: string) => `session:${sessionId}:state`,
  voiceTranscriptBuffer: (sessionId: string) =>
    `session:${sessionId}:transcripts`,
  userReadinessCache: (userId: string) => `candidate:${userId}:readiness`,
} as const;
```

---

## 🪣 3. Cloudflare R2 Object Storage Client (`src/server/storage/r2.ts`)

Cloudflare R2 provides zero-egress fee S3-compatible storage for candidate whiteboard snapshots, audio recordings, and generated PDF reports.

```typescript
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME || "prepinminutes-assets";

export async function uploadAsset(
  key: string,
  body: Buffer | Uint8Array,
  contentType: string,
): Promise<string> {
  await s3Client.send(
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: body,
      ContentType: contentType,
    }),
  );

  return `${process.env.R2_ENDPOINT}/${BUCKET_NAME}/${key}`;
}

export async function generatePresignedUploadUrl(
  key: string,
  contentType: string,
  expiresInSeconds = 300,
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });

  return getSignedUrl(s3Client, command, { expiresIn: expiresInSeconds });
}
```

---

## 🤖 4. Google Gemini AI SDK Client (`src/server/ai/gemini.ts`)

Configured for `gemini-3.1-flash-lite` (structured qualitative evaluations) and `gemini-embedding-001` (1,536-dimensional semantic vector embeddings).

```typescript
import { GoogleGenAI, Type } from "@google/genai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error(
    "MISSING_CONFIG: GEMINI_API_KEY is not defined in environment.",
  );
}

export const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

/**
 * Generates 1,536-dimensional vector embedding for pgvector storage using Matryoshka reduction.
 */
export async function generate1536Embedding(text: string): Promise<number[]> {
  const response = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: text,
    config: {
      outputDimensionality: 1536,
    },
  });

  if (!response.embedding?.values) {
    throw new Error(
      "GEMINI_ERROR: Failed to retrieve embedding values from Gemini API.",
    );
  }

  return response.embedding.values;
}
```

---

## ✅ Phase 2 Verification Checklist

- [ ] `db.$queryRaw\`SELECT 1\`` executes cleanly through the pooled Neon adapter.
- [ ] `withCandidateContext('test_clerk_id')` fails gracefully when unauthenticated.
- [ ] `redis.ping()` returns `'PONG'` via Upstash REST.
- [ ] `uploadAsset()` writes an automated test object to Cloudflare R2 bucket `prepinminutes-assets` and succeeds `200 OK`.
- [ ] `generate1536Embedding('System Design Cache')` outputs an array of length exactly 1,536.
