"use client";

import { useState, useEffect } from "react";
import { RevisionHeader } from "@/components/revision/RevisionHeader";
import { KnowledgeHealthCard } from "@/components/revision/KnowledgeHealthCard";
import { TodayRevisionCards } from "@/components/revision/TodayRevisionCards";
import { RevisionQueueTable } from "@/components/revision/RevisionQueueTable";
import { RevisionByArea } from "@/components/revision/RevisionByArea";
import { WhyTheseTopicsCard } from "@/components/revision/WhyTheseTopicsCard";
import { UpcomingScheduleCard } from "@/components/revision/UpcomingScheduleCard";
import { RecentlyReinforcedCard } from "@/components/revision/RecentlyReinforcedCard";
import { RecallDrillModal } from "@/components/revision/RecallDrillModal";
import { backendApi, RevisionItemsResponse } from "@/lib/api-client";

export function RevisionWorkspace() {
  const [isDrillOpen, setIsDrillOpen] = useState(false);
  const [selectedTopicId, setSelectedTopicId] = useState<string | undefined>();
  const [revisionData, setRevisionData] = useState<RevisionItemsResponse | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    backendApi
      .getRevisionItems({ dueOnly: false })
      .then((res) => {
        if (res.success) {
          setRevisionData(res);
        }
      })
      .catch((err) => {
        console.warn("Could not fetch live revision items in workspace:", err);
      });
  }, [refreshKey]);

  const handleStartDrill = (topicId?: string) => {
    setSelectedTopicId(topicId);
    setIsDrillOpen(true);
  };

  const handleDrillComplete = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const dueCount = revisionData?.totalDue ?? revisionData?.stats?.totalDue ?? 4;

  return (
    <div className="flex w-full flex-col gap-6 sm:gap-7 max-w-[1400px] mx-auto pb-16">
      {/* 1. Header with Eyebrow, Title, Subtitle, and Rapid Drill Trigger CTA */}
      <RevisionHeader
        onStartDrill={() => handleStartDrill()}
        dueCount={dueCount}
      />

      {/* 2. Top Card: Knowledge Health with 4 Stat Boxes & Circular Gauge */}
      <KnowledgeHealthCard
        onStartDrill={() => handleStartDrill()}
        stats={revisionData?.stats}
      />

      {/* 3. Section: What should you revise today? (4 Focus Cards) */}
      <TodayRevisionCards
        onStartDrill={handleStartDrill}
        items={revisionData?.items}
      />

      {/* 4. Lower Two-Column Grid: Left (Queue Table + Area Cards) & Right (Why + Upcoming + Recently) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 w-full items-start">
        {/* Left Column (7 cols): Queue Table + Revision By Area */}
        <div className="lg:col-span-7 flex flex-col gap-6 w-full">
          <RevisionQueueTable
            onStartDrill={handleStartDrill}
            items={revisionData?.items}
          />
          <RevisionByArea />
        </div>

        {/* Right Column (5 cols): Why These Topics + Upcoming Schedule + Recently Reinforced */}
        <div className="lg:col-span-5 flex flex-col gap-6 w-full">
          <WhyTheseTopicsCard />
          <UpcomingScheduleCard />
          <RecentlyReinforcedCard />
        </div>
      </div>

      {/* 5. Interactive Rapid Recall Flashcard Modal */}
      <RecallDrillModal
        isOpen={isDrillOpen}
        onClose={() => setIsDrillOpen(false)}
        onDrillComplete={handleDrillComplete}
        initialRevisionItemId={selectedTopicId}
        initialTopicSlug={selectedTopicId}
      />
    </div>
  );
}
