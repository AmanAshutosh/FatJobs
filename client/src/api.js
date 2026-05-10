import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL || "https://fatjobs.onrender.com";

const API = axios.create({
  baseURL: API_URL, // We will add /api in the individual calls to be safe
});

export const fetchJobs = (params) => API.get("/api/jobs", { params });
export const triggerSync = () => API.get("/api/jobs/sync");

export default API;
