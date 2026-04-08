import React, { useMemo } from "react";
import "../styles/JobCard.css";

const JobCard = ({ job }) => {
  const jobStats = useMemo(() => {
    const rawDate = job.postedAt || job.createdAt || new Date();
    const jobDate = new Date(rawDate);
    const isValidDate = !isNaN(jobDate.getTime());
    const now = new Date();
    const diffInHours = isValidDate
      ? (now - jobDate.getTime()) / (1000 * 60 * 60)
      : 999;

    let sClass = "status-pulse";
    let label = "ACTIVE";
    let glowClass = "";
    let themeColor = "#64748b"; // Default Slate

    if (diffInHours <= 24) {
      sClass += " hot";
      label = "NEW";
      glowClass = "glow-green";
      themeColor = "#22c55e"; // Emerald
    } else if (diffInHours <= 72) {
      sClass += " warm";
      label = "RECENT";
      glowClass = "glow-orange";
      themeColor = "#f97316"; // Orange
    } else if (diffInHours <= 168) {
      sClass += " stable";
      label = "STABLE";
      glowClass = "glow-gray";
      themeColor = "#475569"; // Slate
    } else {
      sClass += " cold";
      label = "ARCHIVED";
      glowClass = "glow-dim";
      themeColor = "#94a3b8"; // Light Slate
    }

    const timeLabel = isValidDate
      ? jobDate.toLocaleDateString([], { month: "short", day: "numeric" }) +
        " | " +
        jobDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      : "Recently Synced";

    return { sClass, timeLabel, label, glowClass, themeColor };
  }, [job.postedAt, job.createdAt]);

  if (!job || !job.title) return null;

  return (
    <div className={`trump-card-wrapper ${jobStats.glowClass}`}>
      <div
        className="trump-card"
        style={{ "--card-glow-color": jobStats.themeColor }}
      >
        {/* HEADER */}
        <div className="card-header">
          <div className="card-name-role">
            <h2 title={job.title}>
              <i className="ri-terminal-box-line"></i> {job.title}
            </h2>
            <p className="card-platform-tag">
              <i className="ri-shield-check-line"></i>{" "}
              {job.platform?.toUpperCase() || "DIRECT"}
            </p>
          </div>
          <div className="card-flag">
            <div
              className={jobStats.sClass}
              style={{ backgroundColor: jobStats.themeColor }}
            ></div>
          </div>
        </div>

        {/* VISUAL SECTION */}
        <div className="card-image-section">
          <div
            className="image-circle"
            style={{ borderColor: jobStats.themeColor }}
          >
            <span>{job.company?.charAt(0) || "J"}</span>
          </div>
          <div className="rating-stars" style={{ color: jobStats.themeColor }}>
            ★★★★★
          </div>
        </div>

        {/* STATS SECTION */}
        <div className="card-stats">
          <div className="stat-row">
            <span className="stat-key">
              <i className="ri-building-line"></i> COMPANY
            </span>
            <span className="stat-value">{job.company || "TECH CORP"}</span>
          </div>
          <div className="stat-row">
            <span className="stat-key">
              <i className="ri-medal-line"></i> EXPERIENCE
            </span>
            <span className="stat-value">
              {job.experience || "Not Specified"}
            </span>
          </div>
          <div className="stat-row">
            <span className="stat-key">
              <i className="ri-map-pin-line"></i> LOCATION
            </span>
            <span className="stat-value">{job.location || "India"}</span>
          </div>
          <div className="stat-row">
            <span className="stat-key">
              <i className="ri-calendar-event-line"></i> POSTED
            </span>
            <span className="stat-value">{jobStats.timeLabel}</span>
          </div>
        </div>

        {/* FOOTER - THE FIX */}
        <div className="card-footer">
          <a
            href={job.link}
            target="_blank"
            rel="noopener noreferrer"
            className="apply-file-button"
          >
            <i className="ri-file-list-3-line"></i> VIEW APPLY FILE
          </a>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
