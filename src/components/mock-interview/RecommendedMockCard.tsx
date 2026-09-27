"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Clock,
  Layers,
  Target,
  Play,
  SlidersHorizontal,
  ArrowRight,
  Loader2,
  Mic,
  MessageSquare,
  GitFork,
  BarChart3,
} from "lucide-react";
import type { RecommendedMock } from "@/types/mock-interview";

interface RecommendedMockCardProps {
  mock: RecommendedMock;
}

export function RecommendedMockCard({ mock }: RecommendedMockCardProps) {
  const router = useRouter();
  const [isStarting, setIsStarting] = useState(false);

  const handleStartMock = () => {
    if (isStarting) return;
    setIsStarting(true);
    // Smooth transition with brief loading feedback before navigating
    setTimeout(() => {
      router.push(mock.startUrl);
    }, 450);
  };

  const handleCustomize = () => {
    router.push(mock.customizeUrl);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-[#ffe6dc] bg-gradient-to-br from-[#fffaf7] via-[#fffdfb] to-[#ffffff] p-6 sm:p-8 lg:p-9 shadow-[0_8px_30px_rgba(255,108,71,0.06)]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
        {/* Left Column (7 cols): Details & CTAs */}
        <div className="lg:col-span-7 flex flex-col items-start gap-4">
          {/* Recommendation Badge */}
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#fef3c7]/80 border border-[#fde68a] px-3 py-1 text-xs font-bold text-[#b45309]">
            <Sparkles className="size-3.5 fill-[#f59e0b] text-[#f59e0b]" />
            <span>{mock.recommendationLabel}</span>
          </div>

          {/* Titles */}
          <div className="flex flex-col gap-1">
            <h2 className="font-display text-2xl sm:text-3xl lg:text-[32px] font-black text-ink tracking-tight">
              {mock.role}
            </h2>
            <p className="font-display text-lg sm:text-xl font-bold text-[#334155]">
              {mock.title}
            </p>
          </div>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-ink-muted">
            <div className="inline-flex items-center gap-1.5">
              <Clock className="size-4 text-brand" />
              <span>{mock.durationLabel}</span>
            </div>
            <span className="text-line-strong select-none">|</span>
            <div className="inline-flex items-center gap-1.5">
              <Layers className="size-4 text-[#ff6c47]" />
              <span>{mock.typeLabel}</span>
            </div>
            <span className="text-line-strong select-none">|</span>
            <div className="inline-flex items-center gap-1.5">
              <Target className="size-4 text-[#ea580c]" />
              <span>{mock.goalLabel}</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-ink-muted leading-relaxed max-w-xl">
            {mock.description}
          </p>

          {/* Focus Tags */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {mock.focusAreas.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full bg-[#f0f9ff] border border-[#e0f2fe] px-3.5 py-1 text-xs font-semibold text-[#0369a1]"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-3">
            <button
              type="button"
              onClick={handleStartMock}
              disabled={isStarting}
              className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-[#ff5520] px-6 py-3.5 text-sm sm:text-[15px] font-bold text-white shadow-[0_4px_14px_rgba(255,85,32,0.35)] transition-all hover:bg-[#eb4a19] hover:shadow-[0_6px_20px_rgba(255,85,32,0.45)] active:scale-[0.98] disabled:opacity-80 cursor-pointer"
            >
              {isStarting ? (
                <>
                  <Loader2 className="size-4 animate-spin text-white" />
                  <span>Preparing your interview…</span>
                </>
              ) : (
                <>
                  <Play className="size-4 fill-white text-white" />
                  <span>Start Mock Interview</span>
                  <ArrowRight className="size-4" />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleCustomize}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#e2e8f0] bg-white px-5 py-3.5 text-sm font-semibold text-ink transition-all hover:bg-[#faf9f6] hover:border-[#cbd5e1] hover:text-ink active:scale-[0.98] cursor-pointer shadow-2xs"
            >
              <SlidersHorizontal className="size-4 text-ink-muted" />
              <span>Customize</span>
            </button>
          </div>
        </div>

        {/* Right Column (5 cols): AI Visual Illustration */}
        <div className="lg:col-span-5 relative flex items-center justify-center py-4 lg:py-0 select-none">
          {/* Ambient Glow */}
          <div
            className="pointer-events-none absolute -inset-4 bg-gradient-to-tr from-[#ffe4e6]/30 via-[#f3e8ff]/50 to-[#dbeafe]/30 blur-2xl rounded-full"
            aria-hidden
          />

          {/* Laptop Composition Container */}
          <div className="relative w-full max-w-[420px] aspect-[16/11] flex items-center justify-center">
            {/* Floating Badge 1: Real interview questions (Top Left) */}
            <div className="absolute -top-1 left-2 z-20 flex items-center gap-2 rounded-full border border-[#ede9fe] bg-white/95 px-3 py-1.5 text-[11px] font-bold text-ink shadow-[0_4px_12px_rgba(30,28,26,0.08)] backdrop-blur-xs">
              <span className="flex size-5 items-center justify-center rounded-full bg-[#f5efff] text-[#8b5cf6]">
                <MessageSquare className="size-3" />
              </span>
              <span>Real interview questions</span>
            </div>

            {/* Floating Badge 2: Adaptive follow-ups (Top Right) */}
            <div className="absolute top-4 -right-1 z-20 flex items-center gap-2 rounded-full border border-[#ede9fe] bg-white/95 px-3 py-1.5 text-[11px] font-bold text-ink shadow-[0_4px_12px_rgba(30,28,26,0.08)] backdrop-blur-xs">
              <span className="flex size-5 items-center justify-center rounded-full bg-[#f5efff] text-[#8b5cf6]">
                <GitFork className="size-3" />
              </span>
              <span>Adaptive follow-ups</span>
            </div>

            {/* Floating Badge 3: Personalized evaluation (Bottom Right) */}
            <div className="absolute -bottom-2 right-1 z-20 flex items-center gap-2 rounded-full border border-[#ede9fe] bg-white/95 px-3 py-1.5 text-[11px] font-bold text-ink shadow-[0_4px_12px_rgba(30,28,26,0.08)] backdrop-blur-xs">
              <span className="flex size-5 items-center justify-center rounded-full bg-[#f5efff] text-[#8b5cf6]">
                <BarChart3 className="size-3" />
              </span>
              <span>Personalized evaluation</span>
            </div>

            {/* Stylized Laptop Illustration */}
            <div className="relative z-10 w-[84%] flex flex-col items-center">
              {/* Laptop Screen Frame */}
              <div className="w-full aspect-[16/10] rounded-2xl border-[3px] border-[#3b82f6]/70 bg-gradient-to-b from-[#f8fafc] to-[#f1f5f9] p-2.5 shadow-lg flex flex-col justify-between overflow-hidden">
                {/* Screen top subtle bar with camera dot */}
                <div className="flex items-center justify-between border-b border-[#e2e8f0]/60 pb-1.5 px-1">
                  <div className="flex items-center gap-1">
                    <span className="size-1.5 rounded-full bg-[#cbd5e1]" />
                    <span className="size-1.5 rounded-full bg-[#cbd5e1]" />
                  </div>
                  <span className="size-1 rounded-full bg-[#94a3b8]" />
                  <span className="size-1.5 rounded-full bg-transparent" />
                </div>

                {/* Central Microphone & Audio Waveform */}
                <div className="flex flex-1 flex-col items-center justify-center gap-3">
                  <div className="flex size-14 items-center justify-center rounded-2xl border border-[#ede9fe] bg-[#f5efff] text-[#8b5cf6] shadow-sm">
                    <Mic className="size-7 text-[#8b5cf6]" />
                  </div>

                  {/* Sound Wave Bars */}
                  <div className="flex items-center gap-1 h-7">
                    <span className="w-1 h-2 rounded-full bg-[#c4b5fd]" />
                    <span className="w-1 h-3.5 rounded-full bg-[#a78bfa]" />
                    <span className="w-1 h-2 rounded-full bg-[#c4b5fd]" />
                    <span className="w-1 h-5 rounded-full bg-[#8b5cf6]" />
                    <span className="w-1 h-6 rounded-full bg-[#7c3aed]" />
                    <span className="w-1 h-4 rounded-full bg-[#a78bfa]" />
                    <span className="w-1 h-7 rounded-full bg-[#6d28d9]" />
                    <span className="w-1 h-5 rounded-full bg-[#8b5cf6]" />
                    <span className="w-1 h-3 rounded-full bg-[#c4b5fd]" />
                    <span className="w-1 h-6 rounded-full bg-[#7c3aed]" />
                    <span className="w-1 h-4 rounded-full bg-[#a78bfa]" />
                    <span className="w-1 h-2 rounded-full bg-[#c4b5fd]" />
                  </div>
                </div>

                {/* Subtle screen bottom indicator line */}
                <div className="h-0.5 w-12 self-center rounded-full bg-[#cbd5e1]" />
              </div>

              {/* Laptop Keyboard Base Tray */}
              <div className="w-[108%] h-3.5 rounded-b-xl border-t border-[#93c5fd] bg-gradient-to-b from-[#3b82f6] to-[#2563eb] shadow-md flex items-center justify-center">
                <div className="w-16 h-1 rounded-full bg-[#60a5fa]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
