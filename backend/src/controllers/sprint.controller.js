const Sprint = require("../models/Sprint");
const UserStory = require("../models/UserStory");
const Project = require("../models/Project");

const calculateEndDate = (startDate, durationString) => {
  const weeksMatch = durationString.match(/(\d+)\s+Week/i);
  let weeks = 2; // default
  if (weeksMatch && weeksMatch[1]) {
    weeks = parseInt(weeksMatch[1]);
  }
  return new Date(startDate.getTime() + weeks * 7 * 24 * 60 * 60 * 1000);
};

exports.getActiveSprint = async (req, res) => {
  try {
    const projectId = req.params.projectId;

    const sprint = await Sprint.findOne({ project: projectId, status: "Active" });

    if (sprint) {
      if (new Date() > sprint.endDate) {
        sprint.status = "Completed";
        await sprint.save();

        await UserStory.updateMany(
          { sprint: sprint._id, status: { $in: ["To Do", "In Progress"] } },
          { $set: { sprint: null, status: "To Do" } }
        );

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

exports.startSprint = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const { goal, storyIds } = req.body;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const existingActive = await Sprint.findOne({ project: projectId, status: "Active" });
    if (existingActive) {
      if (new Date() > existingActive.endDate) {
         existingActive.status = "Completed";
         await existingActive.save();
         await UserStory.updateMany(
          { sprint: existingActive._id, status: { $in: ["To Do", "In Progress"] } },
          { $set: { sprint: null, status: "To Do" } }
         );
      } else {
        return res.status(400).json({ message: "An active sprint already exists for this project." });
      }
    }

    const startDate = new Date();
    const endDate = calculateEndDate(startDate, project.sprintDuration);

    const sprint = new Sprint({
      project: projectId,
      goal,
      startDate,
      endDate,
      status: "Active"
    });

    await sprint.save();

    if (storyIds && storyIds.length > 0) {
      await UserStory.updateMany(
        { _id: { $in: storyIds }, project: projectId },
        { $set: { sprint: sprint._id, status: "To Do" } }
      );
    }

    res.status(201).json(sprint);
  } catch (error) {
    console.error("Error starting sprint:", error);
    res.status(500).json({ message: "Server error starting sprint" });
  }
};
