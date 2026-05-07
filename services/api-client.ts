"use client";

import type { ApiResponse } from "@/types";

function getCsrfToken() {
  if (typeof document === "undefined") {
    return "";
  }

  return document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith("csrf-token="))
    ?.split("=")[1];
}

async function refreshSession() {
  const csrfToken = getCsrfToken();

  await fetch("/api/auth/refresh", {
    method: "POST",
    credentials: "include",
    headers: csrfToken
      ? {
          "x-csrf-token": csrfToken
        }
      : undefined
  });
}

export async function apiRequest<T>(
  path: string,
  init?: RequestInit & {
    retryOnAuthError?: boolean;
  }
) {
  const csrfToken = getCsrfToken();
  const isMutation = (init?.method || "GET").toUpperCase() !== "GET";
  const response = await fetch(path, {
    ...init,
    credentials: "include",
    headers: {
      ...(isMutation && csrfToken ? { "x-csrf-token": csrfToken } : {}),
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...(init?.headers || {})
    }
  });

  if (response.status === 401 && init?.retryOnAuthError !== false) {
    await refreshSession();
    return apiRequest<T>(path, {
      ...init,
      retryOnAuthError: false
    });
  }

  let payload: ApiResponse<T>;
  try {
    payload = (await response.json()) as ApiResponse<T>;
  } catch (error) {
    console.error("Failed to parse API response:", error);
    throw new Error(`Invalid response from server (status: ${response.status})`);
  }

  if (!response.ok || !payload.success) {
    throw new Error(payload.error || `Request failed with status ${response.status}`);
  }

  return payload.data as T;
}
