// ============================================================================
// BoardCard.tsx
// Component: Represents a single draggable User Story card on the Kanban Board.
// Purpose: Forms the visual unit of work that developers drag across columns.
// 
// CSS Mappings to ActiveSprint.css:
// - .sprint-story-card: The main container styling (background, border, padding).
// - .is-dragging: Adds visual opacity/border when a user is actively holding this card.
// - .status-indicator-X: The thin vertical color bar on the left indicating status.
// - .sprint-story-title: The main bold white text defining the story.
// - .kanban-epic-badge: The small colored tag showing which Epic this story belongs to.
// - .priority-badge: The tag indicating priority level.
// ============================================================================
import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { UserStoryData } from "../../services/backlog.api";

// Interface defining the exact data this tiny component needs to render itself
interface BoardCardProps {
  story: UserStoryData; // Passing the entire story object so we can access title, ID, epic color, etc.
  onClick?: () => void; // Optional click handler for opening the details modal
}

const BoardCard: React.FC<BoardCardProps> = ({ story, onClick }) => {
  // ==========================================
  // DND-KIT PHYSICS HOOK
  // useSortable binds this React component to the drag-and-drop system.
  // ==========================================
  const {
    attributes, // Accessibility attributes for the handle
    listeners,  // Mouse & Touch event listeners so we can actually pick it up
    setNodeRef, // Gives dnd-kit the physical dimensions of the element so it can calculate collisions
    transform,  // The mathematical X, Y distance the user has dragged the card from its origin
    transition, // The CSS transition speed used to snap the card back into place when dropped
    isDragging, // A boolean that turns true the moment the user clicks and holds the card
  } = useSortable({ id: story._id, data: { ...story } });

  // We convert the dnd-kit transform math into a browser-readable CSS string
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // ==========================================
  // DYNAMIC STYLING
  // ==========================================
  // Determine which visual status-indicator vertical line to draw on the far left side of the card.
  // We use ternary operators to check the raw string status and map it to a specific ActiveSprint.css class.
  const statusClass = 
    story.status === "Done" ? "status-indicator-done" : // Adds a green left border
    story.status === "In Progress" ? "status-indicator-inprogress" : // Adds a yellow/blue left border
    "status-indicator-todo"; // Defaults to a neutral gray left border if it's just To Do

  return (
    <div
      ref={setNodeRef}
      style={{ ...style, cursor: 'pointer' }}
      onClick={onClick}
      // CSS: .sprint-story-card is the main dark box with padding.
      // CSS: .is-dragging applies opacity and a blue border when actively held.
      className={`sprint-story-card ${statusClass} ${isDragging ? "is-dragging" : ""}`}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
        {/* CSS: .sprint-story-title makes the user story text bold and white */}
        <div className="sprint-story-title" style={{ flex: 1 }}>{story.title}</div>
        
        {/* Drag Handle: Isolated grab target to prevent conflicts with card clicking */}
        <div 
          {...attributes} 
          {...listeners} 
          className="sprint-drag-handle"
          style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2px' }}
        >
          <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor">
            <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z"></path>
          </svg>
        </div>
      </div>
      
      {/* CSS: .sprint-story-meta aligns the bottom badges horizontally using flexbox */}
      <div className="sprint-story-meta">
        {story.epic && (
          <span 
            // CSS: .kanban-epic-badge creates the tiny rounded pill shape
            className="kanban-epic-badge" 
            // We inject the epic matching color inline directly from the database record
            style={{ backgroundColor: story.epic.color, color: "#fff" }}
          >
            {story.epic.title}
          </span>
        )}
        {/* CSS: .priority-badge gives the #1 / #2 text a muted blue styling */}
        <span className="priority-badge">#{story.priority}</span>
      </div>
    </div>
  );
};

export default BoardCard;
