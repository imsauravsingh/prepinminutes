"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Award,
  HelpCircle,
  RotateCcw,
  ChevronRight,
} from "lucide-react";
import { QuizCheckpoint } from "./types";

interface LearnWithARQuizProps {
  checkpoints: QuizCheckpoint[];
  className?: string;
}

export function LearnWithARQuiz({
  checkpoints,
  className = "",
}: LearnWithARQuizProps) {
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [qIdx: number]: number;
  }>({});
  const [score, setScore] = useState(0);

  if (!checkpoints || checkpoints.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-[#8e8576] rounded-2xl bg-[#171514] border border-[#2d2925]">
        <HelpCircle className="size-8 mb-2 opacity-50" />
        <p className="text-xs">
          No quiz checkpoints registered for this problem yet.
        </p>
      </div>
    );
  }

  const currentQuiz = checkpoints[currentQuizIdx];
  const isAnswered = selectedAnswers[currentQuizIdx] !== undefined;
  const selectedOption = selectedAnswers[currentQuizIdx];
  const isCorrect = isAnswered && selectedOption === currentQuiz.correctIndex;

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    const newAnswers = { ...selectedAnswers, [currentQuizIdx]: idx };
    setSelectedAnswers(newAnswers);
    if (idx === currentQuiz.correctIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setScore(0);
    setCurrentQuizIdx(0);
  };

  const handleNextQuiz = () => {
    if (currentQuizIdx < checkpoints.length - 1) {
      setCurrentQuizIdx((prev) => prev + 1);
    }
  };

  return (
    <div
      className={`flex flex-col gap-4 rounded-2xl bg-[#171514] border border-[#2d2925] p-4 sm:p-5 text-[#ede8de] shadow-xl ${className}`}
    >
      {/* Quiz Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#292522]">
        <div className="flex items-center gap-2">
          <Award className="size-4 text-brand" />
          <span className="text-sm font-bold text-white">
            Learn with AR: Checkpoint Quiz
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-[#a59d8f]">
            Question {currentQuizIdx + 1} of {checkpoints.length}
          </span>
          <span className="rounded-full bg-brand/20 text-brand px-2 py-0.5 font-bold">
            Score: {score}
          </span>
        </div>
      </div>

      {/* Question Card */}
      <div className="flex flex-col gap-3">
        <h4 className="text-sm font-semibold text-white leading-relaxed">
          {currentQuiz.question}
        </h4>

        {/* Options */}
        <div className="flex flex-col gap-2">
          {currentQuiz.options.map((option, optIdx) => {
            const isSelected = selectedOption === optIdx;
            const isOptionCorrect = optIdx === currentQuiz.correctIndex;

            let buttonStyle =
              "bg-[#201d1a] border-[#342f2a] text-[#ded8cc] hover:border-brand/40";
            if (isAnswered) {
              if (isOptionCorrect) {
                buttonStyle =
                  "bg-emerald-950/40 border-emerald-500/60 text-emerald-200 font-semibold";
              } else if (isSelected) {
                buttonStyle = "bg-rose-950/40 border-rose-500/60 text-rose-200";
              } else {
                buttonStyle =
                  "bg-[#1c1917] border-[#292522] text-[#787167] opacity-60";
              }
            }

            return (
              <button
                key={optIdx}
                type="button"
                disabled={isAnswered}
                onClick={() => handleSelectOption(optIdx)}
                className={`flex items-center justify-between rounded-xl border p-3 text-left text-xs transition-all ${buttonStyle} cursor-pointer disabled:cursor-default`}
              >
                <span>{option}</span>
                {isAnswered && isOptionCorrect && (
                  <CheckCircle2 className="size-4 text-emerald-400 shrink-0 ml-2" />
                )}
                {isAnswered && isSelected && !isOptionCorrect && (
                  <XCircle className="size-4 text-rose-400 shrink-0 ml-2" />
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation Feedback Card once answered */}
        {isAnswered && (
          <div
            className={`flex flex-col gap-1.5 rounded-xl p-3.5 text-xs animate-in fade-in duration-200 ${
              isCorrect
                ? "bg-emerald-950/30 border border-emerald-500/40 text-emerald-200"
                : "bg-rose-950/30 border border-rose-500/40 text-rose-200"
            }`}
          >
            <div className="flex items-center gap-1.5 font-bold">
              {isCorrect ? (
                <>
                  <CheckCircle2 className="size-4 text-emerald-400" />
                  <span>Correct! Great comprehension.</span>
                </>
              ) : (
                <>
                  <XCircle className="size-4 text-rose-400" />
                  <span>Not quite! Review the reasoning below:</span>
                </>
              )}
            </div>
            <p className="leading-relaxed opacity-90 pl-5.5">
              {currentQuiz.explanation}
            </p>
          </div>
        )}

        {/* Navigation & Reset Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-[#292522]">
          <button
            type="button"
            onClick={handleResetQuiz}
            className="flex items-center gap-1 text-xs text-[#a09787] hover:text-white transition-colors"
          >
            <RotateCcw className="size-3" />
            <span>Restart Quiz</span>
          </button>

          {currentQuizIdx < checkpoints.length - 1 && isAnswered && (
            <button
              type="button"
              onClick={handleNextQuiz}
              className="flex items-center gap-1 rounded-xl bg-brand hover:bg-[#eb4a19] px-3.5 py-1.5 text-xs font-bold text-white transition-all shadow-sm"
            >
              <span>Next Question</span>
              <ChevronRight className="size-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
