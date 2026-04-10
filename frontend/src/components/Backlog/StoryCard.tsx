import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities"; // CSS utility helps convert math coordinates (x: 10, y: 20) into browser CSS styles
import { GripVertical, Pencil, Trash2 } from "lucide-react";
import type { UserStoryData, EpicData } from "../../services/backlog.api";
import "./Backlog.css";

// Defines exactly what data must be passed into this component from the parent (ProductBacklog)
interface StoryCardProps {
  story: UserStoryData; // The actual data for this specific story (title, desc,)
  index: number;        // The physical row number of this card in the list
  epics: EpicData[];    // The list of all possible epics (used for the dropdown when editing)
  role: string | null;  // User role for access control
   
  // We call these when we want to tell the parent "Hey, I changed my data!"
  onUpdateStory: (storyId: string, updatedData: Partial<UserStoryData> & { epicId?: string }) => void;
  onDeleteStory: (storyId: string) => void;
}

const StoryCard: React.FC<StoryCardProps> = ({ story, epics, role, onUpdateStory, onDeleteStory }) => {
  // These variables only exist inside this specific card to track if its modals are open
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Temporary state to hold the user's typed changes BEFORE they hit "Save"
  const [editTitle, setEditTitle] = useState(story.title);
  const [editDesc, setEditDesc] = useState(story.description);
  const [editEpicId, setEditEpicId] = useState(story.epic?._id || "");

  // Determine which colored CSS class to apply based on the story's current progress
  const statusClass = 
    story.status === "Done" ? "status-done" :
    story.status === "In Progress" ? "status-inprogress" : "status-todo";
  
  // Called when the user clicks "Save Changes" in the edit modal
  const handleSave = () => {
    // Fire the parent's function to permanently save the new data
    onUpdateStory(story._id, {
      title: editTitle,
      description: editDesc,
      epicId: editEpicId === "" ? undefined : editEpicId // If they selected "No Epic", send undefined
    });
    setIsEditing(false); // Close the modal
  };

  // Called when the user clicks "Cancel" or clicks outside the edit modal
  const handleCancel = () => {
    // Revert the temporary text back to what the database originally said safely
    setEditTitle(story.title);
    setEditDesc(story.description);
    setEditEpicId(story.epic?._id || "");
    setIsEditing(false); // Close the modal
  };

  // Called when user confirms deletion in the red warning modal
  const handleConfirmDelete = () => {
    onDeleteStory(story._id); // Tell parent to delete this story
    setShowDeleteModal(false);
  };

  // ----- DRAG AND DROP PHYSICS (DND-KIT) -----
  // This hook connects this specific card to SortableContext
  const {
    listeners,    // mouse/touch event listeners (onMouseDown, ...)
    setNodeRef,   // A reference function attached to the outermost <div> so dnd-kit can measure the size of the card
    transform,    // The temporary X/Y math tracking how far the user has dragged this element
    transition,   // The CSS animation timer that makes it snap smoothly back into place when dropped
    isDragging,   // A boolean that becomes true when you pick this card up
  } = useSortable({ id: story._id }); // VERY IMPORTANT: The ID must match the ID in the parent's SortableContext array

  // convert the math coordinates from `transform` into a browser-readable CSS string
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
        <>
          <div
            className={`story-card-wrapper ${statusClass} ${isDragging ? "is-dragging" : ""}`}
            ref={setNodeRef}
            style={style}
          >
            {role === "product_owner" && (
              <div className="drag-handle" {...listeners}> {/* listeners here so that you can only grab the card from this icon */}
                <GripVertical size={20} />
              </div>
            )}

            <div className="story-details">
              <span className="story-title">{story.title}</span>
              <span className="story-desc">{story.description}</span>
            </div>

            <div className="story-meta">
              {story.epic && (
                <span
                  className="epic-badge"
                  style={{ backgroundColor: story.epic.color, color: "#fff" }}
                >
                  {story.epic.title}
                </span>
              )}
              <span className="priority-badge">#{story.priority}</span>

              <div className="story-status-display">
                <span className={`status-readonly-badge status-readonly-${story.status.replace(" ", "").toLowerCase()}`}>
                  {story.status}
                </span>
              </div>

              {role === "product_owner" && (
                <div className="story-actions-wrapper">
                  <button className="icon-action-btn" onClick={() => setIsEditing(true)} title="Edit Story">
                    <Pencil size={15} />
                  </button>
                  <button
                    className="icon-action-btn delete-btn"
                    onClick={() => setShowDeleteModal(true)}
                    title="Delete Story"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Edit Story Modal */}
          {isEditing && (
            <div className="edit-modal-overlay" onClick={handleCancel}>
              <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
                <div className="edit-modal-header">
                  <h3 className="edit-modal-title">Edit Story</h3>
                </div>

                <div className="edit-modal-body">
                  <label className="edit-modal-label">Title</label>
                  <input
                    type="text"
                    className="edit-modal-input"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="Story title"
                    autoFocus
                  />

                  <label className="edit-modal-label">Description</label>
                  <textarea
                    className="edit-modal-textarea"
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                    placeholder="As a user, I want to..."
                  />

                  <label className="edit-modal-label">Epic</label>
                  <select
                    className="edit-modal-select"
                    value={editEpicId}
                    onChange={(e) => setEditEpicId(e.target.value)}
                  >
                    <option value="">No Epic</option>
                    {epics.map(epic => (
                      <option key={epic._id} value={epic._id}>{epic.title}</option>
                    ))}
                  </select>
                </div>

                <div className="edit-modal-actions">
                  <button className="edit-modal-cancel" onClick={handleCancel}>Cancel</button>
                  <button className="edit-modal-save" onClick={handleSave}>Save Changes</button>
                </div>
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {showDeleteModal && (
            <div className="delete-modal-overlay" onClick={() => setShowDeleteModal(false)}>
              <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
                <h3 className="delete-modal-title">Delete Story</h3>
                <p className="delete-modal-body">
                  Are you sure you want to delete <strong>"{story.title}"</strong>? This action cannot be undone.
                </p>
                <div className="delete-modal-actions">
                  <button className="delete-modal-cancel" onClick={() => setShowDeleteModal(false)}>
                    Cancel
                  </button>
                  <button className="delete-modal-confirm" onClick={handleConfirmDelete}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
  );
};

export default StoryCard;
