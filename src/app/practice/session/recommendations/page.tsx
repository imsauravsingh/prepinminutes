import type { Metadata } from "next";
import { AuthGate } from "@/components/dashboard/AuthGate";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { SessionNextRecommendation } from "@/components/practice/SessionNextRecommendation";

export const metadata: Metadata = {
  title: "What's Next - Practice Recommendations | PrepInMinutes",
  description:
    "AI-driven next practice recommendations based on today's session results",
};

export default function SessionRecommendationsPage() {
  return (
    <AuthGate>
      <div className="flex flex-1 flex-col bg-[#fbf9f4] lg:flex-row lg:items-stretch min-h-screen">
        <Sidebar />
        <main className="flex flex-1 flex-col px-4 py-6 sm:px-8 sm:py-8 lg:px-12 lg:pt-10 lg:pb-10 min-h-screen">
          <SessionNextRecommendation />
        </main>
      </div>
    </AuthGate>
  );
}
