require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const nodeCron = require("node-cron");

// --- 1. IMPORT ROUTES ---
const jobRoutes = require("./routes/jobRoutes");
const authRoutes = require("./routes/authRoutes");

// --- 2. IMPORT MASTER SCRAPERS ---
// Ensure these names match EXACTLY what is in module.exports in scraperService.js
const scraperService = require("./services/scraperService");

const app = express();
const PORT = process.env.PORT || 5000;

// --- 3. MIDDLEWARE ---
app.use(cors({ origin: "*", methods: ["GET", "POST"] }));
app.use(express.json());

// --- 4. HEALTH CHECK ---
app.get("/", (req, res) => res.status(200).send("FatJobs Backend: Active"));

// --- 5. API ROUTE MAPPING ---
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);

// --- 6. CRON JOBS (Defined separately to prevent startup crashes) ---
const initCrons = () => {
  // 2-Hour Sync
  nodeCron.schedule("0 */2 * * *", async () => {
    console.log("[CRON] starting 120-min sync...");
    try {
      if (scraperService.scrapeJobs) await scraperService.scrapeJobs();
    } catch (err) {
      console.error("[CRON] scrapeJobs error:", err.message);
    }
  });

  // Midnight Sync
  nodeCron.schedule("0 0 * * *", async () => {
    console.log("[CRON] starting midnight aggregate...");
    try {
      if (scraperService.scrapeJSearch) await scraperService.scrapeJSearch();
    } catch (err) {
      console.error("[CRON] JSearch error:", err.message);
    }
  });
};

// --- 7. DB CONNECTION & START ---
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("[SYSTEM] MongoDB connected");
    initCrons(); // Start crons only after DB is up
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`[SYSTEM] Server on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("[CRITICAL] Connection failed:", err.message);
    process.exit(1);
  });
