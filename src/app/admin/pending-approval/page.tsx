"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Clock,
  Shield,
  RefreshCw,
  LogOut,
  Mail,
  CheckCircle2,
} from "lucide-react";
import { backendApi } from "@/lib/api-client";

export default function AdminPendingApprovalPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleCheckStatus = async () => {
    setChecking(true);
    setStatusMessage(null);
    try {
      const res = await backendApi.getAdminMe();
      if (res.success && res.user) {
        if (res.user.adminApprovalStatus === "APPROVED") {
          router.replace("/admin");
          return;
        } else {
          setStatusMessage("Status: Still Pending Approval by HOD.");
        }
      }
    } catch {
      setStatusMessage("Status: Still Pending Approval by HOD.");
    } finally {
      setChecking(false);
    }
  };

  const handleLogout = async () => {
    try {
      await backendApi.adminLogout();
    } catch {}
    router.replace("/admin/login");
  };

  return (
    <div className="min-h-screen bg-[#0d0f12] text-[#f0f3f6] flex flex-col items-center justify-center p-4 selection:bg-[#ff5722] selection:text-white">
      <div className="w-full max-w-md relative z-10 space-y-6 text-center">
        {/* Animated Clock Badge */}
        <div className="size-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto shadow-xl shadow-amber-500/10">
          <Clock className="size-8 animate-pulse" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Approval Pending
          </h1>
          <p className="text-xs text-[#8b949e] max-w-sm mx-auto">
            Your administrative enrollment request is currently under review by the Head of Department.
          </p>
        </div>

        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 shadow-2xl space-y-5 text-left">
          <div className="p-3.5 rounded-xl bg-[#0d0f12] border border-[#21262d] space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[#8b949e]">Reviewing Authority:</span>
              <span className="text-white font-mono font-medium">Saurav Singh (HOD)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#8b949e]">Contact Email:</span>
              <span className="text-amber-400 font-mono">imsauravsingh@gmail.com</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#8b949e]">Current Status:</span>
              <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                PENDING REVIEW
              </span>
            </div>
          </div>

          {statusMessage && (
            <p className="text-xs text-center text-amber-300 font-mono">
              {statusMessage}
            </p>
          )}

          <div className="space-y-2.5">
            <button
              onClick={handleCheckStatus}
              disabled={checking}
              className="w-full py-2.5 px-4 rounded-xl bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] text-white font-semibold text-xs flex items-center justify-center space-x-2 transition"
            >
              <RefreshCw className={`size-3.5 ${checking ? "animate-spin" : ""}`} />
              <span>Check Approval Status</span>
            </button>

            <button
              onClick={handleLogout}
              className="w-full py-2.5 px-4 rounded-xl text-[#8b949e] hover:text-white hover:bg-[#21262d]/40 text-xs font-semibold flex items-center justify-center space-x-1.5 transition"
            >
              <LogOut className="size-3.5" />
              <span>Back to Login</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

