// ============================================================
// What is this file?
//   User Profile API endpoints.
//   Handles fetching and updating details of the currently
//   authenticated user.
// ============================================================

import { request } from "./apiClient";

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  status: string;
}

export const getMe = (token: string) => request<UserProfile>("/user/me", { token });

export const updateMe = (token: string, data: { firstName?: string; lastName?: string; email?: string }) =>
  request<UserProfile>("/user/me", { method: "PUT", body: data, token });
