import React, { useState } from "react";
import axios from "axios";
import "../styles/Auth.css";

// Centralized API URL to avoid "Connection Refused" on mobile
const API_BASE_URL = "https://fatjobs-production.up.railway.app";

const Auth = ({ setUser, onNavigate }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ email: "", name: "" });
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [emailWidth, setEmailWidth] = useState(0);
  const [nameWidth, setNameWidth] = useState(0);

  const handleInputChange = (e, field, setWidth) => {
    const value = e.target.value;
    setFormData({ ...formData, [field]: value });

    const span = document.createElement("span");
    span.style.font = "1.1rem 'Courier New', monospace";
    span.style.visibility = "hidden";
    span.style.position = "absolute";
    span.style.whiteSpace = "pre";
    span.innerText = value;
    document.body.appendChild(span);
    setWidth(span.offsetWidth);
    document.body.removeChild(span);
  };

  const handleRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // ✅ FIXED: Using Production Railway URL
      await axios.post(`${API_BASE_URL}/api/auth/request-otp`, {
        email: formData.email,
        name: formData.name,
        isSignup,
      });
      setStep(2);
      setOtp("");
    } catch (err) {
      const serverMessage = err.response?.data?.message;

      if (serverMessage === "IDENTITY_ALREADY_REGISTERED") {
        setError("IDENTITY_ALREADY_REGISTERED");
      } else if (serverMessage === "IDENTITY_NOT_FOUND") {
        setError("IDENTITY_NOT_FOUND: PLEASE_SIGNUP_FIRST");
      } else if (serverMessage === "MAIL_SERVER_OFFLINE") {
        // Even if mail fails, we check Railway logs for the OTP
        setError("SMTP_PROTOCOL_FAILURE: CHECK_SYSTEM_LOGS_FOR_KEY");
      } else {
        setError("SYSTEM_OFFLINE: UNABLE_TO_REACH_CORE");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // ✅ FIXED: Using Production Railway URL
      const res = await axios.post(`${API_BASE_URL}/api/auth/verify-otp`, {
        email: formData.email,
        otp,
        isSignup,
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
          <span>
            {isSignup
              ? "NEW_IDENTITY_PROVISIONING.exe"
              : "SECURE_LOGIN_v2.0.sh"}
          </span>
          <span>● ● ●</span>
        </div>
        <div className="terminal-body">
          <p className="command-line">
            {isSignup
              ? "> INITIALIZING SIGNUP PROTOCOL..."
              : "> RESUMING CAREER_SYNC..."}
          </p>

          {step === 1 ? (
            <form onSubmit={handleRequest} className="terminal-form">
              {isSignup && (
                <div className="auth-form-group">
                  <p className="prompt">FULL_NAME:</p>
                  <div className="terminal-input-wrapper">
                    <input
                      className="terminal-input"
                      required
                      name="fullname"
                      autoComplete="name"
                      placeholder="John Doe"
                      onChange={(e) =>
                        handleInputChange(e, "name", setNameWidth)
                      }
                    />
                    <span
                      className="custom-blinker"
                      style={{ transform: `translateX(${nameWidth}px)` }}
                    ></span>
                  </div>
                </div>
              )}
              <div className="auth-form-group">
                <p className="prompt">EMAIL_ADDRESS:</p>
                <div className="terminal-input-wrapper">
                  <input
                    className="terminal-input"
                    type="email"
                    required
                    name="email"
                    autoComplete="email"
                    placeholder="dev@fatjobs.com"
                    onChange={(e) =>
                      handleInputChange(e, "email", setEmailWidth)
                    }
                  />
                  <span
                    className="custom-blinker"
                    style={{ transform: `translateX(${emailWidth}px)` }}
                  ></span>
                </div>
              </div>
              <button type="submit" className="grant-access-btn">
                {loading ? "TRANSMITTING..." : "[ GENERATE_ACCESS_KEY ]"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="terminal-form">
              <div className="auth-form-group">
                <p className="prompt">ENTER_6_DIGIT_KEY:</p>
                <div className="terminal-input-wrapper">
                  <input
                    className="terminal-input code-input"
                    maxLength="6"
                    autoFocus
                    required
                    name="otp-input"
                    autoComplete="one-time-code"
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </div>
              </div>
              <button type="submit" className="grant-access-btn">
                {loading ? "VERIFYING..." : "[ AUTHORIZE_ACCESS ]"}
              </button>
            </form>
          )}

          {error && <p className="error-text">!! {error} !!</p>}

          <div className="terminal-footer">
            <span
              className="toggle-text"
              onClick={() => {
                setIsSignup(!isSignup);
                setStep(1);
                setError("");
                setEmailWidth(0);
                setNameWidth(0);
                setFormData({ email: "", name: "" });
              }}
            >
              {isSignup
                ? "> ALREADY_HAVE_ACCESS? _LOGIN"
                : "> NEW_USER? _CREATE_ACCOUNT"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
