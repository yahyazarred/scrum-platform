import React, { useState } from "react";
import type { EpicData } from "../../services/backlog.api";
import "./Backlog.css";
import { Button } from "../ui/Button/Button";

// We define what props (data parameters) this component expects to receive from its parent
interface EpicDrawerProps {
  epics: EpicData[]; // The list of existing epics to display
  isOpen: boolean;   // Whether the drawer should be visible right now
  onClose: () => void; // A function to call when you clicks the close 'x' or the background
  onCreateEpic: (title: string, color: string) => Promise<void>; // Function to call when "Add Epic" is clicked
}

const PRESET_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#4f46e5', '#0d9488'];

const EpicDrawer: React.FC<EpicDrawerProps> = ({ epics, isOpen, onClose, onCreateEpic }) => {
  // Temporary state variables to hold what the user types before clicking "Add Epic"
  const [newEpicTitle, setNewEpicTitle] = useState("");
  const [newEpicColor, setNewEpicColor] = useState("#3b82f6");

  // If the parent says this drawer is closed, don't render anything!
  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Stop the page from reloading
    await onCreateEpic(newEpicTitle, newEpicColor); // Tell the parent component to save the epic
    // Reset our text box after creation
    setNewEpicTitle("");
  };

  return (
    <div className="epic-drawer-overlay" onClick={onClose}>
      {/* e.stopPropagation() prevents clicking inside the drawer from triggering the overlay's onClose */}
      <div className="epic-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="epic-drawer-header">
          <h3>Manage Epics</h3>
          <Button variant="ghost" onClick={onClose} style={{ padding: '4px 8px', fontSize: '1.5rem' }}>&times;</Button>
        </div>
        
        {/* Section 1: Displaying current Epics */}
        <div className="epic-list">
          {epics.length === 0 ? (
            <p className="no-epics-msg">No Epics created yet.</p>
          ) : (
            epics.map(epic => (
              <div key={epic._id} className="epic-list-item">
                <span className="epic-color-dot" style={{ backgroundColor: epic.color }}></span>
                <span className="epic-title-text">{epic.title}</span>
              </div>
            ))
          )}
        </div>

        {/* Section 2: Creating a new Epic */}
        <div className="drawer-create-section">
          <h4>Create New Epic</h4>
          <form className="form-group-col" onSubmit={handleSubmit}>
            <input 
              type="text" 
              placeholder="Epic Title..." 
              value={newEpicTitle}
              onChange={(e) => setNewEpicTitle(e.target.value)}
              required
            />
            
            <div className="color-palette">
              {PRESET_COLORS.map(color => (
                <button
                  key={color}
                  type="button"
                  className={`color-circle ${newEpicColor === color ? 'selected' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setNewEpicColor(color)}
                  aria-label={`Select color ${color}`}
                />
              ))}
            </div>
            <Button variant="primary" type="submit">Add Epic</Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EpicDrawer;
