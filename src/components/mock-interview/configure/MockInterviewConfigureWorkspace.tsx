"use client";

import { useState } from "react";
import { ConfigureHeader } from "@/components/mock-interview/configure/ConfigureHeader";
import { ConfigureStepper } from "@/components/mock-interview/configure/ConfigureStepper";
import { InterviewConfigurationForm } from "@/components/mock-interview/configure/InterviewConfigurationForm";
import { ConfigurationPreviewCard } from "@/components/mock-interview/configure/ConfigurationPreviewCard";
import { defaultConfiguration } from "@/data/mock-interview";
import type { InterviewConfiguration } from "@/types/mock-interview";

export function MockInterviewConfigureWorkspace() {
  const [config, setConfig] =
    useState<InterviewConfiguration>(defaultConfiguration);

  return (
    <div className="flex w-full flex-col gap-6 max-w-[1400px] mx-auto pb-16">
      {/* 1. Header with back link, icon badge, title, subtitle */}
      <ConfigureHeader />

      {/* 2. 3-step Progress Stepper */}
      <ConfigureStepper currentStep={1} />

      {/* 3. Main Two-Column Layout (8 cols Form + 4 cols Preview) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full items-start">
        {/* Left Column (8 cols): Interactive Configuration Form */}
        <div className="lg:col-span-8 w-full">
          <InterviewConfigurationForm config={config} onChange={setConfig} />
        </div>

        {/* Right Column (4 cols): Sticky Preview Card */}
        <div className="lg:col-span-4 w-full">
          <ConfigurationPreviewCard config={config} />
        </div>
      </div>
    </div>
  );
}
