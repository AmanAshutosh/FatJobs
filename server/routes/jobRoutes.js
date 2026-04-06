import React, { useMemo } from "react";
import "../styles/JobCard.css";

const JobCard = ({ job }) => {
  const jobStats = useMemo(() => {
    // 1. FAIL-SAFE DATE SELECTION
    // We try postedAt, then createdAt, then fallback to "Now" to prevent crashing
    const rawDate = job.postedAt || job.createdAt || new Date();
    const jobDate = new Date(rawDate);

    // Check if the date is actually valid
    const isValidDate = !isNaN(jobDate.getTime());
    const now = new Date();
    const diffInHours = isValidDate
      ? (now - jobDate.getTime()) / (1000 * 60 * 60)
      : 999;

    let sClass = "status-pulse";
    let label = "ACTIVE";

    // 2. THE 24/48/72 LOGIC (Strictly for Pulse Color)
    if (diffInHours <= 24) {
      sClass += " hot"; // Green
      label = "NEW";
    } else if (diffInHours <= 48) {
      sClass += " warm"; // Orange
      label = "RECENT";
    } else if (diffInHours <= 72) {
      sClass += " urgent"; // Red
      label = "URGENT";
    } else {
      sClass += " cold"; // Grey/Blue
      label = "ARCHIVED";
    }

    // 3. FORMAT TIME (With Fallback for invalid dates)
    const timeLabel = isValidDate
      ? jobDate.toLocaleDateString([], { month: "short", day: "numeric" }) +
        " | " +
        jobDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      : "Recently Synced";

    return { sClass, timeLabel, label };
  }, [job.postedAt, job.createdAt]);

  // FINAL RENDER GUARD: Ensure we always return a DIV if the job exists
  if (!job || !job.title) return null;

  return (
    <div className="trump-card-wrapper">
      <div className="trump-card">
        {/* HEADER */}
        <div className="card-header">
          <div className="card-name-role">
            <h2 title={job.title}>{job.title}</h2>
            <p className="card-platform-tag">
              {job.platform?.toUpperCase() || "DIRECT"}
            </p>
          </div>
          <div className="card-flag">
            <div
              className={jobStats.sClass}
              title={`Status: ${jobStats.label}`}
            ></div>
          </div>
        </div>

        {/* VISUAL SECTION */}
        <div className="card-image-section">
          <div className="image-circle">
            <span className="title-preview">
              {job.company?.charAt(0) || "J"}
            </span>
          </div>
          <div className="rating-stars">★★★★★</div>
        </div>

        {/* STATS SECTION */}
        <div className="card-stats">
          <div className="stat-row">
            <span className="stat-key">COMPANY</span>
            <span className="stat-value">{job.company || "TECH CORP"}</span>
          </div>
          <div className="stat-row">
            <span className="stat-key">EXPERIENCE</span>
            <span className="stat-value">
              {job.experience || "Not Specified"}
            </span>
          </div>
          <div className="stat-row">
            <span className="stat-key">LOCATION</span>
            <span className="stat-value">{job.location || "India"}</span>
          </div>
          <div className="stat-row">
            <span className="stat-key">POSTED AT</span>
            <span className="stat-value">{jobStats.timeLabel}</span>
          </div>
        </div>

        {/* FOOTER */}
        <div className="card-footer">
          <a
            href={job.link}
            target="_blank"
            rel="noopener noreferrer"
            className="apply-file-button"
          >
            VIEW APPLY FILE
          </a>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
