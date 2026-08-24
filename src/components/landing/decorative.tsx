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
    <svg
      width="100%"
      height="100%"
      viewBox={`0 0 ${size} ${size}`}
      className="-rotate-90"
    >
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

type RadarChartProps = {
  data: { label: string; value: number }[];
  size?: number;
  maxValue?: number;
  color?: string;
  gridColor?: string;
};

export function RadarChart({
  data,
  size = 240,
  maxValue = 100,
  color = "#ec4899",
  gridColor = "#f4efe8",
}: RadarChartProps) {
  const n = data.length;
  const center = size / 2;
  const labelGutter = 34;
  const maxRadius = size / 2 - labelGutter;
  const angleFor = (i: number) => -Math.PI / 2 + i * ((2 * Math.PI) / n);
  const pointAt = (i: number, r: number): [number, number] => {
    const a = angleFor(i);
    return [center + r * Math.cos(a), center + r * Math.sin(a)];
  };
  const toPoints = (pts: [number, number][]) =>
    pts.map(([x, y]) => `${x},${y}`).join(" ");

  const rings = [0.25, 0.5, 0.75, 1];
  const dataPoints = data.map((d, i) =>
    pointAt(i, (Math.min(d.value, maxValue) / maxValue) * maxRadius),
  );

  return (
    <svg
      width="100%"
      height="100%"
      viewBox={`0 0 ${size} ${size}`}
      className="overflow-visible"
    >
      {rings.map((f) => (
        <polygon
          key={f}
          points={toPoints(data.map((_, i) => pointAt(i, maxRadius * f)))}
          fill="none"
          stroke={gridColor}
          strokeWidth={1}
        />
      ))}
      {data.map((_, i) => {
        const [x, y] = pointAt(i, maxRadius);
        return (
          <line
            key={i}
            x1={center}
            y1={center}
            x2={x}
            y2={y}
            stroke={gridColor}
            strokeWidth={1}
          />
        );
      })}
      <polygon
        points={toPoints(dataPoints)}
        fill={color}
        fillOpacity={0.18}
        stroke={color}
        strokeWidth={2}
        strokeLinejoin="round"
      />
      {dataPoints.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={3} fill={color} />
      ))}
      {data.map((d, i) => {
        const [x, y] = pointAt(i, maxRadius + 16);
        const dx = x - center;
        const dy = y - center;
        const anchor = Math.abs(dx) < 4 ? "middle" : dx > 0 ? "start" : "end";
        const baseline = dy < -4 ? "auto" : dy > 4 ? "hanging" : "middle";
        return (
          <text
            key={d.label}
            x={x}
            y={y}
            textAnchor={anchor}
            dominantBaseline={baseline}
            fontSize={10}
            fontWeight={600}
            fill="#6b6661"
          >
            {d.label}
          </text>
        );
      })}
    </svg>
  );
}
