import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = ({ onNavigate, user }) => {
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation();

  const controlNavbar = () => {
    // Only hide if we've scrolled more than 10px to avoid jitter
    if (window.scrollY > lastScrollY && window.scrollY > 100) {
      setShow(false);
    } else {
      setShow(true);
    }
    setLastScrollY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", controlNavbar);
    return () => window.removeEventListener("scroll", controlNavbar);
  }, [lastScrollY]);

  const handleLinkClick = (e, path) => {
    e.preventDefault();
    onNavigate(path);
  };

  return (
    <nav className={`main-nav ${show ? "nav-visible" : "nav-hidden"}`}>
      <div className="nav-content">
        <a
          href="/"
          onClick={(e) => handleLinkClick(e, "/")}
          className="nav-logo"
        >
          FAT<span>JOBS</span>
        </a>

        <div className="nav-links">
          <a
            href="/sde"
            onClick={(e) => handleLinkClick(e, "/sde")}
            className={location.pathname === "/sde" ? "active" : ""}
          >
            SDE
          </a>
          <a
            href="/da"
            onClick={(e) => handleLinkClick(e, "/da")}
            className={location.pathname === "/da" ? "active" : ""}
          >
            DATA
          </a>
          <a
            href="/resume"
            onClick={(e) => handleLinkClick(e, "/resume")}
            className={`resume-nav-link ${location.pathname === "/resume" ? "active" : ""}`}
          >
            ⚡ RESUME
          </a>
          {/* Toggle between Login and Profile based on User state */}
          <a
            href={user ? "/profile" : "/login"}
            onClick={(e) => handleLinkClick(e, user ? "/profile" : "/login")}
            className={`profile-icon ${location.pathname === "/profile" ? "active" : ""}`}
          >
            {user ? "👤" : "LOGIN"}
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
