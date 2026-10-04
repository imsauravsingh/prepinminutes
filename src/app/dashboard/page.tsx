import { Suspense } from "react";
import type { Metadata } from "next";
import { AuthGate } from "@/components/dashboard/AuthGate";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { DashboardView } from "@/components/dashboard/DashboardView";

export const metadata: Metadata = {
  title: "Dashboard | PrepInMinutes",
  description: "Set up and manage your personalized interview preparation plan",
};

export default function DashboardPage() {
  return (
    <AuthGate>
      <div className="flex flex-1 flex-col bg-[#fbf9f4] lg:flex-row lg:items-start min-h-screen">
        <Sidebar />
        <Suspense
          fallback={
            <main className="flex flex-1 flex-col gap-8 px-4 py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-10 min-w-0">
              <div className="h-24 w-full animate-pulse rounded-2xl bg-cream" />
            </main>
          }
        >
          <DashboardView />
        </Suspense>
      </div>
    </AuthGate>
  );
}
