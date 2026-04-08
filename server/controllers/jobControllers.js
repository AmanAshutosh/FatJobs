const Job = require("../models/Job");

exports.getJobs = async (req, res) => {
  try {
    const {
      category,
      q,
      workType,
      experience,
      hours = 72,
      limit = 100,
    } = req.query;

    // 1. DYNAMIC FRESHNESS (The Early Applicant Shield)
    const cutoff = new Date(Date.now() - parseInt(hours) * 60 * 60 * 1000);

    let query = {
      postedAt: { $gte: cutoff },
    };

    // 2. CATEGORY & WORK MODE
    if (category) query.category = { $regex: new RegExp(`^${category}$`, "i") };
    if (workType) query.workType = { $regex: new RegExp(workType, "i") };

    // 3. EXPERIENCE REGEX (Handles "0-2 years", "Intern", etc.)
    if (experience) {
      query.experience = { $regex: experience, $options: "i" };
    }

    // 4. THE SEARCH ENGINE (Keyword, Company, or Platform)
    if (q) {
      query.$or = [
        { title: { $regex: q, $options: "i" } },
        { company: { $regex: q, $options: "i" } },
        { platform: { $regex: q, $options: "i" } }, // Now searches your huge platform list
      ];
    }

    // 5. THE ECOSYSTEM FETCH (Lean & Fast)
    const jobs = await Job.find(query)
      .sort({ postedAt: -1 })
      .limit(parseInt(limit))
      .lean();

    // Cache headers to prevent unnecessary DB hits
    res.set("Cache-Control", "public, max-age=300");

    res.status(200).json(jobs);
  } catch (error) {
    console.error(">>> ECOSYSTEM_API_ERROR:", error.message);
    res.status(500).json({ success: false, error: "DATA_LAYER_FAILURE" });
  }
};
