"use client";

import React from "react";
import {
  Mic,
  MicOff,
  Pause,
  Play,
  Square,
  Volume2,
  VolumeX,
  Send,
  Loader2,
  Sparkles,
  Radio,
  Zap,
  SkipForward,
} from "lucide-react";
import { VoiceTurnState } from "@/hooks/useAiVoiceInterviewer";

export interface AiVoiceInterviewerDockProps {
  turnState: VoiceTurnState;
  isCallActive: boolean;
  isPaused: boolean;
  isMuted: boolean;
  waveformBars: number[];
  silenceCountdown: number | null;
  isTextInput: boolean;
  textMessage: string;
  interviewerName?: string;
  onStartSession: () => void;
  onTogglePause: () => void;
  onToggleMute: () => void;
  onBargeIn: () => void;
  onFinalizeTurn: () => void;
  onStopSession: () => void;
  onSkipQuestion?: () => void;
  onToggleTextInput: () => void;
  onTextMessageChange: (val: string) => void;
  onSendTextMessage: () => void;
}

export function AiVoiceInterviewerDock({
  turnState,
  isCallActive,
  isPaused,
  isMuted,
  waveformBars,
  silenceCountdown,
  isTextInput,
  textMessage,
  interviewerName = "Sarah",
  onStartSession,
  onTogglePause,
  onToggleMute,
  onBargeIn,
  onFinalizeTurn,
  onStopSession,
  onSkipQuestion,
  onToggleTextInput,
  onTextMessageChange,
  onSendTextMessage,
}: AiVoiceInterviewerDockProps) {
  // If call has not been started yet, render the Lobby Start Call Banner
  if (!isCallActive || turnState === "LOBBY") {
    return (
      <div className="flex flex-col items-center justify-center gap-3.5 rounded-2xl border-2 border-dashed border-[#7c3aed]/40 bg-[#f5f3ff] p-5 sm:p-7 text-center shadow-xs">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-[#7c3aed] text-white shadow-md shadow-[#7c3aed]/25">
          <Radio className="size-6 animate-pulse" />
        </div>
        <div className="flex flex-col gap-1 max-w-md">
          <h3 className="font-display font-bold text-sm sm:text-base text-ink">
            Start Live Voice Interview with {interviewerName}
          </h3>
          <p className="text-xs text-ink-muted leading-relaxed">
            Click to activate Sarah&apos;s autonomous AI voice. Sarah will introduce the architectural scenario aloud and guide your design in real time.
          </p>
        </div>

        <button
          type="button"
          onClick={onStartSession}
          className="inline-flex items-center gap-2 rounded-full bg-[#7c3aed] px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-[#6d28d9] active:scale-95 transition-all cursor-pointer"
        >
          <Mic className="size-4" />
          <span>Connect Voice Interviewer</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3.5 sm:gap-4 rounded-2xl border border-[#7c3aed] bg-[#f5f3ff] p-4 sm:p-5 shadow-sm text-center">
      {/* 1. Status Indicator & Silence Countdown Badge */}
      <div className="flex items-center gap-2 flex-wrap justify-center">
        <span
          className={`text-[11px] sm:text-xs font-bold uppercase tracking-wider ${
            isPaused
              ? "text-ink-muted"
              : turnState === "AI_SPEAKING"
              ? "text-emerald-600 animate-pulse"
              : turnState === "CANDIDATE_SPEAKING"
              ? "text-brand"
              : turnState === "PROCESSING"
              ? "text-[#7c3aed] animate-pulse"
              : "text-[#7c3aed]"
          }`}
        >
          {isPaused
            ? "Session Paused"
            : turnState === "AI_SPEAKING"
            ? `${interviewerName} Speaking • Click Mic to Interrupt`
            : turnState === "CANDIDATE_SPEAKING"
            ? "Listening to your answer..."
            : turnState === "PROCESSING"
            ? `${interviewerName} is thinking...`
            : "Ready • Speak naturally"}
        </span>

        {/* Silence auto-commit countdown badge */}
        {silenceCountdown !== null && turnState === "CANDIDATE_SPEAKING" && (
          <span className="inline-flex items-center gap-1 rounded-full bg-brand/10 border border-brand/30 px-2 py-0.5 text-[10px] font-bold text-brand animate-bounce">
            <Zap className="size-3" />
            <span>Finishing answer in {silenceCountdown}s</span>
          </span>
        )}

        {/* Instant Barge-In Interruption Button when AI is speaking */}
        {turnState === "AI_SPEAKING" && !isPaused && (
          <button
            type="button"
            onClick={onBargeIn}
            className="inline-flex items-center gap-1 rounded-full bg-rose-50 border border-rose-200 px-2.5 py-0.5 text-[10px] font-bold text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer"
          >
            <Mic className="size-3 text-rose-600" />
            <span>Interrupt</span>
          </button>
        )}
      </div>

      {/* 2. Waveform Visualization Equalizer */}
      <div
        className="flex h-10 sm:h-12 w-full max-w-md items-center justify-center gap-[3px] px-2 sm:px-4 cursor-pointer"
        onClick={() => {
          if (turnState === "AI_SPEAKING") onBargeIn();
          else if (turnState === "CANDIDATE_SPEAKING") onFinalizeTurn();
        }}
        title="Voice waveform visualizer"
      >
        {waveformBars.map((height, i) => {
          const isActive =
            !isPaused &&
            (turnState === "AI_SPEAKING" || turnState === "CANDIDATE_SPEAKING");

          let barColor = "bg-[#7c3aed]/40";
          if (turnState === "AI_SPEAKING") {
            barColor = "bg-emerald-500";
          } else if (turnState === "CANDIDATE_SPEAKING") {
            barColor = "bg-brand";
          }

          return (
            <div
              key={i}
              className={`w-1 rounded-full transition-all duration-100 ${barColor}`}
              style={{
                height: isPaused ? "4px" : `${height}px`,
                opacity: isActive ? 1 : 0.4,
              }}
            />
          );
        })}
      </div>

      {/* 3. Controls Bar */}
      <div className="flex items-center gap-3 sm:gap-4 pt-0.5 sm:pt-1">
        {/* Pause / Resume Button */}
        <button
          type="button"
          onClick={onTogglePause}
          className="flex h-9 items-center gap-1.5 rounded-full border border-[#7c3aed] bg-white px-3 sm:px-4 text-xs font-semibold text-[#7c3aed] shadow-sm transition-colors hover:bg-[#ede9fe] cursor-pointer"
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

        {/* Central Mic Button with Tap-to-Interrupt / Commit */}
        <button
          type="button"
          onClick={() => {
            if (turnState === "AI_SPEAKING") {
              onBargeIn();
            } else if (turnState === "CANDIDATE_SPEAKING") {
              onFinalizeTurn();
            }
          }}
          className={`flex size-12 sm:size-14 items-center justify-center rounded-full text-white transition-all active:scale-95 cursor-pointer shadow-md ${
            turnState === "AI_SPEAKING"
              ? "bg-emerald-600 hover:bg-rose-600 shadow-emerald-500/30"
              : turnState === "CANDIDATE_SPEAKING"
              ? "bg-brand ring-4 ring-brand/30 shadow-brand/40"
              : turnState === "PROCESSING"
              ? "bg-[#7c3aed] animate-pulse"
              : "bg-[#7c3aed] hover:bg-[#6d28d9] shadow-[0_4px_16px_rgba(124,58,237,0.35)]"
          }`}
          aria-label="Toggle microphone or interrupt interviewer"
        >
          {turnState === "PROCESSING" ? (
            <Loader2 className="size-5 sm:size-6 animate-spin" />
          ) : (
            <Mic className="size-5 sm:size-6" />
          )}
        </button>

        {/* Skip Question Button */}
        {onSkipQuestion && (
          <button
            type="button"
            onClick={onSkipQuestion}
            title="Skip to next question (Esc)"
            className="flex h-9 items-center gap-1.5 rounded-full border border-[#ede6db] bg-white px-3 sm:px-4 text-xs font-semibold text-ink shadow-sm transition-colors hover:bg-[#faf6f0] hover:border-brand/40 cursor-pointer"
          >
            <SkipForward className="size-3.5 text-ink-muted" />
            <span>Skip</span>
          </button>
        )}

        {/* Stop Button */}
        <button
          type="button"
          onClick={onStopSession}
          className="flex h-9 items-center gap-1.5 rounded-full border border-red-500 bg-white px-3 sm:px-4 text-xs font-semibold text-red-500 shadow-sm transition-colors hover:bg-red-50 cursor-pointer"
        >
          <Square className="size-3 fill-red-500" />
          <span>Stop</span>
        </button>
      </div>

      {/* 4. Text Mode Toggle */}
      <div className="text-[11px] sm:text-xs text-ink-muted">
        Speak naturally into your mic. You can also{" "}
        <button
          type="button"
          onClick={onToggleTextInput}
          className="font-semibold text-[#7c3aed] underline hover:text-[#6d28d9] cursor-pointer"
        >
          {isTextInput ? "hide text input" : "switch to text input"}
        </button>
        .
      </div>

      {/* 5. Inline Text Input Form */}
      {isTextInput && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSendTextMessage();
          }}
          className="mt-1 sm:mt-2 flex w-full max-w-lg items-center gap-2 animate-in fade-in"
        >
          <input
            type="text"
            value={textMessage}
            onChange={(e) => onTextMessageChange(e.target.value)}
            placeholder="Type your response to Sarah..."
            className="min-w-0 flex-1 rounded-xl border border-[#ede6db] bg-white px-3 sm:px-4 py-2 sm:py-2.5 text-xs text-ink outline-none focus:border-[#7c3aed]"
          />
          <button
            type="submit"
            className="flex size-9 sm:size-10 shrink-0 items-center justify-center rounded-xl bg-[#7c3aed] text-white transition-opacity hover:opacity-95 cursor-pointer"
            aria-label="Send response"
          >
            <Send className="size-4" />
          </button>
        </form>
      )}
    </div>
  );
}
