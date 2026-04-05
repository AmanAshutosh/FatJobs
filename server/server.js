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

    // FIXED: Changed from 5 minutes to 12 hours (Twice a day)
    // Running every 5 minutes will burn through your API key in 1 hour.
    nodeCron.schedule("0 */12 * * *", () => {
      console.log("⏰ 12-Hour Mark: Syncing Jobs...");
      scrapeJobs().catch((err) =>
        console.log("Scrape error ignored:", err.message),
      );
    });

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`>>> [SYSTEM] Server active on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ CRITICAL: MongoDB Connection Failed!", err.message);
    process.exit(1);
  });
