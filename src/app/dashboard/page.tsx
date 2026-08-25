import { AuthGate } from "@/components/dashboard/AuthGate";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { WelcomeBanner } from "@/components/dashboard/WelcomeBanner";
import { GoalCard } from "@/components/dashboard/GoalCard";
import { ProfileSetup } from "@/components/dashboard/ProfileSetup";
import { JourneyOverview } from "@/components/dashboard/JourneyOverview";

export default function DashboardPage() {
  return (
    <AuthGate>
      <div className="flex flex-1 items-start bg-[#fbf9f4]">
        <Sidebar />
        <main className="flex flex-1 flex-col gap-8 px-12 py-10">
          <WelcomeBanner />
          <GoalCard />
          <ProfileSetup />
          <JourneyOverview />
        </main>
      </div>
    </AuthGate>
  );
}
