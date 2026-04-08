const axios = require("axios");
const dayjs = require("dayjs");
const cheerio = require("cheerio");
const Job = require("../models/Job");

// ─── CONFIGURATION: THE ECOSYSTEM LISTS ────────────────────────────────────
const TARGETS = {
  greenhouse: [
    { name: "Binance", slug: "binance" },
    { name: "Razorpay", slug: "razorpay" },
    { name: "Zepto", slug: "zepto" },
    { name: "Zomato", slug: "zomato" },
    { name: "Blinkit", slug: "blinkit" },
    { name: "Swiggy", slug: "swiggy" },
    { name: "Groww", slug: "groww" },
    { name: "PhonePe", slug: "phonepe" },
    { name: "Vercel", slug: "vercel" },
    { name: "Notion", slug: "notion" },
    { name: "Figma", slug: "figma" },
    { name: "Polygon", slug: "polygon" },
  ],
  lever: [
    { name: "Postman", slug: "postman" },
    { name: "BrowserStack", slug: "browserstack" },
    { name: "CRED", slug: "cred" },
    { name: "Chargebee", slug: "chargebee" },
    { name: "Innovaccer", slug: "innovaccer" },
  ],
};

// ─── HELPERS: DATA SANITIZATION ───────────────────────────────────────────
const getStrictCategory = (title) => {
  const name = title.toLowerCase();
  const daKeywords = [
    "data",
    "analyst",
    "bi",
    "intelligence",
    "tableau",
    "analytics",
    "sql",
  ];
  return daKeywords.some((kw) => name.includes(kw)) ? "DA" : "SDE";
};

// ─── STEALTH HEADERS (To avoid Blacklisting) ──────────────────────────────
const getStealthHeaders = () => ({
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
  "Accept-Language": "en-US,en;q=0.9",
  Referer: "https://www.google.com/",
});

// ─── SOURCE: ATS (Lever/Greenhouse) ─────────────────────────────────────────
const fetchATS = async (type, companies) => {
  let allJobs = [];
  for (const company of companies) {
    try {
      const url =
        type === "lever"
          ? `https://api.lever.co/v0/postings/${company.slug}?mode=json`
          : `https://boards-api.greenhouse.io/v1/boards/${company.slug}/jobs`;

      // Adding a 500ms delay to be polite to the APIs
      await new Promise((r) => setTimeout(r, 500));

      const { data } = await axios.get(url, { headers: getStealthHeaders() });
      const rawJobs = type === "lever" ? data : data.jobs;

      const mapped = rawJobs
        .map((j) => {
          const title = j.text || j.title;
          // Strict Filter: Only keep SDE/DA
          if (
            !title.toLowerCase().includes("engineer") &&
            !title.toLowerCase().includes("analyst")
          )
            return null;

          return {
            title,
            company: company.name,
            link: j.applyUrl || j.absolute_url,
            platform: "Direct", // Tagged as Direct for the Trump Cards
            category: getStrictCategory(title),
            postedAt: new Date(j.createdAt || j.updated_at || Date.now()),
            workType: j.location?.name?.toLowerCase().includes("remote")
              ? "Remote"
              : "On-site",
          };
        })
        .filter(Boolean);

      allJobs.push(...mapped);
      console.log(`📡 Synced ${mapped.length} jobs from ${company.name}`);
    } catch (e) {
      console.error(`⚠️ Failed to sync ${company.name}: ${e.message}`);
    }
  }
  return allJobs;
};

// ─── MASTER SYNC ENGINE ─────────────────────────────────────────────────────
const runMasterScraper = async () => {
  console.log("🏁 FATJOBS ECOSYSTEM: Initializing Global Sync...");

  try {
    const results = await Promise.all([
      fetchATS("lever", TARGETS.lever),
      fetchATS("greenhouse", TARGETS.greenhouse),
    ]);

    const allJobs = results.flat();
    let newCount = 0;

    for (const job of allJobs) {
      try {
        // FindOneAndUpdate with upsert ensures NO DUPLICATES based on the link
        const res = await Job.findOneAndUpdate(
          { link: job.link },
          { $set: job },
          { upsert: true, rawResult: true },
        );

        // Check if it was a new document
        if (!res.lastErrorObject.updatedExisting) {
          newCount++;
        }
      } catch (e) {
        // Silently skip duplicates or DB errors
      }
    }

    console.log(
      `✅ SYNC COMPLETE: ${newCount} New Early Applicant roles added.`,
    );
    return newCount;
  } catch (err) {
    console.error("❌ MASTER SCRAPER CRITICAL FAILURE:", err);
  }
};

module.exports = { runMasterScraper };
