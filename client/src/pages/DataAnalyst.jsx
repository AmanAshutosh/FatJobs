import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import JobCard from "../components/JobCard";
import API_URL from "../api";
import "../styles/DataAnalyst.css";

const DataAnalyst = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDAJobs = useCallback(async () => {
    try {
      // Requesting only DA category from Railway
      const response = await axios.get(`${API_URL}/api/jobs?category=DA`);

      if (Array.isArray(response.data)) {
        setJobs(response.data);
      } else {
        setJobs([]);
      }
    } catch (error) {
      console.error("❌ DA Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDAJobs();
    // Re-sync when user returns to tab
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
