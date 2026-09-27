"use client";

import React from "react";
import { Variable, Layers } from "lucide-react";
import { ExecutionStep } from "./types";

interface LiveVariablesInspectorProps {
  step: ExecutionStep;
  className?: string;
}

export function LiveVariablesInspector({
  step,
  className = "",
}: LiveVariablesInspectorProps) {
  const { variables = {}, dataStructures = [] } = step;
  const variableEntries = Object.entries(variables);

  return (
    <div
      className={`flex flex-col rounded-2xl bg-[#171514] border border-[#2d2925] p-3.5 sm:p-4 text-[#ede8de] shadow-md ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#292522]">
        <div className="flex items-center gap-2">
          <Variable className="size-4 text-brand" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            Live Variables &amp; State
          </span>
        </div>
        <span className="text-[11px] font-mono text-[#a1998b]">
          {variableEntries.length} active
        </span>
      </div>

      {/* Variables Grid */}
      <div className="pt-3 flex flex-col gap-3">
        {variableEntries.length === 0 ? (
          <div className="text-xs text-[#7e766b] italic py-1">
            No active variables initialized in this step.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {variableEntries.map(([key, val]) => (
              <div
                key={key}
                className="flex flex-col gap-0.5 rounded-xl bg-[#201d1a] border border-[#352f2a] p-2 transition-all hover:border-brand/40"
              >
                <span className="font-mono text-[11px] text-[#9b9283] truncate">
                  {key}
                </span>
                <span className="font-mono text-xs font-bold text-brand truncate">
                  {typeof val === "object" ? JSON.stringify(val) : String(val)}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Live Data Structures Snapshots */}
        {dataStructures.length > 0 && (
          <div className="mt-1 pt-3 border-t border-[#292522] flex flex-col gap-3">
            {dataStructures.map((ds, dsIdx) => (
              <div key={ds.id || dsIdx} className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5 font-semibold text-[#a69e90]">
                    <Layers className="size-3.5 text-brand" />
                    <span>
                      {ds.name || ds.type}:{" "}
                      <strong className="text-white capitalize">
                        {ds.type.replace("_", " ")}
                      </strong>
                    </span>
                  </div>
                  {ds.pointers && Object.keys(ds.pointers).length > 0 && (
                    <div className="flex items-center gap-1 font-mono text-[10px] text-brand">
                      {Object.entries(ds.pointers).map(([pName, pVal]) => (
                        <span
                          key={pName}
                          className="rounded bg-[#2a1c17] px-1.5 py-0.5 border border-brand/30"
                        >
                          {pName}={String(pVal)}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* If Array data */}
                {Array.isArray(ds.data) && (
                  <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                    {ds.data.map((item, i) => {
                      const isHighlighted = ds.highlightIndices?.includes(i);
                      const displayVal =
                        typeof item === "object" && item !== null
                          ? item.val !== undefined
                            ? item.val
                            : JSON.stringify(item)
                          : String(item);

                      return (
                        <div
                          key={i}
                          className={`flex flex-col items-center justify-center min-w-[34px] h-[34px] rounded-lg font-mono text-xs font-bold transition-all ${
                            isHighlighted
                              ? "bg-brand text-white border-2 border-[#ff9175] shadow-xs scale-105"
                              : "bg-[#25211e] text-[#d6cec2] border border-[#3b342e]"
                          }`}
                        >
                          <span>{displayVal}</span>
                          <span className="text-[8px] opacity-70 leading-none">
                            [{i}]
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* If Object / HashMap data */}
                {!Array.isArray(ds.data) &&
                  typeof ds.data === "object" &&
                  ds.data !== null && (
                    <div className="flex flex-wrap gap-1.5">
                      {Object.entries(ds.data).length === 0 ? (
                        <span className="text-[11px] text-[#7d756a] italic">
                          Map is empty {"{ }"}
                        </span>
                      ) : (
                        Object.entries(ds.data).map(([k, v]) => (
                          <span
                            key={k}
                            className={`rounded-lg border px-2 py-1 font-mono text-[11px] ${
                              ds.activeKey === k
                                ? "bg-brand/20 border-brand text-white font-bold"
                                : "bg-[#24201c] border-[#3d3630] text-[#dad3c7]"
                            }`}
                          >
                            <strong className="text-brand">{k}</strong>:{" "}
                            {String(v)}
                          </span>
                        ))
                      )}
                    </div>
                  )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
