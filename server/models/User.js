const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    // Password removed because we use OTP-based login
    role: { type: String, default: "Full-Stack Developer" },
    location: { type: String, default: "India" },
    savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],
    appliedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],
    profileStrength: { type: Number, default: 50 },
    otpAttempts: { type: Number, default: 0 },
    lastOtpRequest: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", UserSchema);
