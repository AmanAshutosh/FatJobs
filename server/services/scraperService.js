const axios = require("axios");
const Job = require("../models/Job");

const JSEARCH_API_KEY = process.env.JSEARCH_API_KEY;

// 1. IMPROVED FILTERS: Added intern, fresher, junior, and associate
// BROADENED: Added intern, graduate, and fresher to catch LinkedIn's entry-level roles
const ALLOWED_ROLES =
  /(software|sde|frontend|backend|fullstack|data\s*analyst|analytics|scientist|developer|react|node|android|ios|python|java|staff|principal|intern|fresher|graduate|associate|junior)/i;
const BANNED_KEYWORDS =
  /\b(mis|officer|sales|relationship|trainee|support|hr|marketing|operations|finance|accountant|executive|call\s*center|bpo)\b/i;

const isStrictTechRole = (title) => {
  if (!title) return false;
  const t = title.toLowerCase();
  // Filter: Must be an allowed role but NOT contain banned keywords
  return ALLOWED_ROLES.test(t) && !BANNED_KEYWORDS.test(t);
};

const extractExactExp = (text) => {
  if (!text) return "Not Specified";
  const match = text.match(/(\d+\s*(?:\+|-|to)?\s*\d*\s*years?)/i);
  return match ? match[0].trim() : "Not Specified";
};

const upsertJob = async (link, data) => {
  try {
    await Job.findOneAndUpdate({ link }, data, {
      upsert: true,
      returnDocument: "after",
    });
  } catch (err) {
    console.error(`DB Error for ${data.company}:`, err.message);
  }
};

// 3. EXPANDED GREENHOUSE LIST (Unlimited Free Data)
const GREENHOUSE_COMPANIES = [
  "binance",
  "razorpay",
  "groww",
  "slice",
  "coinbase",
  "stripe",
  "clari",
  "dotpe",
  "jupiter",
  "meesho",
  "zepto",
  "blinkit",
  "phonepe",
  "zomato",
  "swiggy",
  "unacademy",
  "upstox",
  "urbancompany",
  "airtel",
  "cred",
  "curefit",
  "dream11",
  "games24x7",
  "postman",
  "nykaa",
  "delivery",
  "inmobi",
  "paytm",
  "ola",
  "oyo",
];

const scrapeGreenhouse = async () => {
  console.log("🟢 Starting Greenhouse Scrape...");
  for (const company of GREENHOUSE_COMPANIES) {
    try {
      const res = await axios.get(
        `https://boards-api.greenhouse.io/v1/boards/${company}/jobs?content=true`,
        { timeout: 10000 },
      );
      const jobs = res.data.jobs || [];

      for (const j of jobs) {
        if (!isStrictTechRole(j.title)) continue;

        const content = (j.title + " " + (j.content || "")).toLowerCase();
        const jobData = {
          title: j.title,
          company: company.toUpperCase(),
          link: j.absolute_url.split("?")[0] + "#app",
          platform: "Direct",
          category: /analyst|data|science|analytics|bi\s/i.test(j.title)
            ? "DA"
            : "SDE",
          experience: extractExactExp(content),
          workType: /remote|wfh|hybrid/i.test(content)
            ? "Remote/Hybrid"
            : "On-site",
          location: j.location?.name || "India",
          postedAt: new Date(j.updated_at || j.first_published || Date.now()),
        };

        await upsertJob(jobData.link, jobData);
      }
    } catch (e) {
      console.log(`⚠️ Skipping ${company}: Board unreachable.`);
    }
  }
};

// 4. JSEARCH SOURCE (Limited API - Used Strategically)
const scrapeJSearch = async () => {
  if (!JSEARCH_API_KEY) return;

  // We cycle through queries to get variety without burning credits
  const query = "Software Engineer Data Analyst Freshers India";
  console.log(`🔵 Starting JSearch Strategic Scrape...`);

  try {
    const res = await axios.get("https://jsearch.p.rapidapi.com/search", {
      params: {
        query: query,
        page: "1",
        num_pages: "1",
        date_posted: "week", // Changed to week to get more volume
      },
      headers: {
        "X-RapidAPI-Key": JSEARCH_API_KEY,
        "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
      },
      timeout: 15000,
    });

    const jobs = res.data?.data || [];
    for (const j of jobs) {
      if (!isStrictTechRole(j.job_title)) continue;

      const jobData = {
        title: j.job_title,
        company: j.employer_name?.toUpperCase() || "TECH_CORP",
        link: j.job_apply_link,
        platform: j.job_publisher || "LinkedIn",
        category: /analyst|data|science|analytics|bi\s/i.test(j.job_title)
          ? "DA"
          : "SDE",
        experience: extractExactExp(j.job_description),
        workType: j.job_is_remote ? "Remote" : "On-site",
        location: j.job_city || "India",
        postedAt: new Date(j.job_posted_at_datetime_utc || Date.now()),
      };

      await upsertJob(jobData.link, jobData);
    }
  } catch (e) {
    console.error("🔴 JSearch Error: API Limit reached.");
  }
};

const scrapeJobs = async () => {
  console.log("🚀 [SYSTEM] MEGA-SYNC STARTING...");
  try {
    await scrapeGreenhouse();
    await scrapeJSearch();

    // Retention: 14 Days (Keep the DB fresh)
    const cutoff = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
    const deleted = await Job.deleteMany({ postedAt: { $lt: cutoff } });
    console.log(`🧹 Cleanup: Removed ${deleted.deletedCount} old jobs.`);
    console.log("🏁 [SYSTEM] MEGA-SYNC COMPLETE.");
  } catch (err) {
    console.error("❌ MASTER SYNC FAILED:", err.message);
  }
};

module.exports = { scrapeJobs };
module.exports = { scrapeGreenhouse };
module.exports = { scrapeJSearch };