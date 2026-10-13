"use client";

import React from "react";
import { ClerkProvider } from "@clerk/react";
import { AuthProvider } from "./AuthProvider";

export function ClerkProviderClient({
  publishableKey,
  children,
}: {
  publishableKey?: string;
  children: React.ReactNode;
}) {
  const activeProvider = (
    process.env.NEXT_PUBLIC_AUTH_PROVIDER || "google"
  ).toLowerCase();

  // If explicitly configured for Clerk and publishableKey is present, wrap with ClerkProvider
  if (activeProvider === "clerk" && publishableKey) {
    return (
      <ClerkProvider publishableKey={publishableKey} afterSignOutUrl="/">
        <AuthProvider>{children}</AuthProvider>
      </ClerkProvider>
    );
  }

  // Default: Google SSO is enabled and Clerk is disabled (zero Clerk build or runtime dependency)
  return <AuthProvider>{children}</AuthProvider>;
}

