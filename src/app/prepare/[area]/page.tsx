import type { Metadata } from "next";
import { AuthGate } from "@/components/dashboard/AuthGate";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { AreaDetailWorkspace } from "@/components/prepare/AreaDetailWorkspace";

export const metadata: Metadata = {
  title: "Your topics | PrepInMinutes",
  description: "Every topic in this preparation area, with your progress and what to do next.",
};

export default async function PrepareAreaPage({ params }: { params: Promise<{ area: string }> }) {
  const { area } = await params;
  return (
    <AuthGate>
      <div className="flex flex-1 flex-col bg-[#fbf9f4] lg:flex-row lg:items-start min-h-screen">
        <Sidebar />
        <main className="flex flex-1 flex-col px-4 py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-10 min-w-0">
          <AreaDetailWorkspace slug={area} />
        </main>
      </div>
    </AuthGate>
  );
}
