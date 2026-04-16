const User = require("../models/User");
const EmailVerification = require("../models/EmailVerification");
const sendVerificationEmail = require("../utils/mailer");

exports.resendVerification = async (req, res) => {
  try {
    // req.user is set by auth.middleware.js — contains { userId, status }
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.status === "VERIFIED") {
      return res.status(400).json({ message: "This account is already verified" });
    }
    
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    await EmailVerification.deleteOne({ email: user.email });
    await EmailVerification.create({ email: user.email, code: verificationCode, expiresAt });

    console.log(`[DEV] Resend code for ${user.email}: ${verificationCode}`);
    await sendVerificationEmail(user.email, verificationCode);

    res.json({ message: "Verification email sent!", email: user.email });
  } catch (err) {
    console.error("Resend verification error:", err.message);
    res.status(500).json({ error: err.message });
  }
};