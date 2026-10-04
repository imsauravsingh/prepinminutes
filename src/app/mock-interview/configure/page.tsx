import type { Metadata } from "next";
import { AuthGate } from "@/components/dashboard/AuthGate";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { MockInterviewConfigureWorkspace } from "@/components/mock-interview/configure/MockInterviewConfigureWorkspace";

export const metadata: Metadata = {
  title: "Configure Mock Interview | PrepInMinutes",
  description:
    "Customize your mock interview preferences including interview type, target role, difficulty, duration, and focus areas.",
};

export default function ConfigureMockInterviewPage() {
  return (
    <AuthGate>
      <div className="flex flex-1 flex-col bg-[#faf8f5] lg:flex-row lg:items-start min-h-screen">
        <Sidebar />
        <main className="flex flex-1 flex-col px-4 py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-10 min-w-0">
          <MockInterviewConfigureWorkspace />
        </main>
      </div>
    </AuthGate>
  );
}
