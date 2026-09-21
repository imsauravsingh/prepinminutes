"use client";

import { useState } from "react";
import { PlanHeader } from "@/components/preparation-plan/PlanHeader";
import { PreparationProgress } from "@/components/preparation-plan/PreparationProgress";
import { PreparationTimeline } from "@/components/preparation-plan/PreparationTimeline";
import { ReadinessByArea } from "@/components/preparation-plan/ReadinessByArea";
import { PlanUpdatedCallout } from "@/components/preparation-plan/PlanUpdatedCallout";

export function PreparationPlanWorkspace() {
  const [selectedPhase, setSelectedPhase] = useState("phase-1");

  return (
    <main className="flex flex-1 flex-col gap-8 px-4 py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-10 min-w-0 w-full">
      <PlanHeader />
      <PreparationProgress />
      <PreparationTimeline
        selectedPhase={selectedPhase}
        onSelectPhase={setSelectedPhase}
      />
      <ReadinessByArea selectedPhase={selectedPhase} />
      <PlanUpdatedCallout />
    </main>
  );
}
