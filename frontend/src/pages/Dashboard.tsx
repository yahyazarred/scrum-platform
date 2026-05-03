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
  const navigate = useNavigate();
  const { token, logout } = useAuth();

  // user info for the profile button
  const [user, setUser] = useState<UserProfile | null>(null);
  const [projects, setProjects] = useState<ProjectMembershipData[]>([]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  const [createForm, setCreateForm] = useState({
    name: "",
    description: "",
    sprintDuration: 2,
    projectGoal: "",
    githubLink: "",
  });

  const handleCreateChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setCreateForm((prev) => ({
      ...prev,
      [name]: name === "sprintDuration" ? Number(value) : value,
    }));
  };

  // --- Join Project Form ---
  const [joinCode, setJoinCode] = useState("");

  const fetchProjects = async () => {
    if (!token) return;
    try {
      const data = await getUserProjects(token);
      setProjects(data);
    } catch (err) {
      console.error("Error fetching projects:", err);
      toast.error("Failed to fetch project list.");
    }
  };

  useEffect(() => {
    if (!token) return;

    getMe(token)
      .then(setUser)
      .catch(() => logout());

    fetchProjects();
  }, [token]);

  const initials = user
    ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()
    : '?';

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!token) return;

      await createProject(token, createForm);

      setIsCreateModalOpen(false);

      // reset form
      setCreateForm({
        name: "",
        description: "",
        sprintDuration: 2,
        projectGoal: "",
        githubLink: "",
      });

      toast.success("Project created successfully!");
      fetchProjects();
    } catch (err: any) {
      toast.error(err.message || "Failed to create project");
    }
  };


  const handleJoinProject = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!token) return;

      await joinProject(token, { joinCode });

      setIsJoinModalOpen(false);
      setJoinCode("");

      toast.success("Joined project successfully!");
      fetchProjects();
    } catch (err: any) {
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
              >
                Create a Project
              </Button>

              <Button
                variant="secondary"
                onClick={() => setIsJoinModalOpen(true)}
                disabled={user ? user.status !== "VERIFIED" : false}
              >
                Join a Project
              </Button>
            </div>
          </div>

          <div className="projects-grid">
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
                      navigate(`/project/${membership.project._id}`, {
                        state: {
                          project: membership.project,
                          role: membership.role
                        }
                      });
                    }
                  }}
                />
              ))
            )}
          </div>

        </div>
      </main>

      {/* ================= create project modal ================= */}
      {isCreateModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Create a New Project</h3>

            <form onSubmit={handleCreateProject}>
              <div className="form-grid">

                <div className="input-group">
                  <label>Project Name</label>
                  <input
                    name="name"
                    value={createForm.name}
                    onChange={handleCreateChange}
                    placeholder="e.g. Website Redesign"
                    required
                  />
                </div>

                <div className="input-group">
                  <label>Sprint Duration</label>

                  <div className="sprint-pills">
                    {[1, 2, 3, 4].map((duration) => (
                      <button
                        type="button"
                        key={duration}
                        className={`sprint-pill ${createForm.sprintDuration === duration ? 'active' : ''}`}
                        onClick={() =>
                          setCreateForm((prev) => ({
                            ...prev,
                            sprintDuration: duration,
                          }))
                        }
                      >
                        {duration} Week{duration !== 1 ? 's' : ''}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="input-group full-width">
                  <label>Project Goal</label>
                  <textarea
                    name="projectGoal"
                    value={createForm.projectGoal}
                    onChange={handleCreateChange}
                    required
                    placeholder="What is the goal?"
                  />
                </div>

                <div className="input-group full-width">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={createForm.description}
                    onChange={handleCreateChange}
                    placeholder="Optional description"
                  />
                </div>

                <div className="input-group full-width">
                  <label>GitHub Repo</label>
                  <input
                    name="githubLink"
                    value={createForm.githubLink}
                    onChange={handleCreateChange}
                    placeholder="https://github.com/..."
                  />
                </div>

              </div>

              <div className="modal-actions">
                <Button type="button" variant="ghost" onClick={() => setIsCreateModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Create Project
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= join project modal ================= */}
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
                />
              </div>

              <div className="modal-actions">
                <Button type="button" variant="ghost" onClick={() => setIsJoinModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Join Project
                </Button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;