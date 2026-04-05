// ============================================================
// What is this file?
//   Defines backlog-related routes (Epics and User Stories).
//   All routes require auth AND verified project membership.
// ============================================================

const express = require("express");
const router = express.Router({ mergeParams: true }); // mergeParams is important because the route will be mounted on /api/projects/:projectId/backlog
const backlogController = require("../controllers/backlog.controller");
const protect = require("../middleware/auth.middleware");
const { verifyProjectMembership } = require("../middleware/project.middleware");

// All backlog routes require authentication AND project membership
router.use(protect);
router.use(verifyProjectMembership);

// Epic routes
router.post("/epics", backlogController.createEpic);
router.get("/epics", backlogController.getEpics);

// User Story routes
router.post("/stories", backlogController.createUserStory);
router.get("/stories", backlogController.getUserStories);
router.put("/stories/reorder", backlogController.reorderStories);
router.put("/stories/:storyId", backlogController.updateUserStory);
router.delete("/stories/:storyId", backlogController.deleteUserStory);

module.exports = router;
