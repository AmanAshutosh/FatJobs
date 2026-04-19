/**
 * Stealth Browser Fetcher
 * Uses puppeteer-extra + stealth plugin to bypass bot detection.
 * Targets: Naukri · Internshala · Wellfound (Formerly AngelList)
 *
 * Requires (run in /server):  npm install puppeteer-extra puppeteer-extra-plugin-stealth
 *
 * PROXY: set PROXY_LIST env var for Naukri / LinkedIn bypass.
 */

const {
  classifyLevel, classifyDeck, levelToJobType,
  isAllowedRole, isWithin7Days, extractExp, makeJobId,
} = require("../utils/classifier");
const { puppeteerProxyArg, puppeteerAuth } = require("../utils/proxyRotator");

// ── Stealth browser boot ──────────────────────────────────────────────────────

let _puppeteer = null;

function getPuppeteer() {
  if (_puppeteer) return _puppeteer;
  try {
    const puppeteerExtra = require("puppeteer-extra");
    const StealthPlugin   = require("puppeteer-extra-plugin-stealth");
    puppeteerExtra.use(StealthPlugin());
    _puppeteer = puppeteerExtra;
  } catch {
    // Fallback to vanilla puppeteer if stealth not installed
    _puppeteer = require("puppeteer");
    console.log("⚠️ [STEALTH] puppeteer-extra not found — using vanilla puppeteer. Run: npm install puppeteer-extra puppeteer-extra-plugin-stealth");
  }
  return _puppeteer;
}

const BROWSER_ARGS = [
  "--no-sandbox",
  "--disable-setuid-sandbox",
  "--disable-blink-features=AutomationControlled",
  "--disable-features=IsolateOrigins,site-per-process",
  "--disable-dev-shm-usage",
  "--disable-gpu",
];

const VIEWPORT = { width: 1366, height: 768 };

const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
];
const randomUA = () => USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];

async function launchBrowser(useProxy = false) {
  const args = [...BROWSER_ARGS];
  if (useProxy) {
    const proxyArg = puppeteerProxyArg();
    if (proxyArg) args.push(proxyArg);
  }
  const browser = await getPuppeteer().launch({
    headless: "new",
    args,
    ignoreHTTPSErrors: true,
  });
  return browser;
}

async function newStealthPage(browser, useProxy = false) {
  const page = await browser.newPage();
  await page.setViewport(VIEWPORT);
  await page.setUserAgent(randomUA());
  await page.setExtraHTTPHeaders({
    "Accept-Language": "en-IN,en;q=0.9",
    "Accept-Encoding": "gzip, deflate, br",
    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
  });
  // Block images/fonts/media to speed up scraping
  await page.setRequestInterception(true);
  page.on("request", (req) => {
    if (["image", "stylesheet", "font", "media"].includes(req.resourceType())) req.abort();
    else req.continue();
  });
  // Proxy auth if configured
  if (useProxy) {
    const auth = puppeteerAuth();
    if (auth) await page.authenticate({ username: auth[0], password: auth[1] });
  }
  return page;
}

function buildDoc({ title, company, logo, location, type, applyUrl, postedAt, sourcePlatform }) {
  const level = classifyLevel(title, "", extractExp(title));
  return {
    jobId:          makeJobId(applyUrl),
    title,
    company:        (company || "COMPANY").toUpperCase(),
    logo:           logo || "",
    location:       location || "India",
    type:           type || "Onsite",
    link:           applyUrl,
    platform:       sourcePlatform,
    sourcePlatform,
    postedAt:       new Date(postedAt || Date.now()),
    category:       classifyDeck(title),
    level,
    jobType:        levelToJobType(level),
    experience:     extractExp(title),
    workType:       type || "Onsite",
  };
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ── 1. Naukri ─────────────────────────────────────────────────────────────────
// Uses Naukri's internal JSON API (faster + more reliable than browser scraping).
// Falls back to Puppeteer if the API rejects the request.

const axios = require("axios");

const NAUKRI_API_QUERIES = [
  { keyword: "software developer",   exp: 0 },
  { keyword: "software engineer",    exp: 0 },
  { keyword: "web developer",        exp: 0 },
  { keyword: "data analyst",         exp: 0 },
  { keyword: "react developer",      exp: 0 },
  { keyword: "python developer",     exp: 0 },
  { keyword: "blockchain developer", exp: 0 },
  { keyword: "java developer",       exp: 1 },
];

// Naukri returns relative dates like "4 days ago" — convert to absolute Date
function parseNaukriDate(str = "") {
  const now = Date.now();
  const m   = str.match(/(\d+)\s*(hour|day|week|month)/i);
  if (!m) return new Date(now);
  const n    = parseInt(m[1], 10);
  const unit = m[2].toLowerCase();
  const ms   = unit.startsWith("hour")  ? n * 3_600_000
             : unit.startsWith("day")   ? n * 86_400_000
             : unit.startsWith("week")  ? n * 604_800_000
             : n * 2_592_000_000;
  return new Date(now - ms);
}

async function fetchNaukriViaAPI(upsertFn) {
  console.log("🟠 [Naukri:API] Starting...");
  let saved = 0;

  for (const q of NAUKRI_API_QUERIES) {
    try {
      const url = "https://www.naukri.com/jobapi/v3/search?" + new URLSearchParams({
        noOfResults: 20,
        urlType:     "search_by_key_loc",
        searchType:  "adv",
        keyword:     q.keyword,
        experienceDD: q.exp,
        jobAge:      7,
        version:     15,
        src:         "jobsearchDesk",
        loginSrc:    "jobSearch",
        candidateId: 0,
        fexp:        q.exp,
      });

      const { data } = await axios.get(url, {
        headers: {
          appid:          "109",
          systemid:       "109",
          "User-Agent":   "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          Referer:        "https://www.naukri.com/",
          Accept:         "application/json",
        },
        timeout: 15_000,
      });

      for (const job of data?.jobDetails || []) {
        const title    = (job.title || "").trim();
        const company  = (job.companyName || "").trim();
        const location = Array.isArray(job.location) ? job.location.join(", ") : (job.placeholders?.[0]?.label || "India");
        const applyUrl = job.jdURL || job.staticUrl || "";

        if (!title || !applyUrl)    continue;
        if (!isAllowedRole(title))  continue;

        const level    = classifyLevel(title, "", "");
        if (level === "SDE-2+")     continue; // skip senior roles

        const postedAt = parseNaukriDate(job.jobDate || "");
        if (!isWithin7Days(postedAt)) continue;

        await upsertFn(applyUrl, buildDoc({
          title,
          company,
          location,
          type:           "Onsite",
          applyUrl,
          postedAt,
          sourcePlatform: "Naukri",
        }));
        saved++;
      }

      await sleep(1_200); // gentle rate limit
    } catch (e) {
      console.log(`🟡 [Naukri:API] Query "${q.keyword}" failed: ${e.message}`);
    }
  }

  console.log(`✅ [Naukri:API] Done — ${saved} jobs upserted.`);
  return saved;
}

// Puppeteer fallback with updated selectors for Naukri's 2024+ redesign
const NAUKRI_BROWSER_QUERIES = [
  { kw: "software-developer", exp: "0" },
  { kw: "data-analyst",       exp: "0" },
  { kw: "web-developer",      exp: "0" },
];

async function fetchNaukriViaBrowser(upsertFn) {
  console.log("🟠 [Naukri:Browser] Starting fallback...");
  let saved = 0;
  let browser;
  try {
    browser = await launchBrowser(true);

    for (const q of NAUKRI_BROWSER_QUERIES) {
      const page = await newStealthPage(browser, true);
      try {
        const url = `https://www.naukri.com/${q.kw}-jobs-${q.exp}?jobAge=7`;
        await page.goto(url, { waitUntil: "networkidle2", timeout: 30_000 });
        await sleep(2_500 + Math.random() * 1_500);

        // Try multiple selector patterns for Naukri's evolving HTML
        const cards = await page.$$eval(
          // 2024+ redesign: srp-jobtuple-wrapper; older: article.jobTuple
          ".srp-jobtuple-wrapper, article.jobTuple",
          (els) => els.map((el) => ({
            title:   (
              el.querySelector("a.title, .row1 a.title, a[title]")?.innerText ||
              el.querySelector("a.title, .row1 a.title, a[title]")?.getAttribute("title") ||
              ""
            ).trim(),
            company: (
              el.querySelector(".comp-name, .subTitle, .comp-dtls-wrap .comp-name")?.innerText || ""
            ).trim(),
            loc: (
              el.querySelector(".loc-wrap, .locWdth, .location")?.innerText || "India"
            ).trim(),
            link: (
              el.querySelector("a.title, .row1 a.title")?.href || ""
            ),
            posted: (
              el.querySelector(".job-post-day, span.fleft.grey-text, .type time")?.innerText ||
              el.querySelector("time")?.getAttribute("datetime") || ""
            ).trim(),
          }))
        );

        for (const c of cards) {
          if (!c.title || !c.link)    continue;
          if (!isAllowedRole(c.title)) continue;

          const level = classifyLevel(c.title, "", "");
          if (level === "SDE-2+")     continue;

          const postedAt = c.posted ? parseNaukriDate(c.posted) : new Date();
          if (!isWithin7Days(postedAt)) continue;

          await upsertFn(c.link, buildDoc({
            title:          c.title,
            company:        c.company,
            location:       c.loc,
            type:           "Onsite",
            applyUrl:       c.link,
            postedAt,
            sourcePlatform: "Naukri",
          }));
          saved++;
        }
      } catch (e) {
        console.log(`🟡 [Naukri:Browser] Query error: ${e.message}`);
      } finally {
        await page.close();
        await sleep(3_000 + Math.random() * 2_000);
      }
    }
  } catch (e) {
    console.error("🔴 [Naukri:Browser] Error:", e.message);
  } finally {
    if (browser) await browser.close();
  }
  console.log(`✅ [Naukri:Browser] Done — ${saved} jobs upserted.`);
}

async function fetchNaukri(upsertFn) {
  // Try JSON API first (faster, no browser needed)
  const apiSaved = await fetchNaukriViaAPI(upsertFn).catch(() => 0);
  // Only fall back to browser if API returned nothing
  if (apiSaved === 0) {
    await fetchNaukriViaBrowser(upsertFn);
  }
}

// ── 2. Internshala ────────────────────────────────────────────────────────────
// India's top internship platform; moderate anti-bot

const INTERNSHALA_QUERIES = [
  "computer-science",
  "web-development",
  "data-science",
  "machine-learning",
  "android-app-development",
];

async function fetchInternshala(upsertFn) {
  console.log("🟣 [STEALTH:Internshala] Starting...");
  let saved = 0;
  let browser;
  try {
    browser = await launchBrowser(false);

    for (const cat of INTERNSHALA_QUERIES) {
      const page = await newStealthPage(browser, false);
      try {
        const url = `https://internshala.com/internships/${cat}-internship`;
        await page.goto(url, { waitUntil: "domcontentloaded", timeout: 20_000 });
        await sleep(1_500);

        const cards = await page.$$eval(
          ".internship_meta",
          (els) =>
            els.map((el) => ({
              title:   el.querySelector(".profile")?.innerText?.trim() || "",
              company: el.querySelector(".company_name")?.innerText?.trim() || "",
              loc:     el.querySelector(".location_link")?.innerText?.trim() || "India",
              link:    el.querySelector("a.view_detail_button")?.href ||
                       el.closest(".individual_internship")?.querySelector("a")?.href || "",
              posted:  el.querySelector(".posted_by_container time")?.getAttribute("datetime") || "",
            }))
        );

        for (const c of cards) {
          if (!c.title || !c.link) continue;
          const applyUrl = c.link.startsWith("http") ? c.link : `https://internshala.com${c.link}`;

          await upsertFn(applyUrl, buildDoc({
            title:          c.title + " Intern",
            company:        c.company,
            location:       c.loc,
            type:           c.loc.toLowerCase().includes("work from home") ? "Remote" : "Onsite",
            applyUrl,
            postedAt:       c.posted || new Date(),
            sourcePlatform: "Internshala",
          }));
          saved++;
        }
      } catch (e) {
        console.log(`🟡 [STEALTH:Internshala] Category error: ${e.message}`);
      } finally {
        await page.close();
        await sleep(2_000);
      }
    }
  } catch (e) {
    console.error("🔴 [STEALTH:Internshala] Browser error:", e.message);
  } finally {
    if (browser) await browser.close();
  }
  console.log(`✅ [STEALTH:Internshala] Done — ${saved} jobs upserted.`);
}

// ── 3. Wellfound (formerly AngelList Talent) ──────────────────────────────────
// Startup / Web3 jobs; semi-public listing page

async function fetchWellfound(upsertFn) {
  console.log("🔵 [STEALTH:Wellfound] Starting...");
  let saved = 0;
  let browser;
  try {
    browser = await launchBrowser(false);
    const page = await newStealthPage(browser, false);

    const SEARCHES = [
      "https://wellfound.com/jobs?role=Software+Engineer&remote=true",
      "https://wellfound.com/jobs?role=Blockchain+Developer",
      "https://wellfound.com/jobs?role=Data+Scientist",
    ];

    for (const searchUrl of SEARCHES) {
      try {
        await page.goto(searchUrl, { waitUntil: "networkidle2", timeout: 25_000 });
        await sleep(3_000);

        const cards = await page.$$eval(
          "[data-test='StartupResult']",
          (els) =>
            els.slice(0, 20).map((el) => ({
              title:   el.querySelector("[data-test='job-title']")?.innerText?.trim() || "",
              company: el.querySelector("[data-test='company-name']")?.innerText?.trim() || "",
              loc:     el.querySelector("[data-test='location']")?.innerText?.trim() || "Remote",
              link:    el.querySelector("a[data-test='job-link']")?.href || "",
              posted:  el.querySelector("time")?.getAttribute("datetime") || "",
            }))
        );

        for (const c of cards) {
          if (!c.title || !c.link) continue;
          if (!isAllowedRole(c.title)) continue;

          const applyUrl = c.link.startsWith("http") ? c.link : `https://wellfound.com${c.link}`;
          await upsertFn(applyUrl, buildDoc({
            title:          c.title,
            company:        c.company,
            location:       c.loc,
            type:           c.loc.toLowerCase().includes("remote") ? "Remote" : "Onsite",
            applyUrl,
            postedAt:       c.posted || new Date(),
            sourcePlatform: "Wellfound",
          }));
          saved++;
        }
        await sleep(3_000);
      } catch (e) {
        console.log(`🟡 [STEALTH:Wellfound] Search error: ${e.message}`);
      }
    }
    await page.close();
  } catch (e) {
    console.error("🔴 [STEALTH:Wellfound] Browser error:", e.message);
  } finally {
    if (browser) await browser.close();
  }
  console.log(`✅ [STEALTH:Wellfound] Done — ${saved} jobs upserted.`);
}

module.exports = { fetchNaukri, fetchInternshala, fetchWellfound };
