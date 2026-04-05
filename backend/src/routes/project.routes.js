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

// Get the projects for the logged-in user
router.get("/my-projects", projectController.getUserProjects);

// Create a new project
router.post("/", projectController.createProject);

// Join a project via join code
router.post("/join", projectController.joinProject);

module.exports = router;
