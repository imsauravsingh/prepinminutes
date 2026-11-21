"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useNextStepFlow } from "@/lib/useNextStepFlow";

/**
 * Wraps the Step 2 pages (plan choice and AI assessment). When the admin has
 * Step 2 turned off, candidates who land here are sent straight to their
 * preparation plan (Step 3) instead.
 */
export function NextStepGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { enabled, loaded } = useNextStepFlow();

  useEffect(() => {
    if (loaded && !enabled) router.replace("/dashboard?step=3");
  }, [loaded, enabled, router]);

  if (!loaded || !enabled) {
    return (
      <div className="flex flex-1 items-center justify-center gap-2 py-24 text-sm text-ink-muted">
        <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        <span>Opening your preparation plan…</span>
      </div>
    );
  }

  return <>{children}</>;
}
