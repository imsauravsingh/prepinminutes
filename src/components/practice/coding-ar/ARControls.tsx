"use client";

import React, { useEffect } from "react";
import {
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Maximize2,
  Minimize2,
  Gauge,
} from "lucide-react";

interface ARControlsProps {
  currentStepIndex: number;
  totalSteps: number;
  isPlaying: boolean;
  playbackSpeed: number; // 0.5, 1, 1.5, 2
  isFullscreen: boolean;
  onTogglePlay: () => void;
  onPrevStep: () => void;
  onNextStep: () => void;
  onSeekStep: (stepIndex: number) => void;
  onReset: () => void;
  onChangeSpeed: (speed: number) => void;
  onToggleFullscreen: () => void;
  className?: string;
}

const SPEED_OPTIONS = [0.5, 1, 1.5, 2];

export function ARControls({
  currentStepIndex,
  totalSteps,
  isPlaying,
  playbackSpeed,
  isFullscreen,
  onTogglePlay,
  onPrevStep,
  onNextStep,
  onSeekStep,
  onReset,
  onChangeSpeed,
  onToggleFullscreen,
  className = "",
}: ARControlsProps) {
  // Global Keyboard shortcuts when component is mounted
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input/textarea
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      if (e.key === " " || e.code === "Space") {
        e.preventDefault();
        onTogglePlay();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        onPrevStep();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        onNextStep();
      } else if (e.key === "r" || e.key === "R") {
        e.preventDefault();
        onReset();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onTogglePlay, onPrevStep, onNextStep, onReset]);

  // Compute percentage for progress bar
  const progressPercent =
    totalSteps > 1 ? (currentStepIndex / (totalSteps - 1)) * 100 : 0;

  return (
    <div
      className={`flex flex-col gap-2 rounded-2xl bg-[#171514] border border-[#2d2925] p-3 sm:p-4 text-[#f0ece1] shadow-xl ${className}`}
    >
      {/* 1. Scrubber Timeline */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-[11px] font-mono text-[#a8a090]">
          <span className="font-semibold text-white">
            Step {currentStepIndex + 1} of {totalSteps}
          </span>
          <span>{Math.round(progressPercent)}% completed</span>
        </div>

        {/* Clickable Track */}
        <div
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const ratio = Math.max(0, Math.min(1, clickX / rect.width));
            const targetStep = Math.round(ratio * (totalSteps - 1));
            onSeekStep(targetStep);
          }}
          className="relative h-2 w-full cursor-pointer rounded-full bg-[#272320] transition-colors hover:bg-[#302b28]"
        >
          {/* Active Fill Track */}
          <div
            className="h-full rounded-full bg-brand transition-all duration-150"
            style={{ width: `${progressPercent}%` }}
          />

          {/* Draggable thumb marker */}
          <div
            className="absolute top-1/2 -translate-y-1/2 size-3.5 rounded-full bg-white border-2 border-brand shadow-md pointer-events-none transition-all duration-150"
            style={{
              left: `calc(${progressPercent}% - 7px)`,
            }}
          />
        </div>

        {/* Step Ticks Indicators */}
        <div className="flex justify-between items-center px-0.5 pt-0.5">
          {Array.from({ length: totalSteps }).map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onSeekStep(idx)}
              className={`size-1.5 rounded-full transition-all hover:scale-150 ${
                idx === currentStepIndex
                  ? "bg-brand scale-125 ring-2 ring-brand/30"
                  : idx < currentStepIndex
                    ? "bg-[#ff6c47]/50"
                    : "bg-[#38332f]"
              }`}
              title={`Jump to Step ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* 2. Control Buttons Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[#272320]">
        {/* Left: Step navigation + Play/Pause + Reset */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Reset button */}
          <button
            type="button"
            onClick={onReset}
            title="Reset to Start (R)"
            className="flex size-8 items-center justify-center rounded-xl bg-[#221f1c] border border-[#352f2a] text-[#b8b0a0] hover:text-white hover:bg-[#2b2723] transition-colors"
          >
            <RotateCcw className="size-3.5" />
          </button>

          {/* Previous Step */}
          <button
            type="button"
            disabled={currentStepIndex === 0}
            onClick={onPrevStep}
            title="Previous Step (Left Arrow)"
            className="flex size-8 items-center justify-center rounded-xl bg-[#221f1c] border border-[#352f2a] text-[#b8b0a0] hover:text-white hover:bg-[#2b2723] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="size-4" />
          </button>

          {/* Play / Pause Primary Button */}
          <button
            type="button"
            onClick={onTogglePlay}
            title={isPlaying ? "Pause (Space)" : "Play Execution (Space)"}
            className="flex h-8 items-center gap-1.5 rounded-xl bg-brand hover:bg-[#eb4a19] px-3.5 text-xs font-bold text-white shadow-[0_2px_10px_rgba(255,108,71,0.3)] transition-all"
          >
            {isPlaying ? (
              <>
                <Pause className="size-3.5 fill-white" />
                <span className="hidden sm:inline">Pause</span>
              </>
            ) : (
              <>
                <Play className="size-3.5 fill-white ml-0.5" />
                <span className="hidden sm:inline">Play</span>
              </>
            )}
          </button>

          {/* Next Step */}
          <button
            type="button"
            disabled={currentStepIndex >= totalSteps - 1}
            onClick={onNextStep}
            title="Next Step (Right Arrow)"
            className="flex size-8 items-center justify-center rounded-xl bg-[#221f1c] border border-[#352f2a] text-[#b8b0a0] hover:text-white hover:bg-[#2b2723] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>

        {/* Right: Playback Speed Selector & Fullscreen Toggle */}
        <div className="flex items-center gap-2">
          {/* Speed Pills */}
          <div className="flex items-center gap-1 rounded-xl bg-[#221f1c] border border-[#352f2a] p-1">
            <Gauge className="size-3 text-[#8b8375] ml-1 mr-0.5 hidden sm:block" />
            {SPEED_OPTIONS.map((speed) => (
              <button
                key={speed}
                type="button"
                onClick={() => onChangeSpeed(speed)}
                className={`rounded-lg px-2 py-0.5 text-[11px] font-semibold transition-all ${
                  playbackSpeed === speed
                    ? "bg-brand text-white shadow-xs"
                    : "text-[#a8a090] hover:text-white hover:bg-white/5"
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>

          {/* Fullscreen Toggle */}
          <button
            type="button"
            onClick={onToggleFullscreen}
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen View"}
            className="flex size-8 items-center justify-center rounded-xl bg-[#221f1c] border border-[#352f2a] text-[#b8b0a0] hover:text-white hover:bg-[#2b2723] transition-colors"
          >
            {isFullscreen ? (
              <Minimize2 className="size-3.5" />
            ) : (
              <Maximize2 className="size-3.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
