"use client";

interface InterviewResultProps {
  score: number; // e.g. 68
  size?: number; // default 24
  strokeWidth?: number; // default 3
}

export function InterviewResult({
  score,
  size = 24,
  strokeWidth = 3,
}: InterviewResultProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - score / 100);

  // Pick color based on score threshold (all match the teal/emerald palette from screenshot)
  const strokeColor =
    score >= 70 ? "#10b981" : score >= 60 ? "#0d9488" : "#f59e0b";

  return (
    <div className="flex items-center gap-2">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90 select-none shrink-0"
        aria-hidden
      >
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={strokeWidth}
        />
        {/* Progress ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-500 ease-out"
        />
      </svg>
      <span className="font-mono text-xs sm:text-sm font-bold text-ink">
        {score}%
      </span>
    </div>
  );
}
