"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Menu, X, LogOut, LayoutDashboard } from "lucide-react";
import { useAppAuth } from "@/components/providers/AuthProvider";
import { BrandMark } from "@/components/BrandMark";

const navLinks = ["How It Works", "Features", "Pricing"];

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
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const transparent = overlay && !scrolled && !menuOpen;

  const headerClass = overlay
    ? `fixed inset-x-0 top-0 z-50 border-b transition-[background-color,box-shadow,border-color,backdrop-filter] duration-300 ${
        transparent
          ? "border-transparent bg-transparent"
          : "border-line/60 bg-white/80 shadow-sm backdrop-blur-md"
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
            <a key={link} href="#" className="hover:text-ink">
              {link}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-5 lg:flex">
          {isLoaded && isSignedIn ? (
            <div className="flex items-center gap-3">
              <a
                href="/dashboard"
                className="flex items-center gap-2 rounded-full border border-line bg-white/75 px-4 py-2 text-sm font-semibold text-ink backdrop-blur hover:bg-cream transition-colors"
              >
                {user?.avatarUrl ? (
                  <Image
                    src={user.avatarUrl}
                    alt={user.fullName || "User"}
                    width={22}
                    height={22}
                    className="size-5.5 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex size-5.5 items-center justify-center rounded-full bg-brand font-bold text-[10px] text-white">
                    {(user?.fullName || user?.email || "U").charAt(0).toUpperCase()}
                  </div>
                )}
                <span>Dashboard</span>
              </a>
              <button
                type="button"
                onClick={() => signOut()}
                className="flex size-9 items-center justify-center rounded-full border border-line bg-white/75 text-ink-muted backdrop-blur hover:text-ink hover:bg-cream transition-colors"
                title="Sign out"
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
          className="flex size-10 items-center justify-center rounded-full text-ink lg:hidden"
        >
          {menuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-line bg-white px-4 pb-6 pt-2 lg:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link}
                href="#"
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-3 text-base font-medium text-ink-muted hover:bg-cream hover:text-ink"
              >
                {link}
              </a>
            ))}
          </nav>
          <div className="mt-3 flex flex-col gap-3 border-t border-line pt-4">
            {isLoaded && isSignedIn ? (
              <>
                <a
                  href="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-3 text-base font-semibold text-ink"
                >
                  <LayoutDashboard className="size-4 text-brand" />
                  <span>Dashboard</span>
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    signOut();
                  }}
                  className="flex items-center gap-2 px-3 text-base font-semibold text-ink-muted hover:text-ink"
                >
                  <LogOut className="size-4" />
                  <span>Sign out</span>
                </button>
              </>
            ) : isLoaded ? (
              <>
                <a
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="px-3 text-base font-semibold text-ink"
                >
                  Log in
                </a>
                <a
                  href="/sign-up"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-full bg-brand px-6 py-3 text-center text-[15px] font-semibold text-white shadow-[0_4px_6px_rgba(255,108,71,0.2)]"
                >
                  Get Started →
                </a>
              </>
            ) : null}
          </div>
        </div>
      )}
    </header>
  );
}
