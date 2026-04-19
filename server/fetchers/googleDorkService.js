/**
 * Google Dork → LinkedIn Job Harvester
 *
 * Strategy (2026 pro-tip):
 *   Instead of hitting LinkedIn's internal /jobs-search API (gets 403'd), we query
 *   Google's index of LinkedIn job pages using a site: dork. LinkedIn can't block
 *   Google's crawler, so their pages are always in the index — even today's postings.
 *
 * Two modes (tried in order):
 *   1. SerpAPI  — structured JSON, 100 free queries/month (SERPAPI_KEY env var)
 *   2. Fallback — direct Google HTML scrape via headless Puppeteer stealth
 *
 * Env vars:
 *   SERPAPI_KEY     — your SerpAPI key (preferred, most reliable)
 *   GOOGLE_CSE_KEY  — Google Custom Search Engine API key (alternative)
 *   GOOGLE_CSE_ID   — Google CSE ID (required with GOOGLE_CSE_KEY)
 */

const axios = require("axios");
const {
  classifyLevel, classifyDeck, levelToJobType,
  isAllowedRole, isWithin7Days, extractExp, makeJobId,
} = require("../utils/classifier");
const { puppeteerProxyArg, puppeteerAuth } = require("../utils/proxyRotator");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ── Search queries — target Google's LinkedIn job index ───────────────────────

const DORK_QUERIES = [
  // Freshers & interns (India)
  'site:linkedin.com/jobs/view "software engineer" "entry level" india',
  'site:linkedin.com/jobs/view "software developer" "fresher" india',
  'site:linkedin.com/jobs/view "intern" "software" india "posted" "hour"',
  // Web3 / Blockchain
  'site:linkedin.com/jobs/view "blockchain developer" india',
  'site:linkedin.com/jobs/view "web3" developer india',
  'site:linkedin.com/jobs/view "solidity" OR "smart contract" developer',
  // Mid-level
  'site:linkedin.com/jobs/view "software engineer" india "2 years"',
  'site:linkedin.com/jobs/view "data analyst" india',
  // Time-anchored (posted recency signals)
  'site:linkedin.com/jobs/view "software engineer" india "24 hours ago"',
  'site:linkedin.com/jobs/view "software engineer" india "1 day ago"',
];

// ── Helper — parse a LinkedIn job URL into a clean apply URL ─────────────────

function cleanLinkedInUrl(raw) {
  try {
    const url = new URL(raw.startsWith("http") ? raw : "https://www.linkedin.com" + raw);
    // Keep only the path (removes tracking params)
    return `https://www.linkedin.com${url.pathname}`;
  } catch {
    return raw;
  }
}

function buildDoc(title, company, location, applyUrl, sourcePlatform = "LinkedIn") {
  const level = classifyLevel(title, "", extractExp(title));
  return {
    jobId:          makeJobId(applyUrl),
    title,
    company:        (company || "COMPANY").toUpperCase(),
    logo:           "",
    location:       location || "India",
    type:           /remote/i.test(location) ? "Remote" : "Onsite",
    link:           applyUrl,
    platform:       sourcePlatform,
    sourcePlatform,
    postedAt:       new Date(),
    category:       classifyDeck(title),
    level,
    jobType:        levelToJobType(level),
    experience:     extractExp(title),
    workType:       /remote/i.test(location) ? "Remote" : "Onsite",
  };
}

// ── Mode 1: SerpAPI (100 free/month, structured data) ────────────────────────

async function dorkViaSerpAPI(upsertFn) {
  const KEY = process.env.SERPAPI_KEY;
  if (!KEY) return false;

  console.log("🔑 [DORK:SerpAPI] Starting...");
  let saved = 0;

  for (const q of DORK_QUERIES) {
    try {
      const { data } = await axios.get("https://serpapi.com/search.json", {
        params: {
          engine:  "google",
          q,
          num:     10,
          gl:      "in",       // India geolocation
          hl:      "en",
          tbs:     "qdr:w",    // results from past week
          api_key: KEY,
        },
        timeout: 15_000,
      });

      for (const result of data?.organic_results || []) {
        const raw     = result.link || "";
        if (!raw.includes("linkedin.com/jobs/view")) continue;

        const applyUrl = cleanLinkedInUrl(raw);
        // Extract title/company from snippet
        const title    = result.title?.replace(/\s*[-|].*$/, "").trim() || "Software Engineer";
        const snippet  = result.snippet || "";
        const company  = snippet.match(/^([A-Z][A-Za-z0-9\s&.\-]+?)\s*[-·]/)?.[1]?.trim() || "COMPANY";
        const location = snippet.match(/\b([A-Z][a-z]+(?:,\s*[A-Z][a-z]+)?)\s*(?:Area|India|Remote)?/)?.[0] || "India";

        if (!isAllowedRole(title)) continue;

        await upsertFn(applyUrl, buildDoc(title, company, location, applyUrl, "LinkedIn"));
        saved++;
      }

      await sleep(1_200); // SerpAPI rate limit
    } catch (e) {
      console.log(`🟡 [DORK:SerpAPI] Query error: ${e.message}`);
    }
  }

  console.log(`✅ [DORK:SerpAPI] Done — ${saved} LinkedIn jobs upserted.`);
  return true;
}

// ── Mode 2: Google Custom Search API (free tier: 100 queries/day) ─────────────

async function dorkViaGoogleCSE(upsertFn) {
  const KEY = process.env.GOOGLE_CSE_KEY;
  const CX  = process.env.GOOGLE_CSE_ID;
  if (!KEY || !CX) return false;

  console.log("🔎 [DORK:GoogleCSE] Starting...");
  let saved = 0;

  // Only run a subset of queries to preserve free tier quota
  for (const q of DORK_QUERIES.slice(0, 5)) {
    try {
      const { data } = await axios.get("https://www.googleapis.com/customsearch/v1", {
        params: { key: KEY, cx: CX, q, dateRestrict: "w1", num: 10 },
        timeout: 12_000,
      });

      for (const item of data?.items || []) {
        const raw = item.link || "";
        if (!raw.includes("linkedin.com/jobs/view")) continue;

        const applyUrl = cleanLinkedInUrl(raw);
        const title    = (item.title || "").replace(/\s*[-|].*$/, "").trim();
        const company  = item.pagemap?.metatags?.[0]?.["og:site_name"] || "COMPANY";
        const location = item.snippet?.match(/\b[A-Z][a-z]+(,\s*[A-Z][a-z]+)?\b/)?.[0] || "India";

        if (!isAllowedRole(title)) continue;

        await upsertFn(applyUrl, buildDoc(title, company, location, applyUrl, "LinkedIn"));
        saved++;
      }

      await sleep(1_000);
    } catch (e) {
      console.log(`🟡 [DORK:GoogleCSE] Query error: ${e.message}`);
    }
  }

  console.log(`✅ [DORK:GoogleCSE] Done — ${saved} LinkedIn jobs upserted.`);
  return true;
}

// ── Mode 3: Stealth headless Google scrape (no API key, last resort) ──────────

async function dorkViaHeadless(upsertFn) {
  console.log("🕵️ [DORK:Headless] Starting stealth Google scrape...");
  let saved = 0;
  let browser;

  try {
    let puppeteer;
    try {
      const puppeteerExtra = require("puppeteer-extra");
      const StealthPlugin   = require("puppeteer-extra-plugin-stealth");
      puppeteerExtra.use(StealthPlugin());
      puppeteer = puppeteerExtra;
    } catch {
      puppeteer = require("puppeteer");
    }

    const proxyArg = puppeteerProxyArg();
    browser = await puppeteer.launch({
      headless: "new",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-blink-features=AutomationControlled",
        "--disable-dev-shm-usage",
        ...(proxyArg ? [proxyArg] : []),
      ],
      ignoreHTTPSErrors: true,
    });

    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36"
    );
    await page.setViewport({ width: 1366, height: 768 });

    // Block unnecessary resources
    await page.setRequestInterception(true);
    page.on("request", (req) => {
      if (["image", "stylesheet", "font", "media"].includes(req.resourceType())) req.abort();
      else req.continue();
    });

    const proxyAuth = puppeteerAuth();
    if (proxyAuth) await page.authenticate({ username: proxyAuth[0], password: proxyAuth[1] });

    // Only scrape first 3 queries to avoid CAPTCHA trigger
    for (const q of DORK_QUERIES.slice(0, 3)) {
      try {
        const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(q)}&tbs=qdr:w&num=10&hl=en&gl=in`;
        await page.goto(googleUrl, { waitUntil: "domcontentloaded", timeout: 20_000 });
        await sleep(2_000 + Math.random() * 1_500);

        // Check for CAPTCHA
        const isCaptcha = await page.$("form#captcha-form, #recaptcha") !== null;
        if (isCaptcha) {
          console.log("🔴 [DORK:Headless] CAPTCHA detected — stopping.");
          break;
        }

        const results = await page.$$eval("a[href*='linkedin.com/jobs/view']", (links) =>
          links.map((a) => ({
            href:  a.href,
            text:  a.innerText || a.closest("h3")?.innerText || "",
            snip:  a.closest("[data-sokoban-container]")?.querySelector(".VwiC3b")?.innerText || "",
          }))
        );

        for (const r of results) {
          if (!r.href.includes("linkedin.com/jobs/view")) continue;
          const applyUrl = cleanLinkedInUrl(r.href);
          const title    = r.text.replace(/\s*[-|].*$/, "").trim();
          const company  = r.snip.match(/^([A-Z][A-Za-z0-9\s]+?)\s*[-·]/)?.[1]?.trim() || "COMPANY";

          if (!isAllowedRole(title)) continue;

          await upsertFn(applyUrl, buildDoc(title, company, "India", applyUrl, "LinkedIn"));
          saved++;
        }

        await sleep(4_000 + Math.random() * 2_000); // long delay to avoid detection
      } catch (e) {
        console.log(`🟡 [DORK:Headless] Query error: ${e.message}`);
      }
    }

    await page.close();
  } catch (e) {
    console.error("🔴 [DORK:Headless] Browser error:", e.message);
  } finally {
    if (browser) await browser.close();
  }

  console.log(`✅ [DORK:Headless] Done — ${saved} LinkedIn jobs upserted.`);
}

// ── Master export — tries modes in priority order ────────────────────────────

async function fetchLinkedInViaGoogleDork(upsertFn) {
  // Try SerpAPI first (most reliable)
  if (await dorkViaSerpAPI(upsertFn)) return;
  // Then Google CSE
  if (await dorkViaGoogleCSE(upsertFn)) return;
  // Headless fallback (no keys required)
  await dorkViaHeadless(upsertFn);
}

module.exports = { fetchLinkedInViaGoogleDork };
