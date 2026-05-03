const Sprint = require("../models/Sprint");
const UserStory = require("../models/UserStory");
const Project = require("../models/Project");

// Helper to generate analytical array
const generateBurndownData = (sprint, stories) => {
  // sum all the story points of the stories in the sprint
  const sprintPoints = stories.reduce((sum, s) => sum + (s.storyPoints || 0), 0);
  // get the start date of the sprint
  const startDate = new Date(sprint.startDate);
  // get the end date of the sprint
  const endDateRaw = new Date(sprint.endDate);
  // get
  const endDate = new Date(endDateRaw.setHours(23, 59, 59, 999));
  
  const diffTime = endDate.getTime() - startDate.getTime();
  const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  const idealBurnRate = sprintPoints / (totalDays > 0 ? totalDays : 1);
  const burndown = [];
  
  const todayMidnight = new Date().setHours(0, 0, 0, 0);

  for (let i = 0; i <= totalDays; i++) {
    // Current day goes to 23:59:59 so checking <= captures all completions that day
    const rawDate = new Date(startDate.getTime() + (i * 24 * 60 * 60 * 1000));
    const currentDate = new Date(new Date(rawDate).setHours(23, 59, 59, 999));
    const currentDayMidnight = new Date(rawDate).setHours(0, 0, 0, 0);
    
    const dateStr = `${currentDate.getMonth() + 1}/${currentDate.getDate()}`;
    const expectedRemaining = Math.max(0, sprintPoints - (idealBurnRate * i));
    
    let completedPointsAtThisDate = 0;
    stories.forEach(story => {
      if (story.status === "Done" && story.completedAt && story.completedAt <= currentDate) {
        completedPointsAtThisDate += (story.storyPoints || 0);
      }
    });

    const isFuture = currentDayMidnight > todayMidnight;
    burndown.push({
      date: dateStr,
      expectedRemaining: Number(expectedRemaining.toFixed(1)),
      actualRemaining: isFuture ? null : sprintPoints - completedPointsAtThisDate
    });
  }
  return burndown;
};

// function to complete a sprint and move unfinished stories to backlog
const completeSprint = async (sprint) => {
  // Snapshot Analytics tightly before unlinking
  const stories = await UserStory.find({ sprint: sprint._id });
  const totalPoints = stories.reduce((sum, s) => sum + (s.storyPoints || 0), 0);
  const completedPoints = stories
    .filter(s => s.status === "Done")
    .reduce((sum, s) => sum + (s.storyPoints || 0), 0);

  sprint.metrics = { totalPoints, completedPoints };
  sprint.burndownData = generateBurndownData(sprint, stories);
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

//======= Get Sprint History =======
exports.getSprintHistory = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    // Ascending order naturally sequences earlier sprints left to right for Velocity Charts
    const sprints = await Sprint.find({ project: projectId, status: "Completed" }).sort({ endDate: 1 });
    res.json(sprints);
  } catch (error) {
    console.error("Error getting sprint history:", error);
    res.status(500).json({ message: "Server error fetching sprint history" });
  }
};

//======= Get Live Active Burndown =======
exports.getActiveSprintBurndown = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const sprint = await Sprint.findOne({ project: projectId, status: "Active" });
    if (!sprint) return res.json([]);
    
    const stories = await UserStory.find({ sprint: sprint._id });
    const burndownData = generateBurndownData(sprint, stories);
    
    res.json(burndownData);
  } catch (error) {
    console.error("Error generating active burndown:", error);
    res.status(500).json({ message: "Server error generating burndown" });
  }
};
