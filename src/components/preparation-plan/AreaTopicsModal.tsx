"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  X,
  ChevronUp,
  ChevronDown,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Circle,
  ArrowUpDown,
  RotateCcw,
} from "lucide-react";

export type ModalTopicItem = {
  id: string;
  num: number;
  name: string;
  type: "Reading" | "Practice";
  estTime: string;
  status: "Not Started" | "In Progress" | "Completed";
  phase: string;
};

interface AreaTopicsModalProps {
  isOpen: boolean;
  onClose: () => void;
  areaTitle: string;
  areaIcon: React.ElementType;
  areaIconBg: string;
  areaIconColor: string;
  areaRoute: string;
  initialTopics: ModalTopicItem[];
  onSaveTopicsOrder?: (orderedTopics: ModalTopicItem[]) => void;
}

const PAGE_SIZE = 5;

export function AreaTopicsModal({
  isOpen,
  onClose,
  areaTitle,
  areaIcon: Icon,
  areaIconBg,
  areaIconColor,
  areaRoute,
  initialTopics,
  onSaveTopicsOrder,
}: AreaTopicsModalProps) {
  const [topics, setTopics] = useState<ModalTopicItem[]>(initialTopics);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModified, setIsModified] = useState(false);

  // Sync state when initialTopics changes
  useEffect(() => {
    setTopics(initialTopics);
    setCurrentPage(1);
    setIsModified(false);
  }, [initialTopics]);

  // Handle Escape key and body lock
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const totalPages = Math.ceil(topics.length / PAGE_SIZE) || 1;
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = Math.min(startIndex + PAGE_SIZE, topics.length);
  const currentTopics = topics.slice(startIndex, endIndex);

  // Move topic up in sequence
  const moveTopicUp = (index: number) => {
    if (index <= 0) return;
    const newTopics = [...topics];
    const temp = newTopics[index];
    newTopics[index] = newTopics[index - 1];
    newTopics[index - 1] = temp;

    // Recalculate num
    const reordered = newTopics.map((t, i) => ({ ...t, num: i + 1 }));
    setTopics(reordered);
    setIsModified(true);
    if (onSaveTopicsOrder) onSaveTopicsOrder(reordered);

    // If item moved to previous page, navigate back
    if (index === startIndex && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  // Move topic down in sequence
  const moveTopicDown = (index: number) => {
    if (index >= topics.length - 1) return;
    const newTopics = [...topics];
    const temp = newTopics[index];
    newTopics[index] = newTopics[index + 1];
    newTopics[index + 1] = temp;

    // Recalculate num
    const reordered = newTopics.map((t, i) => ({ ...t, num: i + 1 }));
    setTopics(reordered);
    setIsModified(true);
    if (onSaveTopicsOrder) onSaveTopicsOrder(reordered);

    // If item moved to next page, navigate forward
    if (index === endIndex - 1 && currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  // Reset to original order
  const handleReset = () => {
    setTopics(initialTopics);
    setIsModified(false);
    if (onSaveTopicsOrder) onSaveTopicsOrder(initialTopics);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden
      />

      {/* Modal Card */}
      <div className="relative z-10 flex w-full max-w-4xl max-h-[90vh] flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-line px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div
              className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${areaIconBg} ${areaIconColor}`}
            >
              <Icon className="size-5" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h2 className="font-display text-lg font-extrabold text-ink sm:text-xl">
                  {areaTitle} Topics
                </h2>
                <span className="rounded-full bg-[#f4efe8] px-2.5 py-0.5 text-xs font-bold text-ink-muted">
                  {topics.length} total
                </span>
              </div>
              <p className="text-xs text-ink-muted">
                View, reprioritize sequence, and start practice for all topics
                in this area.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isModified && (
              <button
                type="button"
                onClick={handleReset}
                className="hidden sm:flex items-center gap-1 text-xs font-medium text-ink-muted hover:text-ink transition-colors px-2 py-1 rounded-md hover:bg-cream"
                title="Reset to default sequence"
              >
                <RotateCcw className="size-3" />
                <span>Reset order</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="flex size-8 items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-cream hover:text-ink"
              aria-label="Close modal"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* Prioritize Tip Callout Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-[#faf8f5] px-5 py-2.5 sm:px-6 text-xs text-ink-muted">
          <div className="flex items-center gap-2">
            <ArrowUpDown className="size-3.5 text-brand shrink-0" />
            <span>
              Use the <strong className="font-semibold text-ink">↑</strong> and{" "}
              <strong className="font-semibold text-ink">↓</strong> arrows to
              change the topic practice sequence.
            </span>
          </div>
          <span className="font-medium text-ink-muted">
            Page {currentPage} of {totalPages}
          </span>
        </div>

        {/* Modal Body / Topics Table */}
        <div className="flex-1 overflow-y-auto px-5 py-4 sm:px-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-line text-ink-muted/80">
                  <th className="pb-3 font-semibold w-24 text-center">
                    Priority
                  </th>
                  <th className="pb-3 font-semibold min-w-[200px]">Topic</th>
                  <th className="pb-3 font-semibold w-24">Type</th>
                  <th className="pb-3 font-semibold w-24">Est. Time</th>
                  <th className="pb-3 font-semibold w-36">Phase</th>
                  <th className="pb-3 font-semibold w-28">Status</th>
                  <th className="pb-3 font-semibold w-24 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {currentTopics.map((topic, localIdx) => {
                  const globalIdx = startIndex + localIdx;
                  const isFirst = globalIdx === 0;
                  const isLast = globalIdx === topics.length - 1;

                  return (
                    <tr
                      key={topic.id}
                      className="group hover:bg-[#fbf9f4] transition-colors"
                    >
                      {/* Priority sequence with Up/Down buttons */}
                      <td className="py-3 px-2">
                        <div className="flex items-center justify-center gap-1">
                          <span className="flex size-6 items-center justify-center rounded-md bg-[#f4efe8] text-[11px] font-bold text-ink font-mono">
                            {String(topic.num).padStart(2, "0")}
                          </span>
                          <div className="flex flex-col">
                            <button
                              type="button"
                              onClick={() => moveTopicUp(globalIdx)}
                              disabled={isFirst}
                              title="Move up in priority"
                              className={`flex size-4 items-center justify-center rounded transition-colors ${
                                isFirst
                                  ? "text-gray-300 cursor-not-allowed"
                                  : "text-ink-muted hover:bg-cream hover:text-brand cursor-pointer"
                              }`}
                            >
                              <ChevronUp className="size-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => moveTopicDown(globalIdx)}
                              disabled={isLast}
                              title="Move down in priority"
                              className={`flex size-4 items-center justify-center rounded transition-colors ${
                                isLast
                                  ? "text-gray-300 cursor-not-allowed"
                                  : "text-ink-muted hover:bg-cream hover:text-brand cursor-pointer"
                              }`}
                            >
                              <ChevronDown className="size-3.5" />
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* Topic Name */}
                      <td className="py-3 pr-3 font-semibold text-ink">
                        <div className="flex flex-col gap-0.5">
                          <span>{topic.name}</span>
                        </div>
                      </td>

                      {/* Type Badge */}
                      <td className="py-3">
                        {topic.type === "Reading" ? (
                          <span className="inline-flex rounded border border-[#dbeafe] bg-[#eff6ff] px-2 py-0.5 text-[11px] font-semibold text-[#2563eb]">
                            Reading
                          </span>
                        ) : (
                          <span className="inline-flex rounded border border-[#a7f3d0] bg-[#ecfdf5] px-2 py-0.5 text-[11px] font-semibold text-[#059669]">
                            Practice
                          </span>
                        )}
                      </td>

                      {/* Estimated Time */}
                      <td className="py-3 text-ink-muted whitespace-nowrap">
                        {topic.estTime}
                      </td>

                      {/* Phase Badge */}
                      <td className="py-3">
                        <span className="inline-flex rounded-full bg-[#faf6f0] px-2.5 py-0.5 text-[11px] font-medium text-ink-muted border border-[#ede6db]">
                          {topic.phase}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3">
                        <span className="inline-flex items-center gap-1.5 text-[11px] text-ink-muted whitespace-nowrap">
                          <Circle className="size-2.5 text-ink-muted/60" />
                          <span>{topic.status}</span>
                        </span>
                      </td>

                      {/* Start Action */}
                      <td className="py-3 text-right">
                        <Link
                          href={`${areaRoute}?topic=${encodeURIComponent(topic.name)}`}
                          onClick={onClose}
                          className="inline-flex items-center gap-1 rounded-lg border border-line bg-white px-3 py-1 text-xs font-semibold text-ink shadow-xs transition-colors hover:border-line-strong hover:bg-cream"
                        >
                          <span>Start</span>
                          <ArrowRight className="size-3 text-ink" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Footer with Pagination Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line bg-white px-5 py-3 sm:px-6">
          <div className="text-xs text-ink-muted">
            Showing{" "}
            <strong className="font-semibold text-ink">{startIndex + 1}</strong>{" "}
            to <strong className="font-semibold text-ink">{endIndex}</strong> of{" "}
            <strong className="font-semibold text-ink">{topics.length}</strong>{" "}
            topics
          </div>

          <div className="flex items-center gap-1.5">
            {/* Previous Page */}
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`flex items-center gap-1 rounded-lg border border-line px-2.5 py-1 text-xs font-medium transition-colors ${
                currentPage === 1
                  ? "text-gray-300 border-gray-100 cursor-not-allowed"
                  : "text-ink hover:bg-cream hover:border-line-strong cursor-pointer"
              }`}
            >
              <ChevronLeft className="size-3.5" />
              <span>Previous</span>
            </button>

            {/* Page number buttons */}
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNum) => (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => setCurrentPage(pageNum)}
                    className={`size-7 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      currentPage === pageNum
                        ? "bg-brand text-white shadow-xs"
                        : "text-ink hover:bg-cream border border-transparent hover:border-line"
                    }`}
                  >
                    {pageNum}
                  </button>
                ),
              )}
            </div>

            {/* Next Page */}
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={`flex items-center gap-1 rounded-lg border border-line px-2.5 py-1 text-xs font-medium transition-colors ${
                currentPage === totalPages
                  ? "text-gray-300 border-gray-100 cursor-not-allowed"
                  : "text-ink hover:bg-cream hover:border-line-strong cursor-pointer"
              }`}
            >
              <span>Next</span>
              <ChevronRight className="size-3.5" />
            </button>

            {/* Done Button */}
            <button
              type="button"
              onClick={onClose}
              className="ml-2 rounded-lg bg-ink px-4 py-1.5 text-xs font-semibold text-white shadow-xs hover:opacity-90 transition-opacity cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
