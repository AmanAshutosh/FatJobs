import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";
import Auth from "./pages/Auth";
import Navbar from "./components/Navbar";
import Loader from "./components/Loader";
import LandingPage from "./pages/LandingPage";
import SDE from "./pages/SDE";
import DataAnalyst from "./pages/DataAnalyst";
import Profile from "./pages/Profile";
import "./index.css";
import { Analytics } from "@vercel/analytics/react";

const AppContent = () => {
  // FIXED: Initialize state directly from localStorage
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("fatjobs_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [pendingPath, setPendingPath] = useState(null);

  const handleNavigation = (path) => {
    if (path === location.pathname) return;
    setPendingPath(path);
    setIsLoading(true);
  };

  const onLoaderFinished = () => {
    setIsLoading(false);
    if (pendingPath) {
      navigate(pendingPath);
      setPendingPath(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("fatjobs_user");
    setUser(null);
    navigate("/");
  };

  return (
    <div className="app-main-layout">
      {isLoading && <Loader onFinished={onLoaderFinished} />}
      <Navbar onNavigate={handleNavigation} user={user} />

      <div className="page-renderer">
        <Routes>
          <Route
            path="/"
            element={<LandingPage onNavigate={handleNavigation} />}
          />

          <Route
            path="/login"
            element={
              user ? (
                <Navigate to="/sde" replace />
              ) : (
                <Auth onNavigate={handleNavigation} setUser={setUser} />
              )
            }
          />

          <Route
            path="/sde"
            element={user ? <SDE /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/da"
            element={user ? <DataAnalyst /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/profile"
            element={
              user ? (
                <Profile user={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
      <Analytics />
    </Router>
  );
}

export default App;
