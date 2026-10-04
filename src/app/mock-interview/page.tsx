import type { Metadata } from "next";
import { AuthGate } from "@/components/dashboard/AuthGate";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { MockInterviewWorkspace } from "@/components/mock-interview/MockInterviewWorkspace";

export const metadata: Metadata = {
  title: "Mock Interview - AI Interview Simulator | PrepInMinutes",
  description:
    "Simulate a real interview with AI and see how you perform under interview conditions with adaptive follow-ups and personalized evaluation.",
};

export default function MockInterviewPage() {
  return (
    <AuthGate>
      <div className="flex flex-1 flex-col bg-[#faf8f5] lg:flex-row lg:items-start min-h-screen">
        <Sidebar />
        <main className="flex flex-1 flex-col px-4 py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-10 min-w-0">
          <MockInterviewWorkspace />
        </main>
      </div>
    </AuthGate>
  );
}
