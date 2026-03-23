// ============================================================
// app.js
//
// What is this file?
//   Sets up the Express app — middleware, routes, and exports it.
//   Does NOT start the server (that's server.js's job).
//
// Why split app.js and server.js?
//   Keeping them separate makes testing easier later.
//   You can import app.js in tests without actually starting a server.
// ============================================================

const express = require("express");
const cors = require("cors");

const app = express();

// --- Global middleware ---
// cors()       → allows your React frontend (localhost:5173) to talk to this server
// express.json → automatically parses incoming JSON request bodies (req.body)
app.use(cors());
app.use(express.json());

// --- Routes ---
// Each router handles a group of related URLs
const authRoutes = require("./routes/auth.routes");
app.use("/api/auth", authRoutes);  // /api/auth/signup, /api/auth/login, /api/auth/verify-email

const userRoutes = require("./routes/user.routes");
app.use("/api/user", userRoutes);  // /api/user/me

// Health check — useful for confirming the server is running
app.get("/", (req, res) => {
  res.json({ message: "Scrumble API running" });
});

module.exports = app;