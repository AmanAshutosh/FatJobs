const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { Resend } = require("resend");

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);
const otpStore = new Map();

// 1. REQUEST OTP
router.post("/request-otp", async (req, res) => {
  const { email, name, isSignup } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (!isSignup && !userExists) {
      return res.status(404).json({ message: "IDENTITY_NOT_FOUND" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    otpStore.set(email, {
      otp,
      fullName: name || (userExists ? userExists.name : "Agent"),
    });
    setTimeout(() => otpStore.delete(email), 5 * 60 * 1000);

    // 🔥 THE PRODUCTION FIX: Using Resend HTTP API
    const { data, error } = await resend.emails.send({
      from: "FatJobs <onboarding@resend.dev>",
      to: email,
      subject: "SECURITY_ACCESS_CODE",
      html: `
        <div style="background: #050810; color: #22c55e; padding: 40px; font-family: monospace; border: 1px solid #22c55e;">
          <h2>[ ACCESS_PROTOCOL ]</h2>
          <p>AGENT_ID: ${email}</p>
          <div style="font-size: 2.5rem; margin: 20px 0; color: #38bdf8; text-align: center; border: 1px dashed #38bdf8; padding: 10px;">
            ${otp}
          </div>
          <p style="font-size: 0.7rem;">EXPIRES IN 300 SECONDS.</p>
        </div>
      `,
    });

    if (error) {
      console.error("❌ [RESEND_ERROR]:", error);
      // Fallback: Still log to console so YOU can see it in Railway logs
      console.log(`🔑 [BACKDOOR] OTP for ${email}: ${otp}`);
      return res.status(500).json({ message: "MAIL_SERVER_OFFLINE" });
    }

    console.log(`✅ [MAIL] OTP sent via Resend to ${email}`);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("AUTH_ERROR:", err);
    res.status(500).json({ message: "SYSTEM_FAILURE" });
  }
});

// 2. VERIFY & FINALIZE (Same as before)
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;
  const storedData = otpStore.get(email);

  if (!storedData) {
    return res.status(410).json({ success: false, message: "KEY_EXPIRED" });
  }

  if (storedData.otp.toString() === otp.toString()) {
    try {
      let user = await User.findOne({ email });
      if (!user) {
        user = new User({
          email,
          name: storedData.fullName || "New Agent",
          role: "Full-Stack Developer",
          location: "India",
        });
        await user.save();
      }
      otpStore.delete(email);
      res.status(200).json({
        success: true,
        user: { id: user._id, email: user.email, name: user.name },
      });
    } catch (err) {
      res.status(500).json({ message: "DATABASE_SYNC_FAILURE" });
    }
  } else {
    res.status(401).json({ success: false, message: "INVALID_KEY_MATCH" });
  }
});

module.exports = router;
