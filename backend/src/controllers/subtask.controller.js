const SubTask = require("../models/SubTask");

exports.getSubTasks = async (req, res) => {
  try {
    const { projectId, storyId } = req.params;
    const tasks = await SubTask.find({ project: projectId, userStory: storyId })
      .populate({ path: "assignedTo", select: "firstName lastName" })
      .sort({ createdAt: -1 });
    
    res.json(tasks);
  } catch (error) {
    console.error("Failed to get sub-tasks:", error);
    res.status(500).json({ message: "Server error getting sub-tasks" });
  }
};

exports.createSubTask = async (req, res) => {
  try {
    const { projectId, storyId } = req.params;
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const task = new SubTask({
      project: projectId,
      userStory: storyId,
      createdBy: req.user.userId,
      assignedTo: req.user.userId, // automatically assign to creator immediately
      title,
      description,
      status: "todo"
    });

    await task.save();
    await task.populate({ path: "assignedTo", select: "firstName lastName" });

    res.status(201).json(task);
  } catch (error) {
    console.error("Failed to create sub-task:", error);
    res.status(500).json({ message: "Server error creating sub-task" });
  }
};

exports.giveUpSubTask = async (req, res) => {
  try {
    const { projectId, storyId, taskId } = req.params;

    const task = await SubTask.findOne({ _id: taskId, project: projectId, userStory: storyId });
    if (!task) return res.status(404).json({ message: "Sub-task not found" });

    if (task.assignedTo && task.assignedTo.toString() !== req.user.userId) {
      return res.status(403).json({ message: "You cannot drop a task assigned to someone else" });
    }

    task.assignedTo = null;
    await task.save();

    res.json(task); // no need to wait populate since it's null
  } catch (error) {
    console.error("Failed to give up sub-task:", error);
    res.status(500).json({ message: "Server error unassigning task" });
  }
};

exports.claimSubTask = async (req, res) => {
  try {
    const { projectId, storyId, taskId } = req.params;

    const task = await SubTask.findOne({ _id: taskId, project: projectId, userStory: storyId });
    if (!task) return res.status(404).json({ message: "Sub-task not found" });

    if (task.assignedTo) {
      return res.status(403).json({ message: "Task is already claimed by someone else" });
    }

    task.assignedTo = req.user.userId;
    await task.save();
    await task.populate({ path: "assignedTo", select: "firstName lastName" });

    res.json(task);
  } catch (error) {
    console.error("Failed to claim sub-task:", error);
    res.status(500).json({ message: "Server error claiming task" });
  }
};

exports.toggleFinished = async (req, res) => {
  try {
    const { projectId, storyId, taskId } = req.params;

    const task = await SubTask.findOne({ _id: taskId, project: projectId, userStory: storyId });
    if (!task) return res.status(404).json({ message: "Sub-task not found" });

    task.status = task.status === "finished" ? "todo" : "finished";
    await task.save();
    await task.populate({ path: "assignedTo", select: "firstName lastName" });

    res.json(task);
  } catch (error) {
    console.error("Failed to toggle sub-task:", error);
    res.status(500).json({ message: "Server error finishing task" });
  }
};

exports.deleteSubTask = async (req, res) => {
  try {
    const { projectId, storyId, taskId } = req.params;

    const task = await SubTask.findOneAndDelete({ _id: taskId, project: projectId, userStory: storyId });
    if (!task) return res.status(404).json({ message: "Sub-task not found" });

    res.json({ message: "Task successfully removed" });
  } catch (error) {
    console.error("Failed to delete sub-task:", error);
    res.status(500).json({ message: "Server error deleting task" });
  }
};
