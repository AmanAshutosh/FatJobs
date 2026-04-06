import React, { useMemo } from "react";
import "../styles/JobCard.css";

const JobCard = ({ job }) => {
  const jobStats = useMemo(() => {
    // We use the date the job was actually posted on the original site
    const rawDate = job.postedAt || job.createdAt;
    const jobDate = new Date(rawDate);
    const now = new Date();

    // Calculate difference in hours
    const diffInHours = (now - jobDate.getTime()) / (1000 * 60 * 60);

    let sClass = "status-pulse";
    let label = "ACTIVE";

    // UPDATED LOGIC PER YOUR REQUEST:
    // 24 hrs = GREEN (Fresh)
    // 48 hrs = ORANGE (Recent)
    // 72 hrs = RED (Urgent/Older)

    if (diffInHours <= 24) {
      sClass += " hot"; // Green Pulse
      label = "NEW";
    } else if (diffInHours <= 48) {
      sClass += " warm"; // Orange Pulse
      label = "RECENT";
    } else if (diffInHours <= 72) {
      sClass += " urgent"; // Red Pulse
      label = "URGENT";
    } else {
      sClass += " cold"; // Blue/Grey (Older than 72h)
      label = "ARCHIVED";
    }

    const timeLabel =
      jobDate.toLocaleDateString([], {
        month: "short",
        day: "numeric",
      }) +
      " | " +
      jobDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

    return { sClass, timeLabel, label };
  }, [job.postedAt, job.createdAt]);

  // Production Safety: Don't render if job data is missing
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
          <div className="rating-stars">
            {[...Array(5)].map((_, i) => (
              <span key={i}>★</span>
            ))}
          </div>
        </div>

        {/* STATS SECTION */}
        <div className="card-stats">
          {[
            { key: "COMPANY", value: job.company || "TECH CORP" },
            { key: "EXPERIENCE", value: job.experience || "Not Specified" },
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
