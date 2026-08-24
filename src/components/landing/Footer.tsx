import { Zap } from "lucide-react";
import { LinkedinIcon, TwitterIcon, FacebookIcon } from "./social-icons";

const platformLinks = ["How it Works", "Features", "Pricing", "Enterprise"];
const companyLinks = ["About Us", "Careers", "Blog", "Press"];
const socials = [
  { icon: LinkedinIcon, label: "LinkedIn" },
  { icon: TwitterIcon, label: "Twitter" },
  { icon: FacebookIcon, label: "Facebook" },
];

export function Footer() {
  return (
    <footer className="flex flex-col items-start border-t border-line px-4 pb-10 pt-14 sm:px-6 lg:px-[120px] lg:pt-20">
      <div className="grid w-full grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4 lg:flex lg:items-start lg:justify-between lg:gap-0">
        <div className="col-span-2 flex flex-col items-start gap-4 sm:col-span-4 lg:col-span-1 lg:w-[360px]">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-7 items-center justify-center rounded-md bg-brand">
              <Zap className="size-3.5 fill-white text-white" />
            </div>
            <p className="font-display text-lg font-extrabold text-ink">PrepInMinutes</p>
          </div>
          <p className="text-sm leading-[22px] text-ink-muted">
            An intelligent, adaptive platform built to automate interview preparation, reduce
            stress, and maximize hire outcomes.
          </p>
          <p className="text-[13px] text-ink-muted">© 2026 PrepInMinutes. All rights reserved.</p>
        </div>

        <div className="flex flex-col items-start gap-4 text-sm lg:w-[180px]">
          <p className="font-display font-bold uppercase text-ink">Platform</p>
          {platformLinks.map((link) => (
            <a key={link} href="#" className="text-ink-muted hover:text-ink">
              {link}
            </a>
          ))}
        </div>

        <div className="flex flex-col items-start gap-4 text-sm lg:w-[180px]">
          <p className="font-display font-bold uppercase text-ink">Company</p>
          {companyLinks.map((link) => (
            <a key={link} href="#" className="text-ink-muted hover:text-ink">
              {link}
            </a>
          ))}
        </div>

        <div className="flex flex-col items-start gap-4 lg:w-60">
          <p className="font-display text-sm font-bold uppercase text-ink">Connect</p>
          <div className="flex items-start gap-3">
            {socials.map(({ icon: Icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="flex size-9 items-center justify-center rounded-full border border-line bg-white text-ink-muted hover:text-ink"
              >
                <Icon className="size-[18px]" />
              </a>
            ))}
          </div>
          <div className="flex flex-col gap-2 text-[13px] text-ink-muted">
            <a href="#" className="hover:text-ink">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-ink">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
