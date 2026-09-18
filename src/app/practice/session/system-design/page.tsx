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
      <div className="flex flex-1 flex-col bg-[#fbf9f4] lg:flex-row lg:items-stretch min-h-screen">
        <Sidebar />
        <main className="flex flex-1 flex-col min-h-screen min-w-0 bg-[#fbf9f4]">
          <SystemDesignWorkspace />
        </main>
      </div>
    </AuthGate>
  );
}
