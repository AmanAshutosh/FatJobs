import React, { useMemo } from "react";
import "../styles/JobCard.css";

const JobCard = ({ job }) => {
  const jobStats = useMemo(() => {
    const jobDate = new Date(job.createdAt);
    const now = Date.now();
    const diffInHours = (now - jobDate.getTime()) / (1000 * 60 * 60);

    // FIX: If job is older than 24 hours, don't show it
    if (diffInHours > 24) return null;

    let sClass = "status-pulse";
    if (diffInHours <= 12) {
      sClass += " hot"; // Green
    } else {
      sClass += " warm"; // Orange
    }

    const timeLabel = jobDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    return { sClass, timeLabel };
  }, [job.createdAt]);

  // If the job is older than 24h, we return nothing
  if (!jobStats) return null;

  return (
    <div className="trump-card-wrapper">
      <div className="trump-card">
        {/* HEADER */}
        <div className="card-header">
          <div className="card-name-role">
            <h2>{job.title}</h2>
            <p className="card-platform-tag">
              {job.platform?.toUpperCase() || "DIRECT"}
            </p>
          </div>
          <div className="card-flag">
            <div className={jobStats.sClass} title="Job Status"></div>
          </div>
        </div>

        {/* VISUAL SECTION */}
        <div className="card-image-section">
          <div className="image-circle">
            <span className="title-preview">
              {job.company?.charAt(0) || "J"}
            </span>
          </div>
          <div className="rating-stars">
            {[...Array(5)].map((_, i) => (
              <span key={i}>★</span>
            ))}
          </div>
        </div>

        {/* STATS SECTION */}
        <div className="card-stats">
          {[
            { key: "COMPANY", value: job.company || "N/A" },
            { key: "EXPERIENCE", value: job.experience || "0-1 Years" },
            { key: "SETTING", value: job.workType || "On-site" },
            { key: "LOCATION", value: job.location || "India" },
            {
              key: "TYPE",
              value: job.category === "SDE" ? "Engineering" : "Analytics",
            },
            { key: "POSTED AT", value: jobStats.timeLabel },
            {
              key: "ID CODE",
              value: `#${job._id?.slice(-5).toUpperCase() || "LIVE"}`,
            },
          ].map((stat, index) => (
            <div className="stat-row" key={index}>
              <span className="stat-key">{stat.key}</span>
              <span className="stat-value">{stat.value}</span>
            </div>
          ))}
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
