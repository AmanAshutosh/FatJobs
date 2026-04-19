const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema(
  {
    // ── NEW OUTPUT SCHEMA FIELDS ─────────────────────────────────────────
    jobId: { type: String, unique: true, sparse: true }, // SHA-256(applyUrl)[:24]
    logo:  { type: String, default: "" },                // Clearbit logo URL

    /** "Intern" | "Fresher" | "SDE-1" | "SDE-2+" | "DA" | "Other" */
    level: {
      type: String,
      enum: ["Intern", "Fresher", "SDE-1", "SDE-2+", "DA", "Other"],
      default: "SDE-1",
    },

    /** "Remote" | "Onsite" | "Hybrid" */
    type: {
      type: String,
      enum: ["Remote", "Onsite", "Hybrid"],
      default: "Onsite",
    },

    /** Canonical source label: "Greenhouse", "Lever", "LinkedIn", "Naukri", etc. */
    sourcePlatform: { type: String, default: "Direct" },

    // ── EXISTING FIELDS (kept for backward compat) ───────────────────────
    title:    { type: String, required: true },
    company:  { type: String, required: true },
    link:     { type: String, required: true, unique: true }, // canonical apply URL
    platform: { type: String, default: "Direct" },            // legacy alias
    category: { type: String, enum: ["SDE", "DA"], default: "SDE" }, // deck routing
    jobType:  {
      type: String,
      enum: ["fresher", "intern", "experienced"],
      default: "experienced",
    },
    experience: { type: String, default: "Not Specified" },
    workType:   { type: String, default: "Onsite" },          // legacy alias for type
    location:   { type: String, default: "India" },
    postedAt:   { type: Date,   default: Date.now, index: true },
  },
  { timestamps: true },
);

// ── Indexes ───────────────────────────────────────────────────────────────────
JobSchema.index({ title: "text", company: "text" });

// MongoDB TTL — auto-delete documents 7 days after postedAt
JobSchema.index({ postedAt: 1 }, { expireAfterSeconds: 7 * 24 * 60 * 60 });

module.exports = mongoose.model("Job", JobSchema);
