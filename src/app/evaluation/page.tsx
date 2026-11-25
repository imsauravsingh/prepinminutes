import type { Metadata } from "next";
import { AuthGate } from "@/components/dashboard/AuthGate";
import { StudyRoom } from "@/components/dashboard/room/StudyRoom";
import { EvaluationWorkspace } from "@/components/evaluation/EvaluationWorkspace";

export const metadata: Metadata = {
  title: "Evaluation - Track Readiness & Progress | PrepInMinutes",
  description:
    "See how your interview readiness is improving, understand your strengths and gaps, and get personalized next steps.",
};

export default function EvaluationPage() {
  return (
    <AuthGate>
      <StudyRoom phase="prepare">
        <EvaluationWorkspace />
      </StudyRoom>
    </AuthGate>
  );
}
