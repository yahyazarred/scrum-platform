// ============================================================
// What is this file?
//   Maps URLs to controller functions for auth actions
//   These routes are public (no token needed) except for resend verification
// ============================================================

const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { resendVerification } = require("../controllers/resend.controller");
const protect = require("../middleware/auth.middleware");
 
// Public
router.post("/signup",           authController.signup);
router.post("/login",            authController.login);
router.post("/verify-email",     authController.verifyEmail);
 
// Protected — user must be logged in (token required)
router.post("/resend-verification", protect, resendVerification);
 
module.exports = router;