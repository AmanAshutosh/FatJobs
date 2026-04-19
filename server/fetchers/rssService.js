/**
 * RSS / Free-API Fetcher
 * Sources: We Work Remotely · Crypto Jobs List · Web3.career · Indeed · Remotive
 * All free, no keys required.
 */

const axios      = require("axios");
const { XMLParser } = require("fast-xml-parser");
const {
  classifyLevel, classifyDeck, levelToJobType,
  isAllowedRole, isWithin7Days, extractExp, makeJobId,
} = require("../utils/classifier");

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  allowBooleanAttributes: true,
});

const BOT_UA = "Mozilla/5.0 (compatible; FatJobsBot/2.0; +https://fatjobs.in)";

// ── Helpers ───────────────────────────────────────────────────────────────────

async function fetchXML(url, timeout = 18_000) {
  const { data } = await axios.get(url, {
    timeout,
    headers: { "User-Agent": BOT_UA, Accept: "application/rss+xml, application/xml, text/xml" },
    responseType: "text",
  });
  const parsed = xmlParser.parse(data);
  // Handle both RSS 2.0 and Atom
  return (
    parsed?.rss?.channel?.item ||
    parsed?.feed?.entry        ||
    []
  );
}

function str(v) {
  if (!v) return "";
  if (typeof v === "object") return v["#text"] || v.__text || JSON.stringify(v);
  return String(v);
}

function buildDoc({ title, company, logo, location, type, applyUrl, postedAt, sourcePlatform }) {
  const level = classifyLevel(title, "", extractExp(title));
  return {
    jobId:          makeJobId(applyUrl),
    title,
    company:        (company || "REMOTE_CO").toUpperCase(),
    logo:           logo || "",
    location:       location || "Global",
    type:           type || "Remote",
    link:           applyUrl,
    platform:       sourcePlatform,
    sourcePlatform,
    postedAt:       new Date(postedAt || Date.now()),
    category:       classifyDeck(title),
    level,
    jobType:        levelToJobType(level),
    experience:     extractExp(title),
    workType:       type || "Remote",
  };
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ── 1. We Work Remotely ───────────────────────────────────────────────────────
// Free RSS, updated multiple times daily

async function fetchWWR(upsertFn) {
  console.log("🌐 [RSS:WWR] Starting...");
  const FEEDS = [
    "https://weworkremotely.com/remote-jobs.rss",
    "https://weworkremotely.com/categories/remote-programming-jobs.rss",
    "https://weworkremotely.com/categories/remote-data-science-ai-jobs.rss",
  ];
  let saved = 0;

  for (const feed of FEEDS) {
    try {
      const items = await fetchXML(feed);
      for (const item of items) {
        // WWR title format: "Company: Role Title"
        const raw     = str(item.title);
        const parts   = raw.split(/:\s+/);
        const company = parts.length > 1 ? parts[0].trim() : "REMOTE";
        const title   = parts.length > 1 ? parts.slice(1).join(": ").trim() : raw;
        const applyUrl = str(item.link) || str(item.guid);
        const pubDate  = str(item.pubDate);

        if (!title || !applyUrl)           continue;
        if (!isAllowedRole(title))         continue;
        if (!isWithin7Days(pubDate))       continue;

        await upsertFn(applyUrl, buildDoc({
          title, company, applyUrl, postedAt: pubDate,
          type: "Remote", sourcePlatform: "WeWorkRemotely",
        }));
        saved++;
      }
      await sleep(800);
    } catch (e) { console.log(`🟡 [RSS:WWR] Feed error: ${e.message}`); }
  }
  console.log(`✅ [RSS:WWR] Done — ${saved} jobs upserted.`);
}

// ── 2. Crypto Jobs List ───────────────────────────────────────────────────────
// Free RSS for Web3 / crypto roles

async function fetchCryptoJobsList(upsertFn) {
  console.log("🔶 [RSS:CryptoJobsList] Starting...");
  let saved = 0;
  try {
    const items = await fetchXML("https://cryptojobslist.com/rss.xml");
    for (const item of items) {
      const title    = str(item.title);
      const applyUrl = str(item.link) || str(item.guid);
      const pubDate  = str(item.pubDate);
      const company  = str(item["dc:creator"]) || str(item.author) || "WEB3_CO";

      if (!title || !applyUrl)      continue;
      if (!isWithin7Days(pubDate))  continue;

      await upsertFn(applyUrl, buildDoc({
        title, company, applyUrl, postedAt: pubDate,
        location: "Global", type: "Remote", sourcePlatform: "CryptoJobsList",
      }));
      saved++;
    }
  } catch (e) { console.log(`🟡 [RSS:CryptoJobsList] Error: ${e.message}`); }
  console.log(`✅ [RSS:CryptoJobsList] Done — ${saved} jobs upserted.`);
}

// ── 3. Web3.career ────────────────────────────────────────────────────────────

async function fetchWeb3Career(upsertFn) {
  console.log("🔷 [RSS:Web3.career] Starting...");
  let saved = 0;
  try {
    const items = await fetchXML("https://web3.career/remote-web3-jobs-rss-feed");
    for (const item of items) {
      const title    = str(item.title);
      const applyUrl = str(item.link) || str(item.guid);
      const pubDate  = str(item.pubDate);
      const desc     = str(item.description);

      if (!title || !applyUrl)      continue;
      if (!isAllowedRole(title))    continue;
      if (!isWithin7Days(pubDate))  continue;

      // Try to parse company name from description
      const compMatch = desc.match(/at\s+([A-Z][A-Za-z0-9\s&.\-]+?)(?:\s*[-|,\n<]|$)/);
      const company   = compMatch ? compMatch[1].trim() : "WEB3_CO";

      await upsertFn(applyUrl, buildDoc({
        title, company, applyUrl, postedAt: pubDate,
        location: "Remote", type: "Remote", sourcePlatform: "Web3.career",
      }));
      saved++;
    }
  } catch (e) { console.log(`🟡 [RSS:Web3.career] Error: ${e.message}`); }
  console.log(`✅ [RSS:Web3.career] Done — ${saved} jobs upserted.`);
}

// ── 4. Indeed RSS ─────────────────────────────────────────────────────────────
// Indeed provides free RSS for job searches; no auth needed

async function fetchIndeed(upsertFn) {
  console.log("🔍 [RSS:Indeed] Starting...");

  const QUERIES = [
    { q: "software+developer+india",    loc: "India",     type: "Onsite" },
    { q: "blockchain+developer",        loc: "India",     type: "Onsite" },
    { q: "data+analyst+india",          loc: "India",     type: "Onsite" },
    { q: "software+developer+intern",   loc: "India",     type: "Onsite" },
    { q: "fresher+software+engineer",   loc: "India",     type: "Onsite" },
    { q: "remote+software+developer",   loc: "Worldwide", type: "Remote" },
  ];

  let saved = 0;
  for (const q of QUERIES) {
    try {
      const url   = `https://www.indeed.com/rss?q=${q.q}&l=${encodeURIComponent(q.loc)}&sort=date&fromage=7`;
      const items = await fetchXML(url);

      for (const item of items) {
        const title    = str(item.title);
        const applyUrl = str(item.link) || str(item.guid);
        const pubDate  = str(item.pubDate);
        const company  = str(item.source) || str(item["dc:creator"]) || "COMPANY";

        if (!title || !applyUrl)      continue;
        if (!isAllowedRole(title))    continue;
        if (!isWithin7Days(pubDate))  continue;

        // Extract location from description HTML
        const desc    = str(item.description);
        const locMatch = desc.match(/(?:location|loc):\s*([^<\n,]+)/i);
        const loc      = locMatch ? locMatch[1].trim() : q.loc;

        await upsertFn(applyUrl, buildDoc({
          title, company, applyUrl, postedAt: pubDate,
          location: loc, type: q.type, sourcePlatform: "Indeed",
        }));
        saved++;
      }
      await sleep(1_200); // respect rate limit between queries
    } catch (e) { console.log(`🟡 [RSS:Indeed] Query error: ${e.message}`); }
  }
  console.log(`✅ [RSS:Indeed] Done — ${saved} jobs upserted.`);
}

// ── 5. Remotive API ───────────────────────────────────────────────────────────
// Free JSON API, no auth required

async function fetchRemotive(upsertFn) {
  console.log("🌍 [RSS:Remotive] Starting...");
  const CATEGORIES = ["software-dev", "data", "devops-sysadmin", "product"];
  let saved = 0;

  for (const cat of CATEGORIES) {
    try {
      const { data } = await axios.get(
        `https://remotive.com/api/remote-jobs?category=${cat}&limit=50`,
        { timeout: 15_000 }
      );

      for (const j of data?.jobs || []) {
        if (!isAllowedRole(j.title))             continue;
        if (!isWithin7Days(j.publication_date))  continue;

        const applyUrl = j.url;
        const level    = classifyLevel(j.title, (j.description || "").toLowerCase());

        await upsertFn(applyUrl, {
          jobId:          makeJobId(applyUrl),
          title:          j.title,
          company:        (j.company_name || "REMOTE_CO").toUpperCase(),
          logo:           j.company_logo || "",
          location:       j.candidate_required_location || "Worldwide",
          type:           "Remote",
          link:           applyUrl,
          platform:       "Remotive",
          sourcePlatform: "Remotive",
          postedAt:       new Date(j.publication_date || Date.now()),
          category:       classifyDeck(j.title),
          level,
          jobType:        levelToJobType(level),
          experience:     extractExp(j.title + " " + (j.description || "")),
          workType:       "Remote",
        });
        saved++;
      }
      await sleep(500);
    } catch (e) { console.log(`🟡 [RSS:Remotive] Category error: ${e.message}`); }
  }
  console.log(`✅ [RSS:Remotive] Done — ${saved} jobs upserted.`);
}

module.exports = { fetchWWR, fetchCryptoJobsList, fetchWeb3Career, fetchIndeed, fetchRemotive };
