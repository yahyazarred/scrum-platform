const ProjectMembership = require("../models/ProjectMembership");

//verifies that the user is part of the project
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

//verifies if the user has the required role in the project
exports.requireRole = (...requiredRoles) => {
  return (req, res, next) => {
    // This middleware relies on verifyProjectMembership running first
    if (!req.projectMembership) {
      return res.status(500).json({ message: "Server configuration error: Membership not checked." });
    }

    if (!requiredRoles.includes(req.projectMembership.role)) {
      return res.status(403).json({ 
        message: `Action not allowed. You must be a ${requiredRoles.map(r => r.replace('_', ' ')).join(' or ')} to perform this action.` 
      });
    }

    next();
  };
};
