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

    if (diffInHours <= 24) {
      sClass += " hot";
      label = "NEW";
    } else if (diffInHours <= 48) {
      sClass += " warm";
      label = "RECENT";
    } else if (diffInHours <= 72) {
      sClass += " urgent";
      label = "URGENT";
    } else {
      sClass += " cold";
      label = "ARCHIVED";
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

    return { sClass, timeLabel, label };
  }, [job.postedAt, job.createdAt]);

  if (!job || !job.title) return null;

  return (
    <div className="trump-card-wrapper">
      <div className="trump-card">
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
              <i className="ri-calendar-event-line"></i> POSTED AT
            </span>
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
            <i className="ri-file-list-3-line"></i> VIEW APPLY FILE
          </a>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
