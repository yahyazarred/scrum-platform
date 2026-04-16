const Blocker = require("../models/Blocker");
const UserStory = require("../models/UserStory");

//======= get blockers =======
exports.getBlockers = async (req, res) => {
  try {
    const { projectId, storyId } = req.params;
    const blockers = await Blocker.find({ project: projectId, userStory: storyId })
      .populate("createdBy", "firstName lastName")
      .populate("solvedBy", "firstName lastName")
      .sort({ createdAt: -1 });
    
    res.json(blockers);
  } catch (error) {
    console.error("Failed to get blockers:", error);
    res.status(500).json({ message: "Server error getting blockers" });
  }
};

//======= create a blocker =======
exports.createBlocker = async (req, res) => {
  try {
    const { projectId, storyId } = req.params;
    const { description } = req.body;

    if (!description) {
      return res.status(400).json({ message: "Description is required" });
    }

    const blocker = await Blocker.create({
      project: projectId,
      userStory: storyId,
      createdBy: req.user.userId,
      description,
      status: "unsolved"
    });

    await blocker.populate({ path: "createdBy", select: "firstName lastName" });

    // lock the story
    await UserStory.findByIdAndUpdate(storyId, { isBlocked: true });

    res.status(201).json(blocker);
  } catch (error) {
    console.error("Failed to create blocker:", error);
    res.status(500).json({ message: "Server error creating blocker" });
  }
};

exports.solveBlocker = async (req, res) => {
  try {
    const { projectId, storyId, blockerId } = req.params;
    const { resolutionDescription } = req.body;

    if (!resolutionDescription) {
      return res.status(400).json({ message: "Resolution description is required" });
    }

    const blocker = await Blocker.findOne({ _id: blockerId, project: projectId, userStory: storyId });
    if (!blocker) {
      return res.status(404).json({ message: "Blocker not found" });
    }

    if (blocker.status === "solved") {
      return res.status(400).json({ message: "Blocker is already solved" });
    }

    blocker.status = "solved";
    blocker.resolutionDescription = resolutionDescription;
    blocker.solvedBy = req.user.userId;
    blocker.solvedAt = new Date();

    await blocker.save();
    await blocker.populate({ path: "createdBy", select: "firstName lastName" });
    await blocker.populate({ path: "solvedBy", select: "firstName lastName" });

    // Check if there are any remaining unsolved blockers for this story
    const unsolvedCount = await Blocker.countDocuments({ userStory: storyId, status: "unsolved" });
    if (unsolvedCount === 0) {
      await UserStory.findByIdAndUpdate(storyId, { isBlocked: false });
    }

    res.json(blocker);
  } catch (error) {
    console.error("Failed to solve blocker:", error);
    res.status(500).json({ message: "Server error solving blocker" });
  }
};
