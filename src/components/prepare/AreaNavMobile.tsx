"use client";

import { useEffect, useRef, useState, type ComponentProps } from "react";
import { createPortal } from "react-dom";
import { Menu, X } from "lucide-react";
import { AreaNav } from "@/components/prepare/AreaNav";

/**
 * Hamburger + slide-in menu with the area navigation, for screens where the
 * left column is hidden (phones and tablets). Same content as the desktop rail.
 */
export function AreaNavMobile({
  className = "",
  compact = false,
  ...nav
}: Omit<ComponentProps<typeof AreaNav>, "variant" | "onNavigate"> & {
  /** Where the button shows, e.g. "lg:hidden" on area pages. */
  className?: string;
  /** Icon-only on phones (for the top bar). */
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-label={`Open ${nav.detail.name} menu`}
        className={`inline-flex w-fit shrink-0 items-center gap-2 rounded-full border border-white/70 bg-white/80 ${compact ? "p-2 sm:px-3.5" : "px-4 py-2"} text-[14px] font-semibold text-ink shadow-[0_8px_20px_rgba(64,38,25,0.12)] backdrop-blur-xl hover:bg-white ${className}`}
      >
        <Menu className="size-5 text-brand" aria-hidden="true" />
        <span className={compact ? "hidden sm:inline" : ""}>{nav.detail.name}</span>
      </button>

      {open &&
        // Rendered on <body>: the button can sit inside the glass top bar, which would
        // otherwise trap a fixed panel inside the bar.
        createPortal(
          <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-label={`${nav.detail.name} menu`}>
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-[#1e1c1a]/40 backdrop-blur-[2px]"
            />
            <div className="absolute inset-y-0 left-0 flex w-[86%] max-w-[340px] flex-col bg-[#fbf9f4] shadow-[20px_0_40px_rgba(30,28,26,0.2)]">
              <div className="flex items-center justify-between border-b border-[#f0e8de] px-4 py-3">
                <span className="font-display text-[17px] font-extrabold text-ink">{nav.detail.name}</span>
                <button
                  ref={closeRef}
                  type="button"
                  aria-label="Close menu"
                  onClick={() => setOpen(false)}
                  className="rounded-full p-2 text-ink-muted hover:bg-[#f4efe8] hover:text-ink"
                >
                  <X className="size-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-3">
                <AreaNav {...nav} variant="drawer" onNavigate={() => setOpen(false)} />
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
