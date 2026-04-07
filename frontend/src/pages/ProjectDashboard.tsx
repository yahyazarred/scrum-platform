import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Header } from '../components/Header/Header';
import ProductBacklog from '../components/Backlog/ProductBacklog';
import ProjectDetails from '../components/ProjectDetails/ProjectDetails';
import './ProjectDashboard.css';

const ProjectDashboard: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  
  // Extract data passed invisibly from Dashboard's onClick router state.
  // This prevents an immediate database re-fetch
  const [projectName] = useState<string>(location.state?.project?.name || "Project Details");
  const [userRole] = useState<string | null>(location.state?.role || null);
  const [activeTab, setActiveTab] = useState<string>('details');



  return (
    <div className="project-dashboard-wrapper">
      <Header>
          <button className="back-to-dashboard-btn" onClick={() => navigate('/dashboard')}>
            ← Back to Dashboard
          </button>
      </Header>

      <div className="project-layout-container">
        {/* Isolated left sidebar space. Future refactor: Move this to an isolated <Sidebar /> component once it scales in complexity */}
        <aside className="project-sidebar">
          <div className="sidebar-header">
            <h2 className="project-title">{projectName}</h2>
            {/* Renders the precise Scrum Role dynamically extracted from the Dashboard when you click on a project */}
            {userRole && (
              <span className={`sidebar-role-badge ${userRole}`}>
                {userRole.replace('_', ' ')}
              </span>
            )}
          </div>
          
          <nav className="sidebar-nav">
            <button 
              className={`sidebar-tab ${activeTab === 'details' ? 'active' : ''}`}
              onClick={() => setActiveTab('details')}
            >
              Project Details
            </button>
            <button 
              className={`sidebar-tab ${activeTab === 'backlog' ? 'active' : ''}`}
              onClick={() => setActiveTab('backlog')}
            >
              Product Backlog
            </button>
            {/* Future tabs will go here */}
          </nav>
        </aside>

        <main className="project-main-content">
          {activeTab === 'details' && (
            <ProjectDetails
              projectId={location.pathname.split("/").pop() || ""}
              role={userRole}
              initialProject={location.state?.project || null}
            />
          )}
          {activeTab === 'backlog' && <ProductBacklog role={userRole} />}
        </main>
      </div>
    </div>
  );
};

export default ProjectDashboard;
