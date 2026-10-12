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

export interface RequestOptions {
  clerkId?: string | null;
  token?: string | null;
  idempotencyKey?: string;
  headers?: Record<string, string>;
}

function buildHeaders(
  options: RequestOptions = {},
  isJson = true
): Record<string, string> {
  const headers: Record<string, string> = {
    ...(isJson ? { "Content-Type": "application/json" } : {}),
    ...(options.headers || {}),
  };

  if (options.clerkId) {
    headers["x-candidate-clerk-id"] = options.clerkId;
  }

  if (options.token) {
    headers["Authorization"] = `Bearer ${options.token}`;
  }

  if (options.idempotencyKey) {
    headers["idempotency-key"] = options.idempotencyKey;
  }

  return headers;
}

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message =
      (data as { message?: string; error?: string })?.message ||
      (data as { error?: string })?.error ||
      `API request failed with status ${res.status}`;
    throw new Error(message);
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

