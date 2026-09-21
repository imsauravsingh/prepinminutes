"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Settings,
  Cloud,
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
} from "lucide-react";
import { WhiteboardModal } from "./WhiteboardModal";

// Heights for the 24 waveform bars
const WAVEFORM_HEIGHTS = [
  12, 18, 24, 16, 10, 8, 14, 20, 26, 15, 9, 13, 22, 17, 11, 25, 20, 14, 8, 12,
  18, 24, 10, 6,
];

export function CloudWorkspace() {
  // Timer: starts at 02:25 (145 seconds) and counts up towards 30:00
  const [secondsElapsed, setSecondsElapsed] = useState(145);
  const [isPaused, setIsPaused] = useState(false);

  // Text input mode toggle
  const [isTextInput, setIsTextInput] = useState(false);
  const [textMessage, setTextMessage] = useState("");

  // Whiteboard modal state
  const [isWhiteboardOpen, setIsWhiteboardOpen] = useState(false);

  // Secondary interactive tools state (modal drawer for notes/code/diagram)
  const [activeTool, setActiveTool] = useState<
    "diagram" | "code" | "notes" | null
  >(null);
  const [notesContent, setNotesContent] = useState("");
  const [codeContent, setCodeContent] = useState(
    `# Terraform AWS Multi-Region VPC & EKS
module "vpc_us_east_1" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 5.0"
  name    = "prod-us-east-1"
  cidr    = "10.0.0.0/16"
  azs     = ["us-east-1a", "us-east-1b", "us-east-1c"]
}
`,
  );

  // End Session modal state
  const [showEndModal, setShowEndModal] = useState(false);

  // Messages list
  const [messages, setMessages] = useState<
    { sender: "ai" | "user"; content: string; details?: string[] }[]
  >([
    {
      sender: "ai",
      content:
        "Design a resilient, multi-region cloud infrastructure for an e-commerce platform handling 50,000 requests per second with 99.99% SLA. How would you design the VPC topology, traffic routing, and deployment strategy?",
      details: [
        "Before you start, feel free to ask any clarifying questions regarding regions, compliance, or failover semantics.",
      ],
    },
    {
      sender: "user",
      content:
        "Sure, I'd like to clarify a few key requirements: Are we operating active-active across regions or active-passive with warm standby? Also, what are our cross-region data replication latency bounds and compliance constraints?",
    },
    {
      sender: "ai",
      content: "Great questions. Here are the operating parameters:",
      details: [
        "1. Setup: Active-Active across us-east-1 and eu-central-1 with Route 53 latency-based routing.",
        "2. RPO target: < 1 second for orders; RTO < 1 minute automatic failover.",
        "3. Compliance: GDPR requires EU user data to remain strictly in the EU region.",
        "4. Services: Containerized microservices running on managed Kubernetes (EKS).",
        "You can now walk me through your VPC topology and data layer design.",
      ],
    },
  ]);

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

  const handleTogglePause = () => {
    setIsPaused((prev) => !prev);
  };

  const handleStopSession = () => {
    setShowEndModal(true);
  };

  const handleSendText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textMessage.trim()) return;
    setMessages((prev) => [
      ...prev,
      { sender: "user", content: textMessage.trim() },
    ]);
    setTextMessage("");
  };

  const renderAudioDock = () => (
    <div className="flex flex-col items-center gap-3.5 rounded-2xl border border-[#2563eb] bg-[#eff6ff] p-5 shadow-sm text-center">
      {/* Listening / Paused status label */}
      <span className="text-xs font-bold uppercase tracking-wider text-[#2563eb]">
        {isPaused ? "Paused" : "Listening..."}
      </span>

      {/* Audio Waveform visualization (24 animated bars) */}
      <div className="flex h-7 items-center justify-center gap-1">
        {WAVEFORM_HEIGHTS.map((height, idx) => (
          <div
            key={idx}
            className="w-[3px] rounded-full bg-[#2563eb] transition-all duration-200"
            style={{
              height: isPaused ? "4px" : `${height}px`,
              opacity: isPaused ? 0.4 : 1,
            }}
          />
        ))}
      </div>

      {/* Controls row */}
      <div className="flex items-center gap-4 pt-1">
        {/* Pause / Resume button */}
        <button
          type="button"
          onClick={handleTogglePause}
          className="flex h-9 items-center gap-1.5 rounded-full border border-[#2563eb] bg-white px-4 text-xs font-semibold text-[#2563eb] shadow-sm transition-colors hover:bg-[#dbeafe]"
        >
          {isPaused ? (
            <>
              <Play className="size-3.5 fill-[#2563eb]" />
              <span>Resume</span>
            </>
          ) : (
            <>
              <Pause className="size-3.5 fill-[#2563eb]" />
              <span>Pause</span>
            </>
          )}
        </button>

        {/* Central Mic circle */}
        <button
          type="button"
          onClick={handleTogglePause}
          className="flex size-14 items-center justify-center rounded-full bg-[#2563eb] text-white shadow-[0_4px_16px_rgba(37,99,235,0.35)] transition-transform active:scale-95 hover:bg-[#1d4ed8]"
          aria-label="Toggle microphone"
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
          className="font-semibold text-[#2563eb] underline hover:text-[#1d4ed8]"
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
            placeholder="Type your cloud architecture response..."
            className="flex-1 rounded-xl border border-[#ede6db] bg-white px-4 py-2.5 text-xs text-ink outline-none focus:border-[#2563eb]"
          />
          <button
            type="submit"
            className="flex size-9 items-center justify-center rounded-xl bg-[#2563eb] text-white transition-opacity hover:opacity-95"
          >
            <Send className="size-4" />
          </button>
        </form>
      )}
    </div>
  );

  return (
    <div className="flex w-full flex-col min-h-screen bg-[#fbf9f4] p-4 sm:p-6 lg:p-7 gap-7">
      {/* 1. Header Row matching System Design */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Practice Header & Progress Track */}
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-bold text-brand">3 / 4</span>
              <span className="text-[#b0a898]">•</span>
              <span className="font-semibold text-ink">Cloud Infrastructure</span>
            </div>
            <span className="text-sm text-ink-muted">~19 min remaining</span>
          </div>

          {/* Progress bar track (Step 3 of 4 ~ 75% completed) */}
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#f4efe8]">
            <div
              className="h-full bg-brand transition-all duration-300"
              style={{ width: "75%" }}
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

      {/* 2. Main Workspace: Whiteboard View vs Live Conversation View */}
      {isWhiteboardOpen ? (
        <div className="flex flex-col gap-6 w-full">
          <WhiteboardModal onClose={() => setIsWhiteboardOpen(false)} />
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
                  <div className="flex size-10 items-center justify-center rounded-xl bg-[#eff6ff] border border-[#dbeafe] text-[#2563eb]">
                    <Cloud className="size-5" />
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
                      Cloud Architecture Interview
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
                {/* Message 1: Initial AI prompt */}
                <div className="flex items-start gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#eff6ff] text-[#2563eb]">
                    <Cloud className="size-4" />
                  </div>
                  <div className="flex flex-1 flex-col gap-2 rounded-2xl bg-[#faf6f0] p-4 text-sm leading-relaxed text-ink">
                    <p className="font-medium">
                      Design a resilient, multi-region cloud infrastructure for an e-commerce platform handling 50,000 requests per second with 99.99% SLA. How would you design the VPC topology, traffic routing, and deployment strategy?
                    </p>
                    <p className="text-xs text-ink-muted">
                      Before you start, feel free to ask any clarifying questions regarding regions, compliance, or failover semantics.
                    </p>
                    <div className="flex items-center gap-1.5 pt-1 text-xs font-medium text-[#2563eb]">
                      <Info className="size-3.5 shrink-0" />
                      <span>
                        Clarifying RPO/RTO and data residency constraints is critical in cloud interviews
                      </span>
                    </div>
                  </div>
                </div>

                {/* Message 2: Candidate clarification */}
                <div className="flex items-start gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#fff0ec] text-brand">
                    <User className="size-4" />
                  </div>
                  <div className="flex flex-1 rounded-2xl bg-[#f5f3ff] p-4 text-sm leading-relaxed text-ink">
                    <p>
                      Sure, I&apos;d like to clarify a few key requirements: Are we operating active-active across regions or active-passive with warm standby? Also, what are our cross-region data replication latency bounds and compliance constraints?
                    </p>
                  </div>
                </div>

                {/* Message 3: AI response & guidance */}
                <div className="flex items-start gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#eff6ff] text-[#2563eb]">
                    <Cloud className="size-4" />
                  </div>
                  <div className="flex flex-1 flex-col gap-2 rounded-2xl bg-[#faf6f0] p-4 text-sm leading-relaxed text-ink">
                    <p className="font-bold">Great questions. Here are the operating parameters:</p>
                    <ol className="flex flex-col gap-1 text-ink/90 text-xs sm:text-sm">
                      <li>1. Setup: Active-Active across us-east-1 and eu-central-1 with Route 53 latency-based routing.</li>
                      <li>2. RPO target: &lt; 1 second for orders; RTO &lt; 1 minute automatic failover.</li>
                      <li>3. Compliance: GDPR requires EU user data to remain strictly in the EU region.</li>
                      <li>4. Services: Containerized microservices running on managed Kubernetes (EKS).</li>
                    </ol>
                    <p className="pt-1 text-xs text-ink-muted">
                      You can now walk me through your VPC topology and data layer design.
                    </p>
                  </div>
                </div>

                {/* Extra user sent messages if typed */}
                {messages.slice(3).map((msg, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div
                      className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${
                        msg.sender === "user"
                          ? "bg-[#fff0ec] text-brand"
                          : "bg-[#eff6ff] text-[#2563eb]"
                      }`}
                    >
                      {msg.sender === "user" ? (
                        <User className="size-4" />
                      ) : (
                        <Cloud className="size-4" />
                      )}
                    </div>
                    <div
                      className={`flex flex-1 rounded-2xl p-4 text-sm leading-relaxed text-ink ${
                        msg.sender === "user" ? "bg-[#f5f3ff]" : "bg-[#faf6f0]"
                      }`}
                    >
                      <p>{msg.content}</p>
                    </div>
                  </div>
                ))}
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
                {/* Whiteboard */}
                <button
                  type="button"
                  onClick={() => setIsWhiteboardOpen(true)}
                  className="flex flex-col items-center justify-center gap-2 rounded-xl border border-[#f4efe8] bg-white p-3.5 text-xs font-semibold text-ink shadow-sm transition-colors hover:border-[#2563eb]/40 hover:bg-[#faf6f0]"
                >
                  <div className="flex size-6 items-center justify-center text-[#2563eb]">
                    <LayoutGrid className="size-5" />
                  </div>
                  <span>Whiteboard</span>
                </button>

                {/* Draw Diagram */}
                <button
                  type="button"
                  onClick={() => setActiveTool("diagram")}
                  className="flex flex-col items-center justify-center gap-2 rounded-xl border border-[#f4efe8] bg-white p-3.5 text-xs font-semibold text-ink shadow-sm transition-colors hover:border-[#2563eb]/40 hover:bg-[#faf6f0]"
                >
                  <div className="flex size-6 items-center justify-center text-[#2563eb]">
                    <Network className="size-5" />
                  </div>
                  <span>Draw Diagram</span>
                </button>

                {/* Code Block */}
                <button
                  type="button"
                  onClick={() => setActiveTool("code")}
                  className="flex flex-col items-center justify-center gap-2 rounded-xl border border-[#f4efe8] bg-white p-3.5 text-xs font-semibold text-ink shadow-sm transition-colors hover:border-[#2563eb]/40 hover:bg-[#faf6f0]"
                >
                  <div className="flex size-6 items-center justify-center text-[#2563eb]">
                    <FileCode className="size-5" />
                  </div>
                  <span>Code Block</span>
                </button>

                {/* Notes */}
                <button
                  type="button"
                  onClick={() => setActiveTool("notes")}
                  className="flex flex-col items-center justify-center gap-2 rounded-xl border border-[#f4efe8] bg-white p-3.5 text-xs font-semibold text-ink shadow-sm transition-colors hover:border-[#2563eb]/40 hover:bg-[#faf6f0]"
                >
                  <div className="flex size-6 items-center justify-center text-[#2563eb]">
                    <FileText className="size-5" />
                  </div>
                  <span>Notes</span>
                </button>
              </div>
            </div>

            {/* Card 2: Tips */}
            <div className="flex flex-col gap-3.5 rounded-2xl border border-[#ede6db] bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <Lightbulb className="size-4 text-amber-500" />
                <h2 className="font-display font-bold text-sm text-ink">
                  Cloud Tips
                </h2>
              </div>
              <div className="flex flex-col gap-2.5">
                {[
                  "Start with clarifying questions & SLA/SLO",
                  "Separate public ingress from private subnets",
                  "Address multi-region replication & failover",
                  "Ensure zero-trust security & IAM boundaries",
                  "Discuss cost optimization & FinOps trade-offs",
                ].map((tip, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs">
                    <CheckCircle2 className="size-4 shrink-0 text-[#10b981]" />
                    <span className="text-ink font-medium leading-tight">
                      {tip}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 3: Today's Progress */}
            <div className="flex flex-col gap-3.5 rounded-2xl border border-[#ede6db] bg-white p-5 shadow-sm">
              <h2 className="font-display font-bold text-sm text-ink">
                Today&apos;s Progress
              </h2>
              <div className="flex items-center gap-4">
                {/* Circular Progress Ring (3/4 completed ~ 75%) */}
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
                      stroke="#2563eb"
                      strokeWidth="4"
                      strokeDasharray={138}
                      strokeDashoffset={35} // ~75% progress
                      strokeLinecap="round"
                      fill="none"
                    />
                  </svg>
                  <span className="absolute text-xs font-bold text-ink">
                    3/4
                  </span>
                </div>

                {/* Progress Meta */}
                <div className="flex flex-col gap-0.5">
                  <span className="font-bold text-sm text-ink">
                    Cloud Infrastructure
                  </span>
                  <span className="text-xs text-ink-muted">
                    Question 3 of 4
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
                {activeTool === "diagram" && "Cloud Network Topology"}
                {activeTool === "code" && "Infrastructure as Code (Terraform)"}
                {activeTool === "notes" && "Architecture & Capacity Notes"}
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
                  placeholder="Jot down RPO/RTO numbers, cross-region latency estimates, storage requirements..."
                  rows={8}
                  className="w-full rounded-xl border border-[#ede6db] p-3 text-xs font-sans text-ink outline-none focus:border-[#2563eb]"
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
                  <Network className="size-8 text-[#2563eb]" />
                  <span className="font-semibold text-ink">
                    Cloud VPC Architecture Canvas
                  </span>
                  <span>
                    Route 53 Global Routing → CloudFront / Shield → Multi-Region ALBs → EKS Microservices → Aurora Global Database
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
              Are you sure you want to end this session early? Your cloud architecture walkthrough will be evaluated.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowEndModal(false)}
                className="rounded-full border border-[#ede6db] bg-white px-4 py-2 text-xs font-semibold text-ink shadow-sm hover:bg-[#faf6f0]"
              >
                Continue Session
              </button>
              <Link
                href="/practice/session/cloud/evaluation"
                className="rounded-full bg-red-500 px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-red-600"
              >
                End Now
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
