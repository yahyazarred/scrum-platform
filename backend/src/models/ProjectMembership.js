const membershipSchema = new mongoose.Schema({
  User: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  Project: {
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