import { request } from "./apiClient";

export interface SubTaskData {
  _id: string;
  userStory: string;
  project: string;
  title: string;
  description?: string;
  status: "todo" | "finished";
  createdBy: string;
  assignedTo?: { _id: string; firstName: string; lastName: string } | null;
  createdAt: string;
}

export const getSubTasks = (token: string, projectId: string, storyId: string) =>
  request<SubTaskData[]>(`/projects/${projectId}/stories/${storyId}/subtasks/get-subtasks`, { token });

export const createSubTask = (token: string, projectId: string, storyId: string, title: string, description?: string) =>
  request<SubTaskData>(`/projects/${projectId}/stories/${storyId}/subtasks/create-subtask`, {method: "POST",body: { title, description },token,});

export const claimSubTask = (token: string, projectId: string, storyId: string, taskId: string) =>
  request<SubTaskData>(`/projects/${projectId}/stories/${storyId}/subtasks/claim-subtask/${taskId}`, {method: "PATCH",token,});

export const giveUpSubTask = (token: string, projectId: string, storyId: string, taskId: string) =>
  request<SubTaskData>(`/projects/${projectId}/stories/${storyId}/subtasks/giveup-subtask/${taskId}`, {method: "PATCH",token,});

export const toggleFinished = (token: string, projectId: string, storyId: string, taskId: string) =>
  request<SubTaskData>(`/projects/${projectId}/stories/${storyId}/subtasks/toggle-subtask/${taskId}`, {method: "PATCH",token,});

export const deleteSubTask = (token: string, projectId: string, storyId: string, taskId: string) =>
  request<{message: string}>(`/projects/${projectId}/stories/${storyId}/subtasks/delete-subtask/${taskId}`, {method: "DELETE",token,});
