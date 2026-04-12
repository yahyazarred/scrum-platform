const express = require("express");
const protect = require("../middleware/auth.middleware");
const { verifyProjectMembership, requireRole } = require("../middleware/project.middleware");
const sprintController = require("../controllers/sprint.controller");

const router = express.Router();

router.use(protect);

router.get("/active/:projectId", verifyProjectMembership, sprintController.getActiveSprint);
router.post("/start/:projectId", verifyProjectMembership, requireRole("scrum_master"), sprintController.startSprint);
router.post("/end/:projectId", verifyProjectMembership, requireRole("scrum_master"), sprintController.endActiveSprint);

module.exports = router;
