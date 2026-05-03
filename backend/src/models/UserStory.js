const mongoose = require("mongoose");

const userStorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  status: {
    type: String,
    enum: ["To Do", "In Progress", "Done"],
    default: "To Do",
  },

  epic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Epic",
  },

  priority: {
    type: Number,
    required: true,
    default: 0,
  },

  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },

  sprint: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Sprint",
  },

  isBlocked: {
    type: Boolean,
    default: false,
  },

  storyPoints: {
    type: Number,
    enum: [1, 2, 3, 5, 8, 13, 21],
    default: null,
  },

  completedAt: {
    type: Date,
    default: null,
  },
  
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("UserStory", userStorySchema);
