"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SignUp } from "@clerk/react";
import { useAppAuth } from "@/components/providers/AuthProvider";
import { BrandMark } from "@/components/BrandMark";
import Link from "next/link";
import {
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  CheckCircle2,
  ArrowLeft,
  RotateCw,
  Sparkles,
} from "lucide-react";

function GoogleIcon({ className = "size-5" }: { className?: string }) {
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

const clerkAppearance = {
  variables: {
    colorPrimary: "#ff6c47",
    colorText: "#1e1c1a",
    colorTextSecondary: "#6b6661",
    colorBackground: "#ffffff",
    borderRadius: "12px",
    fontFamily: "var(--font-geist-sans)",
  },
  elements: {
    card: "shadow-none border border-line",
  },
};

function SignUpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirectUrl =
    searchParams.get("redirect_url") ||
    searchParams.get("redirect") ||
    "/dashboard?setup=true";
  const authToken = searchParams.get("auth_token");
  const errorParam = searchParams.get("error");
  const initialEmail = searchParams.get("email") || "";
  const initialVerify = searchParams.get("verify") === "true";

  const {
    isLoaded,
    isSignedIn,
    activeProvider,
    signInWithGoogleRedirect,
    signUpWithCredentials,
    verifyEmailOtp,
    resendVerificationOtp,
    completeOAuthCallbackToken,
  } = useAppAuth();

  // Step state: "register" | "verify"
  const [step, setStep] = useState<"register" | "verify">(
    initialVerify && initialEmail ? "verify" : "register"
  );

  // Form State
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // OTP Verification State
  const [verificationCode, setVerificationCode] = useState("");
  const [resendCooldown, setResendCooldown] = useState(initialVerify ? 60 : 0);
  const [isResending, setIsResending] = useState(false);
  const [resendSuccessMessage, setResendSuccessMessage] = useState<string | null>(null);
  const [devOtpCode, setDevOtpCode] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(
    errorParam ? "Sign-up was cancelled or encountered an error." : null
  );

  // Countdown timer for OTP resend cooldown
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // 1. Handle OAuth Callback Token (?auth_token=...)
  useEffect(() => {
    if (authToken) {
      setIsLoading(true);
      completeOAuthCallbackToken(authToken, redirectUrl).catch((err) => {
        setIsLoading(false);
        setErrorMessage(
          err instanceof Error ? err.message : "Failed to verify session token."
        );
      });
    }
  }, [authToken, redirectUrl, completeOAuthCallbackToken]);

  // 2. Redirect if already signed in
  useEffect(() => {
    if (isLoaded && isSignedIn && !authToken) {
      router.replace(redirectUrl);
    }
  }, [isLoaded, isSignedIn, authToken, redirectUrl, router]);

  // Single Google Sign-Up Action (Google users are automatically verified)
  const handleGoogleSignUp = () => {
    setIsLoading(true);
    setErrorMessage(null);
    signInWithGoogleRedirect(redirectUrl);
  };

  // Credentials Create Account Action (Requires email verification)
  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim()) {
      setErrorMessage("Please enter a username.");
      return;
    }
    if (username.trim().length < 3) {
      setErrorMessage("Username must be at least 3 characters long.");
      return;
    }
    if (!email.trim()) {
      setErrorMessage("Please enter your email address.");
      return;
    }
    if (!password) {
      setErrorMessage("Please enter a password.");
      return;
    }
    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Password and Confirm Password do not match.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await signUpWithCredentials(
        {
          username: username.trim(),
          email: email.trim().toLowerCase(),
          password,
          confirmPassword,
        },
        redirectUrl
      );

      if (result.requiresVerification) {
        setIsLoading(false);
        setStep("verify");
        setResendCooldown(60);
        setVerificationCode("");
        if (result.devCode) {
          setDevOtpCode(result.devCode);
        }
      }
    } catch (err) {
      setIsLoading(false);
      setErrorMessage(
        err instanceof Error ? err.message : "Account registration failed. Please try again."
      );
    }
  };

  // Submit 6-digit OTP verification code
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = verificationCode.trim();

    if (!cleanCode || cleanCode.length !== 6) {
      setErrorMessage("Please enter the complete 6-digit verification code.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setResendSuccessMessage(null);

    try {
      await verifyEmailOtp(email.trim().toLowerCase(), cleanCode, redirectUrl);
    } catch (err) {
      setIsLoading(false);
      setErrorMessage(
        err instanceof Error ? err.message : "Verification failed. Please check the code and try again."
      );
    }
  };

  // Resend 6-digit OTP verification code
  const handleResendOtp = async () => {
    if (resendCooldown > 0 || isResending) return;

    setIsResending(true);
    setErrorMessage(null);
    setResendSuccessMessage(null);

    try {
      const res = await resendVerificationOtp(email.trim().toLowerCase());
      setResendCooldown(60);
      setResendSuccessMessage("A fresh verification code has been sent to your email!");
      if (res.devCode) {
        setDevOtpCode(res.devCode);
      }
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to resend code. Please wait a moment and try again."
      );
    } finally {
      setIsResending(false);
    }
  };

  if (authToken || (isLoaded && isSignedIn)) {
    return (
      <div className="flex flex-col items-center gap-4 py-12">
        <div className="size-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
        <p className="text-sm font-semibold text-ink">Completing registration…</p>
      </div>
    );
  }

  // Fallback to Clerk when activeProvider is strictly "clerk"
  if (activeProvider === "clerk") {
    return (
      <SignUp
        routing="hash"
        signInUrl="/login"
        fallbackRedirectUrl={redirectUrl}
        appearance={clerkAppearance}
      />
    );
  }

  const passwordsMatch = password.length > 0 && confirmPassword.length > 0 && password === confirmPassword;
  const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  // ---------------------------------------------------------------------------
  // STEP 2: Email Verification (6-Digit OTP)
  // ---------------------------------------------------------------------------
  if (step === "verify") {
    return (
      <div className="w-full max-w-[440px] rounded-2xl sm:rounded-3xl border border-line bg-white p-7 sm:p-9 shadow-[0_8px_30px_rgba(30,28,26,0.06)] flex flex-col gap-6">
        {/* Header with Mail Badge */}
        <div className="flex flex-col gap-3 text-center items-center">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-brand/10 text-brand">
            <Mail className="size-7" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-extrabold text-ink tracking-tight">
              Verify your email
            </h1>
            <p className="mt-1 text-xs sm:text-[13px] text-ink-muted leading-relaxed">
              We sent a 6-digit verification code to
            </p>
            <p className="font-semibold text-ink text-sm mt-0.5 break-all">
              {email}
            </p>
          </div>
        </div>

        {/* Error message banner */}
        {errorMessage && (
          <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50/80 p-3 text-left text-xs text-red-700">
            <AlertCircle className="size-4 shrink-0 mt-0.5 text-red-600" />
            <p className="leading-snug">{errorMessage}</p>
          </div>
        )}

        {/* Resend success notice */}
        {resendSuccessMessage && (
          <div className="flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50/80 p-3 text-left text-xs text-emerald-700">
            <CheckCircle2 className="size-4 shrink-0 mt-0.5 text-emerald-600" />
            <p className="leading-snug">{resendSuccessMessage}</p>
          </div>
        )}

        {/* Development helper banner */}
        {devOtpCode && (
          <div className="flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50/80 px-3 py-2 text-xs text-amber-800">
            <div className="flex items-center gap-1.5 font-medium">
              <Sparkles className="size-3.5 text-amber-600" />
              <span>Dev Preview Code:</span>
            </div>
            <button
              type="button"
              onClick={() => setVerificationCode(devOtpCode)}
              className="font-mono font-bold tracking-widest text-brand bg-white px-2 py-0.5 rounded border border-amber-300 hover:bg-amber-100/50"
            >
              {devOtpCode} (click to fill)
            </button>
          </div>
        )}

        {/* OTP Input Form */}
        <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2 text-center">
            <label htmlFor="otp-input" className="text-xs font-semibold text-ink">
              Enter 6-digit code
            </label>
            <input
              id="otp-input"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              autoFocus
              autoComplete="one-time-code"
              placeholder="••••••"
              value={verificationCode}
              onChange={(e) => {
                const numericOnly = e.target.value.replace(/\D/g, "").slice(0, 6);
                setVerificationCode(numericOnly);
              }}
              disabled={isLoading}
              className="w-full text-center tracking-[0.45em] font-mono text-2xl font-bold rounded-xl border border-line bg-white py-3.5 text-ink placeholder:tracking-[0.3em] placeholder:text-ink-muted/30 transition-colors focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/10 disabled:opacity-60"
            />
          </div>

          {/* Verify & Activate Button */}
          <button
            type="submit"
            disabled={isLoading || verificationCode.length !== 6}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-[#ff552b] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? (
              <div className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <span>Verify & Activate Account</span>
            )}
          </button>
        </form>

        {/* Resend Code & Back Buttons */}
        <div className="flex flex-col gap-3 text-center border-t border-line/70 pt-4">
          <div className="flex items-center justify-center">
            {resendCooldown > 0 ? (
              <p className="text-xs text-ink-muted">
                Resend code in <span className="font-semibold text-ink">{resendCooldown}s</span>
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={isResending}
                className="flex items-center gap-1.5 text-xs font-semibold text-brand hover:underline disabled:opacity-50"
              >
                {isResending ? (
                  <RotateCw className="size-3.5 animate-spin" />
                ) : (
                  <RotateCw className="size-3.5" />
                )}
                <span>Resend verification code</span>
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              setStep("register");
              setErrorMessage(null);
            }}
            className="inline-flex items-center justify-center gap-1 text-xs text-ink-muted hover:text-ink transition-colors"
          >
            <ArrowLeft className="size-3" />
            <span>Entered wrong email? Go back</span>
          </button>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // STEP 1: Registration Form & Google Sign-Up
  // ---------------------------------------------------------------------------
  return (
    <div className="w-full max-w-[440px] rounded-2xl sm:rounded-3xl border border-line bg-white p-7 sm:p-9 shadow-[0_8px_30px_rgba(30,28,26,0.06)] flex flex-col gap-6">
      {/* Card Header */}
      <div className="flex flex-col gap-1.5 text-center items-center">
        <h1 className="font-display text-2xl font-extrabold text-ink tracking-tight">
          Create your account
        </h1>
        <p className="text-xs sm:text-[13px] text-ink-muted leading-relaxed">
          Start your personalized interview prep roadmap today.
        </p>
      </div>

      {/* Error alert banner */}
      {errorMessage && (
        <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50/80 p-3 text-left text-xs text-red-700">
          <AlertCircle className="size-4 shrink-0 mt-0.5 text-red-600" />
          <p className="leading-snug">{errorMessage}</p>
        </div>
      )}

      {/* 1. Single Google Sign-Up Button */}
      <div>
        <button
          type="button"
          onClick={handleGoogleSignUp}
          disabled={isLoading}
          className="group relative flex w-full items-center justify-center gap-3 rounded-xl border border-line bg-white px-5 py-3 text-sm font-semibold text-ink transition-all duration-150 hover:border-[#ff6c47] hover:bg-[#fff9f7] hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? (
            <div className="size-4 animate-spin rounded-full border-2 border-brand border-t-transparent" />
          ) : (
            <GoogleIcon className="size-5 shrink-0" />
          )}
          <span>Sign up with Google</span>
          <ArrowRight className="size-4 text-ink-muted transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>

      {/* Divider */}
      <div className="relative flex items-center justify-center">
        <div className="w-full border-t border-line/70" />
        <span className="absolute bg-white px-3 text-[11px] font-medium uppercase tracking-wider text-ink-muted">
          or register with credentials
        </span>
      </div>

      {/* 2. Create Account Form */}
      <form onSubmit={handleCreateAccount} className="flex flex-col gap-3.5">
        {/* Username Field */}
        <div className="flex flex-col gap-1.5 text-left">
          <label htmlFor="username" className="text-xs font-semibold text-ink">
            Username
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-ink-muted">
              <User className="size-4" />
            </div>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              className="w-full rounded-xl border border-line bg-white pl-10 pr-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted/60 transition-colors focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/10 disabled:opacity-60"
            />
          </div>
        </div>

        {/* Email Address Field */}
        <div className="flex flex-col gap-1.5 text-left">
          <label htmlFor="email" className="text-xs font-semibold text-ink">
            Email Address
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
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="w-full rounded-xl border border-line bg-white pl-10 pr-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted/60 transition-colors focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/10 disabled:opacity-60"
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="flex flex-col gap-1.5 text-left">
          <label htmlFor="password" className="text-xs font-semibold text-ink">
            Password
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-ink-muted">
              <Lock className="size-4" />
            </div>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="w-full rounded-xl border border-line bg-white pl-10 pr-10 py-2.5 text-sm text-ink placeholder:text-ink-muted/60 transition-colors focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/10 disabled:opacity-60"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-ink-muted hover:text-ink transition-colors"
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>

        {/* Confirm Password Field */}
        <div className="flex flex-col gap-1.5 text-left">
          <div className="flex items-center justify-between">
            <label htmlFor="confirmPassword" className="text-xs font-semibold text-ink">
              Confirm Password
            </label>
            {passwordsMatch && (
              <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                <CheckCircle2 className="size-3" /> Passwords match
              </span>
            )}
            {passwordsMismatch && (
              <span className="text-[11px] font-medium text-red-500">
                Passwords do not match
              </span>
            )}
          </div>
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
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
              className={`w-full rounded-xl border bg-white pl-10 pr-10 py-2.5 text-sm text-ink placeholder:text-ink-muted/60 transition-colors focus:outline-none focus:ring-2 disabled:opacity-60 ${
                passwordsMismatch
                  ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                  : "border-line focus:border-brand focus:ring-brand/10"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-ink-muted hover:text-ink transition-colors"
              tabIndex={-1}
              aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
            >
              {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>

        {/* Sign Up Button */}
        <button
          type="submit"
          disabled={isLoading || (confirmPassword.length > 0 && password !== confirmPassword)}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-[#ff552b] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? (
            <div className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <span>Sign Up</span>
          )}
        </button>
      </form>

      {/* Footer Navigation */}
      <div className="flex flex-col gap-3 text-center border-t border-line/70 pt-4">
        <p className="text-xs text-ink-muted">
          Already have an account?{" "}
          <Link
            href={`/login?redirect_url=${encodeURIComponent(redirectUrl)}`}
            className="font-semibold text-brand hover:underline"
          >
            Sign in
          </Link>
        </p>

        <p className="text-[11px] text-ink-muted leading-relaxed">
          By signing up, you agree to our{" "}
          <Link href="/privacy-policy" className="font-medium text-ink underline">
            Privacy Policy
          </Link>.
        </p>
      </div>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen flex-1 flex-col items-center justify-center gap-8 bg-[#fbf9f4] px-4 py-12">
      <Link href="/" className="flex items-center gap-3 group">
        <BrandMark />
        <div className="flex flex-col gap-0.5 text-left">
          <p className="font-display text-xl font-extrabold text-ink group-hover:text-brand transition-colors">
            PrepInMinutes
          </p>
          <p className="text-[11px] text-ink-muted">Get interview-ready in minutes.</p>
        </div>
      </Link>

      <Suspense
        fallback={
          <div className="flex flex-col items-center gap-3 py-12">
            <div className="size-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
            <p className="text-sm font-medium text-ink-muted">Loading sign-up…</p>
          </div>
        }
      >
        <SignUpContent />
      </Suspense>
    </div>
  );
}
