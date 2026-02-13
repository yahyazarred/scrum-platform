const User = require("../models/User");
const EmailVerification = require("../models/EmailVerification");
const sendVerificationEmail = require("../utils/mailer");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ================= signup logic ================= //
exports.signup = async (req, res) => {
  try {
    const userData = req.body;

    //Check if email already exists

    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    //Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    //Create user (UNVERIFIED by default)
    await User.create({
      ...userData,
      password: hashedPassword,
    });

    //Generate 6-digit verification code
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();

    //Set expiration (5 minutes)
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    //Remove any existing verification for this email
     await EmailVerification.deleteOne({ email: userData.email });

    //Create EmailVerification
    await EmailVerification.create({
      email: userData.email,
      code: verificationCode,
      expiresAt,
    });

    //Send code by email
     await sendVerificationEmail(userData.email, verificationCode);

    console.log("Verification code:", verificationCode);

    res.status(201).json({ message: "User created. Please verify your email." });
  } catch (err) {
    console.log("Signup error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// ================= verification logic ================= //
exports.verifyEmail = async (req, res) => {
  try {
    const verificationData= req.body;

    //Find verification record
    const verification = await EmailVerification.findOne({ email:verificationData.email });

    if (!verification) {
      return res.status(400).json({
        message: "Verification expired or not found",
      });
    }

    //Compare code
    if (verification.code !== verificationData.code) {
      verification.attempts += 1;
      await verification.save();

      return res.status(400).json({
        message: "Invalid verification code",
      });
    }

    //Find user to update their status
    const user = await User.findOne({ email:verificationData.email });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    //Update status
    user.status = "VERIFIED";
    await user.save();

    //Delete verification record
    await EmailVerification.deleteOne({ email:verificationData.email });

    res.status(200).json({
      message: "Email verified successfully!",
    });
  } catch (err) {
    console.log("Verification error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// ================= login logic================= //
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    //Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    //Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    //Generate JWT token
    const token = jwt.sign(
      { userId: user._id, status: user.status },
      process.env.JWT_SECRET,
    );

    //Send response
    res.json({
      message: "Login successful",
      token,
      status: user.status,
      firstName: user.firstName,
      lastName: user.lastName,
    });
  } catch (err) {
    console.log("Login error:", err.message);
    res.status(500).json({ error: err.message });
  }
};
