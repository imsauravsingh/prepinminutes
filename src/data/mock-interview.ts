import type {
  RecommendedMock,
  InterviewTypeOption,
  MockInterviewHistoryItem,
  InterviewConfiguration,
  DifficultyLevel,
} from "@/types/mock-interview";

export const defaultRecommendedMock: RecommendedMock = {
  id: "rec-system-design-senior",
  role: "Senior Software Engineer",
  title: "System Design Mock Interview",
  interviewType: "system-design",
  duration: 45,
  durationLabel: "45 minutes",
  typeLabel: "System Design",
  goalLabel: "Focused on your current goals",
  description:
    "Based on your preparation and recent performance, this mock interview focuses on trade-offs, scalability and failure handling.",
  focusAreas: ["Trade-offs", "Scalability", "Failure Handling"],
  recommendationLabel: "Recommended for you",
  startUrl: "/mock-interview/interview-session",
  customizeUrl: "/mock-interview/configure",
};

export const defaultInterviewTypes: InterviewTypeOption[] = [
  {
    type: "technical",
    title: "Technical",
    description: "Core concepts, problem solving and technical depth.",
    duration: "30 – 45 min",
    iconBg: "bg-[#eff6ff]",
    iconColor: "text-[#2563eb]",
    href: "/practice/session/coding",
  },
  {
    type: "system-design",
    title: "System Design",
    description: "Architecture, scalability, reliability and trade-offs.",
    duration: "45 – 60 min",
    iconBg: "bg-[#e6fbf9]",
    iconColor: "text-[#0d9488]",
    href: "/practice/session/system-design",
  },
  {
    type: "behavioral",
    title: "Behavioral",
    description: "Leadership, ownership, collaboration and STAR approach.",
    duration: "20 – 40 min",
    iconBg: "bg-[#f5efff]",
    iconColor: "text-[#7c3aed]",
    href: "/practice/session/behavioral",
  },
  {
    type: "resume-based",
    title: "Resume-Based",
    description: "Questions based on your resume, projects and experience.",
    duration: "30 – 45 min",
    iconBg: "bg-[#fff7ed]",
    iconColor: "text-[#ea580c]",
    href: "/practice/session/behavioral",
  },
  {
    type: "mixed",
    title: "Mixed",
    description:
      "Combination of technical, system design, resume and behavioral questions.",
    duration: "45 – 60 min",
    iconBg: "bg-[#fef2f2]",
    iconColor: "text-[#e11d48]",
    href: "/practice/choose-topic",
  },
];

export const defaultMockInterviewHistory: MockInterviewHistoryItem[] = [
  {
    id: "hist-1",
    date: "Sep 24, 2025",
    type: "system-design",
    typeLabel: "System Design",
    role: "Senior Software Engineer",
    focus: "(Scalability & Architecture)",
    duration: "45 min",
    score: 68,
    reportUrl: "/session/system-design/evaluation",
  },
  {
    id: "hist-2",
    date: "Sep 20, 2025",
    type: "technical",
    typeLabel: "Technical",
    role: "Backend Engineer",
    focus: "(Node.js & APIs)",
    duration: "30 min",
    score: 64,
    reportUrl: "/practice/session/coding/evaluation",
  },
  {
    id: "hist-3",
    date: "Sep 16, 2025",
    type: "behavioral",
    typeLabel: "Behavioral",
    role: "Senior Software Engineer",
    focus: "(Leadership & Ownership)",
    duration: "30 min",
    score: 71,
    reportUrl: "/behavioral/evaluation",
  },
];

export const targetRoleOptions = [
  "Senior Software Engineer",
  "Staff Software Engineer",
  "Backend Engineer",
  "Full Stack Engineer",
  "Frontend Engineer",
  "Engineering Manager",
];

export const difficultyOptions: {
  id: DifficultyLevel;
  label: string;
}[] = [
  { id: "standard", label: "Standard" },
  { id: "challenging", label: "Challenging" },
  { id: "expert", label: "Expert" },
];

export const durationOptions = [20, 30, 45, 60];

export const focusAreaOptions = [
  "Scalability",
  "Trade-offs",
  "Failure Handling",
  "Technical Depth",
  "Problem Solving",
  "Communication",
  "Leadership",
  "Behavioral",
  "Resume",
];

export const defaultConfiguration: InterviewConfiguration = {
  interviewType: "system-design",
  targetRole: "Senior Software Engineer",
  difficulty: "standard",
  durationMinutes: 45,
  focusAreas: ["Scalability", "Trade-offs", "Failure Handling"],
};
