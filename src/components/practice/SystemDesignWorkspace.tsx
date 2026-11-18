"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Settings,
  Cpu,
  User,
  Info,
  LayoutGrid,
  Network,
  FileCode,
  FileText,
  Lightbulb,
  CheckCircle2,
  X,
  BookOpen,
  Target,
  Loader2,
} from "lucide-react";
import { WhiteboardModal } from "./WhiteboardModal";
import { useCurriculumTopic } from "@/hooks/useCurriculumTopic";
import { PracticeQuestionSelector } from "./PracticeQuestionSelector";
import { backendApi } from "@/lib/api-client";
import { useAiVoiceInterviewer } from "@/hooks/useAiVoiceInterviewer";
import { AiVoiceInterviewerDock } from "@/components/voice/AiVoiceInterviewerDock";

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

  // Reusable Autonomous AI Voice Interviewer hook
  const voice = useAiVoiceInterviewer({
    topicSlug: topic?.slug || "distributed-caching",
    questionId: activeQuestion?.id,
    initialPrompt: activeQuestion?.prompt,
    initialHints: activeQuestion?.hints,
    candidateRole: "Senior Software Engineer",
  });

  // Timer: starts at 00:00 and counts up towards 30:00
  const [secondsElapsed, setSecondsElapsed] = useState(0);

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

  // Update initial code template when topic changes
  useEffect(() => {
    if (topic) {
      setCodeContent(
        `// Outline key services and architectural interfaces for ${topic.title}\n// Domain: ${domain?.name || "System Design"} | Category: ${category?.name || "Architecture"}\n\nPOST /api/v1/resource\nGET /api/v1/resource/:id\n`
      );
    }
  }, [topic, domain, category]);

  // Elapsed timer tick (pauses when voice is paused)
  useEffect(() => {
    if (voice.isPaused) return;
    const interval = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [voice.isPaused]);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const [isEndingSession, setIsEndingSession] = useState(false);
  const router = useRouter();

  // Track all questions visited/covered during this practice session
  const [coveredQuestionIds, setCoveredQuestionIds] = useState<Set<string>>(
    () => new Set()
  );

  // Auto-register current question into covered set
  useEffect(() => {
    if (activeQuestion?.id) {
      setCoveredQuestionIds((prev) => {
        if (prev.has(activeQuestion.id)) return prev;
        const next = new Set(prev);
        next.add(activeQuestion.id);
        return next;
      });
    }
  }, [activeQuestion?.id]);

  const handleTogglePause = () => {
    voice.togglePause();
  };

  const handleStopSession = () => {
    setShowEndModal(true);
  };

  const handleEndSession = useCallback(async () => {
    try {
      setIsEndingSession(true);
      voice.stopAndReleaseAudio();
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
          transcriptHistory: voice.messages.map((m) => ({
            sender: m.sender,
            content: m.content,
          })),
          coveredRubricAtoms: voice.coveredRubricAtoms,
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
  }, [
    topic,
    activeQuestion,
    domain,
    codeContent,
    notesContent,
    voice,
    secondsElapsed,
    router,
  ]);

  const handleSkipQuestion = useCallback(() => {
    if (!questions || questions.length === 0) return;

    // 1. Mark current question as covered
    const currentId = activeQuestion?.id;
    const updated = new Set(coveredQuestionIds);
    if (currentId) {
      updated.add(currentId);
      setCoveredQuestionIds(updated);
    }

    // 2. Identify any unvisited / uncovered questions in this topic
    const remaining = questions.filter((q) => !updated.has(q.id));

    // 3. If ALL questions are now covered, trigger the automatic interview wrap-up and evaluation!
    if (remaining.length === 0) {
      voice.handleSkipQuestionAudio();
      voice.setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          content: `Excellent work! You have covered all architectural scenarios for "${topic?.title || "System Design"}". Compiling your final evaluation report now...`,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
      handleEndSession();
      return;
    }

    // 4. Otherwise, jump directly to the next uncovered question
    const nextQ = remaining[0];
    const nextIdx = questions.findIndex((q) => q.id === nextQ.id);

    // Synchronously jump to the unvisited question in memory (<1ms)
    selectQuestion(nextQ.id);

    // Immediately halt previous audio without waiting for candidate voice
    voice.handleSkipQuestionAudio(nextQ?.prompt);

    // Post conversational transition into live chat
    voice.setMessages((prev) => [
      ...prev,
      {
        sender: "ai",
        content: `Got it! Let's move to Question ${nextIdx + 1} of ${totalQuestions}: "${nextQ?.title || topic?.title}".\n\n${nextQ?.prompt || ""}`,
        details: nextQ?.hints,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
  }, [
    activeQuestion?.id,
    coveredQuestionIds,
    questions,
    totalQuestions,
    topic?.title,
    selectQuestion,
    voice,
    handleEndSession,
  ]);

  // Global capture keyboard shortcut listener (Esc key triggers Skip Question instantly)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't skip if candidate is actively editing a note or typing text
      const target = e.target as HTMLElement | null;
      const tagName = (target?.tagName || "").toLowerCase();
      if (tagName === "input" || tagName === "textarea" || target?.isContentEditable) {
        return;
      }

      if (e.key === "Escape" || e.keyCode === 27) {
        e.preventDefault();
        e.stopPropagation();
        handleSkipQuestion();
      }
    };

    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [handleSkipQuestion]);

  const renderAudioDock = () => (
    <AiVoiceInterviewerDock
      turnState={voice.turnState}
      isCallActive={voice.isCallActive}
      isPaused={voice.isPaused}
      isMuted={voice.isMuted}
      waveformBars={voice.waveformBars}
      silenceCountdown={voice.silenceCountdown}
      isTextInput={voice.isTextInput}
      textMessage={voice.textMessage}
      interviewerName="Sarah"
      onStartSession={voice.startSession}
      onTogglePause={voice.togglePause}
      onToggleMute={voice.toggleMute}
      onBargeIn={voice.handleBargeIn}
      onFinalizeTurn={voice.finalizeCandidateSpokenTurn}
      onStopSession={handleStopSession}
      onSkipQuestion={handleSkipQuestion}
      onToggleTextInput={() => voice.setIsTextInput(!voice.isTextInput)}
      onTextMessageChange={voice.setTextMessage}
      onSendTextMessage={voice.sendTextMessage}
    />
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
                {Math.min(coveredQuestionIds.size, totalQuestions)} / {totalQuestions} Covered
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
                  (Math.min(coveredQuestionIds.size, Math.max(1, totalQuestions)) /
                    Math.max(1, totalQuestions)) *
                    100
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
                {voice.messages.map((msg, i) => (
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

                {(voice.isProcessing || voice.turnState === "PROCESSING") && (
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
                    const isCovered = voice.coveredRubricAtoms.some(
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
      {showEndModal && !isEndingSession && (
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
                className="flex items-center gap-1.5 rounded-full bg-red-500 px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-red-600 disabled:opacity-50 cursor-pointer"
              >
                <span>End Now</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Auto-Evaluation Loading Overlay when all questions are completed or submitting */}
      {isEndingSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="flex w-full max-w-sm flex-col items-center gap-4 rounded-3xl bg-white p-6 sm:p-7 shadow-2xl text-center animate-in fade-in zoom-in-95">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-[#f5f0ff] border border-[#ede9fe] text-[#7c3aed]">
              <Cpu className="size-7 animate-pulse" />
            </div>
            <div className="flex flex-col gap-1.5">
              <h3 className="font-display font-bold text-base text-ink">
                All Scenarios Completed!
              </h3>
              <p className="text-xs text-ink-muted leading-relaxed">
                Sarah is compiling your diagnostic architecture evaluation report, rubric scores, and design strengths...
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#7c3aed] pt-1">
              <Loader2 className="size-4 animate-spin" />
              <span>Redirecting to Evaluation Scorecard...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
