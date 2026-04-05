const express = require("express");
const router = express.Router();
const Job = require("../models/Job");
const { scrapeJobs } = require("../services/scraperService");

/**
 * @route   GET /api/jobs/sync
 * @desc    Changed to GET so you can trigger it by visiting the URL in your browser.
 */
router.get("/sync", async (req, res) => {
  try {
    // Fire the scraper in the background
    scrapeJobs();

    res.status(202).json({
      success: true,
      message:
        "SYSTEM_SYNC_INITIALIZED: Check your terminal for progress logs.",
    });
  } catch (err) {
    console.error("SYNC_TRIGGER_ERROR:", err);
    res.status(500).json({ success: false, message: "SYNC_FAILED" });
  }
});

/**
 * @route   GET /api/jobs
 * @desc    Fetch fresh tech jobs with strict anti-cache headers
 */
router.get("/jobs", async (req, res) => {
  try {
    const { category } = req.query;

    // 1. RELAXED TIME GATE: Show jobs from the last 7 days.
    // If the deck is empty, the scraper might be finding "older" but valid listings.
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    let query = {
      // Look for jobs where postedAt is within the last 7 days OR exists
      $or: [
        { postedAt: { $gte: sevenDaysAgo } },
        { postedAt: { $exists: false } }, // Fallback for jobs with missing dates
      ],
    };

    // 2. CATEGORY FILTER (SDE or DA)
    if (category) {
      query.category = { $regex: new RegExp(`^${category}$`, "i") };
    }

    // 3. EXECUTE QUERY
    const jobs = await Job.find(query)
      .sort({ postedAt: -1, createdAt: -1 }) // Sort by post date first, then entry date
      .limit(500)
      .lean();

    // 4. BROWSER CACHE BUSTING
    // This ensures that when you click 'Back' or 'Refresh', you don't see old data.
    res.set({
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
      "Surrogate-Control": "no-store",
    });

    console.log(
      `[API] Served ${jobs.length} roles for category: ${category || "ALL"}`,
    );
    res.status(200).json(jobs);
  } catch (err) {
    console.error("FETCH_JOBS_ERROR:", err);
    res.status(500).json({ message: "PROTOCOL_ERROR: DATA_SYNC_FAILED" });
  }
});

module.exports = router;
