import { AuthGate } from "@/components/dashboard/AuthGate";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { PreparationPlanWorkspace } from "@/components/preparation-plan/PreparationPlanWorkspace";

export default function PreparationPlanPage() {
  return (
    <AuthGate>
      <div className="flex flex-1 flex-col bg-[#faf8f5] lg:flex-row lg:items-start min-h-screen">
        <Sidebar />
        <PreparationPlanWorkspace />
      </div>
    </AuthGate>
  );
}
