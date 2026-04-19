const express = require("express");
const router = express.Router();
const Job = require("../models/Job");
const { scrapeJobs } = require("../services/scraperService");

// Compute time category based on postedAt
const getTimeCategory = (postedAt) => {
  const diffHours = (Date.now() - new Date(postedAt).getTime()) / (1000 * 60 * 60);
  if (diffHours <= 24) return "green";
  if (diffHours <= 48) return "orange";
  return "grey";
};

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
    return res.status(500).json({ success: false, error: "INTERNAL_SYNC_FAILURE" });
  }
});

// 2. FETCH JOBS (with time, search, category, jobType, workMode filters)
router.get("/", async (req, res) => {
  try {
    const { category, hours, jobType, workMode, q } = req.query;
    let query = {};

    // Freshness filter — default 168h (7 days)
    const lookbackHours = hours ? parseInt(hours) : 168;
    const cutoff = new Date();
    cutoff.setHours(cutoff.getHours() - lookbackHours);
    query.postedAt = { $gte: cutoff };

    // Keyword search
    if (q) {
      query.$or = [
        { title: { $regex: q, $options: "i" } },
        { company: { $regex: q, $options: "i" } },
      ];
    }

    // Category filter (SDE / DA)
    if (category) {
      query.category = { $regex: new RegExp(`^${category}$`, "i") };
    }

    // Job type filter (fresher / intern / experienced)
    if (jobType) {
      query.jobType = { $regex: new RegExp(`^${jobType}$`, "i") };
    }

    // Work mode filter
    if (workMode) {
      query.workType = { $regex: new RegExp(workMode, "i") };
    }

    const jobs = await Job.find(query)
      .sort({ postedAt: -1 })
      .limit(500)
      .lean();

    // Attach timeCategory to each job
    const enriched = jobs.map((job) => ({
      ...job,
      timeCategory: getTimeCategory(job.postedAt),
    }));

    res.set({
      "Cache-Control": "no-store, no-cache, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    });

    console.log(`[API] Dispatched ${enriched.length} jobs | filters: ${JSON.stringify(req.query)}`);
    return res.status(200).json(enriched);
  } catch (err) {
    console.error(">>> [ERROR] JOB_FETCH_EXCEPTION:", err.stack);
    return res.status(500).json({ success: false, error: "DATA_RETRIEVAL_FAILED" });
  }
});

module.exports = router;
