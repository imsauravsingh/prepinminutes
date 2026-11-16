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

/**
 * Clears the authenticated session token from both localStorage and cookies.
 */
export function clearClientAuthSession(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
    localStorage.removeItem(AUTH_USER_STORAGE_KEY);

    const isHttps = window.location.protocol === "https:";
    const secureFlag = isHttps ? "; Secure" : "";

    document.cookie = `${AUTH_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax${secureFlag}`;
    document.cookie = `${AUTH_TOKEN_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax${secureFlag}`;
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
