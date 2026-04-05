require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const nodeCron = require("node-cron");
const { scrapeJobs } = require("./services/scraperService");
const jobRoutes = require("./routes/jobRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();
// Railway provides the PORT variable automatically
const PORT = process.env.PORT || 5000;

// Updated CORS for Production
app.use(
  cors({
    origin: "*", // Allows Vercel to talk to Railway
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());

// Health Check Route (Crucial for Railway to see the app is "Alive")
app.get("/", (req, res) => {
  res.send("FatJobs API is Running...");
});

app.use("/api/auth", authRoutes);
app.use("/api", jobRoutes);

console.log("⏳ Connecting to MongoDB Atlas...");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Cloud Database Linked!");

    // CRON: Every 5 Minutes
    nodeCron.schedule("*/5 * * * *", () => {
      console.log("⏰ 5-Minute Mark: Syncing Jobs...");
      scrapeJobs();
    });

    // FIXED: Listen on '0.0.0.0' for Railway compatibility
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`>>> [SYSTEM] Server active on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ CRITICAL: MongoDB Connection Failed!", err.message);
    process.exit(1);
  });
