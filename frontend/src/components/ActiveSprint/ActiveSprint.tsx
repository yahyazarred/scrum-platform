import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getActiveSprint } from "../../services/sprint.api";
import type { SprintData } from "../../services/sprint.api";
import { Button } from "../ui/Button/Button";
import StartSprintDrawer from "./StartSprintDrawer";
import KanbanBoard from "./KanbanBoard";
import "./ActiveSprint.css";

interface ActiveSprintProps {
  role: string | null;
}

const ActiveSprint: React.FC<ActiveSprintProps> = ({ role }) => {
  const { projectId } = useParams<{ projectId: string }>();
  const { token } = useAuth();
  
  const [sprint, setSprint] = useState<SprintData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const fetchSprint = async () => {
    if (!token || !projectId) return;
    try {
      const data = await getActiveSprint(token, projectId);
      setSprint(data);
    } catch (err) {
      console.error("Failed to fetch active sprint", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSprint();
  }, [token, projectId]);

  const handleSprintStarted = (newSprint: SprintData) => {
    setSprint(newSprint);
    setIsDrawerOpen(false);
  };

  if (isLoading) {
    return <div className="active-sprint-container"><p>Loading sprint data...</p></div>;
  }

  return (
    <div className="active-sprint-container">
      {!sprint ? (
        <div className="empty-sprint-state">
          {role === "scrum_master" ? (
            <div className="start-sprint-prompt">
              <h2>Ready to start the next sprint?</h2>
              <p>You don't have any active sprints. Create one and pull in user stories from the product backlog to begin work.</p>
              <Button onClick={() => setIsDrawerOpen(true)}>Start Sprint</Button>
            </div>
          ) : (
            <div className="empty-sprint-prompt">
              <h2>no ongoing sprint yet.</h2>
              <p>wait for the scrum master to start a sprint</p>
            </div>
          )}

          <StartSprintDrawer 
            isOpen={isDrawerOpen} 
            onClose={() => setIsDrawerOpen(false)} 
            onSprintStarted={handleSprintStarted}
          />
        </div>
      ) : (
        <div className="sprint-board-wrapper">
          <div className="sprint-header">
            <div className="sprint-header-details">
              <h2>Active Sprint</h2>
              <p className="sprint-goal"><strong>Goal:</strong> {sprint.goal}</p>
            </div>
            <div className="sprint-dates">
              <span className="date-badge">Ends: {new Date(sprint.endDate).toLocaleDateString()}</span>
            </div>
          </div>

          <KanbanBoard sprintId={sprint._id} />
        </div>
      )}
    </div>
  );
};

export default ActiveSprint;
