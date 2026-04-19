const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    link: { type: String, required: true, unique: true },
    platform: { type: String, default: "Direct" },
    category: { type: String, enum: ["SDE", "DA"], default: "SDE" },
    jobType: {
      type: String,
      enum: ["fresher", "intern", "experienced"],
      default: "experienced",
    },
    experience: { type: String, default: "Not Specified" },
    workType: { type: String, default: "On-site" },
    location: { type: String, default: "India" },
    postedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

JobSchema.index({ title: "text", company: "text" });

module.exports = mongoose.model("Job", JobSchema);
