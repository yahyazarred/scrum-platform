// ============================================================
// What is this file?
//   Sets up the Express app — middleware, routes, and exports it.
//   Does NOT start the server (that's server.js's job).
//
// Why split app.js and server.js?
//   Keeping them separate makes testing easier later.
//   I can import app.js in tests without actually starting a server.
// ============================================================

const express = require("express");
const cors = require("cors");

const app = express();

// --- Global middleware ---

app.use(cors());
app.use(express.json());

// --- Routes ---

const authRoutes = require("./routes/auth.routes");
app.use("/api/auth", authRoutes); 

const userRoutes = require("./routes/user.routes");
app.use("/api/user", userRoutes);  

app.get("/", (req, res) => {
  res.json({ message: "Scrumble API running" });
});

module.exports = app;