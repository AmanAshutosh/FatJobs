const express = require("express");
const router = express.Router();
const Job = require("../models/Job");
const { scrapeJobs } = require("../services/scraperService");

// 1. MANUAL SYNC TRIGGER
router.get("/sync", async (req, res) => {
  try {
    scrapeJobs(); // Runs in background
    return res.status(202).json({
      success: true,
      message: "SYNC_SEQUENCE_STARTED",
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error(">>> [CRITICAL] SYNC_TRIGGER_ERROR:", err);
    return res
      .status(500)
      .json({ success: false, error: "INTERNAL_SYNC_FAILURE" });
  }
});

// 2. FETCH JOBS (WITH TIME & CATEGORY FILTERS)
router.get("/jobs", async (req, res) => {
  try {
    const { category, hours, role, workMode } = req.query;
    let query = {};

    // --- NEW: FRESHNESS FILTER (72, 48, 24) ---
    if (hours) {
      const cutoff = new Date();
      cutoff.setHours(cutoff.getHours() - parseInt(hours));
      query.postedAt = { $gte: cutoff };
    }

    // --- ROLE FILTER (Intern, Entry, Experienced) ---
    if (role) {
      query.role = { $regex: new RegExp(`^${role}$`, "i") };
    }

    // --- WORK MODE FILTER (Remote, Hybrid, WFO) ---
    if (workMode) {
      query.workMode = { $regex: new RegExp(`^${workMode}$`, "i") };
    }

    // --- CATEGORY FILTER ---
    if (category) {
      query.category = { $regex: new RegExp(`^${category}$`, "i") };
    }

    const jobs = await Job.find(query)
      .sort({ postedAt: -1 }) // Newest first
      .limit(500)
      .lean();

    // Cache Busting Headers
    res.set({
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    });

    console.log(
      `[API] SUCCESS: Dispatched ${jobs.length} jobs for filters: ${JSON.stringify(req.query)}`,
    );
    return res.status(200).json(jobs);
  } catch (err) {
    console.error(">>> [ERROR] JOB_FETCH_EXCEPTION:", err.stack);
    return res
      .status(500)
      .json({ success: false, error: "DATA_RETRIEVAL_FAILED" });
  }
});

module.exports = router;
