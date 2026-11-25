"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Briefcase,
  Calendar,
  Clock,
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
  Code2,
  Monitor,
  Server,
  Database,
  Cloud,
  MoreHorizontal,
  Check,
  Zap,
  Target,
  ArrowRight,
} from "lucide-react";
import { backendApi, ApiError } from "@/lib/api-client";
import { CODING_LANGUAGES, defaultCodingLanguage, techGroupsForRole } from "@/lib/techStack";

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

/** Most common roles get one-tap cards; the rest live under "Other Role". */
const POPULAR_ROLES = [
  "Software Engineer / SDE",
  "Frontend Engineer",
  "Backend Engineer",
  "Fullstack Engineer",
  "Data Engineer",
  "DevOps / SRE Engineer",
  "AI / Machine Learning Engineer",
];

const ROLE_ICONS: Record<string, typeof Code2> = {
  "Software Engineer / SDE": Code2,
  "Frontend Engineer": Monitor,
  "Backend Engineer": Server,
  "Fullstack Engineer": Layers,
  "Data Engineer": Database,
  "DevOps / SRE Engineer": Cloud,
  "AI / Machine Learning Engineer": Sparkles,
};

/** Experience levels; the stored value starts with the years so plans can read the level. */
const EXPERIENCE_OPTIONS = [
  { value: "0 years (Fresher / Student)", label: "Fresher", sub: "0 years" },
  { value: "0-1 years", label: "Entry Level", sub: "< 1 year" },
  { value: "1-3 years", label: "Beginner", sub: "1–3 years" },
  { value: "3-5 years", label: "Junior", sub: "3–5 years" },
  { value: "5-8 years", label: "Mid-Level", sub: "5–8 years" },
  { value: "8-10 years", label: "Senior", sub: "8–10 years" },
  { value: "10-15 years", label: "Advanced", sub: "10–15 years" },
  { value: "15-20 years", label: "Expert", sub: "15–20 years" },
  { value: "20+ years", label: "Veteran", sub: "20+ years" },
];

/** Saved experience from older setups ("4-5 years", "6-9", "8+ years") → closest level today. */
function normaliseExperience(raw: string) {
  if (EXPERIENCE_OPTIONS.some((o) => o.value === raw)) return raw;
  if (/fresher|student|^0 years/i.test(raw)) return EXPERIENCE_OPTIONS[0].value;
  const years = Number(raw.match(/\d+/)?.[0] ?? NaN);
  if (Number.isNaN(years)) return raw;
  const bounds = [0, 1, 3, 5, 8, 10, 15, 20];
  let idx = 1;
  for (let i = 0; i < bounds.length; i++) if (years >= bounds[i]) idx = i + 1;
  return EXPERIENCE_OPTIONS[Math.min(idx, EXPERIENCE_OPTIONS.length - 1)].value;
}

/** Weeks per timeline option; matches the backend's plan length. */
const TIMELINE_OPTIONS = [
  { value: "1-2 weeks", label: "1–2 wks", weeks: 2 },
  { value: "1 month", label: "1 month", weeks: 4 },
  { value: "2-3 months", label: "2–3 months", weeks: 10 },
  { value: "3+ months", label: "3+ months", weeks: 16 },
];

/** Weekly study time; the stored value is the range midpoint. */
const HOURS_OPTIONS = [
  { value: 2.5, label: "2–3 hrs" },
  { value: 5, label: "4–6 hrs" },
  { value: 8.5, label: "7–10 hrs" },
  { value: 12, label: "10+ hrs" },
];
const DEFAULT_WEEKLY_HOURS = 5;

/** Closest hours option for a saved value (older profiles default to 6). */
function nearestHours(value: number) {
  return HOURS_OPTIONS.reduce((best, o) =>
    Math.abs(o.value - value) < Math.abs(best.value - value) ? o : best,
  ).value;
}

function Chip({
  selected,
  onClick,
  disabled,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-[13.5px] font-semibold transition-colors disabled:opacity-60 cursor-pointer ${
        selected
          ? "border-brand bg-brand text-white shadow-[0_4px_10px_rgba(255,108,71,0.25)]"
          : "border-[#ede6db] bg-white text-ink hover:border-brand/50 hover:bg-[#fff7f3]"
      }`}
    >
      {children}
    </button>
  );
}

const sectionLabel = "font-display text-[16px] font-extrabold text-ink";

function RoleCard({
  icon: Icon,
  label,
  selected,
  onClick,
  disabled,
}: {
  icon: typeof Code2;
  label: string;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onClick}
      disabled={disabled}
      className={`relative flex min-h-[64px] items-center gap-2.5 rounded-2xl border px-3 py-3 text-left sm:gap-3 sm:px-4 transition-colors disabled:opacity-60 cursor-pointer ${
        selected
          ? "border-brand bg-[#fff4ee] shadow-[0_6px_16px_rgba(255,108,71,0.14)]"
          : "border-[#ede6db] bg-white hover:border-brand/50 hover:bg-[#fffaf7]"
      }`}
    >
      {selected && (
        <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-brand" aria-hidden="true">
          <Check className="size-3 text-white" strokeWidth={3} />
        </span>
      )}
      <Icon className="size-6 shrink-0 text-brand" aria-hidden="true" />
      <span className="min-w-0 break-words text-[13px] font-bold leading-snug text-ink sm:text-[14px]">{label}</span>
    </button>
  );
}

/** Left panel on the setup page: what the candidate gets. */
function SetupIntroPanel() {
  const points = [
    { icon: Zap, title: "Focus on what matters", text: "Prioritized topics for your role and timeline" },
    { icon: Calendar, title: "Fit your schedule", text: "A realistic plan based on your available study time" },
    { icon: Target, title: "Be interview ready", text: "Cover learning, practice, and revision with a clear roadmap" },
  ];
  return (
    <aside className="relative hidden overflow-hidden rounded-3xl border border-[#f6e2d6] bg-gradient-to-b from-[#fff1e8] via-[#fff7f2] to-[#fdf2ea] p-7 lg:flex lg:flex-col">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/plan/plan-hero.webp?v=1"
        alt=""
        aria-hidden="true"
        className="mx-auto w-[210px] drop-shadow-[0_16px_22px_rgba(64,38,25,0.16)]"
      />
      <h2 className="mt-8 font-display text-[26px] font-extrabold leading-tight text-ink">Personalized Preparation Plan</h2>
      <ul className="mt-6 flex flex-col gap-6">
        {points.map((p) => (
          <li key={p.title} className="flex gap-3.5">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white/80 shadow-[0_4px_12px_rgba(255,108,71,0.12)]">
              <p.icon className="size-5 text-brand" aria-hidden="true" />
            </span>
            <span>
              <span className="block text-[15px] font-bold text-ink">{p.title}</span>
              <span className="block text-[13px] leading-snug text-ink-muted">{p.text}</span>
            </span>
          </li>
        ))}
      </ul>
    </aside>
  );
}


export function OnboardingFormCard() {
  const router = useRouter();

  // State for form fields
  const [selectedRoleOption, setSelectedRoleOption] = useState("Software Engineer / SDE");
  const [customRole, setCustomRole] = useState("");
  const [experience, setExperience] = useState("3-5 years");
  // Technologies (saved as `languages`) and the one coding language for DSA rounds.
  const [languages, setLanguages] = useState<string[]>([]);
  const [languageDraft, setLanguageDraft] = useState("");
  const [codingLanguage, setCodingLanguage] = useState<string | null>(null);
  // "Other" coding language: typed by the candidate (e.g. Node.js, Rust).
  const [otherLangOpen, setOtherLangOpen] = useState(false);
  const [otherLangDraft, setOtherLangDraft] = useState("");
  const [timeline, setTimeline] = useState("1 month");
  const [weeklyHours, setWeeklyHours] = useState(DEFAULT_WEEKLY_HOURS);
  // Optional fields stay tucked away unless the candidate already filled them.
  const [showOptional, setShowOptional] = useState(false);
  const [company, setCompany] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [existingResumeName, setExistingResumeName] = useState<string | null>(null);
  const [isClearingResume, setIsClearingResume] = useState(false);
  const [resumeActionMessage, setResumeActionMessage] = useState<string | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [showJdModal, setShowJdModal] = useState(false);
  const [tempJd, setTempJd] = useState("");

  // Admin platform settings: Step 2 stays hidden unless explicitly enabled.
  const [enableNextStepFlow, setEnableNextStepFlow] = useState(false);

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

  // "Your time" summary: total prep effort = weeks x hours per week.
  const timelineWeeks = TIMELINE_OPTIONS.find((t) => t.value === timeline)?.weeks ?? 4;
  const totalHours = Math.round(timelineWeeks * weeklyHours);
  const minutesPerDay = Math.round((weeklyHours * 60) / 5 / 5) * 5; // 5 study days a week
  const isSeniorRole = Number(experience.match(/\d+/)?.[0] ?? 0) >= 8;
  const isTightPlan = totalHours < 15 || (isSeniorRole && totalHours < 25);
  const roleName = selectedRoleOption === "custom" ? customRole : selectedRoleOption;
  const techGroups = techGroupsForRole(roleName);
  const offeredTechs = new Set(techGroups.flatMap((g) => g.techs.map((t) => t.name)));
  // Until the candidate picks one, suggest a coding language from their role and stack.
  const effectiveCodingLanguage = codingLanguage ?? defaultCodingLanguage(roleName, languages);
  const MAX_PER_GROUP = 3;
  const roleInMoreList = selectedRoleOption !== "custom" && !POPULAR_ROLES.includes(selectedRoleOption);

  // 1. Pre-fill with existing candidate profile data & platform config
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        // Fetch platform settings in parallel
        backendApi
          .getPlatformConfig()
          .then((cfg) => {
            if (isMounted) {
              setEnableNextStepFlow(cfg.enableNextStepFlow === true);
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
            setExperience(normaliseExperience(String(res.profile.experienceLevel)));
          }
          if (Array.isArray(res.profile.languages)) {
            setLanguages(res.profile.languages.map(String));
          }
          if (typeof res.profile.codingLanguage === "string" && res.profile.codingLanguage) {
            setCodingLanguage(res.profile.codingLanguage);
          }
          if (res.profile.timelineLabel) {
            setTimeline(String(res.profile.timelineLabel));
          }
          if (typeof res.profile.weeklyGoalHours === "number") {
            setWeeklyHours(nearestHours(res.profile.weeklyGoalHours));
          }
          if (
            Array.isArray(res.profile.targetCompanies) &&
            res.profile.targetCompanies.length > 0
          ) {
            setCompany(res.profile.targetCompanies.join(", "));
            setShowOptional(true);
          }
          if (res.profile.jobDescriptionText) {
            setJobDescription(String(res.profile.jobDescriptionText));
            setShowOptional(true);
          }
          if (res.profile.resumeFileName) {
            setExistingResumeName(String(res.profile.resumeFileName));
            setShowOptional(true);
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
      setExperience("3-5 years");
      setLanguages([]);
      setCodingLanguage(null);
      setTimeline("1 month");
      setWeeklyHours(DEFAULT_WEEKLY_HOURS);
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
        fresherForte: null,
        languages,
        codingLanguage: effectiveCodingLanguage,
        timelineLabel: timeline,
        weeklyGoalHours: weeklyHours,
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
              languages,
              timelineLabel: timeline,
              weeklyGoalHours: weeklyHours,
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
    <div className="grid w-full grid-cols-1 gap-5 lg:grid-cols-[300px_minmax(0,1fr)]">
      <SetupIntroPanel />
    <div className="relative flex w-full min-w-0 flex-col gap-6 rounded-[20px] border border-[#f0e8de] bg-white p-5 shadow-[0_8px_30px_rgba(64,38,25,0.06)] sm:rounded-3xl sm:p-8">
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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1.5">
          <h1 className="font-display text-[24px] font-extrabold leading-tight text-ink sm:text-[30px]">
            Set up your interview preparation plan
          </h1>
          <p className="text-[14px] text-ink-muted sm:text-[15px]">
            Tell us about your goal and available preparation time. We&rsquo;ll create a personalized plan for you.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2 sm:flex-col sm:items-end">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#fde3d6] bg-[#fff6f1] px-3.5 py-1.5 text-[13px] font-semibold text-ink">
            <Clock className="size-4 text-brand" aria-hidden="true" />~ 2 min to complete
          </span>
          <button
            type="button"
            onClick={() => setShowResetModal(true)}
            className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[12px] font-medium text-ink-muted hover:text-brand cursor-pointer"
          >
            <RotateCcw className="size-3" aria-hidden="true" />
            Reset profile
          </button>
        </div>
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

      {/* 2. Required: role, experience and time, all one-tap chips. */}
      <div className="flex flex-col gap-5">
        {/* Target role */}
        <div className="flex flex-col gap-2.5">
          <span className={sectionLabel}>
            What role are you preparing for? <span className="text-brand">*</span>
          </span>
          <div role="radiogroup" aria-label="Target role" className="grid grid-cols-2 gap-2 sm:gap-2.5 xl:grid-cols-4">
            {POPULAR_ROLES.map((role) => (
              <RoleCard
                key={role}
                icon={ROLE_ICONS[role] ?? Code2}
                label={role}
                selected={selectedRoleOption === role}
                onClick={() => setSelectedRoleOption(role)}
                disabled={isSubmitting}
              />
            ))}
            <RoleCard
              icon={MoreHorizontal}
              label={roleInMoreList ? selectedRoleOption : selectedRoleOption === "custom" && customRole ? customRole : "Other Role"}
              selected={roleInMoreList || selectedRoleOption === "custom"}
              onClick={() => setSelectedRoleOption(roleInMoreList ? selectedRoleOption : "custom")}
              disabled={isSubmitting}
            />
          </div>
          {(roleInMoreList || selectedRoleOption === "custom") && (
            <div className="flex flex-col gap-2 rounded-2xl border border-[#fde3d6] bg-[#fffaf7] p-3 sm:flex-row sm:items-center">
              <div className="relative flex h-10 items-center rounded-[10px] border border-[#ede6db] bg-white px-3 sm:w-72">
                <select
                  aria-label="Choose another role"
                  value={roleInMoreList ? selectedRoleOption : "custom"}
                  onChange={(e) => setSelectedRoleOption(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full appearance-none bg-transparent pr-6 text-[13px] text-ink outline-none cursor-pointer"
                >
                  {TARGET_ROLE_CATEGORIES.map((cat) => (
                    <optgroup key={cat.category} label={cat.category}>
                      {cat.roles
                        .filter((r) => !POPULAR_ROLES.includes(r))
                        .map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                    </optgroup>
                  ))}
                  <option value="custom">Other (type your role)</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 size-3.5 text-ink-muted" aria-hidden="true" />
              </div>
              {selectedRoleOption === "custom" && (
                <input
                  type="text"
                  value={customRole}
                  onChange={(e) => setCustomRole(e.target.value)}
                  placeholder="Type your target role, e.g. Security Engineer"
                  aria-label="Your target role"
                  disabled={isSubmitting}
                  autoFocus
                  className="h-10 w-full shrink-0 rounded-[10px] border border-brand/50 sm:flex-1 bg-white px-3 text-sm text-ink outline-none placeholder:text-[#b0a898] focus:border-brand"
                />
              )}
            </div>
          )}
        </div>

        {/* Experience */}
        <div className="flex flex-col gap-2.5">
          <span className={`${sectionLabel} flex items-center gap-1.5`}>
            <Briefcase className="size-4 text-ink-muted" aria-hidden="true" />
            Years of experience <span className="text-brand">*</span>
          </span>
          <div role="radiogroup" aria-label="Years of experience" className="grid grid-cols-3 gap-2 sm:grid-cols-5 xl:grid-cols-9">
            {EXPERIENCE_OPTIONS.map((o) => {
              const selected = experience === o.value;
              return (
                <button
                  key={o.value}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setExperience(o.value)}
                  disabled={isSubmitting}
                  className={`flex flex-col items-center rounded-2xl border px-2 py-2 text-center transition-colors disabled:opacity-60 cursor-pointer ${
                    selected
                      ? "border-brand bg-brand text-white shadow-[0_6px_14px_rgba(255,108,71,0.28)]"
                      : "border-[#ede6db] bg-white text-ink hover:border-brand/50 hover:bg-[#fff7f3]"
                  }`}
                >
                  <span className="text-[13px] font-semibold leading-tight">{o.label}</span>
                  <span className={`text-[11.5px] leading-tight ${selected ? "text-white/85" : "text-ink-muted"}`}>{o.sub}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Coding language: one, for DSA and coding rounds. */}
        <div className="flex flex-col gap-2.5">
          <div>
            <span className={sectionLabel}>
              Preferred coding language <span className="text-brand">*</span>
            </span>
            <p className="mt-0.5 text-[13px] text-ink-muted">
              The one language you&rsquo;ll write DSA and coding rounds in.
              {isFresher ? " Not sure? Python, Java or C++ are the most common." : ""}
            </p>
          </div>
          <div role="radiogroup" aria-label="Preferred coding language" className="flex flex-wrap gap-2">
            {CODING_LANGUAGES.map((lang) => (
              <Chip
                key={lang}
                selected={!otherLangOpen && effectiveCodingLanguage === lang}
                onClick={() => {
                  setCodingLanguage(lang);
                  setOtherLangOpen(false);
                }}
                disabled={isSubmitting}
              >
                {lang}
              </Chip>
            ))}
            {/* A saved custom language shows as its own chip. */}
            {!otherLangOpen && !CODING_LANGUAGES.includes(effectiveCodingLanguage) && (
              <Chip selected onClick={() => {}} disabled={isSubmitting}>
                {effectiveCodingLanguage}
              </Chip>
            )}
            <Chip
              selected={otherLangOpen}
              onClick={() => {
                setOtherLangOpen(true);
                setOtherLangDraft(CODING_LANGUAGES.includes(effectiveCodingLanguage) ? "" : effectiveCodingLanguage);
              }}
              disabled={isSubmitting}
            >
              <MoreHorizontal className="size-4" aria-hidden="true" />
              Other
            </Chip>
          </div>
          {otherLangOpen && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const v = otherLangDraft.trim().slice(0, 40);
                if (!v) return;
                const known = CODING_LANGUAGES.find((l) => l.toLowerCase() === v.toLowerCase());
                setCodingLanguage(known ?? v);
                setOtherLangOpen(false);
              }}
              className="flex max-w-md items-center gap-2 rounded-2xl border border-[#fde3d6] bg-[#fffaf7] p-2"
            >
              <input
                value={otherLangDraft}
                onChange={(e) => setOtherLangDraft(e.target.value)}
                placeholder="Type your language, e.g. Node.js or Rust"
                aria-label="Other coding language"
                disabled={isSubmitting}
                autoFocus
                className="h-10 min-w-0 flex-1 rounded-[10px] border border-brand/50 bg-white px-3 text-sm text-ink outline-none placeholder:text-[#b0a898] focus:border-brand"
              />
              <button
                type="submit"
                disabled={isSubmitting || !otherLangDraft.trim()}
                className="rounded-full bg-brand px-4 py-2 text-[13px] font-semibold text-white disabled:opacity-50"
              >
                Use
              </button>
            </form>
          )}
        </div>

        {/* Technologies: only for roles that have a relevant list. */}
        {techGroups.length > 0 && (
        <div className="flex flex-col gap-2.5">
          <div>
            <span className={sectionLabel}>Technologies you work with</span>
            <p className="mt-0.5 text-[13px] text-ink-muted">
              Pick up to {MAX_PER_GROUP} per group. Your plan focuses on these and skips the stacks you don&rsquo;t use.
            </p>
          </div>
          {techGroups.map((g) => {
            const pickedHere = g.techs.filter((t) => languages.includes(t.name)).length;
            return (
              <div key={g.key} className="flex flex-col gap-1.5">
                {techGroups.length > 1 && <span className="text-[12px] font-bold uppercase tracking-wide text-ink-muted">{g.title}</span>}
                <div role="group" aria-label={`${g.title} technologies`} className="flex flex-wrap gap-2">
                  {g.techs.map((t) => {
                    const selected = languages.includes(t.name);
                    const full = !selected && pickedHere >= MAX_PER_GROUP;
                    return (
                      <button
                        key={t.name}
                        type="button"
                        aria-pressed={selected}
                        disabled={isSubmitting || full}
                        title={full ? `Up to ${MAX_PER_GROUP} in ${g.title}` : undefined}
                        onClick={() =>
                          setLanguages((prev) => (prev.includes(t.name) ? prev.filter((l) => l !== t.name) : [...prev, t.name]))
                        }
                        className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-[13.5px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer ${
                          selected
                            ? "border-brand bg-brand text-white shadow-[0_4px_10px_rgba(255,108,71,0.25)]"
                            : "border-[#ede6db] bg-white text-ink hover:border-brand/50 hover:bg-[#fff7f3]"
                        }`}
                      >
                        {selected && <Check className="size-3.5" strokeWidth={3} aria-hidden="true" />}
                        {t.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
          <div className="flex flex-wrap items-center gap-2">
            {languages
              .filter((l) => !offeredTechs.has(l))
              .map((l) => (
                <button
                  key={l}
                  type="button"
                  aria-pressed="true"
                  onClick={() => setLanguages((p) => p.filter((x) => x !== l))}
                  className="inline-flex items-center gap-1.5 rounded-full border border-brand bg-brand px-4 py-2 text-[13.5px] font-semibold text-white"
                  title="Remove"
                >
                  {l}
                  <X className="size-3.5" aria-hidden="true" />
                </button>
              ))}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const v = languageDraft.trim().slice(0, 40);
                if (v && !languages.some((l) => l.toLowerCase() === v.toLowerCase())) setLanguages((p) => [...p, v]);
                setLanguageDraft("");
              }}
              className="flex items-center rounded-full border border-dashed border-[#d6cfc4] bg-white pl-4 pr-1 focus-within:border-brand"
            >
              <input
                value={languageDraft}
                onChange={(e) => setLanguageDraft(e.target.value)}
                placeholder="Add another"
                aria-label="Add another technology"
                disabled={isSubmitting}
                className="w-28 bg-transparent py-2 text-[13.5px] text-ink outline-none placeholder:text-[#b0a898]"
              />
              <button
                type="submit"
                disabled={isSubmitting || !languageDraft.trim()}
                className="rounded-full px-2.5 py-1 text-[13px] font-semibold text-brand disabled:text-[#c9c2b8]"
              >
                Add
              </button>
            </form>
            {languages.length > 0 ? (
              <button type="button" onClick={() => setLanguages([])} className="text-[13px] font-medium text-ink-muted hover:text-brand">
                Clear
              </button>
            ) : (
              <span className="text-[12.5px] text-ink-muted">Not sure yet? Leave this empty and we&rsquo;ll cover the common stacks.</span>
            )}
          </div>
        </div>
        )}

        {/* Your time: when is the interview, and weekly hours. */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-0 md:divide-x md:divide-[#f0e8de]">
          <div className="flex flex-col gap-2.5 md:pr-6">
            <span className={sectionLabel}>
              When is your interview? <span className="text-brand">*</span>
            </span>
            <div role="radiogroup" aria-label="When is your interview" className="flex flex-wrap gap-2">
              {TIMELINE_OPTIONS.map((o) => (
                <Chip key={o.value} selected={timeline === o.value} onClick={() => setTimeline(o.value)} disabled={isSubmitting}>
                  <Calendar className="size-4" aria-hidden="true" />
                  {o.label}
                </Chip>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2.5 md:pl-6">
            <span className={sectionLabel}>
              How much time can you study per week? <span className="text-brand">*</span>
            </span>
            <div role="radiogroup" aria-label="Study time per week" className="flex flex-wrap gap-2">
              {HOURS_OPTIONS.map((o) => (
                <Chip key={o.value} selected={weeklyHours === o.value} onClick={() => setWeeklyHours(o.value)} disabled={isSubmitting}>
                  <Clock className="size-4" aria-hidden="true" />
                  {o.label}
                </Chip>
              ))}
            </div>
          </div>
        </div>

        {/* Live estimate */}
        <div className="grid grid-cols-1 gap-4 rounded-2xl border border-[#fde3d6] bg-[#fff6f1] p-4 sm:p-5 md:grid-cols-2 md:gap-0 md:divide-x md:divide-[#f6dccf]">
          <div className="flex items-start gap-3 md:pr-5">
            <Calendar className="mt-0.5 size-6 shrink-0 text-brand" aria-hidden="true" />
            <div>
              <p className="text-[15px] font-bold text-ink">Your estimated preparation time</p>
              <p className="mt-0.5 text-[13.5px] text-ink">
                ≈ {timelineWeeks} weeks × {weeklyHours} hrs/week = ~{totalHours} hours of preparation
              </p>
              <p className="text-[12.5px] text-ink-muted">About {minutesPerDay} min a day, 5 days a week.</p>
              {isTightPlan && (
                <p className="mt-1 flex items-start gap-1.5 text-[12.5px] text-[#b4570f]">
                  <Zap className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
                  That&rsquo;s a tight schedule. We&rsquo;ll focus on your highest-priority topics first.
                </p>
              )}
            </div>
          </div>
          <div className="flex items-start gap-3 md:pl-5">
            <Target className="mt-0.5 size-6 shrink-0 text-emerald-600" aria-hidden="true" />
            <div>
              <p className="text-[15px] font-bold text-ink">What you&rsquo;ll get</p>
              <p className="mt-0.5 text-[13.5px] text-ink-muted">
                A personalized roadmap with prioritized topics, practice, and revision that fits your time.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Optional details, tucked away in one card so setup stays quick. */}
      <div
        className={`overflow-hidden rounded-2xl border transition-colors ${
          showOptional ? "border-[#fde3d6] bg-[#fffaf7]" : "border-[#f0e8de] bg-white hover:border-brand/40"
        }`}
      >
        <button
          type="button"
          onClick={() => setShowOptional((v) => !v)}
          aria-expanded={showOptional}
          className="flex w-full items-center gap-4 px-4 py-4 text-left cursor-pointer sm:px-5"
        >
          <ChevronDown
            className={`size-5 shrink-0 text-ink transition-transform ${showOptional ? "rotate-180" : ""}`}
            aria-hidden="true"
          />
          <span className="min-w-0">
            <span className="flex flex-wrap items-center gap-2">
              <span className="text-[15px] font-bold text-ink">Make it more personal</span>
              <span className="rounded-full bg-[#fff0ea] px-2.5 py-0.5 text-[11.5px] font-semibold text-brand">Optional</span>
            </span>
            <span className="mt-0.5 block text-[13px] text-ink-muted">
              Add your target company, resume, or job description for better topic recommendations.
            </span>
          </span>
        </button>
        {showOptional && (
          <div className="flex flex-col gap-5 border-t border-[#f6e2d6] px-4 pb-5 pt-4 sm:px-5 sm:pl-[60px]">
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

          </div>
        )}
      </div>

      {/* 5. CTA Area */}
      <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <Link
            href={enableNextStepFlow ? "/dashboard/plan-ready" : "/dashboard?step=3"}
            className="text-sm font-medium text-[#6b6661] hover:text-ink hover:underline"
          >
            Skip for now
          </Link>
          <span className="flex items-center gap-1.5 text-[11.5px] text-[#b0a898]">
            <Lock className="size-3" aria-hidden="true" />
            Your information is secure and only used to personalize your plan.
          </span>
        </div>
        <button
          type="button"
          onClick={() => handleSubmitSetup()}
          disabled={isSubmitting}
          className="flex items-center justify-center gap-2 rounded-full bg-brand px-8 py-3.5 text-[15px] font-semibold text-white shadow-[0_8px_18px_rgba(255,108,71,0.3)] transition-transform hover:-translate-y-0.5 disabled:opacity-60 cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              <span>{uploadProgressMsg || "Saving your plan..."}</span>
            </>
          ) : enableNextStepFlow ? (
            <>
              Next Step: Assessment <ArrowRight className="size-4" aria-hidden="true" />
            </>
          ) : (
            <>
              Continue to Plan Preview <ArrowRight className="size-4" aria-hidden="true" />
            </>
          )}
        </button>
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
    </div>
  );
}
