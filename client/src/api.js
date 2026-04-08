import axios from "axios";

// Look closely at the end of this string.
// If your server.js uses app.use("/api/jobs"), then the base should just be the domain.
const API_URL =
  import.meta.env.VITE_API_URL || "https://fatjobs-production.up.railway.app";

const API = axios.create({
  baseURL: API_URL, // We will add /api in the individual calls to be safe
});

export const fetchJobs = (params) => API.get("/api/jobs", { params });
export const triggerSync = () => API.get("/api/jobs/sync");

export default API;
