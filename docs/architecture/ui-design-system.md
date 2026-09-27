# UI Design System & Design Tokens

This document details the visual design system, color tokens, typography, and component styling conventions of PrepInMinutes. All new UI components created by AI agents must strictly comply with these specifications.

---

## 1. Color Tokens & Palette

PrepInMinutes employs a warm, editorial, high-trust SaaS aesthetic:

| Token Name                 | Hex Code              | Tailwind Equivalent / Usage | Purpose                                          |
| -------------------------- | --------------------- | --------------------------- | ------------------------------------------------ |
| **Canvas Background**      | `#fbf9f4`             | `bg-[#fbf9f4]`              | Global page background, warm paper cream         |
| **Card Surface**           | `#ffffff`             | `bg-white`                  | Primary content cards, modals, dropdowns         |
| **Subtle Neutral Surface** | `#faf6f0`             | `bg-[#faf6f0]`              | Secondary cards, callouts, message backgrounds   |
| **Muted Surface**          | `#f5f0ff`             | `bg-[#f5f0ff]`              | AI message bubbles, purple tint                  |
| **Primary Brand Orange**   | `#ff5520` / `#ff6c47` | `bg-brand` / `text-brand`   | Primary CTAs, active highlights, key metrics     |
| **Brand Orange Soft**      | `#fff0ec`             | `bg-[#fff0ec]`              | Active sidebar pills, warning badges             |
| **Primary Ink (Text)**     | `#1e1c1a`             | `text-ink`                  | Headings, primary body copy, titles              |
| **Muted Ink (Text)**       | `#78716c` / `#64748b` | `text-ink-muted`            | Subtitles, labels, timestamps                    |
| **Line / Border**          | `#ede6db` / `#f4efe8` | `border-line`               | Card borders, dividers, subtle outlines          |
| **Success Emerald**        | `#10b981`             | `text-[#10b981]`            | Completed steps, pass verdicts, readiness gains  |
| **Success Emerald Soft**   | `#edf5ec`             | `bg-[#edf5ec]`              | Success badge backgrounds                        |
| **Accent Purple**          | `#7c3aed`             | `text-[#7c3aed]`            | AI interviewer badges, waveform bars, audio dock |
| **Accent Purple Soft**     | `#f5f3ff`             | `bg-[#f5f3ff]`              | Audio dock container, candidate chat bubbles     |
| **Information Blue**       | `#2563eb`             | `text-[#2563eb]`            | Technical tags, links, tip icons                 |

---

## 2. Typography System

The application uses **Geist** and **Geist Mono** with semantic class abstractions:

```css
font-display: font-extrabold / font-bold tracking-tight (headings, titles, scores)
font-sans: font-medium / font-normal leading-relaxed (body copy, instructions)
font-mono: font-mono text-xs / text-sm (timers, code blocks, metrics, tokens)
```

### Hierarchy Rules

- **Page Titles**: `text-2xl sm:text-3xl font-extrabold text-ink tracking-tight`
- **Section Headings**: `text-base sm:text-lg font-bold text-ink`
- **Card Subtitles**: `text-xs sm:text-sm text-ink-muted`
- **Badges / Tags**: `text-[10px] sm:text-xs font-bold uppercase tracking-wider`
- **Body Text**: `text-xs sm:text-sm leading-relaxed text-ink`

---

## 3. Card & Container Standards

- **Main Cards**:
  ```tsx
  className =
    "rounded-2xl sm:rounded-3xl border border-line bg-white p-5 sm:p-7 shadow-[0_4px_20px_rgba(30,28,26,0.03)]";
  ```
- **Secondary / Metric Cards**:
  ```tsx
  className =
    "rounded-xl border border-line bg-white p-4 shadow-2xs hover:shadow-sm transition-all";
  ```
- **Callout Banners**:
  ```tsx
  className = "rounded-2xl border border-[#ffd8cc] bg-[#fff0ec]/50 p-4 sm:p-5";
  ```

---

## 4. Button & Control Hierarchy

1. **Primary Action CTA**:
   ```tsx
   className =
     "inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-bold text-white shadow-[0_4px_14px_rgba(255,108,71,0.25)] hover:bg-[#eb4a19] active:scale-[0.98] transition-all cursor-pointer";
   ```
2. **Secondary Outline Button**:
   ```tsx
   className =
     "inline-flex items-center justify-center gap-2 rounded-xl border border-[#cbd5e1] bg-white px-5 py-3 text-sm font-semibold text-ink shadow-2xs hover:bg-[#faf6f0] hover:border-[#94a3b8] transition-all cursor-pointer";
   ```
3. **Pill / Icon Button**:
   ```tsx
   className =
     "flex size-9 sm:size-10 items-center justify-center rounded-full border border-line bg-white text-ink-muted shadow-2xs hover:bg-[#faf6f0] transition-colors cursor-pointer";
   ```
4. **Destructive Action Button**:
   ```tsx
   className =
     "flex h-9 sm:h-10 items-center justify-center rounded-full border border-red-500 bg-white px-4 sm:px-5 text-xs sm:text-sm font-semibold text-red-500 shadow-2xs hover:bg-red-50 transition-colors cursor-pointer";
   ```

---

## 5. Circular Progress Gauges (SVG Pattern)

All circular percentage rings (Dashboard Readiness, Mock Progress, Evaluation Scores) follow this SVG pattern:

```tsx
<div className="relative flex size-18 sm:size-20 shrink-0 items-center justify-center">
  <svg className="size-full -rotate-90" viewBox="0 0 80 80">
    <circle
      cx="40"
      cy="40"
      r="34"
      stroke="#ede6db"
      strokeWidth="6"
      fill="none"
    />
    <circle
      cx="40"
      cy="40"
      r="34"
      stroke="#ff5520"
      strokeWidth="6"
      strokeDasharray={213}
      strokeDashoffset={213 - (213 * percentage) / 100}
      strokeLinecap="round"
      fill="none"
      className="transition-all duration-500"
    />
  </svg>
  <div className="absolute flex flex-col items-center">
    <span className="font-display text-xl sm:text-2xl font-black text-ink">
      {percentage}%
    </span>
  </div>
</div>
```

---

## 6. Mobile Responsiveness Directives

All AI agents must observe these mandatory responsive rules:

1. **Never use fixed pixel widths on container elements.** Use `w-full max-w-[...]` instead.
2. **Always include `min-w-0` on flex children** containing text, inputs, or breadcrumbs to prevent container blowout.
3. **Text wrapping**: Always apply `break-words` on chat bubbles and candidate inputs.
4. **Header breadcrumbs**: Always use `flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-sm`.
5. **Modals**: Always constrain overlays with `p-3 sm:p-4` and modal boxes with `max-h-[90vh] flex flex-col overflow-hidden` with `overflow-y-auto` on the body.
6. **Button pairs on mobile**: Convert horizontal button rows into `flex flex-col-reverse sm:flex-row items-stretch sm:items-center` so buttons never wrap into awkward multi-line shapes on 320px screens.
