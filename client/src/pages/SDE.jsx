import React, { useEffect, useState, useCallback } from "react";
import { fetchJobs } from "../api";
import JobCard from "../components/JobCard";
import "../styles/SDE.css";

const SDE = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. FILTER STATES
  const [searchTerm, setSearchTerm] = useState("");
  const [locFilter, setLocFilter] = useState("");
  const [timeFilter, setTimeFilter] = useState("168"); // Default 7 days

  const fetchSDEDeck = useCallback(
    async (hours = timeFilter) => {
      try {
        setLoading(true);
        // Fetch with current time window
        const res = await fetchJobs({ category: "SDE", hours: hours });
        const jobData = Array.isArray(res.data)
          ? res.data
          : res.data.jobs || [];
        setJobs(jobData);
      } catch (err) {
        console.error("❌ SDE Fetch Error:", err);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    },
    [timeFilter],
  );

  useEffect(() => {
    fetchSDEDeck();
    window.addEventListener("focus", () => fetchSDEDeck());
    return () => window.removeEventListener("focus", () => fetchSDEDeck());
  }, [fetchSDEDeck]);

  // 2. INSTANT FILTER LOGIC
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.title?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLocation =
      locFilter === "" ||
      job.location?.toLowerCase().includes(locFilter.toLowerCase());

    return matchesSearch && matchesLocation;
  });

  const handleTimeChange = (e) => {
    const val = e.target.value;
    setTimeFilter(val);
    fetchSDEDeck(val); // Re-fetch from backend with new time window
  };

  return (
    <div className="sde-container">
      <div className="sde-content-wrapper">
        <header className="sde-header-centered">
          <div className="role-pulse-badge">
            <div className="badge-dot"></div>
            {filteredJobs.length} LIVE ROLES SYNCED
          </div>
          <h1>SDE DECK</h1>
          <p>
            The ultimate collection of high-growth Engineering roles from top
            tech firms.
          </p>

          {/* 3. FILTER BAR SECTION */}
          <div className="filter-bar">
            <div className="filter-group">
              <label>Hunt Company / Role</label>
              <input
                type="text"
                placeholder="e.g. Coinbase..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label>Location</label>
              <select
                value={locFilter}
                onChange={(e) => setLocFilter(e.target.value)}
              >
                <option value="">All Locations</option>
                <option value="Remote">Remote</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Noida">Noida</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="USA">USA</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Recency</label>
              <select value={timeFilter} onChange={handleTimeChange}>
                <option value="24">Past 24 Hours</option>
                <option value="72">Past 3 Days</option>
                <option value="168">Past 7 Days</option>
              </select>
            </div>
          </div>
        </header>

        <div className="job-grid">
          {loading ? (
            <div className="loading-state">
              <h3>Syncing SDE Deck...</h3>
            </div>
          ) : filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <JobCard key={job._id || job.link} job={job} />
            ))
          ) : (
            <div className="sde-coming-soon-box">
              <h3>No Matches Found</h3>
              <p>Try adjusting your filters or checking a wider time range.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SDE;
