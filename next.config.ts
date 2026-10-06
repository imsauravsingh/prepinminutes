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

if (
  process.env.NODE_ENV === "production" &&
  !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
) {
  throw new Error(
    "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is missing at build time. This app is a " +
      "static export (output: 'export'), so Clerk's publishable key must be set as a " +
      "BUILD-time environment variable wherever `next build` runs — on Cloudflare that's " +
      "the Worker's Build environment variables (Settings -> Builds), not the Worker's " +
      "runtime Variables and Secrets. See .env.example.",
  );
}

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
