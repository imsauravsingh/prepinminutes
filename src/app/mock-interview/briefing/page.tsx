import type { Metadata } from "next";
import { AuthGate } from "@/components/dashboard/AuthGate";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { MockInterviewBriefingWorkspace } from "@/components/mock-interview/briefing/MockInterviewBriefingWorkspace";

export const metadata: Metadata = {
  title: "Mock Interview Briefing | PrepInMinutes",
  description:
    "Take a moment to understand how your mock interview will work before you start with adaptive questions and evaluation criteria.",
};

export default function MockInterviewBriefingPage() {
  return (
    <AuthGate>
      <div className="flex flex-1 flex-col bg-[#faf8f5] lg:flex-row lg:items-start min-h-screen">
        <Sidebar />
        <main className="flex flex-1 flex-col px-4 py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-10 min-w-0">
          <MockInterviewBriefingWorkspace />
        </main>
      </div>
    </AuthGate>
  );
}
