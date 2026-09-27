"use client";

import { MockInterviewHeader } from "@/components/mock-interview/MockInterviewHeader";
import { RecommendedMockCard } from "@/components/mock-interview/RecommendedMockCard";
import { InterviewTypeSection } from "@/components/mock-interview/InterviewTypeSection";
import { RecentMockInterviews } from "@/components/mock-interview/RecentMockInterviews";
import {
  defaultRecommendedMock,
  defaultInterviewTypes,
  defaultMockInterviewHistory,
} from "@/data/mock-interview";

export function MockInterviewWorkspace() {
  return (
    <div className="flex w-full flex-col gap-8 max-w-[1400px] mx-auto pb-16">
      {/* 1. Header with purple mic icon, title, and subtitle */}
      <MockInterviewHeader />

      {/* 2. Top Hero: Recommended Mock Card */}
      <RecommendedMockCard mock={defaultRecommendedMock} />

      {/* 3. Choose Another Interview: 5 Cards Grid */}
      <InterviewTypeSection types={defaultInterviewTypes} />

      {/* 4. Recent Mock Interviews Table */}
      <RecentMockInterviews history={defaultMockInterviewHistory} />
    </div>
  );
}
