// ============================================================
// server.js
//
// What is this file?
//   The entry point. Connects to MongoDB, then starts the server.
//   Run this file with: node server.js
// ============================================================
 
const mongoose = require("mongoose");
require("dotenv").config(); // loads .env file into process.env
 
const app = require('./src/app');
 
const PORT = process.env.PORT || 5000;
 
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  });
 