import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import JobCard from "../components/JobCard";
import API_URL from "../api";
import "../styles/SDE.css";

const SDE = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSDE = useCallback(async () => {
    try {
      setLoading(true);
      // Logic: Ensure we don't have double /api/api
      const cleanBase = API_URL.endsWith("/api")
        ? API_URL.replace("/api", "")
        : API_URL;
      const res = await axios.get(`${cleanBase}/api/jobs?category=SDE`);

      console.log("📡 SDE Deck Sync:", res.data);

      // Handle both raw arrays and nested object responses
      const jobData = Array.isArray(res.data) ? res.data : res.data.jobs || [];
      setJobs(jobData);
    } catch (err) {
      console.error("❌ SDE Fetch Error:", err);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSDE();
    window.addEventListener("focus", fetchSDE);
    return () => window.removeEventListener("focus", fetchSDE);
  }, [fetchSDE]);

  return (
    <div className="sde-container">
      <div className="sde-content-wrapper">
        <header className="sde-header-centered">
          <div className="role-pulse-badge">
            <div className="badge-dot"></div>
            {jobs.length} LIVE ROLES SYNCED
          </div>
          <h1>SDE DECK</h1>
          <p>
            The ultimate collection of high-growth Engineering roles from top
            tech firms.
          </p>
        </header>

        <div className="job-grid">
          {loading ? (
            <div className="loading-state">
              <h3>🚀 Syncing SDE Deck...</h3>
            </div>
          ) : jobs.length > 0 ? (
            jobs.map((job) => <JobCard key={job._id || job.link} job={job} />)
          ) : (
            <div className="sde-coming-soon-box">
              <h3>Deck Empty</h3>
              <p>
                The scraper is currently searching for new Engineering roles.
                Check back in a few minutes.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SDE;
