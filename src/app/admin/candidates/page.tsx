"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  Filter,
  CreditCard,
  Ban,
  CheckCircle,
  AlertCircle,
  Shield,
  RotateCcw,
  Sparkles,
  Mic,
  Calendar,
  Award,
  ChevronRight,
  MoreVertical,
  Edit,
  Unlock,
} from "lucide-react";
import { backendApi } from "@/lib/api-client";
import { AdminPagination } from "@/components/admin/AdminPagination";

interface Candidate {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string | null;
  isBlocked: boolean;
  blockedReason: string | null;
  blockedAt: string | null;
  blockedBy: string | null;
  createdAt: string;
  targetRole: string;
  experienceLevel: string;
  readinessScore: number;
  isOnboardingDone: boolean;
  subscription: {
    tier: string;
    status: string;
    planName: string;
    isPlanOpted: boolean;
    pricePaid: number;
    voiceMinutesUsed: number;
    voiceMinutesLimit: number;
    mockInterviewsUsed: number;
    mockInterviewsLimit: number;
    currentPeriodEnd: string | null;
  };
}

export default function AdminCandidatesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [metrics, setMetrics] = useState({
    totalCandidates: 0,
    subscribedCandidates: 0,
    freeTierCandidates: 0,
    blockedCandidates: 0,
  });
  const [activeTab, setActiveTab] = useState<"ALL" | "OPTED" | "FREE" | "BLOCKED">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Block Modal
  const [blockingCandidate, setBlockingCandidate] = useState<Candidate | null>(null);
  const [blockReason, setBlockReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Subscription Edit Modal
  const [editingSubCandidate, setEditingSubCandidate] = useState<Candidate | null>(null);
  const [subTier, setSubTier] = useState("PRO_MONTHLY");
  const [subIsOpted, setSubIsOpted] = useState(true);
  const [subMinutesLimit, setSubMinutesLimit] = useState(300);
  const [subExtendDays, setSubExtendDays] = useState(30);

  async function loadCandidates(page = currentPage, size = pageSize) {
    setLoading(true);
    setErrorMsg(null);
    try {
      let isPlanOpted: boolean | undefined;
      let isBlocked: boolean | undefined;

      if (activeTab === "OPTED") isPlanOpted = true;
      if (activeTab === "FREE") isPlanOpted = false;
      if (activeTab === "BLOCKED") isBlocked = true;

      const res = await backendApi.getAdminCandidates({
        search: searchQuery || undefined,
        isPlanOpted,
        isBlocked,
        page,
        limit: size,
      });

      if (res.success) {
        setCandidates(res.candidates);
        setMetrics(res.metrics);
        setTotalItems(res.total);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to load candidate directory.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setCurrentPage(1);
    loadCandidates(1, pageSize);
  }, [activeTab]);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    setCurrentPage(1);
    loadCandidates(1, pageSize);
  }

  function handlePageChange(newPage: number) {
    setCurrentPage(newPage);
    loadCandidates(newPage, pageSize);
  }

  function handlePageSizeChange(newSize: number) {
    setPageSize(newSize);
    setCurrentPage(1);
    loadCandidates(1, newSize);
  }

  async function handleBlockSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!blockingCandidate || !blockReason.trim()) {
      setErrorMsg("Please provide a written justification for blocking this candidate.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      const res = await backendApi.blockCandidate(blockingCandidate.id, blockReason.trim());
      if (res.success) {
        setSuccessMsg(`Candidate ${blockingCandidate.email} has been blocked.`);
        setBlockingCandidate(null);
        setBlockReason("");
        await loadCandidates();
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to block candidate.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleUnblock(candidate: Candidate) {
    if (!confirm(`Unblock candidate ${candidate.email}?`)) return;

    setErrorMsg(null);
    try {
      const res = await backendApi.unblockCandidate(candidate.id);
      if (res.success) {
        setSuccessMsg(`Candidate ${candidate.email} has been unblocked.`);
        await loadCandidates();
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to unblock candidate.");
    }
  }

  async function handleResetQuota(candidate: Candidate) {
    if (!confirm(`Reset voice minutes consumption to zero for ${candidate.email}?`)) return;

    setErrorMsg(null);
    try {
      const res = await backendApi.resetCandidateQuota(candidate.id);
      if (res.success) {
        setSuccessMsg(`Voice quota reset for ${candidate.email}.`);
        await loadCandidates();
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to reset quota.");
    }
  }

  async function handleUpdateSubscriptionSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingSubCandidate) return;

    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      const res = await backendApi.updateCandidateSubscription(editingSubCandidate.id, {
        tier: subTier,
        isPlanOpted: subIsOpted,
        voiceMinutesLimit: Number(subMinutesLimit),
        extendDays: Number(subExtendDays),
      });

      if (res.success) {
        setSuccessMsg(`Subscription updated for ${editingSubCandidate.email}.`);
        setEditingSubCandidate(null);
        await loadCandidates();
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to update subscription.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-[#161b22] border border-[#30363d] shadow-xl">
        <div className="flex items-center space-x-3.5">
          <div className="size-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shadow-md">
            <Users className="size-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-white tracking-tight">
                Candidate Directory & Subscription Tracking
              </h1>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30">
                Module A
              </span>
            </div>
            <p className="text-xs text-[#8b949e] mt-0.5">
              Inspect candidate readiness, verify plan opted status (Paid / Free), monitor AI voice consumption, and manage candidate blocking.
            </p>
          </div>
        </div>

        <button
          onClick={() => loadCandidates()}
          className="px-4 py-2 rounded-xl text-xs font-semibold text-[#c9d1d9] bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] transition self-start md:self-auto"
        >
          Refresh Directory
        </button>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#161b22] border border-[#30363d] space-y-1">
          <span className="text-[11px] text-[#8b949e]">Total Candidates</span>
          <div className="text-2xl font-bold text-white">{metrics.totalCandidates}</div>
          <span className="text-[10px] text-purple-400 font-mono">Registered Accounts</span>
        </div>

        <div className="p-4 rounded-xl bg-[#161b22] border border-[#30363d] space-y-1">
          <span className="text-[11px] text-[#8b949e]">Subscription Opted (YES)</span>
          <div className="text-2xl font-bold text-emerald-400">{metrics.subscribedCandidates}</div>
          <span className="text-[10px] text-emerald-400/80 font-mono">Active Paid Subscribers</span>
        </div>

        <div className="p-4 rounded-xl bg-[#161b22] border border-[#30363d] space-y-1">
          <span className="text-[11px] text-[#8b949e]">Free Starter Tier</span>
          <div className="text-2xl font-bold text-[#8b949e]">{metrics.freeTierCandidates}</div>
          <span className="text-[10px] text-[#8b949e] font-mono">Default 30m Quota</span>
        </div>

        <div className="p-4 rounded-xl bg-[#161b22] border border-[#30363d] space-y-1">
          <span className="text-[11px] text-[#8b949e]">Blocked Candidates</span>
          <div className="text-2xl font-bold text-red-400">{metrics.blockedCandidates}</div>
          <span className="text-[10px] text-red-400/80 font-mono">Suspended Access</span>
        </div>
      </div>

      {/* Notices */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-center space-x-2">
          <AlertCircle className="size-4 shrink-0 text-red-400" />
          <span>{errorMsg}</span>
        </div>
      )}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs flex items-center space-x-2">
          <CheckCircle className="size-4 shrink-0 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Filter Tabs & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3.5 rounded-xl bg-[#161b22] border border-[#30363d]">
        <div className="flex items-center space-x-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab("ALL")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === "ALL"
                ? "bg-purple-500/20 text-purple-300 border border-purple-500/40"
                : "text-[#8b949e] hover:text-white"
            }`}
          >
            All Candidates ({metrics.totalCandidates})
          </button>
          <button
            onClick={() => setActiveTab("OPTED")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === "OPTED"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                : "text-[#8b949e] hover:text-white"
            }`}
          >
            Subscribed (Paid) ({metrics.subscribedCandidates})
          </button>
          <button
            onClick={() => setActiveTab("FREE")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === "FREE"
                ? "bg-blue-500/20 text-blue-300 border border-blue-500/40"
                : "text-[#8b949e] hover:text-white"
            }`}
          >
            Free Starter ({metrics.freeTierCandidates})
          </button>
          <button
            onClick={() => setActiveTab("BLOCKED")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === "BLOCKED"
                ? "bg-red-500/20 text-red-300 border border-red-500/40"
                : "text-[#8b949e] hover:text-white"
            }`}
          >
            Blocked ({metrics.blockedCandidates})
          </button>
        </div>

        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-72">
          <Search className="absolute left-3 top-2.5 size-4 text-[#8b949e]" />
          <input
            type="text"
            placeholder="Search candidate email or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-[#8b949e] focus:outline-none focus:border-purple-500"
          />
        </form>
      </div>

      {/* Candidates Table */}
      {loading ? (
        <div className="p-12 text-center text-xs text-[#8b949e] font-mono">
          Loading candidate directory & subscriptions...
        </div>
      ) : candidates.length === 0 ? (
        <div className="p-12 rounded-2xl bg-[#161b22] border border-[#30363d] text-center space-y-2">
          <Users className="size-8 text-[#8b949e] mx-auto opacity-40" />
          <div className="text-sm font-semibold text-white">No candidates found</div>
          <p className="text-xs text-[#8b949e]">
            {searchQuery
              ? `No candidates matching "${searchQuery}"`
              : "Try switching filter tabs above."}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-[#30363d] bg-[#161b22] shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0d1117] text-[#8b949e] uppercase font-mono text-[11px] border-b border-[#30363d]">
              <tr>
                <th className="py-3 px-4">Candidate</th>
                <th className="py-3 px-4">Target Role & Readiness</th>
                <th className="py-3 px-4">Subscription Plan</th>
                <th className="py-3 px-4">AI Voice Quota</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#21262d]">
              {candidates.map((cand) => {
                const used = cand.subscription.voiceMinutesUsed;
                const limit = cand.subscription.voiceMinutesLimit || 30;
                const pct = Math.min(100, Math.round((used / limit) * 100));

                return (
                  <tr key={cand.id} className="hover:bg-[#1c2128]/60 transition">
                    {/* Identity */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-3">
                        {cand.avatarUrl ? (
                          <img
                            src={cand.avatarUrl}
                            alt=""
                            className="size-9 rounded-xl border border-[#30363d]"
                          />
                        ) : (
                          <div className="size-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center font-bold text-purple-300">
                            {cand.fullName[0] || cand.email[0].toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-white">{cand.fullName}</div>
                          <div className="text-[11px] text-[#8b949e] font-mono">{cand.email}</div>
                        </div>
                      </div>
                    </td>

                    {/* Target Role & Readiness */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        <div className="text-white font-medium">{cand.targetRole}</div>
                        <div className="flex items-center space-x-2 text-[11px] text-[#8b949e]">
                          <span>Readiness:</span>
                          <span className="font-bold text-emerald-400 font-mono">
                            {cand.readinessScore}%
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Subscription Opted (YES / NO) */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                              cand.subscription.isPlanOpted
                                ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/40"
                                : "bg-slate-500/15 text-[#8b949e] border border-slate-500/30"
                            }`}
                          >
                            OPTED: {cand.subscription.isPlanOpted ? "YES" : "NO"}
                          </span>
                          <span className="text-[11px] text-white font-medium">
                            {cand.subscription.planName}
                          </span>
                        </div>
                        {cand.subscription.currentPeriodEnd && (
                          <div className="text-[10px] text-[#8b949e] font-mono">
                            Renews: {new Date(cand.subscription.currentPeriodEnd).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* AI Voice Minutes Progress */}
                    <td className="py-3.5 px-4">
                      <div className="w-40 space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-[#8b949e] flex items-center space-x-1">
                            <Mic className="size-3 text-purple-400" />
                            <span>{Math.round(used)}m used</span>
                          </span>
                          <span className="font-mono text-white">{limit}m max</span>
                        </div>
                        <div className="h-1.5 w-full bg-[#0d1117] rounded-full overflow-hidden border border-[#30363d]">
                          <div
                            className={`h-full rounded-full ${
                              pct >= 90
                                ? "bg-red-500"
                                : pct >= 70
                                ? "bg-amber-400"
                                : "bg-purple-500"
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4">
                      {cand.isBlocked ? (
                        <div className="space-y-0.5">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-500/15 text-red-400 border border-red-500/30">
                            BLOCKED
                          </span>
                          {cand.blockedReason && (
                            <div className="text-[10px] text-red-300 truncate max-w-[140px]" title={cand.blockedReason}>
                              {cand.blockedReason}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          ACTIVE
                        </span>
                      )}
                    </td>

                    {/* Action Buttons */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => {
                            setEditingSubCandidate(cand);
                            setSubTier(cand.subscription.tier || "PRO_MONTHLY");
                            setSubIsOpted(cand.subscription.isPlanOpted);
                            setSubMinutesLimit(cand.subscription.voiceMinutesLimit || 300);
                            setSubExtendDays(30);
                          }}
                          className="p-1.5 rounded-lg text-[#8b949e] hover:text-white hover:bg-[#21262d] transition"
                          title="Modify Subscription"
                        >
                          <CreditCard className="size-4 text-purple-400" />
                        </button>
                        <button
                          onClick={() => handleResetQuota(cand)}
                          className="p-1.5 rounded-lg text-[#8b949e] hover:text-teal-400 hover:bg-[#21262d] transition"
                          title="Reset Voice Quota"
                        >
                          <RotateCcw className="size-4" />
                        </button>
                        {cand.isBlocked ? (
                          <button
                            onClick={() => handleUnblock(cand)}
                            className="p-1.5 rounded-lg text-emerald-400 hover:bg-emerald-950/30 transition"
                            title="Unblock Candidate"
                          >
                            <Unlock className="size-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setBlockingCandidate(cand);
                              setBlockReason("");
                            }}
                            className="p-1.5 rounded-lg text-[#8b949e] hover:text-red-400 hover:bg-red-950/30 transition"
                            title="Block Candidate"
                          >
                            <Ban className="size-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      {!loading && candidates.length > 0 && (
        <AdminPagination
          currentPage={currentPage}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          pageSizeOptions={[10, 25, 50]}
          itemLabel="candidates"
        />
      )}

      {/* Modal: Block Candidate */}
      {blockingCandidate && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#161b22] border border-[#30363d] p-6 shadow-2xl space-y-4 animate-in fade-in-50 zoom-in-95">
            <div className="flex items-center space-x-2 text-red-400">
              <Ban className="size-5" />
              <h3 className="text-base font-bold text-white">Block Candidate</h3>
            </div>
            <p className="text-xs text-[#8b949e]">
              Suspending <span className="text-white font-semibold">{blockingCandidate.email}</span> will immediately prevent them from taking practice interviews, mock sessions, or generating plans.
            </p>

            <form onSubmit={handleBlockSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#8b949e] mb-1">
                  Reason for Suspension (Required)
                </label>
                <textarea
                  placeholder="e.g. Terms of service violation, abusive automation, payment fraud..."
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  rows={3}
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl p-3 text-xs text-white placeholder-[#8b949e] focus:outline-none focus:border-red-500"
                  required
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-[#30363d]">
                <button
                  type="button"
                  onClick={() => setBlockingCandidate(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#8b949e] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-red-600 hover:bg-red-500 transition disabled:opacity-50"
                >
                  {isSubmitting ? "Suspending..." : "Confirm & Block"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Subscription */}
      {editingSubCandidate && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#161b22] border border-[#30363d] p-6 shadow-2xl space-y-4 animate-in fade-in-50 zoom-in-95">
            <div className="flex items-center space-x-2 text-purple-400">
              <CreditCard className="size-5" />
              <h3 className="text-base font-bold text-white">Modify Candidate Subscription</h3>
            </div>
            <p className="text-xs text-[#8b949e]">
              Editing plan for <span className="text-white font-semibold">{editingSubCandidate.email}</span>
            </p>

            <form onSubmit={handleUpdateSubscriptionSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#8b949e] mb-1">
                  Subscription Tier
                </label>
                <select
                  value={subTier}
                  onChange={(e) => setSubTier(e.target.value)}
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="FREE">FREE Starter</option>
                  <option value="PRO_MONTHLY">PRO Monthly ($29/mo)</option>
                  <option value="PRO_QUARTERLY">PRO Quarterly ($69/qtr)</option>
                  <option value="LIFETIME">Lifetime Unlimited Access ($149)</option>
                  <option value="CAMPUS_ENTERPRISE">Campus / Enterprise License</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="subIsOpted"
                  checked={subIsOpted}
                  onChange={(e) => setSubIsOpted(e.target.checked)}
                  className="rounded border-[#30363d] text-purple-600 focus:ring-purple-500"
                />
                <label htmlFor="subIsOpted" className="text-xs text-white font-medium select-none">
                  Plan Opted: Mark as active paying subscriber
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#8b949e] mb-1">
                    Voice Minutes Limit
                  </label>
                  <input
                    type="number"
                    value={subMinutesLimit}
                    onChange={(e) => setSubMinutesLimit(Number(e.target.value))}
                    className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#8b949e] mb-1">
                    Extend Days (+days)
                  </label>
                  <input
                    type="number"
                    value={subExtendDays}
                    onChange={(e) => setSubExtendDays(Number(e.target.value))}
                    className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-[#30363d]">
                <button
                  type="button"
                  onClick={() => setEditingSubCandidate(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#8b949e] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 transition disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

