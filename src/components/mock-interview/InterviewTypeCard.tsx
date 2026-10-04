"use client";

import React from "react";
import { Clock, ArrowRight } from "lucide-react";
import type { InterviewType } from "@/types/mock-interview";

export interface InterviewTypeCardProps {
  type: InterviewType;
  title: string;
  description: string;
  duration: string;
  icon: React.ReactNode;
  onClick: () => void;
}

export function InterviewTypeCard({
  title,
  description,
  duration,
  icon,
  onClick,
}: InterviewTypeCardProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className="group relative flex flex-col justify-between rounded-2xl border border-line bg-white p-5 shadow-2xs hover:shadow-md hover:border-line-strong transition-all duration-200 cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-brand/40 min-h-[190px]"
    >
      {/* Top Details */}
      <div className="flex flex-col items-start">
        {/* Icon Pill */}
        <div className="mb-3.5 flex items-center justify-center">{icon}</div>

        {/* Title & Description */}
        <h3 className="font-display text-base font-bold text-ink group-hover:text-brand transition-colors">
          {title}
        </h3>
        <p className="mt-1 text-xs text-ink-muted leading-relaxed line-clamp-3">
          {description}
        </p>
      </div>

      {/* Footer: Duration + Arrow */}
      <div className="mt-4 flex items-center justify-between border-t border-line/50 pt-3 text-xs text-ink-muted">
        <div className="flex items-center gap-1.5 font-medium">
          <Clock className="size-3.5 text-ink-muted" />
          <span>{duration}</span>
        </div>
        <ArrowRight className="size-4 text-[#2563eb] transition-transform duration-200 group-hover:translate-x-1 group-hover:text-brand" />
      </div>
    </div>
  );
}
