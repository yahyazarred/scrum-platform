const mongoose = require("mongoose");

const blockerSchema = new mongoose.Schema({
  userStory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserStory",
    required: true,
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  status: {
    type: String,
    enum: ["unsolved", "solved"],
    default: "unsolved",
  },
  description: {
    type: String,
    required: true,
  },
  resolutionDescription: {
    type: String,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  solvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  solvedAt: {
    type: Date,
  },
});

module.exports = mongoose.model("Blocker", blockerSchema);
