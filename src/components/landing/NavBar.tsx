"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, ArrowRight } from "lucide-react";
import { useAppAuth } from "@/components/providers/AuthProvider";
import { BrandMark } from "@/components/BrandMark";
import { AccountMenu } from "@/components/dashboard/room/StudyRoom";
import dock from "@/components/dashboard/room/StudyRoom.module.css";

const navLinks = [
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Features", href: "/#coach" },
  { label: "Pricing", href: "/#pricing" },
];

type NavBarProps = {
  /** Float the header over the page hero (home page) instead of taking up space. */
  overlay?: boolean;
};

/**
 * Landing header: the same thin, floating glass dock as the dashboard, with
 * the landing links in the middle and account controls on the right.
 */
export function NavBar({ overlay = false }: NavBarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isLoaded, isSignedIn } = useAppAuth();

  // Home page: the dock's glass bar only appears once the visitor scrolls.
  useEffect(() => {
    if (!overlay) return;
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [overlay]);
  const bare = overlay && !scrolled && !menuOpen;

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    if (menuOpen) window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  return (
    <header className={`${overlay ? "fixed inset-x-0 top-0" : "sticky top-0"} z-50 px-3 pt-3 sm:px-5 sm:pt-4`}>
      {bare && (
        // Soft wash at the top keeps the menus readable over the hero scene.
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-28 bg-gradient-to-b from-white/50 via-white/15 to-transparent"
        />
      )}
      <div className={`${dock.dock} ${bare ? dock.dockBare : ""}`}>
        <Link href="/" className={dock.brand} aria-label="PrepInMinutes home">
          <BrandMark className="size-8" />
          <span className={dock.brandName}>PrepInMinutes</span>
        </Link>

        <nav aria-label="Main" className={dock.nav}>
          {navLinks.map((link) => (
            <a key={link.label} href={link.href} className={dock.navItem}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          {isLoaded && isSignedIn ? (
            <>
              {/* The account menu already has "Go to dashboard", so no separate button here. */}
              <AccountMenu phase="prepare" showDashboardLink />
            </>
          ) : isLoaded ? (
            <>
              <span className="hidden sm:contents">
                <Link href="/login" className={dock.navItem}>
                  Log in
                </Link>
              </span>
              <Link href="/sign-up" className={`${dock.navItem} ${dock.navActive}`}>
                Get Started &rarr;
              </Link>
            </>
          ) : null}

          <span className="contents lg:hidden">
            <button
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
              className={dock.accountButton}
              style={{ width: 38, height: 38, padding: 0, justifyContent: "center" }}
            >
              {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </span>
        </div>
      </div>

      {menuOpen && (
        <>
          {/* Soft dim + blur behind the menu; tap to close. */}
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
            className="nav-backdrop fixed inset-0 -z-10 bg-ink/10 backdrop-blur-[3px] lg:hidden"
          />
          <div className="nav-menu glass-panel mx-auto mt-2 max-w-[1200px] rounded-3xl p-3 lg:hidden">
            <nav aria-label="Main" className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between rounded-2xl px-4 py-3 text-base font-semibold text-ink/85 transition-colors hover:bg-white/75 hover:text-ink"
                >
                  {link.label}
                  <ArrowRight className="size-4 text-ink/30" aria-hidden="true" />
                </a>
              ))}
            </nav>
            {/* Signed-in users reach the dashboard from the account menu, so only guests need Log in here. */}
            {isLoaded && !isSignedIn && (
              <div className="mt-2 border-t border-white/50 pt-3">
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center rounded-full border border-white/70 bg-white/35 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-white/75"
                >
                  Log in
                </Link>
              </div>
            )}
          </div>
        </>
      )}
    </header>
  );
}
