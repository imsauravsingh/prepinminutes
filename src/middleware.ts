import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = [
  "/",
  "/login",
  "/sign-up",
  "/forgot-password",
  "/reset-password",
  "/coming-soon",
  "/privacy-policy",
  "/terms",
];

function isPublicPath(pathname: string): boolean {
  if (PUBLIC_PATHS.includes(pathname)) return true;
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/sign-up") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password") ||
    pathname.startsWith("/api/public") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/api/webhooks")
  ) {
    return true;
  }
  return false;
}

function isAdminPath(pathname: string): boolean {
  return pathname.startsWith("/admin");
}

const activeAuthProvider = (
  process.env.NEXT_PUBLIC_AUTH_PROVIDER || "google"
).toLowerCase();

const clerkHandler = clerkMiddleware(async (auth, req) => {
  if (isPublicPath(req.nextUrl.pathname)) {
    return NextResponse.next();
  }

  const { userId } = await auth();

  if (!userId) {
    const loginUrl = new URL("/login", req.url);
    const redirectPath = req.nextUrl.pathname + req.nextUrl.search;
    loginUrl.searchParams.set("redirect", redirectPath);
    return NextResponse.redirect(loginUrl);
  }

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-candidate-clerk-id", userId);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
});

export default function middleware(req: NextRequest, event: unknown) {
  // 1. If Clerk is explicitly enabled via NEXT_PUBLIC_AUTH_PROVIDER="clerk"
  if (activeAuthProvider === "clerk") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return clerkHandler(req, event as any);
  }

  const pathname = req.nextUrl.pathname;

  // 2. Public routes: allow immediate access
  if (isPublicPath(pathname)) {
    // If the candidate is already authenticated and visits /login or /sign-up without explicit query params,
    // redirect them directly to /dashboard.
    // If redirect or session_expired is present, allow them to view login page cleanly without bouncing.
    const token =
      req.cookies.get("pim_session")?.value ||
      req.cookies.get("pim_auth_token")?.value ||
      (activeAuthProvider === "clerk"
        ? req.cookies.get("__session")?.value
        : undefined);

    const hasRedirect = req.nextUrl.searchParams.has("redirect");
    const hasExpired = req.nextUrl.searchParams.has("session_expired");
    const hasAuthCallback =
      req.nextUrl.searchParams.has("auth_token") ||
      req.nextUrl.searchParams.has("code") ||
      req.nextUrl.searchParams.has("error");

    if (
      token &&
      !hasRedirect &&
      !hasExpired &&
      !hasAuthCallback &&
      (pathname === "/login" || pathname === "/sign-up")
    ) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  }

  // 3. Admin routes: allow pass-through to AdminRootLayout which handles admin auth & approval checks
  if (isAdminPath(pathname)) {
    return NextResponse.next();
  }

  // 4. Protected candidate routes (/dashboard, /practice, /profile, /preparation-plan, /revision, etc.)
  // Without login, these pages MUST NOT open; the user is redirected immediately to /login.
  const sessionToken =
    req.cookies.get("pim_session")?.value ||
    req.cookies.get("pim_auth_token")?.value ||
    (activeAuthProvider === "clerk"
      ? req.cookies.get("__session")?.value
      : undefined);

  if (!sessionToken) {
    const loginUrl = new URL("/login", req.url);
    const redirectPath = req.nextUrl.pathname + req.nextUrl.search;
    loginUrl.searchParams.set("redirect", redirectPath);
    loginUrl.searchParams.set("session_expired", "1");
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
