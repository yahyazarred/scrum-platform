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

// ======== Project endpoints =========//

export interface ProjectData {
  _id: string;
  name: string;
  description?: string;
  sprintDuration: string;
  projectGoal: string;
  githubLink?: string;
  joinCodes?: {
    scrumMaster: string;
    developer: string;
  };
  createdAt: string;
}

export interface ProjectMembershipData {
  _id: string;
  user: string;
  project: ProjectData;
  role: "product_owner" | "scrum_master" | "developer";
}

export const createProject = (token: string, data: { name: string; description?: string; sprintDuration: string; projectGoal: string; githubLink?: string }) =>
  request<{ message: string; project: ProjectData; membership: ProjectMembershipData }>("/projects", { method: "POST", body: data, token });

export const getUserProjects = (token: string) =>
  request<ProjectMembershipData[]>("/projects/my-projects", { token });

export const joinProject = (token: string, data: { joinCode: string }) =>
  request<{ message: string; project: ProjectData; role: string }>("/projects/join", { method: "POST", body: data, token });