"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Users2,
  Briefcase,
  Calendar,
  Building2,
  ChevronDown,
  UploadCloud,
  Clipboard,
  Lock,
  CheckCircle2,
  X,
  FileText,
  Loader2,
  AlertCircle,
  RotateCcw,
  Sparkles,
  Layers,
  Trash2,
} from "lucide-react";
import { backendApi, ApiError } from "@/lib/api-client";

export const TARGET_ROLE_CATEGORIES = [
  {
    category: "Software Engineering",
    roles: [
      "Software Engineer / SDE",
      "Frontend Engineer",
      "Backend Engineer",
      "Fullstack Engineer",
      "Mobile Engineer (iOS/Android)",
    ],
  },
  {
    category: "Data & Analytics",
    roles: [
      "Data Analyst",
      "Data Engineer",
      "Business Intelligence Engineer",
    ],
  },
  {
    category: "Cloud & DevOps",
    roles: [
      "DevOps / SRE Engineer",
      "Cloud Infrastructure Engineer",
      "Platform Engineer",
    ],
  },
  {
    category: "AI & Machine Learning",
    roles: [
      "AI / Machine Learning Engineer",
      "Data Scientist",
    ],
  },
  {
    category: "Quality Assurance & Systems",
    roles: [
      "QA / Automation Engineer",
      "System Architect",
      "Engineering Manager",
    ],
  },
];

export const ALL_STANDARD_ROLES = TARGET_ROLE_CATEGORIES.flatMap((c) => c.roles);

export const FRESHER_FORTE_OPTIONS = [
  "Software Engineering (DSA, Algorithms & Clean Code)",
  "Data Analytics (SQL, Excel & Visualization / PowerBI)",
  "Data Engineering (Pipelines, BigQuery & Python)",
  "Cloud & DevOps (Linux, Docker & AWS / GCP)",
  "AI / ML Fundamentals (Math, Python & Scikit / PyTorch)",
  "Fullstack Web Development (React, Node.js & APIs)",
  "QA & Test Automation (Selenium, Cypress & API Testing)",
];

export function OnboardingFormCard() {
  const router = useRouter();

  // State for form fields
  const [selectedRoleOption, setSelectedRoleOption] = useState("Software Engineer / SDE");
  const [customRole, setCustomRole] = useState("");
  const [experience, setExperience] = useState("4-5 years");
  const [fresherForte, setFresherForte] = useState(FRESHER_FORTE_OPTIONS[0]);
  const [timeline, setTimeline] = useState("1 month");
  const [company, setCompany] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [existingResumeName, setExistingResumeName] = useState<string | null>(null);
  const [isClearingResume, setIsClearingResume] = useState(false);
  const [resumeActionMessage, setResumeActionMessage] = useState<string | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [showJdModal, setShowJdModal] = useState(false);
  const [tempJd, setTempJd] = useState("");

  // Admin platform settings
  const [enableNextStepFlow, setEnableNextStepFlow] = useState(true);

  // Profile Reset modal
  const [showResetModal, setShowResetModal] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [resetSuccessMessage, setResetSuccessMessage] = useState<string | null>(null);

  // Loading & error states
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgressMsg, setUploadProgressMsg] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const isFresher = experience.startsWith("0 years");

  // 1. Pre-fill with existing candidate profile data & platform config
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        // Fetch platform settings in parallel
        backendApi
          .getPlatformConfig()
          .then((cfg) => {
            if (isMounted && typeof cfg.enableNextStepFlow === "boolean") {
              setEnableNextStepFlow(cfg.enableNextStepFlow);
            }
          })
          .catch((err) => console.warn("Failed to fetch platform config:", err));

        const res = await backendApi.getProfile();
        if (!isMounted) return;

        if (res.profile) {
          if (res.profile.targetRole) {
            const roleStr = String(res.profile.targetRole);
            if (ALL_STANDARD_ROLES.includes(roleStr)) {
              setSelectedRoleOption(roleStr);
            } else {
              setSelectedRoleOption("custom");
              setCustomRole(roleStr);
            }
          }
          if (res.profile.experienceLevel) {
            setExperience(String(res.profile.experienceLevel));
          }
          if (res.profile.fresherForte) {
            setFresherForte(String(res.profile.fresherForte));
          }
          if (res.profile.timelineLabel) {
            setTimeline(String(res.profile.timelineLabel));
          }
          if (
            Array.isArray(res.profile.targetCompanies) &&
            res.profile.targetCompanies.length > 0
          ) {
            setCompany(res.profile.targetCompanies.join(", "));
          }
          if (res.profile.jobDescriptionText) {
            setJobDescription(String(res.profile.jobDescriptionText));
          }
          if (res.profile.resumeFileName) {
            setExistingResumeName(String(res.profile.resumeFileName));
          }
        } else if (res.activePlan) {
          if (res.activePlan.targetRole) {
            const roleStr = String(res.activePlan.targetRole);
            if (ALL_STANDARD_ROLES.includes(roleStr)) {
              setSelectedRoleOption(roleStr);
            } else {
              setSelectedRoleOption("custom");
              setCustomRole(roleStr);
            }
          }
          if (res.activePlan.timelineLabel) {
            setTimeline(String(res.activePlan.timelineLabel));
          }
          if (
            Array.isArray(res.activePlan.targetCompanies) &&
            res.activePlan.targetCompanies.length > 0
          ) {
            setCompany(res.activePlan.targetCompanies.join(", "));
          }
        }
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          router.replace("/login?redirect=/dashboard");
          return;
        }
        console.warn("Could not pre-load candidate profile:", err);
      } finally {
        if (isMounted) {
          setIsInitialLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
      setExistingResumeName(null);
      setResumeActionMessage(null);
    }
  };

  const handleClearResume = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    // Reset freshly picked file input
    setResumeFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    // If an existing resume is already persisted on profile, clear it on backend
    if (existingResumeName) {
      setIsClearingResume(true);
      try {
        await backendApi.deleteResume();
        setExistingResumeName(null);
        setResumeActionMessage("Resume cleared. You can proceed without a resume.");
        setTimeout(() => setResumeActionMessage(null), 3500);
      } catch (err) {
        console.warn("Could not delete resume on server:", err);
        // Optimistically clear locally so candidate is not blocked
        setExistingResumeName(null);
      } finally {
        setIsClearingResume(false);
      }
    } else {
      setResumeActionMessage(null);
    }
  };

  const handleSaveJd = () => {
    setJobDescription(tempJd.trim());
    setShowJdModal(false);
  };

  const handleResetProfile = async () => {
    setIsResetting(true);
    try {
      await backendApi.resetProfile();
      setSelectedRoleOption("Software Engineer / SDE");
      setCustomRole("");
      setExperience("4-5 years");
      setFresherForte(FRESHER_FORTE_OPTIONS[0]);
      setTimeline("1 month");
      setCompany("");
      setResumeFile(null);
      setExistingResumeName(null);
      setJobDescription("");
      setShowResetModal(false);
      setResetSuccessMessage("Your profile and preparation plan draft have been reset successfully.");
      setTimeout(() => setResetSuccessMessage(null), 4000);
    } catch (err) {
      console.error("Failed to reset profile:", err);
      setErrorMessage("Failed to reset profile. Please try again.");
    } finally {
      setIsResetting(false);
    }
  };

  const handleSubmitSetup = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isSubmitting) return;

    const finalTargetRole =
      selectedRoleOption === "custom"
        ? customRole.trim()
        : selectedRoleOption.trim();

    if (!finalTargetRole) {
      setErrorMessage("Please select or enter your target role.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setUploadProgressMsg(null);

    try {
      // Step A: Save Profile & Active Plan Draft
      setUploadProgressMsg("Saving your setup details...");
      const targetCompanies = company
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean);

      await backendApi.saveProfile({
        targetRole: finalTargetRole,
        experienceLevel: experience,
        fresherForte: isFresher ? fresherForte : null,
        timelineLabel: timeline,
        targetCompanies,
        jobDescriptionText: jobDescription.trim() || null,
      });

      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(
            "pim_profile_cache",
            JSON.stringify({
              targetRole: finalTargetRole,
              experienceLevel: experience,
              fresherForte: isFresher ? fresherForte : null,
              timelineLabel: timeline,
              targetCompanies,
              completedActivities: 0,
              completedDays: 0,
              readinessScore: 0,
            })
          );
        } catch {}
      }

      // Step B: Upload Resume if a new file was attached
      if (resumeFile) {
        setUploadProgressMsg("Processing resume and generating AI embeddings...");
        try {
          await backendApi.uploadResume(resumeFile);
        } catch (resumeErr: unknown) {
          console.warn("Resume upload failed, but profile saved:", resumeErr);
        }
      }

      // Step C: Route based on Admin platform flag
      if (!enableNextStepFlow) {
        setUploadProgressMsg("Synthesizing your personalized preparation plan...");
        try {
          await backendApi.generatePlan({});
        } catch (planErr) {
          console.warn("Direct plan generation warning:", planErr);
        }
        router.push("/dashboard?step=3");
      } else {
        router.push("/dashboard/plan-ready");
      }
    } catch (err: unknown) {
      if (err instanceof ApiError && err.status === 401) {
        router.replace("/login?redirect=/dashboard");
        return;
      }
      console.error("Setup submission failed:", err);
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Failed to save your setup. Please try again."
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex w-full flex-col gap-6 rounded-[20px] sm:rounded-3xl border-[1.5px] border-[#ff6c47] bg-white p-6 sm:p-8 shadow-[0_8px_30px_rgba(255,108,71,0.06)] relative">
      {/* Loading overlay for initial fetch */}
      {isInitialLoading && (
        <div className="absolute inset-0 bg-white/70 backdrop-blur-2xs z-10 flex items-center justify-center rounded-[20px] sm:rounded-3xl">
          <div className="flex items-center gap-2.5 text-ink text-sm font-medium">
            <Loader2 className="size-5 animate-spin text-brand" />
            <span>Loading your setup preferences...</span>
          </div>
        </div>
      )}

      {/* 1. Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-1 border-b border-[#f4efe8]">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="font-display text-xl sm:text-[22px] font-extrabold text-ink">
              What are you preparing for?
            </h2>
            <span className="rounded-full bg-[#fff0ec] px-2.5 py-0.5 text-[10px] font-bold text-brand">
              * Required
            </span>
          </div>
          <p className="text-xs sm:text-sm text-ink-muted">
            Tell us a few details so we can create your personalized plan. You can
            always update or reset this anytime.
          </p>
        </div>

        {/* Reset Profile Action */}
        <button
          type="button"
          onClick={() => setShowResetModal(true)}
          className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-full border border-[#ede6db] bg-[#fbf9f4] px-3.5 py-1.5 text-xs font-semibold text-ink shadow-2xs hover:bg-[#fff0ec] hover:border-brand/40 hover:text-brand transition-all cursor-pointer shrink-0"
        >
          <RotateCcw className="size-3 text-ink-muted" />
          <span>Reset Profile & Re-evaluate</span>
        </button>
      </div>

      {/* Success Banner */}
      {resetSuccessMessage && (
        <div className="flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs sm:text-sm text-emerald-800 animate-in fade-in">
          <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
          <span>{resetSuccessMessage}</span>
        </div>
      )}

      {/* Error Banner */}
      {errorMessage && (
        <div className="flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs sm:text-sm text-red-700">
          <AlertCircle className="size-4 shrink-0 text-red-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* 2. Required Fields Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Field 1: Target Role Dropdown */}
        <div className="flex flex-col gap-1.5">
          <label className="flex items-center gap-1 font-sans text-[11px] font-bold uppercase tracking-[0.5px] text-[#1e1c1a] leading-normal">
            <span>Target Role</span>
            <span className="text-brand">*</span>
          </label>
          <div className="relative flex h-10 w-full items-center justify-between rounded-[10px] border border-[#ede6db] bg-white px-3 text-sm text-ink focus-within:border-brand focus-within:ring-1 focus-within:ring-brand/20 transition-all">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Users2 className="size-4 shrink-0 text-[#6b6661]" />
              <select
                value={selectedRoleOption}
                onChange={(e) => setSelectedRoleOption(e.target.value)}
                disabled={isSubmitting}
                className="w-full bg-transparent text-sm text-ink outline-none appearance-none cursor-pointer disabled:opacity-60 truncate"
              >
                {TARGET_ROLE_CATEGORIES.map((cat) => (
                  <optgroup key={cat.category} label={`── ${cat.category} ──`}>
                    {cat.roles.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </optgroup>
                ))}
                <option value="custom">── Other / Custom Role ──</option>
              </select>
            </div>
            <ChevronDown className="size-3.5 shrink-0 text-[#6b6661] pointer-events-none" />
          </div>

          {/* Conditional Custom Role Input */}
          {selectedRoleOption === "custom" && (
            <input
              type="text"
              value={customRole}
              onChange={(e) => setCustomRole(e.target.value)}
              placeholder="Enter custom role title..."
              disabled={isSubmitting}
              className="mt-1 h-9 w-full rounded-[8px] border border-brand/50 bg-[#fff9f6] px-3 text-xs sm:text-sm text-ink outline-none placeholder:text-[#b0a898] focus:border-brand"
            />
          )}

          <span className="font-sans text-[11px] font-normal text-[#b0a898] leading-normal">
            Select your target career track or specify custom.
          </span>
        </div>

        {/* Field 2: Years of Experience */}
        <div className="flex flex-col gap-1.5">
          <label className="flex items-center gap-1 font-sans text-[11px] font-bold uppercase tracking-[0.5px] text-[#1e1c1a] leading-normal">
            <span>Years of Experience</span>
            <span className="text-brand">*</span>
          </label>
          <div className="relative flex h-10 w-full items-center justify-between rounded-[10px] border border-[#ede6db] bg-white px-3 text-sm text-ink focus-within:border-brand focus-within:ring-1 focus-within:ring-brand/20 transition-all">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Briefcase className="size-4 shrink-0 text-[#6b6661]" />
              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                disabled={isSubmitting}
                className="w-full bg-transparent text-sm text-ink outline-none appearance-none cursor-pointer disabled:opacity-60"
              >
                <option value="0 years (Fresher / Student)">Fresher / Student (0 years)</option>
                <option value="1-3 years">1-3 years (Junior / Mid level)</option>
                <option value="4-5 years">4-5 years (Senior)</option>
                <option value="6-8 years">6-8 years (Lead)</option>
                <option value="8+ years">8+ years (Staff / Principal)</option>
              </select>
            </div>
            <ChevronDown className="size-3.5 shrink-0 text-[#6b6661] pointer-events-none" />
          </div>
          <span className="font-sans text-[11px] font-normal text-[#b0a898] leading-normal">
            {isFresher
              ? "Fresher mode unlocks entry-level forte specialization."
              : "Helps us calibrate interview depth and problem sets."}
          </span>
        </div>

        {/* Field 3: Prep Timeline */}
        <div className="flex flex-col gap-1.5">
          <label className="flex items-center gap-1 font-sans text-[11px] font-bold uppercase tracking-[0.5px] text-[#1e1c1a] leading-normal">
            <span>Prep Timeline</span>
            <span className="text-brand">*</span>
          </label>
          <div className="relative flex h-10 w-full items-center justify-between rounded-[10px] border border-[#ede6db] bg-white px-3 text-sm text-ink focus-within:border-brand focus-within:ring-1 focus-within:ring-brand/20 transition-all">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Calendar className="size-4 shrink-0 text-[#6b6661]" />
              <select
                value={timeline}
                onChange={(e) => setTimeline(e.target.value)}
                disabled={isSubmitting}
                className="w-full bg-transparent text-sm text-ink outline-none appearance-none cursor-pointer disabled:opacity-60"
              >
                <option value="1-2 weeks">1-2 weeks (Express)</option>
                <option value="1 month">1 month (Standard)</option>
                <option value="2-3 months">2-3 months (Thorough)</option>
                <option value="3+ months">3+ months (Comprehensive)</option>
              </select>
            </div>
            <ChevronDown className="size-3.5 shrink-0 text-[#6b6661] pointer-events-none" />
          </div>
          <span className="font-sans text-[11px] font-normal text-[#b0a898] leading-normal">
            How much time do you have to prepare?
          </span>
        </div>
      </div>

      {/* Fresher Forte / Specialization Track (Visible only when experience is Fresher) */}
      {isFresher && (
        <div className="flex flex-col gap-2 rounded-xl border border-brand/30 bg-[#fff9f6] p-4 animate-in fade-in">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-1.5 font-sans text-xs font-bold uppercase tracking-[0.5px] text-brand">
              <Sparkles className="size-3.5 text-brand" />
              <span>Fresher Target Forte / Specialization</span>
              <span className="text-brand">*</span>
            </label>
            <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-bold text-brand">
              Fresher Forte
            </span>
          </div>
          <p className="text-xs text-ink-muted">
            As a fresher, what specific domain or career forte do you want to break into? Your preparation curriculum and mock scenarios will focus on this domain.
          </p>
          <div className="relative flex h-10 w-full items-center justify-between rounded-[10px] border border-brand/40 bg-white px-3 text-sm text-ink focus-within:ring-1 focus-within:ring-brand/30">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Layers className="size-4 shrink-0 text-brand" />
              <select
                value={fresherForte}
                onChange={(e) => setFresherForte(e.target.value)}
                disabled={isSubmitting}
                className="w-full bg-transparent text-xs sm:text-sm text-ink font-medium outline-none appearance-none cursor-pointer"
              >
                {FRESHER_FORTE_OPTIONS.map((forte) => (
                  <option key={forte} value={forte}>
                    {forte}
                  </option>
                ))}
              </select>
            </div>
            <ChevronDown className="size-3.5 shrink-0 text-brand pointer-events-none" />
          </div>
        </div>
      )}

      {/* 3. Target Company (Full Width) */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <label className="font-sans text-[11px] font-bold uppercase tracking-[0.5px] text-[#1e1c1a] leading-normal">
            Target Company
          </label>
          <span className="rounded-full bg-[#f0f9ff] px-2 py-0.5 text-[10px] font-semibold text-[#0284c7]">
            Optional
          </span>
        </div>
        <div className="relative flex h-10 w-full items-center justify-between rounded-[10px] border border-[#ede6db] bg-[#fbf9f4] px-3 text-sm text-ink focus-within:bg-white focus-within:border-brand focus-within:ring-1 focus-within:ring-brand/20 transition-all">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Building2 className="size-4 shrink-0 text-[#b0a898]" />
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              disabled={isSubmitting}
              placeholder="e.g. Google, Amazon, Microsoft, Swiggy"
              className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-[#b0a898] disabled:opacity-60"
            />
          </div>
        </div>
        <span className="font-sans text-[11px] font-normal text-[#b0a898] leading-normal">
          Add target companies to get company-specific questions and insights. Or leave blank for general preparation.
        </span>
      </div>

      {/* 4. Upload Fields Row (Resume & Job Description) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Resume Dropzone */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <label className="font-sans text-[11px] font-bold uppercase tracking-[0.5px] text-[#1e1c1a] leading-normal">
                Resume
              </label>
              <span className="rounded-full bg-[#f0f9ff] px-2 py-0.5 text-[10px] font-semibold text-[#0284c7]">
                Optional
              </span>
            </div>
            {(resumeFile || existingResumeName) && (
              <button
                type="button"
                onClick={handleClearResume}
                disabled={isClearingResume}
                className="flex items-center gap-1 text-[11px] font-medium text-red-600 hover:text-red-700 hover:underline transition-colors disabled:opacity-50"
              >
                {isClearingResume ? (
                  <Loader2 className="size-3 animate-spin" />
                ) : (
                  <Trash2 className="size-3" />
                )}
                <span>Clear Resume</span>
              </button>
            )}
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,.docx"
            className="hidden"
          />

          <div
            onClick={() => fileInputRef.current?.click()}
            className="group relative flex flex-col items-center justify-center gap-1.5 rounded-[10px] border border-[#ede6db] bg-[#fbf9f4] p-4 text-center cursor-pointer transition-all hover:border-brand/40 hover:bg-[#fff9f6]"
          >
            {resumeFile ? (
              <div className="flex w-full items-center justify-between px-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#10b981] min-w-0">
                  <CheckCircle2 className="size-4 shrink-0 text-[#10b981]" />
                  <span className="truncate max-w-[200px] sm:max-w-[240px]">
                    {resumeFile.name}
                  </span>
                  <span className="text-[10px] text-ink-muted font-normal shrink-0">
                    (Ready to upload)
                  </span>
                </div>
                <button
                  type="button"
                  title="Remove selected file"
                  onClick={handleClearResume}
                  className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                >
                  <X className="size-3.5" />
                  <span className="text-[11px] font-medium">Remove</span>
                </button>
              </div>
            ) : existingResumeName ? (
              <div className="flex w-full items-center justify-between px-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#10b981] min-w-0">
                  <CheckCircle2 className="size-4 shrink-0 text-[#10b981]" />
                  <span className="truncate max-w-[180px] sm:max-w-[240px]">
                    {existingResumeName}
                  </span>
                  <span className="text-[10px] text-ink-muted font-normal shrink-0 hidden sm:inline">
                    (Attached)
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-[10px] text-brand font-medium group-hover:underline hidden sm:inline">
                    Change
                  </span>
                  <button
                    type="button"
                    title="Clear existing resume"
                    disabled={isClearingResume}
                    onClick={handleClearResume}
                    className="flex items-center gap-1 rounded-md bg-white border border-red-200 px-2 py-1 text-xs text-red-600 hover:bg-red-50 hover:border-red-300 transition-all shadow-2xs disabled:opacity-50"
                  >
                    {isClearingResume ? (
                      <Loader2 className="size-3 animate-spin" />
                    ) : (
                      <Trash2 className="size-3" />
                    )}
                    <span className="text-[11px] font-medium">Remove</span>
                  </button>
                </div>
              </div>
            ) : (
              <>
                <UploadCloud className="size-6 text-[#b0a898]" />
                <span className="font-sans text-[13px] font-semibold text-[#1e1c1a] leading-normal">
                  Upload Resume
                </span>
                <span className="font-sans text-[11px] font-normal text-[#b0a898] leading-normal">
                  PDF or DOCX up to 10MB
                </span>
              </>
            )}
          </div>

          {resumeActionMessage && (
            <p className="text-[11px] font-medium text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="size-3" />
              <span>{resumeActionMessage}</span>
            </p>
          )}

          <span className="font-sans text-[11px] font-normal text-[#b0a898] leading-normal">
            We extract your experience to recommend the best starting difficulty. If skipped, we use your selected role and experience level.
          </span>
        </div>

        {/* Job Description */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <label className="font-sans text-[11px] font-bold uppercase tracking-[0.5px] text-[#1e1c1a] leading-normal">
              Job Description (JD)
            </label>
            <span className="rounded-full bg-[#f0f9ff] px-2 py-0.5 text-[10px] font-semibold text-[#0284c7]">
              Optional
            </span>
          </div>

          <div
            onClick={() => {
              setTempJd(jobDescription);
              setShowJdModal(true);
            }}
            className="flex flex-col items-center justify-center gap-1.5 rounded-[10px] border border-[#ede6db] bg-[#fbf9f4] p-4 text-center cursor-pointer transition-all hover:border-brand/40 hover:bg-[#fff9f6]"
          >
            {jobDescription ? (
              <div className="flex items-center gap-2 text-xs font-semibold text-[#10b981]">
                <FileText className="size-4 text-[#10b981]" />
                <span>
                  JD attached ({jobDescription.split(/\s+/).length} words)
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setJobDescription("");
                  }}
                  className="text-[#6b6661] hover:text-red-500"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            ) : (
              <>
                <Clipboard className="size-6 text-[#b0a898]" />
                <span className="font-sans text-[13px] font-semibold text-[#1e1c1a] leading-normal">
                  Paste JD
                </span>
                <span className="font-sans text-[11px] font-normal text-[#b0a898] leading-normal">
                  Text format
                </span>
              </>
            )}
          </div>
          <span className="font-sans text-[11px] font-normal text-[#b0a898] leading-normal">
            Add the JD to focus preparation on the exact skills and responsibilities required.
          </span>
        </div>
      </div>

      {/* 5. CTA Area */}
      <div className="flex flex-col gap-3.5 pt-2">
        <div className="flex flex-wrap items-center gap-4 sm:gap-5">
          <button
            type="button"
            onClick={() => handleSubmitSetup()}
            disabled={isSubmitting}
            className="flex items-center justify-center gap-2 rounded-full bg-brand px-8 py-3 text-[15px] font-semibold text-white shadow-[0_4px_12px_rgba(255,108,71,0.2)] transition-opacity hover:opacity-95 active:scale-[0.99] disabled:opacity-60 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>{uploadProgressMsg || "Saving your plan..."}</span>
              </>
            ) : enableNextStepFlow ? (
              <span>Next Step: Assessment →</span>
            ) : (
              <span>Create My Preparation Plan →</span>
            )}
          </button>
          <Link
            href="/dashboard/plan-ready"
            className="text-sm font-medium text-[#6b6661] hover:text-ink hover:underline"
          >
            Skip for now
          </Link>
        </div>

        {/* Security assurance */}
        <div className="flex items-center gap-1.5 font-sans text-[11px] font-normal text-[#b0a898] leading-normal">
          <Lock className="size-3 text-[#b0a898]" />
          <span>
            Your information is secure and only used to personalize your
            preparation plan.
          </span>
        </div>
      </div>

      {/* MODAL: Reset Profile Confirmation */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="flex w-full max-w-md flex-col rounded-2xl border border-[#ede6db] bg-white p-6 shadow-xl gap-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
                <RotateCcw className="size-5" />
              </div>
              <div className="flex flex-col">
                <h3 className="font-display font-bold text-base text-ink">
                  Reset Profile & Re-evaluate?
                </h3>
                <span className="text-xs text-ink-muted">
                  Clear setup and start fresh
                </span>
              </div>
            </div>

            <p className="text-xs text-ink-muted leading-relaxed">
              Are you sure you want to reset your candidate profile? This will archive your active draft preparation plan, clear your target role and resume attachments, and allow you to re-evaluate fresh with updated information.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                disabled={isResetting}
                className="rounded-full border border-[#ede6db] px-4 py-2 text-xs font-semibold text-ink hover:bg-[#faf6f0] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResetProfile}
                disabled={isResetting}
                className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-red-700 disabled:opacity-50 cursor-pointer"
              >
                {isResetting && <Loader2 className="size-3.5 animate-spin" />}
                <span>Yes, Reset Profile</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Paste Job Description */}
      {showJdModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="flex w-full max-w-lg flex-col rounded-2xl border border-[#ede6db] bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#f4efe8]">
              <div className="flex items-center gap-2">
                <Clipboard className="size-5 text-brand" />
                <h3 className="text-base font-bold text-ink">
                  Paste Job Description
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowJdModal(false)}
                className="text-[#6b6661] hover:text-ink"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="py-4">
              <p className="text-xs text-ink-muted mb-2">
                Paste the responsibilities, requirements, or qualifications from
                the job posting to align mock scenarios with this role.
              </p>
              <textarea
                value={tempJd}
                onChange={(e) => setTempJd(e.target.value)}
                placeholder="Responsibilities:&#10;• Design scalable microservices...&#10;• Collaborate with cross-functional teams...&#10;&#10;Qualifications:&#10;• 5+ years experience with distributed systems..."
                rows={8}
                className="w-full rounded-xl border border-[#ede6db] p-3 text-sm text-ink outline-none focus:border-brand focus:ring-1 focus:ring-brand"
              />
            </div>
            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowJdModal(false)}
                className="rounded-xl border border-[#ede6db] px-4 py-2 text-xs font-semibold text-[#6b6661] hover:bg-[#faf6f0]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveJd}
                className="rounded-xl bg-brand px-5 py-2 text-xs font-semibold text-white hover:bg-[#fa552b]"
              >
                Save JD
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
