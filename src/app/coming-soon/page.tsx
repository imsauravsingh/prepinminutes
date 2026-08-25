import type { Metadata } from "next";
import { Zap } from "lucide-react";
import { Blob, DotGrid } from "@/components/landing/decorative";

export const metadata: Metadata = {
  title: "PrepInMinutes — Coming Soon",
  description:
    "PrepInMinutes is launching soon. Get interview-ready in minutes with a personalized, AI-powered preparation journey.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ComingSoon() {
  return (
    <div className="relative flex min-h-full flex-1 flex-col items-center justify-center overflow-hidden bg-white px-4 py-16 sm:px-6">
      <DotGrid size={500} className="left-0 top-0 hidden sm:block" />
      <Blob size={360} color="#93C5FD" opacity={0.12} className="-right-24 -top-24 hidden lg:block" />
      <Blob size={200} color="#FF6C47" opacity={0.08} className="-left-16 bottom-0 hidden sm:block" />

      <div className="relative flex max-w-xl flex-col items-center gap-6 text-center">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-9 items-center justify-center rounded-md bg-brand">
            <Zap className="size-4 fill-white text-white" />
          </div>
          <p className="font-display text-xl font-extrabold text-ink">PrepInMinutes</p>
        </div>

        <span className="rounded-full border border-brand bg-brand-soft px-4 py-2 text-[13px] font-semibold text-brand">
          🚀 Something big is on the way
        </span>

        <h1 className="font-display text-[32px] font-extrabold leading-[38px] text-ink sm:text-[42px] sm:leading-[48px]">
          Get interview-ready in minutes. We&apos;re almost there.
        </h1>

        <p className="text-base leading-6 text-ink-muted sm:text-lg sm:leading-7">
          We&apos;re building a personalized, AI-powered interview preparation journey — resume
          intelligence, mock interviews, and readiness scoring in one place. Launching soon.
        </p>

        <p className="text-[13px] text-ink-muted">© 2026 PrepInMinutes. All rights reserved.</p>
      </div>
    </div>
  );
}
