"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppAuth } from "@/components/providers/AuthProvider";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn } = useAppAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      const redirectTarget =
        typeof window !== "undefined"
          ? window.location.pathname + window.location.search
          : "/dashboard";
      router.replace(`/login?redirect=${encodeURIComponent(redirectTarget)}`);
    }
  }, [isLoaded, isSignedIn, router]);

  if (isLoaded && !isSignedIn) {
    return null;
  }

  if (!isLoaded) {
    return (
      <div className="flex flex-1 items-center justify-center bg-[#fbf9f4] py-24 min-h-screen">
        <div className="flex flex-col items-center gap-3">
          <div className="size-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
          <p className="text-sm font-medium text-ink-muted">Verifying your session…</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

