// frontend/src/api.js
import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL || "https://fatjobs-production.up.railway.app";

// Ensure the baseURL points to the /api suffix
const API = axios.create({
  baseURL: `${API_URL}/api`,
});

export const fetchJobs = (params) => API.get("/jobs", { params });
export const triggerSync = () => API.get("/jobs/sync");

export default API;
