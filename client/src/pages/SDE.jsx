import React, { useEffect, useState, useCallback } from "react";
import { fetchJobs } from "../api";
import JobCard from "../components/JobCard";
import "../styles/SDE.css";

const SDE = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [locFilter,  setLocFilter]  = useState("");
  const [timeFilter, setTimeFilter] = useState("168");
  const [typeFilter, setTypeFilter] = useState(""); // fresher | intern | experienced

  const fetchSDEDeck = useCallback(
    async (hours = timeFilter, jobType = typeFilter) => {
      try {
        setLoading(true);
        const res = await fetchJobs({ category: "SDE", hours, ...(jobType && { jobType }) });
        const jobData = Array.isArray(res.data) ? res.data : res.data.jobs || [];
        setJobs(jobData);
      } catch (err) {
        console.error("SDE Fetch Error:", err);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    },
    [timeFilter, typeFilter],
  );

  useEffect(() => {
    fetchSDEDeck();
    const onFocus = () => fetchSDEDeck();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [fetchSDEDeck]);

  const filteredJobs = jobs.filter((job) => {
    const matchSearch =
      !searchTerm ||
      job.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.title?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchLoc =
      !locFilter ||
      job.location?.toLowerCase().includes(locFilter.toLowerCase());

    return matchSearch && matchLoc;
  });

  const handleTimeChange = (e) => {
    const val = e.target.value;
    setTimeFilter(val);
    fetchSDEDeck(val, typeFilter);
  };

  const handleTypeChange = (e) => {
    const val = e.target.value;
    setTypeFilter(val);
    fetchSDEDeck(timeFilter, val);
  };

  return (
    <div className="deck-container">
      <div className="deck-wrapper">

        <header className="deck-header">
          <div className="deck-badge">
            <div className="badge-dot" />
            {filteredJobs.length} LIVE ROLES
          </div>
          <h1 className="deck-title">SDE DECK</h1>
          <p className="deck-sub">
            High-growth Engineering roles from top tech firms — refreshed every 2 hours.
          </p>

          {/* Filter Bar */}
          <div className="filter-bar">
            <div className="filter-group">
              <label>Search</label>
              <input
                type="text"
                placeholder="Company or role…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label>Location</label>
              <select value={locFilter} onChange={(e) => setLocFilter(e.target.value)}>
                <option value="">All Locations</option>
                <option value="Remote">Remote</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Noida">Noida</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="USA">USA</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Job Type</label>
              <select value={typeFilter} onChange={handleTypeChange}>
                <option value="">All Types</option>
                <option value="fresher">Fresher / Entry-level</option>
                <option value="intern">Internship</option>
                <option value="experienced">Experienced</option>
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
            <div className="deck-loading">
              <div className="loading-spinner" />
              <p>Syncing SDE Deck…</p>
            </div>
          ) : filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <JobCard key={job._id || job.link} job={job} />
            ))
          ) : (
            <div className="deck-empty">
              <h3>No Roles Found</h3>
              <p>Try adjusting filters or expanding the time range.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default SDE;
