"use client";

import { useEffect, useRef, useState } from "react";
import { useUser, useClerk, UserAvatar } from "@clerk/react";
import { toTitleCase } from "@/lib/format";
import {
  Zap,
  Home,
  BookOpen,
  BarChart3,
  ClockArrowUp,
  Users2,
  Lock,
  Check,
  Settings,
  UserCog,
  LogOut,
  Menu,
  X,
  type LucideIcon,
} from "lucide-react";

const navLinks: { icon: LucideIcon; label: string; active?: boolean; locked?: boolean }[] = [
  { icon: Home, label: "Dashboard", active: true },
  { icon: BookOpen, label: "Practice", locked: true },
  { icon: BarChart3, label: "Evaluation", locked: true },
  { icon: ClockArrowUp, label: "Revision", locked: true },
  { icon: Users2, label: "Mock Interview", locked: true },
];

const checklistItems: { label: string; done?: boolean }[] = [
  { label: "Account created", done: true },
  { label: "Target role" },
  { label: "Resume uploaded" },
  { label: "Job description" },
  { label: "Prep preferences" },
];

function SidebarContent() {
  const completed = checklistItems.filter((item) => item.done).length;
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
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setAccountMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [accountMenuOpen]);

  return (
    <div className="flex h-full flex-col justify-between">
      <div className="flex flex-col gap-8">
        <nav className="flex flex-col gap-1.5">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href="#"
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm ${
                link.active ? "bg-brand-soft font-semibold text-brand" : "font-medium text-[#b0a898]"
              }`}
            >
              <link.icon className="size-[18px]" />
              <span className="flex-1">{link.label}</span>
              {link.locked && <Lock className="size-3" />}
            </a>
          ))}
        </nav>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 rounded-2xl border border-[#ede6db] bg-cream p-5">
          <div className="flex flex-col gap-1">
            <p className="font-display text-sm font-bold text-ink">Your Prep Plan</p>
            <p className="text-[11px] text-ink-muted">Complete onboarding setup</p>
          </div>
          <div className="flex flex-col gap-2.5">
            {checklistItems.map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <span
                  className={`flex size-4 shrink-0 items-center justify-center rounded ${
                    item.done ? "border-[1.5px] border-success bg-[#edf5ec]" : "border-[1.5px] border-[#b0a898]"
                  }`}
                >
                  {item.done && <Check className="size-2.5 text-success" />}
                </span>
                <p className={`text-[13px] ${item.done ? "font-medium text-ink" : "text-ink-muted"}`}>
                  {item.label}
                </p>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-[11px] font-semibold text-brand">{completed} / {checklistItems.length} completed</p>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#ede6db]">
              <div
                className="h-full rounded-full bg-brand"
                style={{ width: `${(completed / checklistItems.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-line pt-3">
          <div className="relative flex items-center justify-between" ref={accountMenuRef}>
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
      <div
        className={`flex items-center justify-center rounded-[10px] bg-brand ${compact ? "size-8" : "size-9"}`}
      >
        <Zap className="size-[18px] fill-white text-white" />
      </div>
      <div className="flex flex-col gap-0.5">
        <p className="font-display text-lg font-extrabold text-ink sm:text-xl">PrepInMinutes</p>
        {!compact && (
          <p className="text-[11px] text-ink-muted">Get interview-ready in minutes.</p>
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
