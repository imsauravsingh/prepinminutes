"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import {
  AUTH_TOKEN_STORAGE_KEY,
  AUTH_USER_STORAGE_KEY,
  backendApi,
  AuthenticatedCandidateUser,
  SsoConfigResponse,
} from "@/lib/api-client";
import {
  setClientAuthSession,
  clearClientAuthSession,
  getClientAuthToken,
} from "@/lib/auth-cookie";

export interface AppAuthContextValue {
  isLoaded: boolean;
  isSignedIn: boolean;
  user: AuthenticatedCandidateUser | null;
  token: string | null;
  activeProvider: "google" | "clerk" | "both";
  googleFlow: "redirect" | "id_token" | "both";
  googleClientId: string;
  signInWithGoogleRedirect: (redirectUrl?: string) => void;
  signInWithGoogleIdToken: (
    credential: string,
    redirectUrl?: string
  ) => Promise<void>;
  completeOAuthCallbackToken: (
    token: string,
    redirectUrl?: string
  ) => Promise<void>;
  signInWithCredentials: (
    identifier: string,
    password: string,
    redirectUrl?: string
  ) => Promise<void>;
  signUpWithCredentials: (
    data: {
      username: string;
      email: string;
      password: string;
      confirmPassword: string;
    },
    redirectUrl?: string
  ) => Promise<{
    requiresVerification: boolean;
    email: string;
    message?: string;
    devCode?: string;
  }>;
  verifyEmailOtp: (
    email: string,
    code: string,
    redirectUrl?: string
  ) => Promise<void>;
  resendVerificationOtp: (
    email: string
  ) => Promise<{ success: boolean; message: string; devCode?: string }>;
  updateUserProfile: (data: {
    fullName?: string;
    username?: string;
    avatarUrl?: string | null;
  }) => Promise<{
    success: boolean;
    message: string;
    user: AuthenticatedCandidateUser;
  }>;
  changePassword: (data: {
    currentPassword?: string;
    newPassword: string;
    confirmPassword?: string;
  }) => Promise<{ success: boolean; message: string; hasPassword?: boolean }>;
  signOut: () => Promise<void>;
}

const AppAuthContext = createContext<AppAuthContextValue | null>(null);

function parseJwtUser(token: string): AuthenticatedCandidateUser | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const p = JSON.parse(json);
    return {
      id: p.userId || p.sub,
      googleId: p.googleId || null,
      username: p.username || null,
      clerkId: p.clerkId || null,
      email: p.email || "",
      fullName: p.name || p.username || null,
      avatarUrl: p.picture || null,
      authProvider: p.provider || "google",
    };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const [isLoaded, setIsLoaded] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthenticatedCandidateUser | null>(null);

  const [activeProvider, setActiveProvider] = useState<
    "google" | "clerk" | "both"
  >(
    (process.env.NEXT_PUBLIC_AUTH_PROVIDER as "google" | "clerk" | "both") ||
      "google"
  );
  const [googleFlow, setGoogleFlow] = useState<"redirect" | "id_token" | "both">(
    (process.env.NEXT_PUBLIC_GOOGLE_SSO_FLOW as
      | "redirect"
      | "id_token"
      | "both") || "both"
  );
  const [googleClientId, setGoogleClientId] = useState<string>(
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""
  );

  // 1. Initial Local Storage & Backend SSO Config Hydration
  useEffect(() => {
    let mounted = true;

    async function initializeAuth() {
      // 1a. Hydrate local session from storage and cookies immediately
      let initialToken = getClientAuthToken();
      let initialUser: AuthenticatedCandidateUser | null = null;

      try {
        const storedUserJson = localStorage.getItem(AUTH_USER_STORAGE_KEY);
        if (storedUserJson) {
          initialUser = JSON.parse(storedUserJson);
        } else if (initialToken) {
          initialUser = parseJwtUser(initialToken);
        }
      } catch {
        // Ignore localStorage error
      }

      if (mounted) {
        if (initialToken) {
          setToken(initialToken);
          setClientAuthSession(initialToken, initialUser);
        }
        if (initialUser) setUser(initialUser);
      }

      // 1b. Fetch dynamic SSO runtime configuration from backend
      try {
        const config: SsoConfigResponse = await backendApi.getAuthConfig();
        if (mounted && config.success) {
          setActiveProvider(config.activeProvider || "google");
          setGoogleFlow(config.googleFlow || "both");
          if (config.googleClientId) {
            setGoogleClientId(config.googleClientId);
          }
        }
      } catch {
        // Backend offline / static preview — keep default Google SSO settings
      }

      // 1c. If token exists, verify & refresh session with backend
      if (initialToken) {
        try {
          const authMe = await backendApi.getAuthMe(initialToken);
          if (mounted) {
            if (authMe.authenticated && authMe.user) {
              setUser(authMe.user);
              setClientAuthSession(initialToken, authMe.user);
            } else {
              // Token invalid/expired
              setToken(null);
              setUser(null);
              clearClientAuthSession();
            }
          }
        } catch (err: unknown) {
          // If unauthorized or expired token, clear invalid credentials
          const status =
            err && typeof err === "object" && "status" in err
              ? (err as { status?: number }).status
              : 0;
          const msg = err instanceof Error ? err.message.toLowerCase() : "";

          if (status === 401 || status === 403 || msg.includes("sign in required")) {
            if (mounted) {
              setToken(null);
              setUser(null);
              clearClientAuthSession();
            }
          }
        }
      }

      if (mounted) {
        setIsLoaded(true);
      }
    }

    initializeAuth();

    return () => {
      mounted = false;
    };
  }, []);

  // 2. Flow 1: Google OAuth 2.0 Redirect Sign-In
  const signInWithGoogleRedirect = useCallback(
    (redirectUrl = "/dashboard") => {
      const targetUrl = backendApi.getGoogleOAuthRedirectUrl(redirectUrl);
      if (typeof window !== "undefined") {
        window.location.href = targetUrl;
      }
    },
    []
  );

  // 3. Flow 1 Callback Completion: Handles ?auth_token=... returned from Google OAuth redirect
  const completeOAuthCallbackToken = useCallback(
    async (jwtToken: string, redirectUrl = "/dashboard") => {
      setToken(jwtToken);
      const parsed = parseJwtUser(jwtToken);
      if (parsed) {
        setUser(parsed);
      }
      setClientAuthSession(jwtToken, parsed);

      try {
        const authMe = await backendApi.getAuthMe(jwtToken);
        if (authMe.authenticated && authMe.user) {
          setUser(authMe.user);
          setClientAuthSession(jwtToken, authMe.user);
        }
      } catch {}

      setIsLoaded(true);
      router.replace(redirectUrl || "/dashboard");
    },
    [router]
  );

  // 4. Flow 2: Google Identity Services (GIS) ID Token Verification
  const signInWithGoogleIdToken = useCallback(
    async (credential: string, redirectUrl = "/dashboard") => {
      const res = await backendApi.verifyGoogleIdToken(credential);
      if (res.success && res.token) {
        setToken(res.token);
        setUser(res.user);
        setClientAuthSession(res.token, res.user);

        router.replace(redirectUrl || "/dashboard");
      } else {
        throw new Error("Google authentication failed. Please try again.");
      }
    },
    [router]
  );

  // 5. Credentials Sign-In
  const signInWithCredentials = useCallback(
    async (identifier: string, password: string, redirectUrl = "/dashboard") => {
      const res = await backendApi.loginWithCredentials({ identifier, password });
      if (res.success && res.token) {
        setToken(res.token);
        setUser(res.user);
        setClientAuthSession(res.token, res.user);

        router.replace(redirectUrl || "/dashboard");
      } else {
        throw new Error("Invalid username/email or password.");
      }
    },
    [router]
  );

  // 6. Credentials Sign-Up
  const signUpWithCredentials = useCallback(
    async (
      data: {
        username: string;
        email: string;
        password: string;
        confirmPassword: string;
      },
      redirectUrl = "/dashboard?setup=true"
    ) => {
      const res = await backendApi.registerWithCredentials(data);
      if (res.requiresVerification) {
        return {
          requiresVerification: true,
          email: res.email || data.email,
          message: res.message,
          devCode: res.devCode,
        };
      }

      if (res.success && res.token && res.user) {
        setToken(res.token);
        setUser(res.user);
        setClientAuthSession(res.token, res.user);

        router.replace(redirectUrl || "/dashboard?setup=true");
        return {
          requiresVerification: false,
          email: data.email,
          message: res.message,
        };
      }

      throw new Error(res.message || "Registration failed.");
    },
    [router]
  );

  // 7. Email Verification OTP
  const verifyEmailOtp = useCallback(
    async (
      email: string,
      code: string,
      redirectUrl = "/dashboard?setup=true"
    ) => {
      const res = await backendApi.verifyEmail({ email, code });
      if (res.success && res.token && res.user) {
        setToken(res.token);
        setUser(res.user);
        setClientAuthSession(res.token, res.user);

        router.replace(redirectUrl || "/dashboard?setup=true");
      } else {
        throw new Error(res.message || "Email verification failed.");
      }
    },
    [router]
  );

  // 8. Resend Verification OTP
  const resendVerificationOtp = useCallback(async (email: string) => {
    return backendApi.resendVerification({ email });
  }, []);

  // 9. Update Personal Profile Information
  const updateUserProfile = useCallback(
    async (data: {
      fullName?: string;
      username?: string;
      avatarUrl?: string | null;
    }) => {
      const res = await backendApi.updateUserProfile(data, token);
      if (res.success && res.user) {
        setUser((prev) => ({
          ...(prev || {}),
          ...res.user,
        }));
        try {
          const stored = localStorage.getItem(AUTH_USER_STORAGE_KEY);
          const parsed = stored ? JSON.parse(stored) : {};
          localStorage.setItem(
            AUTH_USER_STORAGE_KEY,
            JSON.stringify({ ...parsed, ...res.user })
          );
        } catch {}
      }
      return res;
    },
    [token]
  );

  // 10. Set or Change Account Password
  const changePassword = useCallback(
    async (data: {
      currentPassword?: string;
      newPassword: string;
      confirmPassword?: string;
    }) => {
      const res = await backendApi.changePassword(data, token);
      if (res.success) {
        setUser((prev) => (prev ? { ...prev, hasPassword: true } : prev));
        try {
          const stored = localStorage.getItem(AUTH_USER_STORAGE_KEY);
          if (stored) {
            const parsed = JSON.parse(stored);
            localStorage.setItem(
              AUTH_USER_STORAGE_KEY,
              JSON.stringify({ ...parsed, hasPassword: true })
            );
          }
        } catch {}
      }
      return res;
    },
    [token]
  );

  // 11. Sign Out
  const signOut = useCallback(async () => {
    try {
      await backendApi.logout();
    } catch {}

    setToken(null);
    setUser(null);
    clearClientAuthSession();

    router.replace("/");
  }, [router]);

  const value = useMemo<AppAuthContextValue>(
    () => ({
      isLoaded,
      isSignedIn: !!token && !!user,
      user,
      token,
      activeProvider,
      googleFlow,
      googleClientId,
      signInWithGoogleRedirect,
      signInWithGoogleIdToken,
      completeOAuthCallbackToken,
      signInWithCredentials,
      signUpWithCredentials,
      verifyEmailOtp,
      resendVerificationOtp,
      updateUserProfile,
      changePassword,
      signOut,
    }),
    [
      isLoaded,
      token,
      user,
      activeProvider,
      googleFlow,
      googleClientId,
      signInWithGoogleRedirect,
      signInWithGoogleIdToken,
      completeOAuthCallbackToken,
      signInWithCredentials,
      signUpWithCredentials,
      verifyEmailOtp,
      resendVerificationOtp,
      updateUserProfile,
      changePassword,
      signOut,
    ]
  );

  return (
    <AppAuthContext.Provider value={value}>{children}</AppAuthContext.Provider>
  );
}

export function useAppAuth(): AppAuthContextValue {
  const context = useContext(AppAuthContext);
  if (!context) {
    throw new Error("useAppAuth must be used within an AuthProvider");
  }
  return context;
}

