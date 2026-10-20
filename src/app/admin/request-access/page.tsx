"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldAlert,
  Send,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  UserCheck,
  Building,
} from "lucide-react";
import { backendApi } from "@/lib/api-client";

export default function AdminRequestAccessPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [requestedRole, setRequestedRole] = useState("STAFF_ENGINEER");
  const [requestReason, setRequestReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError("Email address is required.");
      return;
    }

    if (!requestReason.trim() || requestReason.trim().length < 10) {
      setError("Please write a descriptive reason (minimum 10 characters) explaining your role and project.");
      return;
    }

    setLoading(true);

    try {
      const res = await backendApi.adminRequestAccess({
        email: email.trim(),
        requestedRole,
        requestReason: requestReason.trim(),
      });

      if (res.success) {
        router.replace("/admin/pending-approval");
      } else {
        setError(res.message || "Failed to submit access request.");
      }
    } catch (err: any) {
      setError(err?.message || "Failed to submit access request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0f12] text-[#f0f3f6] flex flex-col items-center justify-center p-4 selection:bg-[#ff5722] selection:text-white">
      <div className="w-full max-w-lg relative z-10 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono font-semibold tracking-widest uppercase">
            <UserCheck className="size-3.5" />
            <span>Administrative Enrollment</span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-white">
            Request Admin Control Access
          </h1>
          <p className="text-xs text-[#8b949e]">
            Your access request will be directly reviewed by the Head of Department (HOD).
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 shadow-2xl space-y-5">
          {error && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-start space-x-2">
              <AlertCircle className="size-4 shrink-0 mt-0.5" />
              <div className="flex-1">{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#c9d1d9]">Your Registered Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="engineer@prepinminutes.com"
                className="w-full bg-[#0d0f12] border border-[#30363d] rounded-xl px-3 py-2 text-xs text-white placeholder-[#484f58] focus:outline-none focus:border-emerald-500 transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#c9d1d9]">Requested Administrative Role</label>
              <select
                value={requestedRole}
                onChange={(e) => setRequestedRole(e.target.value)}
                className="w-full bg-[#0d0f12] border border-[#30363d] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 transition"
              >
                <option value="CURRICULUM_MANAGER">Curriculum Manager (Topic Governance & Category Approvals)</option>
                <option value="STAFF_ENGINEER">Staff Engineer (Author Topics & Diagnostic Challenges)</option>
                <option value="CONTENT_REVIEWER">Content Reviewer (Review Rubric Atoms & Model Answers)</option>
                <option value="SUPPORT_ENGINEER">Support Engineer (Candidate Assistance & Quota Resolutions)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#c9d1d9] flex items-center justify-between">
                <span>Reason for Access & Project Responsibilities</span>
                <span className="text-[10px] text-[#6e7681]">Min 10 characters</span>
              </label>
              <textarea
                value={requestReason}
                onChange={(e) => setRequestReason(e.target.value)}
                required
                rows={4}
                placeholder="Explain what topics you are curating, your team, or your specific administrative tasks (e.g. 'I am authoring System Design Kafka topics for Senior Backend tracks')..."
                className="w-full bg-[#0d0f12] border border-[#30363d] rounded-xl p-3 text-xs text-white placeholder-[#484f58] focus:outline-none focus:border-emerald-500 transition resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-semibold text-xs flex items-center justify-center space-x-2 transition shadow-lg shadow-amber-900/30 active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? (
                <div className="size-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              ) : (
                <>
                  <span>Submit Request to HOD</span>
                  <Send className="size-3.5" />
                </>
              )}
            </button>
          </form>

          <div className="pt-2 border-t border-[#21262d] flex items-center justify-between text-[11px] text-[#8b949e]">
            <span>Reviewer Authority:</span>
            <span className="text-amber-400 font-mono font-medium">imsauravsingh@gmail.com</span>
          </div>
        </div>
      </div>
    </div>
  );
}

