import type { Metadata } from "next";
import { AuthGate } from "@/components/dashboard/AuthGate";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { BehavioralWorkspace } from "@/components/practice/BehavioralWorkspace";

export const metadata: Metadata = {
  title: "Behavioral Practice - Leadership & Conflict | PrepInMinutes",
  description: "Behavioral interview practice using the STAR method",
};

export default function PracticeBehavioralPage() {
  return (
    <AuthGate>
      <div className="flex flex-1 flex-col bg-[#fbf9f4] lg:flex-row lg:items-stretch min-h-screen">
        <Sidebar />
        <main className="flex flex-1 flex-col min-h-screen min-w-0 bg-[#fbf9f4]">
          <BehavioralWorkspace />
        </main>
      </div>
    </AuthGate>
  );
}
