const express = require("express");
const router = express.Router({ mergeParams: true });
const blockerController = require("../controllers/blocker.controller");
const protect = require("../middleware/auth.middleware");
const { verifyProjectMembership, requireRole } = require("../middleware/project.middleware");

router.use(protect);
router.use(verifyProjectMembership);

// /api/projects/:projectId/stories/:storyId/blockers

router.get("/", blockerController.getBlockers);

// Only developers can create blockers
router.post("/", requireRole("developer"), blockerController.createBlocker);

// Any valid project member can solve a blocker
router.patch("/:blockerId/solve", blockerController.solveBlocker);

module.exports = router;
