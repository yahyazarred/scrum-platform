// ============================================================
// What is this file?
//   Project Management API endpoints.
//   Handles creating projects, joining projects via code,
//   and fetching the user's list of projects.
// ============================================================

import { request } from "./apiClient";

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

export interface ProjectMemberData {
  _id: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  project: string;
  role: "product_owner" | "scrum_master" | "developer";
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

export const getProjectById = (token: string, projectId: string) =>
  request<ProjectData>(`/projects/${projectId}`, { token });

export const updateProject = (token: string, projectId: string, updates: Partial<ProjectData>) => {
  return request<{ message: string; project: ProjectData }>(`/projects/${projectId}`, {
    method: "PUT",
    body: updates,
    token,
  });
};

export const deleteProject = async (token: string, projectId: string) => {
  return request<{ message: string }>(`/projects/${projectId}`, {
    method: "DELETE",
    token,
  });
};

// --- Members API ---

export const getProjectMembers = async (token: string, projectId: string) => {
  return request<ProjectMemberData[]>(`/projects/${projectId}/members`, { token });
};

export const leaveProject = async (token: string, projectId: string) => {
  return request<{ message: string }>(`/projects/${projectId}/members/leave`, {
    method: "DELETE",
    token,
  });
};

export const kickMember = async (token: string, projectId: string, memberId: string) => {
  return request<{ message: string }>(`/projects/${projectId}/members/${memberId}`, {
    method: "DELETE",
    token,
  });
};
