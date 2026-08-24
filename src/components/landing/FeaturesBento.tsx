import {
  SlidersHorizontal,
  FileText,
  Briefcase,
  HelpCircle,
  Users,
  Star,
  TrendingDown,
  BookOpen,
  type LucideIcon,
} from "lucide-react";
import { Blob } from "./decorative";

const features: {
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
}[] = [
  {
    icon: SlidersHorizontal,
    iconBg: "#e6f4f8",
    iconColor: "#3b82f6",
    title: "Personalized Preparation",
    description:
      "Dynamically maps entire technical curriculums tailored specifically to your speed and experience gaps.",
  },
  {
    icon: FileText,
    iconBg: "#edf5ec",
    iconColor: "#10b981",
    title: "Resume Intelligence",
    description:
      "Extracts core technical strengths and projects to anticipate deep technical questions.",
  },
  {
    icon: Briefcase,
    iconBg: "#fef7ea",
    iconColor: "#f59e0b",
    title: "JD Analysis",
    description:
      "Identifies critical requirements in job descriptions to pinpoint high-probability topics.",
  },
  {
    icon: HelpCircle,
    iconBg: "#fdf0f4",
    iconColor: "#ec4899",
    title: "Smart Questions",
    description: "Generates customized real-world problems mirroring top tech firms' standards.",
  },
  {
    icon: Users,
    iconBg: "#f5effb",
    iconColor: "#8b5cf6",
    title: "AI Mock Interviews",
    description:
      "Engage in realistic text/voice mocks with strict evaluation bots pushing alternative solutions.",
  },
  {
    icon: Star,
    iconBg: "#fdf0f4",
    iconColor: "#ec4899",
    title: "Evaluation Metrics",
    description:
      "Detailed analytical scorecard evaluating logic, architecture, coding speed, and articulation.",
  },
  {
    icon: TrendingDown,
    iconBg: "#e6f4f8",
    iconColor: "#3b82f6",
    title: "Weakness Detection",
    description:
      "Automatically aggregates missing concepts, syntax patterns, or architecture trade-offs.",
  },
  {
    icon: BookOpen,
    iconBg: "#edf5ec",
    iconColor: "#10b981",
    title: "Smart Revision",
    description:
      "Dynamically auto-generates localized flashcards and mock scenarios centered on weak concepts.",
  },
];

const rows = [features.slice(0, 3), features.slice(3, 5), features.slice(5, 8)];

export function FeaturesBento() {
  return (
    <section className="relative overflow-hidden px-[120px] py-[100px]">
      <Blob size={260} color="#5EEAD4" opacity={0.14} className="-left-[100px] top-[400px]" />

      <div className="relative flex flex-col items-center gap-16">
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-sm font-bold uppercase text-brand">Key capabilities</p>
          <h2 className="font-display text-[40px] font-extrabold leading-[48px] text-ink">
            Everything you need to ace your interview
          </h2>
          <p className="w-[720px] text-base leading-[26px] text-ink-muted">
            Explore the advanced suite of precision AI utilities working continuously behind the
            scenes to optimize your success rate.
          </p>
        </div>

        <div className="flex w-full flex-col gap-6">
          {rows.map((row, i) => (
            <div key={i} className="flex w-full gap-6">
              {row.map(({ icon: Icon, iconBg, iconColor, title, description }) => (
                <div
                  key={title}
                  className="flex flex-1 flex-col gap-5 rounded-[20px] border border-line bg-white p-8"
                >
                  <div
                    className="flex size-12 items-center justify-center rounded-xl"
                    style={{ backgroundColor: iconBg }}
                  >
                    <Icon className="size-6" style={{ color: iconColor }} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="font-display text-xl font-bold text-ink">{title}</p>
                    <p className="text-sm leading-[22px] text-ink-muted">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
