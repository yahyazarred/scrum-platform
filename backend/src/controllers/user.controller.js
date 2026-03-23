// ============================================================
// controllers/user.controller.js
//
// What is this file?
//   Handles everything related to the logged-in user's data.
//   Right now: just fetching the current user's profile.
//
// Notice: NO token verification here anymore.
//   That job belongs to auth.middleware.js. By the time
//   any function in this file runs, req.user is already set.
// ============================================================

const User = require("../models/User");

// GET /api/user/me
// Returns the profile of whoever is currently logged in
exports.getMe = async (req, res) => {
  try {
    // req.user was set by auth.middleware.js
    // It contains the decoded JWT payload: { userId, status }
    const user = await User.findById(req.user.userId).select("-password");
    //                                                  ↑
    // .select("-password") means: return everything EXCEPT the password field
    // Never send the hashed password to the frontend

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      status: user.status,
    });
  } catch (err) {
    console.error("getMe error:", err.message);
    res.status(500).json({ error: err.message });
  }
};