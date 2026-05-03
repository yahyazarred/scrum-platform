import { request } from "./apiClient";

export interface BlockerData {
  _id: string;
  userStory: string;
  project: string;
  status: "unsolved" | "solved";
  description: string;
  resolutionDescription?: string;
  createdBy: { _id: string; firstName: string; lastName: string };
  solvedBy?: { _id: string; firstName: string; lastName: string };
  createdAt: string;
  solvedAt?: string;
}

export const getBlockers = (token: string, projectId: string, storyId: string) =>
  request<BlockerData[]>(`/projects/${projectId}/stories/${storyId}/blockers/get-blockers`, { token });

export const createBlocker = (token: string, projectId: string, storyId: string, description: string) =>
  request<BlockerData>(`/projects/${projectId}/stories/${storyId}/blockers/create-blocker`, {method: "POST",body: { description },token,});

export const solveBlocker = (token: string, projectId: string, storyId: string, blockerId: string, resolutionDescription: string) =>
  request<BlockerData>(`/projects/${projectId}/stories/${storyId}/blockers/solve-blocker/${blockerId}`, {method: "PATCH",body: { resolutionDescription },token,});
