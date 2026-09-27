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
  ChevronLeft,
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

  // Mobile Visualizer Sub-view: "3d" | "code"
  const [mobileVisualizerView, setMobileVisualizerView] = useState<
    "3d" | "code"
  >("3d");

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-0 sm:p-4 lg:p-6 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`flex flex-col bg-[#12100f] text-[#ede8de] shadow-2xl overflow-hidden transition-all duration-300 ${
          isFullscreen
            ? "fixed inset-0 rounded-none border-none w-screen h-screen z-50"
            : "w-full sm:max-w-[1400px] h-full sm:h-[92vh] sm:max-h-[920px] rounded-none sm:rounded-3xl border-0 sm:border border-[#2b2724]"
        }`}
      >
        {/* 1. Header Toolbar */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 sm:gap-3 border-b border-[#24201d] bg-[#171514] px-3.5 py-2.5 sm:px-6 sm:py-3 shrink-0">
          {/* Top Row on Mobile: Problem Selector & Badges & Mobile Actions */}
          <div className="flex items-center justify-between sm:justify-start gap-2 sm:gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <div className="flex size-7 sm:size-8 items-center justify-center rounded-xl bg-brand/20 text-brand border border-brand/30 shrink-0">
                <Sparkles className="size-3.5 sm:size-4" />
              </div>
              <span className="font-display text-xs sm:text-sm font-extrabold text-white">
                AR Explorer
              </span>
            </div>

            {/* Problem Switcher Dropdown */}
            <div className="relative flex-1 sm:flex-initial max-w-[180px] sm:max-w-none">
              <select
                value={selectedProblemId}
                onChange={(e) => setSelectedProblemId(e.target.value)}
                className="w-full appearance-none rounded-xl border border-[#332e29] bg-[#221f1c] px-2.5 py-1 sm:px-3 sm:py-1.5 pr-7 text-[11px] sm:text-xs font-bold text-white shadow-sm outline-none hover:border-brand/40 cursor-pointer truncate"
              >
                {ALL_AR_PROBLEMS.map((prob) => (
                  <option key={prob.id} value={prob.id}>
                    {prob.title} ({prob.difficulty})
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#8c8476]">
                <ChevronDown className="size-3 sm:size-3.5" />
              </div>
            </div>

            {/* Tags (Desktop only) */}
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

            {/* Mobile-only Close & Fullscreen Actions */}
            <div className="flex sm:hidden items-center gap-1">
              <button
                type="button"
                onClick={handleToggleFullscreen}
                className="flex size-7 items-center justify-center rounded-lg bg-[#221f1c] border border-[#332e29] text-[#a8a090] hover:text-white"
                title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              >
                {isFullscreen ? (
                  <Minimize2 className="size-3.5" />
                ) : (
                  <Maximize2 className="size-3.5" />
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex size-7 items-center justify-center rounded-lg bg-[#221f1c] border border-[#332e29] text-[#a8a090] hover:text-white hover:bg-rose-500/20"
                title="Close (Esc)"
              >
                <X className="size-3.5" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs Switcher */}
          <div className="flex items-center justify-center w-full sm:w-auto">
            <div className="flex w-full sm:w-auto items-center justify-between sm:justify-center rounded-xl bg-[#221f1c] border border-[#332e29] p-0.5 sm:p-1">
              <button
                type="button"
                onClick={() => setActiveTab("visualizer")}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-1 sm:gap-1.5 rounded-lg px-2.5 py-1 text-[11px] sm:text-xs font-semibold transition-all ${
                  activeTab === "visualizer"
                    ? "bg-brand text-white shadow-xs"
                    : "text-[#a8a090] hover:text-white"
                }`}
              >
                <Layers className="size-3 sm:size-3.5" />
                <span>3D / AR View</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("complexity")}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-1 sm:gap-1.5 rounded-lg px-2.5 py-1 text-[11px] sm:text-xs font-semibold transition-all ${
                  activeTab === "complexity"
                    ? "bg-brand text-white shadow-xs"
                    : "text-[#a8a090] hover:text-white"
                }`}
              >
                <Zap className="size-3 sm:size-3.5" />
                <span>Complexity</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("quiz")}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-1 sm:gap-1.5 rounded-lg px-2.5 py-1 text-[11px] sm:text-xs font-semibold transition-all ${
                  activeTab === "quiz"
                    ? "bg-brand text-white shadow-xs"
                    : "text-[#a8a090] hover:text-white"
                }`}
              >
                <Award className="size-3 sm:size-3.5" />
                <span>Quiz</span>
                {quizCheckpoints.length > 0 && (
                  <span className="size-1.5 rounded-full bg-emerald-400" />
                )}
              </button>
            </div>
          </div>

          {/* Desktop Right: Fullscreen & Close Buttons */}
          <div className="hidden sm:flex items-center gap-1.5">
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
        <div className="flex-1 overflow-hidden flex flex-col">
          {activeTab === "visualizer" && (
            <>
              {/* Mobile Sub-Tab Switcher: 3D Visualization vs Code Execution */}
              <div className="lg:hidden flex items-center justify-between border-b border-[#24201d] bg-[#1a1716] px-3 py-1.5 shrink-0">
                <div className="flex w-full items-center rounded-xl bg-[#221f1c] p-1 border border-[#332e29]">
                  <button
                    type="button"
                    onClick={() => setMobileVisualizerView("3d")}
                    className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-bold transition-all ${
                      mobileVisualizerView === "3d"
                        ? "bg-brand text-white shadow-xs"
                        : "text-[#a8a090] hover:text-white"
                    }`}
                  >
                    <Layers className="size-3.5" />
                    <span>3D Visualization</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMobileVisualizerView("code")}
                    className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-bold transition-all ${
                      mobileVisualizerView === "code"
                        ? "bg-brand text-white shadow-xs"
                        : "text-[#a8a090] hover:text-white"
                    }`}
                  >
                    <Code2 className="size-3.5" />
                    <span>Code Execution</span>
                    <span className="rounded-full bg-brand/20 px-1.5 py-0.2 text-[10px] text-brand border border-brand/30">
                      Line {currentStep.codeLine || 1}
                    </span>
                  </button>
                </div>
              </div>

              <div className="flex flex-1 flex-col lg:flex-row overflow-hidden">
                {/* Left Column: 3D AR Canvas + Controls + Step Explanation (60%) */}
                <div
                  className={`flex-1 flex-col gap-3 p-3 sm:p-4 overflow-y-auto ${
                    mobileVisualizerView === "3d" ? "flex" : "hidden lg:flex"
                  }`}
                >
                  {/* 3D Scene Viewport */}
                  <div className="relative w-full h-[40vh] sm:h-[420px] min-h-[250px] rounded-2xl overflow-hidden border border-[#26221f] shadow-inner shrink-0">
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

                  {/* Quick Mobile Navigation to Synchronized Code Execution */}
                  <div className="lg:hidden pt-1 pb-3">
                    <button
                      type="button"
                      onClick={() => setMobileVisualizerView("code")}
                      className="flex w-full items-center justify-between rounded-xl bg-[#1f1c19] hover:bg-[#272320] border border-[#352f2a] p-3 text-xs text-[#ede8de] transition-colors cursor-pointer shadow-sm"
                    >
                      <div className="flex items-center gap-2">
                        <Code2 className="size-4 text-brand" />
                        <span className="font-semibold">
                          View Synchronized Code Execution (Line{" "}
                          {currentStep.codeLine || 1})
                        </span>
                      </div>
                      <span className="font-bold text-brand flex items-center gap-1">
                        Open Code →
                      </span>
                    </button>
                  </div>
                </div>

                {/* Vertical Divider */}
                <div className="hidden lg:block w-[1px] bg-[#24201d] self-stretch" />

                {/* Right Column: Code Viewer + Live Variables (40%) */}
                <div
                  className={`w-full lg:w-[480px] xl:w-[520px] flex-col gap-3 p-3 sm:p-4 overflow-y-auto bg-[#151312] ${
                    mobileVisualizerView === "code" ? "flex" : "hidden lg:flex"
                  }`}
                >
                  {/* Mobile Back Banner to 3D View */}
                  <div className="lg:hidden flex items-center justify-between pb-1">
                    <button
                      type="button"
                      onClick={() => setMobileVisualizerView("3d")}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-brand hover:underline cursor-pointer"
                    >
                      <ChevronLeft className="size-3.5" />
                      <span>← Return to 3D Visualization</span>
                    </button>
                    <span className="text-[11px] font-mono text-[#8c8476]">
                      Step {currentStepIndex + 1}/{totalSteps}
                    </span>
                  </div>

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
                  <div className="flex-1 pb-4">
                    <LiveVariablesInspector step={currentStep} />
                  </div>
                </div>
              </div>
            </>
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
