"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SignIn } from "@clerk/react";
import { useAppAuth } from "@/components/providers/AuthProvider";
import { BrandMark } from "@/components/BrandMark";
import Link from "next/link";
import { ArrowRight, AlertCircle, Eye, EyeOff, Lock, User } from "lucide-react";

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

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirectUrl =
    searchParams.get("redirect_url") ||
    searchParams.get("redirect") ||
    "/dashboard";
  const authToken = searchParams.get("auth_token");
  const errorParam = searchParams.get("error");

  const {
    isLoaded,
    isSignedIn,
    activeProvider,
    signInWithGoogleRedirect,
    signInWithCredentials,
    completeOAuthCallbackToken,
  } = useAppAuth();

  // Form State
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(
    errorParam ? "Sign-in was cancelled or encountered an error." : null
  );

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

  // Single Google Sign-In Action
  const handleGoogleLogin = () => {
    setIsLoading(true);
    setErrorMessage(null);
    signInWithGoogleRedirect(redirectUrl);
  };

  // Username & Password Sign-In Action
  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setErrorMessage("Please enter your username or email address.");
      return;
    }
    if (!password) {
      setErrorMessage("Please enter your password.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      await signInWithCredentials(identifier.trim(), password, redirectUrl);
    } catch (err) {
      setIsLoading(false);
      const isUnverified =
        (err as { code?: string })?.code === "EMAIL_NOT_VERIFIED" ||
        (err instanceof Error &&
          err.message.toLowerCase().includes("verify your email"));

      if (isUnverified) {
        const targetEmail =
          ((err as { data?: { email?: string } })?.data?.email as string) ||
          (identifier.includes("@") ? identifier.trim() : "");
        router.push(
          `/sign-up?verify=true&email=${encodeURIComponent(targetEmail)}&redirect_url=${encodeURIComponent(redirectUrl)}`
        );
        return;
      }

      setErrorMessage(
        err instanceof Error ? err.message : "Invalid username/email or password."
      );
    }
  };

  if (authToken || (isLoaded && isSignedIn)) {
    return (
      <div className="flex flex-col items-center gap-4 py-12">
        <div className="size-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
        <p className="text-sm font-semibold text-ink">Completing sign-in…</p>
      </div>
    );
  }

  // Fallback to Clerk when activeProvider is strictly "clerk"
  if (activeProvider === "clerk") {
    return (
      <SignIn
        routing="hash"
        signUpUrl="/sign-up"
        fallbackRedirectUrl={redirectUrl}
        appearance={clerkAppearance}
      />
    );
  }

  return (
    <div className="w-full max-w-[420px] rounded-2xl sm:rounded-3xl border border-line bg-white p-7 sm:p-9 shadow-[0_8px_30px_rgba(30,28,26,0.06)] flex flex-col gap-6">
      {/* Card Header */}
      <div className="flex flex-col gap-1.5 text-center items-center">
        <h1 className="font-display text-2xl font-extrabold text-ink tracking-tight">
          Welcome back
        </h1>
        <p className="text-xs sm:text-[13px] text-ink-muted leading-relaxed">
          Sign in to your account to continue your interview preparation.
        </p>
      </div>

      {/* Error alert banner */}
      {errorMessage && (
        <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50/80 p-3 text-left text-xs text-red-700">
          <AlertCircle className="size-4 shrink-0 mt-0.5 text-red-600" />
          <p className="leading-snug">{errorMessage}</p>
        </div>
      )}

      {/* 1. Single Google SSO Button */}
      <div>
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="group relative flex w-full items-center justify-center gap-3 rounded-xl border border-line bg-white px-5 py-3 text-sm font-semibold text-ink transition-all duration-150 hover:border-[#ff6c47] hover:bg-[#fff9f7] hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? (
            <div className="size-4 animate-spin rounded-full border-2 border-brand border-t-transparent" />
          ) : (
            <GoogleIcon className="size-5 shrink-0" />
          )}
          <span>Continue with Google</span>
          <ArrowRight className="size-4 text-ink-muted transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>

      {/* Divider */}
      <div className="relative flex items-center justify-center">
        <div className="w-full border-t border-line/70" />
        <span className="absolute bg-white px-3 text-[11px] font-medium uppercase tracking-wider text-ink-muted">
          or sign in with credentials
        </span>
      </div>

      {/* 2. Username / Email & Password Form */}
      <form onSubmit={handleCredentialsSubmit} className="flex flex-col gap-4">
        {/* Username or Email Input */}
        <div className="flex flex-col gap-1.5 text-left">
          <label
            htmlFor="identifier"
            className="text-xs font-semibold text-ink"
          >
            Username or Email
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-ink-muted">
              <User className="size-4" />
            </div>
            <input
              id="identifier"
              name="identifier"
              type="text"
              autoComplete="username"
              required
              placeholder="e.g. johndoe or john@example.com"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              disabled={isLoading}
              className="w-full rounded-xl border border-line bg-white pl-10 pr-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted/60 transition-colors focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/10 disabled:opacity-60"
            />
          </div>
        </div>

        {/* Password Input */}
        <div className="flex flex-col gap-1.5 text-left">
          <label
            htmlFor="password"
            className="text-xs font-semibold text-ink"
          >
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
              autoComplete="current-password"
              required
              placeholder="Enter your password"
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

        {/* Sign In Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-[#ff552b] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? (
            <div className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <span>Sign In</span>
          )}
        </button>
      </form>

      {/* Footer Navigation */}
      <div className="flex flex-col gap-3 text-center border-t border-line/70 pt-4">
        <p className="text-xs text-ink-muted">
          New to PrepInMinutes?{" "}
          <Link
            href={`/sign-up?redirect_url=${encodeURIComponent(redirectUrl)}`}
            className="font-semibold text-brand hover:underline"
          >
            Create an account
          </Link>
        </p>

        <p className="text-[11px] text-ink-muted leading-relaxed">
          By signing in, you agree to our{" "}
          <Link href="/privacy-policy" className="font-medium text-ink underline">
            Privacy Policy
          </Link>.
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
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
            <p className="text-sm font-medium text-ink-muted">Loading sign-in…</p>
          </div>
        }
      >
        <LoginContent />
      </Suspense>
    </div>
  );
}
