"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarRange,
  CheckSquare,
  ChevronDown,
  ClipboardCheck,
  Home,
  LogOut,
  Sparkles,
  SquarePen,
  Target,
  UserCog,
  type LucideIcon,
} from "lucide-react";
import { useAppAuth } from "@/components/providers/AuthProvider";
import { BrandMark } from "@/components/BrandMark";
import { toTitleCase } from "@/lib/format";
import styles from "./StudyRoom.module.css";

export type RoomPhase = "setup" | "prepare";

type NavItem = { icon: LucideIcon; label: string; short: string; href: string; match: (p: string) => boolean };

/** Learning menus, shown once setup is done (Start Preparing phase). */
export const PREP_NAV: NavItem[] = [
  { icon: Home, label: "Today", short: "Today", href: "/dashboard", match: (p) => p === "/dashboard" || p.startsWith("/dashboard/") },
  { icon: CalendarRange, label: "My Plan", short: "Plan", href: "/preparation-plan", match: (p) => p.startsWith("/preparation-plan") },
  {
    icon: Target,
    label: "Practice",
    short: "Practice",
    href: "/practice",
    match: (p) => p.startsWith("/practice") || p.startsWith("/session/"),
  },
  { icon: SquarePen, label: "Mock Interview", short: "Mock", href: "/mock-interview", match: (p) => p.startsWith("/mock-interview") },
  { icon: ClipboardCheck, label: "Evaluation", short: "Results", href: "/evaluation", match: (p) => p.startsWith("/evaluation") },
  { icon: CheckSquare, label: "Revision", short: "Revise", href: "/revision", match: (p) => p.startsWith("/revision") },
];

/**
 * Avatar button with a dropdown (profile, sign out). Shared by the dashboard
 * dock and the landing page header so both look and behave the same.
 */
export function AccountMenu({ phase, showDashboardLink = false }: { phase: RoomPhase; showDashboardLink?: boolean }) {
  const { user, signOut } = useAppAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const name = user?.fullName ? toTitleCase(user.fullName) : user?.email || "Candidate";
  const initial = name.charAt(0).toUpperCase();

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const avatar = (size: number) =>
    user?.avatarUrl ? (
      <Image src={user.avatarUrl} alt="" width={size} height={size} className={styles.avatar} style={{ width: size, height: size }} />
    ) : (
      <span className={styles.avatarFallback} style={{ width: size, height: size, fontSize: size * 0.42 }}>
        {initial}
      </span>
    );

  return (
    <div ref={ref} className={styles.account}>
      <button
        type="button"
        className={styles.accountButton}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        onClick={() => setOpen((v) => !v)}
      >
        {avatar(30)}
        <span className={styles.accountName}>{name.split(" ")[0]}</span>
        <ChevronDown className={`${styles.chevron} ${open ? styles.chevronOpen : ""}`} aria-hidden="true" />
      </button>

      {open && (
        <div role="menu" className={styles.accountPanel}>
          <div className={styles.accountHead}>
            {avatar(40)}
            <div className="min-w-0">
              <p className={styles.accountTitle}>{name}</p>
              {user?.email && <p className={styles.accountEmail}>{user.email}</p>}
            </div>
          </div>
          <span className={styles.planChip}>{phase === "setup" ? "Setting up" : "Free plan"}</span>
          {showDashboardLink && (
            <Link href="/dashboard" role="menuitem" className={styles.menuItem} onClick={() => setOpen(false)}>
              <Home className="size-4" aria-hidden="true" /> Go to dashboard
            </Link>
          )}
          <Link href="/profile" role="menuitem" className={styles.menuItem} onClick={() => setOpen(false)}>
            <UserCog className="size-4" aria-hidden="true" /> Edit profile
          </Link>
          <button
            type="button"
            role="menuitem"
            className={`${styles.menuItem} ${styles.signOut}`}
            onClick={() => {
              setOpen(false);
              signOut();
            }}
          >
            <LogOut className="size-4" strokeWidth={2.4} aria-hidden="true" /> Sign out
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * The candidate's study room: the dashboard without a sidebar, with a floating
 * glass dock instead. Menus follow the journey phase:
 * - setup: just the brand, a status pill and the account menu (no distractions);
 * - prepare: all learning menus, as a top dock on desktop and a thumb-friendly
 *   tab bar on phones.
 */
export function StudyRoom({ phase, children }: { phase: RoomPhase; children: ReactNode }) {
  const pathname = usePathname() ?? "/dashboard";

  // Like the home page: the dock's glass bar only appears once the page scrolls.
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={styles.room}>
      <header className={styles.dockWrap}>
        <div className={`${styles.dock} ${scrolled ? "" : styles.dockBare}`}>
          <Link href="/" className={styles.brand} aria-label="PrepInMinutes home">
            <BrandMark className="size-8" />
            <span className={styles.brandName}>PrepInMinutes</span>
          </Link>

          {phase === "prepare" ? (
            <nav aria-label="Study menu" className={styles.nav}>
              {PREP_NAV.map((item) => {
                const active = item.match(pathname);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`${styles.navItem} ${active ? styles.navActive : ""}`}
                  >
                    <item.icon className="size-4" aria-hidden="true" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          ) : (
            <span className={styles.status}>
              <Sparkles className="size-4" aria-hidden="true" />
              Setting up your study room
            </span>
          )}

          <AccountMenu phase={phase} />
        </div>
      </header>

      <main className={`${styles.content} ${phase === "prepare" ? styles.contentWithTabs : ""}`}>{children}</main>

      {phase === "prepare" && (
        <nav aria-label="Study menu" className={styles.tabbar}>
          {PREP_NAV.map((item) => {
            const active = item.match(pathname);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`${styles.tab} ${active ? styles.tabActive : ""}`}
              >
                <item.icon className="size-5" aria-hidden="true" />
                <span>{item.short}</span>
              </Link>
            );
          })}
        </nav>
      )}
    </div>
  );
}
