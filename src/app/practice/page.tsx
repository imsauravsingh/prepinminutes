import type { Metadata } from "next";
import { AuthGate } from "@/components/dashboard/AuthGate";
import { StudyRoom } from "@/components/dashboard/room/StudyRoom";
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
      <StudyRoom phase="prepare">
        <PracticeHeader />
        <PrimaryCtaBar />
        <RecommendedPractice />
        <RecentPracticeTable />
      </StudyRoom>
    </AuthGate>
  );
}
