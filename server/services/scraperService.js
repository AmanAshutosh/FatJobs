const axios = require("axios");
const Job = require("../models/Job");

const JSEARCH_API_KEY = process.env.JSEARCH_API_KEY;

// --- REGEX HELPERS ---
const ALLOWED_ROLES =
  /(software|sde|frontend|backend|fullstack|data\s*analyst|analytics|scientist|developer|react|node|android|ios|python|java|staff|principal|intern|fresher|graduate|associate|junior)/i;
const BANNED_KEYWORDS =
  /\b(mis|officer|sales|relationship|trainee|support|hr|marketing|operations|finance|accountant|executive|call\s*center|bpo)\b/i;

const isStrictTechRole = (title) => {
  if (!title) return false;
  const t = title.toLowerCase();
  return ALLOWED_ROLES.test(t) && !BANNED_KEYWORDS.test(t);
};

const extractExactExp = (text) => {
  if (!text) return "Not Specified";
  const match = text.match(/(\d+\s*(?:\+|-|to)?\s*\d*\s*years?)/i);
  return match ? match[0].trim() : "Not Specified";
};

const upsertJob = async (link, data) => {
  try {
    // We use 'link' as the unique identifier to prevent duplicates
    await Job.findOneAndUpdate({ link }, data, { upsert: true });
  } catch (err) {
    console.error(`DB Error for ${data.company}:`, err.message);
  }
};

// --- THE MASTER LIST (Greenhouse) ---
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
  "delhivery",
  "inmobi",
  "paytm",
  "ola",
  "oyo",
  "flipkart",
  "phonepe",
  "meesho",
  "lenskart",
  "ofbusiness",
  "icertis",
  "chargebee",
  "freshworks",
  "zoho",
  "browserstack",
  "innovaccer",
  "pinelabs",
  "digit",
  "policybazaar",
  "nykaa",
  "xpreesbees",
  "elasticrun",
  "dealshare",
  "jumbotail",
  "bigbasket",
  "snapdeal",
  "cars24",
  "physicswallah",
  "vedantu",
  "upgrad",
  "eruditus",
  "apna",
  "udaan",
  "inframarket",
  "livspace",
  "nobroker",
  "magicbricks",
  "mobikwik",
  "open",
  "onecard",
  "moneyview",
  "dhan",
  "netradyne",
  "porter",
  "rapido",
  "darwinbox",
  "khatabook",
  "credavenue",
  "perfios",
  "blackbuck",
  "github",
  "gitlab",
  "atlassian",
  "twilio",
  "cloudflare",
  "datadog",
  "snowflake",
  "salesforce",
  "adobe",
  "oracle",
  "sap",
  "vmware",
  "nvidia",
  "intel",
  "notion",
  "figma",
  "canva",
  "vercel",
  "supabase",
  "hashicorp",
  "confluent",
  "elastic",
  "paypal",
  "square",
  "wise",
  "robinhood",
];

const scrapeGreenhouse = async () => {
  console.log("🟢 [SCRAPER] Starting Greenhouse Boards...");
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

        await upsertJob(j.absolute_url.split("?")[0] + "#app", {
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
        });
      }
    } catch (e) {
      // console.log(`⚠️ Skipping ${company}`);
    }
  }
};

const scrapeJSearch = async () => {
  if (!JSEARCH_API_KEY) {
    console.log("🟡 [SCRAPER] JSearch Key Missing. Skipping...");
    return;
  }
  try {
    const res = await axios.get("https://jsearch.p.rapidapi.com/search", {
      params: {
        query: "Software Engineer Data Analyst India",
        date_posted: "3days", // Let's keep it to 3 days to match your 72hr rule
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
      await upsertJob(j.job_apply_link, {
        title: j.job_title,
        company: j.employer_name?.toUpperCase() || "TECH_CORP",
        link: j.job_apply_link,
        platform: j.job_publisher || "Aggregator",
        category: /analyst|data|science|analytics|bi\s/i.test(j.job_title)
          ? "DA"
          : "SDE",
        experience: extractExactExp(j.job_description),
        workType: j.job_is_remote ? "Remote" : "On-site",
        location: j.job_city || "India",
        postedAt: new Date(j.job_posted_at_datetime_utc || Date.now()),
      });
    }
  } catch (e) {
    console.error("🔴 [SCRAPER] JSearch API Limit reached or Error.");
  }
};

const scrapeJobs = async () => {
  console.log("🚀 [SYSTEM] MEGA-SYNC STARTING...");
  await scrapeGreenhouse();
  await scrapeJSearch();

  // Cleanup: Delete anything older than 14 days to keep DB fresh
  const cutoff = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
  const deleted = await Job.deleteMany({ postedAt: { $lt: cutoff } });

  console.log(
    `🏁 [SYSTEM] MEGA-SYNC COMPLETE. Cleaned ${deleted.deletedCount} old roles.`,
  );
};

module.exports = { scrapeJobs, scrapeGreenhouse, scrapeJSearch };
