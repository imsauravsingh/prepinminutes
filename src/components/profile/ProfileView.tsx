"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAppAuth } from "@/components/providers/AuthProvider";
import {
  User,
  Mail,
  Lock,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Check,
  RotateCw,
  ExternalLink,
} from "lucide-react";

const PRESET_AVATARS = [
  { id: "tech-1", label: "Dev 1", url: "https://api.dicebear.com/7.x/bottts/svg?seed=Alex" },
  { id: "tech-2", label: "Dev 2", url: "https://api.dicebear.com/7.x/bottts/svg?seed=Jordan" },
  { id: "tech-3", label: "Dev 3", url: "https://api.dicebear.com/7.x/bottts/svg?seed=Morgan" },
  { id: "tech-4", label: "Dev 4", url: "https://api.dicebear.com/7.x/bottts/svg?seed=Taylor" },
  { id: "tech-5", label: "Dev 5", url: "https://api.dicebear.com/7.x/bottts/svg?seed=Casey" },
  { id: "tech-6", label: "Dev 6", url: "https://api.dicebear.com/7.x/bottts/svg?seed=Riley" },
];

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

export function ProfileView() {
  const { user, updateUserProfile, changePassword } = useAppAuth();

  // Personal Info form state
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [username, setUsername] = useState(user?.username || "");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(user?.avatarUrl || null);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  // Profile save feedback
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSuccessMessage, setProfileSuccessMessage] = useState<string | null>(null);
  const [profileErrorMessage, setProfileErrorMessage] = useState<string | null>(null);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [passwordSuccessMessage, setPasswordSuccessMessage] = useState<string | null>(null);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState<string | null>(null);

  // Sync state when user loads or updates
  useEffect(() => {
    if (user) {
      setFullName(user.fullName || "");
      setUsername(user.username || "");
      setAvatarUrl(user.avatarUrl || null);
    }
  }, [user]);

  // Derived state
  const initialFullName = user?.fullName || "";
  const initialUsername = user?.username || "";
  const initialAvatarUrl = user?.avatarUrl || null;

  const isProfileDirty =
    fullName.trim() !== initialFullName.trim() ||
    username.trim() !== initialUsername.trim() ||
    avatarUrl !== initialAvatarUrl;

  const usernameValid =
    !username.trim() || /^[a-zA-Z0-9_.-]{3,30}$/.test(username.trim());
  const usernameError =
    username.trim().length > 0 && !/^[a-zA-Z0-9_.-]{3,30}$/.test(username.trim())
      ? "Username must be 3-30 characters (letters, numbers, underscores, dots, dashes)."
      : null;

  const hasPassword = Boolean(
    user?.hasPassword ?? (user?.authProvider === "credentials")
  );

  // Handle Save Personal Profile
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isProfileDirty || isSavingProfile) return;

    if (!usernameValid) {
      setProfileErrorMessage(usernameError || "Invalid username format.");
      return;
    }

    setIsSavingProfile(true);
    setProfileErrorMessage(null);
    setProfileSuccessMessage(null);

    try {
      const res = await updateUserProfile({
        fullName: fullName.trim(),
        username: username.trim() || undefined,
        avatarUrl,
      });

      setProfileSuccessMessage(res.message || "Profile updated successfully!");
      setShowAvatarPicker(false);
      setTimeout(() => setProfileSuccessMessage(null), 4000);
    } catch (err) {
      setProfileErrorMessage(
        err instanceof Error ? err.message : "Failed to update profile."
      );
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Handle Set or Change Password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSavingPassword) return;

    if (hasPassword && !currentPassword) {
      setPasswordErrorMessage("Please enter your current password.");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordErrorMessage("New password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordErrorMessage("New password and Confirm password do not match.");
      return;
    }

    setIsSavingPassword(true);
    setPasswordErrorMessage(null);
    setPasswordSuccessMessage(null);

    try {
      const res = await changePassword({
        currentPassword: hasPassword ? currentPassword : undefined,
        newPassword,
        confirmPassword,
      });

      setPasswordSuccessMessage(
        res.message ||
          (hasPassword
            ? "Password updated successfully!"
            : "Password set successfully! You can now log in using your password.")
      );
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordSuccessMessage(null), 4000);
    } catch (err) {
      setPasswordErrorMessage(
        err instanceof Error ? err.message : "Failed to update password."
      );
    } finally {
      setIsSavingPassword(false);
    }
  };

  // Avatar initials fallback
  const displayName = fullName || user?.fullName || user?.username || user?.email || "Candidate";
  const initialLetter = displayName.charAt(0).toUpperCase();

  // Member since date
  const memberSinceText = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : "Recently";

  return (
    <main className="flex flex-1 flex-col gap-7 px-4 py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-9 min-w-0 max-w-4xl">
      {/* Header with Navigation Breadcrumb */}
      <div className="flex flex-col gap-2">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-muted hover:text-ink transition-colors w-fit"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to Dashboard</span>
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
              Edit Profile
            </h1>
            <p className="text-xs sm:text-sm text-ink-muted mt-1">
              Manage your personal identity, public handle, and account security.
            </p>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* CARD 1: Identity & Avatar Card */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex flex-col gap-6 rounded-2xl sm:rounded-3xl border border-line bg-white p-6 sm:p-7 shadow-[0_4px_20px_rgba(30,28,26,0.04)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-line/60">
          <div className="flex items-center gap-4">
            {/* Avatar Display */}
            <div className="relative group size-16 sm:size-18 shrink-0">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt={displayName}
                  width={72}
                  height={72}
                  className="size-16 sm:size-18 rounded-full object-cover border-2 border-brand/20 shadow-xs"
                />
              ) : (
                <div className="flex size-16 sm:size-18 items-center justify-center rounded-full bg-brand/10 font-display text-2xl font-bold text-brand border-2 border-brand/20 shadow-xs">
                  {initialLetter}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-0.5">
              <h2 className="text-base sm:text-lg font-bold text-ink">
                {displayName}
              </h2>
              <div className="flex flex-wrap items-center gap-2 text-xs text-ink-muted">
                {username ? (
                  <span className="font-mono font-medium text-brand">@{username}</span>
                ) : (
                  <span className="text-ink-muted/70">No handle set</span>
                )}
                <span>•</span>
                <span>Member since {memberSinceText}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowAvatarPicker((prev) => !prev)}
              className="flex items-center gap-1.5 rounded-xl border border-line bg-[#faf6f0] px-3.5 py-2 text-xs font-semibold text-ink hover:bg-cream transition-colors"
            >
              <Sparkles className="size-3.5 text-brand" />
              <span>{showAvatarPicker ? "Close Presets" : "Change Avatar"}</span>
            </button>
            {avatarUrl && (
              <button
                type="button"
                onClick={() => setAvatarUrl(null)}
                className="rounded-xl border border-transparent px-3 py-2 text-xs font-medium text-ink-muted hover:text-red-500 hover:bg-red-50 transition-colors"
              >
                Reset to Initials
              </button>
            )}
          </div>
        </div>

        {/* Preset Avatar Picker Dropdown */}
        {showAvatarPicker && (
          <div className="flex flex-col gap-3 rounded-xl border border-amber-200/80 bg-amber-50/50 p-4 animate-in fade-in">
            <p className="text-xs font-semibold text-ink">
              Choose a preset avatar:
            </p>
            <div className="flex flex-wrap items-center gap-3">
              {PRESET_AVATARS.map((preset) => {
                const isSelected = avatarUrl === preset.url;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      setAvatarUrl(preset.url);
                    }}
                    className={`relative size-12 rounded-full border-2 transition-transform hover:scale-105 ${
                      isSelected
                        ? "border-brand ring-2 ring-brand/30 scale-105"
                        : "border-line bg-white hover:border-brand/40"
                    }`}
                  >
                    <Image
                      src={preset.url}
                      alt={preset.label}
                      width={48}
                      height={48}
                      className="size-full rounded-full object-cover"
                    />
                    {isSelected && (
                      <span className="absolute -bottom-1 -right-1 flex size-4 items-center justify-center rounded-full bg-brand text-white">
                        <Check className="size-2.5 stroke-[3]" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* Personal Details Form */}
        {/* ---------------------------------------------------------------- */}
        <form onSubmit={handleSaveProfile} className="flex flex-col gap-5">
          {/* Success / Error Feedback Alerts */}
          {profileSuccessMessage && (
            <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50/80 p-3 text-xs text-emerald-800">
              <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
              <span>{profileSuccessMessage}</span>
            </div>
          )}
          {profileErrorMessage && (
            <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50/80 p-3 text-xs text-red-700">
              <AlertCircle className="size-4 shrink-0 text-red-600" />
              <span>{profileErrorMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Field 1: Full Name */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="fullName" className="text-xs font-semibold text-ink">
                Full Name
              </label>
              <div className="relative flex items-center">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-ink-muted">
                  <User className="size-4" />
                </div>
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Saurav Kumar"
                  disabled={isSavingProfile}
                  className="w-full rounded-xl border border-line bg-white pl-10 pr-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted/50 transition-colors focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/10 disabled:opacity-60"
                />
              </div>
              <span className="text-[11px] text-ink-muted">
                Your primary display name across PrepInMinutes.
              </span>
            </div>

            {/* Field 2: Username */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="username" className="text-xs font-semibold text-ink">
                Username
              </label>
              <div className="relative flex items-center">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-ink-muted font-mono text-sm">
                  @
                </div>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase())}
                  placeholder="saurav22"
                  disabled={isSavingProfile}
                  className={`w-full rounded-xl border bg-white pl-8 pr-3.5 py-2.5 text-sm font-mono text-ink placeholder:text-ink-muted/50 transition-colors focus:outline-none focus:ring-2 disabled:opacity-60 ${
                    usernameError
                      ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                      : "border-line focus:border-brand focus:ring-brand/10"
                  }`}
                />
              </div>
              {usernameError ? (
                <span className="text-[11px] text-red-500 font-medium">
                  {usernameError}
                </span>
              ) : (
                <span className="text-[11px] text-ink-muted">
                  Unique handle (letters, numbers, underscores).
                </span>
              )}
            </div>
          </div>

          {/* Field 3: Email Address (Read-Only) */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-ink">
                Email Address
              </label>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                <Check className="size-2.5 stroke-[3]" /> Verified
              </span>
            </div>
            <div className="relative flex items-center">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-ink-muted">
                <Mail className="size-4" />
              </div>
              <input
                type="email"
                value={user?.email || ""}
                disabled
                readOnly
                className="w-full rounded-xl border border-line bg-[#faf6f0]/70 pl-10 pr-3.5 py-2.5 text-sm text-ink/80 select-none cursor-not-allowed"
              />
            </div>
            <span className="text-[11px] text-ink-muted">
              Primary login email address (read-only for security).
            </span>
          </div>

          {/* Save Profile Button */}
          <div className="flex items-center justify-end pt-2">
            <button
              type="submit"
              disabled={!isProfileDirty || !usernameValid || isSavingProfile}
              className="flex items-center justify-center gap-2 rounded-xl bg-brand px-6 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-[#ff552b] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSavingProfile ? (
                <>
                  <RotateCw className="size-3.5 animate-spin" />
                  <span>Saving Changes…</span>
                </>
              ) : (
                <span>Save Profile Changes</span>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* CARD 2: Security & Password Card (Active for all users) */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex flex-col gap-5 rounded-2xl sm:rounded-3xl border border-line bg-white p-6 sm:p-7 shadow-[0_4px_20px_rgba(30,28,26,0.04)]">
        <div className="flex items-center gap-2.5 pb-4 border-b border-line/60">
          <div className="flex size-9 items-center justify-center rounded-xl bg-brand/10 text-brand">
            <ShieldCheck className="size-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-ink">
              {hasPassword ? "Change Password" : "Set Account Password"}
            </h2>
            <p className="text-xs text-ink-muted">
              {hasPassword
                ? "Update your existing account password."
                : "Add a password to your account so you can log in with your email or username in addition to Google SSO."}
            </p>
          </div>
        </div>

        <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
          {passwordSuccessMessage && (
            <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50/80 p-3 text-xs text-emerald-800">
              <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
              <span>{passwordSuccessMessage}</span>
            </div>
          )}
          {passwordErrorMessage && (
            <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50/80 p-3 text-xs text-red-700">
              <AlertCircle className="size-4 shrink-0 text-red-600" />
              <span>{passwordErrorMessage}</span>
            </div>
          )}

          <div
            className={`grid grid-cols-1 ${
              hasPassword ? "sm:grid-cols-3" : "sm:grid-cols-2"
            } gap-4`}
          >
            {/* Current Password (only required if candidate already has a password) */}
            {hasPassword && (
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="currentPassword"
                  className="text-xs font-semibold text-ink"
                >
                  Current Password
                </label>
                <div className="relative">
                  <input
                    id="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    disabled={isSavingPassword}
                    className="w-full rounded-xl border border-line bg-white pl-3.5 pr-10 py-2.5 text-sm text-ink placeholder:text-ink-muted/50 transition-colors focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/10 disabled:opacity-60"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-ink-muted hover:text-ink"
                    tabIndex={-1}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* New Password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="newPassword" className="text-xs font-semibold text-ink">
                New Password
              </label>
              <div className="relative">
                <input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 8 chars"
                  disabled={isSavingPassword}
                  className="w-full rounded-xl border border-line bg-white pl-3.5 pr-10 py-2.5 text-sm text-ink placeholder:text-ink-muted/50 transition-colors focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/10 disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-ink-muted hover:text-ink"
                  tabIndex={-1}
                >
                  {showNewPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="confirmPassword"
                className="text-xs font-semibold text-ink"
              >
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  disabled={isSavingPassword}
                  className="w-full rounded-xl border border-line bg-white pl-3.5 pr-10 py-2.5 text-sm text-ink placeholder:text-ink-muted/50 transition-colors focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/10 disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-ink-muted hover:text-ink"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <span className="text-[11px] text-ink-muted">
              {hasPassword
                ? "Password must be at least 8 characters long."
                : "Setting a password enables email & password login alongside your active SSO."}
            </span>

            <button
              type="submit"
              disabled={
                (hasPassword && !currentPassword) ||
                newPassword.length < 8 ||
                newPassword !== confirmPassword ||
                isSavingPassword
              }
              className="flex items-center justify-center gap-2 rounded-xl bg-ink px-6 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-ink/90 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSavingPassword ? (
                <>
                  <RotateCw className="size-3.5 animate-spin" />
                  <span>Saving…</span>
                </>
              ) : (
                <span>{hasPassword ? "Update Password" : "Set Account Password"}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

