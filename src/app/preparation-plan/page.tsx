import { AuthGate } from "@/components/dashboard/AuthGate";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { PlanHeader } from "@/components/preparation-plan/PlanHeader";
import { NextBestAction } from "@/components/preparation-plan/NextBestAction";
import { PreparationProgress } from "@/components/preparation-plan/PreparationProgress";
import { PreparationTimeline } from "@/components/preparation-plan/PreparationTimeline";
import { ReadinessByArea } from "@/components/preparation-plan/ReadinessByArea";
import { TopicsToCover } from "@/components/preparation-plan/TopicsToCover";
import { PlanUpdatedCallout } from "@/components/preparation-plan/PlanUpdatedCallout";

export default function PreparationPlanPage() {
  return (
    <AuthGate>
      <div className="flex flex-1 flex-col bg-[#fbf9f4] lg:flex-row lg:items-start min-h-screen">
        <Sidebar />
        <main className="flex flex-1 flex-col gap-8 px-4 py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-10">
          <PlanHeader />
          <NextBestAction />
          <PreparationProgress />
          <PreparationTimeline />
          <ReadinessByArea />
          <TopicsToCover />
          <PlanUpdatedCallout />
        </main>
      </div>
    </AuthGate>
  );
}
