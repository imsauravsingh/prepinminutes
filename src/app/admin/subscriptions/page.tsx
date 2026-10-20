"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  CreditCard,
  Sparkles,
  Zap,
  Users,
  ShieldCheck,
  Tag,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Percent,
} from "lucide-react";
import { backendApi } from "@/lib/api-client";

export default function AdminSubscriptionsPage() {
  const [promoCodes, setPromoCodes] = useState([
    { code: "PREP2026", discount: "25% OFF", maxUses: 500, used: 142, status: "ACTIVE" },
    { code: "HOD_SPECIAL", discount: "50% OFF", maxUses: 100, used: 88, status: "ACTIVE" },
    { code: "LAUNCH100", discount: "100% OFF", maxUses: 50, used: 50, status: "EXPIRED" },
  ]);

  const [newCode, setNewCode] = useState("");
  const [newDiscount, setNewDiscount] = useState("20% OFF");
  const [newMaxUses, setNewMaxUses] = useState(100);
  const [showPromoModal, setShowPromoModal] = useState(false);

  function handleCreatePromo(e: React.FormEvent) {
    e.preventDefault();
    if (!newCode.trim()) return;

    setPromoCodes([
      ...promoCodes,
      {
        code: newCode.trim().toUpperCase(),
        discount: newDiscount,
        maxUses: newMaxUses,
        used: 0,
        status: "ACTIVE",
      },
    ]);
    setNewCode("");
    setShowPromoModal(false);
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-[#161b22] border border-[#30363d] shadow-xl">
        <div className="flex items-center space-x-3.5">
          <div className="size-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shadow-md">
            <CreditCard className="size-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-white tracking-tight">
                Subscription Tiers, Quotas & Promo Codes
              </h1>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30">
                Monetization Control Plane
              </span>
            </div>
            <p className="text-xs text-[#8b949e] mt-0.5">
              Configure monetization plans, voice minutes limits, candidate quotas, and promotional campaigns.
            </p>
          </div>
        </div>

        <Link
          href="/admin/candidates"
          className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 transition flex items-center space-x-1.5 shadow-md shadow-purple-900/30 self-start md:self-auto"
        >
          <Users className="size-3.5" />
          <span>Candidate Directory</span>
        </Link>
      </div>

      {/* Subscription Tier Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Tier 1: Free Starter */}
        <div className="p-5 rounded-2xl bg-[#161b22] border border-[#30363d] space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase text-[#8b949e] font-bold">
              Entry Tier
            </span>
            <h3 className="text-lg font-bold text-white">Free Starter</h3>
            <div className="text-2xl font-extrabold text-white">
              $0 <span className="text-xs text-[#8b949e] font-normal">/ forever</span>
            </div>
            <p className="text-xs text-[#8b949e]">
              Default candidate onboarding experience with sample diagnostic evaluations.
            </p>
          </div>
          <div className="pt-3 border-t border-[#21262d] space-y-1.5 text-xs text-[#c9d1d9]">
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="size-3.5 text-emerald-400" />
              <span>30 Voice Minutes</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="size-3.5 text-emerald-400" />
              <span>1 Mock Technical Interview</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="size-3.5 text-emerald-400" />
              <span>Basic Readiness Score</span>
            </div>
          </div>
        </div>

        {/* Tier 2: Pro Monthly */}
        <div className="p-5 rounded-2xl bg-[#161b22] border border-purple-500/40 space-y-4 flex flex-col justify-between shadow-lg shadow-purple-950/20">
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase text-purple-400 font-bold">
              Most Popular
            </span>
            <h3 className="text-lg font-bold text-white">Pro Monthly</h3>
            <div className="text-2xl font-extrabold text-purple-400">
              $29 <span className="text-xs text-[#8b949e] font-normal">/ month</span>
            </div>
            <p className="text-xs text-[#8b949e]">
              Targeted preparation sprint for candidates with interviews scheduled within 30 days.
            </p>
          </div>
          <div className="pt-3 border-t border-[#21262d] space-y-1.5 text-xs text-[#c9d1d9]">
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="size-3.5 text-purple-400" />
              <span>300 Voice Minutes / mo</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="size-3.5 text-purple-400" />
              <span>10 AI Mock Technical Sessions</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="size-3.5 text-purple-400" />
              <span>Custom Neo4j Graph Prep Plan</span>
            </div>
          </div>
        </div>

        {/* Tier 3: Pro Quarterly */}
        <div className="p-5 rounded-2xl bg-[#161b22] border border-[#30363d] space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase text-teal-400 font-bold">
              Best Value
            </span>
            <h3 className="text-lg font-bold text-white">Pro Quarterly</h3>
            <div className="text-2xl font-extrabold text-white">
              $69 <span className="text-xs text-[#8b949e] font-normal">/ 3 months</span>
            </div>
            <p className="text-xs text-[#8b949e]">
              Comprehensive career shift preparation across System Design & Core Languages.
            </p>
          </div>
          <div className="pt-3 border-t border-[#21262d] space-y-1.5 text-xs text-[#c9d1d9]">
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="size-3.5 text-teal-400" />
              <span>1,000 Voice Minutes</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="size-3.5 text-teal-400" />
              <span>30 AI Mock Technical Sessions</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="size-3.5 text-teal-400" />
              <span>Priority Deepgram STT</span>
            </div>
          </div>
        </div>

        {/* Tier 4: Lifetime Unlimited */}
        <div className="p-5 rounded-2xl bg-[#161b22] border border-amber-500/40 space-y-4 flex flex-col justify-between shadow-lg shadow-amber-950/20">
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">
              Lifetime Access
            </span>
            <h3 className="text-lg font-bold text-white">Lifetime Access</h3>
            <div className="text-2xl font-extrabold text-amber-400">
              $149 <span className="text-xs text-[#8b949e] font-normal">/ one-time</span>
            </div>
            <p className="text-xs text-[#8b949e]">
              Permanent access to all curriculum updates, language runtimes, and mock rounds.
            </p>
          </div>
          <div className="pt-3 border-t border-[#21262d] space-y-1.5 text-xs text-[#c9d1d9]">
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="size-3.5 text-amber-400" />
              <span>Unlimited Voice Minutes</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="size-3.5 text-amber-400" />
              <span>Unlimited Mock Interviews</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="size-3.5 text-amber-400" />
              <span>VIP Discord & Roadmap Access</span>
            </div>
          </div>
        </div>
      </div>

      {/* Promotional Campaign & Discount Codes */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Tag className="size-5 text-purple-400" />
            <h2 className="text-base font-bold text-white">
              Promotional Codes & Campaign Discounts
            </h2>
          </div>
          <button
            onClick={() => setShowPromoModal(true)}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 transition"
          >
            + Create Promo Code
          </button>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-[#30363d] bg-[#161b22] shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0d1117] text-[#8b949e] uppercase font-mono text-[11px] border-b border-[#30363d]">
              <tr>
                <th className="py-3 px-4">Coupon Code</th>
                <th className="py-3 px-4">Discount</th>
                <th className="py-3 px-4">Usage (Claimed / Max)</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Progress</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#21262d]">
              {promoCodes.map((promo) => {
                const pct = Math.min(100, Math.round((promo.used / promo.maxUses) * 100));
                return (
                  <tr key={promo.code} className="hover:bg-[#1c2128]/60 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-white">
                      {promo.code}
                    </td>
                    <td className="py-3.5 px-4 text-emerald-400 font-semibold">
                      {promo.discount}
                    </td>
                    <td className="py-3.5 px-4 text-[#8b949e] font-mono">
                      {promo.used} / {promo.maxUses} uses
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                          promo.status === "ACTIVE"
                            ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                            : "bg-slate-500/15 text-[#8b949e] border border-slate-500/30"
                        }`}
                      >
                        {promo.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="w-28 ml-auto space-y-1">
                        <div className="text-[10px] text-[#8b949e] font-mono text-right">{pct}%</div>
                        <div className="h-1.5 w-full bg-[#0d1117] rounded-full overflow-hidden border border-[#30363d]">
                          <div className="h-full bg-purple-500 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Create Promo Code */}
      {showPromoModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#161b22] border border-[#30363d] p-6 shadow-2xl space-y-4 animate-in fade-in-50 zoom-in-95">
            <div className="flex items-center space-x-2 text-purple-400">
              <Tag className="size-5" />
              <h3 className="text-base font-bold text-white">Create Promotional Discount Code</h3>
            </div>

            <form onSubmit={handleCreatePromo} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#8b949e] mb-1">
                  Promo Code
                </label>
                <input
                  type="text"
                  placeholder="e.g. SUMMER2026"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8b949e] mb-1">
                  Discount Percentage
                </label>
                <select
                  value={newDiscount}
                  onChange={(e) => setNewDiscount(e.target.value)}
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="15% OFF">15% Discount</option>
                  <option value="25% OFF">25% Discount</option>
                  <option value="50% OFF">50% Special Discount</option>
                  <option value="100% OFF">100% Free VIP Access</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8b949e] mb-1">
                  Maximum Claims (Usage Cap)
                </label>
                <input
                  type="number"
                  value={newMaxUses}
                  onChange={(e) => setNewMaxUses(Number(e.target.value))}
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-[#30363d]">
                <button
                  type="button"
                  onClick={() => setShowPromoModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#8b949e] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 transition"
                >
                  Create Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

