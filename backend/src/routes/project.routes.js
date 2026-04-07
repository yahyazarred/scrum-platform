// ============================================================
// What is this file?
//   Defines project-related routes (create, fetch, join).
// ============================================================

const express = require("express");
const protect = require("../middleware/auth.middleware");
const projectController = require("../controllers/project.controller");

const router = express.Router();

// All project routes require authentication
router.use(protect);

const { verifyProjectMembership, requireRole } = require("../middleware/project.middleware");

// Get the projects for the logged-in user
router.get("/my-projects", projectController.getUserProjects);

// Get a single project
router.get("/:projectId", verifyProjectMembership, projectController.getProjectById);

// Create a new project
router.post("/", projectController.createProject);

// Update a project
router.put("/:projectId", verifyProjectMembership, requireRole("product_owner"), projectController.updateProject);

// Delete a project
router.delete("/:projectId", verifyProjectMembership, requireRole("product_owner"), projectController.deleteProject);

// Join a project via join code
router.post("/join", projectController.joinProject);

module.exports = router;
