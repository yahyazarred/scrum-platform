// ============================================================
// What is this file?
//   The Project Details panel. It fetches and displays the
//   project's core metrics, description, and dynamic progress bar.
//   It conditionally renders Edit/Delete modals if the user
//   is a Product Owner.
// ============================================================
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { getProjectById, updateProject, deleteProject, getProjectMembers, leaveProject, kickMember } from '../../services/project.api';
import type { ProjectData, ProjectMemberData } from '../../services/project.api';
import { getUserStories } from '../../services/backlog.api';
import type { UserStoryData } from '../../services/backlog.api';
import { Button } from '../ui/Button/Button';
import './ProjectDetails.css';

// The props injected by the parent ProjectDashboard component
interface ProjectDetailsProps {
  projectId: string;
  role: string | null;
  initialProject: ProjectData | null;
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ projectId, role, initialProject }) => {
  const navigate = useNavigate();
  const { token } = useAuth();
  
// ==========================================
  // COMPONENT STATE
  // ==========================================
  
  // --- Core Data State ---
  // project: Holds the specific metadata (name, description, duration) of the active project.
  // Initially populated via location state to bypass a loading screen if coming from the dashboard,
  // but updated via a network fetch if it's missing (e.g. from a page refresh).
  const [project, setProject] = useState<ProjectData | null>(initialProject);
  
  // stories: An array containing every UserStory associated with the current project.
  const [stories, setStories] = useState<UserStoryData[]>([]);

  // members: Used to display the exact team composition directly within this tab.
  const [members, setMembers] = useState<ProjectMemberData[]>([]);
  
  // loading: UI flag that protects the page from rendering undefined JSX elements.
  const [loading, setLoading] = useState<boolean>(!initialProject);
  
  // --- Modals State ---
  // Simple boolean toggles that dictate whether the "Edit" or "Delete" modal overlay is active.
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [kickTarget, setKickTarget] = useState<{ id: string; name: string } | null>(null);
  
  // --- Edit Form State ---
  // These discrete string states track the text inputs inside the Edit Modal form.
  // They are strictly synchronized to the current `project` object whenever the modal opens.
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editSprintDuration, setEditSprintDuration] = useState("2 Weeks");
  const [editProjectGoal, setEditProjectGoal] = useState("");
  const [editGithubLink, setEditGithubLink] = useState("");

  // ==========================================
  // USE-EFFECT HOOKS
  // ==========================================
  
  // Hook 1: Master Data Fetch
  // Fires strictly upon mount or if the `projectId` or `token` alters.
  useEffect(() => {
    if (!token || !projectId) return;

    const fetchDetails = async () => {
      try {
        // If we don't have cached data from the router, fetch it manually
        if (!project) {
          const p = await getProjectById(token, projectId);
          setProject(p);
        }
        // Always fetch stories so we have an accurate progress bar
        const [s, m] = await Promise.all([
           getUserStories(token, projectId),
           getProjectMembers(token, projectId)
        ]);
        setStories(s);
        setMembers(m);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load project details.");
      } finally {
        setLoading(false); // Once complete, peel back the loading curtain
      }
    };
    fetchDetails();
  }, [token, projectId, project]);

  // Hook 2: Modal Data Synchronization
  // Listens for the `isEditModalOpen` flag. Whenever the PO clicks "Edit",
  // this effect immediately maps the existing Project data over into the temporary Form States.
  useEffect(() => {
    if (isEditModalOpen && project) {
      setEditName(project.name);
      setEditDesc(project.description || "");
      setEditSprintDuration(project.sprintDuration);
      setEditProjectGoal(project.projectGoal);
      setEditGithubLink(project.githubLink || "");
    }
  }, [isEditModalOpen, project]);

  // --- Rendering Gates ---
  // Ensures the JSX down below doesn't crash from accessing null objects
  if (loading) return <div className="placeholder-content">Loading...</div>;
  if (!project) return <div className="placeholder-content">Project not found.</div>;

  // ==========================================
  // Progress Bar Math
  // Calculated by summing the number of stories marked "Done"
  // vs the total number of stories.
  // ==========================================
  const totalStories = stories.length;
  const doneStories = stories.filter(s => s.status === "Done").length;
  const completionPercentage = totalStories === 0 ? 0 : Math.round((doneStories / totalStories) * 100);

  // --- Handlers ---
  
  const roleOrder = { product_owner: 0, scrum_master: 1, developer: 2 };
  const sortedMembers = [...members].sort((a, b) => roleOrder[a.role] - roleOrder[b.role]);

  // Submits the updated project fields to the backend
  const handleEditProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    try {
      const { project: updated } = await updateProject(token, projectId, {
        name: editName,
        description: editDesc,
        sprintDuration: editSprintDuration,
        projectGoal: editProjectGoal,
        githubLink: editGithubLink
      });
      setProject(updated);
      setIsEditModalOpen(false);
      toast.success("Project updated successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to edit project");
    }
  };

  // delete the project 
  const handleDeleteProject = async () => {
    if (!token) return;
    try {
      await deleteProject(token, projectId);
      setIsDeleteModalOpen(false);
      toast.success("Project deleted successfully");
      navigate('/dashboard'); // Eject user back to safety
    } catch(err: any) {
      toast.error(err.message || "Failed to delete project");
    }
  };

  const confirmLeaveProject = async () => {
    if (!token) return;
    try {
      await leaveProject(token, projectId);
      toast.success("You successfully left the project");
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.message || "Failed to leave project");
    } finally {
      setIsLeaveModalOpen(false);
    }
  };

  const confirmKickMember = async () => {
    if (!token || !kickTarget) return;
    try {
      await kickMember(token, projectId, kickTarget.id);
      setMembers(prev => prev.filter(m => m.user._id !== kickTarget.id));
      toast.success(`${kickTarget.name} removed from project.`);
    } catch (err: any) {
      toast.error(err.message || "Failed to kick member");
    } finally {
      setKickTarget(null);
    }
  };

  return (
    <div className="project-details-container">
      
      {/* 
        SECTION 1: Page Header 
        Displays the main Project Title, creation date, and optionally the PO action buttons. 
      */}
      <div className="details-header">
        <div className="details-header-text">
          <h2 className="project-details-title">{project.name}</h2>
          <span className="project-creation-date">
            Created on {new Date(project.createdAt).toLocaleDateString()}
          </span>
        </div>

        {/* ACCESS CONTROL GATE: 
            This dynamically hides the Delete & Edit capabilities exclusively to Product Owners.
        */}
        {role === "product_owner" ? (
          <div className="details-actions">
            <Button variant="secondary" onClick={() => setIsEditModalOpen(true)}>Edit Project</Button>
            <button className="btn-danger" onClick={() => setIsDeleteModalOpen(true)}>Delete Project</button>
          </div>
        ) : (
          <div className="details-actions">
            <button className="btn-danger" onClick={() => setIsLeaveModalOpen(true)}>Leave Project</button>
          </div>
        )}
      </div>

      {/* 
        SECTION 2: Main Grid Framework
        Splits the layout into a 2/3 ratio (Left Column: Core info) and 1/3 ratio (Right Column: Analytics)
      */}
      <div className="details-grid">
        
        {/* Left Column: Descriptive Content */}
        <div className="details-card main-info-card">
          <h2>Project Goal</h2>
          <p className="goal-text">{project.projectGoal}</p>
          
          <h2>Description</h2>
          <p className="desc-text">{project.description || "No description provided."}</p>
        </div>

        {/* Right Column: Dynamic Statistics & Meta Information */}
        <div className="details-side-col">
          
          {/* Component: The Completion Progress Bar */}
          <div className="details-card progress-card">
            <h3>Completion</h3>
            <div className="progress-stats">
              <span className="progress-fraction">{doneStories} / {totalStories}</span>
              <span className="progress-percentage">{completionPercentage}%</span>
            </div>
            
            {/* The physical rendered line representing the percentage */}
            <div className="progress-bar-bg">
              <div 
                className="progress-bar-fill" 
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
            <p className="progress-subtitle">completed user stories</p>
          </div>

          <div className="details-card meta-card">
            <div className="meta-item">
              <span className="meta-label">Sprint Duration</span>
              <span className="meta-value">{project.sprintDuration}</span>
            </div>
            {project.githubLink && (
              <div className="meta-item">
                <span className="meta-label">Repository</span>
                <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="meta-link">
                  GitHub Link ↗
                </a>
              </div>
            )}
            
            {project.joinCodes && (
               <div className="join-codes-section">
                 <span className="meta-label">Join Codes</span>
                 <div className="code-box">
                    <span className="code-role">Scrum Master</span>
                    <span className="code-val-SM">{project.joinCodes.scrumMaster}</span>
                 </div>
                 <div className="code-box">
                    <span className="code-role">Developer</span>
                    <span className="code-val-Dev">{project.joinCodes.developer}</span>
                 </div>
               </div>
            )}
          </div>
        </div>
      </div>

      {/* 
        SECTION 3: Team Members
      */}
      <div className="team-members-section">
        <h2 className="team-members-title">Team Members</h2>
        <div className="members-list">
          {sortedMembers.map((member) => (
            <div key={member._id} className="member-row">
              <div className="member-info">
                <div className="member-avatar">
                  {member.user.firstName.charAt(0)}{member.user.lastName.charAt(0)}
                </div>
                <div className="member-details">
                  <span className="member-name">{member.user.firstName} {member.user.lastName}</span>
                  <span className="member-email">{member.user.email}</span>
                </div>
              </div>
              
              <div className="member-role-badge">
                <span className={`role-pill ${member.role === 'product_owner' ? 'role-po' : member.role === 'scrum_master' ? 'role-sm' : 'role-dev'}`}>
                  {member.role.replace('_', ' ')}
                </span>
                
                {role === "product_owner" && member.role !== "product_owner" && (
                  <button onClick={() => setKickTarget({ id: member.user._id, name: member.user.firstName })} className="btn-kick" title="Kick Member">
                    Kick
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {isEditModalOpen && (
        <div className="pd-modal-overlay">
          <div className="pd-modal-content">
            <h3>Edit Project</h3>
            <form onSubmit={handleEditProject}>
              <div className="pd-form-grid">
                <div className="pd-input-group">
                  <label>Project Name</label>
                  <input 
                    type="text" 
                    value={editName} 
                    onChange={(e) => setEditName(e.target.value)} 
                    required 
                  />
                </div>
                
                <div className="pd-input-group">
                  <label>Sprint Duration</label>
                  <div className="pd-sprint-pills">
                    {['1 Week', '2 Weeks', '3 Weeks', '4 Weeks'].map((duration) => (
                      <button
                        type="button"
                        key={duration}
                        className={`pd-sprint-pill ${editSprintDuration === duration ? 'active' : ''}`}
                        onClick={() => setEditSprintDuration(duration)}
                      >
                        {duration}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pd-input-group pd-full-width">
                  <label>Project Goal</label>
                  <textarea 
                    value={editProjectGoal} 
                    onChange={(e) => setEditProjectGoal(e.target.value)} 
                    required 
                    rows={2}
                  />
                </div>

                <div className="pd-input-group pd-full-width">
                  <label>Description</label>
                  <textarea 
                    value={editDesc} 
                    onChange={(e) => setEditDesc(e.target.value)} 
                    rows={2}
                  />
                </div>

                <div className="pd-input-group pd-full-width">
                  <label>GitHub Repository</label>
                  <input 
                    type="url" 
                    value={editGithubLink} 
                    onChange={(e) => setEditGithubLink(e.target.value)} 
                  />
                </div>
              </div>
              
              <div className="pd-modal-actions">
                <Button type="button" variant="ghost" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
                <Button type="submit" variant="primary">Save Changes</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="pd-modal-overlay">
          <div className="pd-modal-content delete-modal">
            <h3>Delete Project</h3>
            <p>Are you sure you want to delete <strong>{project.name}</strong>? This action cannot be undone and will permanently erase all associated user stories and epics.</p>
            <div className="pd-modal-actions">
              <Button type="button" variant="ghost" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
              <button className="btn-danger" onClick={handleDeleteProject}>Yes, Delete Project</button>
            </div>
          </div>
        </div>
      )}

      {isLeaveModalOpen && (
        <div className="pd-modal-overlay">
          <div className="pd-modal-content delete-modal">
            <h3>Leave Project</h3>
            <p>Are you sure you want to leave <strong>{project.name}</strong>? You will be removed from all your assigned sub-tasks simultaneously.</p>
            <div className="pd-modal-actions">
              <Button type="button" variant="ghost" onClick={() => setIsLeaveModalOpen(false)}>Cancel</Button>
              <button className="btn-danger" onClick={confirmLeaveProject}>Yes, Leave Project</button>
            </div>
          </div>
        </div>
      )}

      {kickTarget && (
        <div className="pd-modal-overlay">
          <div className="pd-modal-content delete-modal">
            <h3>Kick Team Member</h3>
            <p>Are you sure you want to violently remove <strong>{kickTarget.name}</strong> from this project? They will be automatically un-assigned from all active sprints.</p>
            <div className="pd-modal-actions">
              <Button type="button" variant="ghost" onClick={() => setKickTarget(null)}>Cancel</Button>
              <button className="btn-danger" onClick={confirmKickMember}>Yes, Kick Member</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;
