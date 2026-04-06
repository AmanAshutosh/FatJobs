const express = require("express");
const router = express.Router();
const User = require("../models/User");
const nodemailer = require("nodemailer");

// In-memory store for OTPs
const otpStore = new Map();

// 1. SECURE TRANSPORTER CONFIGURATION
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // MUST be 16-digit App Password
  },
  // ADDED: Timeout settings to prevent the server from hanging
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 15000,
});

// Verify connection on boot
transporter.verify((error) => {
  if (error) {
    console.log(
      "⚠️ [MAIL] Connection issue: Server will log OTPs to console as fallback.",
    );
  } else {
    console.log("✅ [MAIL] Server is online and ready.");
  }
});

// 2. REQUEST OTP
router.post("/request-otp", async (req, res) => {
  const { email, name, isSignup } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (!isSignup && !userExists) {
      return res.status(404).json({ message: "IDENTITY_NOT_FOUND" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    // Store data (Expires in 5 mins)
    otpStore.set(email, {
      otp,
      fullName: name || (userExists ? userExists.name : "Agent"),
    });
    setTimeout(() => otpStore.delete(email), 5 * 60 * 1000);

    // Prepare Email Content
    const mailOptions = {
      from: `"FAT_JOBS_SYSTEM" <${process.env.EMAIL_USER}>`,
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
    };

    // 🔥 THE PRO FIX: Remove 'await' from the email sending.
    // This prevents the "ETIMEDOUT" from blocking the user response.
    transporter.sendMail(mailOptions).catch((err) => {
      console.error(`❌ [MAIL_ERROR] Failed to send to ${email}:`, err.message);
    });

    // 🕵️ BACKDOOR: Always log the OTP to the Railway console
    // This allows YOU to log in even if Gmail blocks the connection!
    console.log(`\n🔑 [SECURITY] OTP for ${email}: ${otp}\n`);

    // Respond to user immediately
    res.status(200).json({ success: true, message: "PROTOCOL_INITIALIZED" });
  } catch (err) {
    console.error("AUTH_ERROR:", err);
    res.status(500).json({ message: "SYSTEM_FAILURE" });
  }
});

// 3. VERIFY & FINALIZE
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;
  const storedData = otpStore.get(email);

  if (!storedData) {
    return res.status(410).json({ success: false, message: "KEY_EXPIRED" });
  }

  // Convert both to strings to ensure match
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
