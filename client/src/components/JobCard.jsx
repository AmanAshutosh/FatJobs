import React, { useMemo } from "react";
import "../styles/JobCard.css";

const LEVEL_META = {
  "Intern":  { label: "INTERNSHIP",    color: "#3b82f6" },
  "Fresher": { label: "FRESHER / GRAD", color: "#22c55e" },
  "SDE-1":   { label: "JUNIOR SDE",    color: "#f5e642" },
  "DA":      { label: "DATA ANALYST",  color: "#a855f7" },
  "SDE-2+":  { label: "EXPERIENCED",   color: "#f97316" },
  "Other":   { label: "ENGINEER",      color: "#64748b" },
};

const SOURCE_COLORS = {
  LinkedIn:       "#0a66c2",
  Naukri:         "#ff7555",
  Greenhouse:     "#3dba56",
  Lever:          "#2e6df5",
  Internshala:    "#14b8a6",
  WeWorkRemotely: "#334155",
  Indeed:         "#2164f3",
  Remotive:       "#6d28d9",
  CryptoJobsList: "#f59e0b",
  Wellfound:      "#ef4444",
};

const JobCard = ({ job }) => {
  // Capture once per render — avoids the react-hooks/purity lint error
  const now = new Date().getTime();

  const timeData = useMemo(() => {
    if (job.timeCategory) {
      const map = {
        green:  { color: "#22c55e", glow: "0 0 24px rgba(34,197,94,0.55)",  label: "LIVE",   stars: 3 },
        orange: { color: "#f97316", glow: "0 0 24px rgba(249,115,22,0.5)",  label: "RECENT", stars: 2 },
        grey:   { color: "#64748b", glow: "0 0 14px rgba(100,116,139,0.3)", label: "STABLE", stars: 1 },
      };
      return map[job.timeCategory] ?? map.grey;
    }
    const posted = new Date(job.postedAt || job.createdAt || now).getTime();
    const h = (now - posted) / 3_600_000;
    if (h <= 24) return { color: "#22c55e", glow: "0 0 24px rgba(34,197,94,0.55)",  label: "LIVE",   stars: 3 };
    if (h <= 72) return { color: "#f97316", glow: "0 0 24px rgba(249,115,22,0.5)",  label: "RECENT", stars: 2 };
    return             { color: "#64748b", glow: "0 0 14px rgba(100,116,139,0.3)", label: "STABLE", stars: 1 };
  }, [job.timeCategory, job.postedAt, job.createdAt, now]);

  const timeLabel = useMemo(() => {
    const d = new Date(job.postedAt || job.createdAt || now);
    if (isNaN(d.getTime())) return "Recently";
    const h = (now - d.getTime()) / 3_600_000;
    if (h < 1)  return "< 1 hour ago";
    if (h < 24) return `${Math.floor(h)}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  }, [job.postedAt, job.createdAt, now]);

  const levelMeta    = LEVEL_META[job.level] ?? LEVEL_META["Other"];
  const sourceColor  = SOURCE_COLORS[job.sourcePlatform || job.platform] ?? "#334155";
  const sourceName   = (job.sourcePlatform || job.platform || "DIRECT").toUpperCase();
  const rating       = timeData.stars === 3 ? 99 : timeData.stars === 2 ? 75 : 50;
  const companyInit  = (job.company || "J").charAt(0).toUpperCase();

  if (!job?.title) return null;

  return (
    <div
      className="trump-card"
      style={{ "--border": timeData.color, "--glow": timeData.glow }}
    >
      {/* ── Header (light strip like the real card) ── */}
      <div className="tc-header">
        <div className="tc-title-block">
          <h2 className="tc-job-title">{job.title}</h2>
          <p className="tc-level" style={{ color: levelMeta.color }}>
            {levelMeta.label}
          </p>
        </div>
        <div className="tc-source-flag" style={{ background: sourceColor }}>
          {job.logo
            ? <img src={job.logo} alt={sourceName}
                onError={(e) => { e.currentTarget.parentElement.innerHTML = `<span>${sourceName.slice(0,2)}</span>`; }} />
            : <span>{sourceName.slice(0, 2)}</span>
          }
        </div>
      </div>

      {/* ── Photo circle section ── */}
      <div className="tc-photo-section">
        {/* FATJOBS badge (top-left of circle, like "TOP TRUMP" in original) */}
        <div className="tc-brand-badge">
          <span className="tc-brand-top">FAT</span>
          <span className="tc-brand-bot">JOBS</span>
        </div>

        {/* Circular avatar with colored ring */}
        <div className="tc-avatar-ring" style={{ borderColor: timeData.color, boxShadow: timeData.glow }}>
          {job.logo ? (
            <img
              className="tc-logo-img"
              src={job.logo}
              alt={job.company}
              onError={(e) => {
                e.currentTarget.style.display = "none";
                e.currentTarget.nextElementSibling.style.display = "flex";
              }}
            />
          ) : null}
          <div
            className="tc-avatar-init"
            style={{
              display: job.logo ? "none" : "flex",
              color: timeData.color,
            }}
          >
            {companyInit}
          </div>
        </div>

        {/* Stars below the circle (freshness rating) */}
        <div className="tc-stars">
          {[1, 2, 3].map((i) => (
            <span
              key={i}
              className="tc-star"
              style={{ color: i <= timeData.stars ? timeData.color : "#1a2a42" }}
            >
              ★
            </span>
          ))}
        </div>

        {/* Status chip */}
        <div
          className="tc-status-chip"
          style={{ color: timeData.color, borderColor: timeData.color }}
        >
          ● {timeData.label}
        </div>
      </div>

      {/* ── Stats table (the "trump" stats — like Year Born / Total Runs) ── */}
      <div className="tc-stats">
        <div className="tc-stat-row">
          <span className="tc-stat-key">COMPANY</span>
          <span className="tc-stat-val">{job.company || "—"}</span>
        </div>
        <div className="tc-stat-row">
          <span className="tc-stat-key">LOCATION</span>
          <span className="tc-stat-val">{job.location || "India"}</span>
        </div>
        <div className="tc-stat-row">
          <span className="tc-stat-key">WORK MODE</span>
          <span className="tc-stat-val">{job.workType || job.type || "On-site"}</span>
        </div>
        <div className="tc-stat-row">
          <span className="tc-stat-key">EXPERIENCE</span>
          <span className="tc-stat-val">{job.experience || "0–2 Years"}</span>
        </div>
        <div className="tc-stat-row">
          <span className="tc-stat-key">POSTED</span>
          <span className="tc-stat-val" style={{ color: timeData.color }}>
            {timeLabel}
          </span>
        </div>
        <div className="tc-stat-row">
          <span className="tc-stat-key">FATJOBS RATING</span>
          <span className="tc-stat-val" style={{ color: timeData.color, fontWeight: 900 }}>
            {rating}
          </span>
        </div>
      </div>

      {/* ── Footer (like the "Top Trumps File" description box) ── */}
      <div className="tc-footer">
        <p className="tc-footer-label">FATJOBS FILE</p>
        <a
          href={job.link || job.applyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="tc-apply-btn"
          style={{ "--btn-bg": timeData.color, "--btn-glow": timeData.glow }}
        >
          APPLY NOW →
        </a>
      </div>
    </div>
  );
};

export default JobCard;
