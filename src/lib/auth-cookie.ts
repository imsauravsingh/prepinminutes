/**
 * Utility helpers to manage candidate authentication session tokens across
 * both localStorage and document.cookie.
 * 
 * Ensures Next.js Edge Middleware (which can only read cookies) and client-side
 * components remain in perfect synchronization.
 */

export const AUTH_COOKIE_NAME = "pim_session";
export const AUTH_TOKEN_COOKIE_NAME = "pim_auth_token";
export const AUTH_TOKEN_STORAGE_KEY = "pim_auth_token";
export const AUTH_USER_STORAGE_KEY = "pim_auth_user";

const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

/**
 * Persists an authenticated session token and candidate user payload
 * to both localStorage and document.cookie.
 */
export function setClientAuthSession(token: string, user?: unknown): void {
  if (typeof window === "undefined" || !token) return;

  try {
    localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
    if (user) {
      localStorage.setItem(
        AUTH_USER_STORAGE_KEY,
        typeof user === "string" ? user : JSON.stringify(user)
      );
    }

    const encoded = encodeURIComponent(token);
    const isHttps = window.location.protocol === "https:";
    const secureFlag = isHttps ? "; Secure" : "";

    document.cookie = `${AUTH_COOKIE_NAME}=${encoded}; path=/; max-age=${SESSION_MAX_AGE_SECONDS}; SameSite=Lax${secureFlag}`;
    document.cookie = `${AUTH_TOKEN_COOKIE_NAME}=${encoded}; path=/; max-age=${SESSION_MAX_AGE_SECONDS}; SameSite=Lax${secureFlag}`;
  } catch (err) {
    console.warn("Failed to set client auth session:", err);
  }
}

/** Browser key recording which candidate the stored dashboard data belongs to. */
const DATA_OWNER_KEY = "pim_data_owner";

/** Shared, non-personal caches that are safe to keep across candidates. */
function isSharedKey(key: string) {
  return key.startsWith("pim_curriculum_cache");
}

/**
 * Removes every candidate-specific value this app keeps in the browser
 * (profile cache, ticks, topic progress, setup flags, drafts), keeping only
 * the shared curriculum cache. Auth keys are left to the caller.
 */
export function clearCandidateBrowserData(): void {
  if (typeof window === "undefined") return;
  for (const store of [window.localStorage, window.sessionStorage]) {
    try {
      const keys: string[] = [];
      for (let i = 0; i < store.length; i++) {
        const k = store.key(i);
        if (!k) continue;
        if (k === AUTH_TOKEN_STORAGE_KEY || k === AUTH_USER_STORAGE_KEY) continue;
        if ((k.startsWith("pim_") || k.startsWith("prep_")) && !isSharedKey(k)) keys.push(k);
      }
      keys.forEach((k) => store.removeItem(k));
    } catch {
      // Storage may be unavailable (private mode); nothing to clear.
    }
  }
}

/**
 * Call when a candidate is known. If the browser holds another candidate's
 * data (e.g. they never signed out), wipe it before anything reads it.
 */
export function claimBrowserDataFor(userId: string): void {
  if (typeof window === "undefined" || !userId) return;
  try {
    const owner = window.localStorage.getItem(DATA_OWNER_KEY);
    if (owner === userId) return;
    clearCandidateBrowserData();
    window.localStorage.setItem(DATA_OWNER_KEY, userId);
  } catch {
    // Ignore storage errors.
  }
}

/**
 * Clears the authenticated session token from both localStorage and cookies.
 */
export function clearClientAuthSession(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
    localStorage.removeItem(AUTH_USER_STORAGE_KEY);
    // Candidate data must never carry over to the next person on this browser.
    clearCandidateBrowserData();

    const isHttps = window.location.protocol === "https:";
    const secureFlag = isHttps ? "; Secure" : "";
    const expiredSuffix = `; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0; SameSite=Lax${secureFlag}`;

    document.cookie = `${AUTH_COOKIE_NAME}=${expiredSuffix}`;
    document.cookie = `${AUTH_TOKEN_COOKIE_NAME}=${expiredSuffix}`;
    document.cookie = `__session=${expiredSuffix}`;
  } catch (err) {
    console.warn("Failed to clear client auth session:", err);
  }
}

/**
 * Reads the active candidate authentication token, inspecting localStorage first
 * and falling back to cookies.
 */
export function getClientAuthToken(): string | null {
  if (typeof window === "undefined") return null;

  try {
    const fromStorage = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
    if (fromStorage) return fromStorage;

    const cookieMatch = document.cookie.match(
      /(?:^|;\s*)(?:pim_session|pim_auth_token)=([^;]*)/
    );
    if (cookieMatch && cookieMatch[1]) {
      return decodeURIComponent(cookieMatch[1]);
    }

    return null;
  } catch {
    return null;
  }
}
