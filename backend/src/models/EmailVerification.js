const mongoose = require("mongoose");

const emailVerificationSchema = new mongoose.Schema(
  {
    // The email we are verifying
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true, // Only ONE active verification per email
    },

    // The 6-digit verification code
    code: {
      type: String,
      required: true,
    },

    // When this verification expires
    expiresAt: {
      type: Date,
      required: true,
    },

    // How many wrong attempts were made
    attempts: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, // adds createdAt automatically
  }
);


// 🔥 TTL Index (Automatic Deletion After Expiration)
emailVerificationSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);

module.exports = mongoose.model(
  "EmailVerification",
  emailVerificationSchema
);
