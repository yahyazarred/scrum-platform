const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth.middleware");
const userController = require("../controllers/user.controller");

// All user routes require authentication
router.use(protect);

router.get("/get-profile", userController.getMe);
router.put("/update-profile", userController.updateMe);

module.exports = router;