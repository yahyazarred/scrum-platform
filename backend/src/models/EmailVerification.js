// ============================================================
//   this is a temporary entity that holds the verification code that is sent by email
//   its deleted once the email is verified or the code expires
// ============================================================
const mongoose = require("mongoose");

const emailVerificationSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true, 
    },

    code: {
      type: String,
      required: true,
    },

    
    expiresAt: {
      type: Date,
      required: true,
    },

    attempts: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, 
  }
);


// Time To Live Index (Automatic Deletion After Expiration)
emailVerificationSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);

module.exports = mongoose.model("EmailVerification", emailVerificationSchema);
