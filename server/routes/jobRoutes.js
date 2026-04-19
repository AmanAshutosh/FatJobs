const express = require("express");
const router  = express.Router();
const Job     = require("../models/Job");
const { scrapeJobs }                  = require("../services/scraperService");
const { getStatusColor, getTimeCategory } = require("../utils/classifier");

// ── Output schema transform ──────────────────────────────────────────────────
// Converts a raw DB document into the unified public schema.

function toOutputSchema(job) {
  const statusColor   = getStatusColor(job.postedAt);
  const timeCategory  = getTimeCategory(job.postedAt);

  // Resolve level → category for unified output schema
  // If it's a DA deck job, category is always "DA"
  // Otherwise category mirrors level (Intern / Fresher / SDE-1 / SDE-2+)
  const outputCategory = job.category === "DA"
    ? "DA"
    : (job.level || "SDE-1");

  return {
    // ── New unified schema fields ──────────────────────────────────────
    jobId:          job.jobId        || job._id,
    title:          job.title,
    company:        job.company,
    logo:           job.logo         || "",
    location:       job.location     || "India",
    type:           job.type         || job.workType || "Onsite",
    applyUrl:       job.link,
    postedAt:       job.postedAt,
    category:       outputCategory,
    statusColor,                          // "GREEN" | "ORANGE" | "GREY"
    sourcePlatform: job.sourcePlatform || job.platform || "Direct",

    // ── Backward-compat fields (frontend still uses these) ────────────
    _id:            job._id,
    link:           job.link,
    platform:       job.sourcePlatform || job.platform || "Direct",
    workType:       job.type           || job.workType || "Onsite",
    experience:     job.experience     || "Not Specified",
    jobType:        job.jobType        || "experienced",
    level:          job.level          || "SDE-1",
    timeCategory,                         // "green" | "orange" | "grey"
    deck:           job.category,         // "SDE" | "DA"  (original routing field)
  };
}

// ── 1. MANUAL SYNC TRIGGER ───────────────────────────────────────────────────

router.get("/sync", async (req, res) => {
  try {
    scrapeJobs(); // non-blocking, runs in background
    return res.status(202).json({
      success:   true,
      message:   "MEGA_SYNC_STARTED",
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[SYNC] Trigger error:", err);
    return res.status(500).json({ success: false, error: "SYNC_TRIGGER_FAILED" });
  }
});

// ── 2. FETCH JOBS ─────────────────────────────────────────────────────────────
//
// Query params:
//   category  — "SDE" | "DA"              (deck routing, maps to DB `category`)
//   level     — "Intern" | "Fresher" | "SDE-1" | "SDE-2+" | "DA" | "Other"
//   jobType   — "fresher" | "intern" | "experienced" (legacy alias for level)
//   hours     — integer, default 168 (7 days)
//   workMode  — "Remote" | "Onsite" | "Hybrid"
//   source    — e.g. "LinkedIn", "Naukri", "Greenhouse"
//   q         — keyword search (title or company)
//   limit     — max results, default 500

router.get("/", async (req, res) => {
  try {
    const {
      category, level, jobType, workMode, source, q,
    } = req.query;
    const hours = parseInt(req.query.hours, 10) || 168;
    const limit = Math.min(parseInt(req.query.limit, 10) || 500, 1000);

    const cutoff = new Date(Date.now() - hours * 3_600_000);
    const query  = { postedAt: { $gte: cutoff } };

    // Deck routing (SDE / DA)
    if (category) {
      query.category = { $regex: new RegExp(`^${category}$`, "i") };

      // Default: exclude senior roles on the SDE deck unless caller explicitly asks for them
      if (category.toUpperCase() === "SDE" && !level && !jobType) {
        query.level = { $nin: ["SDE-2+", "Other"] };
      }
    }

    // Experience level — supports both new `level` and legacy `jobType`
    if (level) {
      query.level = { $regex: new RegExp(`^${level}$`, "i") };
    } else if (jobType) {
      // Query both `level` (new field) and `jobType` (legacy field) for backward compat
      const orClause =
        jobType === "fresher"
          ? [{ level: "Fresher" },  { jobType: "fresher" }]
          : jobType === "intern"
          ? [{ level: "Intern" },   { jobType: "intern" }]
          : [{ level: { $in: ["SDE-1", "SDE-2+", "DA", "Other"] } }, { jobType: "experienced" }];

      query.$and = [...(query.$and || []), { $or: orClause }];
    }

    // Work mode — use $and to avoid conflicting with keyword $or below
    if (workMode) {
      query.$and = [...(query.$and || []), {
        $or: [
          { type:     { $regex: new RegExp(workMode, "i") } },
          { workType: { $regex: new RegExp(workMode, "i") } },
        ],
      }];
    }

    // Source platform filter
    if (source) {
      query.sourcePlatform = { $regex: new RegExp(source, "i") };
    }

    // Keyword search — use $and to avoid conflicting with workMode $or above
    if (q) {
      const kw = { $regex: q, $options: "i" };
      query.$and = [...(query.$and || []), {
        $or: [{ title: kw }, { company: kw }],
      }];
    }

    const raw  = await Job.find(query).sort({ postedAt: -1 }).limit(limit).lean();
    const jobs = raw.map(toOutputSchema);

    res.set({
      "Cache-Control": "no-store, no-cache, must-revalidate",
      Pragma:          "no-cache",
      Expires:         "0",
    });

    console.log(`[API] ${jobs.length} jobs dispatched | ${JSON.stringify(req.query)}`);
    return res.status(200).json(jobs);

  } catch (err) {
    console.error("[API] Fetch error:", err.stack);
    return res.status(500).json({ success: false, error: "DATA_RETRIEVAL_FAILED" });
  }
});

// ── 3. SINGLE JOB BY ID ───────────────────────────────────────────────────────

router.get("/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).lean();
    if (!job) return res.status(404).json({ success: false, error: "JOB_NOT_FOUND" });
    return res.status(200).json(toOutputSchema(job));
  } catch (err) {
    return res.status(500).json({ success: false, error: "LOOKUP_FAILED" });
  }
});

module.exports = router;
