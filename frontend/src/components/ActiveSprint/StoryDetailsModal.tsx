import React, { useState } from "react";
import type { UserStoryData } from "../../services/backlog.api";
import "./StoryDetailsModal.css";

interface StoryDetailsModalProps {
  story: UserStoryData;
  onClose: () => void;
}

const StoryDetailsModal: React.FC<StoryDetailsModalProps> = ({ story, onClose }) => {
  const [activeTab, setActiveTab] = useState<"details" | "subtasks" | "blockers">("details");

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
            <div className="sd-placeholder">
              <p>No active blockers reported.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default StoryDetailsModal;
