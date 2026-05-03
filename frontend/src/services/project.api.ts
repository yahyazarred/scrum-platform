import { request } from "./apiClient";

export interface ProjectData {
  _id: string;
  name: string;
  description?: string;
  sprintDuration: number;
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

export const createProject = (token: string, data: { name: string; description?: string; sprintDuration: number; projectGoal: string; githubLink?: string }) =>
  request<{ message: string; project: ProjectData; membership: ProjectMembershipData }>("/projects/create-project", { method: "POST", body: data, token });

export const getUserProjects = (token: string) =>
  request<ProjectMembershipData[]>("/projects/get-my-projects", { token });

export const joinProject = (token: string, data: { joinCode: string }) =>
  request<{ message: string; project: ProjectData; role: string }>("/projects/join-project", { method: "POST", body: data, token });

export const getProjectById = (token: string, projectId: string) =>
  request<ProjectData>(`/projects/get-project/${projectId}`, { token });

export const updateProject = (token: string, projectId: string, updates: Partial<ProjectData>) => 
  request<{ message: string; project: ProjectData }>(`/projects/update-project/${projectId}`, {method: "PUT",body: updates,token,});


export const deleteProject = async (token: string, projectId: string) => 
  request<{ message: string }>(`/projects/delete-project/${projectId}`, {method: "DELETE",token,});


export const getProjectMembers = async (token: string, projectId: string) => 
  request<ProjectMemberData[]>(`/projects/get-members/${projectId}`, { token });

export const leaveProject = async (token: string, projectId: string) => 
  request<{ message: string }>(`/projects/leave-project/${projectId}`, {method: "DELETE",token,});


export const kickMember = async (token: string, projectId: string, memberId: string) => 
  request<{ message: string }>(`/projects/kick-member/${projectId}/${memberId}`, {method: "DELETE",token,});
