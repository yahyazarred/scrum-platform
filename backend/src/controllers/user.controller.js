const User = require("../models/User");

// ================= get the information of the logged in user================= //
exports.getMe = async (req, res) => {
  try {
    // req.user was set by auth.middleware.js
    // It contains the decoded JWT payload: { userId, status }
    const user = await User.findById(req.user.userId).select("-password");                                                 
    // .select("-password") means: return everything except the password field

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

// =========== update the information of the logged in user=====================//
exports.updateMe = async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;
 
    // Fetch the current user first so we can compare the incoming
    // email against what's already stored
    const currentUser = await User.findById(req.user.userId);
    if (!currentUser) return res.status(404).json({ message: "User not found" });
 
    //check if we got an email in the request and if it is different from the current email
    const emailChanged = email && email !== currentUser.email;
 
    //verify that the new email is not used by another user
    if (emailChanged) {
      const existing = await User.findOne({ email });
      if (existing && existing._id.toString() !== req.user.userId) {
        return res.status(400).json({ message: "Email is already in use by another account" });
      }
    }
 
    const updates = {};
    if (firstName) updates.firstName = firstName;
    if (lastName)  updates.lastName  = lastName;
    if (email)     updates.email     = email;
 
    // Only reset status if the email changed
    if (emailChanged) updates.status = "AWAITING_EMAIL_VERIFICATION";
 
    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      updates,
      { new: true } //get the new updated user data
    ).select("-password");
 
    res.json({
      message:   "Profile updated successfully",
      firstName: updatedUser.firstName,
      lastName:  updatedUser.lastName,
      email:     updatedUser.email,
      status:    updatedUser.status,
    });
  } catch (err) {
    console.error("updateMe error:", err.message);
    res.status(500).json({ error: err.message });
  }
};