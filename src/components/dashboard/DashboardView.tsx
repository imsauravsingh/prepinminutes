"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useSearchParams } from "next/navigation";
import { OnboardingHeader } from "@/components/dashboard/OnboardingHeader";
import { OnboardingFormCard } from "@/components/dashboard/OnboardingFormCard";
import { OnboardingHelpCard } from "@/components/dashboard/OnboardingHelpCard";
import { StartPreparingWorkspace } from "@/components/dashboard/StartPreparingWorkspace";

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

  const [manualSetupMode, setManualSetupMode] = useState(false);
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
    !explicitSetup &&
    !manualSetupMode;

  if (isCompleted) {
    return (
      <main className="flex flex-1 flex-col gap-8 px-4 py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-10 min-w-0">
        <StartPreparingWorkspace onEditSetup={() => setManualSetupMode(true)} />
      </main>
    );
  }

  // Otherwise, show Step 1 "Set Up" onboarding
  return (
    <main className="flex flex-1 flex-col gap-7 px-4 py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-9 min-w-0">
      <OnboardingHeader />
      <OnboardingFormCard />
      <OnboardingHelpCard />
    </main>
  );
}
