// ============================================================
// What is this file?
//   Middleware that checks if the authenticated user is a member
//   of the requested project before allowing access to the route.
//
// How it works:
//   1. Gets userId from req.user and projectId from req.params
//   2. Validates that projectId exists
//   3. Checks the database for a matching membership
//   4. If not found → returns 403 (access denied)
//   5. If found → attaches membership to req.projectMembership
//   6. Calls next() to continue to the controller
// ============================================================

const ProjectMembership = require("../models/ProjectMembership");

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

    // Attach membership details to request in case downstream controllers need the user's role
    req.projectMembership = membership;
  
    next(); 
  } catch (error) {
    console.error("Error verifying project membership:", error);
    res.status(500).json({ message: "Server error verifying project membership." });
  }
};

exports.requireRole = (requiredRole) => {
  return (req, res, next) => {
    // This middleware relies on verifyProjectMembership running first
    if (!req.projectMembership) {
      return res.status(500).json({ message: "Server configuration error: Membership not checked." });
    }

    if (req.projectMembership.role !== requiredRole) {
      return res.status(403).json({ 
        message: `Action not allowed. You must be a ${requiredRole.replace('_', ' ')} to perform this action.` 
      });
    }

    next();
  };
};
