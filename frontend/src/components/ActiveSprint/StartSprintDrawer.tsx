import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getUserStories } from "../../services/backlog.api";
import type { UserStoryData } from "../../services/backlog.api";
import { startSprint } from "../../services/sprint.api";
import type { SprintData } from "../../services/sprint.api";
import { Button } from "../ui/Button/Button";
import { toast } from "react-toastify";
import { getStoryPointClass } from "../Backlog/StoryCard";
import "../Backlog/Backlog.css";

interface StartSprintDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSprintStarted: (sprint: SprintData) => void;
}

const StartSprintDrawer: React.FC<StartSprintDrawerProps> = ({ isOpen, onClose, onSprintStarted }) => {
  const { projectId } = useParams<{ projectId: string }>();
  const { token } = useAuth();
  
  const [goal, setGoal] = useState("");
  const [availableStories, setAvailableStories] = useState<UserStoryData[]>([]);
  const [selectedStoryIds, setSelectedStoryIds] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && token && projectId) {
      getUserStories(token, projectId)
        .then(stories => {
          const available = stories.filter(s => !s.sprint && s.status !== "Done");
          setAvailableStories(available);
          setSelectedStoryIds(new Set());
          setGoal("");
        })
        .catch(err => {
          console.error("Failed to fetch stories for sprint", err);
          toast.error("Failed to load user stories");
        });
    }
  }, [isOpen, token, projectId]);

  if (!isOpen) return null;

  const toggleStorySelection = (id: string) => {
    const newSet = new Set(selectedStoryIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedStoryIds(newSet);
  };

  const handleConfirm = async () => {
    if (!goal.trim()) {
      toast.error("Please enter a sprint goal");
      return;
    }
    if (!token || !projectId) return;

    setIsSubmitting(true);
    try {
      const data = await startSprint(token, projectId, {
        goal,
        storyIds: Array.from(selectedStoryIds)
      });
      toast.success("Sprint started successfully!");
      onSprintStarted(data);
    } catch (err: any) {
      toast.error(err.message || "Failed to start sprint");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="epic-drawer-overlay" onClick={onClose} />
      <div className="epic-drawer sprint-drawer-wide" onClick={(e) => e.stopPropagation()}>
        <div className="epic-drawer-header">
          <h3>Start Sprint</h3>
          <button className="edit-modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="drawer-create-section">
          <h4>Set Sprint Goal</h4>
          <div className="form-group-col">
            <input
              type="text"
              placeholder="e.g. Implement authentication"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
            />
          </div>
        </div>

        <div className="drawer-story-list">
          {availableStories.length > 0 && (
            <h4 className="drawer-story-list-header">
              Select User Stories ({selectedStoryIds.size} / {availableStories.length})
            </h4>
          )}
          
          {availableStories.map(story => (
              <div 
              key={story._id} 
              className={`drawer-story-item ${selectedStoryIds.has(story._id) ? 'selected' : ''}`}
              onClick={() => toggleStorySelection(story._id)}
            >
              <div className="drawer-story-checkbox"></div>
              
              <div className="drawer-story-info">
                <div className="drawer-story-header">
                  <h4 className="drawer-story-title">{story.title}</h4>
                  {story.epic && (
                    <span 
                      className="drawer-story-epic-badge" 
                      style={{ backgroundColor: story.epic.color }}
                    >
                      {story.epic.title}
                    </span>
                  )}
                </div>
                {story.description && (
                  <p className="drawer-story-desc">
                    {story.description}
                  </p>
                )}
                <div className="drawer-story-meta">
                  <span className="drawer-story-priority">
                    Priority: #{story.priority}
                  </span>
                  <span className={`drawer-story-points ${getStoryPointClass(story.storyPoints)}`}>
                    {story.storyPoints ? `${story.storyPoints} pts` : "Unestimated"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="drawer-confirm-section">
          <Button variant="secondary" onClick={onClose} className="drawer-cancel-btn">Cancel</Button>
          <Button variant="primary" onClick={handleConfirm} disabled={isSubmitting || selectedStoryIds.size === 0}>
            {isSubmitting ? "Starting..." : `Start Sprint (${selectedStoryIds.size} stories)`}
          </Button>
        </div>
      </div>
    </>
  );
};

export default StartSprintDrawer;
