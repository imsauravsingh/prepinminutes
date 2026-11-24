"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ChevronDown, Home } from "lucide-react";
import { categoryIcon } from "@/components/prepare/categoryIcon";
import type { AreaDetail } from "@/hooks/useAreaDetail";

/**
 * Left navigation for an area: Overview, then every category in the area.
 * A category expands to its topics; clicking its name jumps to it in the plan.
 * Built from the area's curriculum, so it works the same for System Design, DSA,
 * Backend, and every other area.
 *
 * Used on the area page itself, and while learning a topic (then Overview links
 * back to the area page and the current topic is highlighted).
 */
export function AreaNav({
  detail,
  onPickCategory,
  currentTopic,
  overviewHref,
  variant = "rail",
  onNavigate,
}: {
  detail: AreaDetail;
  onPickCategory: (slug: string) => void;
  /** Topic being learned right now (practice page). */
  currentTopic?: string;
  /** When set, Overview is a link to the area page instead of "scroll to top". */
  overviewHref?: string;
  /** "rail" = sticky left column on large screens; "drawer" = inside the mobile menu. */
  variant?: "rail" | "drawer";
  /** Called after any navigation (closes the mobile menu). */
  onNavigate?: () => void;
}) {
  // While learning a topic, its category starts open.
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    const cat = currentTopic ? detail.categories.find((c) => c.topics.some((t) => t.slug === currentTopic)) : null;
    return cat ? { [cat.slug]: true } : {};
  });
  const overviewCls =
    "mb-1 flex items-center gap-2.5 rounded-full px-4 py-2.5 text-[14px] font-semibold transition-colors";

  return (
    <aside className={variant === "rail" ? "hidden lg:block" : ""}>
      <nav
        aria-label={`${detail.name} sections`}
        className={
          variant === "rail"
            ? "sticky top-4 flex max-h-[calc(100vh-2rem)] flex-col gap-1 overflow-y-auto rounded-[26px] border border-white/70 bg-white/55 p-3 shadow-[0_12px_30px_rgba(64,38,25,0.12)] backdrop-blur-xl"
            : "flex flex-col gap-1"
        }
      >
        {overviewHref ? (
          // Same "Overview" item on the area page and on topic pages; here it goes back to the area page.
          <Link
            href={overviewHref}
            onClick={onNavigate}
            className={`${overviewCls} bg-brand text-white shadow-[0_6px_14px_rgba(255,108,71,0.32)]`}
          >
            <Home className="size-4" aria-hidden="true" />
            Overview
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
              onNavigate?.();
            }}
            aria-current="page"
            className={`${overviewCls} bg-brand text-white shadow-[0_6px_14px_rgba(255,108,71,0.32)]`}
          >
            <Home className="size-4" aria-hidden="true" />
            Overview
          </button>
        )}

        <ul className="flex flex-col gap-0.5">
          {detail.categories.map((c) => {
            const Icon = categoryIcon(c.name);
            const open = expanded[c.slug] === true;
            const done = c.topics.filter((t) => t.status === "done").length;
            return (
              <li key={c.slug}>
                <div className="flex items-center rounded-xl hover:bg-white/80">
                  <button
                    type="button"
                    onClick={() => {
                      onPickCategory(c.slug);
                      onNavigate?.();
                    }}
                    title={c.name}
                    className="flex min-w-0 flex-1 items-center gap-2.5 px-2 py-2 text-left"
                  >
                    <Icon className="size-[18px] shrink-0 text-brand" aria-hidden="true" />
                    <span className="line-clamp-2 text-[13px] font-semibold leading-snug text-ink">{c.name}</span>
                  </button>
                  {done > 0 && (
                    <span
                      className="mr-1 text-[11px] font-semibold text-emerald-600"
                      title={`${done} of ${c.topics.length} done`}
                    >
                      {done}/{c.topics.length}
                    </span>
                  )}
                  <button
                    type="button"
                    aria-label={`${open ? "Hide" : "Show"} ${c.name} topics`}
                    aria-expanded={open}
                    onClick={() => setExpanded((p) => ({ ...p, [c.slug]: !open }))}
                    className="rounded-lg p-1.5 text-ink-muted hover:text-ink"
                  >
                    <ChevronDown
                      className={`size-4 transition-transform ${open ? "rotate-180" : ""}`}
                      aria-hidden="true"
                    />
                  </button>
                </div>
                {open && (
                  <ul className="mb-1 ml-[18px] flex flex-col border-l border-[#efe5da] pl-3">
                    {c.topics.map((t) => (
                      <li key={t.slug}>
                        <Link
                          href={t.href}
                          onClick={onNavigate}
                          aria-current={t.slug === currentTopic ? "page" : undefined}
                          className={`flex items-start gap-2 rounded-lg px-1.5 py-1.5 text-[12.5px] leading-snug hover:bg-white/80 hover:text-ink ${
                            t.slug === currentTopic ? "bg-[#fff1ea] font-semibold text-brand" : "text-ink-muted"
                          }`}
                        >
                          {t.status === "done" ? (
                            <span className="mt-0.5 flex size-3.5 shrink-0 items-center justify-center rounded-full bg-emerald-500">
                              <Check className="size-2.5 text-white" strokeWidth={3} aria-hidden="true" />
                            </span>
                          ) : (
                            <span
                              className={`mt-0.5 size-3.5 shrink-0 rounded-full border-2 ${
                                t.bucket === "must" ? "border-brand/60" : "border-[#d9d3cb]"
                              }`}
                              aria-hidden="true"
                            />
                          )}
                          <span className={t.bucket === "skip" ? "opacity-70" : ""}>{t.title}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
