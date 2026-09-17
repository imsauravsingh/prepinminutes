import type { Metadata } from "next";
import { AuthGate } from "@/components/dashboard/AuthGate";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { SystemDesignWorkspace } from "@/components/practice/SystemDesignWorkspace";

export const metadata: Metadata = {
  title: "System Design Practice - URL Shortener | PrepInMinutes",
  description: "Live AI Interview for System Design - URL Shortener",
};

export default function PracticeSystemDesignPage() {
  return (
    <AuthGate>
      <div className="flex flex-1 flex-col bg-white lg:flex-row lg:items-stretch min-h-screen">
        <Sidebar />
        <main className="flex flex-1 flex-col px-4 py-6 sm:px-8 sm:py-8 lg:px-12 lg:pt-8 lg:pb-12 min-h-screen bg-white">
          <SystemDesignWorkspace />
        </main>
      </div>
    </AuthGate>
  );
}
