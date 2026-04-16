const mongoose = require("mongoose");

const sprintSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },

  sprintNumber: {
    type: Number,
  },

  goal: {
    type: String,
    required: true,
  },

  startDate: {
    type: Date,
    default: Date.now,
  },

  endDate: {
    type: Date,
    required: true,
  },

  status: {
    type: String,
    enum: ["Active", "Completed"],
    default: "Active",
  },
  
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Sprint", sprintSchema);
