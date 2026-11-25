import type { Metadata } from "next";
import { AuthGate } from "@/components/dashboard/AuthGate";
import { StudyRoom } from "@/components/dashboard/room/StudyRoom";
import { MockInterviewWorkspace } from "@/components/mock-interview/MockInterviewWorkspace";

export const metadata: Metadata = {
  title: "Mock Interview - AI Interview Simulator | PrepInMinutes",
  description:
    "Simulate a real interview with AI and see how you perform under interview conditions with adaptive follow-ups and personalized evaluation.",
};

export default function MockInterviewPage() {
  return (
    <AuthGate>
      <StudyRoom phase="prepare">
        <MockInterviewWorkspace />
      </StudyRoom>
    </AuthGate>
  );
}
