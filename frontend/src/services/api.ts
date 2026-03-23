// ============================================================
// services/api.ts
// ============================================================

const API_URL = "http://localhost:5000/api";

export interface AuthResponse {
  message?: string;
  token?: string;
  status?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  status: string;
}

// ============= Shared request helper =================
async function request<T>(
  endpoint: string,
  options: { method?: string; body?: object; token?: string } = {}
): Promise<T> {
  const headers: Record<string, string> = {};

  if (options.body)  headers["Content-Type"]  = "application/json";
  if (options.token) headers["Authorization"] = `Bearer ${options.token}`;

  const res = await fetch(`${API_URL}${endpoint}`, {
    method: options.method ?? "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.message ?? "Something went wrong");
  return json as T;
}

// ========= Auth endpoints =============//

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

// ======== User endpoints =========//

export const getMe = (token: string) =>
  request<UserProfile>("/user/me", { token });

export const updateMe = (token: string, data: { firstName?: string; lastName?: string; email?: string }) =>
  request<UserProfile>("/user/me", { method: "PUT", body: data, token });