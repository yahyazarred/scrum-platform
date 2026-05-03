import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getActiveSprint, endSprint, getActiveSprintBurndown } from "../../services/sprint.api";
import type { SprintData, BurndownDataPoint } from "../../services/sprint.api";
import { getUserStories } from "../../services/backlog.api";
import type { UserStoryData } from "../../services/backlog.api";
import { toast } from "react-toastify";
import { Button } from "../ui/Button/Button";
import StartSprintDrawer from "./StartSprintDrawer";
import KanbanBoard from "./KanbanBoard";
import { BurndownChart } from "../Analytics/BurndownChart";
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
  const [isEndSprintModalOpen, setIsEndSprintModalOpen] = useState(false);
  const [isBurndownModalOpen, setIsBurndownModalOpen] = useState(false);
  const [stories, setStories] = useState<UserStoryData[]>([]);
  const [burndownData, setBurndownData] = useState<BurndownDataPoint[]>([]);

  const fetchSprint = async () => {
    if (!token || !projectId) return;
    setIsLoading(true);
    try {
      const data = await getActiveSprint(token, projectId);
      setSprint(data);
      if (data) {
        const allStories = await getUserStories(token, projectId);
        setStories(allStories.filter(s => s.sprint === data._id));

        try {
          const bData = await getActiveSprintBurndown(token, projectId);
          setBurndownData(bData);
        } catch (err) {
          console.error("Failed to load active burndown", err);
        }
      } else {
        setStories([]);
        setBurndownData([]);
      }
    } catch (err) {
      console.error("Failed to fetch active sprint", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSprint();
  }, [token, projectId]);

  const handleSprintStarted = () => {
    setIsDrawerOpen(false);
    fetchSprint(); // Re-fetch from database to get the fresh assigned stories
  };

  const handleEndSprint = async () => {
    if (!token || !projectId) return;
    try {
      await endSprint(token, projectId);
      toast.success("Sprint ended successfully");
      setIsEndSprintModalOpen(false);
      setSprint(null);
      setStories([]);
      setBurndownData([]); // Instantly clear metrics to prevent bleeding into next sprint UI
    } catch (err: any) {
      console.error("Failed to end sprint:", err);
      toast.error(err.message || "Failed to end sprint");
    }
  };

  if (isLoading) {
    return <div className="active-sprint-container"><p>Loading sprint data...</p></div>;
  }

  const totalStories = stories.length;
  const doneStories = stories.filter(s => s.status === "Done").length;
  const completionPercentage = totalStories === 0 ? 0 : Math.round((doneStories / totalStories) * 100);

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
              <h2>{sprint.sprintNumber ? `Sprint ${sprint.sprintNumber}` : "Active Sprint"}</h2>
              <p className="sprint-goal"><strong>Goal:</strong> {sprint.goal}</p>
            </div>

            <div className="sprint-progress-center" style={{ flex: 1, margin: '0 40px', maxWidth: '400px' }}>
              <div className="progress-stats" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '14px', color: '#fff', fontWeight: 600 }}>Sprint Progress</span>
                <span style={{ fontSize: '14px', color: '#fff' }}>{doneStories} / {totalStories} ({completionPercentage}%)</span>
              </div>
              <div className="progress-bar-bg" style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                <div className="progress-bar-fill" style={{ width: `${completionPercentage}%`, height: '100%', background: 'linear-gradient(90deg, var(--primary-blue) 0%, var(--primary-orange) 100%)', transition: 'width 0.5s ease-in-out' }}></div>
              </div>
            </div>

            <div className="sprint-dates" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              
              <Button type="button" variant="secondary" onClick={() => setIsBurndownModalOpen(true)}>📈 Burndown</Button>
              {role === "scrum_master" && (
                <button className="btn-danger" onClick={() => setIsEndSprintModalOpen(true)}>End Sprint</button>
              )}
            </div>
          </div>

          <KanbanBoard stories={stories} setStories={setStories} role={role} />

          {isEndSprintModalOpen && (
            <div className="pd-modal-overlay">
              <div className="pd-modal-content delete-modal">
                <h3>End Sprint</h3>
                <p>Are you sure you want to end <strong>{sprint.sprintNumber ? `Sprint ${sprint.sprintNumber}` : "this sprint"}</strong> prematurely? This action will move any unresolved user stories back to the Product Backlog.</p>
                <div className="pd-modal-actions">
                  <Button type="button" variant="ghost" onClick={() => setIsEndSprintModalOpen(false)}>Cancel</Button>
                  <button className="btn-danger" onClick={handleEndSprint}>Yes, End Sprint</button>
                </div>
              </div>
            </div>
          )}

          {isBurndownModalOpen && (
            <div className="pd-modal-overlay">
              <div className="pd-modal-content burndown-modal-content">
                <div className="burndown-modal-header">
                  <h3>Active Sprint Burndown</h3>
                  <button className="burndown-modal-close" onClick={() => setIsBurndownModalOpen(false)}>✕</button>
                </div>
                {burndownData.length > 0 ? (
                  <BurndownChart data={burndownData} title="Live Trajectory" />
                ) : (
                  <p className="burndown-loading-msg">Gathering data...</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ActiveSprint;
