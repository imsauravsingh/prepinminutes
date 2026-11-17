/**
 * PrepInMinutes — Frontend-to-Backend Edge API Client
 *
 * Connects the static Next.js frontend (`prepinminutes.com`) to the dedicated
 * Cloudflare Workers backend service (`prepinminutes-backend` / `api.prepinminutes.com`).
 */

import {
  CurriculumDomainsResponse,
  CurriculumHierarchyResponse,
  TopicDetailResponse,
  TopicQuestionsResponse,
} from "@/types/curriculum";
import {
  AUTH_TOKEN_STORAGE_KEY,
  AUTH_USER_STORAGE_KEY,
  AUTH_COOKIE_NAME,
  getClientAuthToken,
  clearClientAuthSession,
} from "./auth-cookie";

export {
  AUTH_TOKEN_STORAGE_KEY,
  AUTH_USER_STORAGE_KEY,
  AUTH_COOKIE_NAME,
  getClientAuthToken,
  clearClientAuthSession,
};

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://api.prepinminutes.com"
    : "http://localhost:8787");

export interface AuthenticatedCandidateUser {
  id: string;
  username?: string | null;
  googleId?: string | null;
  clerkId?: string | null;
  email: string;
  emailVerified?: boolean;
  fullName: string | null;
  avatarUrl: string | null;
  authProvider: "google" | "credentials" | "clerk";
  hasCompletedOnboarding?: boolean;
  createdAt?: string | Date;
  hasPassword?: boolean;
}

export interface SsoConfigResponse {
  success: boolean;
  activeProvider: "google" | "clerk" | "both";
  googleEnabled: boolean;
  clerkEnabled: boolean;
  googleFlow: "redirect" | "id_token" | "both";
  googleClientId: string;
}

export interface RequestOptions {
  clerkId?: string | null;
  candidateId?: string | null;
  token?: string | null;
  idempotencyKey?: string;
  headers?: Record<string, string>;
}

function getStoredAuthToken(): string | null {
  return getClientAuthToken();
}

function buildHeaders(
  options: RequestOptions = {},
  isJson = true,
): Record<string, string> {
  const headers: Record<string, string> = {
    ...(isJson ? { "Content-Type": "application/json" } : {}),
    ...(options.headers || {}),
  };

  const resolvedId = options.candidateId || options.clerkId;
  if (resolvedId) {
    headers["x-candidate-id"] = resolvedId;
    headers["x-candidate-clerk-id"] = resolvedId;
  }

  const resolvedToken = options.token || getStoredAuthToken();
  if (resolvedToken) {
    headers["Authorization"] = `Bearer ${resolvedToken}`;
  }

  if (options.idempotencyKey) {
    headers["idempotency-key"] = options.idempotencyKey;
  }

  return headers;
}

export type RetentionBand =
  | "CRITICAL"
  | "NEEDS_REINFORCEMENT"
  | "STABLE"
  | "MASTERED";

export interface RevisionTopicSummary {
  id: string;
  title: string;
  slug: string;
  difficulty: string;
  practiceHref: string;
}

export interface RevisionItemDto {
  id: string;
  candidateId: string;
  topicId: string;
  topicTitle: string;
  domain: string;
  recallStrength: number;
  retentionBand: RetentionBand;
  relevance: string;
  recommendedMin: number;
  intervalDays: number;
  easeFactor: number;
  repetitions: number;
  nextReviewDate: string;
  lastReviewedAt?: string | null;
  createdAt: string;
  isDue?: boolean;
  topic?: RevisionTopicSummary;
}

export interface RevisionItemsResponse {
  success: boolean;
  totalDue: number;
  stats?: {
    totalDue: number;
    criticalCount: number;
    needsReinforcementCount: number;
    stableCount: number;
    masteredCount: number;
  };
  items: RevisionItemDto[];
}

export interface RevisionRecallPayload {
  revisionItemId?: string;
  topicSlug?: string;
  qualityGrade?: number; // 0 - 5
  sessionScore?: number; // 0 - 100
}

export interface RevisionRecallResponse {
  success: boolean;
  updatedItem: RevisionItemDto;
  sm2Output: {
    repetitions: number;
    intervalDays: number;
    easeFactor: number;
    qualityGrade: number;
    nextReviewDate: string;
    retentionBand: RetentionBand;
    recallStrength: number;
  };
}

export class ApiError extends Error {
  status: number;
  code?: string;
  data?: Record<string, unknown>;

  constructor(
    message: string,
    status: number,
    code?: string,
    data?: Record<string, unknown>,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.data = data;
  }
}

async function handleResponse<T>(res: Response): Promise<T> {
  const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  if (!res.ok) {
    if (res.status === 401 && typeof window !== "undefined") {
      clearClientAuthSession();
      const currentPath = window.location.pathname;
      const isPublicPath =
        currentPath === "/" ||
        currentPath.startsWith("/login") ||
        currentPath.startsWith("/sign-up") ||
        currentPath.startsWith("/forgot-password") ||
        currentPath.startsWith("/reset-password") ||
        currentPath.startsWith("/privacy-policy") ||
        currentPath.startsWith("/coming-soon") ||
        currentPath.startsWith("/admin");

      if (!isPublicPath) {
        window.location.href = `/login?redirect=${encodeURIComponent(
          window.location.pathname + window.location.search
        )}&session_expired=1`;
      }
    }

    const errorObj = (data as { error?: any })?.error;
    const message =
      (data as { message?: string })?.message ||
      (typeof errorObj === "string" ? errorObj : errorObj?.message) ||
      `API request failed with status ${res.status}`;
    const code = typeof errorObj === "string" ? errorObj : errorObj?.code;
    throw new ApiError(message, res.status, code, data);
  }
  return data as T;
}

export interface CandidateProfilePayload {
  targetRole: string;
  experienceLevel: string;
  fresherForte?: string | null;
  targetCompanies?: string[];
  timelineWeeks?: number;
  timelineLabel?: string;
  jobDescriptionText?: string | null;
  weeklyGoalHours?: number;
}

export interface PracticeSubmitPayload {
  domain?: string;
  topicSlug: string;
  questionId?: string;
  title?: string;
  durationSeconds?: number;
  codeSubmission?: string;
  codeLanguage?: string;
  whiteboardUrl?: string;
  whiteboardData?: Record<string, unknown> | null;
  transcriptHistory?: Array<{
    sender: "ai" | "user";
    content: string;
    timestamp?: string;
  }>;
  coveredRubricAtoms?: string[];
  candidateNotes?: string;
}

export interface EvaluationReportDetail {
  id: string;
  candidateId?: string;
  practiceId?: string;
  mockId?: string;
  title?: string;
  evaluatorName: string;
  evaluatorRole: string;
  overallScore: number;
  verdict: "Strong Hire" | "Hire" | "Leaning Hire" | "Needs Practice" | string;
  percentileRank?: number;
  priorReadinessScore?: number;
  newReadinessScore?: number;
  readinessDelta: number;
  evaluatorNotes: string;
  strengths: string[];
  improvements: string[];
  rubricScores: Array<{
    id: string;
    dimension: string;
    score: number;
    assessment: string;
    missingAtoms: string[];
  }>;
  practiceSession?: {
    id: string;
    domain: string;
    topicSlug: string;
    title: string;
    durationSeconds: number;
    status: string;
    codeLanguage?: string;
    codeSubmission?: string;
    whiteboardUrl?: string;
    diagramJson?: any;
    chatHistory?: any;
    architectureNotes?: string;
  };
  createdAt: string;
}

export interface MockInterviewStartPayload {
  interviewType?: string;
  targetRole?: string;
  difficulty?: string;
  durationMinutes?: number;
}

export interface MockInterviewEndPayload {
  sessionId: string;
  transcript: Array<{ speaker: string; text: string }> | string;
  durationMinutes?: number;
}

export const backendApi = {
  /**
   * GET /api/health
   */
  async checkHealth() {
    const res = await fetch(`${API_BASE_URL}/api/health`, {
      method: "GET",
    });
    return handleResponse<{
      status: string;
      service: string;
      runtime: string;
      timestamp: string;
    }>(res);
  },

  /**
   * GET /api/auth/config
   */
  async getAuthConfig(): Promise<SsoConfigResponse> {
    const res = await fetch(`${API_BASE_URL}/api/auth/config`, {
      method: "GET",
      credentials: "include",
    });
    return handleResponse<SsoConfigResponse>(res);
  },

  /**
   * Returns the full backend OAuth 2.0 Redirect initiation URL (`GET /api/auth/google`).
   */
  getGoogleOAuthRedirectUrl(redirectPath = "/dashboard"): string {
    const url = new URL(`${API_BASE_URL}/api/auth/google`);
    url.searchParams.set("redirect_url", redirectPath);
    return url.toString();
  },

  /**
   * POST /api/auth/google/token
   * Flow 2: Exchanges a Google Identity Services (GIS) ID token for a PrepInMinutes session JWT.
   */
  async verifyGoogleIdToken(idToken: string) {
    const res = await fetch(`${API_BASE_URL}/api/auth/google/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
      credentials: "include",
    });
    return handleResponse<{
      success: boolean;
      token: string;
      user: AuthenticatedCandidateUser;
    }>(res);
  },

  /**
   * POST /api/auth/login
   * Authenticates candidate with identifier (username or email) and password.
   */
  async loginWithCredentials(payload: {
    identifier: string;
    password: string;
  }) {
    const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "include",
    });
    return handleResponse<{
      success: boolean;
      token: string;
      user: AuthenticatedCandidateUser;
    }>(res);
  },

  /**
   * POST /api/auth/register
   * Registers a new candidate with username, email, password, and confirmPassword.
   */
  async registerWithCredentials(payload: {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) {
    const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "include",
    });
    return handleResponse<{
      success: boolean;
      requiresVerification?: boolean;
      email?: string;
      message?: string;
      token?: string;
      user?: AuthenticatedCandidateUser;
      devCode?: string;
    }>(res);
  },

  /**
   * POST /api/auth/verify-email
   * Verifies candidate's 6-digit OTP code and activates the account.
   */
  async verifyEmail(payload: { email: string; code: string }) {
    const res = await fetch(`${API_BASE_URL}/api/auth/verify-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "include",
    });
    return handleResponse<{
      success: boolean;
      message: string;
      token: string;
      user: AuthenticatedCandidateUser;
    }>(res);
  },

  /**
   * POST /api/auth/resend-verification
   * Requests a fresh 6-digit OTP verification code.
   */
  async resendVerification(payload: { email: string }) {
    const res = await fetch(`${API_BASE_URL}/api/auth/resend-verification`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "include",
    });
    return handleResponse<{
      success: boolean;
      message: string;
      devCode?: string;
    }>(res);
  },

  /**
   * POST /api/auth/forgot-password
   * Dispatches a 6-digit password reset OTP to candidate's email.
   */
  async forgotPassword(payload: { email: string }) {
    const res = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "include",
    });
    return handleResponse<{
      success: boolean;
      message: string;
      devCode?: string;
    }>(res);
  },

  /**
   * POST /api/auth/verify-reset-code
   * Verifies the 6-digit reset code before new password entry.
   */
  async verifyResetCode(payload: { email: string; code: string }) {
    const res = await fetch(`${API_BASE_URL}/api/auth/verify-reset-code`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "include",
    });
    return handleResponse<{
      success: boolean;
      valid: boolean;
      message: string;
    }>(res);
  },

  /**
   * POST /api/auth/reset-password
   * Sets new password using verified 6-digit code.
   */
  async resetPassword(payload: {
    email: string;
    code: string;
    newPassword: string;
    confirmPassword?: string;
  }) {
    const res = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "include",
    });
    return handleResponse<{
      success: boolean;
      message: string;
      token: string;
      user: AuthenticatedCandidateUser;
    }>(res);
  },

  /**
   * GET /api/auth/me
   */
  async getAuthMe(token?: string | null) {
    const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
      method: "GET",
      headers: buildHeaders({ token }),
      credentials: "include",
    });
    return handleResponse<{
      authenticated: boolean;
      user: AuthenticatedCandidateUser | null;
      profile: Record<string, unknown> | null;
    }>(res);
  },

  /**
   * POST /api/auth/logout
   */
  async logout() {
    const res = await fetch(`${API_BASE_URL}/api/auth/logout`, {
      method: "POST",
      headers: buildHeaders(),
      credentials: "include",
    });
    return handleResponse<{ success: boolean }>(res);
  },

  /**
   * PATCH /api/user/profile
   * Updates personal profile information (fullName, username, avatarUrl).
   */
  async updateUserProfile(
    payload: {
      fullName?: string;
      username?: string;
      avatarUrl?: string | null;
    },
    token?: string | null,
  ) {
    const res = await fetch(`${API_BASE_URL}/api/user/profile`, {
      method: "PATCH",
      headers: buildHeaders({ token }),
      body: JSON.stringify(payload),
      credentials: "include",
    });
    return handleResponse<{
      success: boolean;
      message: string;
      user: AuthenticatedCandidateUser;
    }>(res);
  },

  /**
   * POST /api/auth/change-password
   * Sets or updates the candidate's account password.
   */
  async changePassword(
    payload: {
      currentPassword?: string;
      newPassword: string;
      confirmPassword?: string;
    },
    token?: string | null,
  ) {
    const res = await fetch(`${API_BASE_URL}/api/auth/change-password`, {
      method: "POST",
      headers: buildHeaders({ token }),
      body: JSON.stringify(payload),
      credentials: "include",
    });
    return handleResponse<{
      success: boolean;
      message: string;
      hasPassword?: boolean;
    }>(res);
  },

  /**
   * GET /api/onboarding/profile
   */
  async getProfile(options: RequestOptions = {}) {
    const res = await fetch(`${API_BASE_URL}/api/onboarding/profile`, {
      method: "GET",
      headers: buildHeaders(options),
      credentials: "include",
    });
    return handleResponse<{
      success: boolean;
      profile: Record<string, any> | null;
      activePlan: Record<string, any> | null;
    }>(res);
  },

  /**
   * POST /api/onboarding/profile
   */
  async saveProfile(
    payload: CandidateProfilePayload,
    options: RequestOptions = {},
  ) {
    const res = await fetch(`${API_BASE_URL}/api/onboarding/profile`, {
      method: "POST",
      headers: buildHeaders(options),
      body: JSON.stringify(payload),
      credentials: "include",
    });
    return handleResponse<{
      success: boolean;
      profile: Record<string, any>;
      activePlan: Record<string, any>;
    }>(res);
  },

  /**
   * POST /api/onboarding/profile/reset
   * Resets the candidate profile and archives active draft preparation plan.
   */
  async resetProfile(options: RequestOptions = {}) {
    const res = await fetch(`${API_BASE_URL}/api/onboarding/profile/reset`, {
      method: "POST",
      headers: buildHeaders(options),
      credentials: "include",
    });
    return handleResponse<{
      success: boolean;
      message: string;
    }>(res);
  },

  /**
   * GET /api/platform/config
   * Fetches public platform configuration and admin flags.
   */
  async getPlatformConfig(options: RequestOptions = {}) {
    const res = await fetch(`${API_BASE_URL}/api/platform/config`, {
      method: "GET",
      headers: buildHeaders(options),
      credentials: "include",
    });
    return handleResponse<{
      success: boolean;
      config: Record<string, any>;
      enableNextStepFlow: boolean;
    }>(res);
  },

  /**
   * POST /api/admin/settings
   * Updates platform setting toggles (e.g. enableNextStepFlow).
   */
  async updatePlatformConfig(
    payload: { enableNextStepFlow?: boolean; [key: string]: any },
    options: RequestOptions = {},
  ) {
    const res = await fetch(`${API_BASE_URL}/api/admin/settings`, {
      method: "POST",
      headers: buildHeaders(options),
      body: JSON.stringify(payload),
      credentials: "include",
    });
    return handleResponse<{
      success: boolean;
      enableNextStepFlow?: boolean;
      message?: string;
    }>(res);
  },

  /**
   * POST /api/onboarding/resume
   */
  async uploadResume(file: File, options: RequestOptions = {}) {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${API_BASE_URL}/api/onboarding/resume`, {
      method: "POST",
      headers: buildHeaders(options, false),
      body: formData,
      credentials: "include",
    });
    return handleResponse<{
      success: boolean;
      fileName?: string;
      chunksProcessed: number;
      r2AssetUrl: string | null;
      extractedPreview: string;
    }>(res);
  },

  /**
   * POST /api/plan/generate
   */
  async generatePreparationPlan(options: RequestOptions = {}) {
    const res = await fetch(`${API_BASE_URL}/api/plan/generate`, {
      method: "POST",
      headers: buildHeaders(options),
      credentials: "include",
    });
    return handleResponse<{
      success: boolean;
      plan: Record<string, unknown>;
    }>(res);
  },

  async generatePlan(options: RequestOptions = {}) {
    return this.generatePreparationPlan(options);
  },

  /**
   * POST /api/practice/session/submit
   */
  async submitPracticeSession(
    payload: PracticeSubmitPayload,
    options: RequestOptions & { idempotencyKey?: string } = {},
  ) {
    const customHeaders: Record<string, string> = {};
    if (options.idempotencyKey) {
      customHeaders["idempotency-key"] = options.idempotencyKey;
      customHeaders["x-session-attempt-id"] = options.idempotencyKey;
    }

    const headers = {
      ...buildHeaders(options),
      ...customHeaders,
    };

    const res = await fetch(`${API_BASE_URL}/api/practice/session/submit`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
      credentials: "include",
    });
    return handleResponse<{
      success: boolean;
      sessionId: string;
      reportId: string;
      reportUrl?: string;
      overallScore: number;
      verdict: string;
      readinessDelta: number;
      newReadiness: number;
      report: Record<string, unknown>;
    }>(res);
  },

  /**
   * GET /api/evaluation/:reportId
   */
  async getEvaluationReport(reportId: string, options: RequestOptions = {}) {
    const cleanId = reportId.replace(/^report\//, "").trim();
    const res = await fetch(`${API_BASE_URL}/api/evaluation/${cleanId}`, {
      method: "GET",
      headers: buildHeaders(options),
      credentials: "include",
    });
    return handleResponse<{
      success: boolean;
      report: EvaluationReportDetail;
    }>(res);
  },

  /**
   * POST /api/mock-interview/session/start
   */
  async startMockInterview(
    payload: MockInterviewStartPayload,
    options: RequestOptions,
  ) {
    const res = await fetch(
      `${API_BASE_URL}/api/mock-interview/session/start`,
      {
        method: "POST",
        headers: buildHeaders(options),
        body: JSON.stringify(payload),
        credentials: "include",
      },
    );
    return handleResponse<{
      success: boolean;
      session: Record<string, unknown>;
      voiceConfig: {
        sttModel: string;
        ttsModel: string;
        deepgramWsUrl: string;
      };
    }>(res);
  },

  /**
   * POST /api/mock-interview/session/end
   */
  async endMockInterview(
    payload: MockInterviewEndPayload,
    options: RequestOptions,
  ) {
    const res = await fetch(`${API_BASE_URL}/api/mock-interview/session/end`, {
      method: "POST",
      headers: buildHeaders(options),
      body: JSON.stringify(payload),
      credentials: "include",
    });
    return handleResponse<{
      success: boolean;
      sessionId: string;
      reportId: string;
      overallScore: number;
      verdict: string;
      readinessDelta: number;
      newReadiness: number;
      report: Record<string, unknown>;
    }>(res);
  },

  /**
   * GET /api/revision/items
   */
  async getRevisionItems(
    query?: boolean | { dueOnly?: boolean; domain?: string },
    options: RequestOptions = {},
  ): Promise<RevisionItemsResponse> {
    const dueOnly = typeof query === "boolean" ? query : query?.dueOnly;
    const domain = typeof query === "object" ? query?.domain : undefined;

    const params = new URLSearchParams();
    if (dueOnly !== undefined) params.set("dueOnly", String(dueOnly));
    if (domain) params.set("domain", domain);

    const queryString = params.toString() ? `?${params.toString()}` : "";
    const res = await fetch(
      `${API_BASE_URL}/api/revision/items${queryString}`,
      {
        method: "GET",
        headers: buildHeaders(options),
        credentials: "include",
      },
    );
    return handleResponse<RevisionItemsResponse>(res);
  },

  /**
   * POST /api/revision/items (or /api/revision/item/recall)
   */
  async submitRevisionRecall(
    payload: string | RevisionRecallPayload,
    sessionScoreOrOptions?: number | RequestOptions,
    maybeOptions: RequestOptions = {},
  ): Promise<RevisionRecallResponse> {
    let body: RevisionRecallPayload;
    let options: RequestOptions = maybeOptions;

    if (typeof payload === "string") {
      // Backwards-compatible signature: (revisionItemId, sessionScore, options)
      body = {
        revisionItemId: payload,
        sessionScore:
          typeof sessionScoreOrOptions === "number"
            ? sessionScoreOrOptions
            : undefined,
      };
    } else {
      body = payload;
      if (
        typeof sessionScoreOrOptions === "object" &&
        sessionScoreOrOptions !== null
      ) {
        options = sessionScoreOrOptions;
      }
    }

    const res = await fetch(`${API_BASE_URL}/api/revision/items`, {
      method: "POST",
      headers: buildHeaders(options),
      body: JSON.stringify(body),
      credentials: "include",
    });
    return handleResponse<RevisionRecallResponse>(res);
  },

  /**
   * GET /api/voice/session/config
   */
  async getVoiceSessionConfig(options: RequestOptions = {}) {
    const res = await fetch(`${API_BASE_URL}/api/voice/session/config`, {
      method: "GET",
      headers: buildHeaders(options),
      credentials: "include",
    });
    return handleResponse<{
      success: boolean;
      deepgramAvailable: boolean;
      cartesiaAvailable: boolean;
      elevenLabsAvailable: boolean;
      sttModel: string;
      ttsModel: string;
      preferredVoice: string;
      voiceId: string;
      sampleRate: number;
      turnBudgetMs: number;
      streamingSupported: boolean;
      deepgramWsUrl: string;
      availableVoices: Array<{ id: string; name: string; role: string }>;
    }>(res);
  },

  /**
   * POST /api/voice/session/interrupt
   * Signals a candidate barge-in interruption to halt AI playback immediately.
   */
  async interruptVoiceSession(
    payload: { sessionId?: string; source?: string; timestampMs?: number } = {},
    options: RequestOptions = {},
  ) {
    const res = await fetch(`${API_BASE_URL}/api/voice/session/interrupt`, {
      method: "POST",
      headers: buildHeaders(options),
      body: JSON.stringify(payload),
      credentials: "include",
    });
    return handleResponse<{
      success: boolean;
      interrupted: boolean;
      previousState: string;
      newState: string;
      latencyMs: number;
      clearAudioBuffer: boolean;
      timestamp: number;
      telemetry?: Record<string, unknown>;
    }>(res);
  },

  /**
   * POST /api/voice/synthesize
   */
  async synthesizeVoice(
    text: string,
    options: RequestOptions,
    voiceId?: string,
  ): Promise<ArrayBuffer> {
    const res = await fetch(`${API_BASE_URL}/api/voice/synthesize`, {
      method: "POST",
      headers: buildHeaders(options),
      body: JSON.stringify({ text, voiceId }),
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error(`Voice synthesis failed with status ${res.status}`);
    }
    return res.arrayBuffer();
  },

  /**
   * POST /api/voice/transcribe
   */
  async transcribeVoice(
    audioBlob: Blob,
    options: RequestOptions = {},
  ): Promise<{ success: boolean; transcript: string; confidence: number }> {
    const headers = buildHeaders(options, false);
    headers["Content-Type"] = audioBlob.type || "audio/webm";

    const res = await fetch(`${API_BASE_URL}/api/voice/transcribe`, {
      method: "POST",
      headers,
      body: audioBlob,
      credentials: "include",
    });
    return handleResponse<{
      success: boolean;
      transcript: string;
      confidence: number;
    }>(res);
  },

  /**
   * POST /api/ai-assessment/start
   */
  async startAiAssessment(
    payload: {
      targetRole?: string;
      experienceLevel?: string;
      targetCompanies?: string[];
      daysRemaining?: number;
      dailyCommitmentHours?: number;
      resumeSummary?: string;
      jobDescription?: string;
    } = {},
    options: RequestOptions = {},
  ) {
    const res = await fetch(`${API_BASE_URL}/api/ai-assessment/start`, {
      method: "POST",
      headers: buildHeaders(options),
      body: JSON.stringify(payload),
      credentials: "include",
    });
    return handleResponse<{
      success: boolean;
      sessionId: string;
      welcomeMessage: string;
      careerLevel: string;
      specialization: string;
      categories: Array<{ id: string; name: string }>;
      diagnosticQuestions: Array<{
        id: string;
        text: string;
        category: string;
        difficulty: string;
        expectedDepth: string;
      }>;
    }>(res);
  },

  /**
   * POST /api/ai-assessment/finish
   */
  async finishAiAssessment(
    payload: {
      sessionId: string;
      durationSeconds?: number;
      transcript: Array<{
        role: "assistant" | "user";
        text: string;
        timestamp?: string;
        durationSeconds?: number;
      }>;
      questions?: Array<{
        id: string;
        text: string;
        category: string;
        difficulty: string;
        expectedDepth: string;
      }>;
      codeSnippets?: Array<{
        code: string;
        language: string;
        notes?: string;
      }>;
    },
    options: RequestOptions = {},
  ) {
    const res = await fetch(`${API_BASE_URL}/api/ai-assessment/finish`, {
      method: "POST",
      headers: buildHeaders(options),
      body: JSON.stringify(payload),
      credentials: "include",
    });
    return handleResponse<{
      success: boolean;
      overallScore: number;
      readinessScore: number;
      readinessDelta: number;
      verdict: string;
      evaluatorNotes: string;
      strengths: string[];
      blindSpots: string[];
      questionBreakdown?: Array<{
        questionNumber: number;
        category: string;
        questionPrompt: string;
        candidateAnswer: string;
        modelAnswer: string;
        keyPointsCovered: string[];
        keyPointsMissed: string[];
        scorePercentage: number;
      }>;
      scoreFormula?: string;
      plan: Record<string, unknown>;
    }>(res);
  },

  // -------------------------------------------------------------
  // Admin Control Plane APIs
  // -------------------------------------------------------------

  /**
   * POST /api/admin/auth/login
   */
  async adminLogin(email: string, password: string) {
    const res = await fetch(`${API_BASE_URL}/api/admin/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });
    return handleResponse<{
      success: boolean;
      user: {
        id: string;
        email: string;
        fullName: string | null;
        avatarUrl?: string | null;
        role: string;
        adminApprovalStatus: string;
      };
    }>(res);
  },

  /**
   * POST /api/admin/auth/google
   */
  async adminGoogleAuth(idToken: string) {
    const res = await fetch(`${API_BASE_URL}/api/admin/auth/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
      credentials: "include",
    });
    return handleResponse<{
      success: boolean;
      isApproved: boolean;
      redirectTo: string;
      user: {
        id: string;
        email: string;
        fullName: string | null;
        avatarUrl?: string | null;
        role: string;
        adminApprovalStatus: string;
        requestReason?: string | null;
      };
    }>(res);
  },

  /**
   * POST /api/admin/auth/request-access
   */
  async adminRequestAccess(payload: {
    email: string;
    requestedRole: string;
    requestReason: string;
  }) {
    const res = await fetch(`${API_BASE_URL}/api/admin/auth/request-access`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "include",
    });
    return handleResponse<{
      success: boolean;
      message: string;
      user: Record<string, unknown>;
    }>(res);
  },

  /**
   * GET /api/admin/auth/me
   */
  async getAdminMe() {
    const res = await fetch(`${API_BASE_URL}/api/admin/auth/me`, {
      method: "GET",
      credentials: "include",
    });
    return handleResponse<{
      success: boolean;
      user: {
        id: string;
        email: string;
        fullName: string | null;
        avatarUrl?: string | null;
        role: string;
        adminApprovalStatus: string;
        isRootHod: boolean;
      };
    }>(res);
  },

  /**
   * POST /api/admin/auth/logout
   */
  async adminLogout() {
    const res = await fetch(`${API_BASE_URL}/api/admin/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    return handleResponse<{ success: boolean; message: string }>(res);
  },

  // ==========================================
  // Neo4j Knowledge Graph Admin API Methods
  // ==========================================

  /**
   * GET /api/admin/neo4j/overview
   */
  async getNeo4jOverview() {
    const res = await fetch(`${API_BASE_URL}/api/admin/neo4j/overview`, {
      method: "GET",
      credentials: "include",
    });
    return handleResponse<{
      success: boolean;
      stats: {
        domains: number;
        categories: number;
        topics: { total: number; live: number; draft: number };
        questions: { total: number; live: number; draft: number };
        pendingTeamRequests: number;
      };
    }>(res);
  },

  /**
   * GET /api/admin/neo4j/domains
   */
  async getNeo4jDomains() {
    const res = await fetch(`${API_BASE_URL}/api/admin/neo4j/domains`, {
      method: "GET",
      credentials: "include",
    });
    return handleResponse<{
      success: boolean;
      domains: Array<{
        slug: string;
        name: string;
        description: string;
        categoryCount: number;
      }>;
    }>(res);
  },

  /**
   * GET /api/admin/neo4j/categories
   */
  async getNeo4jCategories(params?: { domainSlug?: string; status?: string }) {
    const query = new URLSearchParams();
    if (params?.domainSlug) query.set("domainSlug", params.domainSlug);
    if (params?.status) query.set("status", params.status);
    const qs = query.toString() ? `?${query.toString()}` : "";

    const res = await fetch(`${API_BASE_URL}/api/admin/neo4j/categories${qs}`, {
      method: "GET",
      credentials: "include",
    });
    return handleResponse<{
      success: boolean;
      categories: Array<{
        slug: string;
        name: string;
        description: string;
        status: string;
        isLive: boolean;
        domainSlug: string;
        domainName: string;
        topicCount: number;
      }>;
    }>(res);
  },

  /**
   * POST /api/admin/neo4j/categories
   */
  async createNeo4jCategory(payload: {
    domainSlug: string;
    slug: string;
    name: string;
    description?: string;
    publishImmediately?: boolean;
  }) {
    const res = await fetch(`${API_BASE_URL}/api/admin/neo4j/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "include",
    });
    return handleResponse<{
      success: boolean;
      message: string;
      category: {
        slug: string;
        name: string;
        description: string;
        status: string;
        isLive: boolean;
        domainSlug: string;
      };
    }>(res);
  },

  /**
   * PUT /api/admin/neo4j/categories/:slug
   */
  async updateNeo4jCategory(
    slug: string,
    payload: { name: string; description?: string },
  ) {
    const res = await fetch(
      `${API_BASE_URL}/api/admin/neo4j/categories/${slug}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      },
    );
    return handleResponse<{ success: boolean; message: string }>(res);
  },

  /**
   * DELETE /api/admin/neo4j/categories/:slug
   */
  async deleteNeo4jCategory(slug: string) {
    const res = await fetch(
      `${API_BASE_URL}/api/admin/neo4j/categories/${slug}`,
      {
        method: "DELETE",
        credentials: "include",
      },
    );
    return handleResponse<{ success: boolean; message: string }>(res);
  },

  /**
   * GET /api/admin/neo4j/topics
   */
  async getNeo4jTopics(params?: {
    categorySlug?: string;
    domainSlug?: string;
    difficulty?: string;
    status?: string;
  }) {
    const query = new URLSearchParams();
    if (params?.categorySlug) query.set("categorySlug", params.categorySlug);
    if (params?.domainSlug) query.set("domainSlug", params.domainSlug);
    if (params?.difficulty) query.set("difficulty", params.difficulty);
    if (params?.status) query.set("status", params.status);
    const qs = query.toString() ? `?${query.toString()}` : "";

    const res = await fetch(`${API_BASE_URL}/api/admin/neo4j/topics${qs}`, {
      method: "GET",
      credentials: "include",
    });
    return handleResponse<{
      success: boolean;
      topics: Array<{
        slug: string;
        title: string;
        description: string;
        difficulty: string;
        rubricAtoms: string[];
        durationMin: number;
        status: string;
        isLive: boolean;
        categorySlug: string;
        categoryName: string;
        domainSlug: string;
        domainName: string;
        questionCount: number;
        prerequisiteFor?: string[];
      }>;
    }>(res);
  },

  /**
   * POST /api/admin/neo4j/topics
   */
  async createNeo4jTopic(payload: {
    categorySlug: string;
    slug: string;
    title: string;
    description?: string;
    difficulty?: string;
    rubricAtoms?: string[];
    durationMin?: number;
    publishImmediately?: boolean;
    prerequisites?: string[];
  }) {
    const res = await fetch(`${API_BASE_URL}/api/admin/neo4j/topics`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "include",
    });
    return handleResponse<{
      success: boolean;
      message: string;
      topic: {
        slug: string;
        title: string;
        status: string;
        isLive: boolean;
        categorySlug: string;
      };
    }>(res);
  },

  /**
   * PUT /api/admin/neo4j/topics/:slug
   */
  async updateNeo4jTopic(
    slug: string,
    payload: {
      title?: string;
      description?: string;
      difficulty?: string;
      rubricAtoms?: string[];
      durationMin?: number;
    },
  ) {
    const res = await fetch(`${API_BASE_URL}/api/admin/neo4j/topics/${slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "include",
    });
    return handleResponse<{ success: boolean; message: string }>(res);
  },

  /**
   * DELETE /api/admin/neo4j/topics/:slug
   */
  async deleteNeo4jTopic(slug: string) {
    const res = await fetch(`${API_BASE_URL}/api/admin/neo4j/topics/${slug}`, {
      method: "DELETE",
      credentials: "include",
    });
    return handleResponse<{ success: boolean; message: string }>(res);
  },

  /**
   * GET /api/admin/neo4j/questions
   */
  async getNeo4jQuestions(params?: {
    topicSlug?: string;
    difficulty?: string;
    status?: string;
  }) {
    const query = new URLSearchParams();
    if (params?.topicSlug) query.set("topicSlug", params.topicSlug);
    if (params?.difficulty) query.set("difficulty", params.difficulty);
    if (params?.status) query.set("status", params.status);
    const qs = query.toString() ? `?${query.toString()}` : "";

    const res = await fetch(`${API_BASE_URL}/api/admin/neo4j/questions${qs}`, {
      method: "GET",
      credentials: "include",
    });
    return handleResponse<{
      success: boolean;
      questions: Array<{
        id: string;
        title: string;
        prompt: string;
        difficulty: string;
        rubricGuide: string;
        hints: string[];
        status: string;
        isLive: boolean;
        version: number;
        topicSlug: string;
        topicTitle: string;
        categorySlug: string;
        categoryName: string;
      }>;
    }>(res);
  },

  /**
   * POST /api/admin/neo4j/questions
   */
  async createNeo4jQuestion(payload: {
    topicSlug: string;
    id?: string;
    title: string;
    prompt: string;
    difficulty?: string;
    rubricGuide?: string;
    hints?: string[];
    publishImmediately?: boolean;
  }) {
    const res = await fetch(`${API_BASE_URL}/api/admin/neo4j/questions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "include",
    });
    return handleResponse<{
      success: boolean;
      message: string;
      question: {
        id: string;
        title: string;
        status: string;
        isLive: boolean;
        topicSlug: string;
      };
    }>(res);
  },

  /**
   * PUT /api/admin/neo4j/questions/:id
   */
  async updateNeo4jQuestion(
    id: string,
    payload: {
      title?: string;
      prompt?: string;
      difficulty?: string;
      rubricGuide?: string;
      hints?: string[];
    },
  ) {
    const res = await fetch(`${API_BASE_URL}/api/admin/neo4j/questions/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "include",
    });
    return handleResponse<{ success: boolean; message: string }>(res);
  },

  /**
   * DELETE /api/admin/neo4j/questions/:id
   */
  async deleteNeo4jQuestion(id: string) {
    const res = await fetch(`${API_BASE_URL}/api/admin/neo4j/questions/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    return handleResponse<{ success: boolean; message: string }>(res);
  },

  /**
   * GET /api/admin/neo4j/pending
   */
  async getNeo4jPending() {
    const res = await fetch(`${API_BASE_URL}/api/admin/neo4j/pending`, {
      method: "GET",
      credentials: "include",
    });
    return handleResponse<{
      success: boolean;
      totalPending: number;
      categories: Array<{
        itemType: "Category";
        identifier: string;
        name: string;
        description: string;
        status: string;
        isLive: boolean;
        createdBy: string | null;
        createdAt: string | null;
        rejectionFeedback: string | null;
        parentContext: string;
      }>;
      topics: Array<{
        itemType: "Topic";
        identifier: string;
        name: string;
        description: string;
        difficulty: string;
        rubricAtoms: string[];
        status: string;
        isLive: boolean;
        createdBy: string | null;
        createdAt: string | null;
        rejectionFeedback: string | null;
        parentContext: string;
      }>;
      questions: Array<{
        itemType: "Question";
        identifier: string;
        name: string;
        prompt: string;
        difficulty: string;
        rubricGuide: string;
        hints: string[];
        status: string;
        isLive: boolean;
        createdBy: string | null;
        createdAt: string | null;
        rejectionFeedback: string | null;
        parentContext: string;
      }>;
    }>(res);
  },

  /**
   * POST /api/admin/neo4j/approve
   */
  async approveNeo4jNode(payload: {
    itemType: "Category" | "Topic" | "Question";
    identifier: string;
  }) {
    const res = await fetch(`${API_BASE_URL}/api/admin/neo4j/approve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "include",
    });
    return handleResponse<{
      success: boolean;
      message: string;
      itemType: string;
      identifier: string;
      status: string;
      isLive: boolean;
    }>(res);
  },

  /**
   * POST /api/admin/neo4j/reject
   */
  async rejectNeo4jNode(payload: {
    itemType: "Category" | "Topic" | "Question";
    identifier: string;
    feedbackReason: string;
  }) {
    const res = await fetch(`${API_BASE_URL}/api/admin/neo4j/reject`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "include",
    });
    return handleResponse<{
      success: boolean;
      message: string;
      itemType: string;
      identifier: string;
      status: string;
      isLive: boolean;
      feedbackReason: string;
    }>(res);
  },

  // ==========================================
  // Module A: Candidate Directory & Subscriptions
  // ==========================================

  /**
   * GET /api/admin/candidates
   */
  async getAdminCandidates(params?: {
    search?: string;
    tier?: string;
    isPlanOpted?: boolean;
    isBlocked?: boolean;
    page?: number;
    limit?: number;
  }) {
    const query = new URLSearchParams();
    if (params?.search) query.set("search", params.search);
    if (params?.tier && params.tier !== "ALL") query.set("tier", params.tier);
    if (params?.isPlanOpted !== undefined)
      query.set("isPlanOpted", String(params.isPlanOpted));
    if (params?.isBlocked !== undefined)
      query.set("isBlocked", String(params.isBlocked));
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    const qs = query.toString() ? `?${query.toString()}` : "";

    const res = await fetch(`${API_BASE_URL}/api/admin/candidates${qs}`, {
      method: "GET",
      credentials: "include",
    });
    return handleResponse<{
      success: boolean;
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      metrics: {
        totalCandidates: number;
        subscribedCandidates: number;
        freeTierCandidates: number;
        blockedCandidates: number;
      };
      candidates: Array<{
        id: string;
        email: string;
        fullName: string;
        avatarUrl: string | null;
        isBlocked: boolean;
        blockedReason: string | null;
        blockedAt: string | null;
        blockedBy: string | null;
        createdAt: string;
        targetRole: string;
        experienceLevel: string;
        readinessScore: number;
        isOnboardingDone: boolean;
        subscription: {
          tier: string;
          status: string;
          planName: string;
          isPlanOpted: boolean;
          pricePaid: number;
          voiceMinutesUsed: number;
          voiceMinutesLimit: number;
          mockInterviewsUsed: number;
          mockInterviewsLimit: number;
          currentPeriodEnd: string | null;
        };
      }>;
    }>(res);
  },

  /**
   * PATCH /api/admin/candidates/:id/subscription
   */
  async updateCandidateSubscription(
    id: string,
    payload: {
      tier?: string;
      isPlanOpted?: boolean;
      voiceMinutesLimit?: number;
      extendDays?: number;
    },
  ) {
    const res = await fetch(
      `${API_BASE_URL}/api/admin/candidates/${id}/subscription`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      },
    );
    return handleResponse<{
      success: boolean;
      message: string;
      subscription: any;
    }>(res);
  },

  /**
   * POST /api/admin/candidates/:id/block
   */
  async blockCandidate(id: string, reason: string) {
    const res = await fetch(
      `${API_BASE_URL}/api/admin/candidates/${id}/block`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
        credentials: "include",
      },
    );
    return handleResponse<{
      success: boolean;
      message: string;
      candidate: any;
    }>(res);
  },

  /**
   * POST /api/admin/candidates/:id/unblock
   */
  async unblockCandidate(id: string) {
    const res = await fetch(
      `${API_BASE_URL}/api/admin/candidates/${id}/unblock`,
      {
        method: "POST",
        credentials: "include",
      },
    );
    return handleResponse<{
      success: boolean;
      message: string;
      candidate: any;
    }>(res);
  },

  /**
   * POST /api/admin/candidates/:id/reset-quota
   */
  async resetCandidateQuota(id: string) {
    const res = await fetch(
      `${API_BASE_URL}/api/admin/candidates/${id}/reset-quota`,
      {
        method: "POST",
        credentials: "include",
      },
    );
    return handleResponse<{ success: boolean; message: string }>(res);
  },

  // ==========================================
  // Module B: HOD Team Management (Root Only)
  // ==========================================

  /**
   * GET /api/admin/team
   */
  async getAdminTeam() {
    const res = await fetch(`${API_BASE_URL}/api/admin/team`, {
      method: "GET",
      credentials: "include",
    });
    return handleResponse<{
      success: boolean;
      staff: Array<{
        id: string;
        email: string;
        fullName: string | null;
        avatarUrl: string | null;
        role: string;
        adminApprovalStatus: string;
        isBlocked: boolean;
        blockedReason: string | null;
        blockedAt: string | null;
        blockedBy: string | null;
        approvedAt: string | null;
        approvedBy: string | null;
        createdAt: string;
        isRootHod: boolean;
      }>;
    }>(res);
  },

  /**
   * GET /api/admin/team/pending
   */
  async getAdminTeamPending() {
    const res = await fetch(`${API_BASE_URL}/api/admin/team/pending`, {
      method: "GET",
      credentials: "include",
    });
    return handleResponse<{
      success: boolean;
      totalPending: number;
      requests: Array<{
        id: string;
        email: string;
        fullName: string;
        avatarUrl: string | null;
        requestedRole: string;
        requestReason: string;
        requestedAt: string;
      }>;
    }>(res);
  },

  /**
   * PATCH /api/admin/team/:id/approve
   */
  async approveStaffMember(id: string, role?: string) {
    const res = await fetch(`${API_BASE_URL}/api/admin/team/${id}/approve`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
      credentials: "include",
    });
    return handleResponse<{ success: boolean; message: string; user: any }>(
      res,
    );
  },

  /**
   * PATCH /api/admin/team/:id/reject
   */
  async rejectStaffMember(id: string) {
    const res = await fetch(`${API_BASE_URL}/api/admin/team/${id}/reject`, {
      method: "PATCH",
      credentials: "include",
    });
    return handleResponse<{ success: boolean; message: string }>(res);
  },

  /**
   * PATCH /api/admin/team/:id/role
   */
  async updateStaffRole(id: string, role: string) {
    const res = await fetch(`${API_BASE_URL}/api/admin/team/${id}/role`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
      credentials: "include",
    });
    return handleResponse<{ success: boolean; message: string; user: any }>(
      res,
    );
  },

  /**
   * POST /api/admin/team/:id/block
   */
  async blockStaffMember(id: string, reason: string) {
    const res = await fetch(`${API_BASE_URL}/api/admin/team/${id}/block`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason }),
      credentials: "include",
    });
    return handleResponse<{ success: boolean; message: string; user: any }>(
      res,
    );
  },

  /**
   * POST /api/admin/team/:id/unblock
   */
  async unblockStaffMember(id: string) {
    const res = await fetch(`${API_BASE_URL}/api/admin/team/${id}/unblock`, {
      method: "POST",
      credentials: "include",
    });
    return handleResponse<{ success: boolean; message: string; user: any }>(
      res,
    );
  },

  /**
   * GET /api/admin/team/audit-logs
   */
  async getAdminAuditLogs() {
    const res = await fetch(`${API_BASE_URL}/api/admin/team/audit-logs`, {
      method: "GET",
      credentials: "include",
    });
    return handleResponse<{
      success: boolean;
      logs: Array<{
        id: string;
        action: string;
        targetType: string;
        targetId: string;
        changeDiff: any;
        performedBy: string;
        performedByName: string;
        createdAt: string;
      }>;
    }>(res);
  },

  // ---------------------------------------------------------------------------
  // Unified Knowledge Graph Curriculum Endpoints (Phase 3 & Phase 4)
  // ---------------------------------------------------------------------------

  /**
   * GET /api/curriculum/domains
   * Returns list of canonical domains with catalog metadata and aggregated counts.
   * Supports ETag 304 caching.
   */
  async getCurriculumDomains(
    etag?: string,
  ): Promise<
    CurriculumDomainsResponse & { etag?: string | null; notModified?: boolean }
  > {
    const headers: Record<string, string> = {};
    if (etag) headers["If-None-Match"] = etag;
    const res = await fetch(`${API_BASE_URL}/api/curriculum/domains`, {
      method: "GET",
      headers,
    });
    if (res.status === 304) {
      return {
        success: true,
        domains: [],
        meta: {
          curriculumVersion: "",
          totalDomains: 0,
          totalCategories: 0,
          totalTopics: 0,
          totalQuestions: 0,
          dataSource: "cache",
        },
        etag,
        notModified: true,
      };
    }
    const newEtag = res.headers.get("ETag");
    const data = await handleResponse<CurriculumDomainsResponse>(res);
    return {
      ...data,
      etag: newEtag,
      notModified: false,
    };
  },

  /**
   * GET /api/curriculum/hierarchy/:domainSlug
   * Returns full 3-tier hierarchy (Domain -> Category -> Topic) with metadata.
   * Supports ETag 304 caching.
   */
  async getCurriculumHierarchy(
    domainSlug: string,
    etag?: string,
  ): Promise<
    CurriculumHierarchyResponse & {
      etag?: string | null;
      notModified?: boolean;
    }
  > {
    const headers: Record<string, string> = {};
    if (etag) headers["If-None-Match"] = etag;
    const res = await fetch(
      `${API_BASE_URL}/api/curriculum/hierarchy/${encodeURIComponent(domainSlug)}`,
      {
        method: "GET",
        headers,
      },
    );
    if (res.status === 304) {
      return {
        domainSlug,
        domainName: "",
        description: "",
        version: "",
        totalCategories: 0,
        totalTopics: 0,
        totalQuestions: 0,
        categories: [],
        etag,
        notModified: true,
      };
    }
    const newEtag = res.headers.get("ETag");
    const data = await handleResponse<CurriculumHierarchyResponse>(res);
    return {
      ...data,
      etag: newEtag,
      notModified: false,
    };
  },

  /**
   * GET /api/curriculum/topic/:topicSlug
   * Returns 8-layer deep metadata for a single topic.
   */
  async getCurriculumTopicDetail(
    topicSlug: string,
  ): Promise<TopicDetailResponse> {
    const res = await fetch(
      `${API_BASE_URL}/api/curriculum/topic/${encodeURIComponent(topicSlug)}`,
      {
        method: "GET",
      },
    );
    return handleResponse<TopicDetailResponse>(res);
  },

  /**
   * GET /api/curriculum/topic/:topicSlug/questions
   * Returns rich interview questions linked to this topic with optional filters.
   */
  async getCurriculumTopicQuestions(
    topicSlug: string,
    params?: { targetLevel?: string; difficulty?: string; limit?: number },
  ): Promise<TopicQuestionsResponse> {
    const query = new URLSearchParams();
    if (params?.targetLevel) query.set("targetLevel", params.targetLevel);
    if (params?.difficulty) query.set("difficulty", params.difficulty);
    if (params?.limit) query.set("limit", String(params.limit));
    const qs = query.toString();
    const url = `${API_BASE_URL}/api/curriculum/topic/${encodeURIComponent(topicSlug)}/questions${qs ? `?${qs}` : ""}`;
    const res = await fetch(url, { method: "GET" });
    return handleResponse<TopicQuestionsResponse>(res);
  },

  /**
   * POST /api/practice/session/turn
   * Submits candidate response turn and receives AiInterviewAgent's calibrated response,
   * rubric atom coverage, and targeted follow-up probes.
   */
  async submitPracticeSessionTurn(payload: {
    topicSlug: string;
    questionId?: string;
    candidateMessage: string;
    transcriptHistory?: Array<{ sender: "ai" | "user"; content: string }>;
    candidateTargetLevel?: string;
    agentConfig?: {
      agentName?: string;
      roleTitle?: string;
      companyContext?: string;
      strictness?: "lenient" | "standard" | "bar-raiser";
    };
  }): Promise<{
    success: boolean;
    replyText: string;
    coveredRubricAtoms: string[];
    remainingRubricAtoms: string[];
    detectedAntiPatterns: string[];
    currentMasteryScore: number;
    interviewPhase: string;
    nextSuggestedProbe?: string;
    evaluatorNotes?: string;
    agentInfo?: {
      name: string;
      role: string;
    };
  }> {
    const res = await fetch(`${API_BASE_URL}/api/practice/session/turn`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },
};
