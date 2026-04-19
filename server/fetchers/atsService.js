/**
 * ATS Service — Greenhouse + Lever direct JSON APIs
 * No scraping, no anti-bot risk. Pure REST calls.
 */

const axios = require("axios");
const {
  classifyLevel, classifyDeck, levelToJobType,
  isAllowedRole, isWithin7Days, extractExp, makeJobId, logoUrl,
} = require("../utils/classifier");

// ── Company Registries ────────────────────────────────────────────────────────

const GREENHOUSE_COMPANIES = [
  // ── Global Web3 ──
  { slug: "coinbase",             name: "Coinbase",             domain: "coinbase.com" },
  { slug: "ripple",               name: "Ripple",               domain: "ripple.com" },
  { slug: "circle",               name: "Circle",               domain: "circle.com" },
  { slug: "fireblocks",           name: "Fireblocks",           domain: "fireblocks.com" },
  { slug: "robinhood",            name: "Robinhood",            domain: "robinhood.com" },
  { slug: "blockinc",             name: "Block (Cash App)",     domain: "block.xyz" },
  { slug: "wintermute-trading",   name: "Wintermute",           domain: "wintermute.com" },
  { slug: "falconx",              name: "FalconX",              domain: "falconx.io" },
  { slug: "polymarket",           name: "Polymarket",           domain: "polymarket.com" },
  { slug: "gemini",               name: "Gemini",               domain: "gemini.com" },
  { slug: "avalabs",              name: "Ava Labs",             domain: "avax.network" },
  { slug: "moonpay",              name: "MoonPay",              domain: "moonpay.com" },
  { slug: "bitgo",                name: "BitGo",                domain: "bitgo.com" },
  { slug: "jumpcrypto",           name: "Jump Crypto",          domain: "jump.co" },
  // ── India Web3 ──
  { slug: "polygon",              name: "Polygon",              domain: "polygon.technology" },
  // ── India Tech ──
  { slug: "razorpay",             name: "Razorpay",             domain: "razorpay.com" },
  { slug: "groww",                name: "Groww",                domain: "groww.in" },
  { slug: "slice",                name: "Slice",                domain: "sliceit.com" },
  { slug: "meesho",               name: "Meesho",               domain: "meesho.com" },
  { slug: "zepto",                name: "Zepto",                domain: "zeptonow.com" },
  { slug: "chargebee",            name: "Chargebee",            domain: "chargebee.com" },
  { slug: "freshworks",           name: "Freshworks",           domain: "freshworks.com" },
  { slug: "browserstack",         name: "BrowserStack",         domain: "browserstack.com" },
  { slug: "postman",              name: "Postman",              domain: "postman.com" },
  { slug: "innovaccer",           name: "Innovaccer",           domain: "innovaccer.com" },
  { slug: "darwinbox",            name: "Darwinbox",            domain: "darwinbox.com" },
  { slug: "perfios",              name: "Perfios",              domain: "perfios.com" },
  // ── Global Tech ──
  { slug: "github",               name: "GitHub",               domain: "github.com" },
  { slug: "gitlab",               name: "GitLab",               domain: "gitlab.com" },
  { slug: "atlassian",            name: "Atlassian",            domain: "atlassian.com" },
  { slug: "twilio",               name: "Twilio",               domain: "twilio.com" },
  { slug: "cloudflare",           name: "Cloudflare",           domain: "cloudflare.com" },
  { slug: "datadog",              name: "Datadog",              domain: "datadoghq.com" },
  { slug: "snowflake",            name: "Snowflake",            domain: "snowflake.com" },
  { slug: "figma",                name: "Figma",                domain: "figma.com" },
  { slug: "notion",               name: "Notion",               domain: "notion.so" },
  { slug: "canva",                name: "Canva",                domain: "canva.com" },
  { slug: "vercel",               name: "Vercel",               domain: "vercel.com" },
  { slug: "supabase",             name: "Supabase",             domain: "supabase.com" },
  { slug: "hashicorp",            name: "HashiCorp",            domain: "hashicorp.com" },
  { slug: "confluent",            name: "Confluent",            domain: "confluent.io" },
  { slug: "elastic",              name: "Elastic",              domain: "elastic.co" },
  { slug: "stripe",               name: "Stripe",               domain: "stripe.com" },
  { slug: "wise",                 name: "Wise",                 domain: "wise.com" },
  { slug: "clari",                name: "Clari",                domain: "clari.com" },
];

const LEVER_COMPANIES = [
  // ── Global Web3 ──
  { slug: "kraken",               name: "Kraken",               domain: "kraken.com" },
  { slug: "chainalysis",          name: "Chainalysis",          domain: "chainalysis.com" },
  { slug: "ledger",               name: "Ledger",               domain: "ledger.com" },
  { slug: "opensea",              name: "OpenSea",              domain: "opensea.io" },
  { slug: "unstoppabledomains",   name: "Unstoppable Domains",  domain: "unstoppabledomains.com" },
  { slug: "dydx",                 name: "dYdX",                 domain: "dydx.exchange" },
  { slug: "uniswap",              name: "Uniswap Labs",         domain: "uniswap.org" },
  { slug: "aave",                 name: "Aave",                 domain: "aave.com" },
  { slug: "immutable",            name: "Immutable",            domain: "immutable.com" },
  { slug: "consensys",            name: "Consensys",            domain: "consensys.io" },
  { slug: "alchemy",              name: "Alchemy",              domain: "alchemy.com" },
  { slug: "nansen",               name: "Nansen",               domain: "nansen.ai" },
  { slug: "anchorage",            name: "Anchorage Digital",    domain: "anchorage.com" },
  // ── India Web3 / Tech ──
  { slug: "coindcx",              name: "CoinDCX",              domain: "coindcx.com" },
  { slug: "mudrex",               name: "Mudrex",               domain: "mudrex.com" },
  { slug: "cred",                 name: "CRED",                 domain: "cred.club" },
  { slug: "khatabook",            name: "Khatabook",            domain: "khatabook.com" },
  // ── Global Tech ──
  { slug: "pagerduty",            name: "PagerDuty",            domain: "pagerduty.com" },
  { slug: "linear",               name: "Linear",               domain: "linear.app" },
  { slug: "retool",               name: "Retool",               domain: "retool.com" },
];

// ── Upsert wrapper ────────────────────────────────────────────────────────────

function buildJobDoc(fields) {
  const { title, company, domain, applyUrl, postedAt, content, experience, sourcePlatform, location, isRemote } = fields;
  const exp     = experience || extractExp(title + " " + content);
  const level   = classifyLevel(title, content, exp);
  const wtype   = isRemote ? "Remote" : /hybrid/i.test(content) ? "Hybrid" : "Onsite";
  return {
    jobId:          makeJobId(applyUrl),
    title,
    company,
    logo:           `https://logo.clearbit.com/${domain}`,
    location:       location || "Global",
    type:           wtype,
    link:           applyUrl,
    platform:       sourcePlatform,
    sourcePlatform,
    postedAt:       new Date(postedAt || Date.now()),
    category:       classifyDeck(title),
    level,
    jobType:        levelToJobType(level),
    experience:     exp,
    workType:       wtype,
  };
}

// ── Greenhouse ────────────────────────────────────────────────────────────────

async function fetchGreenhouse(upsertFn) {
  console.log("🟢 [ATS:Greenhouse] Starting...");
  let saved = 0;

  for (const co of GREENHOUSE_COMPANIES) {
    try {
      const { data } = await axios.get(
        `https://boards-api.greenhouse.io/v1/boards/${co.slug}/jobs?content=true`,
        { timeout: 10_000 }
      );

      for (const j of data.jobs || []) {
        if (!isAllowedRole(j.title)) continue;

        const postedAt = new Date(j.updated_at || j.first_published || Date.now());
        if (!isWithin7Days(postedAt)) continue;

        const content  = (j.content || "").toLowerCase();
        const applyUrl = j.absolute_url.split("?")[0] + "#apply";

        await upsertFn(applyUrl, buildJobDoc({
          title:          j.title,
          company:        co.name,
          domain:         co.domain,
          applyUrl,
          postedAt,
          content,
          sourcePlatform: "Greenhouse",
          location:       j.location?.name || "Global",
          isRemote:       /remote|wfh/i.test(content),
        }));
        saved++;
      }
    } catch (_) { /* board unavailable — silently skip */ }
  }

  console.log(`✅ [ATS:Greenhouse] Done — ${saved} jobs upserted.`);
}

// ── Lever ─────────────────────────────────────────────────────────────────────

async function fetchLever(upsertFn) {
  console.log("🟡 [ATS:Lever] Starting...");
  let saved = 0;

  for (const co of LEVER_COMPANIES) {
    try {
      const { data } = await axios.get(
        `https://api.lever.co/v0/postings/${co.slug}?mode=json`,
        { timeout: 10_000 }
      );

      for (const j of Array.isArray(data) ? data : []) {
        if (!isAllowedRole(j.text)) continue;

        const postedAt = new Date(j.createdAt || Date.now());
        if (!isWithin7Days(postedAt)) continue;

        const content  = (
          (j.descriptionPlain || "") + " " + (j.additionalPlain || "")
        ).toLowerCase();
        const applyUrl = j.hostedUrl || j.applyUrl;
        if (!applyUrl) continue;

        const isRemote = /remote/i.test(j.categories?.commitment || "") ||
                         /remote/i.test(j.categories?.location || "");

        await upsertFn(applyUrl, buildJobDoc({
          title:          j.text,
          company:        co.name,
          domain:         co.domain,
          applyUrl,
          postedAt,
          content,
          sourcePlatform: "Lever",
          location:       j.categories?.location || "Global",
          isRemote,
        }));
        saved++;
      }
    } catch (_) { /* board unavailable */ }
  }

  console.log(`✅ [ATS:Lever] Done — ${saved} jobs upserted.`);
}

module.exports = { fetchGreenhouse, fetchLever };
