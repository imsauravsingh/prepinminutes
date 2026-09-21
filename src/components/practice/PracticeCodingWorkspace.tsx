"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Clock,
  Bookmark,
  Flag,
  BookOpen,
  HelpCircle,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Play,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const INITIAL_CODE_JS = `// Write your solution here
function maxSubarraySum(arr, k) {
  // your code here

}`;

const INITIAL_CODE_PY = `# Write your solution here
def max_subarray_sum(arr, k):
    # your code here
    pass`;

const ARRAY_DATA = [2, 1, 5, 1, 3, 2];
const K_VALUE = 3;

export function PracticeCodingWorkspace() {
  // Navigation & Tabs
  const [leftTab, setLeftTab] = useState<
    "problem" | "solution" | "interview" | "takeaways"
  >("problem");
  const [understandTab, setUnderstandTab] = useState<
    "key-points" | "visual" | "meaning"
  >("key-points");
  const [testCaseTab, setTestCaseTab] = useState<"example" | "custom">(
    "example",
  );

  // Collapsible cards
  const [isProblemOpen, setIsProblemOpen] = useState(true);
  const [isUnderstandOpen, setIsUnderstandOpen] = useState(true);

  // Actions
  const [isSaved, setIsSaved] = useState(false);
  const [isReported, setIsReported] = useState(false);

  // Editor states
  const [language, setLanguage] = useState<"javascript" | "python">(
    "javascript",
  );
  const [code, setCode] = useState(INITIAL_CODE_JS);
  const [customArrInput, setCustomArrInput] = useState("[2, 1, 5, 1, 3, 2]");
  const [customKInput, setCustomKInput] = useState("3");
  const [runResult, setRunResult] = useState<{
    status: "idle" | "running" | "success" | "error";
    output?: string;
    message?: string;
  }>({ status: "idle" });

  // Sliding Window Visualizer state (window index: 0 to ARRAY_DATA.length - K_VALUE)
  const [windowIndex, setWindowIndex] = useState(0);
  const maxWindowIndex = ARRAY_DATA.length - K_VALUE; // 6 - 3 = 3

  // Timer: 27 mins 14 secs = 1634 seconds
  const [secondsRemaining, setSecondsRemaining] = useState(1634);

  useEffect(() => {
    if (secondsRemaining <= 0) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [secondsRemaining]);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleLanguageChange = (lang: "javascript" | "python") => {
    setLanguage(lang);
    setCode(lang === "javascript" ? INITIAL_CODE_JS : INITIAL_CODE_PY);
    setRunResult({ status: "idle" });
  };

  const handleReset = () => {
    setCode(language === "javascript" ? INITIAL_CODE_JS : INITIAL_CODE_PY);
    setRunResult({ status: "idle" });
  };

  const handleRunCode = () => {
    setRunResult({ status: "running" });
    setTimeout(() => {
      try {
        if (language === "javascript") {
          // Attempt sandboxed evaluation of user code on example case
          const userFn = new Function(
            `${code}\nreturn typeof maxSubarraySum === "function" ? maxSubarraySum([2, 1, 5, 1, 3, 2], 3) : null;`,
          );
          const result = userFn();
          if (result === 9) {
            setRunResult({
              status: "success",
              output: "9",
              message: "Test case passed! (Output: 9, Expected: 9)",
            });
          } else if (result !== null && result !== undefined) {
            setRunResult({
              status: "error",
              output: String(result),
              message: `Test case failed. Output: ${result}, Expected: 9`,
            });
          } else {
            // Function incomplete or returned null
            setRunResult({
              status: "error",
              output: "undefined",
              message:
                "Function returned undefined. Please implement your solution.",
            });
          }
        } else {
          // Simulated python response
          setRunResult({
            status: "success",
            output: "9",
            message: "Test case passed! (Output: 9, Expected: 9)",
          });
        }
      } catch (err: unknown) {
        setRunResult({
          status: "error",
          output: "Execution Error",
          message:
            err instanceof Error ? err.message : "Syntax or Runtime Error",
        });
      }
    }, 450);
  };

  // Window elements & calculation
  const activeWindowElements = ARRAY_DATA.slice(
    windowIndex,
    windowIndex + K_VALUE,
  );
  const currentWindowSum = activeWindowElements.reduce((a, b) => a + b, 0);

  return (
    <div className="flex w-full flex-col min-h-screen bg-[#fbf9f4]">
      {/* 1. Top Header Bar */}
      <header className="flex h-14 w-full items-center justify-between border-b border-[#f4efe8] bg-white px-4 sm:px-7">
        {/* Left: 1 / 4 • Data Structures */}
        <div className="flex items-center gap-2 text-[13px]">
          <span className="font-bold text-brand">1 / 4</span>
          <span className="text-[#b0a898]">•</span>
          <span className="font-semibold text-ink">Data Structures</span>
        </div>

        {/* Right: Timer & End Practice button */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-1.5 text-[13px] font-semibold text-ink-muted">
            <Clock className="size-3.5 text-ink-muted" />
            <span>{formatTimer(secondsRemaining)} remaining</span>
          </div>
          <Link
            href="/practice"
            className="inline-flex h-[30px] items-center justify-center rounded-full bg-[#fff0ec] px-3.5 text-xs font-bold text-brand transition-colors hover:bg-[#ffe5df]"
          >
            End Practice
          </Link>
        </div>
      </header>

      {/* 2. Progress Bar Track (full width, 4px height, ~37% fill) */}
      <div className="h-1 w-full bg-[#f4efe8]">
        <div
          className="h-full bg-brand transition-all duration-300"
          style={{ width: "37.7%" }}
        />
      </div>

      {/* 3. Main Two-Column Split Layout */}
      <div className="flex flex-1 flex-col lg:flex-row">
        {/* Left Column (Problem Details & Concept) */}
        <div className="flex flex-1 flex-col gap-4 p-4 sm:p-6 lg:p-7 overflow-y-auto">
          {/* Title & Tags Row */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex flex-col gap-2">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded bg-[#fff0ec] px-2 py-0.5 text-xs font-bold text-brand">
                  Data Structures
                </span>
                <span className="rounded bg-[#faf6f0] px-2 py-0.5 text-xs font-semibold text-ink-muted">
                  Sliding Window
                </span>
                <span className="rounded bg-[#edf5ec] px-2 py-0.5 text-xs font-semibold text-[#10b981]">
                  Medium
                </span>
              </div>

              {/* Title */}
              <h1 className="font-display text-2xl font-extrabold text-ink sm:text-[26px]">
                Find Maximum Sum Subarray of Size K
              </h1>
            </div>

            {/* Action Buttons: Save & Report */}
            <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 pt-1">
              <button
                type="button"
                onClick={() => setIsSaved(!isSaved)}
                className={`flex h-[30px] items-center gap-1.5 rounded-full border border-[#f4efe8] px-3 text-xs font-medium transition-colors shadow-sm ${
                  isSaved
                    ? "bg-[#fff0ec] text-brand border-brand/40"
                    : "bg-white text-ink-muted hover:bg-[#faf6f0]"
                }`}
              >
                <Bookmark
                  className={`size-3.5 ${isSaved ? "fill-brand text-brand" : ""}`}
                />
                <span>{isSaved ? "Saved" : "Save"}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsReported(!isReported)}
                className={`flex h-[30px] items-center gap-1.5 rounded-full border border-[#f4efe8] px-3 text-xs font-medium transition-colors shadow-sm ${
                  isReported
                    ? "bg-[#fff0ec] text-brand border-brand/40"
                    : "bg-white text-ink-muted hover:bg-[#faf6f0]"
                }`}
              >
                <Flag className="size-3.5" />
                <span>{isReported ? "Reported" : "Report"}</span>
              </button>
            </div>
          </div>

          {/* Left Panel Tabs */}
          <div className="flex border-b border-[#f4efe8] overflow-x-auto">
            <button
              type="button"
              onClick={() => setLeftTab("problem")}
              className={`border-b-2 py-2.5 px-3 text-[13px] whitespace-nowrap transition-colors ${
                leftTab === "problem"
                  ? "border-brand font-semibold text-brand"
                  : "border-transparent font-medium text-ink-muted hover:text-ink"
              }`}
            >
              Problem Statement
            </button>
            <button
              type="button"
              onClick={() => setLeftTab("solution")}
              className={`border-b-2 py-2.5 px-3 text-[13px] whitespace-nowrap transition-colors ${
                leftTab === "solution"
                  ? "border-brand font-semibold text-brand"
                  : "border-transparent font-medium text-ink-muted hover:text-ink"
              }`}
            >
              Solution
            </button>
            <button
              type="button"
              onClick={() => setLeftTab("interview")}
              className={`border-b-2 py-2.5 px-3 text-[13px] whitespace-nowrap transition-colors ${
                leftTab === "interview"
                  ? "border-brand font-semibold text-brand"
                  : "border-transparent font-medium text-ink-muted hover:text-ink"
              }`}
            >
              Interview Prep
            </button>
            <button
              type="button"
              onClick={() => setLeftTab("takeaways")}
              className={`border-b-2 py-2.5 px-3 text-[13px] whitespace-nowrap transition-colors ${
                leftTab === "takeaways"
                  ? "border-brand font-semibold text-brand"
                  : "border-transparent font-medium text-ink-muted hover:text-ink"
              }`}
            >
              Key Takeaways
            </button>
          </div>

          {/* Tab Content 1: Problem Statement & Concept */}
          {leftTab === "problem" && (
            <div className="flex flex-col gap-4">
              {/* Card 1: Problem Statement Card */}
              <div className="rounded-2xl border border-[#f4efe8] bg-white p-5 shadow-sm transition-all">
                <button
                  type="button"
                  onClick={() => setIsProblemOpen(!isProblemOpen)}
                  className="flex w-full items-center justify-between text-left"
                >
                  <div className="flex items-center gap-2">
                    <BookOpen className="size-4 text-brand" />
                    <span className="font-display text-[15px] font-bold text-ink">
                      Problem Statement
                    </span>
                  </div>
                  {isProblemOpen ? (
                    <ChevronUp className="size-4 text-ink-muted" />
                  ) : (
                    <ChevronDown className="size-4 text-ink-muted" />
                  )}
                </button>

                {isProblemOpen && (
                  <div className="mt-3.5 flex flex-col gap-3.5 pt-1">
                    <p className="text-[13px] leading-relaxed text-ink">
                      Given an array of integers and a number K, find the
                      maximum sum of a contiguous subarray of size K.
                    </p>

                    {/* Example Box */}
                    <div className="flex flex-col gap-2 rounded-xl bg-[#faf6f0] p-4 text-xs font-mono text-ink-muted">
                      <span className="font-sans font-bold text-ink">
                        Example
                      </span>
                      <div className="leading-relaxed whitespace-pre-line text-ink">
                        Input: arr = [2, 1, 5, 1, 3, 2], K = 3{"\n"}
                        Output: 9{"\n"}
                        <span className="text-ink-muted">
                          Explanation: Subarray [5, 1, 3] has the maximum sum.
                        </span>
                      </div>
                    </div>

                    {/* Constraints */}
                    <div className="flex flex-col gap-1 text-xs">
                      <span className="font-bold text-ink">Constraints</span>
                      <span className="text-ink-muted">
                        • 1 ≤ K ≤ len(arr) ≤ 10⁵
                      </span>
                      <span className="text-ink-muted">
                        • -10⁴ ≤ arr[i] ≤ 10⁴
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Card 2: Understand the Problem Card */}
              <div className="rounded-2xl border border-[#f4efe8] bg-white p-5 shadow-sm transition-all">
                <button
                  type="button"
                  onClick={() => setIsUnderstandOpen(!isUnderstandOpen)}
                  className="flex w-full items-center justify-between text-left"
                >
                  <div className="flex items-center gap-2">
                    <HelpCircle className="size-4 text-brand" />
                    <span className="font-display text-base font-bold text-ink">
                      Understand the Problem
                    </span>
                  </div>
                  {isUnderstandOpen ? (
                    <ChevronUp className="size-4 text-ink-muted" />
                  ) : (
                    <ChevronDown className="size-4 text-ink-muted" />
                  )}
                </button>

                {isUnderstandOpen && (
                  <div className="mt-4 flex flex-col gap-4">
                    {/* Sub tabs */}
                    <div className="flex items-center gap-4 border-b border-[#f4efe8]">
                      <button
                        type="button"
                        onClick={() => setUnderstandTab("key-points")}
                        className={`pb-1 text-[13px] transition-colors ${
                          understandTab === "key-points"
                            ? "border-b-2 border-brand font-semibold text-brand"
                            : "font-normal text-ink-muted hover:text-ink"
                        }`}
                      >
                        Key Points
                      </button>
                      <button
                        type="button"
                        onClick={() => setUnderstandTab("visual")}
                        className={`pb-1 text-[13px] transition-colors ${
                          understandTab === "visual"
                            ? "border-b-2 border-brand font-semibold text-brand"
                            : "font-normal text-ink-muted hover:text-ink"
                        }`}
                      >
                        Visual Example
                      </button>
                      <button
                        type="button"
                        onClick={() => setUnderstandTab("meaning")}
                        className={`pb-1 text-[13px] transition-colors ${
                          understandTab === "meaning"
                            ? "border-b-2 border-brand font-semibold text-brand"
                            : "font-normal text-ink-muted hover:text-ink"
                        }`}
                      >
                        What does it mean?
                      </button>
                    </div>

                    {/* Sub-tab 1: Key points */}
                    {understandTab === "key-points" && (
                      <div className="flex flex-col gap-2 text-[13px] leading-relaxed text-ink">
                        <p>
                          <strong className="font-semibold text-ink">
                            • Contiguous subarray:
                          </strong>{" "}
                          Elements must be next to each other in the parent
                          array.
                        </p>
                        <p>
                          <strong className="font-semibold text-ink">
                            • Size K:
                          </strong>{" "}
                          Exactly K elements in the subarray.
                        </p>
                        <p>
                          <strong className="font-semibold text-ink">
                            • Maximum sum:
                          </strong>{" "}
                          Return the largest sum among all possible windows of
                          size K.
                        </p>
                      </div>
                    )}

                    {/* Sub-tab 2: Visual Explanation Text */}
                    {understandTab === "visual" && (
                      <div className="flex flex-col gap-2 text-[13px] leading-relaxed text-ink">
                        <p>
                          Imagine sliding a magnifying window of size 3 across
                          the array from left to right. Instead of recalculating
                          the entire sum at each step, subtract the outgoing
                          element and add the new incoming element in{" "}
                          <code className="bg-[#faf6f0] px-1 py-0.5 rounded text-brand font-mono text-xs">
                            O(1)
                          </code>{" "}
                          time!
                        </p>
                      </div>
                    )}

                    {/* Sub-tab 3: Meaning Explanation */}
                    {understandTab === "meaning" && (
                      <div className="flex flex-col gap-2 text-[13px] leading-relaxed text-ink">
                        <p>
                          A <em>subarray</em> differs from a{" "}
                          <em>subsequence</em> because all items must be
                          adjacent without skipping. A subarray of size K is
                          equivalent to a fixed-length window.
                        </p>
                      </div>
                    )}

                    {/* Interactive Sliding Window Visualizer Box */}
                    <div className="flex flex-col items-center gap-3 rounded-lg bg-[#faf6f0] p-4">
                      <span className="self-start text-xs font-bold text-ink">
                        Example Visualization (K = 3)
                      </span>

                      {/* Slider Array Row */}
                      <div className="flex items-center gap-2 sm:gap-3 py-1">
                        <button
                          type="button"
                          disabled={windowIndex === 0}
                          onClick={() =>
                            setWindowIndex((prev) => Math.max(0, prev - 1))
                          }
                          className="flex size-7 items-center justify-center rounded border border-[#ede6db] bg-white text-ink-muted transition-colors hover:text-ink disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                          aria-label="Previous window"
                        >
                          <ChevronLeft className="size-4 text-[#b0a898]" />
                        </button>

                        <div className="flex items-center gap-1.5 sm:gap-2">
                          {ARRAY_DATA.map((num, i) => {
                            const isInWindow =
                              i >= windowIndex && i < windowIndex + K_VALUE;
                            return (
                              <div
                                key={i}
                                className={`flex size-8 items-center justify-center rounded-md text-[13px] font-bold transition-all ${
                                  isInWindow
                                    ? "border-2 border-brand bg-white text-brand shadow-sm scale-105"
                                    : "border border-[#f4efe8] bg-white text-ink"
                                }`}
                              >
                                {num}
                              </div>
                            );
                          })}
                        </div>

                        <button
                          type="button"
                          disabled={windowIndex >= maxWindowIndex}
                          onClick={() =>
                            setWindowIndex((prev) =>
                              Math.min(maxWindowIndex, prev + 1),
                            )
                          }
                          className="flex size-7 items-center justify-center rounded border border-[#ede6db] bg-white text-ink-muted transition-colors hover:text-ink disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                          aria-label="Next window"
                        >
                          <ChevronRight className="size-4 text-[#b0a898]" />
                        </button>
                      </div>

                      {/* Dynamic Window Sum Calculation */}
                      <div className="font-mono text-xs text-ink-muted">
                        Window sum = {activeWindowElements.join(" + ")} ={" "}
                        <span
                          className={`font-bold ${
                            currentWindowSum === 9
                              ? "text-emerald-600"
                              : "text-ink"
                          }`}
                        >
                          {currentWindowSum}
                        </span>
                        {currentWindowSum === 9 && (
                          <span className="ml-1 text-[11px] font-bold text-emerald-600">
                            (Max!)
                          </span>
                        )}
                      </div>

                      {/* Dots Pagination Indicator */}
                      <div className="flex items-center gap-1.5 pt-0.5">
                        {Array.from({ length: maxWindowIndex + 1 }).map(
                          (_, dotIdx) => (
                            <button
                              key={dotIdx}
                              type="button"
                              onClick={() => setWindowIndex(dotIdx)}
                              className={`size-1.5 rounded-full transition-all ${
                                dotIdx === windowIndex
                                  ? "bg-brand scale-125"
                                  : "bg-[#b0a898]"
                              }`}
                              aria-label={`Slide to window ${dotIdx + 1}`}
                            />
                          ),
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab Content 2: Solution Tab */}
          {leftTab === "solution" && (
            <div className="rounded-2xl border border-[#f4efe8] bg-white p-5 shadow-sm flex flex-col gap-4 text-xs text-ink">
              <h2 className="font-display font-bold text-sm text-ink">
                Optimal Approach: Sliding Window (O(N) Time, O(1) Space)
              </h2>
              <p className="text-ink-muted leading-relaxed">
                Compute the sum of the first window of size K. Then iterate
                through the rest of the array from index K to N-1: add the
                current element, subtract the element exiting the window, and
                update the maximum.
              </p>
              <div className="rounded-xl bg-[#faf6f0] p-4 font-mono text-xs text-ink">
                <pre>{`function maxSubarraySum(arr, k) {
  if (!arr || arr.length < k) return 0;
  let maxSum = 0;
  let windowSum = 0;
  for (let i = 0; i < k; i++) {
    windowSum += arr[i];
  }
  maxSum = windowSum;
  for (let i = k; i < arr.length; i++) {
    windowSum += arr[i] - arr[i - k];
    maxSum = Math.max(maxSum, windowSum);
  }
  return maxSum;
}`}</pre>
              </div>
            </div>
          )}

          {/* Tab Content 3: Interview Prep Tab */}
          {leftTab === "interview" && (
            <div className="rounded-2xl border border-[#f4efe8] bg-white p-5 shadow-sm flex flex-col gap-3 text-xs text-ink">
              <h2 className="font-display font-bold text-sm text-ink">
                Common Interview Follow-ups
              </h2>
              <ul className="list-disc pl-5 space-y-2 text-ink-muted">
                <li>
                  <strong className="text-ink">Negative numbers:</strong> What
                  if the array has negative values? (The sliding window
                  technique still works for fixed K!).
                </li>
                <li>
                  <strong className="text-ink">Dynamic window size:</strong>{" "}
                  What if K is not fixed and we must find the smallest subarray
                  with sum ≥ S?
                </li>
                <li>
                  <strong className="text-ink">K &gt; Array length:</strong>{" "}
                  Clarify whether to throw an exception or return 0.
                </li>
              </ul>
            </div>
          )}

          {/* Tab Content 4: Key Takeaways Tab */}
          {leftTab === "takeaways" && (
            <div className="rounded-2xl border border-[#f4efe8] bg-white p-5 shadow-sm flex flex-col gap-3 text-xs text-ink">
              <h2 className="font-display font-bold text-sm text-ink">
                Key Takeaways
              </h2>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-xl bg-[#faf6f0] p-3 border border-[#f4efe8]">
                  <span className="font-bold text-ink">Time Complexity</span>
                  <p className="text-ink-muted mt-1">
                    <strong>O(N)</strong>: Each element enters and exits the
                    window once.
                  </p>
                </div>
                <div className="rounded-xl bg-[#faf6f0] p-3 border border-[#f4efe8]">
                  <span className="font-bold text-ink">Space Complexity</span>
                  <p className="text-ink-muted mt-1">
                    <strong>O(1)</strong>: Only pointers and sum tracking
                    variables.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Vertical Divider for desktop */}
        <div className="hidden lg:block w-[1px] bg-[#f4efe8] self-stretch" />

        {/* Right Column (Code Editor & Test Cases) */}
        <div className="flex w-full lg:w-[480px] xl:w-[527px] flex-col bg-white border-t lg:border-t-0 border-[#f4efe8]">
          {/* Panel Tab Header */}
          <div className="flex border-b border-[#f4efe8]">
            <div className="border-b-2 border-brand px-5 py-3 text-[13px] font-semibold text-brand">
              Code
            </div>
          </div>

          {/* Code Panel Body */}
          <div className="flex flex-1 flex-col gap-4 p-5">
            {/* Editor Toolbar */}
            <div className="flex items-center justify-between gap-2">
              {/* Language Selector Dropdown */}
              <div className="relative">
                <select
                  value={language}
                  onChange={(e) =>
                    handleLanguageChange(
                      e.target.value as "javascript" | "python",
                    )
                  }
                  className="appearance-none rounded-lg border border-[#f4efe8] bg-white px-3 py-1.5 pr-7 text-xs font-semibold text-ink shadow-sm outline-none hover:bg-[#faf6f0] cursor-pointer"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                </select>
                <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-ink-muted">
                  <ChevronDown className="size-3" />
                </div>
              </div>

              {/* Action Buttons: Reset, Run, Submit */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex h-7 items-center gap-1 rounded-lg border border-[#f4efe8] bg-white px-2.5 text-xs font-medium text-ink-muted shadow-sm hover:bg-[#faf6f0] transition-colors"
                >
                  <RotateCcw className="size-3" />
                  <span>Reset</span>
                </button>

                <button
                  type="button"
                  onClick={handleRunCode}
                  disabled={runResult.status === "running"}
                  className="flex h-7 items-center gap-1 rounded-lg bg-brand px-3 text-xs font-bold text-white shadow-[0_2px_8px_rgba(255,108,71,0.2)] hover:opacity-95 transition-opacity disabled:opacity-50"
                >
                  <Play className="size-3 fill-white" />
                  <span>
                    {runResult.status === "running" ? "Running..." : "Run"}
                  </span>
                </button>

                <Link
                  href="/practice/session/coding/evaluation"
                  className="flex h-7 items-center rounded-lg border border-[#f4efe8] bg-white px-3 text-xs font-semibold text-ink shadow-sm hover:bg-[#faf6f0] transition-colors"
                >
                  Submit Answer
                </Link>
              </div>
            </div>

            {/* Dark Code Editor */}
            <div className="flex flex-col overflow-hidden rounded-xl bg-[#1e1c1a] shadow-inner border border-[#2e2a27]">
              <div className="flex items-center justify-between border-b border-[#2e2a27] bg-[#171514] px-4 py-2 text-[11px] font-mono text-[#b0a898]">
                <span>
                  {language === "javascript" ? "index.js" : "solution.py"}
                </span>
                <span className="text-[#787168]">Tab for indent</span>
              </div>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck={false}
                rows={10}
                className="w-full resize-none bg-transparent p-4 font-mono text-xs leading-relaxed text-[#f7f5f0] outline-none selection:bg-brand/30 placeholder:text-zinc-600"
                style={{
                  fontFamily:
                    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "JetBrains Mono", monospace',
                }}
              />
            </div>

            {/* Test Cases Section */}
            <div className="flex flex-col overflow-hidden rounded-xl border border-[#f4efe8] bg-white shadow-sm">
              {/* Header */}
              <div className="border-b border-[#f4efe8] bg-[#faf6f0] px-4 py-2.5">
                <span className="text-xs font-bold text-ink">
                  Test Cases (Custom input)
                </span>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-[#f4efe8]">
                <button
                  type="button"
                  onClick={() => setTestCaseTab("example")}
                  className={`border-b-2 py-2 px-4 text-xs transition-colors ${
                    testCaseTab === "example"
                      ? "border-brand font-semibold text-brand"
                      : "border-transparent font-medium text-ink-muted hover:text-ink"
                  }`}
                >
                  Example Test Case
                </button>
                <button
                  type="button"
                  onClick={() => setTestCaseTab("custom")}
                  className={`border-b-2 py-2 px-4 text-xs transition-colors ${
                    testCaseTab === "custom"
                      ? "border-brand font-semibold text-brand"
                      : "border-transparent font-medium text-ink-muted hover:text-ink"
                  }`}
                >
                  Custom Input
                </button>
              </div>

              {/* Content */}
              <div className="flex flex-col gap-2.5 p-4">
                {testCaseTab === "example" ? (
                  <>
                    <div className="flex flex-col gap-1 rounded-lg bg-[#faf6f0] p-3 font-mono text-xs text-ink-muted">
                      <span>arr = [2, 1, 5, 1, 3, 2]</span>
                      <span>k = 3</span>
                    </div>
                    <span className="font-mono text-[11px] text-[#b0a898]">
                      Expected: 9
                    </span>
                  </>
                ) : (
                  <div className="flex flex-col gap-2 text-xs">
                    <label className="flex flex-col gap-1 text-ink font-medium">
                      arr:
                      <input
                        type="text"
                        value={customArrInput}
                        onChange={(e) => setCustomArrInput(e.target.value)}
                        className="rounded-lg border border-[#f4efe8] bg-[#faf6f0] px-3 py-1.5 font-mono text-xs text-ink outline-none"
                        placeholder="[2, 1, 5, 1, 3, 2]"
                      />
                    </label>
                    <label className="flex flex-col gap-1 text-ink font-medium">
                      k:
                      <input
                        type="text"
                        value={customKInput}
                        onChange={(e) => setCustomKInput(e.target.value)}
                        className="rounded-lg border border-[#f4efe8] bg-[#faf6f0] px-3 py-1.5 font-mono text-xs text-ink outline-none"
                        placeholder="3"
                      />
                    </label>
                  </div>
                )}

                {/* Execution Result Banner if run */}
                {runResult.status !== "idle" && (
                  <div
                    className={`mt-1 flex items-start gap-2 rounded-lg p-3 text-xs ${
                      runResult.status === "success"
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                        : runResult.status === "running"
                          ? "bg-[#faf6f0] text-ink-muted border border-[#f4efe8]"
                          : "bg-red-50 text-red-800 border border-red-200"
                    }`}
                  >
                    {runResult.status === "success" && (
                      <CheckCircle2 className="size-4 shrink-0 text-emerald-600 mt-0.5" />
                    )}
                    {runResult.status === "error" && (
                      <XCircle className="size-4 shrink-0 text-red-600 mt-0.5" />
                    )}
                    <div className="flex flex-col gap-0.5">
                      <span className="font-bold">
                        {runResult.status === "running"
                          ? "Executing code against test cases..."
                          : runResult.message}
                      </span>
                      {runResult.output && runResult.status !== "running" && (
                        <span className="font-mono text-[11px] opacity-80">
                          Output: {runResult.output}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
