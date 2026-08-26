import type { NextConfig } from "next";

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
