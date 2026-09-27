/**
 * Lunar Fusion API Configuration
 * Centralized API base URL resolver and endpoint helpers for production & development.
 */

export function getApiBaseUrl(): string {
  const envUrl = (import.meta as any).env?.VITE_API_BASE_URL;

  // If explicitly configured (even as empty string for same-origin proxy)
  if (typeof envUrl === "string") {
    const trimmed = envUrl.trim();
    return trimmed.endsWith("/") ? trimmed.slice(0, -1) : trimmed;
  }

  // In production builds without explicit VITE_API_BASE_URL, default to same-origin relative paths ("")
  // which routes through Vercel rewrites to the backend or serverless function
  if ((import.meta as any).env?.PROD) {
    return "";
  }

  // Development fallback
  return "http://localhost:8000";
}

export function apiUrl(endpoint: string): string {
  if (endpoint.startsWith("http://") || endpoint.startsWith("https://")) {
    return endpoint;
  }
  const base = getApiBaseUrl();
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${base}${cleanEndpoint}`;
}

export function getApiHostDisplay(): string {
  const base = getApiBaseUrl();
  if (!base) {
    return "Vercel / Same Origin";
  }
  try {
    const parsed = new URL(base);
    return parsed.host;
  } catch {
    return base.replace(/^https?:\/\//, "");
  }
}

export async function checkApiHealth(): Promise<{ ok: boolean; status?: string; service?: string }> {
  try {
    const res = await fetch(apiUrl("/api/health"), { method: "GET" });
    if (res.ok) {
      const data = await res.json();
      return { ok: true, status: data.status, service: data.service };
    }
    return { ok: false };
  } catch {
    return { ok: false };
  }
}
