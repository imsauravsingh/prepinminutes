interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
}

// Coming-soon gate applies only to the production custom domain.
// prepinminutes.<account>.workers.dev and preview/dev deployments always show the real site.
const GATED_HOSTS = new Set(["prepinminutes.com", "www.prepinminutes.com"]);

const BYPASS_PATH = "/preview/saurav";
const ACCESS_COOKIE = "pim_access";
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

function hasAccessCookie(request: Request): boolean {
  const cookie = request.headers.get("Cookie") ?? "";
  return cookie
    .split(";")
    .map((part) => part.trim())
    .some((part) => part === `${ACCESS_COOKIE}=1`);
}

const YEAR = 60 * 60 * 24 * 365;
const WEEK = 60 * 60 * 24 * 7;

/**
 * Browser + Cloudflare edge caching for static files.
 * - /_next/static/*: file names carry a content hash, so they never change.
 * - /hero/* with ?v=: hero scene images; bump HERO_ASSET_VERSION to refresh.
 * - other images, fonts and icons: cached for a week, refreshed in the background.
 * - HTML pages: always revalidated, so a new deploy shows up immediately.
 */
export function cacheControlFor(url: URL, contentType: string | null): string {
  const path = url.pathname;
  if (path.startsWith("/_next/static/")) return `public, max-age=${YEAR}, immutable`;
  if (path.startsWith("/hero/")) {
    return url.searchParams.has("v")
      ? `public, max-age=${YEAR}, immutable`
      : `public, max-age=${WEEK}, stale-while-revalidate=${WEEK * 4}`;
  }
  if (/\.(?:avif|webp|png|jpe?g|gif|svg|ico|woff2?|ttf|otf|mp4|webm)$/i.test(path)) {
    return `public, max-age=${WEEK}, stale-while-revalidate=${WEEK * 4}`;
  }
  if (contentType?.includes("text/html") || !/\.[a-z0-9]+$/i.test(path)) {
    return "public, max-age=0, must-revalidate";
  }
  return `public, max-age=${60 * 60}, stale-while-revalidate=${60 * 60 * 24}`;
}

async function serveAsset(env: Env, request: Request): Promise<Response> {
  const response = await env.ASSETS.fetch(request);
  if (response.status !== 200 || request.method !== "GET") return response;
  const cached = new Response(response.body, response);
  cached.headers.set(
    "Cache-Control",
    cacheControlFor(new URL(request.url), response.headers.get("Content-Type")),
  );
  return cached;
}

function isAssetPath(pathname: string): boolean {
  return pathname.startsWith("/_next/") || /\.[a-z0-9]+$/i.test(pathname);
}

const worker = {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (!GATED_HOSTS.has(url.hostname)) {
      return serveAsset(env, request);
    }

    if (url.pathname === BYPASS_PATH) {
      const headers = new Headers({ Location: "/" });
      headers.append(
        "Set-Cookie",
        `${ACCESS_COOKIE}=1; Path=/; Max-Age=${ONE_YEAR_SECONDS}; Secure; HttpOnly; SameSite=Lax`,
      );
      return new Response(null, { status: 302, headers });
    }

    // Always let static assets (JS/CSS/fonts/images) through so the
    // coming-soon page itself can render — only gate document navigations.
    if (isAssetPath(url.pathname) || hasAccessCookie(request)) {
      return serveAsset(env, request);
    }

    const comingSoon = await env.ASSETS.fetch(
      new Request(new URL("/coming-soon", url).toString(), {
        method: request.method,
        headers: request.headers,
      }),
    );
    const gated = new Response(comingSoon.body, {
      status: comingSoon.status,
      headers: comingSoon.headers,
    });
    // The gate depends on a cookie, so it must never be cached as the real page.
    gated.headers.set("Cache-Control", "private, no-store");
    return gated;
  },
};

export default worker;
