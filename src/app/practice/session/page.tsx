import type { Metadata } from "next";
import { AuthGate } from "@/components/dashboard/AuthGate";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { SessionIntro } from "@/components/practice/SessionIntro";

export const metadata: Metadata = {
  title: "Today's Practice Session | PrepInMinutes",
  description: "Personalized practice session based on your preparation plan",
};

export default function PracticeSessionPage() {
  return (
    <AuthGate>
      <div className="flex flex-1 flex-col bg-[#fbf9f4] lg:flex-row lg:items-start min-h-screen">
        <Sidebar />
        <main className="flex flex-1 flex-col px-4 py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-10 min-h-screen">
          <SessionIntro />
        </main>
      </div>
    </AuthGate>
  );
}
