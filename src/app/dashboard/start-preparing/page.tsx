import type { Metadata } from "next";
import { AuthGate } from "@/components/dashboard/AuthGate";
import { StudyRoom } from "@/components/dashboard/room/StudyRoom";
import { StartPreparingWorkspace } from "@/components/dashboard/StartPreparingWorkspace";

export const metadata: Metadata = {
  title: "Start Preparing | PrepInMinutes",
  description: "Start your personalized interview preparation journey",
};

export default function StartPreparingPage() {
  return (
    <AuthGate>
      <StudyRoom phase="prepare">
        <StartPreparingWorkspace />
      </StudyRoom>
    </AuthGate>
  );
}
