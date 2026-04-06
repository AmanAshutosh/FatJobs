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

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
  }),
);

app.use(express.json());

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

    // TASK 1: EVERY 2 HOURS (FREE)
    // Greenhouse (Binance, PhonePe, etc.) is free. Run it often to catch roles!
    nodeCron.schedule("0 */2 * * *", async () => {
      console.log("⏰ 2-Hour Mark: Syncing Direct Company Boards...");
      try {
        // You'll need to export scrapeGreenhouse specifically in scraperService.js
        const { scrapeGreenhouse } = require("./services/scraperService");
        await scrapeGreenhouse();
      } catch (err) {
        console.log("Greenhouse sync error:", err.message);
      }
    });

    // TASK 2: ONCE A DAY (PAID/LIMITED)
    // JSearch (LinkedIn/Indeed aggregator) has a 20-req limit. Run it once at midnight.
    nodeCron.schedule("0 0 * * *", async () => {
      console.log(
        "⏰ Daily Midnight Sync: Fetching Aggregator Roles (JSearch)...",
      );
      try {
        const { scrapeJSearch } = require("./services/scraperService");
        await scrapeJSearch();
      } catch (err) {
        console.log("JSearch sync error:", err.message);
      }
    });

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`>>> [SYSTEM] Server active on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ CRITICAL: MongoDB Connection Failed!", err.message);
    process.exit(1);
  });
