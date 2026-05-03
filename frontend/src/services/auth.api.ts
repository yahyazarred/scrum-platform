import { request } from "./apiClient";

export interface AuthResponse {
  message?: string;
  token?: string;
  status?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}

export const signup = (data: {firstName: string;lastName: string;email: string;password: string;}) => 
  request<AuthResponse>("/auth/signup", { method: "POST", body: data });

export const login = (data: { email: string; password: string }) =>
  request<AuthResponse>("/auth/login", { method: "POST", body: data });

export const verifyEmail = (data: { email: string; code: string }) =>
  request<AuthResponse>("/auth/verify-email", { method: "POST", body: data });

export const resendVerification = (token: string) =>
  request<AuthResponse>("/auth/resend-verification", { method: "POST", token });
