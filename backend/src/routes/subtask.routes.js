const express = require("express");
const router = express.Router({ mergeParams: true });
const subTaskController = require("../controllers/subtask.controller");
const protect = require("../middleware/auth.middleware");
const { verifyProjectMembership, requireRole } = require("../middleware/project.middleware");

router.use(protect);
router.use(verifyProjectMembership);

// /api/projects/:projectId/stories/:storyId/subtasks

router.get("/", subTaskController.getSubTasks);

// Only developers can create tasks initially
router.post("/", requireRole("developer"), subTaskController.createSubTask);

// Assignee logic (Only developers can claim/drop/delete tasks)
router.patch("/:taskId/giveup", requireRole("developer"), subTaskController.giveUpSubTask);
router.patch("/:taskId/claim", requireRole("developer"), subTaskController.claimSubTask);
router.patch("/:taskId/toggle", subTaskController.toggleFinished);
router.delete("/:taskId", requireRole("developer"), subTaskController.deleteSubTask);

module.exports = router;
