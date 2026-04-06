// client/src/components/JobCard.jsx
import React, { useMemo } from "react";
import "../styles/JobCard.css";

const JobCard = ({ job }) => {
  const jobStats = useMemo(() => {
    const rawDate = job.postedAt || job.createdAt;
    const jobDate = new Date(rawDate);
    const now = new Date();
    const diffInHours = (now - jobDate.getTime()) / (1000 * 60 * 60);

    let sClass = "status-pulse";
    let label = "ACTIVE";

    // YOUR NEW LOGIC:
    // 0-24h = GREEN
    // 24-48h = ORANGE
    // 48-72h = RED
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
      sClass += " cold"; // Grey
      label = "OLD";
    }

    const timeLabel = jobDate.toLocaleDateString([], {
      month: "short",
      day: "numeric",
    });
    return { sClass, timeLabel, label };
  }, [job.postedAt, job.createdAt]);

  if (!job) return null;

  return (
    <div className="trump-card-wrapper">
      <div className="trump-card">
        <div className="card-header">
          <div className="card-name-role">
            <h2>{job.title}</h2>
            <p className="card-platform-tag">
              {job.platform?.toUpperCase() || "DIRECT"}
            </p>
          </div>
          <div className="card-flag">
            <div className={jobStats.sClass}></div>
          </div>
        </div>

        <div className="card-image-section">
          <div className="image-circle">
            <span>{job.company?.charAt(0) || "J"}</span>
          </div>
          <div className="rating-stars">★★★★★</div>
        </div>

        <div className="card-stats">
          <div className="stat-row">
            <span className="stat-key">COMPANY</span>
            <span className="stat-value">{job.company}</span>
          </div>
          <div className="stat-row">
            <span className="stat-key">EXPERIENCE</span>
            <span className="stat-value">{job.experience}</span>
          </div>
          <div className="stat-row">
            <span className="stat-key">LOCATION</span>
            <span className="stat-value">{job.location}</span>
          </div>
          <div className="stat-row">
            <span className="stat-key">POSTED</span>
            <span className="stat-value">{jobStats.timeLabel}</span>
          </div>
        </div>

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
