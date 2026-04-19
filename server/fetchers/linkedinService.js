/**
 * LinkedIn Job Fetcher — uses LinkedIn's public guest jobs API
 * No API key required. Targets intern/fresher/entry-level roles in India.
 *
 * LinkedIn's /jobs-guest/ endpoint returns paginated HTML job cards.
 * Parsed with cheerio (already a project dependency).
 *
 * Experience filters (f_E):
 *   1 = Internship  |  2 = Entry level  |  3 = Associate
 * Job type filters (f_JT):
 *   F = Full-time  |  I = Internship  |  P = Part-time
 * Time filter (f_TPR):
 *   r86400   = past 24 hours
 *   r604800  = past week
 */

const axios   = require("axios");
const cheerio = require("cheerio");
const {
  classifyLevel, classifyDeck, levelToJobType,
  isAllowedRole, isWithin7Days, extractExp, makeJobId,
} = require("../utils/classifier");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

const SEARCHES = [
  // Internships (India)
  { keywords: "software+developer+intern",    f_E: "1",   f_JT: "I,F", label: "SWE Intern" },
  { keywords: "data+analyst+intern",          f_E: "1",   f_JT: "I,F", label: "DA Intern" },
  { keywords: "frontend+developer+intern",    f_E: "1",   f_JT: "I,F", label: "FE Intern" },
  // Entry-level / fresher (India)
  { keywords: "software+engineer+entry+level",f_E: "2",   f_JT: "F",   label: "SWE Entry" },
  { keywords: "data+analyst+fresher",         f_E: "1,2", f_JT: "F,I", label: "DA Fresher" },
  { keywords: "backend+developer+fresher",    f_E: "2",   f_JT: "F",   label: "BE Fresher" },
  // Blockchain / Web3
  { keywords: "blockchain+developer+india",   f_E: "1,2", f_JT: "F",   label: "Web3" },
];

function buildDoc({ title, company, location, applyUrl, postedAt }) {
  const level = classifyLevel(title, "", extractExp(title));
  const wtype = /remote/i.test(location) ? "Remote" : "Onsite";
  return {
    jobId:          makeJobId(applyUrl),
    title,
    company:        (company || "COMPANY").toUpperCase(),
    logo:           "",
    location:       location || "India",
    type:           wtype,
    link:           applyUrl,
    platform:       "LinkedIn",
    sourcePlatform: "LinkedIn",
    postedAt:       postedAt || new Date(),
    category:       classifyDeck(title),
    level,
    jobType:        levelToJobType(level),
    experience:     extractExp(title),
    workType:       wtype,
  };
}

async function fetchLinkedIn(upsertFn) {
  console.log("🔵 [LinkedIn] Starting guest API fetch...");
  let saved = 0;

  for (const search of SEARCHES) {
    try {
      const url =
        `https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search` +
        `?keywords=${search.keywords}` +
        `&location=India` +
        `&f_E=${encodeURIComponent(search.f_E)}` +
        `&f_JT=${encodeURIComponent(search.f_JT)}` +
        `&f_TPR=r604800` +
        `&start=0` +
        `&count=25`;

      const { data } = await axios.get(url, {
        headers: {
          "User-Agent":      UA,
          "Accept":          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.5",
          "Referer":         "https://www.linkedin.com/jobs/",
        },
        timeout: 20_000,
      });

      const $  = cheerio.load(data);
      const cards = $(".job-search-card, .base-card");

      cards.each((_, el) => {
        try {
          const title   = $(el).find(".base-search-card__title").text().trim();
          const company = $(el).find(".base-search-card__subtitle").first().text().trim();
          const loc     = $(el).find(".job-search-card__location").text().trim();
          const href    = $(el).find("a.base-card__full-link").attr("href") ||
                          $(el).find("a.job-search-card__list-date").attr("href") || "";
          const dt      = $(el).find("time").attr("datetime") || "";

          if (!title || !href) return;
          if (!isAllowedRole(title)) return;

          // Clean tracking params from URL
          const applyUrl  = href.split("?")[0];
          const postedAt  = dt ? new Date(dt) : new Date();

          if (!isWithin7Days(postedAt)) return;

          // Skip senior roles — this is a fresher-focused platform
          const level = classifyLevel(title, "", extractExp(title));
          if (level === "SDE-2+") return;

          upsertFn(applyUrl, buildDoc({ title, company, location: loc, applyUrl, postedAt }));
          saved++;
        } catch (_) { /* skip malformed card */ }
      });

      console.log(`   [LinkedIn] ${search.label}: ${cards.length} cards found`);
      await sleep(3_000 + Math.random() * 2_000); // rate-limit between queries
    } catch (e) {
      console.log(`🟡 [LinkedIn] Search "${search.label}" failed: ${e.message}`);
    }
  }

  console.log(`✅ [LinkedIn] Done — ${saved} jobs queued for upsert.`);
}

module.exports = { fetchLinkedIn };
