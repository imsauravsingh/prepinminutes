import type { Metadata } from "next";
import { AuthGate } from "@/components/dashboard/AuthGate";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { SystemDesignEvaluation } from "@/components/practice/SystemDesignEvaluation";

export const metadata: Metadata = {
  title: "System Design Evaluation - Load Balancing | PrepInMinutes",
  description: "Quick evaluation and feedback for your system design practice",
};

export default function SessionSystemDesignEvaluationPage() {
  return (
    <AuthGate>
      <div className="flex flex-1 flex-col bg-[#fbf9f4] lg:flex-row lg:items-stretch min-h-screen">
        <Sidebar />
        <main className="flex flex-1 flex-col px-4 py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-10 min-h-screen">
          <SystemDesignEvaluation />
        </main>
      </div>
    </AuthGate>
  );
}
