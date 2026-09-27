import { Check } from "lucide-react";

interface ConfigureStepperProps {
  currentStep?: 1 | 2 | 3;
}

export function ConfigureStepper({ currentStep = 1 }: ConfigureStepperProps) {
  const steps = [
    { number: 1, label: "Configuration" },
    { number: 2, label: "Briefing" },
    { number: 3, label: "Start" },
  ];

  return (
    <div className="flex w-full items-center justify-center py-2 sm:py-3">
      <div className="flex items-center w-full max-w-xl px-2 sm:px-4">
        {steps.map((step, idx) => {
          const isActive = currentStep === step.number;
          const isCompleted = currentStep > step.number;

          return (
            <div
              key={step.number}
              className={`flex items-center ${idx < steps.length - 1 ? "flex-1" : ""}`}
            >
              {/* Step indicator (Circle + Label) */}
              <div className="flex flex-col items-center gap-1 sm:gap-1.5 relative">
                <div
                  className={`flex size-6 sm:size-7 items-center justify-center rounded-full text-xs font-bold transition-all ${
                    isActive
                      ? "bg-[#2563eb] text-white shadow-xs ring-4 ring-[#2563eb]/10"
                      : isCompleted
                        ? "bg-[#2563eb] text-white"
                        : "border border-[#cbd5e1] bg-white text-[#64748b]"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="size-3 sm:size-3.5 stroke-[3]" />
                  ) : (
                    <span>{step.number}</span>
                  )}
                </div>
                <span
                  className={`text-[10px] sm:text-xs whitespace-nowrap ${
                    isActive
                      ? "font-bold text-[#2563eb]"
                      : "font-medium text-ink-muted"
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {/* Connecting line between steps */}
              {idx < steps.length - 1 && (
                <div className="flex-1 mx-1.5 sm:mx-3 mb-4 sm:mb-5 h-0.5 bg-[#e2e8f0]">
                  <div
                    className={`h-full transition-all duration-300 ${
                      currentStep > step.number
                        ? "bg-[#2563eb]"
                        : "bg-transparent"
                    }`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
