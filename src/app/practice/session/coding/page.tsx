import type { Metadata } from "next";
import { AuthGate } from "@/components/dashboard/AuthGate";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { PracticeCodingWorkspace } from "@/components/practice/PracticeCodingWorkspace";

export const metadata: Metadata = {
  title: "Coding Practice - Sliding Window | PrepInMinutes",
  description: "Find Maximum Sum Subarray of Size K",
};

export default function PracticeCodingPage() {
  return (
    <AuthGate>
      <div className="flex flex-1 flex-col bg-[#fbf9f4] lg:flex-row lg:items-stretch min-h-screen">
        <Sidebar />
        <main className="flex flex-1 flex-col min-h-screen min-w-0 bg-[#fbf9f4]">
          <PracticeCodingWorkspace />
        </main>
      </div>
    </AuthGate>
  );
}
