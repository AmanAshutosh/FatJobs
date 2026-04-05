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

app.use(cors());
app.use(express.json());

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

    app.listen(PORT, () => {
     console.log(`>>> [SYSTEM] Server active on port ${PORT}`);
      // scrapeJobs(); // Run once on startup to verify tech-filter
    });
  })
  .catch((err) => {
    console.error("❌ CRITICAL: MongoDB Connection Failed!", err.message);
    process.exit(1);
  });
