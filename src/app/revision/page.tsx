import type { Metadata } from "next";
import { AuthGate } from "@/components/dashboard/AuthGate";
import { StudyRoom } from "@/components/dashboard/room/StudyRoom";
import { RevisionWorkspace } from "@/components/revision/RevisionWorkspace";

export const metadata: Metadata = {
  title: "Revision - Spaced Practice & Topic Reinforcement | PrepInMinutes",
  description:
    "Revisit topics that need reinforcement before your interview with intelligent spaced repetition, knowledge health tracking, and priority queues.",
};

export default function RevisionPage() {
  return (
    <AuthGate>
      <StudyRoom phase="prepare">
        <RevisionWorkspace />
      </StudyRoom>
    </AuthGate>
  );
}
