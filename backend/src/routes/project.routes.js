const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth.middleware");
const projectController = require("../controllers/project.controller");
const { verifyProjectMembership, requireRole } = require("../middleware/project.middleware");

// All project routes require authentication
router.use(protect);

router.get("/get-my-projects", projectController.getUserProjects);
router.get("/get-project/:projectId", verifyProjectMembership, projectController.getProjectById);
router.post("/create-project", projectController.createProject);
router.put("/update-project/:projectId", verifyProjectMembership, requireRole("product_owner"), projectController.updateProject);
router.delete("/delete-project/:projectId", verifyProjectMembership, requireRole("product_owner"), projectController.deleteProject);
router.post("/join-project", projectController.joinProject);

//==== team members routes ====
router.get("/get-members/:projectId", verifyProjectMembership, projectController.getProjectMembers);
router.delete("/leave-project/:projectId", verifyProjectMembership, projectController.leaveProject);
router.delete("/kick-member/:projectId/:memberId", verifyProjectMembership, requireRole("product_owner"), projectController.kickMember);

module.exports = router;
