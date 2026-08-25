"use client";

import { SignUp } from "@clerk/react";
import { Zap } from "lucide-react";

const clerkAppearance = {
  variables: {
    colorPrimary: "#ff6c47",
    colorText: "#1e1c1a",
    colorTextSecondary: "#6b6661",
    colorBackground: "#ffffff",
    borderRadius: "12px",
    fontFamily: "var(--font-geist-sans)",
  },
  elements: {
    card: "shadow-none border border-line",
  },
};

export default function SignUpPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center gap-8 bg-[#fbf9f4] px-4 py-12">
      <div className="flex items-center gap-3">
        <div className="flex size-9 items-center justify-center rounded-[10px] bg-brand">
          <Zap className="size-[18px] fill-white text-white" />
        </div>
        <div className="flex flex-col gap-0.5">
          <p className="font-display text-xl font-extrabold text-ink">PrepInMinutes</p>
          <p className="text-[11px] text-ink-muted">Get interview-ready in minutes.</p>
        </div>
      </div>

      <SignUp
        routing="hash"
        signInUrl="/login"
        fallbackRedirectUrl="/dashboard"
        appearance={clerkAppearance}
      />
    </div>
  );
}
