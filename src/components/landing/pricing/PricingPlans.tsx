"use client";

import { useCallback, useEffect, useState, type CSSProperties } from "react";
import { Check, Mic, Sparkles, Users } from "lucide-react";
import { API_BASE_URL } from "@/lib/api-client";
import { RevealOnView } from "../RevealOnView";

/** One active plan, as configured in the admin panel (subscription_plans table). */
export type PricingPlan = {
  tier: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  billingInterval: string;
  voiceMinutesLimit: number;
  mockInterviewsLimit: number;
  features: string[];
};

type LoadState = { status: "loading" } | { status: "error" } | { status: "ready"; plans: PricingPlan[] };

/** Card accent per plan, from the hero room palette. */
const ACCENTS = ["#10b981", "#ff6c47", "#3b82f6", "#f59e0b", "#ec4899", "#8b5cf6"];

/** Features shown before the "show more" toggle. */
const VISIBLE_FEATURES = 5;

const MONTHS_PER_INTERVAL: Record<string, number> = { month: 1, quarter: 3, year: 12 };

function intervalLabel(interval: string) {
  if (interval === "lifetime") return "one-time";
  if (interval === "quarter") return "/ quarter";
  if (interval === "year") return "/ year";
  return "/ month";
}

function formatPrice(price: number, currency: string) {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      currencyDisplay: "narrowSymbol",
      maximumFractionDigits: Number.isInteger(price) ? 0 : 2,
    }).format(price);
  } catch {
    return `${currency} ${price}`;
  }
}

/** The recurring paid plan with the lowest monthly cost is the "best value". */
function bestValueTier(plans: PricingPlan[]) {
  let best: { tier: string; perMonth: number } | null = null;
  for (const p of plans) {
    const months = MONTHS_PER_INTERVAL[p.billingInterval];
    if (!months || p.price <= 0) continue;
    const perMonth = p.price / months;
    if (!best || perMonth < best.perMonth) best = { tier: p.tier, perMonth };
  }
  // Only call it out when it beats another recurring plan.
  const recurringPaid = plans.filter((p) => MONTHS_PER_INTERVAL[p.billingInterval] && p.price > 0);
  return recurringPaid.length > 1 ? best?.tier ?? null : null;
}

function PlanCard({ plan, index, featured }: { plan: PricingPlan; index: number; featured: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const accent = featured ? "#ff6c47" : ACCENTS[index % ACCENTS.length];
  const isFree = plan.price <= 0;
  const months = MONTHS_PER_INTERVAL[plan.billingInterval];
  const perMonth = months && months > 1 && !isFree ? plan.price / months : null;
  const features = expanded ? plan.features : plan.features.slice(0, VISIBLE_FEATURES);
  const hidden = plan.features.length - VISIBLE_FEATURES;

  return (
    <div className={`price-card group relative flex h-full flex-col gap-5 rounded-3xl p-6 ${featured ? "price-card-featured" : ""}`} style={{ "--c": accent } as CSSProperties}>
      {featured && (
        <span className="absolute -top-3.5 left-1/2 flex -translate-x-1/2 items-center gap-1 whitespace-nowrap rounded-full bg-brand px-3.5 py-1 text-xs font-bold text-white shadow-[0_6px_14px_rgba(255,108,71,0.35)]">
          <Sparkles className="size-3.5" aria-hidden="true" /> Best value
        </span>
      )}

      <div className="flex flex-col gap-1.5">
        <h3 className="font-display text-lg font-extrabold text-ink">{plan.name}</h3>
        <p className="text-[14px] leading-6 text-ink-muted">{plan.description}</p>
      </div>

      <div className="flex flex-col gap-1">
        <p className="flex items-baseline gap-1.5">
          <span className="font-display text-[40px] font-extrabold leading-none text-ink">
            {isFree ? "Free" : formatPrice(plan.price, plan.currency)}
          </span>
          {!isFree && <span className="text-sm font-medium text-ink-muted">{intervalLabel(plan.billingInterval)}</span>}
        </p>
        <p className="h-5 font-marker text-lg font-bold leading-5" style={{ color: accent }}>
          {perMonth
            ? `just ${formatPrice(Math.round(perMonth * 100) / 100, plan.currency)} a month`
            : plan.billingInterval === "lifetime"
              ? "pay once, prep forever"
              : isFree
                ? "no card needed"
                : ""}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <span className="price-chip">
          <Mic className="size-4" aria-hidden="true" />
          <span>
            <b>{plan.voiceMinutesLimit.toLocaleString()}</b> voice min
          </span>
        </span>
        <span className="price-chip">
          <Users className="size-4" aria-hidden="true" />
          <span>
            <b>{plan.mockInterviewsLimit}</b> mock {plan.mockInterviewsLimit === 1 ? "interview" : "interviews"}
          </span>
        </span>
      </div>

      <ul className="flex flex-1 flex-col gap-2.5">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-[14px] leading-5 text-ink">
            <span className="mt-0.5 flex size-[18px] shrink-0 items-center justify-center rounded-full text-white" style={{ background: accent }}>
              <Check className="size-3" strokeWidth={3} aria-hidden="true" />
            </span>
            {f}
          </li>
        ))}
        {hidden > 0 && (
          <li>
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              aria-expanded={expanded}
              className="text-[13px] font-semibold underline underline-offset-2 hover:opacity-80"
              style={{ color: accent }}
            >
              {expanded ? "Show less" : `+ ${hidden} more`}
            </button>
          </li>
        )}
      </ul>

      <a
        href={isFree ? "/sign-up" : `/sign-up?plan=${encodeURIComponent(plan.tier)}`}
        className={`rounded-full py-3 text-center text-[15px] font-semibold transition-transform hover:-translate-y-0.5 ${
          featured
            ? "btn-shine bg-brand text-white shadow-[0_8px_18px_rgba(255,108,71,0.35)]"
            : "border-2 bg-white text-ink"
        }`}
        style={featured ? undefined : { borderColor: accent }}
      >
        {isFree ? "Start free" : `Get ${plan.name}`} &rarr;
      </a>
    </div>
  );
}

/** Live pricing cards: reads active plans from the backend, so admin edits show up here. */
export function PricingPlans() {
  const [state, setState] = useState<LoadState>({ status: "loading" });

  const load = useCallback((signal?: AbortSignal) => {
    fetch(`${API_BASE_URL}/api/plans`, { signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((data: { plans?: PricingPlan[] }) => {
        const plans = Array.isArray(data.plans) ? data.plans : [];
        setState(plans.length ? { status: "ready", plans } : { status: "error" });
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setState({ status: "error" });
      });
  }, []);

  useEffect(() => {
    const ctrl = new AbortController();
    load(ctrl.signal);
    return () => ctrl.abort();
  }, [load]);

  if (state.status === "loading") {
    return (
      <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4" aria-busy="true" aria-label="Loading plans">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="price-skeleton h-[460px] rounded-3xl" />
        ))}
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className="flex w-full max-w-md flex-col items-center gap-3 rounded-3xl border border-line bg-white/80 p-8 text-center">
        <p className="font-display text-lg font-bold text-ink">We couldn&rsquo;t load plans right now.</p>
        <p className="text-sm text-ink-muted">Please check your connection and try again.</p>
        <button
          type="button"
          onClick={() => {
            setState({ status: "loading" });
            load();
          }}
          className="rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white"
        >
          Try again
        </button>
      </div>
    );
  }

  const featured = bestValueTier(state.plans);
  const cols = state.plans.length >= 4 ? "lg:grid-cols-4" : state.plans.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-2";

  return (
    <div className={`grid w-full grid-cols-1 items-stretch gap-6 pt-4 sm:grid-cols-2 ${cols}`}>
      {state.plans.map((plan, i) => (
        <RevealOnView key={plan.tier} variant="pop" delay={i * 140} className="flex">
          <PlanCard plan={plan} index={i} featured={plan.tier === featured} />
        </RevealOnView>
      ))}
    </div>
  );
}
