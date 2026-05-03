const express = require("express");
const router = express.Router({ mergeParams: true }); //!!!
const backlogController = require("../controllers/backlog.controller");
const protect = require("../middleware/auth.middleware");
const { verifyProjectMembership, requireRole } = require("../middleware/project.middleware");

// All backlog routes require authentication and project membership
router.use(protect);
router.use(verifyProjectMembership);

//==== epics routes ====
router.post("/create-epic",requireRole("product_owner"), backlogController.createEpic);
router.get("/get-epics", backlogController.getEpics);

//==== user stories routes ====
router.post("/create-story",requireRole("product_owner"), backlogController.createUserStory);
router.get("/get-stories", backlogController.getUserStories);
router.put("/reorder-stories",requireRole("product_owner"), backlogController.reorderStories);
router.put("/update-story/:storyId", backlogController.updateUserStory);
router.put("/estimate-story/:storyId", requireRole("developer"), backlogController.estimateStoryPoints);
router.delete("/delete-story/:storyId", requireRole("product_owner"), backlogController.deleteUserStory);

module.exports = router;
