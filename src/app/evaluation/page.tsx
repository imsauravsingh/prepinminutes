import type { Metadata } from "next";
import { AuthGate } from "@/components/dashboard/AuthGate";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { EvaluationWorkspace } from "@/components/evaluation/EvaluationWorkspace";

export const metadata: Metadata = {
  title: "Evaluation - Track Readiness & Progress | PrepInMinutes",
  description:
    "See how your interview readiness is improving, understand your strengths and gaps, and get personalized next steps.",
};

export default function EvaluationPage() {
  return (
    <AuthGate>
      <div className="flex flex-1 flex-col bg-[#faf8f5] lg:flex-row lg:items-start min-h-screen">
        <Sidebar />
        <main className="flex flex-1 flex-col px-4 py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-10 min-w-0">
          <EvaluationWorkspace />
        </main>
      </div>
    </AuthGate>
  );
}
