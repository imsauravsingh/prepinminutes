import type { Metadata } from "next";
import { AuthGate } from "@/components/dashboard/AuthGate";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { MockInterviewSessionWorkspace } from "@/components/mock-interview/session/MockInterviewSessionWorkspace";

export const metadata: Metadata = {
  title: "Live Mock Interview - System Design | PrepInMinutes",
  description:
    "Live AI Mock Interview for Senior Software Engineer - System Design URL Shortener with real-time adaptive questioning and feedback.",
};

export default function MockInterviewSessionPage() {
  return (
    <AuthGate>
      <div className="flex flex-1 flex-col bg-[#fbf9f4] lg:flex-row lg:items-stretch min-h-screen">
        <Sidebar />
        <main className="flex flex-1 flex-col min-h-screen min-w-0 bg-[#fbf9f4]">
          <MockInterviewSessionWorkspace />
        </main>
      </div>
    </AuthGate>
  );
}
