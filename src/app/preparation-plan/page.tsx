import { AuthGate } from "@/components/dashboard/AuthGate";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { PlanOverviewWorkspace } from "@/components/preparation-plan/PlanOverviewWorkspace";

export default function PreparationPlanPage() {
  return (
    <AuthGate>
      <div className="flex flex-1 flex-col bg-[#faf8f5] lg:flex-row lg:items-start min-h-screen">
        <Sidebar />
        <main className="flex flex-1 flex-col px-4 py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-10 min-w-0 w-full">
          <PlanOverviewWorkspace />
        </main>
      </div>
    </AuthGate>
  );
}
