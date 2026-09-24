"use client";

import { useEffect, useRef, useState } from "react";
import { useUser, useClerk, UserAvatar } from "@clerk/react";
import { toTitleCase } from "@/lib/format";
import { BrandMark } from "@/components/BrandMark";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarRange,
  CodeXml,
  ClipboardCheck,
  BookOpen,
  Users,
  Lock,
  Check,
  Settings,
  UserCog,
  LogOut,
  Menu,
  X,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

const navLinks: {
  icon: LucideIcon;
  label: string;
  href: string;
  locked?: boolean;
}[] = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  {
    icon: CalendarRange,
    label: "My Preparation Plan",
    href: "/preparation-plan",
  },
  { icon: CodeXml, label: "Practice", href: "/practice" },
  { icon: ClipboardCheck, label: "Evaluation", href: "/evaluation" },
  { icon: BookOpen, label: "Revision", href: "#", locked: true },
  { icon: Users, label: "Mock Interview", href: "#", locked: true },
];

const requiredChecklist: { label: string; done: boolean }[] = [
  { label: "Account created", done: true },
  { label: "Target role", done: true },
  { label: "Experience level", done: true },
  { label: "Prep timeline", done: true },
];

const optionalChecklist: { label: string; done: boolean }[] = [
  { label: "Resume", done: false },
  { label: "Job description", done: false },
];

function SidebarContent() {
  const pathname = usePathname();
  const isDashboard =
    pathname === "/dashboard" ||
    pathname === "/" ||
    pathname.startsWith("/dashboard/");
  const isEvaluation = pathname.startsWith("/evaluation");
  const completedRequired = requiredChecklist.filter(
    (item) => item.done,
  ).length;

  const { user } = useUser();
  const clerk = useClerk();
  const displayName = user?.fullName
    ? toTitleCase(user.fullName)
    : user?.primaryEmailAddress?.emailAddress || "Candidate";

  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!accountMenuOpen) return;
    const onClickOutside = (event: MouseEvent) => {
      if (
        accountMenuRef.current &&
        !accountMenuRef.current.contains(event.target as Node)
      ) {
        setAccountMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [accountMenuOpen]);

  return (
    <div className="flex flex-1 flex-col justify-between">
      <div className="flex flex-col gap-8">
        <nav className="flex flex-col gap-1.5">
          {navLinks.map((link) => {
            const active =
              link.href === "/dashboard"
                ? pathname === "/dashboard" || pathname === "/"
                : link.href === "/preparation-plan"
                  ? pathname.startsWith("/preparation-plan")
                  : link.href === "/practice"
                    ? pathname.startsWith("/practice")
                    : link.href === "/evaluation"
                      ? pathname.startsWith("/evaluation")
                      : false;

            if (link.locked) {
              return (
                <div
                  key={link.label}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[#b0a898] opacity-70 cursor-not-allowed select-none"
                >
                  <link.icon className="size-[18px]" />
                  <span className="flex-1">{link.label}</span>
                  <Lock className="size-3" />
                </div>
              );
            }

            return (
              <Link
                key={link.label}
                href={link.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  active
                    ? "bg-brand-soft font-semibold text-brand"
                    : "font-medium text-[#b0a898] hover:bg-cream hover:text-ink"
                }`}
              >
                <link.icon className="size-[18px]" />
                <span className="flex-1">{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex flex-col gap-6">
        {isDashboard ? (
          <div className="flex flex-col gap-3.5 rounded-2xl border border-[#ede6db] bg-[#faf6f0] p-4 sm:p-5">
            <div className="flex flex-col gap-0.5">
              <p className="font-display text-sm font-bold text-ink">
                Your Prep Plan
              </p>
              <p className="text-[11px] text-ink-muted">
                Complete onboarding setup
              </p>
            </div>

            {/* REQUIRED Group */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted">
                Required
              </span>
              <div className="flex flex-col gap-2">
                {requiredChecklist.map((item) => (
                  <div key={item.label} className="flex items-center gap-2">
                    <span className="flex size-4 shrink-0 items-center justify-center rounded border-[1.5px] border-[#10b981] bg-[#edf5ec] text-[#10b981]">
                      <Check className="size-2.5 stroke-[2.5]" />
                    </span>
                    <p className="text-xs font-medium text-ink">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* OPTIONAL Group */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted">
                Optional
              </span>
              <div className="flex flex-col gap-2">
                {optionalChecklist.map((item) => (
                  <div key={item.label} className="flex items-center gap-2">
                    <span className="flex size-4 shrink-0 items-center justify-center rounded border-[1.5px] border-[#ede6db] bg-white">
                      {item.done && (
                        <Check className="size-2.5 text-[#10b981]" />
                      )}
                    </span>
                    <p className="text-xs text-ink-muted">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="flex flex-col gap-1.5 pt-2 border-t border-[#ede6db]/60">
              <p className="text-[11px] font-semibold text-[#10b981]">
                {completedRequired} / {requiredChecklist.length} required
                complete
              </p>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#ede6db]">
                <div
                  className="h-full rounded-full bg-[#10b981] transition-all duration-300"
                  style={{
                    width: `${(completedRequired / requiredChecklist.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        ) : isEvaluation ? (
          <div className="relative overflow-hidden rounded-2xl border border-[#fee2e2]/80 bg-gradient-to-b from-[#fff7f5] via-[#fff3f0] to-[#feedeb] p-4 shadow-xs">
            <div className="relative z-10 flex flex-col gap-1.5">
              <div className="flex size-7 items-center justify-center rounded-lg bg-[#fff0ec] text-brand border border-[#ffd8cc]">
                <Sparkles className="size-4 text-brand" />
              </div>
              <p className="font-display text-sm font-extrabold text-ink mt-0.5">
                Track your progress
              </p>
              <p className="text-[11px] text-ink-muted leading-relaxed">
                See how your practice and evaluations are improving your
                readiness over time.
              </p>
            </div>
            {/* Illustrated subtle bar chart & rising arrow background */}
            <svg
              className="pointer-events-none absolute -bottom-1 -right-1 h-16 w-32"
              viewBox="0 0 120 60"
              fill="none"
              aria-hidden
            >
              <rect
                x="10"
                y="36"
                width="12"
                height="24"
                rx="3"
                fill="#e0e7ff"
                opacity="0.9"
              />
              <rect
                x="28"
                y="28"
                width="12"
                height="32"
                rx="3"
                fill="#c7d2fe"
                opacity="0.9"
              />
              <rect
                x="46"
                y="20"
                width="12"
                height="40"
                rx="3"
                fill="#a5b4fc"
                opacity="0.9"
              />
              <rect
                x="64"
                y="10"
                width="12"
                height="50"
                rx="3"
                fill="#818cf8"
                opacity="0.9"
              />
              <path
                d="M6 46C20 44 32 36 50 26C65 18 80 12 95 6"
                stroke="#ff6c47"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M87 5L96 5L95 14"
                stroke="#ff6c47"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        ) : (
          <div className="relative overflow-hidden rounded-2xl border border-[#fee2e2]/70 bg-gradient-to-b from-[#fff5f4] via-[#fff1f0] to-[#ffeded] p-4 shadow-xs">
            <div className="relative z-10 flex flex-col gap-1">
              <div className="text-lg">🚀</div>
              <p className="font-display text-sm font-extrabold text-ink">
                Stay consistent!
              </p>
              <p className="text-[11px] text-ink-muted leading-relaxed">
                Small steps every day lead to big results.
              </p>
            </div>
            {/* Illustrated subtle mountain & flag background */}
            <svg
              className="pointer-events-none absolute -bottom-1 -right-2 h-16 w-36 opacity-35"
              viewBox="0 0 160 80"
              fill="none"
              aria-hidden
            >
              <path d="M10 80L65 24L105 60L125 40L165 80H10Z" fill="#fca5a5" />
              <path d="M65 24L95 80H40L65 24Z" fill="#f87171" />
              <path
                d="M64 24V14M64 14L74 17L64 20V14"
                stroke="#ef4444"
                strokeWidth="1.5"
                fill="#ef4444"
              />
            </svg>
          </div>
        )}

        <div className="flex flex-col gap-3 border-t border-line pt-3">
          <div
            className="relative flex items-center justify-between"
            ref={accountMenuRef}
          >
            <div className="flex min-w-0 items-center gap-2.5">
              <UserAvatar appearance={{ elements: { avatarBox: "size-8" } }} />
              <div className="flex min-w-0 flex-col gap-0.5">
                <p className="max-w-35 truncate text-[13px] font-semibold text-ink">
                  {displayName}
                </p>
                <p className="text-[11px] text-ink-muted">Free Plan</p>
              </div>
            </div>
            <button
              type="button"
              aria-label="Account settings"
              aria-expanded={accountMenuOpen}
              onClick={() => setAccountMenuOpen((open) => !open)}
              className="flex size-7 shrink-0 items-center justify-center rounded-md text-ink-muted hover:bg-cream"
            >
              <Settings className="size-[18px]" />
            </button>

            {accountMenuOpen && (
              <div className="absolute bottom-full right-0 mb-2 w-48 overflow-hidden rounded-xl border border-line bg-white py-1.5 shadow-[0_8px_24px_rgba(30,28,26,0.12)]">
                <button
                  type="button"
                  onClick={() => {
                    setAccountMenuOpen(false);
                    clerk.openUserProfile();
                  }}
                  className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-[13px] font-medium text-ink hover:bg-cream"
                >
                  <UserCog className="size-4 text-ink-muted" />
                  Manage account
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAccountMenuOpen(false);
                    clerk.signOut();
                  }}
                  className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-[13px] font-medium text-ink hover:bg-cream"
                >
                  <LogOut className="size-4 text-ink-muted" />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Logo({ compact }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <BrandMark className={compact ? "size-8" : "size-9"} />
      <div className="flex flex-col gap-0.5">
        <p className="font-display text-lg font-extrabold text-ink sm:text-xl">
          PrepInMinutes
        </p>
        {!compact && (
          <p className="text-[11px] text-ink-muted">
            Get interview-ready in minutes.
          </p>
        )}
      </div>
    </div>
  );
}

export function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b border-line bg-white px-4 py-3 lg:hidden">
        <Logo compact />
        <button
          type="button"
          aria-label="Open menu"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen(true)}
          className="flex size-10 items-center justify-center rounded-full text-ink"
        >
          <Menu className="size-6" />
        </button>
      </div>

      {/* Mobile off-canvas drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
          <div className="absolute inset-y-0 left-0 flex w-[85%] max-w-[300px] flex-col gap-8 overflow-y-auto bg-white p-6">
            <div className="flex items-center justify-between">
              <Logo />
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setMobileOpen(false)}
                className="flex size-9 shrink-0 items-center justify-center rounded-full text-ink"
              >
                <X className="size-5" />
              </button>
            </div>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden w-[280px] shrink-0 flex-col self-stretch border-r border-line bg-white p-7 lg:flex">
        <div className="mb-8">
          <Logo />
        </div>
        <SidebarContent />
      </aside>
    </>
  );
}
