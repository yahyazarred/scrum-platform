const Sprint = require("../models/Sprint");
const UserStory = require("../models/UserStory");
const Project = require("../models/Project");

// function to complete a sprint and move unfinished stories to backlog
const completeSprint = async (sprint) => {
  sprint.status = "Completed";
  await sprint.save();

  await UserStory.updateMany(
    { sprint: sprint._id, status: { $in: ["To Do", "In Progress"] } },
    { $set: { sprint: null, status: "To Do" } }
  );
};

//======= get the active sprint =======
exports.getActiveSprint = async (req, res) => {
  try {
    const projectId = req.params.projectId;

    const sprint = await Sprint.findOne({ project: projectId, status: "Active" });

    if (sprint) {
      if (new Date() > sprint.endDate) {
        await completeSprint(sprint);
        return res.json(null);
      }
      return res.json(sprint);
    }

    res.json(null);
  } catch (error) {
    console.error("Error getting active sprint:", error);
    res.status(500).json({ message: "Server error getting active sprint" });
  }
};

//======= start a sprint =======
exports.startSprint = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const { goal, storyIds } = req.body;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const existingActive = await Sprint.findOne({ project: projectId, status: "Active" });
    if (existingActive) {
      if (new Date() > existingActive.endDate) {
         await completeSprint(existingActive);
      } else {
        return res.status(400).json({ message: "An active sprint already exists for this project." });
      }
    }

    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + project.sprintDuration * 7 * 24 * 60 * 60 * 1000);

    const sprintCount = await Sprint.countDocuments({ project: projectId });
    const sprintNumber = sprintCount + 1;

    const sprint = await Sprint.create({
      project: projectId,
      goal,
      sprintNumber,
      startDate,
      endDate,
      status: "Active"
    });

    if (storyIds && storyIds.length > 0) {
      await UserStory.updateMany(
        { _id: { $in: storyIds }, project: projectId },
        { $set: { sprint: sprint._id } }
      );
    }

    res.status(201).json(sprint);
  } catch (error) {
    console.error("Error starting sprint:", error);
    res.status(500).json({ message: "Server error starting sprint" });
  }
};

//======= end the active sprint =======
exports.endActiveSprint = async (req, res) => {
  try {
    const projectId = req.params.projectId;

    const sprint = await Sprint.findOne({ project: projectId, status: "Active" });

    if (!sprint) {
      return res.status(404).json({ message: "No active sprint found" });
    }

    await completeSprint(sprint);

    res.json({ message: "Sprint ended successfully and unresolved stories have been moved to the backlog." });
  } catch (error) {
    console.error("Error ending sprint prematurely:", error);
    res.status(500).json({ message: "Server error ending sprint" });
  }
};
