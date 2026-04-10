export interface SprintData {
  _id: string;
  project: string;
  goal: string;
  startDate: string;
  endDate: string;
  status: "Active" | "Completed";
}

const API_URL = "http://localhost:5000/api/sprints";

export const getActiveSprint = async (token: string, projectId: string): Promise<SprintData | null> => {
  const response = await fetch(`${API_URL}/active/${projectId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch active sprint");
  }

  return response.json(); 
};

export const startSprint = async (
  token: string,
  projectId: string,
  data: { goal: string; storyIds: string[] }
): Promise<SprintData> => {
  const response = await fetch(`${API_URL}/start/${projectId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to start sprint");
  }

  return response.json();
};
