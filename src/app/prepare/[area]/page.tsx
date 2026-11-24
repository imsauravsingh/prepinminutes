import type { Metadata } from "next";
import { AuthGate } from "@/components/dashboard/AuthGate";
import { StudyRoom } from "@/components/dashboard/room/StudyRoom";
import { AreaDetailWorkspace } from "@/components/prepare/AreaDetailWorkspace";

export const metadata: Metadata = {
  title: "Your topics | PrepInMinutes",
  description: "Every topic in this preparation area, with your progress and what to do next.",
};

/**
 * Area page (System Design, DSA, …): the main menu sits in the top bar (as on the
 * dashboard, but not sticky) so the left column can hold this area's own navigation.
 */
export default async function PrepareAreaPage({ params }: { params: Promise<{ area: string }> }) {
  const { area } = await params;
  return (
    <AuthGate>
      <StudyRoom phase="prepare" stickyDock={false}>
        <AreaDetailWorkspace slug={area} />
      </StudyRoom>
    </AuthGate>
  );
}
