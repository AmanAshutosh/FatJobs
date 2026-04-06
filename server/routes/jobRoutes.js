const express = require("express");
const router = express.Router();
const Job = require("../models/Job");
const { scrapeJobs } = require("../services/scraperService");

/**
 * @route   GET /api/sync
 * @desc    Manual trigger for the scraper.
 * In production, we use GET so we can hit it via a Cron Monitoring tool.
 */
router.get("/sync", async (req, res) => {
  try {
    // Fire and forget - the scraper runs as a background process
    scrapeJobs();

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

/**
 * @route   GET /api/jobs
 * @desc    Fetch jobs with dynamic filtering, pagination-ready, and cache-busting.
 */
router.get("/jobs", async (req, res) => {
  try {
    const { category } = req.query;

    // 1. DYNAMIC QUERY BUILDING
    // We remove the 7-day restriction here.
    // The ScraperService already deletes jobs older than 14 days,
    // so we should show EVERYTHING currently in the database.
    let query = {};

    // 2. CASE-INSENSITIVE CATEGORY FILTERING
    if (category) {
      // Matches "SDE" or "sde" or "DA" or "da" exactly
      query.category = { $regex: new RegExp(`^${category}$`, "i") };
    }

    // 3. OPTIMIZED DATA FETCHING
    // Lean() makes the query 5x faster because it returns plain JS objects, not Mongoose documents.
    const jobs = await Job.find(query)
      .sort({ postedAt: -1, createdAt: -1 })
      .limit(500)
      .lean();

    // 4. STARTUP-GRADE CACHE HEADERS
    // Prevents browsers from showing stale data during rapid refreshes.
    res.set({
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    });

    // Logging for Railway monitoring
    console.log(
      `[API] SUCCESS: Dispatched ${jobs.length} jobs for ${category || "ALL_CATEGORIES"}`,
    );

    return res.status(200).json(jobs);
  } catch (err) {
    console.error(">>> [ERROR] JOB_FETCH_EXCEPTION:", err.stack);
    return res.status(500).json({
      success: false,
      error: "DATA_RETRIEVAL_FAILED",
      trace: process.env.NODE_ENV === "development" ? err.message : null,
    });
  }
});

module.exports = router;
