

import { request } from "./apiClient";

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  status: string;
}

export const getMe = (token: string) => 
  request<UserProfile>("/users/get-profile", { token });

export const updateMe = (token: string, data: { firstName?: string; lastName?: string; email?: string }) =>
  request<UserProfile>("/users/update-profile", { method: "PUT", body: data, token });
