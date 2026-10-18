"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BrandMark } from "@/components/BrandMark";
import { backendApi } from "@/lib/api-client";
import { useAppAuth } from "@/components/providers/AuthProvider";
import {
  Mail,
  Lock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  KeyRound,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAppAuth();

  // Multi-step state: "request" -> "reset" -> "success"
  const [step, setStep] = useState<"request" | "reset" | "success">("request");

  // Form inputs
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Status & feedback state
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [devOtpNotice, setDevOtpNotice] = useState<string | null>(null);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  // If candidate is already signed in, redirect to dashboard
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace("/dashboard");
    }
  }, [isLoaded, isSignedIn, router]);

  // Countdown timer for resending OTP
  useEffect(() => {
    if (cooldownSeconds <= 0) return;
    const interval = setInterval(() => {
      setCooldownSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldownSeconds]);

  // Password validation checks
  const hasMinLength = newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasLowercase = /[a-z]/.test(newPassword);
  const hasNumber = /\d/.test(newPassword);
  const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);
  const isPasswordValid =
    hasMinLength && hasUppercase && hasLowercase && hasNumber && hasSpecial;

  // 1. Request Reset OTP
  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    setErrorMessage(null);
    setDevOtpNotice(null);

    try {
      const res = await backendApi.forgotPassword({
        email: email.trim().toLowerCase(),
      });

      if (res.devCode) {
        setDevOtpNotice(`Dev OTP: ${res.devCode}`);
        setCode(res.devCode);
      }

      setCooldownSeconds(60);
      setStep("reset");
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to send reset code. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Resend Reset OTP
  const handleResendCode = async () => {
    if (cooldownSeconds > 0 || isLoading) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await backendApi.forgotPassword({
        email: email.trim().toLowerCase(),
      });

      if (res.devCode) {
        setDevOtpNotice(`Dev OTP: ${res.devCode}`);
        setCode(res.devCode);
      }

      setCooldownSeconds(60);
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to resend code."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Submit New Password with OTP
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!code.trim() || code.trim().length !== 6) {
      setErrorMessage("Please enter a valid 6-digit verification code.");
      return;
    }

    if (!isPasswordValid) {
      setErrorMessage("Password does not meet the security criteria.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please re-enter.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const resetResult = await backendApi.resetPassword({
        email: email.trim().toLowerCase(),
        code: code.trim(),
        newPassword,
        confirmPassword,
      });

      if (typeof window !== "undefined" && resetResult.token) {
        localStorage.setItem("pim_auth_token", resetResult.token);
        if (resetResult.user) {
          localStorage.setItem("pim_auth_user", JSON.stringify(resetResult.user));
        }
      }

      setStep("success");
      // Auto-redirect to dashboard after 2.5 seconds
      setTimeout(() => {
        router.push("/dashboard");
      }, 2500);
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to reset password. Please check your code."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-1 flex-col items-center justify-center gap-8 bg-[#fbf9f4] px-4 py-12">
      {/* Brand Header */}
      <Link href="/" className="flex items-center gap-3 group">
        <BrandMark />
        <div className="flex flex-col gap-0.5 text-left">
          <p className="font-display text-xl font-extrabold text-ink group-hover:text-brand transition-colors">
            PrepInMinutes
          </p>
          <span className="text-[11px] font-medium tracking-wide text-ink-muted">
            Interview Mastery Platform
          </span>
        </div>
      </Link>

      {/* Main Card */}
      <div className="w-full max-w-[420px] rounded-2xl border border-line bg-white p-7 text-center shadow-sm">
        {/* STEP 1: REQUEST RESET CODE */}
        {step === "request" && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1.5 items-center">
              <div className="flex size-11 items-center justify-center rounded-xl bg-[#fff1ed] text-brand mb-1">
                <KeyRound className="size-5" />
              </div>
              <h1 className="font-display text-2xl font-bold tracking-tight text-ink">
                Forgot password?
              </h1>
              <p className="text-xs text-ink-muted leading-relaxed">
                Enter your candidate email address and we&apos;ll send you a 6-digit code to reset your password.
              </p>
            </div>

            {errorMessage && (
              <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3 text-left text-xs text-red-700">
                <AlertCircle className="size-4 shrink-0 mt-0.5 text-red-600" />
                <p className="leading-snug">{errorMessage}</p>
              </div>
            )}

            <form onSubmit={handleRequestReset} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5 text-left">
                <label htmlFor="email" className="text-xs font-semibold text-ink">
                  Account Email
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-ink-muted">
                    <Mail className="size-4" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="e.g. candidate@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className="w-full rounded-xl border border-line bg-white pl-10 pr-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted/60 transition-colors focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/10 disabled:opacity-60"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !email.trim()}
                className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-[#ff552b] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? (
                  <div className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <span>Send Reset Code</span>
                    <ArrowRight className="size-4" />
                  </>
                )}
              </button>
            </form>

            <div className="border-t border-line/70 pt-4">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-muted hover:text-ink transition-colors"
              >
                <ArrowLeft className="size-3.5" />
                <span>Back to sign in</span>
              </Link>
            </div>
          </div>
        )}

        {/* STEP 2: VERIFY CODE & SET NEW PASSWORD */}
        {step === "reset" && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1.5 items-center">
              <div className="flex size-11 items-center justify-center rounded-xl bg-[#fff1ed] text-brand mb-1">
                <Lock className="size-5" />
              </div>
              <h1 className="font-display text-2xl font-bold tracking-tight text-ink">
                Create new password
              </h1>
              <p className="text-xs text-ink-muted leading-relaxed">
                Code sent to <span className="font-semibold text-ink">{email}</span>.{" "}
                <button
                  type="button"
                  onClick={() => {
                    setStep("request");
                    setErrorMessage(null);
                  }}
                  className="text-brand hover:underline"
                >
                  Change
                </button>
              </p>
            </div>

            {devOtpNotice && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-2.5 text-xs text-amber-900 font-mono text-center">
                {devOtpNotice}
              </div>
            )}

            {errorMessage && (
              <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3 text-left text-xs text-red-700">
                <AlertCircle className="size-4 shrink-0 mt-0.5 text-red-600" />
                <p className="leading-snug">{errorMessage}</p>
              </div>
            )}

            <form onSubmit={handleResetPassword} className="flex flex-col gap-4 text-left">
              {/* 6-Digit Code */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="code" className="text-xs font-semibold text-ink">
                    6-Digit Verification Code
                  </label>
                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={cooldownSeconds > 0 || isLoading}
                    className="flex items-center gap-1 text-[11px] font-semibold text-brand hover:underline disabled:opacity-50 disabled:no-underline"
                  >
                    <RefreshCw className="size-3" />
                    <span>
                      {cooldownSeconds > 0
                        ? `Resend in ${cooldownSeconds}s`
                        : "Resend code"}
                    </span>
                  </button>
                </div>
                <input
                  id="code"
                  name="code"
                  type="text"
                  maxLength={6}
                  required
                  placeholder="123456"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                  disabled={isLoading}
                  className="w-full text-center tracking-[8px] font-mono font-bold rounded-xl border border-line bg-white px-3.5 py-2.5 text-lg text-ink placeholder:text-ink-muted/40 transition-colors focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/10 disabled:opacity-60"
                />
              </div>

              {/* New Password */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="newPassword" className="text-xs font-semibold text-ink">
                  New Password
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-ink-muted">
                    <Lock className="size-4" />
                  </div>
                  <input
                    id="newPassword"
                    name="newPassword"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={isLoading}
                    className="w-full rounded-xl border border-line bg-white pl-10 pr-10 py-2.5 text-sm text-ink placeholder:text-ink-muted/60 transition-colors focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/10 disabled:opacity-60"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-ink-muted hover:text-ink transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="confirmPassword" className="text-xs font-semibold text-ink">
                  Confirm New Password
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-ink-muted">
                    <Lock className="size-4" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    placeholder="Re-enter new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isLoading}
                    className="w-full rounded-xl border border-line bg-white pl-10 pr-10 py-2.5 text-sm text-ink placeholder:text-ink-muted/60 transition-colors focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/10 disabled:opacity-60"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-ink-muted hover:text-ink transition-colors"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              {/* Realtime Password Criteria Checklist */}
              {newPassword.length > 0 && (
                <div className="grid grid-cols-2 gap-1.5 rounded-xl border border-line/60 bg-[#fbf9f4] p-3 text-[11px]">
                  <span className={`flex items-center gap-1.5 ${hasMinLength ? "text-emerald-600 font-medium" : "text-ink-muted"}`}>
                    <CheckCircle2 className={`size-3.5 ${hasMinLength ? "text-emerald-500" : "text-ink-muted/40"}`} />
                    8+ characters
                  </span>
                  <span className={`flex items-center gap-1.5 ${hasUppercase ? "text-emerald-600 font-medium" : "text-ink-muted"}`}>
                    <CheckCircle2 className={`size-3.5 ${hasUppercase ? "text-emerald-500" : "text-ink-muted/40"}`} />
                    1 uppercase letter
                  </span>
                  <span className={`flex items-center gap-1.5 ${hasLowercase ? "text-emerald-600 font-medium" : "text-ink-muted"}`}>
                    <CheckCircle2 className={`size-3.5 ${hasLowercase ? "text-emerald-500" : "text-ink-muted/40"}`} />
                    1 lowercase letter
                  </span>
                  <span className={`flex items-center gap-1.5 ${hasNumber && hasSpecial ? "text-emerald-600 font-medium" : "text-ink-muted"}`}>
                    <CheckCircle2 className={`size-3.5 ${hasNumber && hasSpecial ? "text-emerald-500" : "text-ink-muted/40"}`} />
                    1 number & special
                  </span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || !isPasswordValid || newPassword !== confirmPassword || code.length !== 6}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-[#ff552b] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? (
                  <div className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <span>Reset Password & Sign In</span>
                )}
              </button>
            </form>

            <div className="border-t border-line/70 pt-4 text-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-muted hover:text-ink transition-colors"
              >
                <ArrowLeft className="size-3.5" />
                <span>Cancel and return to sign in</span>
              </Link>
            </div>
          </div>
        )}

        {/* STEP 3: SUCCESS CONFIRMATION */}
        {step === "success" && (
          <div className="flex flex-col items-center gap-5 py-4">
            <div className="flex size-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="size-8" />
            </div>
            <div className="flex flex-col gap-1.5 text-center">
              <h2 className="font-display text-2xl font-bold tracking-tight text-ink">
                Password reset complete!
              </h2>
              <p className="text-xs text-ink-muted leading-relaxed">
                Your password has been successfully updated and your account is active. Redirecting you to your preparation dashboard...
              </p>
            </div>
            <div className="mt-2 flex items-center justify-center">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 rounded-xl bg-brand px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#ff552b] transition-all"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
