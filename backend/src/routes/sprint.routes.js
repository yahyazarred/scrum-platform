const express = require("express");
const protect = require("../middleware/auth.middleware");
const { verifyProjectMembership, requireRole } = require("../middleware/project.middleware");
const sprintController = require("../controllers/sprint.controller");

const router = express.Router({ mergeParams: true });

router.use(protect);
router.use(verifyProjectMembership);

router.get("/get-active-sprint/:projectId", sprintController.getActiveSprint);
router.post("/start-sprint/:projectId", requireRole("scrum_master"), sprintController.startSprint);
router.post("/end-sprint/:projectId", requireRole("scrum_master"), sprintController.endActiveSprint);

module.exports = router;
