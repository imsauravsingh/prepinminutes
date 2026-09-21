import type { Metadata } from "next";
import { AuthGate } from "@/components/dashboard/AuthGate";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { SystemDesignWorkspace } from "@/components/practice/SystemDesignWorkspace";

export const metadata: Metadata = {
  title: "Cloud Infrastructure Practice | PrepInMinutes",
  description:
    "Live AI Interview for Cloud Architecture, Scalability and DevOps",
};

export default function PracticeCloudPage() {
  return (
    <AuthGate>
      <div className="flex flex-1 flex-col bg-[#fbf9f4] lg:flex-row lg:items-stretch min-h-screen">
        <Sidebar />
        <main className="flex flex-1 flex-col min-h-screen min-w-0 bg-[#fbf9f4]">
          <SystemDesignWorkspace />
        </main>
      </div>
    </AuthGate>
  );
}
