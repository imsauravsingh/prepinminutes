"use client";

import Link from "next/link";
import { ArrowRight, CodeXml, GitFork, Users } from "lucide-react";
import { InterviewResult } from "@/components/mock-interview/InterviewResult";
import type { MockInterviewHistoryItem } from "@/types/mock-interview";

interface RecentMockInterviewsProps {
  history: MockInterviewHistoryItem[];
}

export function RecentMockInterviews({ history }: RecentMockInterviewsProps) {
  const getTypeIcon = (type: MockInterviewHistoryItem["type"]) => {
    switch (type) {
      case "system-design":
        return (
          <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-[#fff0ec] text-[#ff6c47]">
            <GitFork className="size-3.5" />
          </div>
        );
      case "technical":
        return (
          <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-[#eff6ff] text-[#2563eb]">
            <CodeXml className="size-3.5" />
          </div>
        );
      case "behavioral":
      default:
        return (
          <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-[#f5efff] text-[#7c3aed]">
            <Users className="size-3.5" />
          </div>
        );
    }
  };

  return (
    <div className="flex w-full flex-col gap-4">
      {/* Header + View all action */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <h2 className="font-display text-lg sm:text-xl font-extrabold text-ink">
            Recent Mock Interviews
          </h2>
          <p className="text-xs sm:text-sm text-ink-muted">
            Track your past performance and see how you&apos;re improving.
          </p>
        </div>

        <Link
          href="/evaluation"
          className="inline-flex items-center gap-1 text-sm font-semibold text-brand hover:underline transition-all"
        >
          <span>View all</span>
          <ArrowRight className="size-4" />
        </Link>
      </div>

      {/* Table container */}
      <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] border-collapse text-left">
            <thead>
              <tr className="border-b border-line bg-[#fbf9f4] text-[11px] font-bold uppercase tracking-wider text-ink-muted">
                <th className="px-5 py-3.5">Date</th>
                <th className="px-5 py-3.5">Type</th>
                <th className="px-5 py-3.5">Role / Focus</th>
                <th className="px-5 py-3.5">Duration</th>
                <th className="px-5 py-3.5">Result</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/60">
              {history.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-[#faf8f5]/60 transition-colors"
                >
                  {/* Date */}
                  <td className="px-5 py-4 text-xs sm:text-sm text-ink-muted whitespace-nowrap">
                    {row.date}
                  </td>

                  {/* Type */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      {getTypeIcon(row.type)}
                      <span className="text-xs sm:text-sm font-semibold text-ink whitespace-nowrap">
                        {row.typeLabel}
                      </span>
                    </div>
                  </td>

                  {/* Role / Focus */}
                  <td className="px-5 py-4">
                    <div className="flex flex-col">
                      <span className="text-xs sm:text-sm font-bold text-ink">
                        {row.role}
                      </span>
                      <span className="text-xs text-ink-muted">
                        {row.focus}
                      </span>
                    </div>
                  </td>

                  {/* Duration */}
                  <td className="px-5 py-4 text-xs sm:text-sm text-ink-muted whitespace-nowrap">
                    {row.duration}
                  </td>

                  {/* Result (Circular Ring + Score) */}
                  <td className="px-5 py-4">
                    <InterviewResult score={row.score} />
                  </td>

                  {/* Action */}
                  <td className="px-5 py-4 text-right">
                    <Link
                      href={row.reportUrl}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#1e40af] hover:text-brand transition-colors whitespace-nowrap"
                    >
                      <span>View report</span>
                      <ArrowRight className="size-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
