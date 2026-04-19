const crypto = require("crypto");

// ── Patterns ────────────────────────────────────────────────────────────────
const INTERN_RE = /intern(ship)?/i;

const FRESHER_RE =
  /\b(fresher|fresh\s*grad(uate)?|entry[\s-]?level|0[\s-]*[12]\s*(yr|year)s?|campus\s*(hire|recruit)|graduate\s*(hire|program|trainee)|new\s*grad(uate)?|no\s*exp(erience)?)\b/i;

const SDE2_RE =
  /\b(senior|sr\.?|lead|staff|principal|architect|sde[\s-]?[2-9]|[3-9]\+?\s*(yr|year)s?|1[0-9]\+?\s*(yr|year)s?)\b/i;

const DA_RE =
  /\b(data\s*(analyst|scientist|engineer|science)|analytics|bi\s+analyst|tableau|power\s*bi|looker|ml\s+engineer|machine\s*learning|nlp|llm)\b/i;

const ALLOWED_RE =
  /(software|sde|frontend|backend|fullstack|full[\s-]stack|data|developer|react|node|android|ios|python|java|golang|rust|blockchain|web3|solidity|smart\s*contract|defi|protocol|crypto|engineer|devops|cloud|security|intern)/i;

const BANNED_RE =
  /\b(sales|relationship\s*manager|hr|human\s*resource|marketing|operations\s*manager|finance|accountant|bpo|call\s*cent(er|re)|customer\s*care)\b/i;

// ── Exported helpers ─────────────────────────────────────────────────────────

/** Returns "Intern" | "Fresher" | "SDE-1" | "SDE-2+" | "DA" | "Other" */
function classifyLevel(title = "", content = "", experience = "") {
  if (INTERN_RE.test(title))                           return "Intern";
  if (FRESHER_RE.test(title + " " + experience))       return "Fresher";
  if (DA_RE.test(title))                               return "DA";
  if (SDE2_RE.test(title + " " + experience))          return "SDE-2+";
  if (ALLOWED_RE.test(title))                          return "SDE-1";
  return "Other";
}

/** Maps new level to legacy jobType for frontend backward compat */
function levelToJobType(level) {
  if (level === "Intern")  return "intern";
  if (level === "Fresher") return "fresher";
  return "experienced";
}

/** "SDE" | "DA" — which deck page this job belongs to */
function classifyDeck(title = "") {
  return DA_RE.test(title) ? "DA" : "SDE";
}

/** "GREEN" | "ORANGE" | "GREY" based on hours since posted */
function getStatusColor(postedAt) {
  const h = (Date.now() - new Date(postedAt).getTime()) / 3_600_000;
  if (h <= 24) return "GREEN";
  if (h <= 72) return "ORANGE";
  return "GREY";
}

/** lowercase "green" | "orange" | "grey" for frontend timeCategory compat */
function getTimeCategory(postedAt) {
  return getStatusColor(postedAt).toLowerCase();
}

/** Deterministic 24-char job ID from the apply URL */
function makeJobId(applyUrl) {
  return crypto.createHash("sha256").update(applyUrl).digest("hex").slice(0, 24);
}

/** True if the job is allowed through the tech-role filter */
function isAllowedRole(title = "") {
  return ALLOWED_RE.test(title) && !BANNED_RE.test(title);
}

/** True if postedAt is within the last 7 days */
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
function isWithin7Days(dateVal) {
  if (!dateVal) return false;
  return Date.now() - new Date(dateVal).getTime() <= SEVEN_DAYS_MS;
}

/** Extract "X years" string from free text */
function extractExp(text = "") {
  const m = text.match(/(\d+\s*(?:\+|-|to)?\s*\d*\s*(?:years?|yrs?))/i);
  return m ? m[0].trim() : "Not Specified";
}

/** Clearbit logo URL for a domain slug */
function logoUrl(slug) {
  return `https://logo.clearbit.com/${slug}.com`;
}

module.exports = {
  classifyLevel,
  classifyDeck,
  levelToJobType,
  getStatusColor,
  getTimeCategory,
  makeJobId,
  isAllowedRole,
  isWithin7Days,
  extractExp,
  logoUrl,
  SEVEN_DAYS_MS,
};
