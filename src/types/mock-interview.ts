export type InterviewType =
  | "technical"
  | "system-design"
  | "behavioral"
  | "resume-based"
  | "mixed";

export type DifficultyLevel = "standard" | "challenging" | "expert";

export interface RecommendedMock {
  id: string;
  role: string;
  title: string;
  interviewType: InterviewType;
  duration: number; // in minutes
  durationLabel: string; // e.g. "45 minutes"
  typeLabel: string; // e.g. "System Design"
  goalLabel: string; // e.g. "Focused on your current goals"
  description: string;
  focusAreas: string[];
  recommendationLabel: string; // e.g. "Recommended for you"
  startUrl: string;
  customizeUrl: string;
}

export interface InterviewTypeOption {
  type: InterviewType;
  title: string;
  description: string;
  duration: string;
  iconBg: string;
  iconColor: string;
  href: string;
}

export interface MockInterviewHistoryItem {
  id: string;
  date: string;
  type: InterviewType;
  typeLabel: string;
  role: string;
  focus: string;
  duration: string;
  score: number;
  reportUrl: string;
}

export interface InterviewConfiguration {
  interviewType: InterviewType;
  targetRole: string;
  difficulty: DifficultyLevel;
  durationMinutes: number;
  focusAreas: string[];
}
