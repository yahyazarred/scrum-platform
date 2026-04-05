// ============================================================
// What is this file?
//   Defines backlog-related routes (Epics and User Stories).
//   All routes require auth AND verified project membership.
//
// Role rules:
//   - GET routes  → any project member (all roles)
//   - Write routes → product_owner only
//
// To restrict a future route, add:
//   router.post('/something', ownerOnly, controller.fn);
// Or for multiple roles:
//   router.post('/something', requireRole('product_owner', 'scrum_master'), controller.fn);
// ============================================================

const express = require("express");
const router = express.Router({ mergeParams: true }); // mergeParams lets us read :projectId from the parent router
const backlogController = require("../controllers/backlog.controller");
const protect = require("../middleware/auth.middleware");
const { verifyProjectMembership, requireRole } = require("../middleware/project.middleware");

// All backlog routes require authentication AND project membership
router.use(protect);
router.use(verifyProjectMembership);

const requireProductOwner = requireRole("product_owner");

// ── My Role ──────────────────────────────────────────────────
// Returns the current user's role in this project.
// Used by the frontend to conditionally show/hide UI elements.
router.get("/my-role", (req, res) => {
  res.json({ role: req.projectMembership.role });
});

// ── Epic routes ───────────────────────────────────────────────
router.get("/epics", backlogController.getEpics);
router.post("/epics", requireProductOwner, backlogController.createEpic);

// ── User Story routes ─────────────────────────────────────────
router.get("/stories", backlogController.getUserStories);

router.post("/stories",               requireProductOwner, backlogController.createUserStory);
router.put("/stories/reorder",        requireProductOwner, backlogController.reorderStories);
router.put("/stories/:storyId",       requireProductOwner, backlogController.updateUserStory);
router.delete("/stories/:storyId",    requireProductOwner, backlogController.deleteUserStory);

module.exports = router;

