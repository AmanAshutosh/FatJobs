require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const nodeCron = require("node-cron");
const {
  scrapeGreenhouse,
  scrapeJSearch,
  scrapeJobs, // <--- ADD THIS: This is the master function that includes sheet scraping
} = require("./services/scraperService");
const jobRoutes = require("./routes/jobRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "*", methods: ["GET", "POST"] }));
app.use(express.json());

app.get("/", (req, res) =>
  res.status(200).send("FatJobs Backend is Running!"),
);

app.use("/api/auth", authRoutes);
app.use("/api", jobRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Cloud Database Linked!");

    // --- TASK 1: EVERY 2 HOURS (The "Sheet & Company Board" Sync) ---
    nodeCron.schedule("0 */2 * * *", async () => {
      console.log(" 2-Hour Sync: Sheet Links & Greenhouse Boards...");
      try {
        // We call scrapeJobs() now because it contains both
        // the Sheet logic AND the Greenhouse logic.
        await scrapeJobs();
      } catch (err) {
        console.log("Master sync error:", err.message);
      }
    });

    // --- TASK 2: ONCE A DAY (The LinkedIn/JSearch Aggregator) ---
    nodeCron.schedule("0 0 * * *", async () => {
      console.log(" Midnight Sync: JSearch Aggregator...");
      try {
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
