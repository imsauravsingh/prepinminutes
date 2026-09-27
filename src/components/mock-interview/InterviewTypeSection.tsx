"use client";

import { useRouter } from "next/navigation";
import {
  CodeXml,
  GitFork,
  Users,
  FileText,
  LayoutGrid,
} from "lucide-react";
import { InterviewTypeCard } from "@/components/mock-interview/InterviewTypeCard";
import type { InterviewTypeOption } from "@/types/mock-interview";

interface InterviewTypeSectionProps {
  types: InterviewTypeOption[];
}

export function InterviewTypeSection({ types }: InterviewTypeSectionProps) {
  const router = useRouter();

  const getIcon = (type: InterviewTypeOption["type"], iconBg: string, iconColor: string) => {
    switch (type) {
      case "technical":
        return (
          <div className={`flex size-10 items-center justify-center rounded-xl ${iconBg} ${iconColor}`}>
            <CodeXml className="size-5" />
          </div>
        );
      case "system-design":
        return (
          <div className={`flex size-10 items-center justify-center rounded-xl ${iconBg} ${iconColor}`}>
            <GitFork className="size-5" />
          </div>
        );
      case "behavioral":
        return (
          <div className={`flex size-10 items-center justify-center rounded-xl ${iconBg} ${iconColor}`}>
            <Users className="size-5" />
          </div>
        );
      case "resume-based":
        return (
          <div className={`flex size-10 items-center justify-center rounded-xl ${iconBg} ${iconColor}`}>
            <FileText className="size-5" />
          </div>
        );
      case "mixed":
        return (
          <div className={`flex size-10 items-center justify-center rounded-xl ${iconBg} ${iconColor}`}>
            <LayoutGrid className="size-5" />
          </div>
        );
    }
  };

  return (
    <div className="flex w-full flex-col gap-4">
      {/* Section Header */}
      <div className="flex flex-col gap-0.5">
        <h2 className="font-display text-lg sm:text-xl font-extrabold text-ink">
          Choose Another Interview
        </h2>
        <p className="text-xs sm:text-sm text-ink-muted">
          Select a different type of interview or customize one based on your goals.
        </p>
      </div>

      {/* 5-Column Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 w-full">
        {types.map((item) => (
          <InterviewTypeCard
            key={item.type}
            type={item.type}
            title={item.title}
            description={item.description}
            duration={item.duration}
            icon={getIcon(item.type, item.iconBg, item.iconColor)}
            onClick={() => router.push(item.href)}
          />
        ))}
      </div>
    </div>
  );
}
