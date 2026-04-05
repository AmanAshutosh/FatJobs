require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const nodeCron = require("node-cron");
const { scrapeJobs } = require("./services/scraperService");
const jobRoutes = require("./routes/jobRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Update CORS to be more permissive for your Vercel frontend
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
  }),
);

app.use(express.json());

// 1. ADD THIS: Health Check for Railway
app.get("/", (req, res) => {
  res.status(200).send("🚀 FatJobs Backend is Live and Running!");
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
      scrapeJobs().catch((err) =>
        console.log("Scrape error ignored to keep server up:", err.message),
      );
    });

    // 2. FIXED: Added '0.0.0.0' and removed blocking scrapeJobs() on startup
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`>>> [SYSTEM] Server active on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ CRITICAL: MongoDB Connection Failed!", err.message);
    process.exit(1);
  });
