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
// High-volume Indian job board; strong anti-bot — proxy recommended

const NAUKRI_QUERIES = [
  { kw: "software-developer",     exp: "0" },  // freshers
  { kw: "software-engineer",      exp: "0" },
  { kw: "web-developer",          exp: "0" },
  { kw: "data-analyst",           exp: "0" },
  { kw: "blockchain-developer",   exp: "0" },
  { kw: "java-developer",         exp: "1" },
  { kw: "react-developer",        exp: "1" },
  { kw: "python-developer",       exp: "1" },
];

async function fetchNaukri(upsertFn) {
  console.log("🟠 [STEALTH:Naukri] Starting...");
  let saved = 0;
  let browser;
  try {
    browser = await launchBrowser(true); // use proxy for Naukri

    for (const q of NAUKRI_QUERIES) {
      const page = await newStealthPage(browser, true);
      try {
        const url = `https://www.naukri.com/${q.kw}-jobs-${q.exp}?jobAge=7`;
        await page.goto(url, { waitUntil: "domcontentloaded", timeout: 25_000 });
        await sleep(2_000 + Math.random() * 1_500);

        const cards = await page.$$eval(
          "article.jobTuple",
          (els) =>
            els.map((el) => ({
              title:   el.querySelector(".title")?.innerText?.trim() || "",
              company: el.querySelector(".subTitle")?.innerText?.trim() || "",
              loc:     el.querySelector(".location")?.innerText?.trim() || "India",
              link:    el.querySelector("a.title")?.href || "",
              posted:  el.querySelector(".type time")?.getAttribute("datetime") || "",
            }))
        );

        for (const c of cards) {
          if (!c.title || !c.link)       continue;
          if (!isAllowedRole(c.title))   continue;
          if (!isWithin7Days(c.posted || new Date())) continue;

          await upsertFn(c.link, buildDoc({
            title:          c.title,
            company:        c.company,
            location:       c.loc,
            type:           "Onsite",
            applyUrl:       c.link,
            postedAt:       c.posted || new Date(),
            sourcePlatform: "Naukri",
          }));
          saved++;
        }
      } catch (e) {
        console.log(`🟡 [STEALTH:Naukri] Query error: ${e.message}`);
      } finally {
        await page.close();
        await sleep(3_000 + Math.random() * 2_000); // anti-rate-limit delay
      }
    }
  } catch (e) {
    console.error("🔴 [STEALTH:Naukri] Browser error:", e.message);
  } finally {
    if (browser) await browser.close();
  }
  console.log(`✅ [STEALTH:Naukri] Done — ${saved} jobs upserted.`);
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
