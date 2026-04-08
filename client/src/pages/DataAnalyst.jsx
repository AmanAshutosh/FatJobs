import React, { useEffect, useState, useCallback } from "react";
// 1. Import the fetchJobs helper directly from your api.js
import { fetchJobs } from "../api";
import JobCard from "../components/JobCard";
import "../styles/DataAnalyst.css";

const DataAnalyst = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDAJobs = useCallback(async () => {
    try {
      setLoading(true);

      // 2. Use the helper function with the "DA" category
      // It handles the baseURL and "/api/jobs" automatically
      const res = await fetchJobs({ category: "DA" });

      console.log("📡 DA Deck Sync Data:", res.data);

      // 3. Robust data check to prevent "Deck Empty" on weird API responses
      const jobData = Array.isArray(res.data) ? res.data : res.data.jobs || [];
      setJobs(jobData);
    } catch (error) {
      console.error("❌ DA Fetch Error:", error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDAJobs();
    // Refresh when user comes back to the tab
    window.addEventListener("focus", fetchDAJobs);
    return () => window.removeEventListener("focus", fetchDAJobs);
  }, [fetchDAJobs]);

  return (
    <div className="da-container">
      <div className="da-content-wrapper">
        <header className="da-header-centered">
          <div className="da-pulse-badge">
            <div className="da-badge-dot"></div>
            {jobs.length} LIVE DATA ROLES
          </div>
          <h1>DATA DECK</h1>
          <p>
            Real-time stream of Data Science and Analytics roles from top tech
            firms.
          </p>
        </header>

        <div className="job-grid">
          {loading ? (
            <div className="loading-state">
              <h3 className="da-sync-text">🚀 Syncing Data Deck...</h3>
            </div>
          ) : jobs.length > 0 ? (
            jobs.map((job) => <JobCard key={job._id || job.link} job={job} />)
          ) : (
            <div className="coming-soon-box">
              <h3>Deck Empty</h3>
              <p>
                The scraper is currently searching for new Data roles. Check
                back in a few minutes.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataAnalyst;
