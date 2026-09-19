import type { Metadata } from "next";
import { AuthGate } from "@/components/dashboard/AuthGate";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { PlanReadyWorkspace } from "@/components/dashboard/PlanReadyWorkspace";

export const metadata: Metadata = {
  title: "Your Preparation Plan is Ready | PrepInMinutes",
  description: "Review your personalized interview preparation plan roadmap",
};

export default function PlanReadyPage() {
  return (
    <AuthGate>
      <div className="flex flex-1 flex-col bg-[#fbf9f4] lg:flex-row lg:items-start min-h-screen">
        <Sidebar />
        <main className="flex flex-1 flex-col gap-8 px-4 py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-10 min-w-0">
          <PlanReadyWorkspace />
        </main>
      </div>
    </AuthGate>
  );
}
