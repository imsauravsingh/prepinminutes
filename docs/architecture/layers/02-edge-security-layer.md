# Layer 2: Edge, Security & Gateway Layer Architecture

This document specifies the technical architecture for edge routing, authentication verification, rate limiting, request idempotency, and security boundaries in **PrepInMinutes**.

---

## 1. Architectural Scope & Objectives

The Edge & Security Gateway sits between external client requests and backend application services. Its objectives are:

1. **Sub-10ms Edge Authorization**: Verify Clerk authentication tokens before requests hit Node.js server runtimes.
2. **Abuse & Cost Protection**: Prevent denial-of-service and runaway LLM billing via distributed token-bucket rate limiting.
3. **Submission Idempotency**: Guarantee that retry requests on unreliable network connections do not trigger duplicate evaluation jobs or duplicate readiness score calculations.
4. **Zero-Trust Security**: Apply strict Content Security Policy (CSP), Cross-Origin Resource Sharing (CORS), and HTTP Strict Transport Security (HSTS) headers.

---

## 2. Edge Topology & Request Flow

```
                      [ Incoming HTTPS Request ]
                                  │
                                  ▼
                     ┌─────────────────────────┐
                     │ Cloudflare / Edge CDN   │
                     │ • SSL Termination       │
                     │ • DDoS Shield           │
                     └────────────┬────────────┘
                                  │
                                  ▼
                     ┌─────────────────────────┐
                     │ Next.js Edge Middleware │
                     │ (middleware.ts)         │
                     └────────────┬────────────┘
                                  │
          ┌───────────────────────┼───────────────────────┐
          ▼                       ▼                       ▼
   [ 1. Auth Guard ]     [ 2. Rate Limiting ]     [ 3. Idempotency ]
   • Clerk JWT Verify    • Upstash Redis Token    • Check Idempotency-Key
   • Public/Protected      Bucket Algorithm       • Return Cached Result
     Route Matching      • 60 req/min/IP            if Key Exists
          │                       │                       │
          └───────────────────────┼───────────────────────┘
                                  │ (All Passed)
                                  ▼
                   [ Upstream BFF / API Services ]
```

---

## 3. Edge Authentication & Route Protection

Authentication is powered by Clerk via the Next.js edge middleware wrapper:

```ts
// src/middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/login(.*)",
  "/sign-up(.*)",
  "/privacy-policy",
  "/api/webhooks(.*)",
]);

const isStaticAsset = createRouteMatcher([
  "/_next(.*)",
  "/favicon.ico",
  "/(.*)\\.(png|jpg|jpeg|svg|webp|woff2)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isStaticAsset(req)) return NextResponse.next();

  if (!isPublicRoute(req)) {
    const session = await auth();
    if (!session.userId) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("redirect_url", req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
```

---

## 4. Distributed Rate Limiting & Abuse Prevention

To protect expensive downstream LLM generation and real-time audio channels, requests are rate-limited at the edge using **Upstash Redis**:

```ts
// src/lib/edge/rate-limiter.ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

// Tier 1: General Navigation & REST API (60 req / minute)
export const standardLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(60, "1 m"),
  analytics: true,
  prefix: "rl:std",
});

// Tier 2: AI Execution / LLM Prompts (10 req / minute)
export const aiExecutionLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "1 m"),
  analytics: true,
  prefix: "rl:ai",
});
```

### Response Headers on Limit Exceeded

When a client exceeds limits, the Edge immediately returns HTTP `429 Too Many Requests`:

```http
HTTP/1.1 429 Too Many Requests
Content-Type: application/json
Retry-After: 34
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1759012345

{
  "error": "RATE_LIMIT_EXCEEDED",
  "message": "Too many AI evaluation requests. Please retry in 34 seconds."
}
```

---

## 5. Request Idempotency Engine

Practice and mock interview completion endpoints (`/api/practice/session/submit`, `/api/mock-interview/session/end`) require an `Idempotency-Key` header:

```http
POST /api/practice/session/submit
Idempotency-Key: session_sd_98124:attempt_1
Content-Type: application/json
```

### Idempotency Logic

1. Edge middleware extracts `Idempotency-Key`.
2. Queries Redis key `idemp:${key}`.
3. If value exists:
   - Returns the cached response immediately (`200 OK` or `201 Created`) with header `X-Cache-Lookup: HIT`.
4. If key does not exist:
   - Sets a temporary lock `idemp:${key}` with status `"PROCESSING"` and 60-second TTL.
   - Forwards request to downstream worker.
   - Upon successful completion, caches the response payload in Redis with a 24-hour TTL.

---

## 6. Security Headers & Zero-Trust Configuration

Every response passing through the edge gateway is stamped with hardened security headers:

```ts
const securityHeaders = {
  "Content-Security-Policy":
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://clerk.prepinminutes.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: blob:; connect-src 'self' https: wss:; font-src 'self' data:;",
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(self), geolocation=()",
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
};
```

---

## 7. Developer Implementation & Verification Checklist

- [ ] All protected application routes require valid Clerk session JWT before reaching page handlers.
- [ ] AI generation routes enforce the `aiExecutionLimiter` sliding window.
- [ ] Submission endpoints enforce `Idempotency-Key` validation.
- [ ] Security headers pass A+ standards on SSL Labs and SecurityHeaders audits.
