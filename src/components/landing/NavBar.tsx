import { Zap } from "lucide-react";

const navLinks = ["How It Works", "Features", "Pricing"];

export function NavBar() {
  return (
    <header className="flex items-center justify-between border-b border-line px-[120px] py-5">
      <div className="flex items-center gap-3">
        <div className="flex size-9 items-center justify-center rounded-[10px] bg-brand">
          <Zap className="size-[18px] fill-white text-white" />
        </div>
        <div className="flex flex-col gap-0.5">
          <p className="font-display text-xl font-extrabold text-ink">PrepInMinutes</p>
          <p className="text-[11px] text-ink-muted">Get interview-ready in minutes.</p>
        </div>
      </div>

      <nav className="flex gap-8 text-sm font-medium text-ink-muted">
        {navLinks.map((link) => (
          <a key={link} href="#" className="hover:text-ink">
            {link}
          </a>
        ))}
      </nav>

      <div className="flex items-center gap-5">
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
    </header>
  );
}
