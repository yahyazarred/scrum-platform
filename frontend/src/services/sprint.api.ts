import { request } from "./apiClient";

export interface BurndownDataPoint {
  date: string;
  expectedRemaining: number;
  actualRemaining: number | null;
}

export interface SprintData {
  _id: string;
  project: string;
  goal: string;
  sprintNumber?: number;
  startDate: string;
  endDate: string;
  status: "Active" | "Completed";
  metrics?: {
    totalPoints: number;
    completedPoints: number;
  };
  burndownData?: BurndownDataPoint[];
}


export const getActiveSprint = (token: string, projectId: string) =>
  request<SprintData | null>(`/projects/${projectId}/sprints/get-active-sprint`, { token });

export const startSprint = (token: string, projectId: string, data: { goal: string; storyIds: string[] }) =>
  request<SprintData>(`/projects/${projectId}/sprints/start-sprint`, {method: "POST",token, body: data,});

export const endSprint = (token: string, projectId: string) =>
  request<{ message: string }>(`/projects/${projectId}/sprints/end-sprint`, {method: "POST",token,});

export const getSprintHistory = (token: string, projectId: string) =>
  request<SprintData[]>(`/projects/${projectId}/sprints/history`, { token });

export const getActiveSprintBurndown = (token: string, projectId: string) =>
  request<BurndownDataPoint[]>(`/projects/${projectId}/sprints/active/burndown`, { token });
