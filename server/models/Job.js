const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    link: { type: String, required: true, unique: true }, // unique prevents duplicates
    platform: { type: String, default: "Direct" },
    category: { type: String, enum: ["SDE", "DA"], default: "SDE" },
    experience: { type: String, default: "Not Specified" },
    workType: { type: String, default: "On-site" },
    location: { type: String, default: "India" },
    postedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

// Indexing for faster terminal searches
JobSchema.index({ title: "text", company: "text" });

module.exports = mongoose.model("Job", JobSchema);
