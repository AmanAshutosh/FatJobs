import React, { useEffect, useState, useCallback } from "react";
import { fetchJobs } from "../api";
import JobCard from "../components/JobCard";
import "../styles/DataAnalyst.css";

const DataAnalyst = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. FILTER STATES
  const [searchTerm, setSearchTerm] = useState("");
  const [locFilter, setLocFilter] = useState("");
  const [timeFilter, setTimeFilter] = useState("168"); // Default 7 days

  const fetchDAJobs = useCallback(
    async (hours = timeFilter) => {
      try {
        setLoading(true);
        const res = await fetchJobs({ category: "DA", hours: hours });
        const jobData = Array.isArray(res.data)
          ? res.data
          : res.data.jobs || [];
        setJobs(jobData);
      } catch (error) {
        console.error("❌ DA Fetch Error:", error);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    },
    [timeFilter],
  );

  useEffect(() => {
    fetchDAJobs();
    window.addEventListener("focus", () => fetchDAJobs());
    return () => window.removeEventListener("focus", () => fetchDAJobs());
  }, [fetchDAJobs]);

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
    fetchDAJobs(val); // Re-fetch from backend
  };

  return (
    <div className="da-container">
      <div className="da-content-wrapper">
        <header className="da-header-centered">
          <div className="da-pulse-badge">
            <div className="da-badge-dot"></div>
            {filteredJobs.length} LIVE DATA ROLES
          </div>
          <h1>DATA DECK</h1>
          <p>
            Real-time stream of Data Science and Analytics roles from top tech
            firms.
          </p>

          {/* 3. FILTER BAR (Aligned with Blue Branding) */}
          <div className="da-filter-bar">
            <div className="da-filter-group">
              <label>Search Company / Role</label>
              <input
                type="text"
                placeholder="e.g. InMobi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="da-filter-group">
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
                <option value="India">India</option>
              </select>
            </div>

            <div className="da-filter-group">
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
              <h3 className="da-sync-text">🚀 Syncing Data Deck...</h3>
            </div>
          ) : filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <JobCard key={job._id || job.link} job={job} />
            ))
          ) : (
            <div className="coming-soon-box">
              <h3>No Matches Found</h3>
              <p>Try adjusting your search or recency filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataAnalyst;
