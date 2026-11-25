import { AuthGate } from "@/components/dashboard/AuthGate";
import { StudyRoom } from "@/components/dashboard/room/StudyRoom";
import { PlanOverviewWorkspace } from "@/components/preparation-plan/PlanOverviewWorkspace";

/** My Plan uses the same header as My Focus: the sticky glass dock with the main menu. */
export default function PreparationPlanPage() {
  return (
    <AuthGate>
      <StudyRoom phase="prepare">
        <PlanOverviewWorkspace />
      </StudyRoom>
    </AuthGate>
  );
}
