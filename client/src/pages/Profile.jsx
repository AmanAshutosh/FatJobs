import React, { useState, useRef, useEffect } from "react";
import {
  User, MapPin, Globe, Github, Linkedin, Camera, Download,
  Plus, Trash2, Edit2, Check, X, ChevronUp, ChevronDown,
  Briefcase, Code2, GraduationCap, Award, Star, LogOut,
  ExternalLink, Tag,
} from "lucide-react";
import "../styles/Profile.css";

const uid = () => Math.random().toString(36).slice(2, 9);
const DEFAULT_ORDER = ["about", "skills", "experience", "projects", "education", "certifications", "featured"];
const SKILL_CATS = ["Frontend", "Backend", "Tools", "Soft Skills"];

const BLANK_EXP  = () => ({ id: uid(), role: "", company: "", duration: "", bullets: [""] });
const BLANK_PROJ = () => ({ id: uid(), title: "", description: "", stack: [], github: "", live: "" });
const BLANK_EDU  = () => ({ id: uid(), degree: "", institution: "", year: "", grade: "" });
const BLANK_CERT = () => ({ id: uid(), name: "", provider: "", date: "", link: "" });
const BLANK_FEAT = () => ({ id: uid(), title: "", description: "", link: "", type: "Project" });

function loadProfile(user) {
  try {
    const saved = JSON.parse(localStorage.getItem("fatjobs_profile") || "{}");
    return {
      name: user?.name || "",
      headline: "",
      location: "",
      website: "",
      linkedin: "",
      github: "",
      summary: "",
      skills: { Frontend: [], Backend: [], Tools: [], "Soft Skills": [] },
      experience: [],
      projects: [],
      education: [],
      certifications: [],
      featured: [],
      ...saved,
    };
  } catch {
    return {
      name: user?.name || "", headline: "", location: "", website: "",
      linkedin: "", github: "", summary: "",
      skills: { Frontend: [], Backend: [], Tools: [], "Soft Skills": [] },
      experience: [], projects: [], education: [], certifications: [], featured: [],
    };
  }
}

export default function Profile({ user, onLogout }) {
  const [profile, setProfile]         = useState(() => loadProfile(user));
  const [img, setImg]                 = useState(() => localStorage.getItem("fatjobs_profile_img") || null);
  const [order, setOrder]             = useState(() => {
    try { return JSON.parse(localStorage.getItem("fatjobs_section_order")) || DEFAULT_ORDER; }
    catch { return DEFAULT_ORDER; }
  });
  const [editing, setEditing]         = useState(null);
  const [skillInputs, setSkillInputs] = useState({});
  const [stackInput, setStackInput]   = useState("");
  const fileRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("fatjobs_profile", JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem("fatjobs_section_order", JSON.stringify(order));
  }, [order]);

  const set = (key, val) => setProfile(p => ({ ...p, [key]: val }));

  const updateItem = (field, id, patch) =>
    set(field, profile[field].map(x => x.id === id ? { ...x, ...patch } : x));

  const removeItem = (field, id) => {
    set(field, profile[field].filter(x => x.id !== id));
    setEditing(null);
  };

  const completion = (() => {
    let pts = 0;
    if (profile.summary?.trim().length > 20)              pts += 15;
    if (Object.values(profile.skills).flat().length >= 3) pts += 15;
    if (profile.experience.length >= 1)                   pts += 20;
    if (profile.projects.length >= 1)                     pts += 15;
    if (profile.education.length >= 1)                    pts += 15;
    if (profile.certifications.length >= 1)               pts += 10;
    if (profile.featured.length >= 1)                     pts += 10;
    return pts;
  })();

  const completionLabel =
    completion < 30 ? "Just getting started — add your summary and skills." :
    completion < 60 ? "Looking good! Add experience and projects." :
    completion < 85 ? "Almost there — certifications and featured work will push you higher." :
    completion < 100 ? "Great profile! Add featured work to complete it." :
    "Profile complete — you're ready to impress recruiters.";

  const moveSection = (idx, dir) => {
    const next = [...order];
    const swap = idx + dir;
    if (swap < 0 || swap >= next.length) return;
    [next[idx], next[swap]] = [next[swap], next[idx]];
    setOrder(next);
  };

  const handleImg = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setImg(reader.result);
      localStorage.setItem("fatjobs_profile_img", reader.result);
    };
    reader.readAsDataURL(file);
  };

  // ── ABOUT ───────────────────────────────────────────────────────────────────
  const renderAbout = () => (
    <section className="prof-section">
      <div className="prof-section-header">
        <h2><User size={18} /> About</h2>
        <button className="sec-edit-btn no-print" onClick={() => setEditing(editing === "about" ? null : "about")}>
          {editing === "about" ? <><Check size={15} /> Done</> : <><Edit2 size={15} /> Edit</>}
        </button>
      </div>

      {editing === "about" ? (
        <div className="about-edit">
          <label className="field-label">Professional Summary</label>
          <textarea
            className="prof-textarea"
            rows={5}
            placeholder="Write 2–4 sentences. Lead with your expertise, highlight your impact, and state your career objective. Use ATS-friendly keywords relevant to your target role."
            value={profile.summary}
            onChange={e => set("summary", e.target.value)}
          />
          <div className="about-links-grid">
            <div>
              <label className="field-label"><MapPin size={12} /> Location</label>
              <input className="prof-input" placeholder="City, Country" value={profile.location}
                onChange={e => set("location", e.target.value)} />
            </div>
            <div>
              <label className="field-label"><Globe size={12} /> Portfolio</label>
              <input className="prof-input" placeholder="https://yourportfolio.com" value={profile.website}
                onChange={e => set("website", e.target.value)} />
            </div>
            <div>
              <label className="field-label"><Linkedin size={12} /> LinkedIn</label>
              <input className="prof-input" placeholder="linkedin.com/in/yourname" value={profile.linkedin}
                onChange={e => set("linkedin", e.target.value)} />
            </div>
            <div>
              <label className="field-label"><Github size={12} /> GitHub</label>
              <input className="prof-input" placeholder="github.com/yourname" value={profile.github}
                onChange={e => set("github", e.target.value)} />
            </div>
          </div>
        </div>
      ) : (
        <div className="about-view">
          {profile.summary
            ? <p className="summary-text">{profile.summary}</p>
            : <p className="empty-hint">Add a professional summary — your elevator pitch for recruiters and ATS systems.</p>
          }
          <div className="about-meta">
            {profile.location && <span><MapPin size={13} /> {profile.location}</span>}
            {profile.website  && <a href={profile.website}   target="_blank" rel="noreferrer"><Globe size={13} /> Portfolio</a>}
            {profile.linkedin && <a href={`https://${profile.linkedin}`} target="_blank" rel="noreferrer"><Linkedin size={13} /> LinkedIn</a>}
            {profile.github   && <a href={`https://${profile.github}`}   target="_blank" rel="noreferrer"><Github size={13} /> GitHub</a>}
          </div>
        </div>
      )}
    </section>
  );

  // ── SKILLS ──────────────────────────────────────────────────────────────────
  const addSkill = (cat) => {
    const val = (skillInputs[cat] || "").trim();
    if (!val || (profile.skills[cat] || []).includes(val)) return;
    set("skills", { ...profile.skills, [cat]: [...(profile.skills[cat] || []), val] });
    setSkillInputs(s => ({ ...s, [cat]: "" }));
  };

  const removeSkill = (cat, skill) =>
    set("skills", { ...profile.skills, [cat]: profile.skills[cat].filter(s => s !== skill) });

  const renderSkills = () => (
    <section className="prof-section">
      <div className="prof-section-header">
        <h2><Tag size={18} /> Skills</h2>
        <button className="sec-edit-btn no-print" onClick={() => setEditing(editing === "skills" ? null : "skills")}>
          {editing === "skills" ? <><Check size={15} /> Done</> : <><Edit2 size={15} /> Edit</>}
        </button>
      </div>
      <div className="skills-grid">
        {SKILL_CATS.map(cat => (
          <div key={cat} className="skill-cat">
            <h3 className="skill-cat-label">{cat}</h3>
            <div className="skill-tags">
              {(profile.skills[cat] || []).map(skill => (
                <span key={skill} className="skill-tag">
                  {skill}
                  {editing === "skills" && (
                    <button className="tag-remove" onClick={() => removeSkill(cat, skill)}><X size={11} /></button>
                  )}
                </span>
              ))}
              {editing === "skills" && (
                <div className="skill-add-row">
                  <input
                    className="tag-input"
                    placeholder={`Add ${cat}…`}
                    value={skillInputs[cat] || ""}
                    onChange={e => setSkillInputs(s => ({ ...s, [cat]: e.target.value }))}
                    onKeyDown={e => e.key === "Enter" && addSkill(cat)}
                  />
                  <button className="tag-add-btn" onClick={() => addSkill(cat)}><Plus size={14} /></button>
                </div>
              )}
              {!(profile.skills[cat] || []).length && editing !== "skills" && (
                <span className="empty-tag">No skills added</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  // ── EXPERIENCE ──────────────────────────────────────────────────────────────
  const renderExperience = () => (
    <section className="prof-section">
      <div className="prof-section-header">
        <h2><Briefcase size={18} /> Experience</h2>
        <button className="sec-add-btn no-print" onClick={() => {
          const b = BLANK_EXP();
          set("experience", [...profile.experience, b]);
          setEditing(`expe-${b.id}`);
        }}>
          <Plus size={15} /> Add Role
        </button>
      </div>
      {!profile.experience.length && <p className="empty-hint">Add internships, full-time roles, or freelance engagements.</p>}
      <div className="entry-list">
        {profile.experience.map(exp => {
          const isEdit = editing === `expe-${exp.id}`;
          return (
            <div key={exp.id} className={`entry-card ${isEdit ? "editing" : ""}`}>
              {isEdit ? (
                <div className="entry-edit">
                  <div className="entry-edit-grid-3">
                    <div>
                      <label className="field-label">Role / Title</label>
                      <input className="prof-input" placeholder="Software Engineer" value={exp.role}
                        onChange={e => updateItem("experience", exp.id, { role: e.target.value })} />
                    </div>
                    <div>
                      <label className="field-label">Company</label>
                      <input className="prof-input" placeholder="Acme Corp" value={exp.company}
                        onChange={e => updateItem("experience", exp.id, { company: e.target.value })} />
                    </div>
                    <div>
                      <label className="field-label">Duration</label>
                      <input className="prof-input" placeholder="Jun 2023 – Present" value={exp.duration}
                        onChange={e => updateItem("experience", exp.id, { duration: e.target.value })} />
                    </div>
                  </div>
                  <label className="field-label" style={{ marginTop: 16 }}>Key Achievements & Responsibilities</label>
                  {exp.bullets.map((b, bi) => (
                    <div key={bi} className="bullet-row">
                      <span className="bullet-dot">▸</span>
                      <input className="prof-input bullet-input"
                        placeholder="Quantify impact — e.g. Reduced API response time by 40%..."
                        value={b}
                        onChange={e => {
                          const nb = [...exp.bullets]; nb[bi] = e.target.value;
                          updateItem("experience", exp.id, { bullets: nb });
                        }} />
                      <button className="bullet-remove" onClick={() => {
                        updateItem("experience", exp.id, { bullets: exp.bullets.filter((_, i) => i !== bi) });
                      }}><X size={13} /></button>
                    </div>
                  ))}
                  <button className="add-bullet-btn" onClick={() =>
                    updateItem("experience", exp.id, { bullets: [...exp.bullets, ""] })
                  }>
                    <Plus size={13} /> Add bullet point
                  </button>
                  <div className="entry-actions">
                    <button className="btn-save" onClick={() => setEditing(null)}><Check size={15} /> Save</button>
                    <button className="btn-delete" onClick={() => removeItem("experience", exp.id)}><Trash2 size={15} /> Remove</button>
                  </div>
                </div>
              ) : (
                <div className="entry-view">
                  <div className="entry-view-header">
                    <div>
                      <h3 className="entry-role">{exp.role || "Untitled Role"}</h3>
                      <p className="entry-meta">{exp.company}{exp.company && exp.duration ? " · " : ""}{exp.duration}</p>
                    </div>
                    <button className="entry-edit-icon no-print" onClick={() => setEditing(`expe-${exp.id}`)}><Edit2 size={15} /></button>
                  </div>
                  {exp.bullets.filter(b => b.trim()).length > 0 && (
                    <ul className="entry-bullets">
                      {exp.bullets.filter(b => b.trim()).map((b, i) => <li key={i}>{b}</li>)}
                    </ul>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );

  // ── PROJECTS ────────────────────────────────────────────────────────────────
  const renderProjects = () => (
    <section className="prof-section">
      <div className="prof-section-header">
        <h2><Code2 size={18} /> Projects</h2>
        <button className="sec-add-btn no-print" onClick={() => {
          const b = BLANK_PROJ();
          set("projects", [...profile.projects, b]);
          setEditing(`proj-${b.id}`);
          setStackInput("");
        }}>
          <Plus size={15} /> Add Project
        </button>
      </div>
      {!profile.projects.length && <p className="empty-hint">Showcase your best work — personal projects, open source, or client work.</p>}
      <div className="proj-grid">
        {profile.projects.map(proj => {
          const isEdit = editing === `proj-${proj.id}`;
          return (
            <div key={proj.id} className={`proj-card ${isEdit ? "editing" : ""}`}>
              {isEdit ? (
                <div className="entry-edit">
                  <label className="field-label">Project Title</label>
                  <input className="prof-input" placeholder="e.g. FatJobs — Job Aggregator" value={proj.title}
                    onChange={e => updateItem("projects", proj.id, { title: e.target.value })} />
                  <label className="field-label">Description</label>
                  <textarea className="prof-textarea" rows={3}
                    placeholder="Problem it solves, your role, and measurable impact."
                    value={proj.description}
                    onChange={e => updateItem("projects", proj.id, { description: e.target.value })} />
                  <label className="field-label">Tech Stack</label>
                  <div className="skill-tags" style={{ marginBottom: 8 }}>
                    {proj.stack.map(t => (
                      <span key={t} className="stack-tag">
                        {t}
                        <button className="tag-remove" onClick={() =>
                          updateItem("projects", proj.id, { stack: proj.stack.filter(s => s !== t) })
                        }><X size={11} /></button>
                      </span>
                    ))}
                  </div>
                  <div className="skill-add-row">
                    <input className="tag-input" placeholder="e.g. React (press Enter)"
                      value={stackInput}
                      onChange={e => setStackInput(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === "Enter" && stackInput.trim() && !proj.stack.includes(stackInput.trim())) {
                          updateItem("projects", proj.id, { stack: [...proj.stack, stackInput.trim()] });
                          setStackInput("");
                        }
                      }} />
                    <button className="tag-add-btn" onClick={() => {
                      if (stackInput.trim() && !proj.stack.includes(stackInput.trim())) {
                        updateItem("projects", proj.id, { stack: [...proj.stack, stackInput.trim()] });
                        setStackInput("");
                      }
                    }}><Plus size={14} /></button>
                  </div>
                  <div className="entry-edit-grid-2" style={{ marginTop: 12 }}>
                    <div>
                      <label className="field-label"><Github size={12} /> GitHub</label>
                      <input className="prof-input" placeholder="https://github.com/..." value={proj.github}
                        onChange={e => updateItem("projects", proj.id, { github: e.target.value })} />
                    </div>
                    <div>
                      <label className="field-label"><ExternalLink size={12} /> Live URL</label>
                      <input className="prof-input" placeholder="https://..." value={proj.live}
                        onChange={e => updateItem("projects", proj.id, { live: e.target.value })} />
                    </div>
                  </div>
                  <div className="entry-actions">
                    <button className="btn-save" onClick={() => { setEditing(null); setStackInput(""); }}><Check size={15} /> Save</button>
                    <button className="btn-delete" onClick={() => { removeItem("projects", proj.id); setStackInput(""); }}><Trash2 size={15} /> Remove</button>
                  </div>
                </div>
              ) : (
                <div className="proj-view">
                  <div className="proj-view-header">
                    <h3 className="proj-title">{proj.title || "Untitled Project"}</h3>
                    <div className="proj-links">
                      {proj.github && <a href={proj.github} target="_blank" rel="noreferrer"><Github size={16} /></a>}
                      {proj.live   && <a href={proj.live}   target="_blank" rel="noreferrer"><ExternalLink size={16} /></a>}
                      <button className="entry-edit-icon no-print" onClick={() => { setEditing(`proj-${proj.id}`); setStackInput(""); }}><Edit2 size={15} /></button>
                    </div>
                  </div>
                  {proj.description && <p className="proj-desc">{proj.description}</p>}
                  {proj.stack.length > 0 && (
                    <div className="skill-tags" style={{ marginTop: 12 }}>
                      {proj.stack.map(t => <span key={t} className="stack-tag">{t}</span>)}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );

  // ── EDUCATION ───────────────────────────────────────────────────────────────
  const renderEducation = () => (
    <section className="prof-section">
      <div className="prof-section-header">
        <h2><GraduationCap size={18} /> Education</h2>
        <button className="sec-add-btn no-print" onClick={() => {
          const b = BLANK_EDU();
          set("education", [...profile.education, b]);
          setEditing(`educ-${b.id}`);
        }}>
          <Plus size={15} /> Add
        </button>
      </div>
      {!profile.education.length && <p className="empty-hint">Add your academic background — degrees, diplomas, and relevant coursework.</p>}
      <div className="entry-list">
        {profile.education.map(edu => {
          const isEdit = editing === `educ-${edu.id}`;
          return (
            <div key={edu.id} className={`entry-card ${isEdit ? "editing" : ""}`}>
              {isEdit ? (
                <div className="entry-edit">
                  <div className="entry-edit-grid-2">
                    <div>
                      <label className="field-label">Degree / Program</label>
                      <input className="prof-input" placeholder="B.Tech Computer Science" value={edu.degree}
                        onChange={e => updateItem("education", edu.id, { degree: e.target.value })} />
                    </div>
                    <div>
                      <label className="field-label">Institution</label>
                      <input className="prof-input" placeholder="IIT Delhi" value={edu.institution}
                        onChange={e => updateItem("education", edu.id, { institution: e.target.value })} />
                    </div>
                    <div>
                      <label className="field-label">Year</label>
                      <input className="prof-input" placeholder="2020 – 2024" value={edu.year}
                        onChange={e => updateItem("education", edu.id, { year: e.target.value })} />
                    </div>
                    <div>
                      <label className="field-label">Grade / Achievement (optional)</label>
                      <input className="prof-input" placeholder="9.2 CGPA · First Class" value={edu.grade}
                        onChange={e => updateItem("education", edu.id, { grade: e.target.value })} />
                    </div>
                  </div>
                  <div className="entry-actions">
                    <button className="btn-save" onClick={() => setEditing(null)}><Check size={15} /> Save</button>
                    <button className="btn-delete" onClick={() => removeItem("education", edu.id)}><Trash2 size={15} /> Remove</button>
                  </div>
                </div>
              ) : (
                <div className="entry-view">
                  <div className="entry-view-header">
                    <div>
                      <h3 className="entry-role">{edu.degree || "Degree"}</h3>
                      <p className="entry-meta">
                        {edu.institution}{edu.institution && edu.year ? " · " : ""}{edu.year}
                        {edu.grade ? ` · ${edu.grade}` : ""}
                      </p>
                    </div>
                    <button className="entry-edit-icon no-print" onClick={() => setEditing(`educ-${edu.id}`)}><Edit2 size={15} /></button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );

  // ── CERTIFICATIONS ──────────────────────────────────────────────────────────
  const renderCertifications = () => (
    <section className="prof-section">
      <div className="prof-section-header">
        <h2><Award size={18} /> Certifications</h2>
        <button className="sec-add-btn no-print" onClick={() => {
          const b = BLANK_CERT();
          set("certifications", [...profile.certifications, b]);
          setEditing(`cert-${b.id}`);
        }}>
          <Plus size={15} /> Add
        </button>
      </div>
      {!profile.certifications.length && <p className="empty-hint">Add certifications from AWS, Google, Coursera, Udemy, and more.</p>}
      <div className="entry-list">
        {profile.certifications.map(cert => {
          const isEdit = editing === `cert-${cert.id}`;
          return (
            <div key={cert.id} className={`entry-card ${isEdit ? "editing" : ""}`}>
              {isEdit ? (
                <div className="entry-edit">
                  <div className="entry-edit-grid-2">
                    <div>
                      <label className="field-label">Certificate Name</label>
                      <input className="prof-input" placeholder="AWS Solutions Architect" value={cert.name}
                        onChange={e => updateItem("certifications", cert.id, { name: e.target.value })} />
                    </div>
                    <div>
                      <label className="field-label">Issuing Organization</label>
                      <input className="prof-input" placeholder="Amazon Web Services" value={cert.provider}
                        onChange={e => updateItem("certifications", cert.id, { provider: e.target.value })} />
                    </div>
                    <div>
                      <label className="field-label">Date Issued</label>
                      <input className="prof-input" placeholder="March 2024" value={cert.date}
                        onChange={e => updateItem("certifications", cert.id, { date: e.target.value })} />
                    </div>
                    <div>
                      <label className="field-label">Credential URL (optional)</label>
                      <input className="prof-input" placeholder="https://..." value={cert.link}
                        onChange={e => updateItem("certifications", cert.id, { link: e.target.value })} />
                    </div>
                  </div>
                  <div className="entry-actions">
                    <button className="btn-save" onClick={() => setEditing(null)}><Check size={15} /> Save</button>
                    <button className="btn-delete" onClick={() => removeItem("certifications", cert.id)}><Trash2 size={15} /> Remove</button>
                  </div>
                </div>
              ) : (
                <div className="entry-view">
                  <div className="entry-view-header">
                    <div>
                      <h3 className="entry-role">{cert.name || "Certificate"}</h3>
                      <p className="entry-meta">{cert.provider}{cert.provider && cert.date ? " · " : ""}{cert.date}</p>
                    </div>
                    <div className="entry-view-actions">
                      {cert.link && (
                        <a href={cert.link} target="_blank" rel="noreferrer" className="cert-link-btn">
                          <ExternalLink size={13} /> Verify
                        </a>
                      )}
                      <button className="entry-edit-icon no-print" onClick={() => setEditing(`cert-${cert.id}`)}><Edit2 size={15} /></button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );

  // ── FEATURED ────────────────────────────────────────────────────────────────
  const renderFeatured = () => (
    <section className="prof-section">
      <div className="prof-section-header">
        <h2><Star size={18} /> Featured</h2>
        <button className="sec-add-btn no-print" onClick={() => {
          const b = BLANK_FEAT();
          set("featured", [...profile.featured, b]);
          setEditing(`feat-${b.id}`);
        }}>
          <Plus size={15} /> Add
        </button>
      </div>
      {!profile.featured.length && <p className="empty-hint">Pin your best work — standout projects, published articles, or major achievements.</p>}
      <div className="feat-grid">
        {profile.featured.map(feat => {
          const isEdit = editing === `feat-${feat.id}`;
          return (
            <div key={feat.id} className={`feat-card ${isEdit ? "editing" : ""}`}>
              {isEdit ? (
                <div className="entry-edit">
                  <div className="entry-edit-grid-2">
                    <div>
                      <label className="field-label">Title</label>
                      <input className="prof-input" placeholder="Project / Achievement / Article title" value={feat.title}
                        onChange={e => updateItem("featured", feat.id, { title: e.target.value })} />
                    </div>
                    <div>
                      <label className="field-label">Type</label>
                      <select className="prof-input" value={feat.type}
                        onChange={e => updateItem("featured", feat.id, { type: e.target.value })}>
                        <option>Project</option>
                        <option>Achievement</option>
                        <option>Article</option>
                        <option>Open Source</option>
                        <option>Award</option>
                      </select>
                    </div>
                  </div>
                  <label className="field-label">Description</label>
                  <textarea className="prof-textarea" rows={2}
                    placeholder="Why does this matter? What makes it worth featuring?"
                    value={feat.description}
                    onChange={e => updateItem("featured", feat.id, { description: e.target.value })} />
                  <label className="field-label">Link (optional)</label>
                  <input className="prof-input" placeholder="https://..." value={feat.link}
                    onChange={e => updateItem("featured", feat.id, { link: e.target.value })} />
                  <div className="entry-actions">
                    <button className="btn-save" onClick={() => setEditing(null)}><Check size={15} /> Save</button>
                    <button className="btn-delete" onClick={() => removeItem("featured", feat.id)}><Trash2 size={15} /> Remove</button>
                  </div>
                </div>
              ) : (
                <div className="feat-view">
                  <div className="feat-header-row">
                    <span className={`feat-type-badge feat-${(feat.type || "project").toLowerCase().replace(/\s/g, "-")}`}>
                      {feat.type || "Project"}
                    </span>
                    <button className="entry-edit-icon no-print" onClick={() => setEditing(`feat-${feat.id}`)}><Edit2 size={14} /></button>
                  </div>
                  <h3 className="feat-title">{feat.title || "Untitled"}</h3>
                  {feat.description && <p className="feat-desc">{feat.description}</p>}
                  {feat.link && (
                    <a href={feat.link} target="_blank" rel="noreferrer" className="feat-link">
                      <ExternalLink size={13} /> View
                    </a>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );

  const SECTION_RENDERERS = {
    about: renderAbout,
    skills: renderSkills,
    experience: renderExperience,
    projects: renderProjects,
    education: renderEducation,
    certifications: renderCertifications,
    featured: renderFeatured,
  };

  // ── MAIN RENDER ─────────────────────────────────────────────────────────────
  return (
    <div className="profile-container">
      <input type="file" accept="image/*" ref={fileRef} hidden onChange={handleImg} />

      {/* HEADER */}
      <div className="prof-header-wrap">
        <div className="prof-header-inner">
          <div className="prof-avatar" onClick={() => fileRef.current.click()}>
            {img
              ? <img src={img} alt="Profile" />
              : <span>{(profile.name || user?.name || "U").charAt(0).toUpperCase()}</span>
            }
            <div className="avatar-edit-overlay no-print"><Camera size={18} /></div>
          </div>

          <div className="prof-header-info">
            <input
              className="prof-name-input"
              placeholder="Your Full Name"
              value={profile.name}
              onChange={e => set("name", e.target.value)}
            />
            <input
              className="prof-headline-input"
              placeholder="Professional Headline — e.g. Full-Stack Engineer · React · Node.js · Open to Work"
              value={profile.headline}
              onChange={e => set("headline", e.target.value)}
            />
            <div className="prof-header-meta">
              {profile.location && <span><MapPin size={13} /> {profile.location}</span>}
              {profile.linkedin && <a href={`https://${profile.linkedin}`} target="_blank" rel="noreferrer"><Linkedin size={13} /></a>}
              {profile.github   && <a href={`https://${profile.github}`}   target="_blank" rel="noreferrer"><Github size={13} /></a>}
              {profile.website  && <a href={profile.website}               target="_blank" rel="noreferrer"><Globe size={13} /></a>}
            </div>
          </div>

          <div className="prof-header-actions no-print">
            <button className="btn-pdf" onClick={() => window.print()}>
              <Download size={16} /> Download PDF
            </button>
            <button className="btn-logout" onClick={onLogout}>
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>

        {/* Completion bar */}
        <div className="completion-wrap no-print">
          <div className="completion-top">
            <span className="completion-label">Profile Strength</span>
            <span className={`completion-pct ${completion === 100 ? "pct-complete" : ""}`}>{completion}%</span>
          </div>
          <div className="completion-track">
            <div
              className="completion-fill"
              style={{
                width: `${completion}%`,
                background: completion === 100 ? "var(--green)" : "var(--yellow)",
                boxShadow: completion === 100 ? "var(--green-glow)" : "var(--yellow-glow)",
              }}
            />
          </div>
          <p className="completion-hint">{completionLabel}</p>
        </div>
      </div>

      {/* SECTIONS */}
      <div className="prof-sections">
        {order.map((key, idx) => {
          const render = SECTION_RENDERERS[key];
          if (!render) return null;
          return (
            <div key={key} className="section-wrapper">
              <div className="section-order-controls no-print">
                <button className="order-btn" onClick={() => moveSection(idx, -1)} disabled={idx === 0} title="Move section up">
                  <ChevronUp size={14} />
                </button>
                <button className="order-btn" onClick={() => moveSection(idx, 1)} disabled={idx === order.length - 1} title="Move section down">
                  <ChevronDown size={14} />
                </button>
              </div>
              {render()}
            </div>
          );
        })}
      </div>
    </div>
  );
}
