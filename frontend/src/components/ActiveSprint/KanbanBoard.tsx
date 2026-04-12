// ============================================================================
// KanbanBoard.tsx
// Component: The master controller for the Drag-and-Drop Kanban system.
// Purpose: It manages the state of all stories currently active in the Sprint.
// It uses `dnd-kit` to handle the complex physics and logic needed to drag 
// a story card from one column and drop it into another.
// ============================================================================
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { updateUserStory } from "../../services/backlog.api";
import type { UserStoryData } from "../../services/backlog.api";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  type DragEndEvent,
  type DragStartEvent,
  DragOverlay
} from "@dnd-kit/core";
import { toast } from "react-toastify";
import BoardColumn from "./BoardColumn";
import BoardCard from "./BoardCard";
import StoryDetailsModal from "./StoryDetailsModal";

interface KanbanBoardProps {
  stories: UserStoryData[];
  setStories: React.Dispatch<React.SetStateAction<UserStoryData[]>>;
  role: string | null;
}

const COLUMNS = ["To Do", "In Progress", "Done"] as const;
type Status = typeof COLUMNS[number];

const KanbanBoard: React.FC<KanbanBoardProps> = ({ stories, setStories, role }) => {
  const { projectId } = useParams<{ projectId: string }>(); // Extract the project ID from the browser URL (e.g. /project/123/sprint)
  const { token } = useAuth(); // Grab the user's secure JWT token from the global context to authorize API calls
  
  // ==========================================
  // COMPONENT STATE
  // ==========================================
  
  // State 2: `activeCard` tracks which card is currently being clicked-and-dragged by the user's mouse.
  // It is null when the mouse is released, and holds the actual card data while dragging.
  const [activeCard, setActiveCard] = useState<UserStoryData | null>(null);

  // State 3: Tracks which story card the user clicked to view full details
  const [selectedStory, setSelectedStory] = useState<UserStoryData | null>(null);

  // ==========================================
  // DRAG & DROP SENSORS
  // ==========================================
  // Sensors determine exactly *how* user input translates into dragging.
  const sensors = useSensors(
    useSensor(PointerSensor, { 
      activationConstraint: { 
        // Important: Require the mouse to move at least 5 pixels before we consider it a "drag".
        // This prevents accidental drags when the user just meant to normally click on the card.
        distance: 5 
      } 
    })
  );

  // ==========================================
  // handleDragStart: Fired the exact second the user picks up a card (after moving 5px)
  // ==========================================
  const handleDragStart = (event: DragStartEvent) => {
    // Extract the 'active' item (the card being picked up) from the event data
    const { active } = event;
    // Search our React state array to find the full data record for the card that matches the ID we just picked up
    const story = stories.find(s => s._id === active.id);
    // If we found it, save it into the `activeCard` state. This powers the visual "ghost" overlay that follows the mouse.
    if (story) setActiveCard(story);
  };

  // ==========================================
  // handleDragEnd: Fired the exact moment the user lets go of the mouse button
  // Purpose: Analyzes where the user dropped the card and updates its status.
  // ==========================================
  const handleDragEnd = async (event: DragEndEvent) => {
    // Extract 'active' (what we dragged) and 'over' (what we hovered directly over when we let go)
    const { active, over } = event;
    
    // Save a backup copy of the card data as it was before we let go (useful for rollbacks if the DB crashes)
    const originalCard = activeCard;
    
    // Immediately clear the active card state. This makes the visual "ghost" card following the mouse vanish.
    setActiveCard(null); 

    // Safety check: If we dropped the card outside the board entirely, or we somehow lost the original data, abort heavily.
    if (!over || !originalCard) return;

    // Extract the raw string IDs for comparing
    const activeId = active.id as string;
    const overId = over.id as string;

    // Variable to hold what the NEW status should be. We default to assuming it didn't change at all.
    let targetStatus: Status = originalCard.status;

    // Scenario A: Did we drop it directly over the big empty background of a column? (e.g., overId == "Done")
    if (COLUMNS.includes(overId as Status)) {
      targetStatus = overId as Status; // The target status is simply the name of the column
    } else {
      // Scenario B: We dropped it on top of *another card* inside a column. 
      // We need to look up that other card to figure out what status/column it belonged to!
      const overStory = stories.find(s => s._id === overId);
      // If we successfully found the card we dropped onto, steal its status for our dragged card.
      if (overStory) targetStatus = overStory.status;
    }

    // Optimization check: If the user dropped the card back into the exact same column it started in, do nothing!
    // (Since we are stripped out internal column sorting, moving it within the same column requires zero database updates)
    if (originalCard.status === targetStatus) return;

    // ==========================================
    // OPTIMISTIC UI UPDATE
    // ==========================================
    // 1. Instantly update the local UI to make it feel fast, before the server even responds.
    setStories(prev => prev.map(s => 
      // If this is the card we just dragged, spread its old data but overwrite the status. Otherwise, leave the card alone.
      s._id === activeId ? { ...s, status: targetStatus } : s
    ));

    // ==========================================
    // DATABASE SYNC
    // ==========================================
    // 2. Sync to the backend database
    // Safety check before firing off the network request
    if (!token || !projectId) return;

    try {
       // Fire a PUT request to the backend to permanently record this new status
       await updateUserStory(token, projectId, activeId, { status: targetStatus });
       
    } catch (err: any) {
       // the internet died or the server crashed!
       console.error("Failed to sync story status", err);
       toast.error("Failed to sync updated status to server");
       
       // Rollback local state: map through the stories and force the dragged card back to its original status
       setStories(prev => prev.map(s => 
         s._id === activeId ? { ...s, status: originalCard.status } : s
       ));
    }
  };

  return (
    <div className="kanban-board-container">
      {/* 
        DndContext forms the invisible bounds where dragging is allowed.
        It listens to our mouse movements (sensors) and fires functions 
        when we start dragging, drag over something, or drop it.
      */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {COLUMNS.map(columnId => (
          <BoardColumn
            key={columnId}
            id={columnId}
            title={columnId}
            // Filter the master list of stories so each column only gets its own respective stories
            stories={stories.filter(s => s.status === columnId)}
            onCardClick={setSelectedStory}
          />
        ))}
        
        {/* DragOverlay is the visual "ghost" of the card that follows your mouse pointer */}
        <DragOverlay>
          {activeCard ? <BoardCard story={activeCard} /> : null}
        </DragOverlay>
      </DndContext>

      {selectedStory && (
        <StoryDetailsModal 
          story={selectedStory} 
          onClose={() => setSelectedStory(null)} 
          role={role}
          onUpdateStory={(updatedStory) => {
            setSelectedStory(updatedStory);
            setStories(prev => prev.map(s => s._id === updatedStory._id ? updatedStory : s));
          }}
        />
      )}
    </div>
  );
};

export default KanbanBoard;
