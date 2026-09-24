"use client";

import { RevisionHeader } from "@/components/revision/RevisionHeader";
import { KnowledgeHealthCard } from "@/components/revision/KnowledgeHealthCard";
import { TodayRevisionCards } from "@/components/revision/TodayRevisionCards";
import { RevisionQueueTable } from "@/components/revision/RevisionQueueTable";
import { RevisionByArea } from "@/components/revision/RevisionByArea";
import { WhyTheseTopicsCard } from "@/components/revision/WhyTheseTopicsCard";
import { UpcomingScheduleCard } from "@/components/revision/UpcomingScheduleCard";
import { RecentlyReinforcedCard } from "@/components/revision/RecentlyReinforcedCard";

export function RevisionWorkspace() {
  return (
    <div className="flex w-full flex-col gap-6 sm:gap-7 max-w-[1400px] mx-auto pb-16">
      {/* 1. Header with Eyebrow, Title, Subtitle, Help, Avatar, and Candidate Meta bar */}
      <RevisionHeader />

      {/* 2. Top Card: Knowledge Health with 4 Stat Boxes & Circular Gauge */}
      <KnowledgeHealthCard />

      {/* 3. Section: What should you revise today? (4 Focus Cards) */}
      <TodayRevisionCards />

      {/* 4. Lower Two-Column Grid: Left (Queue Table + Area Cards) & Right (Why + Upcoming + Recently) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 w-full items-start">
        {/* Left Column (7 cols): Queue Table + Revision By Area */}
        <div className="lg:col-span-7 flex flex-col gap-6 w-full">
          <RevisionQueueTable />
          <RevisionByArea />
        </div>

        {/* Right Column (5 cols): Why These Topics + Upcoming Schedule + Recently Reinforced */}
        <div className="lg:col-span-5 flex flex-col gap-6 w-full">
          <WhyTheseTopicsCard />
          <UpcomingScheduleCard />
          <RecentlyReinforcedCard />
        </div>
      </div>
    </div>
  );
}
