const User = require("../models/User");
const EmailVerification = require("../models/EmailVerification");
const sendVerificationEmail = require("../utils/mailer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// function that creates a token
const signToken = (user) =>
  jwt.sign(
    {
      userId: user._id,
      status: user.status,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

// ================= signup ================= //
exports.signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ firstName, lastName, email, password: hashedPassword });

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await EmailVerification.deleteOne({ email });
    await EmailVerification.create({ email, code: verificationCode, expiresAt });

    console.log(`[DEV] Verification code for ${email}: ${verificationCode}`);
    await sendVerificationEmail(email, verificationCode);

    res.status(201).json({ message: "Account created! Please check your email for a verification code." });
  } catch (err) {
    console.error("Signup error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// ================= verify-email ================= //
exports.verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body;

    const verification = await EmailVerification.findOne({ email });
    if (!verification) {
      return res.status(400).json({ message: "Verification code expired or not found" });
    }

    if (verification.code !== code) {
      verification.attempts += 1;
      await verification.save();
      return res.status(400).json({ message: "Invalid verification code" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.status = "VERIFIED";
    await user.save();

    await EmailVerification.deleteOne({ email });

    const token = signToken(user);

    res.status(200).json({
      message: "Email verified! Welcome aboard.",
      token,
    });
  } catch (err) {
    console.error("Verification error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// ================= login ================= //
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const token = signToken(user);

    res.json({ message: "Login successful", token });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ error: err.message });
  }
};