"use client";

import { apiRequest } from "@/services/api-client";

export function getCurrentUser() {
  return apiRequest<{ user: unknown | null }>("/api/auth/me", {
    method: "GET"
  });
}

export function refreshSession() {
  return apiRequest<{ user: unknown }>("/api/auth/refresh", {
    method: "POST"
  });
}

export function login(payload: { email: string; password: string }) {
  return apiRequest<{ user: unknown }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function register(payload: {
  name: string;
  email: string;
  phone?: string;
  password: string;
  confirmPassword: string;
}) {
  return apiRequest<{ user: unknown }>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function logout() {
  return apiRequest<{ loggedOut: boolean }>("/api/auth/logout", {
    method: "POST"
  });
}

export function forgotPassword(payload: { email: string }) {
  return apiRequest<{ message: string }>("/api/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function resetPassword(payload: { token: string; password: string }) {
  return apiRequest<{ message: string }>("/api/auth/reset-password", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}
