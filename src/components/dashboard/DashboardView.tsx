"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { OnboardingHeader } from "@/components/dashboard/OnboardingHeader";
import { OnboardingFormCard } from "@/components/dashboard/OnboardingFormCard";
import { OnboardingHelpCard } from "@/components/dashboard/OnboardingHelpCard";
import { StartPreparingWorkspace } from "@/components/dashboard/StartPreparingWorkspace";
import { StudyRoom } from "@/components/dashboard/room/StudyRoom";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
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

  // Otherwise, show Step 1 "Set Up" onboarding
  return (
    <StudyRoom phase="setup">
      <OnboardingHeader />
      <OnboardingFormCard />
      <OnboardingHelpCard />
    </StudyRoom>
  );
}
