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

  // Blinker Position States
  const [emailWidth, setEmailWidth] = useState(0);
  const [nameWidth, setNameWidth] = useState(0);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Measures text width to move the blinker
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
      setTimer(60);
      setOtp("");
    } catch (err) {
      const msg = err.response?.data?.message || "SYSTEM_OFFLINE";
      setError(
        msg === "LIMIT_EXCEEDED: MAXIMUM_5_KEYS_PER_24H"
          ? "SECURITY_LOCK: MAX_ATTEMPTS_REACHED"
          : msg,
      );
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
      setError("ACCESS_DENIED: INVALID_KEY");
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
          <p className="command-line">
            {" "}
            {isSignup ? "INITIALIZING_SIGNUP..." : "EXECUTING_AUTH_v2..."}
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
                      autoComplete="off"
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
                    autoComplete="off"
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
              <button
                type="submit"
                className="grant-access-btn"
                disabled={loading}
              >
                {loading ? "TRANSMITTING..." : "[ GENERATE_ACCESS_KEY ]"}
              </button>

              <div className="terminal-footer">
                <span
                  className="toggle-text"
                  onClick={() => {
                    setIsSignup(!isSignup);
                    setStep(1);
                    setError("");
                    setEmailWidth(0);
                    setNameWidth(0);
                  }}
                >
                  {isSignup
                    ? "> ALREADY_HAVE_ACCESS? _LOGIN"
                    : "> NEW_USER? _CREATE_ACCOUNT"}
                </span>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="terminal-form">
              <p className="prompt">ENTER_6_DIGIT_KEY:</p>
              <div className="terminal-input-wrapper">
                <input
                  className="terminal-input code-input"
                  maxLength="6"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  autoFocus
                />
              </div>

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
