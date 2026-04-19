import React, { useMemo } from "react";
import "../styles/JobCard.css";

const JOB_TYPE_META = {
  fresher: { label: "FRESHER", color: "#22c55e" },
  intern:  { label: "INTERN",  color: "#3b82f6" },
  experienced: { label: "EXPERIENCED", color: "#f5e642" },
};

const JobCard = ({ job }) => {
  const timeData = useMemo(() => {
    // Use server-computed timeCategory if available, else compute locally
    if (job.timeCategory) {
      const map = {
        green:  { color: "var(--green)",  label: "NEW",    glow: "var(--green-glow)",  pulse: "hot" },
        orange: { color: "var(--orange)", label: "RECENT", glow: "var(--orange-glow)", pulse: "warm" },
        grey:   { color: "var(--grey)",   label: "STABLE", glow: "var(--grey-glow)",   pulse: "stable" },
      };
      return map[job.timeCategory] || map.grey;
    }

    const rawDate = job.postedAt || job.createdAt || new Date();
    const diffHours = (Date.now() - new Date(rawDate).getTime()) / 3600000;

    if (diffHours <= 24) return { color: "var(--green)",  label: "NEW",    glow: "var(--green-glow)",  pulse: "hot" };
    if (diffHours <= 48) return { color: "var(--orange)", label: "RECENT", glow: "var(--orange-glow)", pulse: "warm" };
    return              { color: "var(--grey)",   label: "STABLE", glow: "var(--grey-glow)",   pulse: "stable" };
  }, [job.timeCategory, job.postedAt, job.createdAt]);

  const timeLabel = useMemo(() => {
    const d = new Date(job.postedAt || job.createdAt || Date.now());
    if (isNaN(d.getTime())) return "Recently Synced";
    return (
      d.toLocaleDateString([], { month: "short", day: "numeric" }) +
      " · " +
      d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true })
    );
  }, [job.postedAt, job.createdAt]);

  const jobTypeMeta = JOB_TYPE_META[job.jobType] || JOB_TYPE_META.experienced;

  if (!job?.title) return null;

  return (
    <div className="job-card" style={{ "--accent": timeData.color, "--glow": timeData.glow }}>
      {/* Top accent line colored by timeCategory */}
      <div className="card-accent-line" />

      {/* Header */}
      <div className="card-top">
        <div className="company-avatar" style={{ borderColor: timeData.color }}>
          {job.company?.charAt(0) || "J"}
        </div>

        <div className="card-title-block">
          <h3 className="card-job-title" title={job.title}>{job.title}</h3>
          <p className="card-company">{job.company || "TECH CORP"}</p>
        </div>

        {/* Status pulse */}
        <div className={`status-dot ${timeData.pulse}`}
          style={{ background: timeData.color, boxShadow: timeData.glow }} />
      </div>

      {/* Badges row */}
      <div className="card-badges">
        <span className="badge time-badge" style={{ color: timeData.color, borderColor: timeData.color }}>
          {timeData.label}
        </span>
        <span className="badge type-badge" style={{ color: jobTypeMeta.color, borderColor: jobTypeMeta.color }}>
          {jobTypeMeta.label}
        </span>
        <span className="badge source-badge">
          {job.platform?.toUpperCase() || "DIRECT"}
        </span>
      </div>

      {/* Stats */}
      <div className="card-stats">
        <div className="stat-row">
          <span className="stat-key"><i className="ri-map-pin-line" /> LOCATION</span>
          <span className="stat-val">{job.location || "India"}</span>
        </div>
        <div className="stat-row">
          <span className="stat-key"><i className="ri-briefcase-line" /> WORK MODE</span>
          <span className="stat-val">{job.workType || "On-site"}</span>
        </div>
        <div className="stat-row">
          <span className="stat-key"><i className="ri-medal-line" /> EXPERIENCE</span>
          <span className="stat-val">{job.experience || "Not Specified"}</span>
        </div>
        <div className="stat-row">
          <span className="stat-key"><i className="ri-time-line" /> POSTED</span>
          <span className="stat-val" style={{ color: timeData.color }}>{timeLabel}</span>
        </div>
      </div>

      {/* Apply Button */}
      <div className="card-footer">
        <a
          href={job.link}
          target="_blank"
          rel="noopener noreferrer"
          className="apply-btn"
        >
          <i className="ri-external-link-line" /> APPLY NOW
        </a>
      </div>
    </div>
  );
};

export default JobCard;
