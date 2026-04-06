import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Auth.css";

const API_BASE_URL = "https://fatjobs-production.up.railway.app";

const Auth = ({ setUser, onNavigate }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ email: "", name: "" });
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 🕒 Timer State
  const [timer, setTimer] = useState(0);

  // Countdown logic for the Resend button
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleInputChange = (e, field) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleRequest = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await axios.post(`${API_BASE_URL}/api/auth/request-otp`, {
        email: formData.email,
        name: formData.name,
        isSignup,
      });
      setStep(2);
      setTimer(60); // Start 60s countdown
      setOtp("");
    } catch (err) {
      const serverMessage = err.response?.data?.message;
      if (serverMessage === "LIMIT_EXCEEDED: MAXIMUM_5_KEYS_PER_24H") {
        setError("SECURITY_LOCK: MAX_ATTEMPTS_REACHED_FOR_24H");
      } else {
        setError(serverMessage || "SYSTEM_OFFLINE");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/verify-otp`, {
        email: formData.email,
        otp,
      });
      if (res.data.success) {
        localStorage.setItem("fatjobs_user", JSON.stringify(res.data.user));
        setUser(res.data.user);
        onNavigate("/sde");
      }
    } catch (err) {
      setError("ACCESS_DENIED: INVALID_ENCRYPTION_KEY");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-terminal-container">
      <div className="terminal-window">
        <div className="terminal-header">
          <span>{isSignup ? "PROVISIONING.exe" : "LOGIN_v2.sh"}</span>
          <span>● ● ●</span>
        </div>
        <div className="terminal-body">
          {step === 1 ? (
            <form onSubmit={handleRequest} className="terminal-form">
              {isSignup && (
                <div className="auth-form-group">
                  <p className="prompt">FULL_NAME:</p>
                  <input
                    className="terminal-input"
                    required
                    onChange={(e) => handleInputChange(e, "name")}
                  />
                </div>
              )}
              <div className="auth-form-group">
                <p className="prompt">EMAIL_ADDRESS:</p>
                <input
                  className="terminal-input"
                  type="email"
                  required
                  onChange={(e) => handleInputChange(e, "email")}
                />
              </div>
              <button
                type="submit"
                className="grant-access-btn"
                disabled={loading}
              >
                {loading ? "TRANSMITTING..." : "[ GENERATE_ACCESS_KEY ]"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="terminal-form">
              <p className="prompt">ENTER_6_DIGIT_KEY:</p>
              <input
                className="terminal-input code-input"
                maxLength="6"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                autoFocus
              />

              <p className="spam-hint">!! CHECK_INBOX_OR_SPAM_FOLDER !!</p>

              <div className="resend-container">
                {timer > 0 ? (
                  <p className="timer-text">RESEND_AVAILABLE_IN: {timer}s</p>
                ) : (
                  <span className="resend-link" onClick={handleRequest}>
                    {"> RE-GENERATE_ACCESS_KEY"}
                  </span>
                )}
              </div>

              <button
                type="submit"
                className="grant-access-btn"
                style={{ marginTop: "20px" }}
              >
                {loading ? "VERIFYING..." : "[ AUTHORIZE_ACCESS ]"}
              </button>
            </form>
          )}

          {error && <p className="error-text">!! {error} !!</p>}
        </div>
      </div>
    </div>
  );
};

export default Auth;
