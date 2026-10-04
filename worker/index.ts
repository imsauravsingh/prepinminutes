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

function isAssetPath(pathname: string): boolean {
  return pathname.startsWith("/_next/") || /\.[a-z0-9]+$/i.test(pathname);
}

const worker = {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (!GATED_HOSTS.has(url.hostname)) {
      return env.ASSETS.fetch(request);
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
      return env.ASSETS.fetch(request);
    }

    const comingSoon = await env.ASSETS.fetch(
      new Request(new URL("/coming-soon", url).toString(), {
        method: request.method,
        headers: request.headers,
      }),
    );
    return new Response(comingSoon.body, {
      status: comingSoon.status,
      headers: comingSoon.headers,
    });
  },
};

export default worker;
