const axios = require("axios");
const dayjs = require("dayjs");
const cheerio = require("cheerio");
const Job = require("../models/Job");

// ─── HELPERS ────────────────────────────────────────────────────────────────
const isRecent = (date) => date && dayjs().diff(dayjs(date), "hour") <= 24;

// THE BOUNCER: This separates the decks
const getStrictCategory = (title) => {
  const name = title.toLowerCase();
  const daKeywords = [
    "data",
    "analyst",
    "bi",
    "intelligence",
    "tableau",
    "insights",
    "analytics",
    "sql",
  ];

  if (daKeywords.some((kw) => name.includes(kw))) {
    return "DA";
  }
  return "SDE";
};

// ─── SOURCE: LINKEDIN ───────────────────────────────────────────────────────
const fetchLinkedIn = async (searchKeyword) => {
  try {
    const url = `https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords=${encodeURIComponent(searchKeyword)}&location=India`;
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/119.0.0.0",
      },
    });
    const $ = cheerio.load(data);
    const jobs = [];

    $(".job-search-card").each((i, el) => {
      const title = $(el).find(".base-search-card__title").text().trim();
      const link = $(el)
        .find(".base-card__full-link")
        .attr("href")
        ?.split("?")[0];
      if (title && link) {
        jobs.push({
          title,
          company: $(el).find(".base-search-card__subtitle").text().trim(),
          link,
          platform: "LinkedIn",
          category: getStrictCategory(title),
          createdAt: new Date(),
        });
      }
    });
    return jobs;
  } catch (err) {
    return [];
  }
};

// ─── SOURCE: ATS (Lever/Greenhouse) ─────────────────────────────────────────
const fetchATS = async (type, companies) => {
  let allJobs = [];
  for (const company of companies) {
    try {
      const url =
        type === "lever"
          ? `https://api.lever.co/v0/postings/${company.slug}?mode=json`
          : `https://boards-api.greenhouse.io/v1/boards/${company.slug}/jobs`;

      const { data } = await axios.get(url);
      const rawJobs = type === "lever" ? data : data.jobs;

      const mapped = rawJobs.map((j) => {
        const title = j.text || j.title;
        return {
          title,
          company: company.name,
          link: j.applyUrl || j.absolute_url,
          platform: type.toUpperCase(),
          category: getStrictCategory(title),
          createdAt: new Date(j.createdAt || j.updated_at || Date.now()),
        };
      });
      allJobs.push(...mapped);
    } catch (e) {
      console.log(`Skipped ${company.name}`);
    }
  }
  return allJobs;
};

// ─── MASTER SYNC ENGINE ─────────────────────────────────────────────────────
const runMasterScraper = async () => {
  console.log("🏁 Starting Global Deck Sync...");

  const leverCos = [
    { name: "Netflix", slug: "netflix" },
    { name: "Figma", slug: "figma" },
    { name: "Databricks", slug: "databricks" },
  ];
  const ghCos = [
    { name: "Airbnb", slug: "airbnb" },
    { name: "Reddit", slug: "reddit" },
  ];

  const results = await Promise.all([
    fetchLinkedIn("Software Engineer"),
    fetchLinkedIn("Data Analyst"),
    fetchATS("lever", leverCos),
    fetchATS("greenhouse", ghCos),
  ]);

  const allJobs = results.flat();
  let newCount = 0;

  for (const job of allJobs) {
    try {
      // Use link as unique ID to prevent duplicates
      const res = await Job.findOneAndUpdate({ link: job.link }, job, {
        upsert: true,
        new: true,
        rawResult: true,
      });
      if (!res.lastErrorObject.updatedExisting) newCount++;
    } catch (e) {}
  }

  console.log(`✅ Sync Complete. ${newCount} New Trump Cards added.`);
};

module.exports = { runMasterScraper };
