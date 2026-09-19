"use client";

import { useState } from "react";
import { Lightbulb, Play, X, Sparkles } from "lucide-react";

export function OnboardingHelpCard() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="flex w-full flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-[#e5e1d8] bg-white p-3.5 sm:p-4 shadow-xs">
        {/* Left side: Lightbulb icon + Text */}
        <div className="flex items-start sm:items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#fff7e0] text-[#c9930a]">
            <Lightbulb className="size-4 stroke-[2.2]" />
          </div>
          <div className="flex flex-col gap-0.5">
            <h4 className="text-[13px] font-bold text-[#1c1917]">
              Not sure about some details?
            </h4>
            <p className="text-[13px] text-[#78716c] leading-relaxed">
              That&apos;s okay. You can start with just the required information
              and add the rest later. We&apos;ll still create a solid
              preparation plan for you.
            </p>
          </div>
        </div>

        {/* Right side: Action Pill Button */}
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="shrink-0 flex items-center gap-1.5 rounded-full border border-[#dbe2f9] bg-white px-4 py-2 text-xs font-semibold text-[#336df2] shadow-xs transition-colors hover:bg-blue-50"
        >
          <Play className="size-3 fill-[#336df2]" />
          <span>Learn more about how it works</span>
          <span className="text-sm leading-none">›</span>
        </button>
      </div>

      {/* Info Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="flex w-full max-w-lg flex-col rounded-2xl border border-[#ede6db] bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#f4efe8]">
              <div className="flex items-center gap-2">
                <Sparkles className="size-5 text-brand" />
                <h3 className="text-base font-bold text-ink">
                  How PrepInMinutes Generates Your Plan
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-[#6b6661] hover:text-ink"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="flex flex-col gap-3.5 py-4 text-xs sm:text-sm text-ink-muted leading-relaxed">
              <div className="flex items-start gap-3 rounded-xl bg-[#faf6f0] p-3 border border-[#ede6db]">
                <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-brand text-white font-bold text-xs mt-0.5">
                  1
                </div>
                <div>
                  <strong className="text-ink">Target Role &amp; Level:</strong>
                  <p className="mt-0.5 text-[#6b6661]">
                    We map your experience to real interview bar rubrics used by
                    top tech companies (FAANG, Tier-1 startups).
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl bg-[#faf6f0] p-3 border border-[#ede6db]">
                <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-brand text-white font-bold text-xs mt-0.5">
                  2
                </div>
                <div>
                  <strong className="text-ink">Timeline-Driven Pacing:</strong>
                  <p className="mt-0.5 text-[#6b6661]">
                    Whether you have 1 week or 3 months, daily 27-minute
                    practice chunks ensure high-frequency retention without
                    burnout.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl bg-[#faf6f0] p-3 border border-[#ede6db]">
                <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-brand text-white font-bold text-xs mt-0.5">
                  3
                </div>
                <div>
                  <strong className="text-ink">
                    Company &amp; JD Tailoring:
                  </strong>
                  <p className="mt-0.5 text-[#6b6661]">
                    Uploading your resume and target JD calibrates behavioral
                    STAR scenarios and system design questions to your actual
                    tech stack.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-xl bg-brand px-5 py-2 text-xs font-semibold text-white hover:bg-[#fa552b]"
              >
                Got It, Thanks
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
