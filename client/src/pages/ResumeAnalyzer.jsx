import React, { useState, useRef, useEffect, useCallback } from "react";
import axios from "axios";
import "../styles/ResumeAnalyzer.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const ROLES = [
  "MERN Stack", "Frontend Developer", "React Developer",
  "Backend Developer", "SDE", "Data Analyst",
  "Data Scientist", "DevOps",
];

const LEVELS = ["Fresher", "Intern", "1–2 Years", "Experienced"];

// ── Animated Score Ring ───────────────────────────────────────────────────────

function ScoreRing({ score, label }) {
  const [displayed, setDisplayed] = useState(0);
  const radius = 58;
  const circ = 2 * Math.PI * radius;

  useEffect(() => {
    let frame;
    let current = 0;
    const step = () => {
      current += 1.5;
      if (current >= score) { setDisplayed(score); return; }
      setDisplayed(Math.round(current));
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [score]);

  const color = displayed >= 85 ? "#22c55e" : displayed >= 65 ? "#f5e642" : displayed >= 45 ? "#f97316" : "#ef4444";
  const offset = circ * (1 - displayed / 100);

  return (
    <div className="score-ring-wrap">
      <svg className="score-svg" viewBox="0 0 140 140" width="160" height="160">
        <circle cx="70" cy="70" r={radius} fill="none" stroke="var(--neu-dark)" strokeWidth="10" />
        <circle
          cx="70" cy="70" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          transform="rotate(-90 70 70)"
          style={{ transition: "stroke-dashoffset 0.05s linear, stroke 0.5s ease", filter: `drop-shadow(0 0 8px ${color}88)` }}
        />
        <text x="70" y="63" textAnchor="middle" fill={color} fontSize="26" fontWeight="900" fontFamily="JetBrains Mono, monospace">{displayed}</text>
        <text x="70" y="82" textAnchor="middle" fill="var(--text-muted)" fontSize="10" fontWeight="600" letterSpacing="1">/100</text>
      </svg>
      <span className="score-label" style={{ color }}>{label}</span>
    </div>
  );
}

// ── Section Health Card ───────────────────────────────────────────────────────

function SectionCard({ name, data }) {
  const [open, setOpen] = useState(false);
  const healthColor = { strong: "#22c55e", average: "#f5e642", weak: "#f97316", missing: "#ef4444" };
  const healthIcon = { strong: "✅", average: "⚠️", weak: "🔴", missing: "❌" };
  const hc = healthColor[data.health] || "#64748b";

  return (
    <div className={`section-card health-${data.health}`} onClick={() => setOpen(o => !o)}>
      <div className="section-card-header">
        <span className="section-icon">{healthIcon[data.health]}</span>
        <span className="section-name">{name}</span>
        <span className="section-badge" style={{ background: hc + "22", color: hc, border: `1px solid ${hc}44` }}>
          {data.health.toUpperCase()}
        </span>
        <span className="section-chevron">{open ? "▲" : "▼"}</span>
      </div>

      {open && (
        <div className="section-card-body">
          {data.issues?.length > 0 && (
            <div className="issue-list">
              <p className="list-label red-label">Issues</p>
              {data.issues.map((iss, i) => <div key={i} className="issue-item">⚡ {iss}</div>)}
            </div>
          )}
          {data.improvements?.length > 0 && (
            <div className="issue-list">
              <p className="list-label green-label">How to Fix</p>
              {data.improvements.map((imp, i) => <div key={i} className="improve-item">→ {imp}</div>)}
            </div>
          )}
          {data.rewrite && (
            <div className="rewrite-box">
              <p className="list-label yellow-label">Suggested Rewrite</p>
              <pre className="rewrite-text">{data.rewrite}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Keyword Chip ──────────────────────────────────────────────────────────────

function KeyChip({ word, type }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(word);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };
  return (
    <button className={`key-chip ${type}`} onClick={copy} title="Click to copy">
      {copied ? "✓" : word}
    </button>
  );
}

// ── Score Breakdown Bar ───────────────────────────────────────────────────────

function ScoreBar({ label, score, max }) {
  const pct = (score / max) * 100;
  const color = pct >= 80 ? "#22c55e" : pct >= 55 ? "#f5e642" : "#f97316";
  return (
    <div className="score-bar-row">
      <span className="sbar-label">{label}</span>
      <div className="sbar-track">
        <div className="sbar-fill" style={{ width: `${pct}%`, background: color, boxShadow: `0 0 8px ${color}66` }} />
      </div>
      <span className="sbar-val" style={{ color }}>{score}<span className="sbar-max">/{max}</span></span>
    </div>
  );
}

// ── Red Flag Card ─────────────────────────────────────────────────────────────

function RedFlagCard({ flag }) {
  const sevColor = { high: "#ef4444", medium: "#f97316", low: "#f5e642" };
  const sc = sevColor[flag.severity] || "#ef4444";
  return (
    <div className="red-flag-card" style={{ borderLeftColor: sc }}>
      <div className="flag-header">
        <span className="flag-sev" style={{ color: sc, border: `1px solid ${sc}44`, background: sc + "11" }}>
          {flag.severity.toUpperCase()}
        </span>
        <span className="flag-title">{flag.flag}</span>
      </div>
      {flag.instances?.length > 0 && (
        <div className="flag-instances">
          {flag.instances.map((inst, i) => <code key={i} className="flag-instance">{inst}</code>)}
        </div>
      )}
      <div className="flag-fix">→ {flag.fix}</div>
    </div>
  );
}

// ── Bullet Improvement Card ───────────────────────────────────────────────────

function BulletCard({ item }) {
  const [view, setView] = useState("before");
  return (
    <div className="bullet-card">
      <div className="bullet-toggle">
        <button className={view === "before" ? "btog active-before" : "btog"} onClick={() => setView("before")}>Before</button>
        <button className={view === "after" ? "btog active-after" : "btog"} onClick={() => setView("after")}>After</button>
      </div>
      {view === "before"
        ? <p className="bullet-text before-text">❌ {item.original}</p>
        : <p className="bullet-text after-text">✅ {item.improved}</p>
      }
      {item.why && <p className="bullet-why">💡 {item.why}</p>}
    </div>
  );
}

// ── Project Optimization Card ─────────────────────────────────────────────────

function ProjectCard({ proj }) {
  return (
    <div className="proj-card">
      <div className="proj-name-row">
        <span className="proj-old">"{proj.original_title}"</span>
        <span className="proj-arrow">→</span>
        <span className="proj-new">"{proj.improved_title}"</span>
      </div>
      <ul className="proj-improve-list">
        {proj.improvements.map((imp, i) => <li key={i}>{imp}</li>)}
      </ul>
      {proj.suggested_tech_keywords?.length > 0 && (
        <div className="proj-kw-row">
          <span className="proj-kw-label">Add keywords:</span>
          {proj.suggested_tech_keywords.map((kw, i) => <span key={i} className="proj-kw-chip">{kw}</span>)}
        </div>
      )}
    </div>
  );
}

// ── Loading Phase ─────────────────────────────────────────────────────────────

function LoadingPhase() {
  const steps = [
    "Parsing resume structure...",
    "Running ATS simulation...",
    "Analysing keyword gaps...",
    "Scoring content quality...",
    "Detecting red flags...",
    "Generating optimized resume...",
    "Building improvement roadmap...",
  ];
  const [step, setStep] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setStep(s => Math.min(s + 1, steps.length - 1)), 600);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="loading-phase">
      <div className="loading-ring">
        <div className="l-ring-inner" />
      </div>
      <p className="loading-step">{steps[step]}</p>
      <div className="loading-progress">
        <div className="loading-fill" style={{ width: `${((step + 1) / steps.length) * 100}%` }} />
      </div>
      <p className="loading-hint">Analysing with ATS + Recruiter intelligence...</p>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function ResumeAnalyzer() {
  const [phase, setPhase] = useState("input"); // input | loading | results
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [copied, setCopied] = useState(false);

  const [form, setForm] = useState({
    text: "",
    role: "MERN Stack",
    level: "Fresher",
    jd: "",
  });

  const fileRef = useRef(null);

  const handleFile = useCallback(async (file) => {
    if (!file) return;
    setError("");

    if (file.type === "text/plain") {
      const text = await file.text();
      setForm(f => ({ ...f, text }));
      return;
    }

    const DOCX_MIME = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    const DOC_MIME  = "application/msword";
    const serverParsed = [DOCX_MIME, DOC_MIME, "application/pdf"];

    if (serverParsed.includes(file.type)) {
      const formData = new FormData();
      formData.append("pdf", file);
      try {
        const { data } = await axios.post(`${API}/api/resume/parse-pdf`, formData);
        setForm(f => ({ ...f, text: data.text }));
      } catch (err) {
        const msg = err.response?.data?.error || "File parsing failed. Please paste your resume text manually.";
        setError(msg);
      }
      return;
    }

    setError("Only PDF, DOCX, DOC, or TXT files are supported.");
  }, []);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleSubmit = async () => {
    if (!form.text.trim() || form.text.trim().length < 50) {
      setError("Please provide your resume text (at least 50 characters).");
      return;
    }
    setError("");
    setPhase("loading");

    try {
      const { data } = await axios.post(`${API}/api/resume/analyze`, {
        resume_text: form.text,
        target_role: form.role,
        experience_level: form.level,
        job_description: form.jd,
      });

      if (data.error) { setError(data.error); setPhase("input"); return; }
      setResults(data);
      setPhase("results");
      setActiveTab("overview");
    } catch {
      setError("Analysis failed. Make sure the server is running.");
      setPhase("input");
    }
  };

  const copyOptimized = () => {
    navigator.clipboard.writeText(results.optimized_resume);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tabs = [
    { id: "overview",   label: "📊 Overview" },
    { id: "sections",   label: "🔍 Sections" },
    { id: "keywords",   label: "🔑 Keywords" },
    { id: "bullets",    label: "✏️ Bullets" },
    { id: "projects",   label: "🚀 Projects" },
    { id: "redflags",   label: "🚨 Red Flags" },
    { id: "optimized",  label: "⚡ Optimized" },
    { id: "roadmap",    label: "🗺 Roadmap" },
    { id: "bonus",      label: "🔥 Bonus" },
  ];

  // ── INPUT PHASE ──────────────────────────────────────────────────────────────

  if (phase === "input") {
    return (
      <div className="ra-page">
        <div className="ra-hero">
          <span className="ra-badge">⚡ ATS + Recruiter Intelligence</span>
          <h1 className="ra-title">Resume<span className="ra-title-accent">Analyzer</span></h1>
          <p className="ra-subtitle">
            Upload your resume. Get a brutally honest ATS score, keyword gaps,
            bullet rewrites, and a fully optimized version — in seconds.
          </p>
        </div>

        <div className="ra-form-wrap">
          {/* Drop zone */}
          <div
            className={`drop-zone ${dragActive ? "drag-over" : ""} ${form.text ? "has-text" : ""}`}
            onDragOver={e => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={onDrop}
            onClick={() => !form.text && fileRef.current?.click()}
          >
            <input ref={fileRef} type="file" accept=".pdf,.docx,.doc,.txt" hidden onChange={e => handleFile(e.target.files[0])} />

            {form.text ? (
              <div className="drop-has-content">
                <span className="drop-check">✓ Resume Loaded</span>
                <span className="drop-chars">{form.text.split(/\s+/).length} words · {form.text.length} chars</span>
                <button className="drop-clear" onClick={e => { e.stopPropagation(); setForm(f => ({ ...f, text: "" })); }}>✕ Clear</button>
              </div>
            ) : (
              <>
                <div className="drop-icon">📄</div>
                <p className="drop-title">Drag & Drop your Resume</p>
                <p className="drop-or">or click to browse files</p>
                <span className="drop-hint">PDF · DOCX · DOC · TXT · Max 5MB</span>
              </>
            )}
          </div>

          {/* OR paste */}
          <div className="or-divider"><span>OR PASTE RESUME TEXT</span></div>

          <textarea
            className="ra-textarea"
            placeholder="Paste your resume content here..."
            value={form.text}
            onChange={e => setForm(f => ({ ...f, text: e.target.value }))}
            rows={10}
          />

          {/* Config row */}
          <div className="ra-config-row">
            <div className="ra-field">
              <label className="ra-label">Target Role</label>
              <select className="ra-select" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
                {ROLES.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div className="ra-field">
              <label className="ra-label">Experience Level</label>
              <select className="ra-select" value={form.level} onChange={e => setForm(f => ({ ...f, level: e.target.value }))}>
                {LEVELS.map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
          </div>

          {/* JD textarea */}
          <div className="ra-field" style={{ marginTop: "16px" }}>
            <label className="ra-label">Job Description <span className="opt-tag">optional — improves accuracy</span></label>
            <textarea
              className="ra-textarea jd-textarea"
              placeholder="Paste the job description here for precise keyword matching..."
              value={form.jd}
              onChange={e => setForm(f => ({ ...f, jd: e.target.value }))}
              rows={4}
            />
          </div>

          {error && <div className="ra-error">⚠️ {error}</div>}

          <button className="ra-analyze-btn" onClick={handleSubmit} disabled={!form.text.trim()}>
            <span>⚡ Analyze My Resume</span>
          </button>

          <div className="ra-features-row">
            {["ATS Score", "Keyword Gap", "Bullet Rewriter", "Red Flags", "Optimized Resume", "2025 Trends"].map(f => (
              <span key={f} className="ra-feature-chip">{f}</span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── LOADING PHASE ────────────────────────────────────────────────────────────

  if (phase === "loading") return (
    <div className="ra-page ra-loading-page">
      <LoadingPhase />
    </div>
  );

  // ── RESULTS PHASE ────────────────────────────────────────────────────────────

  const r = results;
  const totalFlags = r.red_flags?.length || 0;
  const flagsHigh = r.red_flags?.filter(f => f.severity === "high").length || 0;

  return (
    <div className="ra-page ra-results-page">
      {/* Results header */}
      <div className="results-header">
        <div className="results-meta">
          <h2 className="results-title">Analysis Complete</h2>
          <p className="results-sub">
            {r.target_role} · {r.experience_level} · {r.word_count} words
          </p>
        </div>
        <button className="re-analyze-btn" onClick={() => setPhase("input")}>
          ← Re-Analyze
        </button>
      </div>

      {/* Tab bar */}
      <div className="tab-bar">
        {tabs.map(t => (
          <button
            key={t.id}
            className={`tab-btn ${activeTab === t.id ? "tab-active" : ""}`}
            onClick={() => setActiveTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="tab-content">

        {/* ── OVERVIEW ─────────────────────────────────────────────────────── */}
        {activeTab === "overview" && (
          <div className="tab-panel">
            <div className="overview-grid">
              {/* Score ring */}
              <div className="ov-score-card neu-card">
                <ScoreRing score={r.ats_score} label={r.score_label} />
                <p className="ov-score-hint">ATS Score</p>
              </div>

              {/* Stats */}
              <div className="ov-stats-card neu-card">
                <h3 className="panel-title">Quick Stats</h3>
                <div className="stat-row">
                  <span className="stat-icon">🔑</span>
                  <span className="stat-label">Keywords Found</span>
                  <span className="stat-val green">{r.keyword_analysis?.found?.length || 0}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-icon">❌</span>
                  <span className="stat-label">Keywords Missing</span>
                  <span className="stat-val red">{r.keyword_analysis?.missing?.length || 0}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-icon">🚨</span>
                  <span className="stat-label">Red Flags</span>
                  <span className="stat-val" style={{ color: flagsHigh ? "#ef4444" : "#f5e642" }}>{totalFlags} ({flagsHigh} high)</span>
                </div>
                <div className="stat-row">
                  <span className="stat-icon">✏️</span>
                  <span className="stat-label">Bullets to Improve</span>
                  <span className="stat-val yellow">{r.bullet_improvements?.length || 0}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-icon">📈</span>
                  <span className="stat-label">Score After Fixes</span>
                  <span className="stat-val green">~{r.improvement_plan?.estimated_score_after_fix}</span>
                </div>
              </div>

              {/* Score breakdown */}
              <div className="ov-breakdown-card neu-card">
                <h3 className="panel-title">Score Breakdown</h3>
                {Object.values(r.score_breakdown).map(d => (
                  <ScoreBar key={d.label} label={d.label} score={d.score} max={d.max} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── SECTIONS ──────────────────────────────────────────────────────── */}
        {activeTab === "sections" && (
          <div className="tab-panel">
            <p className="panel-desc">Click any section to see issues, fixes, and rewrite examples.</p>
            <div className="sections-grid">
              {Object.entries(r.section_analysis).map(([name, data]) => (
                <SectionCard key={name} name={name.charAt(0).toUpperCase() + name.slice(1)} data={data} />
              ))}
            </div>
          </div>
        )}

        {/* ── KEYWORDS ──────────────────────────────────────────────────────── */}
        {activeTab === "keywords" && (
          <div className="tab-panel">
            <p className="panel-desc">Click any chip to copy the keyword. Add missing ones to your Skills / Projects section.</p>

            <div className="kw-grid">
              <div className="kw-col">
                <h3 className="kw-col-title found-title">✅ Found in Resume ({r.keyword_analysis.found.length})</h3>
                <div className="chips-wrap">
                  {r.keyword_analysis.found.map(k => <KeyChip key={k} word={k} type="found" />)}
                </div>
              </div>
              <div className="kw-col">
                <h3 className="kw-col-title missing-title">❌ Missing Keywords ({r.keyword_analysis.missing.length})</h3>
                <div className="chips-wrap">
                  {r.keyword_analysis.missing.map(k => <KeyChip key={k} word={k} type="missing" />)}
                </div>
              </div>
            </div>

            {r.keyword_analysis.jd_specific_missing?.length > 0 && (
              <div className="kw-jd-section">
                <h3 className="kw-col-title" style={{ color: "#38bdf8" }}>📋 JD-Specific Missing Keywords</h3>
                <div className="chips-wrap">
                  {r.keyword_analysis.jd_specific_missing.map(k => <KeyChip key={k} word={k} type="jd-missing" />)}
                </div>
              </div>
            )}

            {r.keyword_analysis.overused_weak_phrases?.length > 0 && (
              <div className="kw-jd-section">
                <h3 className="kw-col-title" style={{ color: "#f97316" }}>⚠️ Weak Phrases to Remove</h3>
                <div className="chips-wrap">
                  {r.keyword_analysis.overused_weak_phrases.map(k => <KeyChip key={k} word={k} type="weak" />)}
                </div>
                <p className="kw-replace-hint">Replace with: {r.keyword_analysis.suggested_action_verbs?.join(" · ")}</p>
              </div>
            )}
          </div>
        )}

        {/* ── BULLETS ───────────────────────────────────────────────────────── */}
        {activeTab === "bullets" && (
          <div className="tab-panel">
            {r.bullet_improvements?.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">🎉</span>
                <p>No weak bullets detected — your bullet points are already strong!</p>
              </div>
            ) : (
              <>
                <p className="panel-desc">Toggle between "Before" and "After" to see the transformation. Formula: <code>Action Verb + What + Tech + Impact (number)</code></p>
                <div className="bullets-list">
                  {r.bullet_improvements.map((item, i) => <BulletCard key={i} item={item} />)}
                </div>
              </>
            )}
          </div>
        )}

        {/* ── PROJECTS ──────────────────────────────────────────────────────── */}
        {activeTab === "projects" && (
          <div className="tab-panel">
            {r.project_optimization?.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">🚀</span>
                <p>Project titles look good! Apply the bullet improvements above.</p>
              </div>
            ) : (
              <>
                <p className="panel-desc">Project titles and descriptions optimized for maximum recruiter impact.</p>
                {r.project_optimization.map((p, i) => <ProjectCard key={i} proj={p} />)}
              </>
            )}
          </div>
        )}

        {/* ── RED FLAGS ─────────────────────────────────────────────────────── */}
        {activeTab === "redflags" && (
          <div className="tab-panel">
            {r.red_flags?.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">🎉</span>
                <p>No red flags detected!</p>
              </div>
            ) : (
              <>
                <p className="panel-desc">{r.red_flags.length} issue{r.red_flags.length > 1 ? "s" : ""} found. Fix HIGH severity first — they affect ATS filtering directly.</p>
                <div className="flags-list">
                  {[...r.red_flags].sort((a, b) => ({ high: 0, medium: 1, low: 2 }[a.severity] - { high: 0, medium: 1, low: 2 }[b.severity]))
                    .map((f, i) => <RedFlagCard key={i} flag={f} />)}
                </div>
              </>
            )}
          </div>
        )}

        {/* ── OPTIMIZED RESUME ──────────────────────────────────────────────── */}
        {activeTab === "optimized" && (
          <div className="tab-panel">
            <div className="opt-header">
              <div>
                <h3 className="panel-title">ATS-Optimized Resume</h3>
                <p className="panel-desc">Restructured with strong bullets, keyword placement, and clean formatting. Fill in the placeholders in [brackets].</p>
              </div>
              <button className="copy-btn" onClick={copyOptimized}>
                {copied ? "✓ Copied!" : "📋 Copy All"}
              </button>
            </div>
            <pre className="opt-resume-block">{r.optimized_resume}</pre>
          </div>
        )}

        {/* ── ROADMAP ───────────────────────────────────────────────────────── */}
        {activeTab === "roadmap" && (
          <div className="tab-panel">
            <div className="roadmap-score-banner">
              <span>Current Score</span>
              <span className="rm-score current">{r.ats_score}</span>
              <span className="rm-arrow">→→→</span>
              <span>After Fixes</span>
              <span className="rm-score target">{r.improvement_plan.estimated_score_after_fix}</span>
            </div>

            <div className="roadmap-section">
              <h3 className="roadmap-section-title">🔥 Priority Fixes (do these first)</h3>
              {r.improvement_plan.priority_fixes.map((fix, i) => (
                <div key={i} className="roadmap-item priority">
                  <span className="rm-num">{i + 1}</span>
                  <div className="rm-content">
                    <p className="rm-fix">{fix.fix}</p>
                    <div className="rm-meta">
                      <span className="rm-tag impact">{fix.impact}</span>
                      <span className="rm-tag effort">⏱ {fix.effort}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="roadmap-section">
              <h3 className="roadmap-section-title">⚡ Quick Wins (under 15 min each)</h3>
              {r.improvement_plan.quick_wins.map((win, i) => (
                <div key={i} className="roadmap-item quick-win">
                  <span className="rm-check">✓</span>
                  <p className="rm-fix">{win}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── BONUS ─────────────────────────────────────────────────────────── */}
        {activeTab === "bonus" && (
          <div className="tab-panel">
            <div className="bonus-grid">

              <div className="bonus-card neu-card">
                <h3 className="bonus-title">🔥 Trending Skills 2025</h3>
                <p className="bonus-hint">For <strong>{r.target_role}</strong> — learn 2–3 of these to stand out</p>
                <div className="chips-wrap">
                  {r.bonus.trending_skills_2025.map((s, i) => (
                    <span key={i} className="trend-chip">{s}</span>
                  ))}
                </div>
              </div>

              <div className="bonus-card neu-card">
                <h3 className="bonus-title">🚀 Suggested Projects</h3>
                <p className="bonus-hint">Build these to complete your portfolio</p>
                {r.bonus.suggested_projects.map((p, i) => (
                  <div key={i} className="sugg-proj">
                    <p className="sugg-proj-title">{p.title}</p>
                    <p className="sugg-proj-tech">{p.tech}</p>
                    <p className="sugg-proj-why">💡 {p.why}</p>
                  </div>
                ))}
              </div>

              <div className="bonus-card neu-card">
                <h3 className="bonus-title">🐙 GitHub Profile Tips</h3>
                <ul className="bonus-list">
                  {r.bonus.github_tips.map((t, i) => <li key={i}>{t}</li>)}
                </ul>
              </div>

              <div className="bonus-card neu-card">
                <h3 className="bonus-title">🌐 Portfolio Tips</h3>
                <ul className="bonus-list">
                  {r.bonus.portfolio_tips.map((t, i) => <li key={i}>{t}</li>)}
                </ul>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
