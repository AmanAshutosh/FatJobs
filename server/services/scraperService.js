/**
 * MEGA SYNC — Unified Job Fetching Orchestrator
 *
 * Source priority order:
 *   1. ATS APIs        (Greenhouse + Lever)   — zero anti-bot risk
 *   2. RSS / Free APIs (WWR, CryptoJobsList, Web3.career, Indeed, Remotive) — zero anti-bot risk
 *   3. Stealth browser (Naukri, Internshala, Wellfound) — puppeteer-extra stealth
 *   4. Google Dork     (LinkedIn via SerpAPI → GoogleCSE → Headless fallback)
 */

const Job = require("../models/Job");
const { SEVEN_DAYS_MS } = require("../utils/classifier");

// ── Fetcher imports ──────────────────────────────────────────────────────────
const { fetchGreenhouse, fetchLever }             = require("../fetchers/atsService");
const { fetchWWR, fetchCryptoJobsList, fetchWeb3Career, fetchIndeed, fetchRemotive } =
  require("../fetchers/rssService");
const { fetchNaukri, fetchInternshala, fetchWellfound } = require("../fetchers/stealthService");
const { fetchLinkedIn }                           = require("../fetchers/linkedinService");
const { fetchLinkedInViaGoogleDork }              = require("../fetchers/googleDorkService");

// ── Upsert (link is the canonical unique key) ────────────────────────────────

async function upsertJob(applyUrl, data) {
  if (!applyUrl || !data.title || !data.company) return;
  try {
    await Job.findOneAndUpdate(
      { link: applyUrl },
      { $set: data },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  } catch (err) {
    if (err.code !== 11000) {
      console.error(`[DB] Upsert error for ${data.company}:`, err.message);
    }
  }
}

// ── Phase runners (each phase is independent — one failure won't stop others) ─

async function runPhase(label, fn) {
  try {
    await fn();
  } catch (err) {
    console.error(`🔴 [PHASE:${label}] Unexpected failure:`, err.message);
  }
}

// ── Master sync ───────────────────────────────────────────────────────────────

async function scrapeJobs() {
  const start = Date.now();
  console.log("╔══════════════════════════════════════════╗");
  console.log("║   FATJOBS MEGA-SYNC  — STARTING          ║");
  console.log("╚══════════════════════════════════════════╝");

  // Phase 1: ATS APIs — fastest, no anti-bot risk, run in parallel
  console.log("\n── PHASE 1: ATS APIs (Greenhouse + Lever) ──");
  await runPhase("ATS", () =>
    Promise.all([
      fetchGreenhouse(upsertJob),
      fetchLever(upsertJob),
    ])
  );

  // Phase 2: RSS + Free APIs + LinkedIn guest API — parallel (no anti-bot risk)
  console.log("\n── PHASE 2: RSS / Free APIs / LinkedIn ──");
  await runPhase("RSS", () =>
    Promise.all([
      fetchWWR(upsertJob),
      fetchCryptoJobsList(upsertJob),
      fetchWeb3Career(upsertJob),
      fetchRemotive(upsertJob),
    ])
  );

  // LinkedIn guest API — sequential (rate-limit between searches)
  await runPhase("LinkedIn", () => fetchLinkedIn(upsertJob));

  // Indeed runs separately — has per-query delays
  await runPhase("Indeed", () => fetchIndeed(upsertJob));

  // Phase 3: Stealth browser — sequential to avoid resource exhaustion
  console.log("\n── PHASE 3: Stealth Browser ──");
  await runPhase("Internshala", () => fetchInternshala(upsertJob));
  await runPhase("Wellfound",   () => fetchWellfound(upsertJob));
  await runPhase("Naukri",      () => fetchNaukri(upsertJob));  // proxy recommended

  // Phase 4: Google Dork for LinkedIn
  console.log("\n── PHASE 4: Google Dork → LinkedIn ──");
  await runPhase("GoogleDork",  () => fetchLinkedInViaGoogleDork(upsertJob));

  // Cleanup: MongoDB TTL handles auto-pruning, but we also run a manual sweep
  // for jobs that slipped through with wrong postedAt values
  const cutoff  = new Date(Date.now() - SEVEN_DAYS_MS);
  const { deletedCount } = await Job.deleteMany({ postedAt: { $lt: cutoff } }).catch(() => ({ deletedCount: 0 }));

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`\n╔══════════════════════════════════════════╗`);
  console.log(`║ MEGA-SYNC COMPLETE in ${elapsed}s              `);
  console.log(`║ Pruned ${deletedCount} expired roles.           `);
  console.log(`╚══════════════════════════════════════════╝\n`);
}

// ── Thin wrappers for backward-compat (called by cron in server.js) ──────────

async function scrapeGreenhouse() { await fetchGreenhouse(upsertJob); }
async function scrapeJSearch()    { /* JSearch removed — Google Dork replaces it */ }

module.exports = { scrapeJobs, scrapeGreenhouse, scrapeJSearch };
