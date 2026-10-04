import type { Metadata } from "next";
import { AuthGate } from "@/components/dashboard/AuthGate";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { ChooseTopicWorkspace } from "@/components/practice/ChooseTopicWorkspace";

export const metadata: Metadata = {
  title: "Choose a Topic - Practice | PrepInMinutes",
  description:
    "Practice what matters most. Pick a topic and start practicing with AI-powered feedback.",
};

export default function ChooseTopicPage() {
  return (
    <AuthGate>
      <div className="flex flex-1 flex-col bg-[#fbf9f4] lg:flex-row lg:items-start min-h-screen">
        <Sidebar />
        <main className="flex flex-1 flex-col px-4 py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-10 min-w-0">
          <ChooseTopicWorkspace />
        </main>
      </div>
    </AuthGate>
  );
}
