const axios = require("axios");
const Job = require("../models/Job");

const JSEARCH_API_KEY = process.env.JSEARCH_API_KEY;

// 1. FILTERS (Strict Tech Only)
const ALLOWED_ROLES =
  /\b(software\s*engineer|sde|frontend|backend|fullstack|data\s*analyst|analytics|business\s*analyst|bi\s*analyst|data\s*scientist|web\s*developer|react\s*developer|java\s*developer|python\s*developer)\b/i;
const BANNED_KEYWORDS =
  /\b(mis|officer|sales|relationship|trainee|graduate|intern|support|hr|marketing|operations|finance|accountant|executive|call\s*center|bpo)\b/i;

const isStrictTechRole = (title) => {
  if (!title) return false;
  const t = title.toLowerCase();
  return ALLOWED_ROLES.test(t) && !BANNED_KEYWORDS.test(t);
};

// 2. DATA EXTRACTION
const extractExactExp = (text) => {
  if (!text) return "Not Specified";
  const match = text.match(/(\d+\s*(?:\+|-|to)?\s*\d*\s*years?)/i);
  return match ? match[0].trim() : "Not Specified";
};

// 3. SOURCE: Greenhouse (Direct Company Boards)
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
];

const scrapeGreenhouse = async () => {
  const allResults = [];
  await Promise.all(
    GREENHOUSE_COMPANIES.map(async (company) => {
      try {
        const res = await axios.get(
          `https://boards-api.greenhouse.io/v1/boards/${company}/jobs?content=true`,
          { timeout: 10000 },
        );
        const jobs = res.data.jobs || [];
        jobs.forEach((j) => {
          if (!isStrictTechRole(j.title)) return;
          const content = (j.title + " " + j.content).toLowerCase();

          allResults.push({
            link: j.absolute_url.split("?")[0] + "#app",
            data: {
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
              postedAt: new Date(j.updated_at || j.first_published),
            },
          });
        });
      } catch (e) {
        /* ignore individual company failures */
      }
    }),
  );

  // Sequential Save to prevent DuplicateKey errors in MongoDB
  for (const item of allResults) {
    try {
      await Job.findOneAndUpdate({ link: item.link }, item.data, {
        upsert: true,
      });
    } catch (err) {
      /* ignore collision */
    }
  }
};

// 4. SOURCE: JSearch (LinkedIn, Indeed, etc.)
const JSEARCH_QUERIES = [
  "Software Engineer jobs at PhonePe CRED Zomato Swiggy Nykaa India",
  "Data Analyst jobs at Zoho Freshworks Chargebee InMobi India",
  "SDE jobs Goldman Sachs JPMorgan Walmart Amazon India",
  "SDE Data Analyst TCS Infosys Wipro HCL Accenture India",
  "Business Analyst and Data Scientist jobs India",
];

const scrapeJSearch = async () => {
  if (!JSEARCH_API_KEY) return;
  const allResults = [];
  await Promise.all(
    JSEARCH_QUERIES.map(async (query) => {
      try {
        const res = await axios.get("https://jsearch.p.rapidapi.com/search", {
          params: { query, page: "1", num_pages: "4", date_posted: "all" },
          headers: {
            "X-RapidAPI-Key": JSEARCH_API_KEY,
            "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
          },
          timeout: 15000,
        });

        (res.data?.data || []).forEach((j) => {
          if (!isStrictTechRole(j.job_title)) return;
          const content = (
            j.job_title +
            " " +
            (j.job_description || "")
          ).toLowerCase();

          allResults.push({
            link: j.job_apply_link,
            data: {
              title: j.job_title,
              company: j.employer_name?.toUpperCase() || "TECH_CORP",
              link: j.job_apply_link,
              platform: j.job_publisher || "LinkedIn",
              category: /analyst|data|science|analytics|bi\s/i.test(j.job_title)
                ? "DA"
                : "SDE",
              experience: extractExactExp(content),
              workType: j.job_is_remote ? "Remote" : "On-site",
              location: j.job_city || "India",
              postedAt: new Date(j.job_posted_at_datetime_utc || Date.now()),
            },
          });
        });
      } catch (e) {
        console.error("JSearch Block Failed for query: " + query);
      }
    }),
  );

  for (const item of allResults) {
    try {
      await Job.findOneAndUpdate({ link: item.link }, item.data, {
        upsert: true,
      });
    } catch (err) {
      /* ignore collision */
    }
  }
};

// 5. MASTER SYNC
const scrapeJobs = async () => {
  console.log(">>> [SYSTEM] MEGA-SYNC STARTING (Binance + 50 Companies)...");

  // Scrape fast
  await scrapeGreenhouse();
  await scrapeJSearch();

  // Step 2: Clean up old jobs (7-day retention)
  const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  await Job.deleteMany({ postedAt: { $lt: cutoff } });

  console.log(">>> [SYSTEM] MEGA-SYNC COMPLETE.");
};

module.exports = { scrapeJobs };
