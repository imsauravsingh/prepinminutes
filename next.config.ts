import type { NextConfig } from "next";

// Cloudflare Deploy Guard: Ensure Cloudflare only builds/deploys the 'main' branch
const isCloudflareCI = process.env.WORKERS_CI === "1" || !!process.env.CF_PAGES;
const cfBranch = process.env.WORKERS_CI_BRANCH || process.env.CF_PAGES_BRANCH;

if (isCloudflareCI && cfBranch && cfBranch !== "main") {
  throw new Error(
    `[Cloudflare Deploy Guard] Deployment trigger blocked: '${cfBranch}' is not authorized for Cloudflare deployment. ` +
      `Only the 'main' branch triggers Cloudflare Worker deployments. ` +
      `Ensure Preview Builds are disabled in Cloudflare Dashboard: Settings -> Build -> Branch control.`,
  );
}

const activeAuthProvider = (
  process.env.NEXT_PUBLIC_AUTH_PROVIDER || "google"
).toLowerCase();

if (
  process.env.NODE_ENV === "production" &&
  activeAuthProvider === "clerk" &&
  !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
) {
  throw new Error(
    "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is missing at build time while NEXT_PUBLIC_AUTH_PROVIDER='clerk'. " +
      "Set NEXT_PUBLIC_AUTH_PROVIDER='google' (default) to use Google SSO, or provide Clerk build-time keys.",
  );
}

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
