import type { Metadata } from "next";
import { AuthGate } from "@/components/dashboard/AuthGate";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { StartPreparingWorkspace } from "@/components/dashboard/StartPreparingWorkspace";

export const metadata: Metadata = {
  title: "Start Preparing | PrepInMinutes",
  description: "Start your personalized interview preparation journey",
};

export default function StartPreparingPage() {
  return (
    <AuthGate>
      <div className="flex flex-1 flex-col bg-[#fbf9f4] lg:flex-row lg:items-start min-h-screen">
        <Sidebar />
        <main className="flex flex-1 flex-col gap-8 px-4 py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-10 min-w-0">
          <StartPreparingWorkspace />
        </main>
      </div>
    </AuthGate>
  );
}
