import type { Metadata } from "next";
import { AuthGate } from "@/components/dashboard/AuthGate";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { OnboardingHeader } from "@/components/dashboard/OnboardingHeader";
import { OnboardingFormCard } from "@/components/dashboard/OnboardingFormCard";
import { OnboardingHelpCard } from "@/components/dashboard/OnboardingHelpCard";

export const metadata: Metadata = {
  title: "Dashboard | PrepInMinutes",
  description: "Set up your personalized interview preparation plan",
};

export default function DashboardPage() {
  return (
    <AuthGate>
      <div className="flex flex-1 flex-col bg-[#fbf9f4] lg:flex-row lg:items-start min-h-screen">
        <Sidebar />
        <main className="flex flex-1 flex-col gap-7 px-4 py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-9 min-w-0">
          <OnboardingHeader />
          <OnboardingFormCard />
          <OnboardingHelpCard />
        </main>
      </div>
    </AuthGate>
  );
}
