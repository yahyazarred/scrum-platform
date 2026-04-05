// ============================================================
// What is this file?
//   Two middleware utilities for project access control:
//
//   1. verifyProjectMembership
//      Checks the user is a member of the project and attaches
//      their membership (including role) to req.projectMembership.
//
//   2. requireRole(...roles)
//      A factory that returns a middleware enforcing that the
//      user's role is in the allowed list. must be chained after
//      verifyProjectMembership so req.projectMembership exists.
//
// Usage example in a route file:
//   const { verifyProjectMembership, requireRole } = require('../middleware/project.middleware');
//   router.post('/stories', requireRole('product_owner'), controller.createStory);
//   router.post('/sprint', requireRole('product_owner', 'scrum_master'), controller.createSprint);
// ============================================================

const ProjectMembership = require("../models/ProjectMembership");

//======= verifyProjectMembership =======
exports.verifyProjectMembership = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const projectId = req.params.projectId;

    if (!projectId) {
      return res.status(400).json({ message: "Project ID is required in the URL." });
    }

    const membership = await ProjectMembership.findOne({ user: userId, project: projectId });

    if (!membership) {
      return res.status(403).json({ message: "Access denied. Not a project member." });
    }

    // Attach membership so downstream middleware (requireRole) and controllers can read the role
    req.projectMembership = membership;
  
    next(); 
  } catch (error) {
    console.error("Error verifying project membership:", error);
    res.status(500).json({ message: "Server error verifying project membership." });
  }
};

//======= requireRole =======
// call it with one or more allowed role strings.
// Returns a standard Express middleware that blocks the request
// with 403 if the current user's role is not in the allowed list.
exports.requireRole = (...allowedRoles) => (req, res, next) => {
  const role = req.projectMembership?.role;

  if (!allowedRoles.includes(role)) {
    return res.status(403).json({
      message: `Access denied. Required role: ${allowedRoles.join(" or ")}.`,
    });
  }

  next();
};
