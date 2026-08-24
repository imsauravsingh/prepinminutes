"use client";

import { useEffect, useState } from "react";
import { Menu, X, Zap } from "lucide-react";

const navLinks = ["How It Works", "Features", "Pricing"];

export function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-white/95 backdrop-blur transition-shadow ${
        scrolled ? "border-line shadow-sm" : "border-line/0"
      }`}
    >
      <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-[120px] lg:py-5">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-[10px] bg-brand">
            <Zap className="size-[18px] fill-white text-white" />
          </div>
          <div className="flex flex-col gap-0.5">
            <p className="font-display text-lg font-extrabold text-ink sm:text-xl">
              PrepInMinutes
            </p>
            <p className="hidden text-[11px] text-ink-muted sm:block">
              Get interview-ready in minutes.
            </p>
          </div>
        </div>

        <nav className="hidden gap-8 text-sm font-medium text-ink-muted lg:flex">
          {navLinks.map((link) => (
            <a key={link} href="#" className="hover:text-ink">
              {link}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-5 lg:flex">
          <a href="#" className="text-sm font-semibold text-ink">
            Log in
          </a>
          <a
            href="#"
            className="rounded-full bg-brand px-6 py-3 text-[15px] font-semibold text-white shadow-[0_4px_6px_rgba(255,108,71,0.2)]"
          >
            Get Started →
          </a>
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
            <a
              href="#"
              onClick={() => setMenuOpen(false)}
              className="px-3 text-base font-semibold text-ink"
            >
              Log in
            </a>
            <a
              href="#"
              onClick={() => setMenuOpen(false)}
              className="rounded-full bg-brand px-6 py-3 text-center text-[15px] font-semibold text-white shadow-[0_4px_6px_rgba(255,108,71,0.2)]"
            >
              Get Started →
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
