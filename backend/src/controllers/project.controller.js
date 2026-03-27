// ============================================================
// What is this file?
//   Controller for project-related operations (create, join, fetch).
// ============================================================

const Project = require("../models/Project");
const ProjectMembership = require("../models/ProjectMembership");

// Helper to generate a 6-character uppercase alphanumeric code
const generateJoinCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};
//=================project creation=============
exports.createProject = async (req, res) => {
  try {
    const { name, description, sprintDuration, projectGoal, githubLink } = req.body;
    const userId = req.user.userId;

    const User = require("../models/User");
    const user = await User.findById(userId);
    if (!user || user.status !== "VERIFIED") {
      return res.status(403).json({ message: "You must be verified to create a project." });
    }

    if (!name || !sprintDuration || !projectGoal) {
      return res.status(400).json({ message: "Project name, sprint duration, and project goal are required" });
    }

    const scrumMasterCode = generateJoinCode();
    let developerCode = generateJoinCode();
    
    // Ensure they are unique
    while (scrumMasterCode === developerCode) {
      developerCode = generateJoinCode();
    }

    const newProject = new Project({
      name,
      description,
      sprintDuration,
      projectGoal,
      githubLink,
      joinCodes: {
        scrumMaster: scrumMasterCode,
        developer: developerCode,
      },
    });
    const savedProject = await newProject.save();

    const membership = new ProjectMembership({
      user: userId,
      project: savedProject._id,
      role: "product_owner",
    });
    await membership.save();

    res.status(201).json({
      message: "Project created successfully",
      project: savedProject,
      membership,
    });
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ message: "Server error creating project" });
  }
};

//=================fetch user projects==========
exports.getUserProjects = async (req, res) => {
  try {
    const userId = req.user.userId;
    // Find all memberships for this user, populate the Project details
    const memberships = await ProjectMembership.find({ user: userId }).populate("project");
    
    res.status(200).json(memberships);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ message: "Server error fetching projects" });
  }
};

//=================join project=================
exports.joinProject = async (req, res) => {
  try {
    const { joinCode } = req.body;
    const userId = req.user.userId;

    const User = require("../models/User");
    const user = await User.findById(userId);
    if (!user || user.status !== "VERIFIED") {
      return res.status(403).json({ message: "You must be verified to join a project." });
    }

    if (!joinCode) {
      return res.status(400).json({ message: "Join code is required" });
    }

    // Find project that matches the join code in either scrumMaster or developer
    const project = await Project.findOne({
      $or: [
        { "joinCodes.scrumMaster": joinCode },
        { "joinCodes.developer": joinCode }
      ]
    });

    if (!project) {
      return res.status(404).json({ message: "Invalid join code." });
    }

    // Check if user is already a member
    const existingMembership = await ProjectMembership.findOne({
      user: userId,
      project: project._id,
    });

    if (existingMembership) {
      return res.status(400).json({ message: "You are already a member of this project." });
    }

    // Determine role based on which code matched
    let role = "";
    if (project.joinCodes.scrumMaster === joinCode) {
      role = "scrum_master";
    } else if (project.joinCodes.developer === joinCode) {
      role = "developer";
    }

    const membership = new ProjectMembership({
      user: userId,
      project: project._id,
      role,
    });
    await membership.save();

    res.status(200).json({
      message: `Successfully joined the project as ${role}`,
      project,
      role,
    });
  } catch (error) {
    console.error("Error joining project:", error);
    res.status(500).json({ message: "Server error joining project" });
  }
};
