import type { Metadata } from "next";
import { AuthGate } from "@/components/dashboard/AuthGate";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { AiAssessmentSessionWorkspace } from "@/components/dashboard/AiAssessmentSessionWorkspace";
import { NextStepGuard } from "@/components/dashboard/NextStepGuard";

export const metadata: Metadata = {
  title: "AI Assessment Session | PrepInMinutes",
  description:
    "Live AI Diagnostic Assessment with Sarah • Staff Engineer. Calibrate your readiness score and generate your personalized knowledge graph preparation plan.",
};

export default function AiAssessmentSessionPage() {
  return (
    <AuthGate>
      <div className="flex flex-1 flex-col bg-[#fbf9f4] lg:flex-row lg:items-stretch min-h-screen">
        <Sidebar />
        <main className="flex flex-1 flex-col min-h-screen min-w-0 bg-[#fbf9f4]">
          <NextStepGuard>
            <AiAssessmentSessionWorkspace />
          </NextStepGuard>
        </main>
      </div>
    </AuthGate>
  );
}

