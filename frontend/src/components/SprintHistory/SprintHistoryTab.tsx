import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getSprintHistory } from '../../services/sprint.api';
import type { SprintData } from '../../services/sprint.api';
import { VelocityChart } from '../Analytics/VelocityChart';
import { BurndownChart } from '../Analytics/BurndownChart';
import './SprintHistoryTab.css';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';

const SprintHistoryTab: React.FC = () => {
  const { token } = useAuth();
  const location = useLocation();
  const projectId = location.pathname.split("/").pop() || "";
  
  const [sprints, setSprints] = useState<SprintData[]>([]);
  const [selectedSprint, setSelectedSprint] = useState<SprintData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token || !projectId) return;

    const fetchHistory = async () => {
      try {
        const data = await getSprintHistory(token, projectId);
        setSprints(data);
      } catch (error) {
        toast.error("Failed to load sprint history");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [token, projectId]);

  if (loading) return <div className="history-loading">Gathering analytics...</div>;

  if (sprints.length === 0) {
    return (
      <div className="history-empty">
        <h3>No Completed Sprints Yet</h3>
        <p>Your team's velocity and burndown charts will automatically generate here once a sprint is completed.</p>
      </div>
    );
  }

  return (
    <div className="sprint-history-container">
      <div className="history-top-section">
        <VelocityChart sprints={sprints} />
      </div>

      <div className="history-bottom-section">
        <div className="history-selector">
          <h3>Past Sprints</h3>
          <div className="sprint-list">
            {sprints.map((sprint, idx) => (
              <div 
                key={sprint._id} 
                className={`history-sprint-card ${selectedSprint?._id === sprint._id ? 'active' : ''}`}
                onClick={() => setSelectedSprint(sprint)}
              >
                <h4>Sprint {sprint.sprintNumber || idx + 1}</h4>
                <p>{new Date(sprint.startDate).toLocaleDateString()} - {new Date(sprint.endDate).toLocaleDateString()}</p>
                <div className="history-metrics-badge">
                  {sprint.metrics?.completedPoints || 0}/{sprint.metrics?.totalPoints || 0} pts
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="history-details-pane">
          {selectedSprint ? (
            selectedSprint.burndownData && selectedSprint.burndownData.length > 0 ? (
              <BurndownChart data={selectedSprint.burndownData} title={`Sprint ${selectedSprint.sprintNumber} Burndown`} />
            ) : (
              <div className="no-burndown-data">
                <p>No burndown data available for this sprint.</p>
              </div>
            )
          ) : (
            <div className="select-sprint-prompt">
              <p>Select a past sprint to view its historical burndown chart.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SprintHistoryTab;
