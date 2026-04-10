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
}

export const createEpic = (token: string, projectId: string, data: { title: string; color?: string }) =>
  request<EpicData>(`/projects/${projectId}/backlog/epics`, { method: "POST", body: data, token });

export const getEpics = (token: string, projectId: string) =>
  request<EpicData[]>(`/projects/${projectId}/backlog/epics`, { token });

export const createUserStory = (token: string, projectId: string, data: { title: string; description?: string; epicId?: string }) =>
  request<UserStoryData>(`/projects/${projectId}/backlog/stories`, { method: "POST", body: data, token });

export const getUserStories = (token: string, projectId: string) =>
  request<UserStoryData[]>(`/projects/${projectId}/backlog/stories`, { token });

export const updateUserStory = (token: string, projectId: string, storyId: string, updateData: Partial<UserStoryData> & { epicId?: string }) =>
  request<UserStoryData>(`/projects/${projectId}/backlog/stories/${storyId}`, { method: "PUT", body: updateData, token });

export const deleteUserStory = (token: string, projectId: string, storyId: string) =>
  request<{message: string}>(`/projects/${projectId}/backlog/stories/${storyId}`, { method: "DELETE", token });

export const reorderStories = (token: string, projectId: string, order: string[]) =>
  request<{ message: string }>(`/projects/${projectId}/backlog/stories/reorder`, { method: "PUT", body: { order }, token });

