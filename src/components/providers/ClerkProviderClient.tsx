"use client";

import { ClerkProvider } from "@clerk/react";

export function ClerkProviderClient({
  publishableKey,
  children,
}: {
  publishableKey?: string;
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider publishableKey={publishableKey} afterSignOutUrl="/">
      {children}
    </ClerkProvider>
  );
}
