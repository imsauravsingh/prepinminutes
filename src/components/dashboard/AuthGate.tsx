"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppAuth } from "@/components/providers/AuthProvider";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn } = useAppAuth();
  const router = useRouter();
  const [hasRedirected, setHasRedirected] = useState(false);
  // Saved sessions open the page almost instantly; only show the "verifying" message if
  // checking actually takes a while, so normal page loads don't flash it.
  const [showWait, setShowWait] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setShowWait(true), 450);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (isLoaded && !isSignedIn && !hasRedirected) {
      setHasRedirected(true);
      const redirectTarget =
        typeof window !== "undefined"
          ? window.location.pathname + window.location.search
          : "/dashboard";
      const loginUrl = `/login?redirect=${encodeURIComponent(
        redirectTarget
      )}&session_expired=1`;

      if (typeof window !== "undefined") {
        window.location.replace(loginUrl);
      } else {
        router.replace(loginUrl);
      }
    }
  }, [isLoaded, isSignedIn, hasRedirected, router]);

  if (!isLoaded || !isSignedIn) {
    if (!isLoaded && !showWait) return <div className="min-h-screen flex-1 bg-[#fbf9f4]" aria-busy="true" />;
    return (
      <div className="flex flex-1 items-center justify-center bg-[#fbf9f4] py-24 min-h-screen">
        <div className="flex flex-col items-center gap-3">
          <div className="size-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
          <p className="text-sm font-medium text-ink-muted">
            {!isLoaded
              ? "Verifying your session…"
              : "Session expired. Redirecting to login…"}
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

