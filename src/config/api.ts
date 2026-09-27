/**
 * Lunar Fusion API Configuration
 * Centralized API base URL resolver and endpoint helpers for production & development.
 */

export function getApiBaseUrl(): string {
  const envUrl =
    (import.meta as any).env?.VITE_API_BASE_URL ||
    (import.meta as any).env?.VITE_API_URL;

  // If explicitly configured in environment variables (Vercel Dashboard or .env)
  if (typeof envUrl === "string" && envUrl.trim().length > 0) {
    const trimmed = envUrl.trim();
    return trimmed.endsWith("/") ? trimmed.slice(0, -1) : trimmed;
  }

  // Development local fallback
  if (!(import.meta as any).env?.PROD) {
    return "http://localhost:8000";
  }

  // In production builds without explicit VITE_API_BASE_URL, default to same-origin relative paths ("")
  // Do NOT hardcode localhost or fake backend domains in production bundles
  return "";
}

export function isBackendConfigured(): boolean {
  const envUrl =
    (import.meta as any).env?.VITE_API_BASE_URL ||
    (import.meta as any).env?.VITE_API_URL;
  if (typeof envUrl === "string" && envUrl.trim().length > 0) {
    return true;
  }
  return !(import.meta as any).env?.PROD;
}

export function apiUrl(endpoint: string): string {
  if (endpoint.startsWith("http://") || endpoint.startsWith("https://")) {
    return endpoint;
  }
  const base = getApiBaseUrl();
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return base ? `${base}${cleanEndpoint}` : cleanEndpoint;
}

export function getApiHostDisplay(): string {
  const base = getApiBaseUrl();
  if (!base) {
    return (import.meta as any).env?.PROD
      ? "Not Configured (Set VITE_API_BASE_URL in Vercel)"
      : "localhost:8000";
  }
  try {
    const parsed = new URL(base);
    return parsed.host;
  } catch {
    return base.replace(/^https?:\/\//, "");
  }
}

export async function checkApiHealth(): Promise<{ ok: boolean; status?: string; service?: string; host?: string }> {
  const host = getApiHostDisplay();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);
    const res = await fetch(apiUrl("/api/health"), {
      method: "GET",
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (res.ok) {
      const data = await res.json();
      return { ok: true, status: data.status, service: data.service, host };
    }
    return { ok: false, host };
  } catch {
    return { ok: false, host };
  }
}
