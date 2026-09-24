"use client";

import { EvaluationHeader } from "@/components/evaluation/EvaluationHeader";
import { EvaluationProgressChart } from "@/components/evaluation/EvaluationProgressChart";
import { InterviewReadinessCard } from "@/components/evaluation/InterviewReadinessCard";
import { ThisWeekActivity } from "@/components/evaluation/ThisWeekActivity";
import { PerformanceByArea } from "@/components/evaluation/PerformanceByArea";
import { WeeklyProgressTable } from "@/components/evaluation/WeeklyProgressTable";
import { RecentEvaluationsList } from "@/components/evaluation/RecentEvaluationsList";
import { EvaluationInsights } from "@/components/evaluation/EvaluationInsights";

export function EvaluationWorkspace() {
  return (
    <div className="flex w-full flex-col gap-6 sm:gap-7 max-w-[1400px] mx-auto pb-16">
      {/* 1. Header with Eyebrow, Title, Subtitle, Utility links, and Candidate Meta bar */}
      <EvaluationHeader />

      {/* 2. Top Hero: Evaluation Progress Line/Area Chart + Interview Readiness Circular Gauge */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 w-full items-stretch">
        <div className="lg:col-span-8 flex flex-col">
          <EvaluationProgressChart />
        </div>
        <div className="lg:col-span-4 flex flex-col">
          <InterviewReadinessCard percentage={68} growth="+8%" />
        </div>
      </div>

      {/* 3. This Week's Activity Metric Cards */}
      <ThisWeekActivity />

      {/* 4. Performance by Area Domain Cards */}
      <PerformanceByArea />

      {/* 5. Weekly Progress Table + Recent Evaluations Activity List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 w-full items-stretch">
        <div className="lg:col-span-8 flex flex-col">
          <WeeklyProgressTable />
        </div>
        <div className="lg:col-span-4 flex flex-col">
          <RecentEvaluationsList />
        </div>
      </div>

      {/* 6. Evaluation Insights: Your Strengths + Interview Performance + Your Focus */}
      <EvaluationInsights />
    </div>
  );
}
