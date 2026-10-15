/**
 * PrepInMinutes — Frontend-to-Backend Edge API Client
 *
 * Connects the static Next.js frontend (`prepinminutes.com`) to the dedicated
 * Cloudflare Workers backend service (`prepinminutes-backend` / `api.prepinminutes.com`).
 */

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://api.prepinminutes.com"
    : "http://localhost:8787");

export const AUTH_TOKEN_STORAGE_KEY = "pim_auth_token";
export const AUTH_USER_STORAGE_KEY = "pim_auth_user";

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
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

function buildHeaders(
  options: RequestOptions = {},
  isJson = true
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

export class ApiError extends Error {
  status: number;
  code?: string;
  data?: Record<string, unknown>;

  constructor(
    message: string,
    status: number,
    code?: string,
    data?: Record<string, unknown>
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
    const message =
      (data as { message?: string })?.message ||
      (data as { error?: string })?.error ||
      `API request failed with status ${res.status}`;
    const code = (data as { error?: string })?.error;
    throw new ApiError(message, res.status, code, data);
  }
  return data as T;
}

export interface CandidateProfilePayload {
  targetRole: string;
  experienceLevel: "0-2" | "3-5" | "6-9" | "10+";
  targetCompanies?: string[];
  timelineWeeks?: number;
  weeklyGoalHours?: number;
}

export interface PracticeSubmitPayload {
  domain?: string;
  topicSlug: string;
  title?: string;
  codeSubmission?: string;
  whiteboardUrl?: string;
  durationSeconds?: number;
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
  async loginWithCredentials(payload: { identifier: string; password: string }) {
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
    token?: string | null
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
    token?: string | null
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
  async getProfile(options: RequestOptions) {
    const res = await fetch(`${API_BASE_URL}/api/onboarding/profile`, {
      method: "GET",
      headers: buildHeaders(options),
      credentials: "include",
    });
    return handleResponse<{
      success: boolean;
      profile: Record<string, unknown>;
      plan: Record<string, unknown> | null;
    }>(res);
  },

  /**
   * POST /api/onboarding/profile
   */
  async saveProfile(payload: CandidateProfilePayload, options: RequestOptions) {
    const res = await fetch(`${API_BASE_URL}/api/onboarding/profile`, {
      method: "POST",
      headers: buildHeaders(options),
      body: JSON.stringify(payload),
      credentials: "include",
    });
    return handleResponse<{
      success: boolean;
      profile: Record<string, unknown>;
    }>(res);
  },

  /**
   * POST /api/onboarding/resume
   */
  async uploadResume(file: File, options: RequestOptions) {
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
      chunksProcessed: number;
      r2AssetUrl: string | null;
      extractedPreview: string;
    }>(res);
  },

  /**
   * POST /api/plan/generate
   */
  async generatePreparationPlan(options: RequestOptions) {
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

  /**
   * POST /api/practice/session/submit
   */
  async submitPracticeSession(
    payload: PracticeSubmitPayload,
    options: RequestOptions
  ) {
    const res = await fetch(`${API_BASE_URL}/api/practice/session/submit`, {
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
   * POST /api/mock-interview/session/start
   */
  async startMockInterview(
    payload: MockInterviewStartPayload,
    options: RequestOptions
  ) {
    const res = await fetch(`${API_BASE_URL}/api/mock-interview/session/start`, {
      method: "POST",
      headers: buildHeaders(options),
      body: JSON.stringify(payload),
      credentials: "include",
    });
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
    options: RequestOptions
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
   * GET /api/evaluation/:reportId
   */
  async getEvaluationReport(reportId: string, options: RequestOptions) {
    const res = await fetch(
      `${API_BASE_URL}/api/evaluation/${encodeURIComponent(reportId)}`,
      {
        method: "GET",
        headers: buildHeaders(options),
        credentials: "include",
      }
    );
    return handleResponse<{
      success: boolean;
      report: Record<string, unknown>;
    }>(res);
  },

  /**
   * GET /api/revision/items
   */
  async getRevisionItems(dueOnly = true, options: RequestOptions = {}) {
    const res = await fetch(
      `${API_BASE_URL}/api/revision/items?dueOnly=${dueOnly}`,
      {
        method: "GET",
        headers: buildHeaders(options),
        credentials: "include",
      }
    );
    return handleResponse<{
      success: boolean;
      totalDue: number;
      items: Array<Record<string, unknown>>;
    }>(res);
  },

  /**
   * POST /api/revision/items
   */
  async submitRevisionRecall(
    revisionItemId: string,
    sessionScore: number,
    options: RequestOptions
  ) {
    const res = await fetch(`${API_BASE_URL}/api/revision/items`, {
      method: "POST",
      headers: buildHeaders(options),
      body: JSON.stringify({ revisionItemId, sessionScore }),
      credentials: "include",
    });
    return handleResponse<{
      success: boolean;
      updatedItem: Record<string, unknown>;
      sm2Output: Record<string, unknown>;
    }>(res);
  },

  /**
   * POST /api/voice/synthesize
   */
  async synthesizeVoice(
    text: string,
    options: RequestOptions,
    voiceId?: string
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
};

