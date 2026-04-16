// ============================================================
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
app.use("/api/users", userRoutes);  

const projectRoutes = require("./routes/project.routes");
app.use("/api/projects", projectRoutes);

const backlogRoutes = require("./routes/backlog.routes");
app.use("/api/projects/:projectId/backlog", backlogRoutes);

const blockerRoutes = require("./routes/blocker.routes");
app.use("/api/projects/:projectId/stories/:storyId/blockers", blockerRoutes);

const subTaskRoutes = require("./routes/subtask.routes");
app.use("/api/projects/:projectId/stories/:storyId/subtasks", subTaskRoutes);

const sprintRoutes = require("./routes/sprint.routes");
app.use("/api/projects/:projectId/sprints", sprintRoutes);

app.get("/", (_req, res) => {
  res.json({ message: "Scrumble API running" });
});

module.exports = app;