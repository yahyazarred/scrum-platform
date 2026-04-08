// ============================================================
// What is this file?
//   Authentication API endpoints.
//   Handles login, registration, email verification, and
//   resending verification codes.
// ============================================================

import { request } from "./apiClient";

export interface AuthResponse {
  message?: string;
  token?: string;
  status?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}

export const signup = (data: {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  password: string;
}) => request<AuthResponse>("/auth/signup", { method: "POST", body: data });

export const login = (data: { email: string; password: string }) =>
  request<AuthResponse>("/auth/login", { method: "POST", body: data });

export const verifyEmail = (data: { email: string; code: string }) =>
  request<AuthResponse>("/auth/verify-email", { method: "POST", body: data });

// Sends a fresh verification code to the logged-in user's email.
// Returns { message, email } so the frontend knows where to redirect.
export const resendVerification = (token: string) =>
  request<AuthResponse>("/auth/resend-verification", { method: "POST", token });
