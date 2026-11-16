"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Settings,
  Cpu,
  User,
  Info,
  Pause,
  Play,
  Square,
  Mic,
  LayoutGrid,
  Network,
  FileCode,
  FileText,
  Lightbulb,
  CheckCircle2,
  X,
  Send,
  BookOpen,
  Target,
  Loader2,
  Zap,
} from "lucide-react";
import { WhiteboardModal } from "./WhiteboardModal";
import { useCurriculumTopic } from "@/hooks/useCurriculumTopic";
import { PracticeQuestionSelector } from "./PracticeQuestionSelector";
import { backendApi } from "@/lib/api-client";

// Heights for the 24 waveform bars matching Figma node 190:4
const WAVEFORM_HEIGHTS = [
  12, 18, 24, 16, 10, 8, 14, 20, 26, 15, 9, 13, 22, 17, 11, 25, 20, 14, 8, 12,
  18, 24, 10, 6,
];

export function SystemDesignWorkspace() {
  // Curriculum Topic & Dynamic Question Loader
  const {
    topic,
    domain,
    category,
    questions,
    activeQuestion,
    activeQuestionIndex,
    totalQuestions,
    selectQuestion,
    nextQuestion,
    previousQuestion,
    isLoading,
  } = useCurriculumTopic({ defaultTopicSlug: "distributed-caching" });

  // Timer: starts at 00:00 and counts up towards 30:00
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Text input mode toggle
  const [isTextInput, setIsTextInput] = useState(false);
  const [textMessage, setTextMessage] = useState("");

  // Whiteboard full-screen canvas view state matching node 196:219
  const [isWhiteboardOpen, setIsWhiteboardOpen] = useState(false);

  // Secondary interactive tools state (modal drawer for notes/code/diagram)
  const [activeTool, setActiveTool] = useState<
    "diagram" | "code" | "notes" | null
  >(null);
  const [notesContent, setNotesContent] = useState("");
  const [codeContent, setCodeContent] = useState(
    "// Outline key services, caching layers and endpoints\nPOST /api/v1/resource\nGET /:id -> Cache lookup / Database query\n"
  );

  // Settings / End Session modal state
  const [showEndModal, setShowEndModal] = useState(false);

  // Messages list to support sending a new user message
  const [messages, setMessages] = useState<
    { sender: "ai" | "user"; content: string; details?: string[] }[]
  >([]);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [coveredAtoms, setCoveredAtoms] = useState<string[]>([]);

  // Voice Turn & Barge-In State
  const [turnState, setTurnState] = useState<
    "IDLE" | "AI_SPEAKING" | "CANDIDATE_SPEAKING" | "PROCESSING"
  >("IDLE");
  const activeAudioRef = useRef<HTMLAudioElement | null>(null);

  const handleBargeIn = useCallback(async () => {
    if (activeAudioRef.current) {
      activeAudioRef.current.pause();
      activeAudioRef.current.currentTime = 0;
      activeAudioRef.current = null;
    }
    setTurnState("CANDIDATE_SPEAKING");

    try {
      await backendApi.interruptVoiceSession({
        source: "system_design_barge_in",
        timestampMs: Date.now(),
      });
    } catch (err) {
      console.warn("Barge-in signal dispatch failed:", err);
    }
  }, []);

  // Update AI Interviewer initial prompt when active question changes
  useEffect(() => {
    if (activeQuestion) {
      setCoveredAtoms([]);
      setMessages([
        {
          sender: "ai",
          content: activeQuestion.prompt,
          details:
            activeQuestion.hints && activeQuestion.hints.length > 0
              ? [
                  "Scoping & Clarification Guidelines:",
                  ...activeQuestion.hints.map((h, i) => `${i + 1}. ${h}`),
                ]
              : [
                  "Before you start, feel free to ask any clarifying questions or state your scale assumptions.",
                ],
        },
      ]);
    }
  }, [activeQuestion]);

  // Update initial code template when topic changes
  useEffect(() => {
    if (topic) {
      setCodeContent(
        `// Outline key services and architectural interfaces for ${topic.title}\n// Domain: ${domain?.name || "System Design"} | Category: ${category?.name || "Architecture"}\n\nPOST /api/v1/resource\nGET /api/v1/resource/:id\n`
      );
    }
  }, [topic, domain, category]);

  // Elapsed timer tick
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const [isEndingSession, setIsEndingSession] = useState(false);
  const router = useRouter();

  const handleTogglePause = () => {
    setIsPaused((prev) => !prev);
  };

  const handleStopSession = () => {
    setShowEndModal(true);
  };

  const handleEndSession = async () => {
    try {
      setIsEndingSession(true);
      const idempotencyKey = `sd_${topic?.slug || "design"}_${activeQuestion?.id || "q1"}_${Date.now()}`;

      // Retrieve persisted whiteboard state if present
      let whiteboardData: any = null;
      if (typeof window !== "undefined") {
        try {
          const wbKey = `pim_wb_${topic?.slug || "default"}_${activeQuestion?.id || "q1"}`;
          const raw = localStorage.getItem(wbKey);
          if (raw) whiteboardData = JSON.parse(raw);
        } catch {
          // ignore parsing error
        }
      }

      const result = await backendApi.submitPracticeSession(
        {
          domain: domain?.slug || "system-design",
          topicSlug: topic?.slug || "distributed-caching-redis",
          questionId: activeQuestion?.id || "q1",
          title: activeQuestion?.title || topic?.title || "System Design Session",
          codeSubmission: codeContent || undefined,
          candidateNotes: notesContent || undefined,
          whiteboardData,
          transcriptHistory: messages.map((m) => ({
            sender: m.sender,
            content: m.content,
          })),
          coveredRubricAtoms: coveredAtoms,
          durationSeconds: secondsElapsed,
        },
        { idempotencyKey }
      );

      if (result && result.reportId) {
        router.push(`/practice/session/system-design/evaluation?id=${result.reportId}`);
      } else {
        router.push("/practice/session/system-design/evaluation");
      }
    } catch (err) {
      console.warn("Session submit fallback triggered:", err);
      router.push("/practice/session/system-design/evaluation");
    } finally {
      setIsEndingSession(false);
    }
  };

  const handleSendText = async (e: React.FormEvent) => {
    e.preventDefault();
    const candidateInput = textMessage.trim();
    if (!candidateInput || isAiThinking) return;

    const newMessages = [
      ...messages,
      { sender: "user" as const, content: candidateInput },
    ];
    setMessages(newMessages);
    setTextMessage("");
    setIsAiThinking(true);

    try {
      const turnResult = await backendApi.submitPracticeSessionTurn({
        topicSlug: topic?.slug || "distributed-caching",
        questionId: activeQuestion?.id,
        candidateMessage: candidateInput,
        transcriptHistory: newMessages.map((m) => ({
          sender: m.sender,
          content: m.content,
        })),
        candidateTargetLevel: "L3",
      });

      if (turnResult?.replyText) {
        setMessages((prev) => [
          ...prev,
          {
            sender: "ai",
            content: turnResult.replyText,
            details: turnResult.nextSuggestedProbe
              ? [`Follow-up focus: ${turnResult.nextSuggestedProbe}`]
              : undefined,
          },
        ]);
        if (
          turnResult.coveredRubricAtoms &&
          turnResult.coveredRubricAtoms.length > 0
        ) {
          setCoveredAtoms((prev) =>
            Array.from(new Set([...prev, ...turnResult.coveredRubricAtoms]))
          );
        }
      }
    } catch (err) {
      console.error("AiInterviewAgent turn error:", err);
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          content:
            "That's a sound architectural approach. How does your design handle failover and data consistency if the primary node goes offline?",
        },
      ]);
    } finally {
      setIsAiThinking(false);
    }
  };

  const renderAudioDock = () => (
    <div className="flex flex-col items-center gap-3.5 rounded-2xl border border-[#7c3aed] bg-[#f5f3ff] p-5 shadow-sm text-center">
      {/* Listening / Speaking / Paused status label */}
      <div className="flex items-center gap-2">
        <span
          className={`text-xs font-bold uppercase tracking-wider ${
            isPaused
              ? "text-ink-muted"
              : turnState === "AI_SPEAKING"
                ? "text-emerald-600 animate-pulse"
                : turnState === "CANDIDATE_SPEAKING"
                  ? "text-brand"
                  : "text-[#7c3aed]"
          }`}
        >
          {isPaused
            ? "Paused"
            : turnState === "AI_SPEAKING"
              ? "Sarah Speaking • Click Mic to Interrupt"
              : turnState === "CANDIDATE_SPEAKING"
                ? "Listening to you..."
                : turnState === "PROCESSING"
                  ? "Thinking..."
                  : "Ready • Speak Naturally"}
        </span>

        {/* Live Barge-In Interruption Button */}
        {turnState === "AI_SPEAKING" && !isPaused && (
          <button
            type="button"
            onClick={handleBargeIn}
            className="flex items-center gap-1 rounded-full bg-rose-50 border border-rose-200 px-2.5 py-0.5 text-[10px] font-bold text-rose-600 hover:bg-rose-100 transition-all cursor-pointer shadow-2xs animate-in fade-in"
          >
            <Zap className="size-3 text-rose-500 fill-rose-500" />
            <span>Interrupt</span>
          </button>
        )}
      </div>

      {/* Audio Waveform visualization (24 animated bars) */}
      <div className="flex h-7 items-center justify-center gap-1">
        {WAVEFORM_HEIGHTS.map((height, idx) => {
          const barColor =
            turnState === "AI_SPEAKING"
              ? "bg-emerald-500"
              : turnState === "CANDIDATE_SPEAKING"
                ? "bg-brand"
                : "bg-[#7c3aed]";

          return (
            <div
              key={idx}
              className={`w-[3px] rounded-full transition-all duration-200 ${barColor}`}
              style={{
                height: isPaused
                  ? "4px"
                  : turnState === "IDLE"
                    ? "6px"
                    : `${height}px`,
                opacity: isPaused ? 0.4 : 1,
              }}
            />
          );
        })}
      </div>

      {/* Controls row */}
      <div className="flex items-center gap-4 pt-1">
        {/* Pause / Resume button */}
        <button
          type="button"
          onClick={handleTogglePause}
          className="flex h-9 items-center gap-1.5 rounded-full border border-[#7c3aed] bg-white px-4 text-xs font-semibold text-[#7c3aed] shadow-sm transition-colors hover:bg-[#ede9fe]"
        >
          {isPaused ? (
            <>
              <Play className="size-3.5 fill-[#7c3aed]" />
              <span>Resume</span>
            </>
          ) : (
            <>
              <Pause className="size-3.5 fill-[#7c3aed]" />
              <span>Pause</span>
            </>
          )}
        </button>

        {/* Central Mic circle with instant barge-in support */}
        <button
          type="button"
          onClick={() => {
            if (turnState === "AI_SPEAKING") {
              handleBargeIn();
            } else if (turnState === "CANDIDATE_SPEAKING") {
              setTurnState("PROCESSING");
            } else {
              setTurnState("CANDIDATE_SPEAKING");
            }
          }}
          className={`flex size-14 items-center justify-center rounded-full text-white transition-all active:scale-95 cursor-pointer shadow-md ${
            turnState === "AI_SPEAKING"
              ? "bg-emerald-600 hover:bg-rose-600 shadow-emerald-500/30"
              : turnState === "CANDIDATE_SPEAKING"
                ? "bg-brand ring-4 ring-brand/30 shadow-brand/40"
                : "bg-[#7c3aed] hover:bg-[#6d28d9] shadow-[0_4px_16px_rgba(124,58,237,0.35)]"
          }`}
          aria-label="Toggle microphone or interrupt interviewer"
        >
          <Mic className="size-6" />
        </button>

        {/* Stop button -> finishes and evaluates */}
        <button
          type="button"
          onClick={handleStopSession}
          className="flex h-9 items-center gap-1.5 rounded-full border border-red-500 bg-white px-4 text-xs font-semibold text-red-500 shadow-sm transition-colors hover:bg-red-50"
        >
          <Square className="size-3 fill-red-500" />
          <span>Stop</span>
        </button>
      </div>

      {/* Text Mode Toggle */}
      <div className="text-xs text-ink-muted">
        Speak naturally. You can also{" "}
        <button
          type="button"
          onClick={() => setIsTextInput(!isTextInput)}
          className="font-semibold text-[#7c3aed] underline hover:text-[#6d28d9]"
        >
          {isTextInput ? "hide text input" : "switch to text input"}
        </button>
        .
      </div>

      {/* Inline Text Input Form */}
      {isTextInput && (
        <form
          onSubmit={handleSendText}
          className="mt-2 flex w-full items-center gap-2"
        >
          <input
            type="text"
            value={textMessage}
            onChange={(e) => setTextMessage(e.target.value)}
            placeholder="Type your system design response..."
            className="flex-1 rounded-xl border border-[#ede6db] bg-white px-4 py-2.5 text-xs text-ink outline-none focus:border-[#7c3aed]"
          />
          <button
            type="submit"
            className="flex size-9 items-center justify-center rounded-xl bg-[#7c3aed] text-white transition-opacity hover:opacity-95"
          >
            <Send className="size-4" />
          </button>
        </form>
      )}
    </div>
  );

  return (
    <div className="flex w-full flex-col min-h-screen bg-[#fbf9f4] p-4 sm:p-6 lg:p-7 gap-7">
      {/* 1. Header Row matching Figma node 190:4 */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Practice Header & Progress Track */}
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-bold text-brand">
                {activeQuestionIndex + 1} / {totalQuestions}
              </span>
              <span className="text-[#b0a898]">•</span>
              <span className="font-semibold text-ink">
                {topic?.title || "System Design"}
              </span>
            </div>
            <span className="text-sm text-ink-muted">
              ~{topic?.durationMin || 25} min session
            </span>
          </div>

          {/* Progress bar track */}
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#f4efe8]">
            <div
              className="h-full bg-brand transition-all duration-300"
              style={{
                width: `${Math.round(
                  ((activeQuestionIndex + 1) / Math.max(1, totalQuestions)) * 100
                )}%`,
              }}
            />
          </div>
        </div>

        {/* Top Header Action Buttons: Settings & End Session */}
        <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
          <button
            type="button"
            onClick={() => setShowEndModal(true)}
            className="flex size-9 sm:size-10 items-center justify-center rounded-full border border-[#ede6db] bg-white text-ink-muted shadow-sm transition-colors hover:bg-[#faf6f0]"
            aria-label="Settings"
          >
            <Settings className="size-4 text-ink-muted" />
          </button>

          <button
            type="button"
            onClick={() => setShowEndModal(true)}
            className="flex h-9 sm:h-10 items-center justify-center rounded-full border border-red-500 bg-white px-5 text-sm font-semibold text-red-500 shadow-sm transition-colors hover:bg-red-50"
          >
            End Session
          </button>
        </div>
      </div>

      {/* Interactive Question Selector Bar */}
      <PracticeQuestionSelector
        topic={topic}
        questions={questions}
        activeQuestion={activeQuestion}
        activeQuestionIndex={activeQuestionIndex}
        totalQuestions={totalQuestions}
        onSelectQuestion={selectQuestion}
        onNextQuestion={nextQuestion}
        onPreviousQuestion={previousQuestion}
        domainName={domain?.name}
      />

      {/* 2. Main Workspace: Whiteboard View vs Live Conversation View */}
      {isWhiteboardOpen ? (
        <div className="flex flex-col gap-6 w-full">
          <WhiteboardModal
            topicSlug={topic?.slug}
            questionId={activeQuestion?.id}
            onClose={() => setIsWhiteboardOpen(false)}
          />
          {renderAudioDock()}
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6 items-start w-full">
          {/* Left Column: Live AI Conversation & Audio Recording Panel */}
          <div className="flex flex-1 flex-col gap-5 w-full min-w-0">
            {/* Conversation Card */}
            <div className="flex flex-col gap-5 rounded-[24px] border border-[#f4efe8] bg-white p-5 sm:p-6 shadow-[0_4px_16px_rgba(30,28,26,0.03)]">
              {/* Conversation Header */}
              <div className="flex flex-col gap-3 pb-4 border-b border-[#f4efe8] sm:flex-row sm:items-center sm:justify-between">
                {/* Interviewer Profile Info */}
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-[#f5f0ff] border border-[#ede9fe] text-[#7c3aed]">
                    <Cpu className="size-5" />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-display font-bold text-ink text-base">
                        AI Interviewer
                      </span>
                      <span className="rounded bg-brand px-1.5 py-0.5 text-[10px] font-bold text-white tracking-wider">
                        LIVE PRACTICE
                      </span>
                    </div>
                    <span className="text-xs text-ink-muted">
                      System Design Interview
                    </span>
                  </div>
                </div>

                {/* Timer Pill */}
                <div className="flex items-center gap-2 self-start rounded-full border border-[#f4efe8] bg-white px-3.5 py-1.5 text-xs font-mono shadow-sm sm:self-center">
                  <span className="size-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="font-bold text-ink">
                    {formatTimer(secondsElapsed)}
                  </span>
                  <span className="text-ink-muted">/ 30:00</span>
                </div>
              </div>

              {/* Chat History Bubbles */}
              <div className="flex flex-col gap-4">
                {messages.map((msg, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div
                      className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${
                        msg.sender === "user"
                          ? "bg-[#fff0ec] text-brand"
                          : "bg-[#f5f0ff] text-[#7c3aed]"
                      }`}
                    >
                      {msg.sender === "user" ? (
                        <User className="size-4" />
                      ) : (
                        <Cpu className="size-4" />
                      )}
                    </div>
                    <div
                      className={`flex flex-1 flex-col gap-2 rounded-2xl p-4 text-sm leading-relaxed text-ink ${
                        msg.sender === "user" ? "bg-[#f5f3ff]" : "bg-[#faf6f0]"
                      }`}
                    >
                      <p className="font-medium whitespace-pre-wrap">{msg.content}</p>
                      {msg.details && msg.details.length > 0 && (
                        <div className="flex flex-col gap-1.5 pt-1 text-xs text-ink-muted">
                          {msg.details.map((detail, dIdx) => (
                            <p key={dIdx} className="leading-relaxed">
                              {detail}
                            </p>
                          ))}
                        </div>
                      )}
                      {msg.sender === "ai" && i === 0 && (
                        <div className="flex items-center gap-1.5 pt-1 text-xs font-medium text-[#7c3aed]">
                          <Info className="size-3.5 shrink-0" />
                          <span>
                            Clarifying questions help you in real interviews
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isAiThinking && (
                  <div className="flex items-start gap-3">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#f5f0ff] text-[#7c3aed]">
                      <Cpu className="size-4" />
                    </div>
                    <div className="flex items-center gap-2 rounded-2xl bg-[#faf6f0] p-4 text-xs font-medium text-ink-muted">
                      <Loader2 className="size-3.5 animate-spin text-[#7c3aed]" />
                      <span>Sarah is formulating follow-up probes...</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Audio Recording Dock */}
            {renderAudioDock()}
          </div>

          {/* Right Column: Assistant Tools, Tips & Progress (width 300px) */}
          <div className="flex flex-col gap-5 w-full lg:w-[300px] shrink-0">
            {/* Card 1: Interview Tools */}
            <div className="flex flex-col gap-4 rounded-2xl border border-[#ede6db] bg-white p-5 shadow-sm">
              <h2 className="font-display font-bold text-sm text-ink">
                Interview Tools
              </h2>
              <div className="grid grid-cols-2 gap-2.5">
                {/* Whiteboard -> opens full Whiteboard canvas matching node 196:219 */}
                <button
                  type="button"
                  onClick={() => setIsWhiteboardOpen(true)}
                  className="flex flex-col items-center justify-center gap-2 rounded-xl border border-[#f4efe8] bg-white p-3.5 text-xs font-semibold text-ink shadow-sm transition-colors hover:border-[#7c3aed]/40 hover:bg-[#faf6f0]"
                >
                  <div className="flex size-6 items-center justify-center text-[#7c3aed]">
                    <LayoutGrid className="size-5" />
                  </div>
                  <span>Whiteboard</span>
                </button>

                {/* Draw Diagram */}
                <button
                  type="button"
                  onClick={() => setActiveTool("diagram")}
                  className="flex flex-col items-center justify-center gap-2 rounded-xl border border-[#f4efe8] bg-white p-3.5 text-xs font-semibold text-ink shadow-sm transition-colors hover:border-[#7c3aed]/40 hover:bg-[#faf6f0]"
                >
                  <div className="flex size-6 items-center justify-center text-[#7c3aed]">
                    <Network className="size-5" />
                  </div>
                  <span>Draw Diagram</span>
                </button>

                {/* Code Block */}
                <button
                  type="button"
                  onClick={() => setActiveTool("code")}
                  className="flex flex-col items-center justify-center gap-2 rounded-xl border border-[#f4efe8] bg-white p-3.5 text-xs font-semibold text-ink shadow-sm transition-colors hover:border-[#7c3aed]/40 hover:bg-[#faf6f0]"
                >
                  <div className="flex size-6 items-center justify-center text-[#7c3aed]">
                    <FileCode className="size-5" />
                  </div>
                  <span>Code Block</span>
                </button>

                {/* Notes */}
                <button
                  type="button"
                  onClick={() => setActiveTool("notes")}
                  className="flex flex-col items-center justify-center gap-2 rounded-xl border border-[#f4efe8] bg-white p-3.5 text-xs font-semibold text-ink shadow-sm transition-colors hover:border-[#7c3aed]/40 hover:bg-[#faf6f0]"
                >
                  <div className="flex size-6 items-center justify-center text-[#7c3aed]">
                    <FileText className="size-5" />
                  </div>
                  <span>Notes</span>
                </button>
              </div>
            </div>

            {/* Card 2: Rubric Guide & Key Criteria */}
            <div className="flex flex-col gap-3.5 rounded-2xl border border-[#ede6db] bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <Target className="size-4 text-brand" />
                <h2 className="font-display font-bold text-sm text-ink">
                  Rubric Criteria
                </h2>
              </div>

              {activeQuestion.rubricAtoms && activeQuestion.rubricAtoms.length > 0 ? (
                <div className="flex flex-col gap-2.5">
                  {activeQuestion.rubricAtoms.map((atom, idx) => {
                    const isCovered = coveredAtoms.some(
                      (ca) =>
                        ca.toLowerCase().includes(atom.toLowerCase()) ||
                        atom.toLowerCase().includes(ca.toLowerCase())
                    );

                    return (
                      <div
                        key={idx}
                        className={`flex items-start gap-2.5 text-xs p-1.5 rounded-lg transition-colors ${
                          isCovered
                            ? "bg-emerald-500/10 border border-emerald-500/20"
                            : "hover:bg-cream/40"
                        }`}
                      >
                        {isCovered ? (
                          <CheckCircle2 className="size-4 shrink-0 text-[#10b981] mt-0.5" />
                        ) : (
                          <div className="size-2 rounded-full bg-line mt-1.5 shrink-0 ml-1" />
                        )}
                        <span
                          className={`leading-tight ${
                            isCovered
                              ? "font-bold text-ink"
                              : "text-ink-muted font-normal"
                          }`}
                        >
                          {atom}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col gap-2.5 text-xs text-ink-muted">
                  <p>{activeQuestion.rubricGuide}</p>
                </div>
              )}
            </div>

            {/* Card 3: Today's Progress */}
            <div className="flex flex-col gap-3.5 rounded-2xl border border-[#ede6db] bg-white p-5 shadow-sm">
              <h2 className="font-display font-bold text-sm text-ink">
                Today&apos;s Progress
              </h2>
              <div className="flex items-center gap-4">
                {/* Circular Progress Ring */}
                <div className="relative flex size-14 shrink-0 items-center justify-center">
                  <svg className="size-full -rotate-90" viewBox="0 0 56 56">
                    <circle
                      cx="28"
                      cy="28"
                      r="22"
                      stroke="#ede6db"
                      strokeWidth="4"
                      fill="none"
                    />
                    <circle
                      cx="28"
                      cy="28"
                      r="22"
                      stroke="#7c3aed"
                      strokeWidth="4"
                      strokeDasharray={138}
                      strokeDashoffset={
                        138 -
                        (138 * (activeQuestionIndex + 1)) / Math.max(1, totalQuestions)
                      }
                      strokeLinecap="round"
                      fill="none"
                    />
                  </svg>
                  <span className="absolute text-xs font-bold text-ink">
                    {activeQuestionIndex + 1}/{totalQuestions}
                  </span>
                </div>

                {/* Progress Meta */}
                <div className="flex flex-col gap-0.5">
                  <span className="font-bold text-sm text-ink truncate max-w-[170px]">
                    {topic?.title || "System Design"}
                  </span>
                  <span className="text-xs text-ink-muted">
                    Question {activeQuestionIndex + 1} of {totalQuestions}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Tool Modal (for Diagram, Code, Notes) */}
      {activeTool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="flex w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-[#f4efe8] px-5 py-3.5 bg-[#faf6f0]">
              <span className="font-display font-bold text-sm text-ink uppercase tracking-wider">
                {activeTool === "diagram" && "System Architecture Diagram"}
                {activeTool === "code" && "Code & API Definitions"}
                {activeTool === "notes" && "Session Scratchpad"}
              </span>
              <button
                type="button"
                onClick={() => setActiveTool(null)}
                className="flex size-7 items-center justify-center rounded-full hover:bg-black/5 text-ink-muted"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="p-5 flex flex-col gap-3">
              {activeTool === "notes" && (
                <textarea
                  value={notesContent}
                  onChange={(e) => setNotesContent(e.target.value)}
                  placeholder="Jot down numbers, QPS estimates, storage requirements..."
                  rows={8}
                  className="w-full rounded-xl border border-[#ede6db] p-3 text-xs font-sans text-ink outline-none focus:border-[#7c3aed]"
                />
              )}

              {activeTool === "code" && (
                <textarea
                  value={codeContent}
                  onChange={(e) => setCodeContent(e.target.value)}
                  rows={8}
                  className="w-full rounded-xl border border-[#2e2a27] bg-[#1e1c1a] p-3 font-mono text-xs text-[#f7f5f0] outline-none"
                />
              )}

              {activeTool === "diagram" && (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#ede6db] bg-[#faf6f0] p-10 text-center text-xs text-ink-muted gap-2">
                  <Network className="size-8 text-[#7c3aed]" />
                  <span className="font-semibold text-ink">
                    Interactive Diagram Canvas
                  </span>
                  <span>
                    Client → DNS → Load Balancer → API Gateways → Redis Cache /
                    DB Cluster
                  </span>
                </div>
              )}

              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={() => setActiveTool(null)}
                  className="rounded-full bg-brand px-5 py-2 text-xs font-semibold text-white shadow-sm hover:opacity-95"
                >
                  Save & Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* End Session Confirmation Modal */}
      {showEndModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="flex w-full max-w-sm flex-col gap-4 rounded-2xl bg-white p-6 shadow-xl text-center">
            <h3 className="font-display font-bold text-lg text-ink">
              End Practice Session?
            </h3>
            <p className="text-xs text-ink-muted leading-relaxed">
              Are you sure you want to end this session early? Your progress so
              far will be saved.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowEndModal(false)}
                className="rounded-full border border-[#ede6db] bg-white px-4 py-2 text-xs font-semibold text-ink shadow-sm hover:bg-[#faf6f0]"
              >
                Continue Session
              </button>
              <button
                type="button"
                disabled={isEndingSession}
                onClick={handleEndSession}
                className="flex items-center gap-1.5 rounded-full bg-red-500 px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-red-600 disabled:opacity-50"
              >
                {isEndingSession ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" />
                    <span>Evaluating...</span>
                  </>
                ) : (
                  <span>End Now</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
