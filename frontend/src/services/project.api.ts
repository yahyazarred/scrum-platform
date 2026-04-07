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

export const updateProject = (token: string, projectId: string, data: Partial<ProjectData>) =>
  request<{ message: string; project: ProjectData }>(`/projects/${projectId}`, { method: "PUT", body: data, token });

export const deleteProject = (token: string, projectId: string) =>
  request<{ message: string }>(`/projects/${projectId}`, { method: "DELETE", token });
