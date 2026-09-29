# Phase 4: Edge Security, Gateway & Middleware

## 📌 Executive Summary

Phase 4 deploys sub-10ms edge security at the network perimeter. It integrates **Clerk Authentication** with Next.js edge middleware, enforces sliding-window rate limiting via **Upstash Redis** to protect LLM endpoints against runaway costs and DDoS, and implements a 24-hour idempotency interceptor to guarantee safe retries for candidate submissions.

---

## 🎯 Phase Goals & Deliverables

1. **Edge Route Guard (`src/middleware.ts`)**:
   - Secures candidate application routes (`/dashboard`, `/practice`, `/mock-interview`, `/evaluation`, `/revision`, `/plan`) while permitting public landing, marketing, and Clerk auth callback routes.
   - Decorates downstream requests with the verified candidate identity.
2. **Upstash Sliding Window Rate Limiter (`src/server/edge/rate-limiter.ts`)**:
   - Restricts API throughput: 60 requests/min general API, 10 requests/min for expensive Gemini AI evaluation routes.
3. **Idempotency Interceptor (`src/server/edge/idempotency.ts`)**:
   - Caches practice session submissions by `Idempotency-Key: {sessionId}:{attempt}` for 24 hours to eliminate duplicate Gemini token charges during network retries.

---

## 🛡️ 1. Edge Route Guard Middleware (`src/middleware.ts`)

```typescript
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/public(.*)",
  "/api/webhooks(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  const { userId } = await auth();

  if (!userId) {
    const signInUrl = new URL("/sign-in", req.url);
    signInUrl.searchParams.set("redirect_url", req.url);
    return NextResponse.redirect(signInUrl);
  }

  // Attach verified user ID to downstream headers for API routes
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-candidate-clerk-id", userId);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
```

---

## ⏱️ 2. Sliding Window Rate Limiter (`src/server/edge/rate-limiter.ts`)

Using `@upstash/ratelimit` or raw Redis zsets to implement sliding windows.

```typescript
import { redis, RedisKeys } from "../redis/client";

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetSeconds: number;
}

export async function checkRateLimit(
  userId: string,
  scope: "general" | "ai_eval",
  limit: number,
  windowSeconds: number,
): Promise<RateLimitResult> {
  const key = RedisKeys.rateLimit(userId, scope);
  const now = Date.now();
  const clearBefore = now - windowSeconds * 1000;

  const pipeline = redis.pipeline();
  pipeline.zremrangebyscore(key, 0, clearBefore);
  pipeline.zadd(key, { score: now, member: `${now}-${Math.random()}` });
  pipeline.zcard(key);
  pipeline.expire(key, windowSeconds);

  const results = await pipeline.exec();
  const requestCount = results[2] as number;

  if (requestCount > limit) {
    return {
      allowed: false,
      remaining: 0,
      resetSeconds: windowSeconds,
    };
  }

  return {
    allowed: true,
    remaining: limit - requestCount,
    resetSeconds: windowSeconds,
  };
}
```

---

## 🔁 3. Submission Idempotency Interceptor (`src/server/edge/idempotency.ts`)

Prevents duplicate execution when candidates click "Submit" multiple times or mobile networks retry:

```typescript
import { redis, RedisKeys } from "../redis/client";

export async function checkIdempotency(key: string): Promise<string | null> {
  const cacheKey = RedisKeys.idempotency(key);
  const cachedResponse = await redis.get<string>(cacheKey);
  return cachedResponse;
}

export async function saveIdempotency(
  key: string,
  responseData: unknown,
  ttlSeconds = 86400,
): Promise<void> {
  const cacheKey = RedisKeys.idempotency(key);
  await redis.set(cacheKey, JSON.stringify(responseData), { ex: ttlSeconds });
}
```

---

## ✅ Phase 4 Verification Checklist

- [ ] Unauthenticated requests to `/dashboard` immediately redirect to `/sign-in`.
- [ ] Authenticated requests pass headers with `x-candidate-clerk-id`.
- [ ] Rapid loop of 12 AI requests triggers HTTP 429 ("Too Many Requests") on the 11th call.
- [ ] Retrying a practice session submission with identical `Idempotency-Key` returns cached JSON within 10ms without calling Gemini.
