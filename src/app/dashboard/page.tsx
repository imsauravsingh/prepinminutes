import { Suspense } from "react";
import type { Metadata } from "next";
import { AuthGate } from "@/components/dashboard/AuthGate";
import { DashboardView } from "@/components/dashboard/DashboardView";

export const metadata: Metadata = {
  title: "Dashboard | PrepInMinutes",
  description: "Set up and manage your personalized interview preparation plan",
};

export default function DashboardPage() {
  return (
    <AuthGate>
      {/* The dashboard is the candidate's study room: no sidebar, menus live in a floating dock. */}
      <Suspense
        fallback={
          <main className="flex min-h-screen flex-1 flex-col gap-8 bg-[#fbf9f4] px-4 py-6 sm:px-8">
            <div className="h-24 w-full animate-pulse rounded-2xl bg-cream" />
          </main>
        }
      >
        <DashboardView />
      </Suspense>
    </AuthGate>
  );
}
