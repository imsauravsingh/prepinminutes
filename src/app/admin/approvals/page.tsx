"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Layers,
  FileText,
  HelpCircle,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Shield,
  MessageSquare,
  Check,
  Tag,
} from "lucide-react";
import { backendApi } from "@/lib/api-client";

interface PendingItem {
  itemType: "Category" | "Topic" | "Question";
  identifier: string;
  name: string;
  description?: string;
  prompt?: string;
  difficulty?: string;
  rubricAtoms?: string[];
  rubricGuide?: string;
  hints?: string[];
  status: string;
  isLive: boolean;
  createdBy: string | null;
  createdAt: string | null;
  rejectionFeedback: string | null;
  parentContext: string;
}

export default function AdminApprovalsPage() {
  const [items, setItems] = useState<PendingItem[]>([]);
  const [activeTab, setActiveTab] = useState<"ALL" | "Category" | "Topic" | "Question">("ALL");
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Reject Modal
  const [rejectingItem, setRejectingItem] = useState<PendingItem | null>(null);
  const [feedbackReason, setFeedbackReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function loadPending() {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await backendApi.getNeo4jPending();
      if (res.success) {
        const combined: PendingItem[] = [
          ...res.categories.map((c) => ({ ...c, itemType: "Category" as const })),
          ...res.topics.map((t) => ({ ...t, itemType: "Topic" as const })),
          ...res.questions.map((q) => ({ ...q, itemType: "Question" as const })),
        ];
        setItems(combined);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to load staging queue.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPending();
  }, []);

  async function handleApprove(item: PendingItem) {
    if (!confirm(`Approve and push ${item.itemType} "${item.name}" to Live in Neo4j AuraDB?`)) return;

    setErrorMsg(null);
    try {
      const res = await backendApi.approveNeo4jNode({
        itemType: item.itemType,
        identifier: item.identifier,
      });

      if (res.success) {
        setSuccessMsg(`Successfully approved "${item.name}"! Node is now LIVE for candidate practice.`);
        await loadPending();
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to approve node.");
    }
  }

  async function handleRejectSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!rejectingItem || !feedbackReason.trim()) {
      setErrorMsg("Please provide written feedback for rejection.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      const res = await backendApi.rejectNeo4jNode({
        itemType: rejectingItem.itemType,
        identifier: rejectingItem.identifier,
        feedbackReason: feedbackReason.trim(),
      });

      if (res.success) {
        setSuccessMsg(`Marked "${rejectingItem.name}" as REJECTED with feedback.`);
        setRejectingItem(null);
        setFeedbackReason("");
        await loadPending();
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to reject item.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const filteredItems = items.filter((item) => {
    if (activeTab === "ALL") return true;
    return item.itemType === activeTab;
  });

  const catCount = items.filter((i) => i.itemType === "Category").length;
  const topicCount = items.filter((i) => i.itemType === "Topic").length;
  const qCount = items.filter((i) => i.itemType === "Question").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-[#161b22] border border-[#30363d] shadow-xl">
        <div className="flex items-center space-x-3.5">
          <div className="size-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shadow-md">
            <CheckCircle2 className="size-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-white tracking-tight">
                Curriculum Staging & Approval Gate
              </h1>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                Isolation Gate
              </span>
            </div>
            <p className="text-xs text-[#8b949e] mt-0.5">
              Review and approve drafts created by staff engineers and curriculum reviewers before they become visible to candidates.
            </p>
          </div>
        </div>

        <button
          onClick={loadPending}
          className="px-4 py-2 rounded-xl text-xs font-semibold text-[#c9d1d9] bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] transition flex items-center space-x-1.5 self-start md:self-auto"
        >
          <Clock className="size-3.5 text-amber-400" />
          <span>Refresh Staging Queue</span>
        </button>
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
          <CheckCircle2 className="size-4 shrink-0 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 border-b border-[#30363d] pb-2">
        <button
          onClick={() => setActiveTab("ALL")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition flex items-center space-x-1.5 ${
            activeTab === "ALL"
              ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
              : "text-[#8b949e] hover:text-white"
          }`}
        >
          <span>All Pending</span>
          <span className="px-1.5 py-0.2 rounded text-[10px] bg-[#21262d] text-white">
            {items.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab("Category")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition flex items-center space-x-1.5 ${
            activeTab === "Category"
              ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
              : "text-[#8b949e] hover:text-white"
          }`}
        >
          <Layers className="size-3.5" />
          <span>Categories</span>
          <span className="px-1.5 py-0.2 rounded text-[10px] bg-[#21262d] text-white">
            {catCount}
          </span>
        </button>
        <button
          onClick={() => setActiveTab("Topic")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition flex items-center space-x-1.5 ${
            activeTab === "Topic"
              ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
              : "text-[#8b949e] hover:text-white"
          }`}
        >
          <FileText className="size-3.5" />
          <span>Topics</span>
          <span className="px-1.5 py-0.2 rounded text-[10px] bg-[#21262d] text-white">
            {topicCount}
          </span>
        </button>
        <button
          onClick={() => setActiveTab("Question")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition flex items-center space-x-1.5 ${
            activeTab === "Question"
              ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
              : "text-[#8b949e] hover:text-white"
          }`}
        >
          <HelpCircle className="size-3.5" />
          <span>Questions</span>
          <span className="px-1.5 py-0.2 rounded text-[10px] bg-[#21262d] text-white">
            {qCount}
          </span>
        </button>
      </div>

      {/* Queue Items */}
      {loading ? (
        <div className="p-12 text-center text-xs text-[#8b949e] font-mono">
          Scanning Neo4j graph for staging drafts...
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="p-12 rounded-2xl bg-[#161b22] border border-[#30363d] text-center space-y-2">
          <CheckCircle2 className="size-10 text-emerald-400 mx-auto" />
          <div className="text-sm font-bold text-white">All Clear! No Pending Drafts</div>
          <p className="text-xs text-[#8b949e] max-w-md mx-auto">
            All categories, topics, and benchmark diagnostic questions are live and published in Neo4j AuraDB.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredItems.map((item) => (
            <div
              key={`${item.itemType}-${item.identifier}`}
              className="p-5 rounded-2xl bg-[#161b22] border border-[#30363d] hover:border-amber-500/40 transition space-y-4 shadow-sm"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div className="flex items-center space-x-2.5">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                      item.itemType === "Category"
                        ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                        : item.itemType === "Topic"
                        ? "bg-teal-500/15 text-teal-400 border border-teal-500/30"
                        : "bg-orange-500/15 text-[#ff5722] border border-orange-500/30"
                    }`}
                  >
                    {item.itemType}
                  </span>
                  <h3 className="text-sm font-bold text-white tracking-tight">
                    {item.name}
                  </h3>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                      item.status === "REJECTED"
                        ? "bg-red-500/15 text-red-400 border border-red-500/30"
                        : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <div className="text-xs text-[#8b949e] font-mono">
                  Context: <span className="text-white">{item.parentContext}</span>
                </div>
              </div>

              {/* Description or Prompt */}
              {item.description && (
                <p className="text-xs text-[#8b949e]">{item.description}</p>
              )}
              {item.prompt && (
                <div className="p-3.5 rounded-xl bg-[#0d1117] border border-[#21262d] text-xs text-[#e6edf3] font-sans">
                  {item.prompt}
                </div>
              )}

              {/* Rubric Atoms */}
              {item.rubricAtoms && item.rubricAtoms.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-[#8b949e] flex items-center space-x-1">
                    <Tag className="size-3 text-teal-400" />
                    <span>Rubric Atoms ({item.rubricAtoms.length}):</span>
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {item.rubricAtoms.map((atom, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded text-[11px] bg-[#21262d] text-teal-300 border border-[#30363d]"
                      >
                        {atom}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Rejection Feedback if any */}
              {item.rejectionFeedback && (
                <div className="p-3 rounded-xl bg-red-950/30 border border-red-800/40 text-xs text-red-300 space-y-1">
                  <span className="font-semibold text-red-400">Previous Rejection Feedback:</span>
                  <p>{item.rejectionFeedback}</p>
                </div>
              )}

              {/* Metadata & Actions */}
              <div className="pt-3 border-t border-[#21262d] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="text-[#8b949e] font-mono text-[11px] space-x-2">
                  <span>Author: {item.createdBy || "Staff"}</span>
                  <span>•</span>
                  <span>ID: {item.identifier}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setRejectingItem(item);
                      setFeedbackReason("");
                    }}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-red-300 bg-red-950/30 hover:bg-red-900/40 border border-red-800/50 transition flex items-center space-x-1.5"
                  >
                    <XCircle className="size-3.5" />
                    <span>Reject</span>
                  </button>
                  <button
                    onClick={() => handleApprove(item)}
                    className="px-4 py-1.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 transition flex items-center space-x-1.5 shadow-md shadow-emerald-900/30"
                  >
                    <Check className="size-3.5" />
                    <span>Approve & Push to Live</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Reject with Feedback */}
      {rejectingItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-[#161b22] border border-[#30363d] p-6 shadow-2xl space-y-5 animate-in fade-in-50 zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <XCircle className="size-5 text-red-400" />
                <h3 className="text-base font-bold text-white">
                  Reject {rejectingItem.itemType}: {rejectingItem.name}
                </h3>
              </div>
              <button
                onClick={() => setRejectingItem(null)}
                className="text-[#8b949e] hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRejectSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#8b949e] mb-1">
                  Written Feedback / Rejection Reason (Required)
                </label>
                <textarea
                  placeholder="Explain why this content was rejected and what specific changes are needed..."
                  value={feedbackReason}
                  onChange={(e) => setFeedbackReason(e.target.value)}
                  rows={4}
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl p-3 text-xs text-white placeholder-[#8b949e] focus:outline-none focus:border-red-500"
                  required
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#30363d]">
                <button
                  type="button"
                  onClick={() => setRejectingItem(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#8b949e] hover:text-white hover:bg-[#21262d] transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-red-600 hover:bg-red-500 transition disabled:opacity-50"
                >
                  {isSubmitting ? "Submitting..." : "Reject with Feedback"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

