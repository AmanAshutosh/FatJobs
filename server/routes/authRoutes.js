const express = require("express");
const router = express.Router();
const User = require("../models/User");
const nodemailer = require("nodemailer");

const otpStore = new Map();

// Create the transporter ONCE outside the route for better performance
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail
    pass: process.env.EMAIL_PASS, // Your 16-digit App Password
  },
});

// Verify connection configuration on startup
transporter.verify(function (error, success) {
  if (error) {
    console.log("[SYSTEM] MAIL_SERVER_ERROR:", error);
  } else {
    console.log("[SYSTEM] MAIL_SERVER_READY: Waiting for users...");
  }
});

// 1. REQUEST OTP
router.post("/request-otp", async (req, res) => {
  const { email, name, isSignup } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (!isSignup && !userExists) {
      return res.status(404).json({ message: "IDENTITY_NOT_FOUND" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    // Store data for verification
    otpStore.set(email, {
      otp,
      fullName: name || (userExists ? userExists.name : "Agent"),
    });

    setTimeout(() => otpStore.delete(email), 5 * 60 * 1000);

    const mailOptions = {
      from: `"FAT_JOBS_SYSTEM" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "SECURITY_ACCESS_CODE",
      html: `
        <div style="background: #050810; color: #22c55e; padding: 40px; font-family: 'Courier New', monospace; border: 1px solid #22c55e; border-radius: 8px;">
          <h2 style="border-bottom: 1px solid #22c55e; padding-bottom: 10px; margin-top: 0;">[ ACCESS_PROTOCOL ]</h2>
          <p style="margin: 20px 0;">IDENTIFIED_AGENT: <span style="color: #fff;">${email}</span></p>
          <div style="font-size: 2.5rem; margin: 30px 0; font-weight: bold; letter-spacing: 8px; color: #38bdf8; text-align: center; border: 1px dashed rgba(56, 189, 248, 0.3); padding: 20px;">
            ${otp}
          </div>
          <p style="color: rgba(255,255,255,0.4); font-size: 0.8rem; text-align: center;">KEY EXPIRES IN 300 SECONDS.</p>
        </div>
      `,
    };

    // Actually send the email
    await transporter.sendMail(mailOptions);

    // We keep this log so YOU can see it works, but the user gets the email
    console.log(`\n[SYSTEM] SUCCESS: OTP delivered to ${email}\n`);

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("AUTH_ERROR:", err);
    res.status(500).json({ message: "MAIL_SERVER_OFFLINE" });
  }
});

// 2. VERIFY & FINALIZE
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
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      });
    } catch (err) {
      res.status(500).json({ message: "DATABASE_SYNC_FAILURE" });
    }
  } else {
    res.status(401).json({ success: false, message: "INVALID_KEY_MATCH" });
  }
});

module.exports = router;
