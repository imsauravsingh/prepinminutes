"use client";

import React, { useEffect, useRef } from "react";
import { Code2, ArrowRight } from "lucide-react";

interface SynchronizedCodeViewerProps {
  code: string;
  activeLine?: number;
  language?: string;
  className?: string;
}

export function SynchronizedCodeViewer({
  code,
  activeLine,
  language = "javascript",
  className = "",
}: SynchronizedCodeViewerProps) {
  const lineRefs = useRef<{ [lineNum: number]: HTMLDivElement | null }>({});
  const containerRef = useRef<HTMLDivElement>(null);

  const lines = code.split("\n");

  // Smoothly scroll active line into view
  useEffect(() => {
    if (activeLine && lineRefs.current[activeLine]) {
      const activeEl = lineRefs.current[activeLine];
      if (activeEl && containerRef.current) {
        const container = containerRef.current;
        const offsetTop = activeEl.offsetTop - container.offsetTop;
        const targetScroll =
          offsetTop - container.clientHeight / 2 + activeEl.clientHeight / 2;
        container.scrollTo({
          top: Math.max(0, targetScroll),
          behavior: "smooth",
        });
      }
    }
  }, [activeLine]);

  return (
    <div
      className={`flex flex-col overflow-hidden rounded-2xl bg-[#141211] border border-[#2b2723] shadow-md ${className}`}
    >
      {/* Code Viewer Header */}
      <div className="flex items-center justify-between border-b border-[#26221f] bg-[#1a1816] px-4 py-2.5">
        <div className="flex items-center gap-2">
          <Code2 className="size-4 text-brand" />
          <span className="text-xs font-semibold text-[#ded8cc]">
            Synchronized Code Execution
          </span>
        </div>
        <span className="rounded-md bg-[#25211e] px-2 py-0.5 font-mono text-[11px] text-[#a09787]">
          {language}
        </span>
      </div>

      {/* Code Lines Container */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto overflow-x-auto p-2 font-mono text-xs leading-6"
      >
        {lines.map((lineText, idx) => {
          const lineNum = idx + 1;
          const isActive = lineNum === activeLine;

          return (
            <div
              key={lineNum}
              ref={(el) => {
                lineRefs.current[lineNum] = el;
              }}
              className={`flex items-center rounded-lg px-2.5 py-0.5 transition-all duration-200 ${
                isActive
                  ? "bg-brand/20 border-l-4 border-brand text-white font-medium shadow-xs"
                  : "text-[#c2bab0] hover:bg-white/5"
              }`}
            >
              {/* Line Number */}
              <span
                className={`w-7 shrink-0 text-right pr-3 select-none text-[11px] ${
                  isActive ? "font-bold text-brand" : "text-[#696156]"
                }`}
              >
                {lineNum}
              </span>

              {/* Active Arrow indicator */}
              <div className="w-4 shrink-0 flex items-center justify-center">
                {isActive && (
                  <ArrowRight className="size-3 text-brand animate-pulse" />
                )}
              </div>

              {/* Code Line Content */}
              <span className="flex-1 whitespace-pre pl-1">
                {lineText || " "}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
