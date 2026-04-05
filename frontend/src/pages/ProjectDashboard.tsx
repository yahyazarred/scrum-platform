import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Header } from '../components/Header/Header';
import { useAuth } from '../context/AuthContext';
import './ProjectDashboard.css';

const ProjectDashboard: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { token } = useAuth();
  
  // Extract data passed invisibly from Dashboard's onClick router state.
  // This cleverly prevents an immediate database re-fetch just to render the UI header strings.
  const [projectName] = useState<string>(location.state?.project?.name || "Project Details");
  const [userRole] = useState<string | null>(location.state?.role || null);

  useEffect(() => {
    // Basic auth check
    if (!token) { navigate('/auth'); return; }
      
  }, [token, navigate, projectId]);

  return (
    <div className="project-dashboard-wrapper">
      <Header>
          <button className="back-to-dashboard-btn" onClick={() => navigate('/dashboard')}>
            ← Back to Dashboard
          </button>
      </Header>

      {/* Layout structurally drops 70px from the top via CSS margin-top to avoid being hidden under the fixed global Header */}
      <div className="project-layout-container">
        {/* Isolated left sidebar space. Future refactor: Move this to an isolated <Sidebar /> component once it scales in complexity */}
        <aside className="project-sidebar">
          <div className="sidebar-header">
            <h2 className="project-title">{projectName}</h2>
            {/* Renders the precise Scrum Role dynamically extracted from the Dashboard routing state object */}
            {userRole && (
              <span className={`sidebar-role-badge ${userRole}`}>
                {userRole.replace('_', ' ')}
              </span>
            )}
          </div>
          {/* Empty sidebar for now */}
        </aside>

        {/* The expansive canvas area meant for injecting Tabs/Board contents based on Project selection */}
        <main className="project-main-content">
          {/* Empty main content for now */}
          <div className="placeholder-content">
            <p>Main project area</p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProjectDashboard;
