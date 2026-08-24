type BlobProps = {
  size: number;
  color: string;
  opacity: number;
  className?: string;
};

export function Blob({ size, color, opacity, className = "" }: BlobProps) {
  return (
    <div
      aria-hidden
      className={`absolute rounded-full pointer-events-none ${className}`}
      style={{ width: size, height: size, backgroundColor: color, opacity }}
    />
  );
}

type DotGridProps = {
  size: number;
  spacing?: number;
  dotSize?: number;
  opacity?: number;
  color?: string;
  className?: string;
};

export function DotGrid({
  size,
  spacing = 25,
  dotSize = 1.5,
  opacity = 0.35,
  color = "#6b6661",
  className = "",
}: DotGridProps) {
  return (
    <div
      aria-hidden
      className={`absolute overflow-hidden pointer-events-none ${className}`}
      style={{
        width: size,
        height: size,
        opacity,
        backgroundImage: `radial-gradient(circle, ${color} ${dotSize}px, transparent ${dotSize}px)`,
        backgroundSize: `${spacing}px ${spacing}px`,
      }}
    />
  );
}

type RuledLinesProps = {
  height: number;
  spacing?: number;
  opacity?: number;
  color?: string;
  className?: string;
};

export function RuledLines({
  height,
  spacing = 32,
  opacity = 0.5,
  color = "#d6cfc4",
  className = "",
}: RuledLinesProps) {
  return (
    <div
      aria-hidden
      className={`absolute inset-x-0 top-0 pointer-events-none ${className}`}
      style={{
        height,
        opacity,
        backgroundImage: `linear-gradient(to bottom, ${color} 1px, transparent 1px)`,
        backgroundSize: `100% ${spacing}px`,
      }}
    />
  );
}

type ProgressRingProps = {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  trackColor?: string;
  fillColor?: string;
};

export function ProgressRing({
  percentage,
  size = 300,
  strokeWidth = 18,
  trackColor = "#f4efe8",
  fillColor = "#ff6c47",
}: ProgressRingProps) {
  const radius = size / 2 - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - percentage / 100);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={trackColor}
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={fillColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
      />
    </svg>
  );
}
