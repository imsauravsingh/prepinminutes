"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Shield,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  Flame,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { backendApi } from "@/lib/api-client";

function GoogleIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.94 0 12s.45 3.84 1.25 5.42l4.03-3.15z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      />
    </svg>
  );
}

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("imsauravsingh@gmail.com");
  const [password, setPassword] = useState("Saurav@3063");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await backendApi.adminLogin(email, password);
      if (res.success && res.user) {
        router.replace("/admin");
      } else {
        setError("Failed to authenticate administrator.");
      }
    } catch (err: any) {
      console.error("Admin login error:", err);
      const msg = err?.message || "Invalid credentials or unauthorized account.";
      if (msg.includes("PENDING_APPROVAL") || err?.code === "PENDING_APPROVAL") {
        router.replace("/admin/pending-approval");
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFillHOD = () => {
    setEmail("imsauravsingh@gmail.com");
    setPassword("Saurav@3063");
    setError(null);
  };

  const handleGoogleSso = () => {
    // Redirects to backend Google OAuth redirect endpoint configured in secrets
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";
    window.location.href = `${backendUrl}/api/auth/google?redirect_url=${encodeURIComponent(
      window.location.origin + "/admin"
    )}`;
  };

  return (
    <div className="min-h-screen bg-[#0d0f12] text-[#f0f3f6] flex flex-col items-center justify-center p-4 selection:bg-[#ff5722] selection:text-white">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-950/20 via-transparent to-transparent pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-semibold tracking-widest uppercase">
            <Shield className="size-3.5" />
            <span>Restricted Access Control</span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center justify-center space-x-2">
            <span>PrepInMinutes</span>
            <span className="text-xs uppercase font-extrabold px-2 py-0.5 rounded bg-[#ff5722] text-white">
              Admin
            </span>
          </h1>
          <p className="text-xs text-[#8b949e]">
            Curriculum Knowledge Graph & Platform Governance
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 shadow-2xl space-y-5">
          {error && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-start space-x-2">
              <AlertCircle className="size-4 shrink-0 mt-0.5" />
              <div className="flex-1">{error}</div>
            </div>
          )}

          {/* Google SSO Button */}
          <button
            type="button"
            onClick={handleGoogleSso}
            className="w-full py-2.5 px-4 rounded-xl bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] text-white text-xs font-semibold flex items-center justify-center space-x-2.5 transition active:scale-[0.99] shadow-sm"
          >
            <GoogleIcon className="size-4 shrink-0" />
            <span>Sign in with Google (SSO)</span>
          </button>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-[#30363d] w-full" />
            <span className="bg-[#161b22] px-3 text-[10px] uppercase tracking-wider text-[#6e7681] font-mono">
              or credentials
            </span>
          </div>

          {/* Credentials Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#c9d1d9] flex items-center justify-between">
                <span>Admin Email</span>
                <button
                  type="button"
                  onClick={handleQuickFillHOD}
                  className="text-[10px] text-[#ff5722] hover:underline font-mono"
                >
                  Quick Fill HOD
                </button>
              </label>
              <div className="relative">
                <Mail className="size-4 text-[#6e7681] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@prepinminutes.com"
                  className="w-full bg-[#0d0f12] border border-[#30363d] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-[#484f58] focus:outline-none focus:border-emerald-500 transition"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#c9d1d9]">Password</label>
              <div className="relative">
                <Lock className="size-4 text-[#6e7681] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••••••"
                  className="w-full bg-[#0d0f12] border border-[#30363d] rounded-xl pl-9 pr-10 py-2 text-xs text-white placeholder-[#484f58] focus:outline-none focus:border-emerald-500 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6e7681] hover:text-white transition"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-semibold text-xs flex items-center justify-center space-x-2 transition shadow-lg shadow-emerald-900/30 active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? (
                <div className="size-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              ) : (
                <>
                  <span>Enter Admin Control Plane</span>
                  <ArrowRight className="size-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Root HOD Hint Box */}
          <div className="p-3 rounded-xl bg-[#0d0f12] border border-[#21262d] text-[11px] space-y-1 text-[#8b949e]">
            <div className="font-semibold text-white flex items-center space-x-1.5">
              <CheckCircle2 className="size-3.5 text-emerald-400" />
              <span>Root HOD Pre-Configured</span>
            </div>
            <p>
              Initial super-admin credentials: <code className="text-emerald-400 font-mono">imsauravsingh@gmail.com</code> / <code className="text-emerald-400 font-mono">Saurav@3063</code>
            </p>
          </div>
        </div>

        {/* Security Notice */}
        <p className="text-center text-[10px] text-[#484f58] max-w-xs mx-auto">
          Unauthorized access attempts are monitored and logged with client IP address and cryptographic audit hashes.
        </p>
      </div>
    </div>
  );
}

