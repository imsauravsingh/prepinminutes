"use client";

import { useState, useRef } from "react";
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
} from "lucide-react";

export function OnboardingFormCard() {
  // State for form fields
  const [targetRole, setTargetRole] = useState("Senior Software Engineer");
  const [experience, setExperience] = useState("4-5 years");
  const [timeline, setTimeline] = useState("1 month");
  const [company, setCompany] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [showJdModal, setShowJdModal] = useState(false);
  const [tempJd, setTempJd] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleSaveJd = () => {
    setJobDescription(tempJd.trim());
    setShowJdModal(false);
  };

  return (
    <div className="flex w-full flex-col gap-6 rounded-[20px] sm:rounded-3xl border-[1.5px] border-[#ff6c47] bg-white p-6 sm:p-8 shadow-[0_8px_30px_rgba(255,108,71,0.06)]">
      {/* 1. Header Row */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2.5">
          <h2 className="font-display text-xl sm:text-[22px] font-extrabold text-ink">
            What are you preparing for?
          </h2>
          <span className="rounded-full bg-[#fff0ec] px-2.5 py-0.5 text-[10px] font-bold text-brand">
            * Required
          </span>
        </div>
        <p className="text-sm text-ink-muted">
          Tell us a few details so we can create your personalized plan. You can
          always update this later.
        </p>
      </div>

      {/* 2. Required Fields (3-column Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Field 1: Target Role */}
        <div className="flex flex-col gap-1.5">
          <label className="flex items-center gap-1 text-[11px] font-bold text-ink">
            <span>Target Role</span>
            <span className="text-brand">*</span>
          </label>
          <div className="relative flex h-10 w-full items-center gap-2 rounded-[10px] border border-[#ede6db] bg-white px-3 text-sm text-ink focus-within:border-brand focus-within:ring-1 focus-within:ring-brand/20 transition-all">
            <Users2 className="size-4 shrink-0 text-[#6b6661]" />
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. Senior Software Engineer"
              className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-[#b0a898]"
            />
          </div>
          <span className="text-[11px] text-[#b0a898]">
            e.g. Software Engineer, Senior SDE, Staff Engineer
          </span>
        </div>

        {/* Field 2: Years of Experience */}
        <div className="flex flex-col gap-1.5">
          <label className="flex items-center gap-1 text-[11px] font-bold text-ink">
            <span>Years of Experience</span>
            <span className="text-brand">*</span>
          </label>
          <div className="relative flex h-10 w-full items-center justify-between rounded-[10px] border border-[#ede6db] bg-white px-3 text-sm text-ink focus-within:border-brand focus-within:ring-1 focus-within:ring-brand/20 transition-all">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Briefcase className="size-4 shrink-0 text-[#6b6661]" />
              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full bg-transparent text-sm text-ink outline-none appearance-none cursor-pointer"
              >
                <option value="0-1 years">0-1 years (Entry level)</option>
                <option value="1-3 years">1-3 years (Mid level)</option>
                <option value="4-5 years">4-5 years (Senior)</option>
                <option value="6-8 years">6-8 years (Lead)</option>
                <option value="8+ years">8+ years (Staff / Principal)</option>
              </select>
            </div>
            <ChevronDown className="size-3.5 shrink-0 text-[#6b6661] pointer-events-none" />
          </div>
          <span className="text-[11px] text-[#b0a898]">
            Helps us tailor the depth and topics.
          </span>
        </div>

        {/* Field 3: Prep Timeline */}
        <div className="flex flex-col gap-1.5">
          <label className="flex items-center gap-1 text-[11px] font-bold text-ink">
            <span>Prep Timeline</span>
            <span className="text-brand">*</span>
          </label>
          <div className="relative flex h-10 w-full items-center justify-between rounded-[10px] border border-[#ede6db] bg-white px-3 text-sm text-ink focus-within:border-brand focus-within:ring-1 focus-within:ring-brand/20 transition-all">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Calendar className="size-4 shrink-0 text-[#6b6661]" />
              <select
                value={timeline}
                onChange={(e) => setTimeline(e.target.value)}
                className="w-full bg-transparent text-sm text-ink outline-none appearance-none cursor-pointer"
              >
                <option value="1-2 weeks">1-2 weeks (Express)</option>
                <option value="1 month">1 month (Standard)</option>
                <option value="2-3 months">2-3 months (Thorough)</option>
                <option value="3+ months">3+ months (Comprehensive)</option>
              </select>
            </div>
            <ChevronDown className="size-3.5 shrink-0 text-[#6b6661] pointer-events-none" />
          </div>
          <span className="text-[11px] text-[#b0a898]">
            How much time do you have to prepare?
          </span>
        </div>
      </div>

      {/* 3. Target Company (Full Width) */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <label className="text-[11px] font-bold text-ink">
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
              placeholder="e.g. Google, Amazon, Microsoft"
              className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-[#b0a898]"
            />
          </div>
          <ChevronDown className="size-3.5 shrink-0 text-[#b0a898] pointer-events-none" />
        </div>
        <span className="text-[11px] text-[#b0a898]">
          Add a target company to get company-specific insights and questions.
          Or select &quot;I don&apos;t have a target company.&quot;
        </span>
      </div>

      {/* 4. Upload Fields Row (Resume & Job Description) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Resume Dropzone */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <label className="text-[11px] font-bold text-ink">Resume</label>
            <span className="rounded-full bg-[#f0f9ff] px-2 py-0.5 text-[10px] font-semibold text-[#0284c7]">
              Optional
            </span>
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
            className="flex flex-col items-center justify-center gap-1.5 rounded-[10px] border border-[#ede6db] bg-[#fbf9f4] p-4 text-center cursor-pointer transition-all hover:border-brand/40 hover:bg-[#fff9f6]"
          >
            {resumeFile ? (
              <div className="flex items-center gap-2 text-xs font-semibold text-[#10b981]">
                <CheckCircle2 className="size-4 text-[#10b981]" />
                <span className="max-w-[200px] truncate">
                  {resumeFile.name}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setResumeFile(null);
                  }}
                  className="text-[#6b6661] hover:text-red-500"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            ) : (
              <>
                <UploadCloud className="size-6 text-[#b0a898]" />
                <span className="text-xs font-semibold text-ink">
                  Upload Resume
                </span>
                <span className="text-[11px] text-[#b0a898]">
                  PDF, DOCX · Max 10 MB
                </span>
              </>
            )}
          </div>
          <span className="text-[11px] text-[#b0a898]">
            Helps us understand your background and suggest relevant topics.
          </span>
        </div>

        {/* Job Description Dropzone */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <label className="text-[11px] font-bold text-ink">
              Job Description
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
                <span className="text-xs font-semibold text-ink">Paste JD</span>
                <span className="text-[11px] text-[#b0a898]">Text format</span>
              </>
            )}
          </div>
          <span className="text-[11px] text-[#b0a898]">
            Add the JD to focus preparation on the exact skills and
            responsibilities required.
          </span>
        </div>
      </div>

      {/* 5. CTA Area */}
      <div className="flex flex-col gap-3.5 pt-2">
        <div className="flex flex-wrap items-center gap-4 sm:gap-5">
          <Link
            href="/dashboard/plan-ready"
            className="flex items-center justify-center rounded-full bg-brand px-7 py-3 text-[15px] font-bold text-white shadow-[0_4px_12px_rgba(255,108,71,0.25)] transition-all hover:bg-[#fa552b] active:scale-[0.99]"
          >
            Create My Preparation Plan →
          </Link>
          <Link
            href="/preparation-plan"
            className="text-sm font-medium text-[#6b6661] hover:text-ink hover:underline"
          >
            Skip for now
          </Link>
        </div>

        {/* Security assurance */}
        <div className="flex items-center gap-1.5 text-[11px] text-[#b0a898]">
          <Lock className="size-3 text-[#b0a898]" />
          <span>
            Your information is secure and only used to personalize your
            preparation plan.
          </span>
        </div>
      </div>

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
