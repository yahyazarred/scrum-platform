import React, { useState, useEffect } from "react";
import type { UserStoryData } from "../../services/backlog.api";
import { getBlockers, createBlocker, solveBlocker } from "../../services/blocker.api";
import type { BlockerData } from "../../services/blocker.api";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { Button } from "../ui/Button/Button";
import "./StoryDetailsModal.css";

interface StoryDetailsModalProps {
  story: UserStoryData;
  onClose: () => void;
  role: string | null;
  onUpdateStory: (updatedStory: UserStoryData) => void;
}

const StoryDetailsModal: React.FC<StoryDetailsModalProps> = ({ story, onClose, role, onUpdateStory }) => {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState<"details" | "subtasks" | "blockers">("details");
  
  // Blocker States
  const [blockers, setBlockers] = useState<BlockerData[]>([]);
  const [isBlockersLoading, setIsBlockersLoading] = useState(false);
  const [newBlockerText, setNewBlockerText] = useState("");
  const [solvingBlockerId, setSolvingBlockerId] = useState<string | null>(null);
  const [resolutionText, setResolutionText] = useState("");

  const fetchBlockers = async () => {
    if (!token) return;
    setIsBlockersLoading(true);
    try {
      const data = await getBlockers(token, story.project, story._id);
      setBlockers(data);
    } catch (err) {
      console.error("Failed to load blockers", err);
    } finally {
      setIsBlockersLoading(false);
    }
  };

  // Fetch blockers when the component opens so we have the data ready if they switch to the tab
  useEffect(() => {
    fetchBlockers();
  }, [story._id]);

  const handleCreateBlocker = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !newBlockerText.trim()) return;
    
    try {
      const newBlocker = await createBlocker(token, story.project, story._id, newBlockerText);
      setBlockers(prev => [newBlocker, ...prev]);
      setNewBlockerText("");
      toast.success("Blocker reported");
      
      // Update parent UI with locked status inherently
      onUpdateStory({ ...story, isBlocked: true });
    } catch (err: any) {
      toast.error(err.message || "Failed to create blocker");
    }
  };

  const handleSolveBlocker = async (blockerId: string) => {
    if (!token || !resolutionText.trim()) return;
    
    try {
      const solvedBlocker = await solveBlocker(token, story.project, story._id, blockerId, resolutionText);
      
      setBlockers(prev => prev.map(b => b._id === blockerId ? solvedBlocker : b));
      setSolvingBlockerId(null);
      setResolutionText("");
      toast.success("Blocker resolved");

      // Check if we need to remove the red lock from the story globally
      // (If this was the last unsolved blocker)
      const hasMoreBlockers = blockers.some(b => b._id !== blockerId && b.status === "unsolved");
      if (!hasMoreBlockers) {
        onUpdateStory({ ...story, isBlocked: false });
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to solve blocker");
    }
  };

  // Prevent clicks inside the modal from bubbling up and triggering the overlay's onClose
  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="story-modal-overlay" onClick={onClose}>
      <div className="story-modal-content" onClick={handleModalClick}>
        
        {/* Header Region: Title and Close button always visible */}
        <div className="story-modal-header">
          <h2 className="story-modal-title">{story.title}</h2>
          <button className="story-modal-close" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        {/* Tab Navigation Menu */}
        <div className="story-modal-tabs">
          <button 
            className={`story-tab-btn ${activeTab === "details" ? "active" : ""}`}
            onClick={() => setActiveTab("details")}
          >
            Details
          </button>
          <button 
            className={`story-tab-btn ${activeTab === "subtasks" ? "active" : ""}`}
            onClick={() => setActiveTab("subtasks")}
          >
            Sub-tasks
          </button>
          <button 
            className={`story-tab-btn ${activeTab === "blockers" ? "active" : ""}`}
            onClick={() => setActiveTab("blockers")}
          >
            Blockers
          </button>
        </div>

        {/* Dynamic Tab Body Content */}
        <div className="story-modal-body">
          {activeTab === "details" && (
            <div className="story-details-grid">
              
              {/* Description Block */}
              <div className="sd-field">
                <h4>Description</h4>
                <p>{story.description || <span style={{ color: "var(--text-muted)", fontStyle: "italic" }}>No description provided.</span>}</p>
              </div>

              {/* Flex wrapper for Epic and Priority to save vertical space */}
              <div style={{ display: "flex", gap: "20px" }}>
                <div className="sd-field" style={{ flex: 1 }}>
                  <h4>Epic</h4>
                  {story.epic ? (
                     <div style={{ display: "inline-block", backgroundColor: story.epic.color, color: "#fff", padding: "4px 10px", borderRadius: "12px", fontSize: "14px", fontWeight: 600 }}>
                       {story.epic.title}
                     </div>
                  ) : (
                    <p style={{ color: "var(--text-muted)", fontStyle: "italic" }}>Unassigned</p>
                  )}
                </div>

                <div className="sd-field" style={{ flex: 1 }}>
                  <h4>Priority</h4>
                  <p>#{story.priority}</p>
                </div>
              </div>

            </div>
          )}

          {activeTab === "subtasks" && (
            <div className="sd-placeholder">
              <p>No sub-tasks defined yet.</p>
            </div>
          )}

          {activeTab === "blockers" && (
            <div className="sd-blockers-container" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Form to create a new blocker (Developers Only) */}
              {role === "developer" && (
                <form onSubmit={handleCreateBlocker} style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                  <h4 style={{ color: '#ef4444', margin: '0 0 10px 0', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>⚠️ Report New Blocker</h4>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input 
                      type="text" 
                      placeholder="What is blocking this story?"
                      value={newBlockerText}
                      onChange={(e) => setNewBlockerText(e.target.value)}
                      style={{ flex: 1, padding: '10px 14px', borderRadius: '6px', border: 'none', background: 'rgba(0,0,0,0.2)', color: '#fff' }}
                    />
                    <Button type="submit" disabled={!newBlockerText.trim()}>Report</Button>
                  </div>
                </form>
              )}

              {/* List of Blockers */}
              <div className="sd-blockers-list" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {isBlockersLoading ? (
                  <p style={{ color: 'var(--text-muted)' }}>Loading blockers...</p>
                ) : blockers.length === 0 ? (
                  <div className="sd-placeholder">
                    <p>No active blockers reported.</p>
                  </div>
                ) : (
                  blockers.map(blocker => (
                    <div key={blocker._id} style={{ background: 'rgba(255, 255, 255, 0.03)', border: `1px solid ${blocker.status === 'unsolved' ? 'rgba(239, 68, 68, 0.4)' : 'rgba(16, 185, 129, 0.4)'}`, padding: '16px', borderRadius: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                          Reported by <strong style={{ color: '#fff' }}>{blocker.createdBy ? `${blocker.createdBy.firstName} ${blocker.createdBy.lastName}` : "Unknown"}</strong> on {new Date(blocker.createdAt).toLocaleDateString()}
                        </span>
                        <span style={{ fontSize: '12px', padding: '2px 8px', borderRadius: '10px', backgroundColor: blocker.status === 'unsolved' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)', color: blocker.status === 'unsolved' ? '#ef4444' : '#10b981' }}>
                          {blocker.status.toUpperCase()}
                        </span>
                      </div>
                      
                      <p style={{ color: '#fff', fontSize: '15px', margin: '0 0 12px 0' }}>{blocker.description}</p>
                      
                      {blocker.status === "unsolved" && (
                        <>
                          {solvingBlockerId === blocker._id ? (
                            <div style={{ marginTop: '16px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px' }}>
                              <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 8px 0' }}>Describe how this blocker was resolved:</p>
                              <div style={{ display: 'flex', gap: '8px' }}>
                                <input 
                                  type="text" 
                                  placeholder="Resolution details..."
                                  value={resolutionText}
                                  onChange={(e) => setResolutionText(e.target.value)}
                                  style={{ flex: 1, padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: '#fff' }}
                                />
                                <Button onClick={() => handleSolveBlocker(blocker._id)} disabled={!resolutionText.trim()}>Submit</Button>
                                <Button variant="ghost" type="button" onClick={() => { setSolvingBlockerId(null); setResolutionText(""); }}>Cancel</Button>
                              </div>
                            </div>
                          ) : (
                            <button onClick={() => setSolvingBlockerId(blocker._id)} style={{ background: 'transparent', border: '1px solid #10b981', color: '#10b981', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
                              ✓ Solve Blocker
                            </button>
                          )}
                        </>
                      )}

                      {blocker.status === "solved" && blocker.resolutionDescription && (
                        <div style={{ marginTop: '12px', padding: '12px', background: 'rgba(16, 185, 129, 0.05)', borderLeft: '3px solid #10b981', borderRadius: '4px' }}>
                          <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: 'var(--text-muted)' }}>
                            Solved by <strong style={{color: '#fff'}}>{blocker.solvedBy ? `${blocker.solvedBy.firstName} ${blocker.solvedBy.lastName}` : "Unknown"}</strong> on {new Date(blocker.solvedAt!).toLocaleDateString()}:
                          </p>
                          <p style={{ margin: 0, color: '#e2e8f0', fontSize: '14px' }}>{blocker.resolutionDescription}</p>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default StoryDetailsModal;
