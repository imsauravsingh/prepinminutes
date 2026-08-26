import { AuthGate } from "@/components/dashboard/AuthGate";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { WelcomeBanner } from "@/components/dashboard/WelcomeBanner";
import { GoalCard } from "@/components/dashboard/GoalCard";
import { ProfileSetup } from "@/components/dashboard/ProfileSetup";
import { JourneyOverview } from "@/components/dashboard/JourneyOverview";

export default function DashboardPage() {
  return (
    <AuthGate>
      <div className="flex flex-1 flex-col bg-[#fbf9f4] lg:flex-row lg:items-start">
        <Sidebar />
        <main className="flex flex-1 flex-col gap-6 px-4 py-6 sm:gap-8 sm:px-8 sm:py-8 lg:px-12 lg:py-10">
          <WelcomeBanner />
          <GoalCard />
          <ProfileSetup />
          <JourneyOverview />
        </main>
      </div>
    </AuthGate>
  );
}
