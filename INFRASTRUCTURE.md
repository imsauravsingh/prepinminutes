# Infrastructure & Deployment

This document defines how PrepInMinutes ships code — from a merged pull request to a live update on production — for the MVP phase.

## 1. Goals

- Merging to `main` should deploy automatically. No manual deploy step.
- Every PR gets a preview URL before it touches production.
- A bad deploy must be reversible in **under a minute**, without needing a new commit.
- Zero infra to manage for the MVP — optimize for speed of iteration, not scale.

## 2. Frontend Stack

- **Framework:** Next.js.
- **Phase 1 (now):** CSR/static — pages built with `next build` + `output: 'export'`, shipped as static HTML/JS/CSS. No Node.js server, no Cloudflare Functions/Workers involved yet. This is what §4's build settings target.
- **Phase 2 (later, once SSR is actually needed):** move to a server-rendered Next.js build. This changes the Cloudflare build command/output and adapter — see **"Migrating to SSR"** in §4. Nothing about the CI pipeline (§3), domain, or rollback model (§5) changes when this happens.

## 3. Branching Strategy

| Branch | Purpose | Deploys to |
|---|---|---|
| `main` | Production-ready code only | Production (auto) |
| `develop` | Integration branch, in-progress work | Preview (auto) |
| `feature/*`, `fix/*` | Individual work branches, opened as PRs into `develop` or `main` | PR Preview (auto) |

**Rules:**
- `main` is protected: no direct pushes, PRs required, at least 1 approval, required checks must pass (see §3).
- Every PR (into `develop` or `main`) gets its own ephemeral preview deployment for review — nothing gets merged unseen.
- `develop` → `main` is promoted via PR once a batch of work is verified on the `develop` preview.

## 4. CI — GitHub Actions

Runs on every push and every PR, gates the merge:

- Install deps (cached)
- Lint
- Type-check
- Unit tests
- Production build (`build` must succeed — this is what catches most real breakage)

If any step fails, the PR is blocked from merging (branch protection: required status checks). This CI workflow is separate from the deploy step below — Cloudflare Pages handles deploys, GitHub Actions only gates merges.

```yaml
# .github/workflows/ci.yml
name: CI
on:
  pull_request:
  push:
    branches: [main, develop]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm test -- --ci
      - run: npm run build
```

## 5. CD — Hosting Platform

### Choice: **Cloudflare Pages**

| Option | Auto-deploy on merge | Preview per PR | Rollback | Free tier for commercial use | Ops overhead | Fit for MVP |
|---|---|---|---|---|---|---|
| **Cloudflare Pages** | ✅ native | ✅ native | ✅ dashboard, prior deployments kept | ✅ yes, no restriction | None | ✅ Best |
| Vercel | ✅ native | ✅ native | ✅ 1-click / CLI, sub-minute | ⚠️ Hobby tier is non-commercial only per ToS | None | Good, but needs a paid plan once live |
| Netlify | ✅ native | ✅ native | ✅ 1-click | ⚠️ similar non-commercial restriction on free tier | None | Good alternative |
| AWS Amplify | ✅ native | ✅ native | ⚠️ possible but clunkier | ✅ yes (pay-as-you-go, rarely free) | Some (IAM, console) | Overkill for MVP |
| Self-hosted (EC2/Docker + GH Actions) | Build it yourself | Build it yourself | Build it yourself | ✅ yes | High | ❌ Not worth it yet |

**Why Cloudflare Pages for this MVP:**
- Free tier has **no non-commercial restriction** — PrepInMinutes is a paid product (see Subscription screen in the roadmap), so this matters from day one, not just at scale.
- **Unlimited bandwidth and requests** on the free tier (Vercel/Netlify free tiers are bandwidth-capped and intended for light/personal traffic).
- Every deployment is kept and can be **rolled back to from the dashboard** — same "point production at an old build" model as Vercel, no rebuild needed.
- Zero-config GitHub integration: connect the repo once; pushes to `main` auto-deploy to production, every other branch/PR gets its own preview URL automatically.
- Free custom domain + free SSL, and if you route your domain's nameservers through Cloudflare you also get their CDN/DDoS protection in front of the site at no cost.
- **Same account covers Phase 2 (API) for free**: Cloudflare Workers (serverless functions), D1 (SQLite), KV, and R2 (object storage) all sit on the same free tier, on a subdomain of the same domain (e.g. `api.prepinminutes.com`) — no new hosting decision needed when the API work starts.
- Framework-agnostic: works the same for a static export, Vite/React, or Next.js static/edge build, so the prototype's stack choice doesn't lock in the host.

**Alternative — Vercel:** still the better pick if the app ends up needing heavy Next.js-specific SSR/ISR features, since it's the reference platform for those. Revisit once PrepInMinutes is generating revenue and a paid Vercel plan (Pro) is a rounding error — the commercial-use restriction stops mattering at that point.

### Phased Rollout

**Phase 1 — Prototype (now):** all pages built as static UI, no backend/API yet. Deploy as a pure static site to Cloudflare Pages. Zero servers, zero API keys, effectively $0 cost.

**Phase 2 — API:** once pages are ready and backend work starts, add Cloudflare Workers (or a small dedicated backend, per §8) behind `api.<domain>` — frontend hosting doesn't need to change.

### Setup

1. Push the domain's nameservers to Cloudflare (in your domain registrar's settings) — free, gets DNS + CDN + the Pages custom-domain flow in one place. (Skip this if you'd rather keep DNS at the current registrar; Pages also accepts a CNAME record without a full nameserver move.)
2. In the Cloudflare dashboard: **Workers & Pages → Create → Pages → Connect to Git** → select `imsauravsingh/prepinminutes`.
3. On the "Set up builds" screen, enter:

   | Field | Value |
   |---|---|
   | Framework preset | `Next.js (Static HTML Export)` |
   | Build command | `npx next build` |
   | Build output directory | `out` |
   | Root directory | `/` (change only if Next.js lives in a subfolder, e.g. a monorepo) |
   | Environment variable | `NODE_VERSION` = `20` |

   This requires `next.config.js` to declare a static export:
   ```js
   /** @type {import('next').NextConfig} */
   const nextConfig = {
     output: 'export',
   };
   module.exports = nextConfig;
   ```
   With this, `next build` alone produces the `out/` directory — no separate `next export` step (that command is deprecated in current Next.js).
4. Set **Production branch** = `main`. Every other branch/PR deploys as a **Preview Deployment** automatically — no extra config needed.
5. Add the custom domain under the Pages project's **Custom Domains** tab.
6. Set environment variables in the Pages project settings (per environment: Production / Preview) — never commit secrets to the repo.

**Flow:**

```
PR opened → CI runs + Cloudflare Preview deploy → review on preview URL
   → PR approved + CI green → merge to main
   → Cloudflare auto-builds main → promotes to Production (auto)
```

### Migrating to SSR (Phase 2, when needed)

`output: 'export'` only supports fully static/CSR pages — no server components that need per-request rendering, no API routes, no ISR. When a page genuinely needs SSR, two supported paths exist on Cloudflare; pick when the need is concrete, don't pre-adopt either now:

| Adapter | Deploys as | Build command | Notes |
|---|---|---|---|
| `@cloudflare/next-on-pages` | Pages Functions (per-route edge runtime) | `npx @cloudflare/next-on-pages@1` (output dir `.vercel/output/static`) | Stays inside the Pages product used today; each SSR route needs `export const runtime = 'edge'`; enable the `nodejs_compat` compatibility flag in project settings. |
| `@opennextjs/cloudflare` (OpenNext) | Cloudflare Workers | `opennextjs-cloudflare build` then `opennextjs-cloudflare deploy` (via Wrangler, not the Pages Git-build UI) | Cloudflare's current recommended path for full Next.js feature support (middleware, ISR, image optimization); deploys as a Worker, so it replaces the git-connected Pages build with a Wrangler-driven deploy — typically run from a GitHub Actions job instead. |

Remove `output: 'export'` from `next.config.js` when making this switch, and update this document's Setup section (§5) to match whichever adapter is chosen. Everything else — branching, CI gate, rollback model, domain — stays the same.

## 6. Rollback

Two layers, use whichever is faster for the situation:

**A. Instant rollback (primary — no rebuild, ~seconds)**
Cloudflare Pages keeps every past deployment live. To roll back:
- Dashboard: Workers & Pages → prepinminutes → Deployments → pick the last known-good one → **"Rollback to this deployment."**
- CLI (optional): `wrangler pages deployment list` / `wrangler pages deployment tail` to inspect, then re-promote via dashboard.

This re-points the production alias instantly — no git revert, no rebuild, no waiting on CI.

**B. Git-level rollback (when the bad code must not stay in `main` history going forward)**
```bash
git revert <bad-commit-sha>
git push origin main
```
This triggers a normal new deploy with the revert applied. Use this after an instant rollback has already stopped the bleeding, to keep `main` and production in sync long-term.

**Rule of thumb:** instant rollback stops the incident; git revert is the follow-up cleanup so the next deploy from `main` doesn't reintroduce the bug.

## 7. Environments Summary

| Environment | Trigger | URL | Data |
|---|---|---|---|
| Local | `npm run dev` | localhost | mocked/local |
| Preview | Any PR / any non-main branch push | auto-generated `*.pages.dev` per deploy | staging/test data |
| Production | Merge to `main` | prepinminutes production domain | real data |

## 8. Monitoring (MVP baseline)

- Cloudflare Pages' built-in deployment logs + Workers logs (once Phase 2 API exists) for immediate error visibility post-deploy.
- Cloudflare Web Analytics (free, no cookies) for traffic/perf on the production alias.
- Revisit dedicated error tracking (e.g., Sentry) once auth/backend flows go live — out of scope for the static MVP shell.

## 9. Open Items (revisit post-MVP)

- Add required-reviewer rules and CODEOWNERS once the team grows beyond one contributor.
- Add a staging environment with production-like data once a real backend exists.
- Move backend microservices off serverless functions if/when workloads need long-running processes, queues, or heavier compute.
- Decide between `@cloudflare/next-on-pages` and `@opennextjs/cloudflare` when SSR is actually needed (see §5, "Migrating to SSR") — don't pre-decide before there's a concrete SSR requirement.
