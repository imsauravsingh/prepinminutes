"use client";

import { useState, useEffect } from "react";
import { PlanHeader } from "@/components/preparation-plan/PlanHeader";
import { PreparationProgress } from "@/components/preparation-plan/PreparationProgress";
import { PreparationTimeline } from "@/components/preparation-plan/PreparationTimeline";
import { ReadinessByArea } from "@/components/preparation-plan/ReadinessByArea";
import { PlanUpdatedCallout } from "@/components/preparation-plan/PlanUpdatedCallout";
import { backendApi } from "@/lib/api-client";

export function PreparationPlanWorkspace() {
  const [selectedPhase, setSelectedPhase] = useState("phase-1");
  const [profile, setProfile] = useState<Record<string, any> | null>(null);
  const [activePlan, setActivePlan] = useState<Record<string, any> | null>(null);

  useEffect(() => {
    let isMounted = true;
    backendApi
      .getProfile()
      .then((res) => {
        if (!isMounted) return;
        if (res.profile) setProfile(res.profile);
        if (res.activePlan) setActivePlan(res.activePlan);
      })
      .catch((err) => console.warn("Failed to load plan profile:", err));

    return () => {
      isMounted = false;
    };
  }, []);

  const displayRole = profile?.targetRole || activePlan?.targetRole || "Senior Software Engineer";
  const targetCompanies = profile?.targetCompanies || activePlan?.targetCompanies || [];
  const displayCompany = Array.isArray(targetCompanies) && targetCompanies.length > 0 ? targetCompanies[0] : "Google";
  const displayTimeline = profile?.timelineLabel || activePlan?.timelineLabel || "1 month";
  const readinessScore = Math.round(activePlan?.readinessScore ?? 68);

  return (
    <main className="flex flex-1 flex-col gap-8 px-4 py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-10 min-w-0 w-full">
      <PlanHeader
        targetRole={displayRole}
        company={displayCompany}
        readinessScore={readinessScore}
        timelineLabel={displayTimeline}
      />
      <PreparationProgress
        completedTopics={Math.round(readinessScore / 15)}
        totalTopics={24}
        remainingDays={21}
      />
      <PreparationTimeline
        selectedPhase={selectedPhase}
        onSelectPhase={setSelectedPhase}
      />
      <ReadinessByArea selectedPhase={selectedPhase} />
      <PlanUpdatedCallout />
    </main>
  );
}
