"use client";

import { useEffect, useState } from "react";
import { backendApi, type CompanyFocusResponse } from "@/lib/api-client";

/**
 * Target-company interview intelligence, only when the candidate set target
 * companies in their dashboard setup. Without companies it returns null and
 * nothing in the plan changes.
 */

export type CompanyFocus = CompanyFocusResponse;

const CACHE_PREFIX = "pim_company_focus_";

/** "Google", "Google and Amazon", "Google, Amazon and Stripe". */
export function joinNames(names: string[]) {
  if (names.length <= 1) return names[0] ?? "";
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}

export function targetCompanyNames(profile: Record<string, unknown> | null): string[] {
  const raw = profile?.targetCompanies;
  return Array.isArray(raw) ? raw.map((c) => String(c).trim()).filter(Boolean) : [];
}

export function useCompanyFocus(names: string[]) {
  const key = names.join(",");
  const [focus, setFocus] = useState<CompanyFocus | null>(null);
  const [loadedKey, setLoadedKey] = useState<string | null>(null);

  useEffect(() => {
    if (!key) return;
    let alive = true;
    const cacheKey = `${CACHE_PREFIX}${key.toLowerCase()}`;
    try {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        Promise.resolve().then(() => {
          if (!alive) return;
          setFocus(JSON.parse(cached) as CompanyFocus);
          setLoadedKey(key);
        });
        return () => {
          alive = false;
        };
      }
    } catch {}
    backendApi
      .getCompanyFocus(key.split(","))
      .then((res) => {
        if (!alive) return;
        setFocus(res);
        try {
          sessionStorage.setItem(cacheKey, JSON.stringify(res));
        } catch {}
      })
      .catch(() => alive && setFocus(null))
      .finally(() => alive && setLoadedKey(key));
    return () => {
      alive = false;
    };
  }, [key]);

  // No companies set: company personalisation is off.
  if (!key) return { focus: null, ready: true };
  return { focus: loadedKey === key ? focus : null, ready: loadedKey === key };
}

/**
 * Each area's share of the company's interview (0-1), spread over the areas the
 * candidate is preparing. A round that tests several areas is split between the
 * ones they have; rounds for areas they don't prepare are ignored.
 */
export function companyAreaShares(focus: CompanyFocus | null, areaSlugs: string[]): Record<string, number> {
  const out: Record<string, number> = {};
  if (!focus?.matched.length) return out;
  const have = new Set(areaSlugs);
  let total = 0;
  for (const r of focus.rounds) {
    const ds = r.domains.filter((d) => have.has(d));
    if (!ds.length) continue;
    for (const d of ds) out[d] = (out[d] ?? 0) + r.weight / ds.length;
    total += r.weight;
  }
  if (!total) return {};
  for (const d of Object.keys(out)) out[d] = out[d] / total;
  return out;
}
