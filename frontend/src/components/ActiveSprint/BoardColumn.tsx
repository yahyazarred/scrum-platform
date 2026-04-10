// ============================================================================
// BoardColumn.tsx
// Component: Represents a vertical swimlane (e.g., "To Do", "In Progress") on the board.
// Purpose: It acts as a "Droppable" zone where `BoardCard` items can be placed.
// 
// CSS Mappings to ActiveSprint.css:
// - .kanban-column: The tall, gray container defining the physical swimlane bounds.
// - .is-over: Applied dynamically when a user drags a card directly over this column. 
// - .kanban-column-header: The title block at the top ("To Do") with the item count.
// - .kanban-item-count: The small grey pill showing the number of stories inside.
// - .kanban-column-body: The scrollable inner container where the actual cards stack.
// ============================================================================
import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import type { UserStoryData } from "../../services/backlog.api";
import BoardCard from "./BoardCard";

interface BoardColumnProps {
  id: string; // The exact string matching the status name (e.g., "To Do", "In Progress")
  title: string; // The text displayed at the top of the column for the user
  stories: UserStoryData[]; // The specific array of user stories belonging ONLY to this column
}

const BoardColumn: React.FC<BoardColumnProps> = ({ id, title, stories }) => {
  // ==========================================
  // DND-KIT DROPPABLE HOOK
  // ==========================================
  // useDroppable turns this React component into a "Drop Zone" that accepts dragged items.
  const { 
    setNodeRef, // A special React 'ref' we must attach to a div so the library knows its physical screen dimensions
    isOver // A boolean variable that automatically turns 'true' the exact millisecond the user drags a card directly over this column's physical space on the screen!
  } = useDroppable({
    id, // We must give this drop zone a unique ID (in our case, the status name: "To Do", "Done", etc.)
  });

  return (
    // The outermost wrapper for the entire column. 
    // We dynamically attach the "is-over" CSS class if the user is currently hovering a card above this column.
    // CSS: .kanban-column gives it the dark gray background and tall minimum height.
    <div className={`kanban-column ${isOver ? "is-over" : ""}`}>
      
      {/* The top title section of the column */}
      {/* CSS: .kanban-column-header makes the text bold and flex-aligns the count badge to the right */}
      <div className="kanban-column-header">
        {title} {/* e.g. "To Do" */}
        
        {/* The small grey pill showing exactly how many stories are currently arrayed in this column */}
        {/* CSS: .kanban-item-count makes it a rounded gray pill with tiny text */}
        <span className="kanban-item-count">{stories.length}</span>
      </div>
      
      {/* 
        ========================================================
        THE DROP ZONE & SORTABLE REGION
        ========================================================
        This inner div is the actual scrolling box where cards live.
        We attach `ref={setNodeRef}` to this specific box, meaning cards can only be dropped *inside* the body, not on the header!
        CSS: .kanban-column-body handles vertical scrolling if there are 20+ cards in the column.
      */}
      <div className="kanban-column-body" ref={setNodeRef}>
        
        {/* 
          SortableContext is a required wrapper from dnd-kit.
          Even though we deleted complex sorting from KanbanBoard, we still need this Context wrapper
          so the inner BoardCards know they belong to a compatible Drag-and-Drop system natively.
        */}
        <SortableContext
          id={id} // Links this context to the specific column
          items={stories.map((s) => s._id)} // Feeds the library an exact array of purely the string _ids of the cards inside this column
          strategy={verticalListSortingStrategy} // Tells the system we expect these cards to stack vertically (up and down)
        >
          {/* Loop over every story injected into this column and render a physical draggable Card component for it */}
          {stories.map((story) => (
            <BoardCard key={story._id} story={story} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
};

export default BoardColumn;
