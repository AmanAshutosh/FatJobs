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
      const res = await axios.get(`${API_URL}/api/jobs?category=SDE`);
      setJobs(res.data);
    } catch (err) {
      console.error("❌ SDE Fetch Error:", err);
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
          <p>The ultimate collection of high-growth Engineering roles.</p>
        </header>

        <div className="job-grid">
          {loading ? (
            <div className="loading-state">
              <h3>🚀 Syncing SDE Deck...</h3>
            </div>
          ) : jobs.length > 0 ? (
            jobs.map((job) => <JobCard key={job._id} job={job} />)
          ) : (
            <div className="sde-coming-soon-box">
              <h3>Deck Empty</h3>
              <p>
                Check back shortly; the scraper is currently refreshing the
                deck.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SDE;
