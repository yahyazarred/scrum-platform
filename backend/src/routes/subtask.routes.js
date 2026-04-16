const express = require("express");
const router = express.Router({ mergeParams: true });
const subTaskController = require("../controllers/subtask.controller");
const protect = require("../middleware/auth.middleware");
const { verifyProjectMembership, requireRole } = require("../middleware/project.middleware");

// All subtask routes require authentication and project membership
router.use(protect);
router.use(verifyProjectMembership);

router.get("/get-subtasks", subTaskController.getSubTasks);
router.post("/create-subtask", requireRole("developer"), subTaskController.createSubTask);
router.patch("/giveup-subtask/:taskId", requireRole("developer"), subTaskController.giveUpSubTask);
router.patch("/claim-subtask/:taskId", requireRole("developer"), subTaskController.claimSubTask);
router.patch("/toggle-subtask/:taskId", requireRole("developer"),subTaskController.toggleFinished);
router.delete("/delete-subtask/:taskId", requireRole("developer"), subTaskController.deleteSubTask);

module.exports = router;
