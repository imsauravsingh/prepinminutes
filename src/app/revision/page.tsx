import type { Metadata } from "next";
import { AuthGate } from "@/components/dashboard/AuthGate";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { RevisionWorkspace } from "@/components/revision/RevisionWorkspace";

export const metadata: Metadata = {
  title: "Revision - Spaced Practice & Topic Reinforcement | PrepInMinutes",
  description:
    "Revisit topics that need reinforcement before your interview with intelligent spaced repetition, knowledge health tracking, and priority queues.",
};

export default function RevisionPage() {
  return (
    <AuthGate>
      <div className="flex flex-1 flex-col bg-[#faf8f5] lg:flex-row lg:items-start min-h-screen">
        <Sidebar />
        <main className="flex flex-1 flex-col px-4 py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-10 min-w-0">
          <RevisionWorkspace />
        </main>
      </div>
    </AuthGate>
  );
}
