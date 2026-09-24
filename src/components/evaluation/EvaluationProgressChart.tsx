"use client";

import { useState } from "react";

type TimeRange = "week" | "month" | "all";

interface DataPoint {
  label: string;
  subLabel: string;
  value: number;
}

const WEEK_DATA: DataPoint[] = [
  { label: "Week 1", subLabel: "Aug 25 – Aug 31", value: 42 },
  { label: "Week 2", subLabel: "Sep 1 – Sep 7", value: 48 },
  { label: "Week 3", subLabel: "Sep 8 – Sep 14", value: 56 },
  { label: "Week 4", subLabel: "Sep 15 – Sep 21", value: 63 },
  { label: "This Week", subLabel: "Sep 22 – Today", value: 68 },
];

const MONTH_DATA: DataPoint[] = [
  { label: "May", subLabel: "Baseline", value: 35 },
  { label: "Jun", subLabel: "Core Concepts", value: 44 },
  { label: "Jul", subLabel: "Architectures", value: 52 },
  { label: "Aug", subLabel: "Mock Drills", value: 61 },
  { label: "Sep", subLabel: "Target Polish", value: 68 },
];

const ALL_TIME_DATA: DataPoint[] = [
  { label: "Initial", subLabel: "Diagnostic", value: 28 },
  { label: "Phase 1", subLabel: "Foundations", value: 45 },
  { label: "Phase 2", subLabel: "Applied Systems", value: 58 },
  { label: "Phase 3", subLabel: "Deep Dives", value: 64 },
  { label: "Current", subLabel: "Google Ready", value: 68 },
];

export function EvaluationProgressChart() {
  const [timeRange, setTimeRange] = useState<TimeRange>("week");

  const activeData =
    timeRange === "week"
      ? WEEK_DATA
      : timeRange === "month"
        ? MONTH_DATA
        : ALL_TIME_DATA;

  // Chart dimensions & scaling
  const chartWidth = 680;
  const chartHeight = 180;
  const paddingLeft = 45;
  const paddingRight = 35;
  const paddingTop = 25;
  const paddingBottom = 20;

  const innerWidth = chartWidth - paddingLeft - paddingRight;
  const innerHeight = chartHeight - paddingTop - paddingBottom;

  const yLevels = [
    { label: "100%", val: 100 },
    { label: "75%", val: 75 },
    { label: "50%", val: 50 },
    { label: "25%", val: 25 },
    { label: "0%", val: 0 },
  ];

  const getYCoord = (val: number) => {
    return paddingTop + innerHeight - (val / 100) * innerHeight;
  };

  const getXCoord = (index: number) => {
    if (activeData.length <= 1) return paddingLeft + innerWidth / 2;
    return paddingLeft + (index / (activeData.length - 1)) * innerWidth;
  };

  // Build SVG path
  const points = activeData.map((d, i) => ({
    x: getXCoord(i),
    y: getYCoord(d.value),
    value: d.value,
  }));

  const linePathD = points.reduce((acc, pt, i) => {
    if (i === 0) return `M ${pt.x},${pt.y}`;
    return `${acc} L ${pt.x},${pt.y}`;
  }, "");

  const lastPt = points[points.length - 1];
  const firstPt = points[0];
  const baselineY = getYCoord(0);

  const areaPathD = `${linePathD} L ${lastPt.x},${baselineY} L ${firstPt.x},${baselineY} Z`;

  return (
    <div className="flex flex-1 flex-col justify-between rounded-2xl border border-line bg-white p-5 sm:p-6 shadow-2xs">
      {/* Card Header: Title + Subtitle and Time Range Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
        <div className="flex flex-col gap-0.5">
          <h2 className="font-display text-base sm:text-lg font-bold text-ink">
            Evaluation Progress
          </h2>
          <p className="text-xs text-ink-muted">
            Your interview readiness over time.
          </p>
        </div>

        {/* Segmented Controls: Week / Month / All Time */}
        <div className="flex items-center rounded-xl border border-line bg-[#fbf9f5] p-1 self-start sm:self-auto">
          {(
            [
              { id: "week", label: "Week" },
              { id: "month", label: "Month" },
              { id: "all", label: "All Time" },
            ] as const
          ).map((tab) => {
            const isSelected = timeRange === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setTimeRange(tab.id)}
                className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? "border border-[#bfdbfe] bg-[#eff6ff] text-[#2563eb] shadow-2xs"
                    : "text-ink-muted hover:text-ink hover:bg-cream"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* SVG Line & Area Chart Container */}
      <div className="relative w-full overflow-hidden mt-2">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-auto overflow-visible select-none"
        >
          <defs>
            <linearGradient id="evalAreaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff6c47" stopOpacity="0.22" />
              <stop offset="60%" stopColor="#ff6c47" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#ff6c47" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Horizontal Gridlines & Y-Axis Labels */}
          {yLevels.map((lvl) => {
            const y = getYCoord(lvl.val);
            return (
              <g key={lvl.val}>
                <text
                  x={paddingLeft - 10}
                  y={y + 3.5}
                  textAnchor="end"
                  className="fill-[#9ca3af] font-mono text-[10px]"
                >
                  {lvl.label}
                </text>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={chartWidth - paddingRight}
                  y2={y}
                  stroke="#f4efe8"
                  strokeWidth="1"
                />
              </g>
            );
          })}

          {/* Vertical dashed line under latest data point */}
          <line
            x1={lastPt.x}
            y1={lastPt.y}
            x2={lastPt.x}
            y2={baselineY}
            stroke="#ff6c47"
            strokeWidth="1.5"
            strokeDasharray="4 3"
            opacity="0.8"
          />

          {/* Area Fill */}
          <path d={areaPathD} fill="url(#evalAreaGradient)" />

          {/* Orange Trend Line */}
          <path
            d={linePathD}
            fill="none"
            stroke="#ff6c47"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points and Labels */}
          {points.map((pt, idx) => {
            const isLast = idx === points.length - 1;

            return (
              <g key={idx}>
                {/* Outer shadow / glow on dot */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="5"
                  fill="#ffffff"
                  stroke="#ff6c47"
                  strokeWidth="2.5"
                />

                {/* Number Badge or Text above point */}
                {isLast ? (
                  <g transform={`translate(${pt.x}, ${pt.y - 18})`}>
                    <rect
                      x="-18"
                      y="-12"
                      width="36"
                      height="20"
                      rx="5"
                      fill="#ff6c47"
                      className="drop-shadow-2xs"
                    />
                    <text
                      x="0"
                      y="2"
                      textAnchor="middle"
                      fill="#ffffff"
                      className="font-bold text-[11px]"
                    >
                      {pt.value}%
                    </text>
                  </g>
                ) : (
                  <text
                    x={pt.x}
                    y={pt.y - 10}
                    textAnchor="middle"
                    className="fill-ink font-bold text-[11px]"
                  >
                    {pt.value}%
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* X-Axis Labels Row */}
        <div className="flex items-start justify-between pt-3 border-t border-line/60">
          {activeData.map((d, idx) => {
            const isLast = idx === activeData.length - 1;
            return (
              <div
                key={idx}
                className={`flex flex-col text-center ${
                  idx === 0
                    ? "items-start text-left pl-2 sm:pl-8"
                    : isLast
                      ? "items-end text-right pr-2 sm:pr-6"
                      : "items-center"
                }`}
              >
                <span className="font-display text-xs font-bold text-ink">
                  {d.label}
                </span>
                <span className="text-[10px] sm:text-[11px] text-ink-muted">
                  {d.subLabel}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
