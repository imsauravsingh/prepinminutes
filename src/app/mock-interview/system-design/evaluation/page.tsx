import type { Metadata } from "next";
import { AuthGate } from "@/components/dashboard/AuthGate";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { MockSystemDesignEvaluationWorkspace } from "@/components/mock-interview/evaluation/MockSystemDesignEvaluationWorkspace";

export const metadata: Metadata = {
  title: "Mock Interview Evaluation - System Design | PrepInMinutes",
  description:
    "Comprehensive evaluation and feedback report for your System Design Mock Interview (URL Shortener) for Senior Software Engineer.",
};

export default function MockSystemDesignEvaluationPage() {
  return (
    <AuthGate>
      <div className="flex flex-1 flex-col bg-[#fbf9f4] lg:flex-row lg:items-start min-h-screen">
        <Sidebar />
        <main className="flex flex-1 flex-col px-4 py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-10 min-w-0 bg-[#fbf9f4]">
          <MockSystemDesignEvaluationWorkspace />
        </main>
      </div>
    </AuthGate>
  );
}
