// Note: ProjectMembership Schema tracks the roles of users in a project (product_owner, scrum_master, developer)
const mongoose = require("mongoose");

const membershipSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },

  role: {
    type: String,
    enum: ["product_owner", "scrum_master", "developer"],
    required: true,
  },
});

module.exports = mongoose.model("ProjectMembership", membershipSchema);