"use client";

import { BriefingHeader } from "@/components/mock-interview/briefing/BriefingHeader";
import { ConfigureStepper } from "@/components/mock-interview/configure/ConfigureStepper";
import { YourMockInterviewSummaryCard } from "@/components/mock-interview/briefing/YourMockInterviewSummaryCard";
import { WhatToExpectSection } from "@/components/mock-interview/briefing/WhatToExpectSection";
import { HowTheInterviewWorksSection } from "@/components/mock-interview/briefing/HowTheInterviewWorksSection";
import { WhatAiWillEvaluateSection } from "@/components/mock-interview/briefing/WhatAiWillEvaluateSection";
import { BeforeYouStartCard } from "@/components/mock-interview/briefing/BeforeYouStartCard";
import { BriefingBottomBar } from "@/components/mock-interview/briefing/BriefingBottomBar";

export function MockInterviewBriefingWorkspace() {
  return (
    <div className="flex w-full flex-col gap-6 sm:gap-7 max-w-[1400px] mx-auto pb-16">
      {/* 1. Header with back link, icon badge, title, subtitle */}
      <BriefingHeader />

      {/* 2. 3-step Progress Stepper (Step 2 Active) */}
      <ConfigureStepper currentStep={2} />

      {/* 3. Your Mock Interview Configuration Summary */}
      <YourMockInterviewSummaryCard />

      {/* 4. What to Expect (3 Cards) */}
      <WhatToExpectSection />

      {/* 5. How the Interview Works (5 Connected Flow Steps) */}
      <HowTheInterviewWorksSection />

      {/* 6. What the AI Will Evaluate (6 Competency Badges) */}
      <WhatAiWillEvaluateSection />

      {/* 7. Before You Start (Advice Banner with 3 Tips) */}
      <BeforeYouStartCard />

      {/* 8. Bottom Action Bar */}
      <BriefingBottomBar />
    </div>
  );
}
