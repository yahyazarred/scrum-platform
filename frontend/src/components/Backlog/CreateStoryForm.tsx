import React, { useState } from "react";
import type { EpicData } from "../../services/backlog.api";
import "./Backlog.css";
import { Button } from "../ui/Button/Button";

interface CreateStoryFormProps {
  epics: EpicData[]; // We need the epics to render the selection pills
  onCreateStory: (title: string, description: string, epicId: string) => Promise<void>;
}

const CreateStoryForm: React.FC<CreateStoryFormProps> = ({ epics, onCreateStory }) => {
  // Temporary state to hold form input before they hit "Submit"
  const [newStoryTitle, setNewStoryTitle] = useState("");
  const [newStoryDesc, setNewStoryDesc] = useState("");
  const [newStoryEpicId, setNewStoryEpicId] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page reload
    await onCreateStory(newStoryTitle, newStoryDesc, newStoryEpicId);
    
    // Clear inputs after triggering creation
    setNewStoryTitle("");
    setNewStoryDesc("");
    setNewStoryEpicId("");
  };

  return (
    <div className="create-section">
      <h3>Create User Story</h3>
      <form className="form-group-col" onSubmit={handleSubmit}>
        
        {/* Title Input */}
        <div className="form-group-row">
          <input 
            type="text" 
            placeholder="Story Title..." 
            value={newStoryTitle}
            onChange={(e) => setNewStoryTitle(e.target.value)}
            required
          />
        </div>

        

        {/* Description Textarea */}
        <textarea 
          placeholder="As a [role], I want to [action], so that [value]" 
          value={newStoryDesc}
          onChange={(e) => setNewStoryDesc(e.target.value)}
          required
        />

        {/* Epic Selection */}
        <div className="form-group-row">
          <select
            value={newStoryEpicId}
            onChange={(e) => setNewStoryEpicId(e.target.value)}
            className="create-story-select"
            style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc', outline: 'none' }}
          >
            <option value="">No Epic</option>
            {epics.map(epic => (
              <option key={epic._id} value={epic._id}>{epic.title}</option>
            ))}
          </select>
        </div>
        
        <Button variant="primary" type="submit">Add Story</Button>
      </form>
    </div>
  );
};

export default CreateStoryForm;
