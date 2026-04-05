const Epic = require("../models/Epic");
const UserStory = require("../models/UserStory");

// ================= EPICS =================
// ===== create epic =====
exports.createEpic = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, color } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Epic title is required." });
    }

    const newEpic = new Epic({
      title,
      color: color || "#3b82f6",
      project: projectId,
    });
    const savedEpic = await newEpic.save();

    res.status(201).json(savedEpic);
  } catch (error) {
    console.error("Error creating Epic:", error);
    res.status(500).json({ message: "Server error creating Epic" });
  }
};

// ===== fetch epics tied to this project =====
exports.getEpics = async (req, res) => {
  try {
    const { projectId } = req.params;

    const epics = await Epic.find({ project: projectId }).sort({ createdAt: -1 });// newest first
    res.status(200).json(epics);
  } catch (error) {
    console.error("Error fetching Epics:", error);
    res.status(500).json({ message: "Server error fetching Epics" });
  }
};

// ================= USER STORIES =================
// ===== create user story =====
exports.createUserStory = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, description, epicId } = req.body;

    if (!title) {
      return res.status(400).json({ message: "User Story title is required." });
    }

    // how many user stories are there in this project
    const count = await UserStory.countDocuments({ project: projectId });
    
    const newStory = new UserStory({
      title,
      description,
      epic: epicId || null,
      priority: count + 1, // so that it gets placed last
      project: projectId,
    });

    const savedStory = await newStory.save();
    
    // fetch the information of the selected epic to display it in the frontend
    if (savedStory.epic) {
      await savedStory.populate("epic");
    }

    res.status(201).json(savedStory);
  } catch (error) {
    console.error("Error creating User Story:", error);
    res.status(500).json({ message: "Server error creating User Story" });
  }
};
// ===== fetch user stories tied to this project =====
exports.getUserStories = async (req, res) => {
  try {
    const { projectId } = req.params;

    // fetch all user stories related to this project and order them by priority (1, 2, 3, ...)
    const stories = await UserStory.find({ project: projectId }).populate("epic").sort({ priority: 1 });
    res.status(200).json(stories);
  } catch (error) {
    console.error("Error fetching User Stories:", error);
    res.status(500).json({ message: "Server error fetching User Stories" });
  }
};

// ===== update user story (for editing or changing status) =====
exports.updateUserStory = async (req, res) => {
  try {
    const { projectId, storyId } = req.params;
    const { title, description, epicId, status } = req.body;

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (epicId !== undefined) updateData.epic = epicId || null; // allow nulling out epic
    if (status !== undefined) updateData.status = status;

    const story = await UserStory.findOneAndUpdate(
      { _id: storyId, project: projectId },// get the story by its id and the project id
      { $set: updateData },// update provided fields
      { new: true } // return the updated story
    ).populate("epic");

    if (!story) return res.status(404).json({ message: "Story not found." });

    res.status(200).json(story);
  } catch (error) {
    console.error("Error updating story:", error);
    res.status(500).json({ message: "Server error updating story." });
  }
};

// ===== delete user story =====
exports.deleteUserStory = async (req, res) => {
  try {
    const { projectId, storyId } = req.params;

    const deletedStory = await UserStory.findOneAndDelete({ _id: storyId, project: projectId });
    
    if (!deletedStory) {
      return res.status(404).json({ message: "Story not found." });
    }

    res.status(200).json({ message: "Story deleted successfully", id: storyId });
  } catch (error) {
    console.error("Error deleting story:", error);
    res.status(500).json({ message: "Server error deleting story." });
  }
};
//==== update priorities when changing the user storie order ====
exports.reorderStories = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { order } = req.body; // Array of story IDs in new order

    if (!Array.isArray(order)) {
      return res.status(400).json({ message: "Order must be an array of IDs." });
    }

    // loop through the order array and update the priority of each story
    const bulkOps = order.map((id, index) => ({
      updateOne: {
        filter: { _id: id, project: projectId },
        update: { $set: { priority: index + 1 } },
      },
    }));

    // send all requests all at once
    if (bulkOps.length > 0) {
      await UserStory.bulkWrite(bulkOps);
    }

    res.status(200).json({ message: "Reordered successfully." });
  } catch (error) {
    console.error("Error reordering stories:", error);
    res.status(500).json({ message: "Server error reordering stories." });
  }
};
