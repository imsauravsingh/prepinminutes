import {
  UserSearch,
  BookOpen,
  Mic,
  BarChart3,
  Target,
  RefreshCw,
  Briefcase,
  FileText,
  HelpCircle,
  Users,
  Shuffle,
  ShieldCheck,
  TrendingUp,
  Code2,
  Layers,
  Puzzle,
  MessageCircle,
  ArrowRight,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import { RadarChart } from "./decorative";

type Card = {
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
};

const pipelineSteps: {
  icon: LucideIcon;
  color: string;
  bg: string;
  label: string;
  sub: string;
}[] = [
  { icon: UserSearch, color: "#ff6c47", bg: "#fff0ec", label: "Understand", sub: "Know the role" },
  { icon: BookOpen, color: "#3b82f6", bg: "#e6f4f8", label: "Prepare", sub: "Build your plan" },
  { icon: Mic, color: "#8b5cf6", bg: "#f5effb", label: "Practice", sub: "Mock interviews" },
  { icon: BarChart3, color: "#ec4899", bg: "#fdf0f4", label: "Evaluate", sub: "Track performance" },
  { icon: Target, color: "#3b82f6", bg: "#e6f4f8", label: "Improve", sub: "Fix weaknesses" },
  { icon: RefreshCw, color: "#10b981", bg: "#edf5ec", label: "Revise", sub: "Strengthen concepts" },
];

const understandCards: Card[] = [
  {
    icon: Briefcase,
    iconBg: "#fef7ea",
    iconColor: "#f59e0b",
    title: "JD Analysis",
    description:
      "Extracts key skills, technologies, experience and high-priority topics from any job description.",
  },
  {
    icon: FileText,
    iconBg: "#edf5ec",
    iconColor: "#10b981",
    title: "Resume Intelligence",
    description:
      "Maps your experience and projects against the role to identify likely interview areas.",
  },
];

const prepareCards: Card[] = [
  {
    icon: BookOpen,
    iconBg: "#e6f4f8",
    iconColor: "#3b82f6",
    title: "Personalized Preparation",
    description:
      "Creates a tailored roadmap based on your background, target role and identified gaps.",
  },
  {
    icon: HelpCircle,
    iconBg: "#fdf0f4",
    iconColor: "#ec4899",
    title: "Smart Questions",
    description:
      "Generates customized questions mirroring top tech firms' standards and real interview patterns.",
  },
];

const improveCards: Card[] = [
  {
    icon: Target,
    iconBg: "#e6f4f8",
    iconColor: "#3b82f6",
    title: "Weakness Detection",
    description:
      "Automatically identifies weak concepts, knowledge gaps and areas where you lose marks.",
  },
  {
    icon: BookOpen,
    iconBg: "#edf5ec",
    iconColor: "#10b981",
    title: "Smart Revision",
    description:
      "Generates targeted flashcards, notes and mock scenarios focused on your weak areas.",
  },
  {
    icon: TrendingUp,
    iconBg: "#f5effb",
    iconColor: "#8b5cf6",
    title: "Track Improvement",
    description: "Visualize your progress over time and see how you're getting interview-ready.",
  },
];

const practiceTags: { icon: LucideIcon; label: string }[] = [
  { icon: Users, label: "Realistic Interviewer" },
  { icon: Shuffle, label: "Adaptive Follow-ups" },
  { icon: Mic, label: "Text & Voice mode" },
  { icon: ShieldCheck, label: "Strict Evaluation" },
];

const practiceMetrics: { icon: LucideIcon; label: string; value: number; color: string }[] = [
  { icon: Code2, label: "Technical Depth", value: 82, color: "#8b5cf6" },
  { icon: Layers, label: "Architecture", value: 91, color: "#3b82f6" },
  { icon: Puzzle, label: "Problem Solving", value: 84, color: "#10b981" },
  { icon: MessageCircle, label: "Communication", value: 76, color: "#ec4899" },
];

const radarData = [
  { label: "Technical Depth", value: 82 },
  { label: "Architecture", value: 91 },
  { label: "Problem Solving", value: 84 },
  { label: "Communication", value: 76 },
  { label: "Code Quality", value: 80 },
];

const waveformHeights = [6, 14, 22, 10, 28, 16, 8, 24, 12, 20, 6, 18, 26, 10, 14, 22, 8, 16, 12, 6];

const loopSteps = ["Prepare", "Practice", "Evaluate", "Improve", "Revise"];

function CapabilityCard({ icon: Icon, iconBg, iconColor, title, description }: Card) {
  return (
    <div className="flex flex-1 flex-col gap-4 rounded-2xl border border-line bg-white p-6">
      <div
        className="flex size-11 items-center justify-center rounded-xl"
        style={{ backgroundColor: iconBg }}
      >
        <Icon className="size-5" style={{ color: iconColor }} />
      </div>
      <div className="flex flex-col gap-1.5">
        <p className="font-display text-base font-bold text-ink">{title}</p>
        <p className="text-sm leading-[22px] text-ink-muted">{description}</p>
      </div>
      <a
        href="#"
        className="mt-auto flex items-center gap-1 text-sm font-semibold"
        style={{ color: iconColor }}
      >
        Explore <ArrowRight className="size-3.5" />
      </a>
    </div>
  );
}

function JourneyRow({
  number,
  color,
  title,
  description,
  children,
}: {
  number: string;
  color: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-5 lg:flex-row lg:gap-10">
      <div className="flex items-center gap-4 lg:w-[190px] lg:shrink-0 lg:flex-col lg:items-start lg:gap-3">
        <span
          className="flex size-11 shrink-0 items-center justify-center rounded-full text-sm font-extrabold text-white"
          style={{ backgroundColor: color }}
        >
          {number}
        </span>
        <div className="flex flex-col gap-0.5">
          <p className="font-display text-sm font-extrabold tracking-wide" style={{ color }}>
            {title}
          </p>
          <p className="text-sm text-ink-muted">{description}</p>
        </div>
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}

export function Capabilities() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-[120px] lg:py-[100px]">
      <div className="flex flex-col items-center gap-10 lg:gap-16">
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-sm font-bold uppercase text-brand">Key capabilities</p>
          <h2 className="font-display text-[26px] font-extrabold leading-[32px] text-ink sm:text-[34px] sm:leading-[40px] lg:text-[40px] lg:leading-[48px]">
            Everything you need to turn preparation into{" "}
            <span className="text-brand">interview readiness</span>
          </h2>
          <p className="w-full max-w-[720px] text-base leading-[26px] text-ink-muted">
            From understanding the job to practicing realistic interviews, PrepInMinutes
            continuously identifies what to learn, what to practice, and what to improve.
          </p>
        </div>

        <div className="flex w-full flex-wrap items-center justify-center gap-x-2 gap-y-4 rounded-2xl border border-line bg-white p-4 sm:p-5 lg:flex-nowrap lg:justify-between">
          {pipelineSteps.map((step, i) => (
            <div key={step.label} className="flex items-center gap-2">
              <div className="flex items-center gap-2.5">
                <div
                  className="flex size-9 shrink-0 items-center justify-center rounded-full"
                  style={{ backgroundColor: step.bg }}
                >
                  <step.icon className="size-[18px]" style={{ color: step.color }} />
                </div>
                <div className="flex flex-col">
                  <p className="text-[13px] font-bold leading-tight text-ink">{step.label}</p>
                  <p className="text-[11px] leading-tight text-ink-muted">{step.sub}</p>
                </div>
              </div>
              {i < pipelineSteps.length - 1 && (
                <ChevronRight className="ml-1 hidden size-4 shrink-0 text-line-strong sm:block" />
              )}
            </div>
          ))}
        </div>

        <div className="flex w-full flex-col gap-10 lg:gap-12">
          <JourneyRow
            number="01"
            color="#ff6c47"
            title="UNDERSTAND"
            description="Know the role & your fit"
          >
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {understandCards.map((card) => (
                <CapabilityCard key={card.title} {...card} />
              ))}
            </div>
          </JourneyRow>

          <JourneyRow
            number="02"
            color="#3b82f6"
            title="PREPARE"
            description="Build a plan that's personalized"
          >
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {prepareCards.map((card) => (
                <CapabilityCard key={card.title} {...card} />
              ))}
            </div>
          </JourneyRow>

          <JourneyRow
            number="03"
            color="#8b5cf6"
            title="PRACTICE"
            description="Practice like it's the real thing"
          >
            <div className="flex flex-col gap-8 rounded-3xl border border-[#8b5cf6]/25 bg-[#f5effb] p-6 sm:p-8">
              <div className="flex flex-col gap-8 lg:flex-row">
                <div className="flex flex-1 flex-col gap-5">
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="font-display text-xl font-bold text-ink">AI Mock Interviews</p>
                    <span className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#8b5cf6]">
                      <span className="size-1.5 rounded-full bg-[#8b5cf6]" />
                      LIVE PRACTICE
                    </span>
                  </div>
                  <p className="text-sm leading-[22px] text-ink-muted">
                    Engage in realistic text or voice interviews with adaptive follow-ups and
                    evaluation bots.
                  </p>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {practiceTags.map((tag) => (
                      <div
                        key={tag.label}
                        className="flex items-center gap-2 rounded-xl bg-white px-3 py-2.5 text-[13px] font-medium text-ink"
                      >
                        <tag.icon className="size-4 shrink-0 text-[#8b5cf6]" />
                        {tag.label}
                      </div>
                    ))}
                  </div>
                  <a
                    href="#"
                    className="flex w-fit items-center gap-1.5 rounded-full bg-[#8b5cf6] px-6 py-3 text-[15px] font-semibold text-white shadow-[0_4px_6px_rgba(139,92,246,0.2)]"
                  >
                    Start Mock Interview <ArrowRight className="size-4" />
                  </a>
                </div>

                <div className="flex w-full flex-col gap-4 rounded-2xl border border-line bg-white p-5 lg:w-[340px] lg:shrink-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="flex size-7 items-center justify-center rounded-full bg-[#f5effb]">
                        <Users className="size-3.5 text-[#8b5cf6]" />
                      </span>
                      <p className="text-[13px] font-semibold text-ink">Interviewer</p>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-ink-muted">
                      <span className="size-1.5 rounded-full bg-red-500" />
                      02:34
                    </div>
                  </div>
                  <div className="rounded-xl bg-cream p-3.5 text-[13px] leading-5 text-ink">
                    Design a URL shortener system that can handle 100 million URLs and 200
                    million redirects per day. How would you design it?
                  </div>
                  <div className="flex h-8 items-end justify-center gap-[3px]">
                    {waveformHeights.map((h, i) => (
                      <span
                        key={i}
                        className="w-[3px] rounded-full bg-[#c4b5fd]"
                        style={{ height: h }}
                      />
                    ))}
                  </div>
                  <span className="mx-auto flex size-11 items-center justify-center rounded-full bg-[#8b5cf6]">
                    <Mic className="size-5 text-white" />
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3 border-t border-[#8b5cf6]/15 pt-6">
                <p className="text-xs font-bold uppercase tracking-wide text-ink-muted">
                  What you get evaluated on
                </p>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {practiceMetrics.map((metric) => (
                    <div key={metric.label} className="flex items-center gap-2">
                      <span
                        className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white"
                        style={{ color: metric.color }}
                      >
                        <metric.icon className="size-4" />
                      </span>
                      <div className="flex flex-col">
                        <p className="text-[11px] text-ink-muted">{metric.label}</p>
                        <p className="text-sm font-bold" style={{ color: metric.color }}>
                          {metric.value}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </JourneyRow>

          <JourneyRow
            number="04"
            color="#ec4899"
            title="EVALUATE"
            description="Know how you are performing"
          >
            <div className="flex flex-col gap-5 sm:flex-row">
              <div className="sm:flex-1">
                <CapabilityCard
                  icon={BarChart3}
                  iconBg="#fdf0f4"
                  iconColor="#ec4899"
                  title="Evaluation Metrics"
                  description="Detailed scorecard evaluating your logic, architecture, code quality, speed and communication."
                />
              </div>
              <div className="flex flex-col items-center gap-6 rounded-2xl border border-line bg-white p-6 sm:flex-1 sm:flex-row sm:items-center sm:gap-8">
                <div className="flex shrink-0 flex-col items-center gap-1 sm:items-start">
                  <p className="text-xs font-semibold uppercase text-ink-muted">Overall Score</p>
                  <p className="font-display text-4xl font-extrabold text-[#ec4899]">
                    84<span className="text-lg text-ink-muted">/100</span>
                  </p>
                </div>
                <div className="size-[220px] shrink-0">
                  <RadarChart data={radarData} color="#ec4899" />
                </div>
              </div>
            </div>
          </JourneyRow>

          <JourneyRow
            number="05"
            color="#3b82f6"
            title="IMPROVE"
            description="Fix weaknesses & get better"
          >
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {improveCards.map((card) => (
                <CapabilityCard key={card.title} {...card} />
              ))}
            </div>
          </JourneyRow>
        </div>

        <div className="flex w-full flex-col items-center gap-6 rounded-3xl border-2 border-dashed border-line-strong p-6 sm:p-8">
          <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:text-left">
            <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#3b82f6,#8b5cf6,#ec4899)]">
              <RefreshCw className="size-6 text-white" />
            </span>
            <p className="font-display text-lg font-extrabold text-ink">
              Continuous Improvement Loop
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-3">
            {loopSteps.map((step, i) => (
              <div key={step} className="flex items-center gap-2">
                <span className="rounded-full bg-cream px-4 py-2 text-sm font-semibold text-ink">
                  {step}
                </span>
                {i < loopSteps.length - 1 ? (
                  <ArrowRight className="size-4 shrink-0 text-line-strong" />
                ) : (
                  <RefreshCw className="size-4 shrink-0 text-brand" />
                )}
              </div>
            ))}
          </div>

          <p className="max-w-xl text-center text-sm leading-6 text-ink-muted">
            The more you practice, the smarter our AI gets. The smarter it gets, the better you
            perform.
          </p>
        </div>
      </div>
    </section>
  );
}
