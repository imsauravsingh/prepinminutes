"use client";

import React from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface AdminPaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  itemLabel?: string;
}

export function AdminPagination({
  currentPage,
  totalItems,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50],
  itemLabel = "items",
}: AdminPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);

  const startItem = totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endItem = Math.min(safePage * pageSize, totalItems);

  // Generate page numbers with smart ellipsis window
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (safePage > 3) pages.push("...");
      const start = Math.max(2, safePage - 1);
      const end = Math.min(totalPages - 1, safePage + 1);
      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }
      if (safePage < totalPages - 2) pages.push("...");
      if (!pages.includes(totalPages)) pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-xl bg-[#161b22] border border-[#30363d] text-xs select-none">
      {/* Left: Summary and Page Size */}
      <div className="flex items-center space-x-3 text-[#8b949e]">
        <span>
          Showing <span className="font-semibold text-white">{startItem}</span> to{" "}
          <span className="font-semibold text-white">{endItem}</span> of{" "}
          <span className="font-semibold text-white">{totalItems}</span> {itemLabel}
        </span>

        {onPageSizeChange && (
          <div className="flex items-center space-x-1.5 pl-3 border-l border-[#30363d]">
            <span className="text-[11px]">Per page:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="bg-[#0d1117] border border-[#30363d] rounded-lg px-2 py-0.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Right: Controls & Page Numbers */}
      <div className="flex items-center space-x-1">
        {/* First page */}
        <button
          onClick={() => onPageChange(1)}
          disabled={safePage <= 1}
          className="p-1.5 rounded-lg text-[#8b949e] hover:text-white hover:bg-[#21262d] disabled:opacity-30 disabled:pointer-events-none transition"
          title="First page"
        >
          <ChevronsLeft className="size-3.5" />
        </button>

        {/* Previous page */}
        <button
          onClick={() => onPageChange(safePage - 1)}
          disabled={safePage <= 1}
          className="p-1.5 rounded-lg text-[#8b949e] hover:text-white hover:bg-[#21262d] disabled:opacity-30 disabled:pointer-events-none transition"
          title="Previous page"
        >
          <ChevronLeft className="size-3.5" />
        </button>

        {/* Page numbers */}
        <div className="flex items-center space-x-1 px-1">
          {getPageNumbers().map((p, idx) =>
            p === "..." ? (
              <span key={`dots-${idx}`} className="px-2 py-1 text-[#8b949e] font-mono">
                ...
              </span>
            ) : (
              <button
                key={`page-${p}`}
                onClick={() => onPageChange(Number(p))}
                className={`min-w-7 h-7 px-2 rounded-lg text-xs font-semibold font-mono transition ${
                  p === safePage
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm"
                    : "text-[#8b949e] hover:text-white hover:bg-[#21262d]"
                }`}
              >
                {p}
              </button>
            )
          )}
        </div>

        {/* Next page */}
        <button
          onClick={() => onPageChange(safePage + 1)}
          disabled={safePage >= totalPages}
          className="p-1.5 rounded-lg text-[#8b949e] hover:text-white hover:bg-[#21262d] disabled:opacity-30 disabled:pointer-events-none transition"
          title="Next page"
        >
          <ChevronRight className="size-3.5" />
        </button>

        {/* Last page */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={safePage >= totalPages}
          className="p-1.5 rounded-lg text-[#8b949e] hover:text-white hover:bg-[#21262d] disabled:opacity-30 disabled:pointer-events-none transition"
          title="Last page"
        >
          <ChevronsRight className="size-3.5" />
        </button>
      </div>
    </div>
  );
}

