"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Sparkles,
  Maximize2,
  Minimize2,
  Code2,
  Zap,
  Award,
  Layers,
  ChevronDown,
} from "lucide-react";
import { ARProblem, ExecutionStep } from "./types";
import { ALL_AR_PROBLEMS, getARProblem } from "./problems";
import { ARSceneCanvas } from "./ARSceneCanvas";
import { ARControls } from "./ARControls";
import { SynchronizedCodeViewer } from "./SynchronizedCodeViewer";
import { LiveVariablesInspector } from "./LiveVariablesInspector";
import { StepExplanationCard } from "./StepExplanationCard";
import { ComplexityVisualizer } from "./ComplexityVisualizer";
import { LearnWithARQuiz } from "./LearnWithARQuiz";

interface ARSolutionExplorerProps {
  isOpen: boolean;
  onClose: () => void;
  initialProblemId?: string;
  theme?: "dark" | "light";
}

export function ARSolutionExplorer({
  isOpen,
  onClose,
  initialProblemId = "max-sum-subarray",
  theme = "dark",
}: ARSolutionExplorerProps) {
  // Problem Selection
  const [selectedProblemId, setSelectedProblemId] =
    useState<string>(initialProblemId);
  const currentProblem: ARProblem = getARProblem(selectedProblemId);

  // Active Tab: "visualizer" | "complexity" | "quiz"
  const [activeTab, setActiveTab] = useState<
    "visualizer" | "complexity" | "quiz"
  >("visualizer");

  // Step Execution & Playback State
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isARMode, setIsARMode] = useState<boolean>(false);

  // Solution Code Language: "javascript" | "python"
  const [codeLanguage, setCodeLanguage] = useState<"javascript" | "python">(
    "javascript",
  );

  const totalSteps = currentProblem.executionSteps.length;
  const currentStep: ExecutionStep =
    currentProblem.executionSteps[currentStepIndex] ||
    currentProblem.executionSteps[0];

  // Reset step index when problem changes
  useEffect(() => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, [selectedProblemId]);

  // Handle Playback Interval
  useEffect(() => {
    if (!isPlaying) return;

    const baseDelay = 1200; // ms per step at 1x
    const stepDelay = baseDelay / playbackSpeed;

    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev >= totalSteps - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, stepDelay);

    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, totalSteps]);

  // Handle Escape key to close modal
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isFullscreen) {
          setIsFullscreen(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isFullscreen, onClose]);

  if (!isOpen) return null;

  // Handlers for AR controls
  const handleTogglePlay = () => setIsPlaying((prev) => !prev);
  const handlePrevStep = () => {
    setIsPlaying(false);
    setCurrentStepIndex((prev) => Math.max(0, prev - 1));
  };
  const handleNextStep = () => {
    setIsPlaying(false);
    setCurrentStepIndex((prev) => Math.min(totalSteps - 1, prev + 1));
  };
  const handleSeekStep = (idx: number) => {
    setIsPlaying(false);
    setCurrentStepIndex(Math.max(0, Math.min(totalSteps - 1, idx)));
  };
  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };
  const handleChangeSpeed = (speed: number) => setPlaybackSpeed(speed);
  const handleToggleFullscreen = () => setIsFullscreen((prev) => !prev);

  // Extract all quiz checkpoints
  const quizCheckpoints = currentProblem.executionSteps
    .map((s) => s.quizCheckpoint)
    .filter(Boolean) as any[];

  // Select code string based on language
  const activeCode =
    codeLanguage === "javascript"
      ? currentProblem.recommendedCodeJS
      : currentProblem.recommendedCodePY;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4 lg:p-6 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`flex flex-col rounded-3xl bg-[#12100f] border border-[#2b2724] text-[#ede8de] shadow-2xl overflow-hidden transition-all duration-300 ${
          isFullscreen
            ? "fixed inset-0 rounded-none border-none w-screen h-screen z-50"
            : "w-full max-w-[1400px] h-[92vh] max-h-[920px]"
        }`}
      >
        {/* 1. Header Toolbar */}
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[#24201d] bg-[#171514] px-4 py-3 sm:px-6">
          {/* Left: Problem Selector & Badges */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-xl bg-brand/20 text-brand border border-brand/30">
                <Sparkles className="size-4" />
              </div>
              <span className="font-display text-sm font-extrabold text-white hidden sm:inline">
                AR Solution Explorer
              </span>
            </div>

            {/* Problem Switcher Dropdown */}
            <div className="relative">
              <select
                value={selectedProblemId}
                onChange={(e) => setSelectedProblemId(e.target.value)}
                className="appearance-none rounded-xl border border-[#332e29] bg-[#221f1c] px-3 py-1.5 pr-8 text-xs font-bold text-white shadow-sm outline-none hover:border-brand/40 cursor-pointer"
              >
                {ALL_AR_PROBLEMS.map((prob) => (
                  <option key={prob.id} value={prob.id}>
                    {prob.title} ({prob.difficulty})
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8c8476]">
                <ChevronDown className="size-3.5" />
              </div>
            </div>

            {/* Tags */}
            <div className="hidden md:flex items-center gap-1.5">
              <span className="rounded-md bg-[#25211e] px-2 py-0.5 text-[11px] font-semibold text-[#a8a090] border border-[#38322c]">
                {currentProblem.pattern}
              </span>
              <span
                className={`rounded-md px-2 py-0.5 text-[11px] font-bold ${
                  currentProblem.difficulty === "Easy"
                    ? "bg-emerald-500/20 text-emerald-400"
                    : currentProblem.difficulty === "Medium"
                      ? "bg-amber-500/20 text-amber-400"
                      : "bg-rose-500/20 text-rose-400"
                }`}
              >
                {currentProblem.difficulty}
              </span>
            </div>
          </div>

          {/* Center: Tabs Switcher */}
          <div className="flex items-center rounded-xl bg-[#221f1c] border border-[#332e29] p-1">
            <button
              type="button"
              onClick={() => setActiveTab("visualizer")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
                activeTab === "visualizer"
                  ? "bg-brand text-white shadow-xs"
                  : "text-[#a8a090] hover:text-white"
              }`}
            >
              <Layers className="size-3.5" />
              <span>3D / AR View</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("complexity")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
                activeTab === "complexity"
                  ? "bg-brand text-white shadow-xs"
                  : "text-[#a8a090] hover:text-white"
              }`}
            >
              <Zap className="size-3.5" />
              <span>Complexity</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("quiz")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
                activeTab === "quiz"
                  ? "bg-brand text-white shadow-xs"
                  : "text-[#a8a090] hover:text-white"
              }`}
            >
              <Award className="size-3.5" />
              <span>Quiz Checkpoint</span>
              {quizCheckpoints.length > 0 && (
                <span className="size-1.5 rounded-full bg-emerald-400" />
              )}
            </button>
          </div>

          {/* Right: Fullscreen & Close Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleToggleFullscreen}
              className="flex size-8 items-center justify-center rounded-xl bg-[#221f1c] border border-[#332e29] text-[#a8a090] hover:text-white transition-colors"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? (
                <Minimize2 className="size-4" />
              ) : (
                <Maximize2 className="size-4" />
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="flex size-8 items-center justify-center rounded-xl bg-[#221f1c] border border-[#332e29] text-[#a8a090] hover:text-white hover:bg-rose-500/20 hover:border-rose-500/30 transition-colors"
              title="Close (Esc)"
            >
              <X className="size-4" />
            </button>
          </div>
        </header>

        {/* 2. Main Content Body */}
        <div className="flex-1 overflow-hidden">
          {activeTab === "visualizer" && (
            <div className="flex h-full flex-col lg:flex-row overflow-y-auto lg:overflow-hidden">
              {/* Left Column: 3D AR Canvas + Controls + Step Explanation (60%) */}
              <div className="flex flex-1 flex-col gap-3 p-3 sm:p-4 overflow-y-auto">
                {/* 3D Scene Viewport */}
                <div className="relative flex-1 min-h-[340px] sm:min-h-[420px] rounded-2xl overflow-hidden border border-[#26221f] shadow-inner">
                  <ARSceneCanvas
                    step={currentStep}
                    theme={theme}
                    isARMode={isARMode}
                    onToggleARMode={setIsARMode}
                  />
                </div>

                {/* Timeline Controls */}
                <ARControls
                  currentStepIndex={currentStepIndex}
                  totalSteps={totalSteps}
                  isPlaying={isPlaying}
                  playbackSpeed={playbackSpeed}
                  isFullscreen={isFullscreen}
                  onTogglePlay={handleTogglePlay}
                  onPrevStep={handlePrevStep}
                  onNextStep={handleNextStep}
                  onSeekStep={handleSeekStep}
                  onReset={handleReset}
                  onChangeSpeed={handleChangeSpeed}
                  onToggleFullscreen={handleToggleFullscreen}
                />

                {/* Concise Step Explanation Card (What / Why / Result) */}
                <StepExplanationCard
                  step={currentStep}
                  currentStepIndex={currentStepIndex}
                  totalSteps={totalSteps}
                />
              </div>

              {/* Vertical Divider */}
              <div className="hidden lg:block w-[1px] bg-[#24201d] self-stretch" />

              {/* Right Column: Code Viewer + Live Variables (40%) */}
              <div className="flex w-full lg:w-[480px] xl:w-[520px] flex-col gap-3 p-3 sm:p-4 overflow-y-auto bg-[#151312]">
                {/* Language Switcher Bar */}
                <div className="flex items-center justify-between rounded-xl bg-[#1d1a18] border border-[#2e2925] px-3 py-1.5">
                  <div className="flex items-center gap-1.5 text-xs text-[#a09787]">
                    <Code2 className="size-3.5 text-brand" />
                    <span>Reference Solution Code</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setCodeLanguage("javascript")}
                      className={`rounded-lg px-2.5 py-0.5 text-xs font-semibold transition-all ${
                        codeLanguage === "javascript"
                          ? "bg-brand text-white"
                          : "text-[#8e8576] hover:text-white"
                      }`}
                    >
                      JavaScript
                    </button>
                    <button
                      type="button"
                      onClick={() => setCodeLanguage("python")}
                      className={`rounded-lg px-2.5 py-0.5 text-xs font-semibold transition-all ${
                        codeLanguage === "python"
                          ? "bg-brand text-white"
                          : "text-[#8e8576] hover:text-white"
                      }`}
                    >
                      Python
                    </button>
                  </div>
                </div>

                {/* Synchronized Code Viewer */}
                <div className="h-[280px] sm:h-[320px] shrink-0">
                  <SynchronizedCodeViewer
                    code={activeCode}
                    activeLine={currentStep.codeLine}
                    language={codeLanguage}
                    className="h-full"
                  />
                </div>

                {/* Live Variables & Data Structures Inspector */}
                <div className="flex-1">
                  <LiveVariablesInspector step={currentStep} />
                </div>
              </div>
            </div>
          )}

          {activeTab === "complexity" && (
            <div className="h-full overflow-y-auto p-4 sm:p-6 lg:p-8 flex justify-center">
              <div className="w-full max-w-3xl">
                <ComplexityVisualizer problem={currentProblem} />
              </div>
            </div>
          )}

          {activeTab === "quiz" && (
            <div className="h-full overflow-y-auto p-4 sm:p-6 lg:p-8 flex justify-center">
              <div className="w-full max-w-3xl">
                <LearnWithARQuiz checkpoints={quizCheckpoints} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
