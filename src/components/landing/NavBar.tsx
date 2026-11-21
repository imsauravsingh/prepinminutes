"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Menu, X, LogOut, LayoutDashboard, ArrowRight } from "lucide-react";
import { useAppAuth } from "@/components/providers/AuthProvider";
import { BrandMark } from "@/components/BrandMark";

const navLinks = [
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Features", href: "/#coach" },
  { label: "Pricing", href: "/#pricing" },
];

type NavBarProps = {
  /**
   * Float the header over the page hero: fully transparent at the top of the
   * page, turning into frosted glass once the visitor scrolls.
   */
  overlay?: boolean;
};

export function NavBar({ overlay = false }: NavBarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isLoaded, isSignedIn, user, signOut } = useAppAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  const initial = (user?.fullName || user?.email || "U").charAt(0).toUpperCase();
  const avatar = (size: number, className = "") =>
    user?.avatarUrl ? (
      <Image
        src={user.avatarUrl}
        alt=""
        width={size}
        height={size}
        className={`rounded-full object-cover ring-2 ring-white/80 ${className}`}
        style={{ width: size, height: size }}
      />
    ) : (
      <span
        className={`flex items-center justify-center rounded-full bg-brand font-bold text-white ring-2 ring-white/80 ${className}`}
        style={{ width: size, height: size, fontSize: size * 0.45 }}
      >
        {initial}
      </span>
    );

  const transparent = overlay && !scrolled && !menuOpen;

  const headerClass = overlay
    ? `fixed inset-x-0 top-0 z-50 border-b transition-[background-color,box-shadow,border-color,backdrop-filter] duration-300 ${
        transparent
          ? "border-transparent bg-transparent"
          : menuOpen
            ? "glass-header border-white/40"
            : "glass-header border-white/50 shadow-[0_6px_24px_rgba(64,38,25,0.08)]"
      }`
    : `sticky top-0 z-50 border-b bg-white/95 backdrop-blur transition-shadow ${
        scrolled ? "border-line shadow-sm" : "border-line/0"
      }`;

  return (
    <header className={headerClass}>
      {transparent && (
        // Soft wash at the very top keeps the links readable over the bright window.
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-28 bg-gradient-to-b from-white/55 via-white/20 to-transparent"
        />
      )}
      <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-[120px] lg:py-5">
        <div className="flex items-center gap-3">
          <BrandMark />
          <div className="flex flex-col gap-0.5">
            <p className="font-display text-lg font-extrabold text-ink sm:text-xl">
              PrepInMinutes
            </p>
            <p className="hidden text-[11px] text-ink-muted sm:block">
              Get interview-ready in minutes.
            </p>
          </div>
        </div>

        <nav className="hidden gap-8 text-sm font-semibold text-ink/75 lg:flex">
          {navLinks.map((link) => (
            <a key={link.label} href={link.href} className="hover:text-ink">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-5 lg:flex">
          {isLoaded && isSignedIn ? (
            <div className="glass-pill flex items-center rounded-full p-1">
              <a
                href="/dashboard"
                className="group flex items-center gap-2 rounded-full py-1 pl-1 pr-3.5 text-sm font-semibold text-ink transition-colors hover:bg-white/50"
              >
                {avatar(28)}
                <span>Dashboard</span>
                <ArrowRight className="size-3.5 text-brand transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </a>
              <span aria-hidden="true" className="mx-0.5 h-5 w-px bg-ink/10" />
              <button
                type="button"
                onClick={() => signOut()}
                aria-label="Sign out"
                title="Sign out"
                className="flex size-9 items-center justify-center rounded-full text-ink/70 transition-colors hover:bg-[#fde8e3]/80 hover:text-[#d9452a]"
              >
                <LogOut className="size-4" />
              </button>
            </div>
          ) : isLoaded ? (
            <>
              <a href="/login" className="text-sm font-semibold text-ink">
                Log in
              </a>
              <a
                href="/sign-up"
                className="rounded-full bg-brand px-6 py-3 text-[15px] font-semibold text-white shadow-[0_4px_6px_rgba(255,108,71,0.2)]"
              >
                Get Started →
              </a>
            </>
          ) : null}
        </div>

        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
          className="glass-pill flex size-10 items-center justify-center rounded-full text-ink lg:hidden"
        >
          {menuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {menuOpen && (
        <>
          {/* Soft dim + blur behind the menu; tap to close. */}
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
            className="nav-backdrop fixed inset-0 top-[72px] -z-10 bg-ink/10 backdrop-blur-[3px] lg:hidden"
          />
          <div className="nav-menu glass-panel mx-3 mb-3 rounded-3xl p-3 lg:hidden">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between rounded-2xl px-4 py-3 text-base font-semibold text-ink/85 transition-colors hover:bg-white/40 hover:text-ink"
                >
                  {link.label}
                  <ArrowRight className="size-4 text-ink/30" aria-hidden="true" />
                </a>
              ))}
            </nav>

            <div className="mt-2 border-t border-white/50 pt-3">
              {isLoaded && isSignedIn ? (
                <div className="flex flex-col gap-3 rounded-2xl border border-white/50 bg-white/25 p-3">
                  <div className="flex items-center gap-3">
                    {avatar(40)}
                    <div className="min-w-0">
                      <p className="truncate font-display text-[15px] font-bold text-ink">
                        {user?.fullName || "Your account"}
                      </p>
                      {user?.email && <p className="truncate text-xs text-ink-muted">{user.email}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href="/dashboard"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-center gap-2 rounded-full bg-brand py-2.5 text-sm font-semibold text-white shadow-[0_6px_14px_rgba(255,108,71,0.3)]"
                    >
                      <LayoutDashboard className="size-4" aria-hidden="true" />
                      Dashboard
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        signOut();
                      }}
                      className="flex items-center justify-center gap-2 rounded-full border border-white/70 bg-white/35 py-2.5 text-sm font-semibold text-ink/75 transition-colors hover:bg-[#fde8e3]/80 hover:text-[#d9452a]"
                    >
                      <LogOut className="size-4" aria-hidden="true" />
                      Sign out
                    </button>
                  </div>
                </div>
              ) : isLoaded ? (
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-center rounded-full border border-white/70 bg-white/35 py-2.5 text-sm font-semibold text-ink"
                  >
                    Log in
                  </a>
                  <a
                    href="/sign-up"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-center rounded-full bg-brand py-2.5 text-sm font-semibold text-white shadow-[0_6px_14px_rgba(255,108,71,0.3)]"
                  >
                    Get Started &rarr;
                  </a>
                </div>
              ) : null}
            </div>
          </div>
        </>
      )}
    </header>
  );
}
