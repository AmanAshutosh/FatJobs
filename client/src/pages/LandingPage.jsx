import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LandingPage.css";

const LandingPage = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(300); // 300 seconds = 5 minutes

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 300));
    }, 1000);

    // If timer reaches 0, you could trigger a background fetch here
    if (timeLeft === 0) {
      console.log("Deck Sync Triggered...");
    }

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Convert seconds to MM:SS format
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="landing-container">
      <div className="bg-glow blob-1"></div>
      <div className="bg-glow blob-2"></div>

      <header className="hero-section">
        {/* FIXED: Added more margin and clear positioning */}
        <div className="live-status-container">
          <div className="status-pill">
            <span className="pulse-dot"></span>
            <span className="pill-text">LIVE DECK SYNC ACTIVE</span>
            <span className="divider">|</span>
            <span className="timer-text">
              REFRESH IN {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        <h1 className="main-logo">
          Fat<span className="logo-sync">Jobs</span>
        </h1>

        <p className="hero-subtitle">
          The ultimate job board for high-growth tech roles.
          <span className="highlight"></span>
        </p>
      </header>

      <div className="glass-button-group">
        <div className="glass-card sde-theme" onClick={() => navigate("/sde")}>
          <div className="glass-content">
            <div className="card-icon">💻</div>
            <div className="card-meta">ENGINEERING</div>
            <h2 className="card-title">SDE DECK</h2>
            <p className="card-desc">
              React · Node · Python · Cloud Architecture
            </p>
            <div className="card-action">
              <span>EXPLORE ROLES</span>
              <div className="mini-arrow">➜</div>
            </div>
          </div>
        </div>

        <div className="glass-card da-theme" onClick={() => navigate("/da")}>
          <div className="glass-content">
            <div className="card-icon">📊</div>
            <div className="card-meta">ANALYTICS</div>
            <h2 className="card-title">DATA DECK</h2>
            <p className="card-desc">
              SQL · Tableau · ML · Statistical Modeling
            </p>
            <div className="card-action">
              <span>EXPLORE ROLES</span>
              <div className="mini-arrow">➜</div>
            </div>
          </div>
        </div>
      </div>

      <div className="resume-cta-wrap">
        <div className="resume-cta-card" onClick={() => navigate("/resume")}>
          <div className="resume-cta-left">
            <span className="resume-cta-badge">⚡ NEW</span>
            <h3 className="resume-cta-title">Resume Analyzer</h3>
            <p className="resume-cta-desc">
              Get your ATS score, fix keyword gaps, rewrite weak bullets, and download an optimized resume — in seconds.
            </p>
          </div>
          <div className="resume-cta-right">
            <div className="resume-cta-stats">
              <span>ATS Score</span>
              <span>Keyword Gap</span>
              <span>Bullet Rewriter</span>
              <span>2025 Trends</span>
            </div>
            <div className="mini-arrow resume-cta-arrow">➜</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
