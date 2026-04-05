const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: String,
    company: String,
    link: { type: String, unique: true, index: true },
    platform: String,
    category: String,
    experience: { type: String, default: "Not Specified" },
    workType: { type: String, default: "On-site" },
    location: { type: String, default: "India" },
    postedAt: { type: Date, default: Date.now }, // Use this for filtering
  },
  { timestamps: true },
);

module.exports = mongoose.model("Job", jobSchema);
