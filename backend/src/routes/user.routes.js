// ============================================================
// What is this file?
//   Maps URLs to controller functions for user data.
//   These routes are protected (you must be logged in).
//                     
//   protect runs first, checks token.
//   If token is valid → getMe runs.
//   If token is invalid → protect sends 401, getMe never runs.
// ============================================================

const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth.middleware");
const userController = require("../controllers/user.controller");

router.get("/me", protect, userController.getMe);
router.put("/me",  protect, userController.updateMe); // update profile

module.exports = router;