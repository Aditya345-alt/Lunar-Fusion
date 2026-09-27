import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { apiUrl } from "../config/api";

export type UserRole = "admin" | "researcher" | "viewer";

export interface User {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  last_login?: string | null;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string, confirmPassword: string) => Promise<{ success: boolean; message?: string; error?: string; tokenDev?: string }>;
  refreshSession: () => Promise<boolean>;
  getCurrentUser: () => Promise<User | null>;
  authFetch: (input: string, init?: RequestInit) => Promise<Response>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => {
    return sessionStorage.getItem("lunar_fusion_access_token") || localStorage.getItem("lunar_fusion_access_token");
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const authFetch = useCallback(async (input: string, init: RequestInit = {}): Promise<Response> => {
    const headers = new Headers(init.headers || {});
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    const mergedInit: RequestInit = {
      ...init,
      headers,
      credentials: "include",
    };
    const url = apiUrl(input);
    let res = await fetch(url, mergedInit);

    // If access token expired, try automatic silent refresh
    if (res.status === 401 && !input.includes("/api/auth/login") && !input.includes("/api/auth/refresh")) {
      const refreshed = await refreshSessionInternal();
      if (refreshed) {
        const freshToken = sessionStorage.getItem("lunar_fusion_access_token") || localStorage.getItem("lunar_fusion_access_token");
        if (freshToken) {
          headers.set("Authorization", `Bearer ${freshToken}`);
        }
        res = await fetch(url, { ...init, headers, credentials: "include" });
      }
    }
    return res;
  }, [token]);

  const refreshSessionInternal = async (): Promise<boolean> => {
    try {
      const res = await fetch(apiUrl("/api/auth/refresh"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ refresh_token: "" }),
      });
      if (!res.ok) return false;
      const data = await res.json();
      if (data.success && data.data?.access_token) {
        setToken(data.data.access_token);
        sessionStorage.setItem("lunar_fusion_access_token", data.data.access_token);
        if (data.data.user) {
          setUser(data.data.user);
        }
        return true;
      }
    } catch {
      // silent refresh error
    }
    return false;
  };

  const getCurrentUser = useCallback(async (): Promise<User | null> => {
    try {
      const res = await authFetch("/api/auth/me");
      if (!res.ok) return null;
      const data = await res.json();
      if (data.success && data.data?.user) {
        setUser(data.data.user);
        return data.data.user;
      }
    } catch {
      // ignore
    }
    return null;
  }, [authFetch]);

  useEffect(() => {
    let mounted = true;
    async function initAuth() {
      try {
        const currentUser = await getCurrentUser();
        if (!currentUser && mounted) {
          // If direct me check failed, attempt refresh
          const refreshed = await refreshSessionInternal();
          if (refreshed && mounted) {
            await getCurrentUser();
          }
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    }
    initAuth();
    return () => { mounted = false; };
  }, [getCurrentUser]);

  const login = async (email: string, password: string, rememberMe: boolean = false): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch(apiUrl("/api/auth/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password, remember_me: rememberMe }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        const msg = data?.error?.message || "Invalid email or password.";
        return { success: false, error: msg };
      }

      const newToken = data.data.access_token;
      setToken(newToken);
      setUser(data.data.user);

      if (rememberMe) {
        localStorage.setItem("lunar_fusion_access_token", newToken);
      } else {
        sessionStorage.setItem("lunar_fusion_access_token", newToken);
        localStorage.removeItem("lunar_fusion_access_token");
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || "Network error. Please check server connection." };
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    confirmPassword: string
  ): Promise<{ success: boolean; message?: string; error?: string; tokenDev?: string }> => {
    try {
      const res = await fetch(apiUrl("/api/auth/register"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, email, password, confirm_password: confirmPassword }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        const msg = data?.error?.message || "Registration failed.";
        return { success: false, error: msg };
      }

      const newToken = data.data.access_token;
      setToken(newToken);
      setUser(data.data.user);
      sessionStorage.setItem("lunar_fusion_access_token", newToken);

      return {
        success: true,
        message: data.data.message,
        tokenDev: data.data.verification_token_dev,
      };
    } catch (err: any) {
      return { success: false, error: err?.message || "Network error during registration." };
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await fetch(apiUrl("/api/auth/logout"), {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // continue local cleanup
    } finally {
      setUser(null);
      setToken(null);
      sessionStorage.removeItem("lunar_fusion_access_token");
      localStorage.removeItem("lunar_fusion_access_token");
    }
  };

  const refreshSession = async (): Promise<boolean> => {
    return refreshSessionInternal();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        register,
        refreshSession,
        getCurrentUser,
        authFetch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
