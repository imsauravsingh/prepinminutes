import type { Metadata } from "next";
import { AuthGate } from "@/components/dashboard/AuthGate";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { BehavioralEvaluation } from "@/components/practice/BehavioralEvaluation";

export const metadata: Metadata = {
  title: "Behavioral Evaluation - Leadership & Conflict | PrepInMinutes",
  description: "Quick evaluation and feedback for your behavioral practice",
};

export default function RootBehaviouralEvaluationPage() {
  return (
    <AuthGate>
      <div className="flex flex-1 flex-col bg-[#fbf9f4] lg:flex-row lg:items-stretch min-h-screen">
        <Sidebar />
        <main className="flex flex-1 flex-col px-4 py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-10 min-h-screen min-w-0 bg-[#fbf9f4]">
          <BehavioralEvaluation />
        </main>
      </div>
    </AuthGate>
  );
}
