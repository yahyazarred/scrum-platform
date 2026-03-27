// ============================================================
// What is this file?
//   creates the user entity in the database
// ============================================================
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    dateOfBirth: {
      type: Date,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["AWAITING_EMAIL_VERIFICATION", "VERIFIED"],
      default: "AWAITING_EMAIL_VERIFICATION",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
