// ============================================================
// What is this file?
//   Defines project-related routes (create, fetch, join).
// ============================================================

const express = require("express");
const protect = require("../middleware/auth.middleware");
const projectController = require("../controllers/project.controller");

const router = express.Router();

// Get the projects for the logged-in user
router.get("/my-projects", protect, projectController.getUserProjects);

// Create a new project
router.post("/", protect, projectController.createProject);

// Join a project via join code
router.post("/join", protect, projectController.joinProject);

module.exports = router;
