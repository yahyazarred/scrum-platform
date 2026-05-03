import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  DndContext, // creates a zone where dragging can happen
  closestCenter, // This is a collision detection algorithm that figures out which card you are hovering above so when you drop it knows which card will be replaced
  PointerSensor, // This listens for mouse clicks and touch interactions
  useSensors, useSensor, // These hooks tell dnd-kit how the user is interacting with the screen.
  type DragEndEvent // new type that contains data like What was dropped and What did it land on
} from '@dnd-kit/core';
import {
  arrayMove, //a function: If you want to move an item from index 3 to index 1, this function safely returns a brand-new array with the items swapped, without mutating the original array.
  SortableContext, //a component that takes the list of IDs and tells dnd-kit "These items are allowed to be dragged"
  verticalListSortingStrategy, // algorithm that only calculates vertical shifting animations
} from '@dnd-kit/sortable';
import { 
  getEpics, createEpic, 
  getUserStories, createUserStory, updateUserStory, deleteUserStory, reorderStories,
  estimateStoryPoints
} from "../../services/backlog.api";
import type { EpicData, UserStoryData } from "../../services/backlog.api";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import EpicDrawer from "./EpicDrawer";
import CreateStoryForm from "./CreateStoryForm";
import StoryCard from "./StoryCard";
import { Button } from "../ui/Button/Button";
import "./Backlog.css";

interface ProductBacklogProps {
  role: string | null;
}

const ProductBacklog: React.FC<ProductBacklogProps> = ({ role }) => {
  const { projectId } = useParams<{ projectId: string }>();
  const { token } = useAuth();

  // State to hold the lists of Epics and Stories we get from the database
  const [epics, setEpics] = useState<EpicData[]>([]);
  const [stories, setStories] = useState<UserStoryData[]>([]);

  // State to toggle the sliding Epic menu open/closed
  const [isEpicDrawerOpen, setIsEpicDrawerOpen] = useState(false);

  useEffect(() => {
    // Only try to fetch if we have a valid token and a projectId in the URL
    if (!token || !projectId) return;
    
    const fetchBacklog = async () => {
      try {
        const fetchedEpics = await getEpics(token, projectId);
        const fetchedStories = await getUserStories(token, projectId);
        setEpics(fetchedEpics);
        setStories(fetchedStories);
      } catch (err) {
        console.error("Error fetching backlog:", err);
      }
    };

    fetchBacklog();
  }, [token, projectId]);

  // Triggered by the EpicDrawer when the user submits a new Epic
  const handleCreateEpic = async (title: string, color: string) => {
    if (!token || !projectId || !title.trim()) return;
    try {
      const savedEpic = await createEpic(token, projectId, { title, color });
      setEpics([savedEpic, ...epics]); // prepend to show immediately
      toast.success("Epic created successfully!");
    } catch (err: any) {
      console.error("Failed to create Epic:", err);
      toast.error(err.message || "Failed to create Epic");
    }
  };

  // Triggered by the CreateStoryForm when the user submits a new Story
  const handleCreateStory = async (title: string, description: string, epicId: string) => {
    if (!token || !projectId || !title.trim()) return;
    try {
      const savedStory = await createUserStory(token, projectId, {
        title,
        description,
        epicId: epicId || undefined
      });
      // Update our local state array so the new story instantly appears on the screen
      setStories([...stories, savedStory]); 
      toast.success("User Story created successfully!");
    } catch (err: any) {
      console.error("Failed to create Story:", err);
      toast.error(err.message || "Failed to create User Story");
    }
  };

  const handleUpdateStory = async (storyId: string, updatedData: Partial<UserStoryData>) => {
    if (!token || !projectId) return;
    try {
      await updateUserStory(token, projectId, storyId, updatedData);
      setStories(stories.map(s => s._id === storyId ? { ...s, ...updatedData } : s));
      toast.success(`Story updated successfully`);
    } catch (err: any) {
      console.error("Failed to update story:", err);
      toast.error(err.message || "Failed to update story");
    }
  };

  const handleDeleteStory = async (storyId: string) => {
    if (!token || !projectId) return;
    try {
      await deleteUserStory(token, projectId, storyId);
      setStories(stories.filter(s => s._id !== storyId));
      toast.success("Story deleted");
    } catch(err: any) {
      console.error("Failed to delete story", err);
      toast.error("Failed to delete story");
    }
  };

  const handleEstimateStory = async (storyId: string, points: number | null) => {
    if (!token || !projectId) return;
    try {
      const updatedStory = await estimateStoryPoints(token, projectId, storyId, points);
      setStories(prev => prev.map(s => s._id === storyId ? { ...s, storyPoints: updatedStory.storyPoints } : s));
      toast.success("Story estimated!");
    } catch (err: any) {
      console.error("Failed to estimate story:", err);
      toast.error(err.message || "Failed to estimate story");
    }
  };

// ==== sensors object ====
  const sensors = useSensors(  
    useSensor(PointerSensor, { // "PointerSensor" listens for mouse clicks and touch interactions
      activationConstraint: {
        distance: 5, // mouse needs to be moved at least 5 pixels for dragging to start (prevents accidental drags)
      },
    })
  );

  // This function is called instantly whenever you drop a dragged item in the list
  const onDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    // over is null if you dropped it outside the designated list area
    if (!over) return;
    // Do nothing if you dropped it in the exact same spot it started
    if (active.id === over.id) return;

    const oldIndex = stories.findIndex((s) => s._id === active.id); // find the old index of the item that was picked up
    const newIndex = stories.findIndex((s) => s._id === over.id); // find the index of the spot you dropped the item in

    const reorderedStories = arrayMove(stories, oldIndex, newIndex); // create a new array with the items in the new order

    // Update their local priority values immediately for UI
    const updatedWithPriority = reorderedStories.map((story, idx) => ({
      ...story,
      priority: idx + 1
    }));
    
    setStories(updatedWithPriority);

    if (!token || !projectId) return;
    try {
      const order = updatedWithPriority.map(s => s._id);
      await reorderStories(token, projectId, order);
    } catch (err: any) {
      console.error("Failed to reorder:", err);
      toast.error(err.message || "Failed to reorder stories");
    }
  };

  return (
    <div className="backlog-container">
      <div className="backlog-header">
        <h2>Product Backlog</h2>
        {role === "product_owner" && (
          <Button variant="secondary" onClick={() => setIsEpicDrawerOpen(true)}>
            Manage Epics
          </Button>
        )}
      </div>

      <EpicDrawer 
        epics={epics} 
        isOpen={isEpicDrawerOpen} 
        onClose={() => setIsEpicDrawerOpen(false)} 
        onCreateEpic={handleCreateEpic} 
      />

      {role === "product_owner" && (
        <CreateStoryForm 
          epics={epics} 
          onCreateStory={handleCreateStory} 
        />
      )}

      <div className="stories-list-container">
        <div className="stories-list-header">
          <span>user stories</span>
        </div>
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={onDragEnd}
        >
          <div className="story-list">
            <SortableContext 
              items={stories.map(s => s._id)}
              strategy={verticalListSortingStrategy}
            >
              {stories.map((story, index) => (
                <StoryCard 
                  key={story._id} 
                  story={story} 
                  index={index} 
                  epics={epics}
                  role={role}
                  onUpdateStory={handleUpdateStory}
                  onDeleteStory={handleDeleteStory}
                  onEstimateStory={handleEstimateStory}
                />
              ))}
            </SortableContext>
          </div>
        </DndContext>
      </div>
    </div>
  );
};

export default ProductBacklog;
