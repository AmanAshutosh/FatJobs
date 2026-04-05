import React, { useState, useRef } from "react";
import {
  Download,
  Upload,
  Briefcase,
  GraduationCap,
  User,
  FileText,
  Camera,
  MapPin,
  LogOut,
} from "lucide-react";
import "../styles/Profile.css";

const Profile = ({ user, onLogout }) => {
  const [profileImg, setProfileImg] = useState(user?.profileImg || null);
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfileImg(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-content-wrapper">
        {/* BENTO HEADER */}
        <header className="bento-header">
          <div
            className="avatar-section"
            onClick={() => fileInputRef.current.click()}
          >
            <div className="avatar-ring">
              {profileImg ? (
                <img src={profileImg} alt="User" />
              ) : (
                user?.name?.charAt(0) || "U"
              )}
              <div className="avatar-edit-hint">
                <Camera size={14} />
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              hidden
            />
          </div>

          <div className="header-text">
            <h1>{user?.name || "System Agent"}</h1>
            <p>
              <MapPin size={14} /> {user?.location || "Noida, India"} •{" "}
              {user?.role || "Full-Stack Developer"}
            </p>
            <div className="header-badges">
              <span className="badge-blue">Verified</span>
              <span className="badge-green">Active</span>
              <span className="badge-purple">Lvl 50</span>
            </div>
          </div>
        </header>

        {/* BENTO GRID */}
        <div className="bento-grid">
          <section className="bento-tile about-tile">
            <h3>
              <User size={16} /> Bio_Protocol
            </h3>
            <textarea
              defaultValue={`New agent: ${user?.name}. Ready for deployment. System privileges granted.`}
            />
          </section>

          <section className="bento-tile resume-tile">
            <h3>
              <FileText size={16} /> Resume_File
            </h3>
            <div className="bento-upload">
              <Upload size={20} />
              <p>UPLOAD.PDF</p>
            </div>
          </section>

          <section className="bento-tile exp-tile">
            <h3>
              <Briefcase size={16} /> Experience
            </h3>
            <p className="tile-value">{user?.role || "Full-Stack Dev"}</p>
          </section>

          <section className="bento-tile edu-tile">
            <h3>
              <GraduationCap size={16} /> Education
            </h3>
            <p className="tile-value">B.Tech CS</p>
          </section>

          <section className="bento-tile table-tile">
            <div className="table-header-flex">
              <h3>Recent_Activity</h3>
              <button className="excel-download-btn">
                <Download size={14} /> EXPORT
              </button>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Target</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>System Login</td>
                  <td>
                    <span className="p-status interview">SUCCESS</span>
                  </td>
                </tr>
                <tr>
                  <td>Database Sync</td>
                  <td>
                    <span className="p-status pending">PENDING</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </section>

          {/* SYSTEM CONTROL (LOGOUT) */}
          <section className="bento-tile logout-tile">
            <h3>System_Control</h3>
            <p className="control-desc">Terminate session & clear cache.</p>
            <button onClick={onLogout} className="logout-btn">
              <LogOut size={16} /> TERMINATE
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Profile;
