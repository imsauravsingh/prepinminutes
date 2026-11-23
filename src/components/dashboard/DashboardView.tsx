"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { backendApi } from "@/lib/api-client";
import { useRouter, useSearchParams } from "next/navigation";
import { OnboardingHeader } from "@/components/dashboard/OnboardingHeader";
import { OnboardingFormCard } from "@/components/dashboard/OnboardingFormCard";
import { OnboardingHelpCard } from "@/components/dashboard/OnboardingHelpCard";
import { StartPreparingWorkspace } from "@/components/dashboard/StartPreparingWorkspace";
import { StudyRoom } from "@/components/dashboard/room/StudyRoom";

const COMPLETED_EVENT = "pim-onboarding-completed";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(COMPLETED_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(COMPLETED_EVENT, callback);
  };
}

function getSnapshot(): string | null {
  try {
    return localStorage.getItem("prep_onboarding_completed");
  } catch {
    return null;
  }
}

function getServerSnapshot(): string | null {
  return null;
}

export function DashboardView() {
  const searchParams = useSearchParams();
  const explicitSetup =
    searchParams.get("setup") === "true" || searchParams.get("edit") === "true";
  const explicitStep3 = searchParams.get("step") === "3";

  const router = useRouter();
  const storedCompleted = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  useEffect(() => {
    if (explicitStep3) {
      try {
        localStorage.setItem("prep_onboarding_completed", "true");
      } catch {}
    }
  }, [explicitStep3]);

  // The browser flag is only a shortcut. The candidate's saved profile decides:
  // a returning candidate on a new browser/device goes straight to their plan.
  const [checkedServer, setCheckedServer] = useState(false);
  useEffect(() => {
    if (explicitStep3 || explicitSetup || storedCompleted === "true") return;
    let alive = true;
    backendApi
      .getProfile()
      .then((res) => {
        if (!alive) return;
        const done = Boolean(res.activePlan) || Boolean(res.profile?.isOnboardingDone);
        if (done) {
          try {
            localStorage.setItem("prep_onboarding_completed", "true");
          } catch {}
          window.dispatchEvent(new Event(COMPLETED_EVENT));
        }
      })
      .catch(() => {})
      .finally(() => alive && setCheckedServer(true));
    return () => {
      alive = false;
    };
  }, [explicitStep3, explicitSetup, storedCompleted]);

  // If completed and not explicitly in setup mode, show Step 3 "Let's Start Preparing!"
  const isCompleted =
    (explicitStep3 || storedCompleted === "true") &&
    !explicitSetup;

  if (isCompleted) {
    return (
      <StudyRoom phase="prepare">
        <StartPreparingWorkspace onEditSetup={() => router.push("/dashboard?setup=true")} />
      </StudyRoom>
    );
  }

  // Still checking the saved profile: avoid flashing the setup form at returning candidates.
  if (!explicitSetup && !checkedServer) {
    return (
      <StudyRoom phase="setup">
        <div className="flex flex-1 items-center justify-center py-24 text-sm text-ink-muted">Loading your study room…</div>
      </StudyRoom>
    );
  }

  // Otherwise, show Step 1 "Set Up" onboarding
  return (
    <StudyRoom phase="setup">
      <OnboardingHeader />
      <OnboardingFormCard />
      <OnboardingHelpCard />
    </StudyRoom>
  );
}
