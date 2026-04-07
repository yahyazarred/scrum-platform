// ============================================================
// What is this file?
//   The main dashboard view where users manage their projects.
//   Includes modals for creating and joining projects, and a grid 
//   displaying existing project memberships.
// ============================================================
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { getMe } from '../services/user.api';
import { getUserProjects, createProject, joinProject } from '../services/project.api';
import type { UserProfile } from '../services/user.api';
import type { ProjectMembershipData } from '../services/project.api';
import { Header } from '../components/Header/Header';
import { ProjectCard } from '../components/ProjectCard/ProjectCard';
import { Button } from '../components/ui/Button/Button';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const navigate          = useNavigate();
  const { token, logout } = useAuth(); 
  const [user, setUser]   = useState<UserProfile | null>(null);
  
  // --- Dashboard State ---
  const [projects, setProjects] = useState<ProjectMembershipData[]>([]);
  
  // --- Modals Visibility State ---
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  
  // --- Create Project Form State ---
  const [createName, setCreateName] = useState("");
  const [createDesc, setCreateDesc] = useState("");
  const [createSprintDuration, setCreateSprintDuration] = useState("2 Weeks");
  const [createProjectGoal, setCreateProjectGoal] = useState("");
  const [createGithubLink, setCreateGithubLink] = useState("");
  
  // --- Join Project Form State ---
  const [joinCode, setJoinCode] = useState("");

  // ==========================================
  // Data Fetching
  // ==========================================
  const fetchProjects = async () => {
    if (!token) return;
    try {
      const data = await getUserProjects(token);
      setProjects(data);
    } catch (err: any) {
      console.error("Error fetching projects:", err);
      toast.error("Failed to fetch project list.");
    }
  };


  useEffect(() => {
    // Return early if token isn't loaded yet
    if (!token) return;

    // Fetch the logged-in user's info
    getMe(token)
      .then(setUser)
      .catch(() => {
        // If getting user details fails, immediately log out
        logout();
      });
      
    // Fetch user's project memberships
    fetchProjects();
  }, [token]);

  const initials = user
    ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()
    : '?';

  
  // Handles form submission for creating a new project
  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!token) return;
      await createProject(token, { 
        name: createName, 
        description: createDesc,
        sprintDuration: createSprintDuration,
        projectGoal: createProjectGoal,
        githubLink: createGithubLink
      });
      
      // On success: close modal, reset form, show toast, and refresh data
      setIsCreateModalOpen(false);
      setCreateName("");
      setCreateDesc("");
      setCreateSprintDuration("2 Weeks");
      setCreateProjectGoal("");
      setCreateGithubLink("");
      toast.success("Project created successfully!");
      fetchProjects();
    } catch (err: any) {
      // Show toaster error
      toast.error(err.message || "Failed to create project");
    }
  };

  // Handles form submission for joining an existing project with a generated code
  const handleJoinProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!token) return;
      await joinProject(token, { joinCode });
      
      // On success: close modal, reset code, show toast, and refresh data
      setIsJoinModalOpen(false);
      setJoinCode("");
      toast.success("Joined project successfully!");
      fetchProjects();
    } catch (err: any) {
      // Show toaster error
      toast.error(err.message || "Failed to join project");
    }
  };

  return (
    <div className="dashboard-wrapper">
      <Header>
        <div className="dashboard-header-right">
          {user && user.status !== "VERIFIED" && (
            <div 
              className="unverified-badge" 
              onClick={() => navigate('/profile')}
              title="Click to go to your profile and verify your email"
            >
              ⚠️ Unverified Account
            </div>
          )}
          <button className="profile-btn" onClick={() => navigate('/profile')}>
            <div className="profile-avatar">{initials}</div>
            {user ? `${user.firstName} ${user.lastName}` : '…'}
          </button>
        </div>
      </Header>

      <main className="dashboard-main">
        <div className="dashboard-content">
          <div className="dashboard-actions">
            <h2 className="section-title">Your Projects</h2>
            <div className="action-buttons">
              <Button 
                variant="primary" 
                onClick={() => setIsCreateModalOpen(true)}
                disabled={user ? user.status !== "VERIFIED" : false}
                title={user && user.status !== "VERIFIED" ? "Please verify your email to create a project" : ""}
              >
                Create a Project
              </Button>
              <Button 
                variant="secondary" 
                onClick={() => setIsJoinModalOpen(true)}
                disabled={user ? user.status !== "VERIFIED" : false}
                title={user && user.status !== "VERIFIED" ? "Please verify your email to join a project" : ""}
              >
                Join a Project
              </Button>
            </div>
          </div>

          <div className="projects-grid">
            {/* Navigation click binds the specific project data and the membership role directly into the router state 
                so the target page doesn't need to perform an immediate API fetch to render the header labels. */}
            {projects.length === 0 ? (
              <p className="no-projects">You are not a part of any projects yet.</p>
            ) : (
              projects.map(membership => (
                <ProjectCard 
                  key={membership._id} 
                  membership={membership} 
                  onClick={() => {
                    if (user && user.status !== "VERIFIED") {
                      toast.error("Please verify your email to access this project");
                    } else {
                      navigate(`/project/${membership.project._id}`, { state: { project: membership.project, role: membership.role } });
                    }
                  }}
                />
              ))
            )}
          </div>
        </div>
      </main>

      {/* --- Modals --- */}
      {isCreateModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Create a New Project</h3>
            <form onSubmit={handleCreateProject}>
              <div className="form-grid">
                <div className="input-group">
                  <label>Project Name</label>
                  <div className="input-with-icon">
                    <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                    <input 
                      type="text" 
                      value={createName} 
                      onChange={(e) => setCreateName(e.target.value)} 
                      required 
                      placeholder="e.g. Website Redesign"
                    />
                  </div>
                </div>
                
                <div className="input-group">
                  <label>Sprint Duration</label>
                  <div className="sprint-pills">
                    {['1 Week', '2 Weeks', '3 Weeks', '4 Weeks'].map((duration) => (
                      <button
                        type="button"
                        key={duration}
                        className={`sprint-pill ${createSprintDuration === duration ? 'active' : ''}`}
                        onClick={() => setCreateSprintDuration(duration)}
                      >
                        {duration}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="input-group full-width">
                  <label>Project Goal</label>
                  <div className="input-with-icon">
                    <svg className="input-icon textarea-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
                    <textarea 
                      value={createProjectGoal} 
                      onChange={(e) => setCreateProjectGoal(e.target.value)} 
                      required 
                      placeholder="What is the overarching goal of this project?"
                      rows={2}
                    />
                  </div>
                </div>

                <div className="input-group full-width">
                  <label>Description (optional)</label>
                  <div className="input-with-icon">
                    <svg className="input-icon textarea-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>
                    <textarea 
                      value={createDesc} 
                      onChange={(e) => setCreateDesc(e.target.value)} 
                      placeholder="What is this project about?"
                      rows={2}
                    />
                  </div>
                </div>

                <div className="input-group full-width">
                  <label>GitHub Repository (optional)</label>
                  <div className="input-with-icon">
                    <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
                    <input 
                      type="url" 
                      value={createGithubLink} 
                      onChange={(e) => setCreateGithubLink(e.target.value)} 
                      placeholder="https://github.com/..."
                    />
                  </div>
                </div>
              </div>
              
              <div className="modal-actions">
                <Button type="button" variant="ghost" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
                <Button type="submit" variant="primary">Create Project</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isJoinModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Join a Project</h3>
            <form onSubmit={handleJoinProject}>
              <div className="input-group">
                <label>Join Code</label>
                <input 
                  type="text" 
                  value={joinCode} 
                  onChange={(e) => setJoinCode(e.target.value)} 
                  required 
                  placeholder="e.g. A8B9Z1"
                />
              </div>
              <div className="modal-actions">
                <Button type="button" variant="ghost" onClick={() => setIsJoinModalOpen(false)}>Cancel</Button>
                <Button type="submit" variant="primary">Join Project</Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;