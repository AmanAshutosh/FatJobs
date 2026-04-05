import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import JobCard from "../components/JobCard";
import "../styles/SDE.css";

const SDE = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Memoized fetch function to prevent unnecessary re-renders
  const fetchSDE = useCallback(async () => {
    try {
      // We only show the full loader on the very first load
      const res = await axios.get(
        "http://localhost:5000/api/jobs?category=SDE",
      );
      setJobs(res.data);
    } catch (err) {
      console.error("Error fetching SDE jobs", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial Load
    fetchSDE();

    // FIX #4: REAL-TIME REFRESH ON WINDOW FOCUS
    // When the user switches back to this tab, it fetches the latest data instantly
    window.addEventListener("focus", fetchSDE);

    // Cleanup listener on unmount
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
