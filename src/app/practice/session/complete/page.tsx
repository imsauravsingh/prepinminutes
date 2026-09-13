import type { Metadata } from "next";
import { AuthGate } from "@/components/dashboard/AuthGate";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { SessionComplete } from "@/components/practice/SessionComplete";

export const metadata: Metadata = {
  title: "Today's Practice Complete | PrepInMinutes",
  description:
    "Review your completed daily practice session and readiness score update",
};

export default function SessionCompletePage() {
  return (
    <AuthGate>
      <div className="flex flex-1 flex-col bg-[#fbf9f4] lg:flex-row lg:items-stretch min-h-screen lg:min-h-[1120px]">
        <Sidebar />
        <main className="flex flex-1 flex-col px-4 py-6 sm:px-8 sm:py-8 lg:px-12 lg:pt-16 lg:pb-10 min-h-screen lg:min-h-[1120px]">
          <SessionComplete />
        </main>
      </div>
    </AuthGate>
  );
}
