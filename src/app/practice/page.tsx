import type { Metadata } from "next";
import { AuthGate } from "@/components/dashboard/AuthGate";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { PracticeHeader } from "@/components/practice/PracticeHeader";
import { PrimaryCtaBar } from "@/components/practice/PrimaryCtaBar";
import { RecommendedPractice } from "@/components/practice/RecommendedPractice";
import { RecentPracticeTable } from "@/components/practice/RecentPracticeTable";

export const metadata: Metadata = {
  title: "Practice | PrepInMinutes",
  description: "AI-recommended practice based on your preparation plan",
};

export default function PracticePage() {
  return (
    <AuthGate>
      <div className="flex flex-1 flex-col bg-[#fbf9f4] lg:flex-row lg:items-start min-h-screen">
        <Sidebar />
        <main className="flex flex-1 flex-col gap-8 px-4 py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-10">
          <PracticeHeader />
          <PrimaryCtaBar />
          <RecommendedPractice />
          <RecentPracticeTable />
        </main>
      </div>
    </AuthGate>
  );
}
