import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/login(.*)",
  "/sign-up(.*)",
  "/coming-soon(.*)",
  "/privacy-policy(.*)",
  "/api/public(.*)",
  "/api/auth(.*)",
  "/api/webhooks(.*)",
]);

const activeAuthProvider = (
  process.env.NEXT_PUBLIC_AUTH_PROVIDER || "google"
).toLowerCase();

const clerkHandler = clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  const { userId } = await auth();

  if (!userId) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect_url", req.url);
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
  // Default: Google SSO is enabled and Clerk is disabled.
  // Static export routes are protected client-side via <AuthGate /> and verified at the edge by prepinminutes-backend.
  if (activeAuthProvider !== "clerk") {
    return NextResponse.next();
  }

  // Only invoke Clerk middleware when explicitly enabled via NEXT_PUBLIC_AUTH_PROVIDER="clerk"
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return clerkHandler(req, event as any);
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};

