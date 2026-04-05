import React, { useState, useEffect } from "react";
import "../styles/Loader.css";

const Loader = ({ onFinished }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        // Logic to ensure it moves but slows down at 80%+
        const increment = prev > 80 ? 1 : Math.floor(Math.random() * 5) + 3;
        return Math.min(prev + increment, 100);
      });
    }, 120);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (progress === 100) {
      const timeout = setTimeout(() => onFinished(), 600);
      return () => clearTimeout(timeout);
    }
  }, [progress, onFinished]);

  // DERIVE status instead of using setState
  let statusText = "INITIALIZING_CORE...";
  if (progress > 20) statusText = "DECRYPTING_DECK_ASSETS...";
  if (progress > 55) statusText = "INJECTING_JOB_CARDS...";
  if (progress > 85) statusText = "FINALIZING_HANDSHAKE...";
  if (progress === 100) statusText = "ACCESS_GRANTED";

  return (
    <div className="loader-overlay">
      <div className="loader-content">
        <div className="loader-title">FAT_JOBS_v2.0</div>
        <div className="percentage-display">
          {progress}
          <span className="unit">%</span>
        </div>
        <div className="loader-bar-bg">
          <div className="loader-bar-fill" style={{ width: `${progress}%` }}>
            <div className="bar-glow"></div>
          </div>
        </div>
        <div className="loader-status">
          <span className="status-cursor">{">"}</span> {statusText}
        </div>
      </div>
      <div className="scanline"></div>
    </div>
  );
};

export default Loader;
