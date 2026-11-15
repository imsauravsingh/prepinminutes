"use client";

import { useState, useRef, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  BookOpen,
  Sparkles,
  CheckCircle2,
  Layers,
} from "lucide-react";
import { BaseQuestionNode, BaseTopicNode } from "@/types/curriculum";

interface PracticeQuestionSelectorProps {
  topic: BaseTopicNode | null;
  questions: BaseQuestionNode[];
  activeQuestion: BaseQuestionNode;
  activeQuestionIndex: number;
  totalQuestions: number;
  onSelectQuestion: (questionId: string) => void;
  onNextQuestion: () => void;
  onPreviousQuestion: () => void;
  domainName?: string;
}

export function PracticeQuestionSelector({
  topic,
  questions,
  activeQuestion,
  activeQuestionIndex,
  totalQuestions,
  onSelectQuestion,
  onNextQuestion,
  onPreviousQuestion,
  domainName,
}: PracticeQuestionSelectorProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/90 backdrop-blur-xs border border-line rounded-2xl p-3 sm:px-4 sm:py-2.5 shadow-2xs">
      {/* Left: Active Topic Pill + Canonical ID */}
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="flex size-7 items-center justify-center rounded-lg bg-brand/10 text-brand shrink-0">
          <BookOpen className="size-3.5" />
        </div>
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            {topic?.topicId && (
              <span className="font-mono text-[10px] font-bold px-1.5 py-0.2 rounded bg-line text-ink-muted shrink-0">
                {topic.topicId}
              </span>
            )}
            <span className="font-display text-xs sm:text-sm font-bold text-ink truncate">
              {topic?.title || "Topic Practice"}
            </span>
          </div>
          {domainName && (
            <span className="text-[10px] text-ink-muted truncate hidden xs:inline">
              {domainName}
            </span>
          )}
        </div>
      </div>

      {/* Right: Question Navigation & Dropdown */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 self-end sm:self-auto" ref={dropdownRef}>
        {/* Previous Button */}
        <button
          type="button"
          onClick={onPreviousQuestion}
          title="Previous question"
          className="flex size-7 sm:size-7.5 items-center justify-center rounded-xl border border-line bg-white text-ink-muted hover:text-ink hover:border-line-strong hover:bg-cream transition-all cursor-pointer shadow-2xs"
          aria-label="Previous question"
        >
          <ChevronLeft className="size-4" />
        </button>

        {/* Dropdown Toggle: Question X of Y */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center gap-1.5 rounded-xl border border-line bg-white px-3 py-1 text-xs font-semibold text-ink hover:border-brand transition-all cursor-pointer shadow-2xs"
            aria-expanded={dropdownOpen}
            aria-haspopup="listbox"
          >
            <span className="font-mono text-[11px] font-bold text-brand">
              Q{activeQuestionIndex + 1}
            </span>
            <span className="text-ink-muted">of</span>
            <span className="font-mono text-[11px] font-bold text-ink">
              {totalQuestions}
            </span>
            <ChevronDown
              className={`size-3.5 text-ink-muted transition-transform duration-200 ${
                dropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Questions Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 top-9.5 z-50 w-72 sm:w-80 max-h-80 overflow-y-auto rounded-2xl border border-line bg-white p-2 shadow-xl animate-in fade-in zoom-in-95">
              <div className="px-2.5 py-1.5 border-b border-line/60 mb-1 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted">
                  Questions ({totalQuestions})
                </span>
                <span className="text-[10px] text-brand font-semibold">
                  Select to switch
                </span>
              </div>

              <div className="flex flex-col gap-1">
                {questions.map((q, idx) => {
                  const isSelected = q.id === activeQuestion.id;

                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => {
                        onSelectQuestion(q.id);
                        setDropdownOpen(false);
                      }}
                      className={`flex items-start gap-2.5 rounded-xl p-2 text-left transition-all cursor-pointer ${
                        isSelected
                          ? "bg-brand/10 border border-brand/20 text-brand"
                          : "hover:bg-cream text-ink"
                      }`}
                    >
                      <span
                        className={`font-mono text-[10px] font-bold rounded px-1.5 py-0.5 shrink-0 mt-0.5 ${
                          isSelected
                            ? "bg-brand text-white"
                            : "bg-line text-ink-muted"
                        }`}
                      >
                        Q{idx + 1}
                      </span>

                      <div className="flex flex-col min-w-0 flex-1 gap-0.5">
                        <span className="text-xs font-semibold truncate leading-snug">
                          {q.title || `Question ${idx + 1}`}
                        </span>

                        <div className="flex items-center gap-1.5 text-[10px]">
                          {q.difficulty && (
                            <span
                              className={`rounded px-1.5 py-0.2 font-medium ${
                                q.difficulty === "BEGINNER"
                                  ? "bg-emerald-500/10 text-emerald-600"
                                  : q.difficulty === "INTERMEDIATE"
                                    ? "bg-blue-500/10 text-blue-600"
                                    : "bg-purple-500/10 text-purple-600"
                              }`}
                            >
                              {q.difficulty}
                            </span>
                          )}
                          {q.learningLevel && (
                            <span className="text-ink-muted font-mono">
                              {q.learningLevel}
                            </span>
                          )}
                          {q.archetype && (
                            <span className="text-ink-muted">
                              • {q.archetype}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Next Button */}
        <button
          type="button"
          onClick={onNextQuestion}
          title="Next question"
          className="flex size-7 sm:size-7.5 items-center justify-center rounded-xl border border-line bg-white text-ink-muted hover:text-ink hover:border-line-strong hover:bg-cream transition-all cursor-pointer shadow-2xs"
          aria-label="Next question"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
}
