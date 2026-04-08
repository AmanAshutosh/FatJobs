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

// 2. FETCH JOBS (WITH TIME, SEARCH, & FILTERS)
router.get("/", async (req, res) => {
  try {
    const { category, hours, role, workMode, q } = req.query;
    let query = {};

    // --- 1. FRESHNESS FILTER (Default to 72h if not specified) ---
    const lookbackHours = hours ? parseInt(hours) : 72;
    const cutoff = new Date();
    cutoff.setHours(cutoff.getHours() - lookbackHours);
    query.postedAt = { $gte: cutoff };

    // --- 2. KEYWORD SEARCH (Title or Company) ---
    if (q) {
      query.$or = [
        { title: { $regex: q, $options: "i" } },
        { company: { $regex: q, $options: "i" } },
      ];
    }

    // --- 3. ROLE FILTER ---
    if (role) {
      query.experience = { $regex: new RegExp(role, "i") };
    }

    // --- 4. WORK MODE FILTER ---
    if (workMode) {
      query.workType = { $regex: new RegExp(workMode, "i") };
    }

    // --- 5. CATEGORY FILTER ---
    if (category) {
      query.category = { $regex: new RegExp(`^${category}$`, "i") };
    }

    const jobs = await Job.find(query)
      .sort({ postedAt: -1 }) // Newest first
      .limit(500)
      .lean();

    // Cache Busting Headers for Production
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
