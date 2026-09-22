"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Cpu,
  User,
  Info,
  Pause,
  Play,
  Mic,
  MicOff,
  Square,
  Send,
  FileText,
  Star,
  BookOpen,
  List,
  Lightbulb,
  Check,
  ChevronRight,
  X,
  Settings,
} from "lucide-react";

// Static Waveform Heights matching Figma Node 214:4
const WAVEFORM_BARS = [
  10, 16, 24, 18, 12, 8, 14, 20, 26, 15, 9, 13, 22, 17, 11, 25, 20, 14, 8, 12,
  18, 24, 10, 6,
];

interface ChatMessage {
  id: string;
  sender: "ai" | "user";
  text: string;
  secondaryText?: string;
  badge?: string;
  showClarifyTip?: boolean;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "msg-1",
    sender: "ai",
    text: "Tell me about a time you disagreed with a team member.",
    secondaryText:
      "Take your time to think. You can structure your answer using STAR.",
    showClarifyTip: true,
  },
  {
    id: "msg-2",
    sender: "user",
    text: "Can you clarify what kind of disagreement you are most interested in? Technical, product, or working style?",
  },
  {
    id: "msg-3",
    sender: "ai",
    badge: "Good question!",
    text: "I'm interested in a technical disagreement where you had a different opinion on the approach or solution. Please go ahead and walk me through the situation.",
  },
];

export function BehavioralWorkspace() {
  const router = useRouter();

  // Timer: Start at 45 seconds (matching Figma "00:45 / 07:00")
  const [elapsedSeconds, setElapsedSeconds] = useState(45);
  const [isPaused, setIsPaused] = useState(false);
  const [isMicMuted, setIsMicMuted] = useState(false);

  // Chat & text input
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [textInput, setTextInput] = useState("");
  const [isTextInput, setIsTextInput] = useState(false);

  // Modals
  const [showEndModal, setShowEndModal] = useState(false);
  const [activeModal, setActiveModal] = useState<
    "notes" | "star" | "sample" | "pointers" | null
  >(null);
  const [notes, setNotes] = useState("");

  // Elapsed timer ticker
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => (prev < 420 ? prev + 1 : prev));
    }, 1000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleTogglePause = () => {
    setIsPaused((prev) => !prev);
  };

  const handleToggleMic = () => {
    setIsMicMuted((prev) => !prev);
  };

  const handleSendText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: textInput.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setTextInput("");

    // Simulate AI response after candidate responds
    setTimeout(() => {
      const aiReply: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        badge: "Understood.",
        text: "Thank you for explaining the Situation and Task clearly. What specific actions did you take to reach alignment with your peer?",
      };
      setMessages((prev) => [...prev, aiReply]);
    }, 1200);
  };

  return (
    <div className="flex w-full flex-col min-h-screen bg-[#fbf9f4] p-4 sm:p-6 lg:p-7 gap-7">
      {/* 1. Header Row matching system-design / Figma node 190:4 */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Practice Header & Progress Track */}
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-bold text-brand">4 / 4</span>
              <span className="text-[#b0a898]">•</span>
              <span className="font-semibold text-ink">Behavioral</span>
            </div>
            <span className="text-sm text-ink-muted">~7 min remaining</span>
          </div>

          {/* Progress bar track (Step 4 of 4 ~ 100% completed) */}
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#f4efe8]">
            <div className="h-full w-full bg-brand transition-all duration-300" />
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

      {/* 2. Question Header Row */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2.5">
          <span className="rounded bg-[#fff0ec] px-2 py-0.5 text-xs font-bold text-brand">
            Behavioral
          </span>
          <span className="text-sm font-semibold text-ink-muted">
            Leadership &amp; Conflict
          </span>
        </div>
        <h1 className="font-display text-xl font-extrabold text-ink tracking-tight sm:text-2xl lg:text-[28px]">
          Tell me about a time you disagreed with a team member.
        </h1>
        <p className="text-sm leading-relaxed text-ink-muted sm:text-[15px]">
          This is a common behavioral interview question at Google. Use the STAR
          method (Situation, Task, Action, Result) to structure your answer.
        </p>
      </div>

      {/* 3. Two-Column Workspace Layout */}
      <div className="flex flex-1 flex-col lg:flex-row items-start gap-6">
        {/* Left Column: Conversation & Audio Dock */}
        <div className="flex-1 min-w-0 w-full flex flex-col rounded-[24px] border border-[#f4efe8] bg-white p-5 sm:p-6 shadow-[0_4px_16px_rgba(30,28,26,0.03)] gap-5">
          {/* Card Header: AI Interviewer + LIVE PRACTICE + Timer */}
          <div className="flex flex-col gap-3 pb-4 border-b border-[#f4efe8] sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-[#f5f3ff] border border-[#ede9fe] text-[#7c3aed]">
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
                  Behavioral Interview
                </span>
              </div>
            </div>

            {/* Timer Bubble */}
            <div className="flex items-center gap-2 self-start rounded-full border border-[#f4efe8] bg-white px-3.5 py-1.5 text-xs font-mono shadow-sm sm:self-center">
              <div className="size-2 rounded-full bg-red-500 animate-pulse" />
              <span className="font-bold text-ink">
                {formatTimer(elapsedSeconds)}
              </span>
              <span className="text-ink-muted">/ 07:00</span>
            </div>
          </div>

          {/* Chat History */}
          <div className="flex flex-col gap-4 overflow-y-auto max-h-[500px] pr-1">
            {messages.map((msg) => {
              if (msg.sender === "ai") {
                return (
                  <div key={msg.id} className="flex items-start gap-3">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#f5f3ff] text-[#7c3aed]">
                      <Cpu className="size-4" />
                    </div>
                    <div className="flex flex-1 flex-col gap-2 rounded-2xl rounded-tl-sm bg-[#fbf9f4] p-4 text-sm text-[#1e1c1a]">
                      {msg.badge && (
                        <p className="font-bold text-[#1e1c1a]">{msg.badge}</p>
                      )}
                      <p
                        className={
                          msg.badge ? "leading-relaxed" : "font-medium"
                        }
                      >
                        {msg.text}
                      </p>
                      {msg.secondaryText && (
                        <p className="text-[#6b6661]">{msg.secondaryText}</p>
                      )}
                      {msg.showClarifyTip && (
                        <div className="flex items-center gap-1.5 text-xs font-medium text-[#7c3aed] pt-1">
                          <Info className="size-3.5" />
                          <span>
                            💡 Feel free to ask for clarification if needed.
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={msg.id}
                  className="flex items-start gap-3 justify-end"
                >
                  <div className="flex flex-1 rounded-2xl rounded-tr-sm bg-[#f5f3ff] p-4 text-sm text-[#1e1c1a]">
                    <p className="leading-relaxed">{msg.text}</p>
                  </div>
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#fff0ec] text-[#ff6c47]">
                    <User className="size-4" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Audio Recording Dock */}
          <div className="mt-auto flex flex-col items-center gap-3.5 rounded-2xl border border-[#7c3aed] bg-[#f5f3ff] p-5 text-center shadow-sm">
            {/* Status */}
            <span className="text-xs font-bold uppercase tracking-wider text-[#7c3aed]">
              {isPaused ? "Paused" : "Listening..."}
            </span>

            {/* Waveform (24 bars matching Figma) */}
            <div className="flex h-7 items-center justify-center gap-1">
              {WAVEFORM_BARS.map((height, idx) => (
                <div
                  key={idx}
                  className="w-[3px] rounded-full bg-[#7c3aed] transition-all duration-200"
                  style={{
                    height: isPaused ? "4px" : `${height}px`,
                    opacity: isPaused ? 0.35 : 1,
                  }}
                />
              ))}
            </div>

            {/* Recording Controls */}
            <div className="flex items-center gap-4 pt-1">
              {/* Pause / Resume */}
              <button
                type="button"
                onClick={handleTogglePause}
                className="flex h-9 items-center gap-1.5 rounded-full border border-[#7c3aed] bg-white px-5 text-xs font-semibold text-[#7c3aed] shadow-sm transition-colors hover:bg-[#ede9fe]"
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

              {/* Center Mic Circle */}
              <button
                type="button"
                onClick={handleToggleMic}
                className={`flex size-14 items-center justify-center rounded-full text-white shadow-md transition-all ${
                  isMicMuted
                    ? "bg-[#b0a898] hover:bg-[#968f82]"
                    : "bg-[#7c3aed] hover:bg-[#6d28d9] ring-4 ring-[#7c3aed]/20"
                }`}
                aria-label={
                  isMicMuted ? "Unmute microphone" : "Mute microphone"
                }
              >
                {isMicMuted ? (
                  <MicOff className="size-6" />
                ) : (
                  <Mic className="size-6" />
                )}
              </button>

              {/* Stop Button */}
              <button
                type="button"
                onClick={() => setShowEndModal(true)}
                className="flex h-9 items-center gap-1.5 rounded-full border border-[#ef4444] bg-white px-5 text-xs font-semibold text-[#ef4444] shadow-sm transition-colors hover:bg-red-50"
              >
                <Square className="size-2.5 fill-[#ef4444]" />
                <span>Stop</span>
              </button>
            </div>

            {/* Subtitle / Switch to Text input */}
            <div className="text-xs text-[#6b6661]">
              Speak naturally. You can also{" "}
              <button
                type="button"
                onClick={() => setIsTextInput(!isTextInput)}
                className="font-medium text-[#7c3aed] underline underline-offset-2 hover:opacity-80"
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
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Type your response using STAR..."
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
        </div>

        {/* Right Column: Assistant Cards */}
        <div className="w-full lg:w-[300px] xl:w-[320px] shrink-0 flex flex-col gap-5">
          {/* Card 1: Interview Tools */}
          <div className="flex flex-col gap-4 rounded-2xl border border-[#ede6db] bg-white p-5 shadow-sm">
            <h3 className="text-sm font-bold text-[#1e1c1a]">
              Interview Tools
            </h3>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setActiveModal("notes")}
                className="flex flex-col items-center justify-center gap-2 rounded-xl border border-[#f4efe8] bg-white py-3 px-2 transition-all hover:border-[#7c3aed]/40 hover:bg-[#faf5ff]"
              >
                <FileText className="size-5 text-[#7c3aed]" />
                <span className="text-xs font-semibold text-[#1e1c1a]">
                  Notes
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveModal("star")}
                className="flex flex-col items-center justify-center gap-2 rounded-xl border border-[#f4efe8] bg-white py-3 px-2 transition-all hover:border-[#7c3aed]/40 hover:bg-[#faf5ff]"
              >
                <Star className="size-5 text-[#7c3aed]" />
                <span className="text-xs font-semibold text-[#1e1c1a]">
                  STAR Helper
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveModal("sample")}
                className="flex flex-col items-center justify-center gap-2 rounded-xl border border-[#f4efe8] bg-white py-3 px-2 transition-all hover:border-[#7c3aed]/40 hover:bg-[#faf5ff]"
              >
                <BookOpen className="size-5 text-[#7c3aed]" />
                <span className="text-xs font-semibold text-[#1e1c1a]">
                  Sample Answers
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveModal("pointers")}
                className="flex flex-col items-center justify-center gap-2 rounded-xl border border-[#f4efe8] bg-white py-3 px-2 transition-all hover:border-[#7c3aed]/40 hover:bg-[#faf5ff]"
              >
                <List className="size-5 text-[#7c3aed]" />
                <span className="text-xs font-semibold text-[#1e1c1a]">
                  Key Pointers
                </span>
              </button>
            </div>
          </div>

          {/* Card 2: Tips for Behavioral Interviews */}
          <div className="flex flex-col gap-4 rounded-2xl border border-[#ede6db] bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <Lightbulb className="size-4 text-[#ff6c47]" />
              <h3 className="text-sm font-bold text-[#1e1c1a]">
                Tips for Behavioral Interviews
              </h3>
            </div>

            <div className="flex flex-col gap-3">
              {[
                "Use the STAR method (Situation, Task, Action, Result)",
                "Be specific and give real examples",
                "Focus on your actions and decision making",
                "Highlight what you learned",
                "Keep your answer concise and structured",
                "Be honest and authentic",
              ].map((tip, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <div className="flex size-4 shrink-0 items-center justify-center rounded-full bg-[#edf7f4] text-[#0b8a8f] mt-0.5">
                    <Check className="size-2.5 stroke-[3]" />
                  </div>
                  <span className="text-xs leading-snug text-[#6b6661]">
                    {tip}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 3: Today's Progress */}
          <div className="flex flex-col gap-3.5 rounded-2xl border border-[#ede6db] bg-white p-5 shadow-sm">
            <h3 className="text-sm font-bold text-[#1e1c1a]">
              Today&apos;s Progress
            </h3>

            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {/* 4/4 Circle Gauge */}
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full border-[3px] border-[#7c3aed] text-xs font-bold text-[#7c3aed]">
                  4/4
                </div>

                <div className="flex flex-col">
                  <span className="text-sm font-bold text-[#1e1c1a]">
                    Behavioral
                  </span>
                  <span className="text-xs text-[#6b6661]">
                    Question 4 of 4
                  </span>
                </div>
              </div>

              <ChevronRight className="size-4 text-[#6b6661]" />
            </div>
          </div>
        </div>
      </div>

      {/* MODAL 1: Notes */}
      {activeModal === "notes" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="flex w-full max-w-lg flex-col rounded-2xl border border-[#ede6db] bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#f4efe8]">
              <div className="flex items-center gap-2">
                <FileText className="size-5 text-[#7c3aed]" />
                <h3 className="text-base font-bold text-[#1e1c1a]">
                  Candidate Notes
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="text-[#6b6661] hover:text-[#1e1c1a]"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="py-4">
              <p className="text-xs text-[#6b6661] mb-2">
                Jot down bullet points, key metrics, or timeline markers for
                your answer. These notes are saved during your session.
              </p>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Situation: Migration from REST to GraphQL...&#10;Task: Lead architecture design...&#10;Action: Created benchmark POC...&#10;Result: 40% latency reduction..."
                rows={7}
                className="w-full rounded-xl border border-[#ede6db] p-3 text-sm text-[#1e1c1a] outline-none focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed]"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="rounded-xl bg-[#7c3aed] px-5 py-2 text-xs font-semibold text-white hover:bg-[#6d28d9]"
              >
                Save &amp; Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: STAR Helper */}
      {activeModal === "star" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="flex w-full max-w-xl flex-col rounded-2xl border border-[#ede6db] bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#f4efe8]">
              <div className="flex items-center gap-2">
                <Star className="size-5 text-[#7c3aed]" />
                <h3 className="text-base font-bold text-[#1e1c1a]">
                  STAR Method Framework
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="text-[#6b6661] hover:text-[#1e1c1a]"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-4">
              <div className="rounded-xl border border-[#ede6db] bg-[#faf6f0] p-3">
                <span className="font-bold text-[#ff6c47] text-xs uppercase tracking-wider">
                  Situation
                </span>
                <p className="text-xs text-[#6b6661] mt-1">
                  Describe the technical project, team context, and what caused
                  differing technical opinions.
                </p>
              </div>
              <div className="rounded-xl border border-[#ede6db] bg-[#faf6f0] p-3">
                <span className="font-bold text-[#7c3aed] text-xs uppercase tracking-wider">
                  Task
                </span>
                <p className="text-xs text-[#6b6661] mt-1">
                  What was your specific ownership, responsibility, and goal
                  that needed to be delivered?
                </p>
              </div>
              <div className="rounded-xl border border-[#ede6db] bg-[#faf6f0] p-3">
                <span className="font-bold text-[#0b8a8f] text-xs uppercase tracking-wider">
                  Action
                </span>
                <p className="text-xs text-[#6b6661] mt-1">
                  What did YOU do to resolve it? (Run benchmarks, propose a POC,
                  listen to their concerns, reach data-driven consensus).
                </p>
              </div>
              <div className="rounded-xl border border-[#ede6db] bg-[#faf6f0] p-3">
                <span className="font-bold text-[#10b981] text-xs uppercase tracking-wider">
                  Result
                </span>
                <p className="text-xs text-[#6b6661] mt-1">
                  What was the quantified impact, project delivery status, and
                  how did your team relationship strengthen?
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="rounded-xl bg-[#7c3aed] px-5 py-2 text-xs font-semibold text-white hover:bg-[#6d28d9]"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Sample Answers */}
      {activeModal === "sample" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="flex w-full max-w-2xl max-h-[85vh] overflow-y-auto flex-col rounded-2xl border border-[#ede6db] bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#f4efe8]">
              <div className="flex items-center gap-2">
                <BookOpen className="size-5 text-[#7c3aed]" />
                <h3 className="text-base font-bold text-[#1e1c1a]">
                  High-Scoring Sample Answer (Google L5 Benchmark)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="text-[#6b6661] hover:text-[#1e1c1a]"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="flex flex-col gap-3 py-4 text-xs text-[#1e1c1a] leading-relaxed">
              <div className="rounded-xl bg-[#fbf9f4] p-3.5 border border-[#ede6db]">
                <strong className="text-[#ff6c47]">
                  Situation &amp; Task:
                </strong>
                <p className="mt-1 text-[#6b6661]">
                  &quot;While migrating our high-throughput payment ingestion
                  pipeline, a senior peer proposed rewriting our data layer
                  using an experimental NoSQL store for write throughput. I was
                  concerned about eventual consistency risks with audit
                  compliance.&quot;
                </p>
              </div>
              <div className="rounded-xl bg-[#fbf9f4] p-3.5 border border-[#ede6db]">
                <strong className="text-[#0b8a8f]">Action Taken:</strong>
                <p className="mt-1 text-[#6b6661]">
                  &quot;Rather than debating abstractly, I scheduled a 1:1 sync
                  to understand their throughput goals. I offered to build a
                  side-by-side benchmark prototype over 2 days. The data showed
                  PostgreSQL with partitioned tables met our throughput needs
                  while guaranteeing ACID compliance.&quot;
                </p>
              </div>
              <div className="rounded-xl bg-[#fbf9f4] p-3.5 border border-[#ede6db]">
                <strong className="text-[#10b981]">
                  Result &amp; Learning:
                </strong>
                <p className="mt-1 text-[#6b6661]">
                  &quot;The peer appreciated the data-driven approach and became
                  the co-author on the design doc. The pipeline went live with
                  99.999% uptime and zero ledger discrepancy. I learned that
                  objective metrics and collaborative prototypes turn friction
                  into partnership.&quot;
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="rounded-xl bg-[#7c3aed] px-5 py-2 text-xs font-semibold text-white hover:bg-[#6d28d9]"
              >
                Close Sample
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: Key Pointers */}
      {activeModal === "pointers" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="flex w-full max-w-lg flex-col rounded-2xl border border-[#ede6db] bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#f4efe8]">
              <div className="flex items-center gap-2">
                <List className="size-5 text-[#7c3aed]" />
                <h3 className="text-base font-bold text-[#1e1c1a]">
                  What Interviewers Look For
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="text-[#6b6661] hover:text-[#1e1c1a]"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="flex flex-col gap-2.5 py-4">
              {[
                {
                  title: "Decide with Data, Not Ego",
                  desc: "Show that you evaluate ideas based on customer impact, benchmarks, and tradeoffs.",
                },
                {
                  title: "Disagree and Commit",
                  desc: "Once a team consensus or lead decision is reached, you fully back the decision without resentment.",
                },
                {
                  title: "Empathy & Active Listening",
                  desc: "Demonstrate that you actively sought to understand your colleague's perspective before defending your own.",
                },
                {
                  title: "Ownership & Reflection",
                  desc: "Highlight lessons learned and how the relationship or team workflow improved afterward.",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-[#ede6db] p-3 bg-[#faf6f0]"
                >
                  <p className="text-xs font-bold text-[#1e1c1a]">
                    {item.title}
                  </p>
                  <p className="text-xs text-[#6b6661] mt-0.5">{item.desc}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="rounded-xl bg-[#7c3aed] px-5 py-2 text-xs font-semibold text-white hover:bg-[#6d28d9]"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: End Session Modal */}
      {showEndModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="flex w-full max-w-md flex-col rounded-2xl border border-[#ede6db] bg-white p-6 shadow-xl">
            <h3 className="text-lg font-bold text-[#1e1c1a]">
              End Practice Session?
            </h3>
            <p className="mt-2 text-sm text-[#6b6661]">
              You have completed your behavioral interview practice. Ready to
              view your evaluation and performance feedback?
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowEndModal(false)}
                className="rounded-full border border-[#ede6db] bg-white px-5 py-2 text-xs font-semibold text-[#6b6661] hover:bg-[#faf6f0]"
              >
                Continue Practice
              </button>
              <button
                type="button"
                onClick={() =>
                  router.push("/practice/session/behavioral/evaluation")
                }
                className="rounded-full bg-[#ff6c47] px-5 py-2 text-xs font-semibold text-white hover:bg-[#fa552b]"
              >
                View Evaluation →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
