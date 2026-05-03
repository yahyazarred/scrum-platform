// ============================================================
// What is this file?
//   Product Backlog API endpoints.
//   Handles creating, fetching, updating, and reordering Epics
//   and User Stories.
// ============================================================

import { request } from "./apiClient";

// ======== Backlog endpoints =========//

export interface EpicData {
  _id: string;
  title: string;
  color: string;
  project: string;
}

export interface UserStoryData {
  _id: string;
  title: string;
  description: string;
  status: "To Do" | "In Progress" | "Done";
  epic: EpicData | null;
  priority: number;
  project: string;
  sprint?: string;
  isBlocked?: boolean;
  storyPoints?: number | null;
}

export const createEpic = (token: string, projectId: string, data: { title: string; color?: string }) =>
  request<EpicData>(`/projects/${projectId}/backlog/create-epic`, { method: "POST", body: data, token });

export const getEpics = (token: string, projectId: string) =>
  request<EpicData[]>(`/projects/${projectId}/backlog/get-epics`, { token });

export const createUserStory = (token: string, projectId: string, data: { title: string; description?: string; epicId?: string }) =>
  request<UserStoryData>(`/projects/${projectId}/backlog/create-story`, { method: "POST", body: data, token });

export const getUserStories = (token: string, projectId: string) =>
  request<UserStoryData[]>(`/projects/${projectId}/backlog/get-stories`, { token });

export const updateUserStory = (token: string, projectId: string, storyId: string, updateData: Partial<UserStoryData> & { epicId?: string }) =>
  request<UserStoryData>(`/projects/${projectId}/backlog/update-story/${storyId}`, { method: "PUT", body: updateData, token });

export const estimateStoryPoints = (token: string, projectId: string, storyId: string, storyPoints: number | null) =>
  request<UserStoryData>(`/projects/${projectId}/backlog/estimate-story/${storyId}`, { method: "PUT", body: { storyPoints }, token });

export const deleteUserStory = (token: string, projectId: string, storyId: string) =>
  request<{message: string}>(`/projects/${projectId}/backlog/delete-story/${storyId}`, { method: "DELETE", token });

export const reorderStories = (token: string, projectId: string, order: string[]) =>
  request<{ message: string }>(`/projects/${projectId}/backlog/reorder-stories`, { method: "PUT", body: { order }, token });

