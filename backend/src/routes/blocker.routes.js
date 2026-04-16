const express = require("express");
const router = express.Router({ mergeParams: true });
const blockerController = require("../controllers/blocker.controller");
const protect = require("../middleware/auth.middleware");
const { verifyProjectMembership, requireRole } = require("../middleware/project.middleware");

// All blocker routes require authentication and project membership
router.use(protect);
router.use(verifyProjectMembership);

router.get("/get-blockers", blockerController.getBlockers);
router.post("/create-blocker", requireRole("developer"), blockerController.createBlocker);
router.patch("/solve-blocker/:blockerId", blockerController.solveBlocker);

module.exports = router;
