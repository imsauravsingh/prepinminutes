import type { Metadata } from "next";
import { AuthGate } from "@/components/dashboard/AuthGate";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { CodingEvaluation } from "@/components/practice/CodingEvaluation";

export const metadata: Metadata = {
  title: "Coding Evaluation - Sliding Window | PrepInMinutes",
  description: "Quick evaluation and feedback for your coding practice",
};

export default function CodingEvaluationPage() {
  return (
    <AuthGate>
      <div className="flex flex-1 flex-col bg-[#fbf9f4] lg:flex-row lg:items-stretch min-h-screen lg:min-h-[1120px]">
        <Sidebar />
        <main className="flex flex-1 flex-col px-4 py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-10 min-h-screen lg:min-h-[1120px]">
          <CodingEvaluation />
        </main>
      </div>
    </AuthGate>
  );
}
