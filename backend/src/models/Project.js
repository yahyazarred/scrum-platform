const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  description: {
    type: String,
  },

  sprintDuration: {
    type: Number,
    required: true,
  },

  projectGoal: {
    type: String,
    required: true,
  },

  githubLink: {
    type: String,
  },

  joinCodes: {
    scrumMaster: {
      type: String,
      required: true,
    },
    developer: {
      type: String,
      required: true,
    },
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Project", projectSchema);