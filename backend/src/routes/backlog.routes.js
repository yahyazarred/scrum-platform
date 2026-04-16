const express = require("express");
const router = express.Router({ mergeParams: true }); //!!!
const backlogController = require("../controllers/backlog.controller");
const protect = require("../middleware/auth.middleware");
const { verifyProjectMembership } = require("../middleware/project.middleware");

// All backlog routes require authentication and project membership
router.use(protect);
router.use(verifyProjectMembership);

//==== epics routes ====
router.post("/create-epic", backlogController.createEpic);
router.get("/get-epics", backlogController.getEpics);

//==== user stories routes ====
router.post("/create-story", backlogController.createUserStory);
router.get("/get-stories", backlogController.getUserStories);
router.put("/reorder-stories", backlogController.reorderStories);
router.put("/update-story/:storyId", backlogController.updateUserStory);
router.delete("/delete-story/:storyId", backlogController.deleteUserStory);

module.exports = router;
