import { FileBadge2, Briefcase, UploadCloud, FilePlus2, type LucideIcon } from "lucide-react";

const uploadCards: {
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  title: string;
  subtitle: string;
  description: string;
  uploadIcon: LucideIcon;
  uploadLabel: string;
  uploadHint: string;
  dashed: string;
}[] = [
  {
    icon: FileBadge2,
    iconBg: "var(--color-brand-soft)",
    iconColor: "var(--color-brand)",
    title: "Resume",
    subtitle: "Personal background file",
    description:
      "Help AI understand your previous experience, project scope, and hard skills so we can draft tailored scenarios.",
    uploadIcon: UploadCloud,
    uploadLabel: "Upload Resume",
    uploadHint: "Supported formats: PDF, DOCX",
    dashed: "border-brand",
  },
  {
    icon: Briefcase,
    iconBg: "#e6f4f8",
    iconColor: "var(--color-blue)",
    title: "Job Description",
    subtitle: "Target role expectations",
    description:
      "Help AI analyze exactly what the company is testing for. Paste the job description or upload the file directly.",
    uploadIcon: FilePlus2,
    uploadLabel: "Upload JD",
    uploadHint: "PDF, DOCX, or paste text",
    dashed: "border-[#ede6db]",
  },
];

export function ProfileSetup() {
  return (
    <div className="flex w-full flex-col gap-4">
      <p className="font-display text-lg font-extrabold text-ink">Add Your Profile</p>

      <div className="flex w-full items-start gap-5">
        {uploadCards.map((card) => (
          <div
            key={card.title}
            className="flex flex-1 flex-col gap-5 rounded-2xl border border-line bg-white p-6"
          >
            <div className="flex items-center gap-3">
              <div
                className="flex size-10 items-center justify-center rounded-[10px]"
                style={{ backgroundColor: card.iconBg }}
              >
                <card.icon className="size-5" style={{ color: card.iconColor }} />
              </div>
              <div className="flex flex-col gap-0.5">
                <p className="font-display text-base font-bold text-ink">{card.title}</p>
                <p className="text-xs text-ink-muted">{card.subtitle}</p>
              </div>
            </div>

            <p className="text-[13px] leading-5 text-ink-muted">{card.description}</p>

            <div
              className={`flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed bg-[#fbf9f4] p-5 ${card.dashed}`}
            >
              <card.uploadIcon className="size-6 text-ink-muted" />
              <p className="text-sm font-semibold text-ink">{card.uploadLabel}</p>
              <p className="text-[11px] text-ink-muted">{card.uploadHint}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex w-full items-center justify-between rounded-xl border border-[#ede6db] bg-cream p-4">
        <p className="text-[13px] text-ink-muted">
          You can upload files now or fill them later during mock generation.
        </p>
        <button
          type="button"
          className="rounded-full bg-ink px-4 py-2 text-[13px] font-semibold text-white"
        >
          Analyze My Profile →
        </button>
      </div>
    </div>
  );
}
