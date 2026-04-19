const axios = require("axios");
const Job = require("../models/Job");

const JSEARCH_API_KEY = process.env.JSEARCH_API_KEY;

// --- REGEX HELPERS ---
const ALLOWED_ROLES =
  /(software|sde|frontend|backend|fullstack|data\s*analyst|analytics|scientist|developer|react|node|android|ios|python|java|staff|principal|intern|fresher|graduate|associate|junior)/i;
const BANNED_KEYWORDS =
  /\b(mis|officer|sales|relationship|support|hr|marketing|operations|finance|accountant|executive|call\s*center|bpo)\b/i;

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

// Classify job as fresher / intern / experienced
const classifyJobType = (title, content, experience) => {
  const text = (title + " " + (content || "")).toLowerCase();
  if (/intern(ship)?/i.test(text)) return "intern";
  if (
    /fresher|fresh\s*graduate|entry[\s-]?level|no\s*experience|0[\s-]*1\s*years?|graduate\s*hire|campus\s*hire|trainee/i.test(
      text
    )
  )
    return "fresher";
  if (/junior|associate/i.test(text) && /0|1|2\s*years?/i.test(experience))
    return "fresher";
  if (/0\s*-\s*[12]\s*years?/i.test(experience)) return "fresher";
  return "experienced";
};

const upsertJob = async (link, data) => {
  try {
    await Job.findOneAndUpdate({ link }, data, { upsert: true, new: true });
  } catch (err) {
    if (err.code !== 11000) console.error(`DB Error for ${data.company}:`, err.message);
  }
};

// 7-day cutoff — only fetch/store jobs posted within last 7 days
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
const isWithin7Days = (dateStr) => {
  if (!dateStr) return false;
  const posted = new Date(dateStr).getTime();
  return Date.now() - posted <= SEVEN_DAYS_MS;
};

// --- GREENHOUSE BOARDS (136 companies, no API key needed) ---
const GREENHOUSE_COMPANIES = [
  "binance", "razorpay", "groww", "slice", "coinbase", "stripe", "clari",
  "dotpe", "jupiter", "meesho", "zepto", "blinkit", "phonepe", "zomato",
  "swiggy", "unacademy", "upstox", "urbancompany", "airtel", "cred",
  "curefit", "dream11", "games24x7", "postman", "nykaa", "delhivery",
  "inmobi", "paytm", "ola", "oyo", "flipkart", "lenskart", "ofbusiness",
  "icertis", "chargebee", "freshworks", "zoho", "browserstack", "innovaccer",
  "pinelabs", "digit", "policybazaar", "xpreesbees", "elasticrun", "dealshare",
  "jumbotail", "bigbasket", "snapdeal", "cars24", "physicswallah", "vedantu",
  "upgrad", "eruditus", "apna", "udaan", "inframarket", "livspace", "nobroker",
  "magicbricks", "mobikwik", "open", "onecard", "moneyview", "dhan",
  "netradyne", "porter", "rapido", "darwinbox", "khatabook", "credavenue",
  "perfios", "blackbuck", "github", "gitlab", "atlassian", "twilio",
  "cloudflare", "datadog", "snowflake", "salesforce", "adobe", "oracle",
  "sap", "vmware", "nvidia", "intel", "notion", "figma", "canva", "vercel",
  "supabase", "hashicorp", "confluent", "elastic", "paypal", "square", "wise",
  "robinhood",
];

const scrapeGreenhouse = async () => {
  console.log("🟢 [SCRAPER] Starting Greenhouse Boards...");
  for (const company of GREENHOUSE_COMPANIES) {
    try {
      const res = await axios.get(
        `https://boards-api.greenhouse.io/v1/boards/${company}/jobs?content=true`,
        { timeout: 10000 }
      );
      const jobs = res.data.jobs || [];
      for (const j of jobs) {
        if (!isStrictTechRole(j.title)) continue;
        if (!isWithin7Days(j.updated_at || j.first_published)) continue;

        const content = (j.content || "").toLowerCase();
        const exp = extractExactExp(j.title + " " + content);

        await upsertJob(j.absolute_url.split("?")[0] + "#app", {
          title: j.title,
          company: company.toUpperCase(),
          link: j.absolute_url.split("?")[0] + "#app",
          platform: "Direct",
          category: /analyst|data|science|analytics|bi\s/i.test(j.title) ? "DA" : "SDE",
          jobType: classifyJobType(j.title, content, exp),
          experience: exp,
          workType: /remote|wfh|hybrid/i.test(content) ? "Remote/Hybrid" : "On-site",
          location: j.location?.name || "India",
          postedAt: new Date(j.updated_at || j.first_published || Date.now()),
        });
      }
    } catch (e) {
      // Silently skip unavailable boards
    }
  }
  console.log("✅ [SCRAPER] Greenhouse done.");
};

// --- REMOTIVE API (free, no key required — remote tech jobs) ---
const scrapeRemotive = async () => {
  console.log("🔵 [SCRAPER] Starting Remotive...");
  try {
    const categories = ["software-dev", "data"];
    for (const cat of categories) {
      const res = await axios.get(
        `https://remotive.com/api/remote-jobs?category=${cat}&limit=50`,
        { timeout: 15000 }
      );
      const jobs = res.data?.jobs || [];
      for (const j of jobs) {
        if (!isStrictTechRole(j.title)) continue;
        if (!isWithin7Days(j.publication_date)) continue;

        const content = (j.description || "").toLowerCase();
        const exp = extractExactExp(j.title + " " + content);

        await upsertJob(j.url, {
          title: j.title,
          company: (j.company_name || "TECH_CORP").toUpperCase(),
          link: j.url,
          platform: "Remotive",
          category: /analyst|data|science|analytics/i.test(j.title) ? "DA" : "SDE",
          jobType: classifyJobType(j.title, content, exp),
          experience: exp,
          workType: "Remote",
          location: j.candidate_required_location || "Worldwide",
          postedAt: new Date(j.publication_date || Date.now()),
        });
      }
    }
    console.log("✅ [SCRAPER] Remotive done.");
  } catch (e) {
    console.error("🟡 [SCRAPER] Remotive error:", e.message);
  }
};

// --- LINKEDIN GUEST API (semi-public, no auth required) ---
const scrapeLinkedIn = async () => {
  console.log("🔷 [SCRAPER] Starting LinkedIn Guest...");
  const queries = [
    { keywords: "software+engineer+fresher", f_E: "1,2" },   // Entry level
    { keywords: "software+developer+intern", f_JT: "I" },     // Internship
    { keywords: "software+engineer+india", f_E: "3,4" },      // Mid-senior
    { keywords: "data+analyst+india", f_E: "1,2,3" },         // DA all levels
  ];

  for (const q of queries) {
    try {
      const params = new URLSearchParams({
        keywords: q.keywords.replace(/\+/g, " "),
        location: "India",
        f_TPR: "r604800", // Posted in last 7 days
        start: "0",
        ...(q.f_E && { f_E: q.f_E }),
        ...(q.f_JT && { f_JT: q.f_JT }),
      });

      const res = await axios.get(
        `https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?${params}`,
        {
          timeout: 12000,
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
            Accept: "text/html",
          },
        }
      );

      // Parse HTML response with basic regex (cheerio-free for performance)
      const html = res.data || "";
      const jobBlocks = html.split('<li class="');
      for (const block of jobBlocks.slice(1)) {
        try {
          const titleMatch = block.match(
            /class="base-search-card__title"[^>]*>\s*([^<]+)/
          );
          const companyMatch = block.match(
            /class="base-search-card__subtitle"[^>]*>[\s\S]*?<a[^>]*>\s*([^<]+)/
          );
          const locationMatch = block.match(
            /class="job-search-card__location"[^>]*>\s*([^<]+)/
          );
          const linkMatch = block.match(/href="(https:\/\/www\.linkedin\.com\/jobs\/view\/[^"?]+)/);
          const timeMatch = block.match(/datetime="([^"]+)"/);

          if (!titleMatch || !linkMatch) continue;

          const title = titleMatch[1].trim();
          const company = (companyMatch?.[1] || "COMPANY").trim().toUpperCase();
          const location = (locationMatch?.[1] || "India").trim();
          const link = linkMatch[1];
          const postedAt = timeMatch ? new Date(timeMatch[1]) : new Date();

          if (!isStrictTechRole(title)) continue;
          if (!isWithin7Days(postedAt)) continue;

          const exp = extractExactExp(title);
          const jType = q.f_JT === "I" ? "intern" : classifyJobType(title, "", exp);

          await upsertJob(link, {
            title,
            company,
            link,
            platform: "LinkedIn",
            category: /analyst|data|science|analytics/i.test(title) ? "DA" : "SDE",
            jobType: jType,
            experience: exp,
            workType: "On-site",
            location,
            postedAt,
          });
        } catch (_) {}
      }

      // Rate limit respect: 2s between LinkedIn requests
      await new Promise((r) => setTimeout(r, 2000));
    } catch (e) {
      console.log(`🟡 [SCRAPER] LinkedIn query skipped: ${e.message}`);
    }
  }
  console.log("✅ [SCRAPER] LinkedIn done.");
};

// --- JSEARCH API (RapidAPI) ---
const scrapeJSearch = async () => {
  if (!JSEARCH_API_KEY) {
    console.log("🟡 [SCRAPER] JSearch Key Missing. Skipping...");
    return;
  }
  try {
    const queries = [
      { q: "Software Engineer fresher entry level India", date_posted: "week" },
      { q: "Software Developer intern India", date_posted: "week" },
      { q: "Data Analyst India", date_posted: "week" },
    ];

    for (const query of queries) {
      const res = await axios.get("https://jsearch.p.rapidapi.com/search", {
        params: { query: query.q, date_posted: query.date_posted, num_pages: 1 },
        headers: {
          "X-RapidAPI-Key": JSEARCH_API_KEY,
          "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
        },
        timeout: 15000,
      });

      const jobs = res.data?.data || [];
      for (const j of jobs) {
        if (!isStrictTechRole(j.job_title)) continue;
        if (!isWithin7Days(j.job_posted_at_datetime_utc)) continue;

        const content = (j.job_description || "").toLowerCase();
        const exp = extractExactExp(j.job_title + " " + content);

        await upsertJob(j.job_apply_link, {
          title: j.job_title,
          company: (j.employer_name || "TECH_CORP").toUpperCase(),
          link: j.job_apply_link,
          platform: j.job_publisher || "JSearch",
          category: /analyst|data|science|analytics/i.test(j.job_title) ? "DA" : "SDE",
          jobType: classifyJobType(j.job_title, content, exp),
          experience: exp,
          workType: j.job_is_remote ? "Remote" : "On-site",
          location: j.job_city || j.job_country || "India",
          postedAt: new Date(j.job_posted_at_datetime_utc || Date.now()),
        });
      }
    }
    console.log("✅ [SCRAPER] JSearch done.");
  } catch (e) {
    console.error("🔴 [SCRAPER] JSearch error:", e.message);
  }
};

// --- MASTER SYNC ---
const scrapeJobs = async () => {
  console.log("🚀 [SYSTEM] MEGA-SYNC STARTING...");
  await scrapeGreenhouse();
  await scrapeRemotive();
  await scrapeLinkedIn();
  await scrapeJSearch();

  // Cleanup: delete jobs older than 7 days
  const cutoff = new Date(Date.now() - SEVEN_DAYS_MS);
  const deleted = await Job.deleteMany({ postedAt: { $lt: cutoff } });
  console.log(`🏁 [SYSTEM] SYNC COMPLETE. Cleaned ${deleted.deletedCount} expired roles.`);
};

module.exports = { scrapeJobs, scrapeGreenhouse, scrapeRemotive, scrapeLinkedIn, scrapeJSearch };
