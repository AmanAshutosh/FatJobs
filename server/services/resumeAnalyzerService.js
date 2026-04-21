'use strict';

// ── Role Knowledge Base ────────────────────────────────────────────────────────

const ROLE_PROFILES = {
  'mern stack': {
    must_have: ['React', 'Node.js', 'MongoDB', 'Express', 'JavaScript', 'REST API', 'HTML', 'CSS', 'Git'],
    nice_to_have: ['Redux', 'TypeScript', 'JWT', 'Mongoose', 'Docker', 'AWS', 'Next.js', 'GraphQL', 'Redis', 'Socket.io', 'Tailwind'],
    action_verbs: ['Built', 'Developed', 'Designed', 'Implemented', 'Deployed', 'Optimized', 'Integrated', 'Engineered'],
    project_suggestions: [
      { title: 'Full-Stack E-commerce Platform', tech: 'React · Node.js · MongoDB · Stripe/Razorpay · Redis', why: 'Shows end-to-end MERN with payment integration — highest recruiter signal' },
      { title: 'Real-Time Chat Application', tech: 'React · Socket.io · Node.js · MongoDB · JWT Auth', why: 'Demonstrates WebSocket + auth — essential MERN portfolio piece' },
      { title: 'SaaS Task Manager with Collaboration', tech: 'Next.js · Express · MongoDB · Drag-and-Drop · Role-based Auth', why: 'Complex state + UX + auth — differentiates from basic CRUD apps' },
    ],
    trending_2025: ['Next.js 14 (App Router)', 'Prisma ORM', 'tRPC', 'Bun.js', 'Turborepo', 'shadcn/ui', 'Supabase', 'Vercel AI SDK', 'Zod', 'WebSockets (native)'],
    github_tips: ['Pin 3–4 MERN projects with live demo links in each README', 'Add a profile README.md with animated tech-stack badges', 'Set up GitHub Actions CI/CD pipeline in at least 1 project', 'Each repo: Screenshots · Live Demo URL · Tech Stack section · Setup guide', 'Contribute to open-source React/Node.js repos to build credibility'],
    portfolio_tips: ['Deploy every project on Vercel/Railway with a live URL', 'Build a personal site showcasing projects with before/after screenshots', 'Include GitHub stats widget and contribution graph on portfolio', 'Add a "Tech Stack" section with technology icons (use devicon.dev)', 'Record a 60-second Loom video demo for your best project'],
  },
  'frontend developer': {
    must_have: ['React', 'JavaScript', 'HTML', 'CSS', 'TypeScript', 'Git', 'Responsive Design', 'REST API'],
    nice_to_have: ['Vue.js', 'Next.js', 'Redux', 'Tailwind CSS', 'Vite', 'Testing Library', 'Jest', 'Figma', 'SASS', 'Performance Optimization', 'Web Accessibility'],
    action_verbs: ['Built', 'Designed', 'Optimized', 'Implemented', 'Refactored', 'Migrated', 'Enhanced', 'Created', 'Improved'],
    project_suggestions: [
      { title: 'Design System / Component Library', tech: 'React · TypeScript · Storybook · CSS Custom Properties', why: 'Shows component architecture thinking — valued at all seniority levels' },
      { title: 'Real-Time Analytics Dashboard', tech: 'React · Recharts · WebSocket · TypeScript · Tailwind', why: 'Data viz + performance — differentiating frontend signal' },
      { title: 'PWA with Offline Support', tech: 'React · Service Worker · IndexedDB · Web Push API', why: 'Advanced browser APIs — rare skill that recruiters notice' },
    ],
    trending_2025: ['React Server Components', 'React 19 Actions', 'Next.js 14 App Router', 'Tailwind v4', 'shadcn/ui', 'Framer Motion', 'TanStack Router', 'Biome', 'TypeScript 5.x', 'Web Vitals (INP metric)'],
    github_tips: ['Your portfolio site must have a live deployed URL — no exceptions', 'Show component-level thinking: small, composable, well-typed components', 'Add Lighthouse Performance scores in project READMEs (aim 90+)', 'Screenshot your UI in the README — visual proof matters for frontend', 'Include bundle size stats if you optimized (e.g., "Reduced bundle by 40%")'],
    portfolio_tips: ['Include a "Before / After" performance section showing your optimizations', 'Show cross-browser screenshots (Chrome, Firefox, Safari, mobile)', 'Add accessibility score (WCAG compliance) to differentiate from peers', 'Show Figma design → implementation side-by-side for at least one project', 'Link to a CodeSandbox or StackBlitz for interactive demos'],
  },
  'backend developer': {
    must_have: ['Node.js', 'REST API', 'SQL', 'Git', 'Database', 'Authentication', 'Express', 'PostgreSQL'],
    nice_to_have: ['Python', 'Docker', 'Redis', 'MongoDB', 'GraphQL', 'Microservices', 'Kafka', 'AWS', 'JWT', 'Testing', 'gRPC', 'TypeScript'],
    action_verbs: ['Built', 'Designed', 'Engineered', 'Optimized', 'Deployed', 'Scaled', 'Architected', 'Implemented', 'Reduced', 'Automated'],
    project_suggestions: [
      { title: 'RESTful API with Rate Limiting & Caching', tech: 'Node.js · Express · Redis · PostgreSQL · Docker · Swagger', why: 'Core backend skills in one project — clean signal for any backend role' },
      { title: 'Auth Service with OAuth2 & JWT Refresh Tokens', tech: 'Node.js · Express · PostgreSQL · OAuth2 · JWT · bcrypt', why: 'Security-aware auth — shows maturity beyond CRUD' },
      { title: 'Event-Driven Microservice with Message Queue', tech: 'Node.js · RabbitMQ/Kafka · Docker Compose · PostgreSQL', why: 'Enterprise architecture awareness — separates you from CRUD devs' },
    ],
    trending_2025: ['Bun.js', 'Hono.js', 'tRPC', 'Prisma ORM', 'Drizzle ORM', 'Kafka', 'OpenTelemetry', 'gRPC', 'ClickHouse', 'Temporal.io (workflows)'],
    github_tips: ['Include Swagger/OpenAPI documentation in repos', 'Add Docker Compose for one-command local setup', 'Write integration tests hitting a real test database', 'Show database schema design in README with ER diagram', 'Include load test results if you optimized performance'],
    portfolio_tips: ['Deploy APIs publicly with Swagger UI accessible', 'Show architecture diagrams using draw.io or Excalidraw', 'Include a Postman collection for testing your API', 'Demonstrate handling of edge cases: rate limiting, error handling, logging', 'Show monitoring setup (Prometheus/Grafana)'],
  },
  'sde': {
    must_have: ['Data Structures', 'Algorithms', 'Git', 'OOP', 'REST API', 'Problem Solving', 'JavaScript', 'Python'],
    nice_to_have: ['System Design', 'SQL', 'Dynamic Programming', 'Trees', 'Graphs', 'LeetCode', 'Java', 'C++', 'Docker', 'Cloud'],
    action_verbs: ['Solved', 'Implemented', 'Designed', 'Optimized', 'Built', 'Engineered', 'Reduced', 'Improved', 'Developed', 'Architected'],
    project_suggestions: [
      { title: 'URL Shortener with Click Analytics', tech: 'Node.js · Redis · PostgreSQL · React · Docker', why: 'Covers hashing, caching, DB design — classic SDE interview topic' },
      { title: 'Distributed Rate Limiter Library', tech: 'Node.js/Python · Redis · Docker · Jest/Pytest', why: 'Shows system design awareness — publishable as open-source package' },
      { title: 'Code Execution Sandbox (Mini LeetCode)', tech: 'React · Node.js · Docker Sandbox · WebSocket · Queue', why: 'Complex distributed architecture — highest credibility signal for SDE roles' },
    ],
    trending_2025: ['System Design', 'Distributed Systems', 'Go', 'Rust (basics)', 'Cloud (AWS/GCP)', 'Kubernetes basics', 'ClickHouse', 'Kafka', 'gRPC', 'OpenTelemetry'],
    github_tips: ['Pin competitive programming repo: link LeetCode profile in bio', 'Include time/space complexity in algorithm implementations', 'Projects should show scale: pagination, caching, indexing, rate limiting', 'Highlight open-source contributions with merged PRs', 'Write README as a technical design document'],
    portfolio_tips: ['Include a dedicated "Problem Solving" section with LeetCode stats', 'Show system design diagrams for your most complex project', 'Link to any published technical articles or dev.to posts', 'Demonstrate knowledge of trade-offs (SQL vs NoSQL, REST vs GraphQL)', 'Certifications (AWS SAA, etc.) add credibility'],
  },
  'data analyst': {
    must_have: ['SQL', 'Python', 'Excel', 'Data Visualization', 'Statistics', 'Pandas', 'NumPy'],
    nice_to_have: ['Tableau', 'Power BI', 'Looker', 'R', 'Matplotlib', 'Seaborn', 'BigQuery', 'Snowflake', 'A/B Testing', 'Dashboard', 'Google Analytics'],
    action_verbs: ['Analyzed', 'Visualized', 'Identified', 'Reduced', 'Improved', 'Built', 'Designed', 'Extracted', 'Modeled', 'Transformed', 'Automated', 'Forecasted'],
    project_suggestions: [
      { title: 'Sales Performance Dashboard with Forecasting', tech: 'Python · Pandas · Tableau/Power BI · SQL · Streamlit', why: 'End-to-end analytics pipeline — demonstrates business value immediately' },
      { title: 'Customer Segmentation Analysis', tech: 'Python · Scikit-learn · Pandas · Matplotlib · SQL', why: 'Combines SQL + ML + visualization — multi-skill proof' },
      { title: 'A/B Testing Framework & Statistical Report', tech: 'Python · SciPy · Pandas · SQL · Jupyter', why: 'Product analytics core skill — highly valued at tech companies' },
    ],
    trending_2025: ['dbt (data build tool)', 'DuckDB', 'Polars', 'Snowflake', 'BigQuery', 'Hex Notebooks', 'Apache Spark', 'Metabase', 'LLM for Analytics (Text-to-SQL)', 'Observable Plot'],
    github_tips: ['Use Jupyter Notebooks — recruiters expect interactive .ipynb files', 'Include data visualizations as screenshots in README', 'Show SQL query complexity: CTEs, window functions, subqueries', 'Deploy dashboards (Streamlit/Gradio) with public links', 'Share Kaggle profile link'],
    portfolio_tips: ['Include a case study format: Problem → Approach → Insight → Business Impact', 'Show data cleaning steps — DA recruiters care about data quality', 'Include a public Tableau/Power BI dashboard link', 'Write a blog post about each analysis project on Medium or dev.to', 'Show sample SQL queries with comments explaining your logic'],
  },
  'data scientist': {
    must_have: ['Python', 'Machine Learning', 'Pandas', 'NumPy', 'Scikit-learn', 'Statistics', 'SQL'],
    nice_to_have: ['TensorFlow', 'PyTorch', 'NLP', 'Computer Vision', 'Deep Learning', 'Spark', 'MLflow', 'AWS SageMaker', 'Feature Engineering', 'Model Deployment', 'HuggingFace'],
    action_verbs: ['Built', 'Trained', 'Optimized', 'Improved', 'Developed', 'Designed', 'Reduced', 'Increased', 'Deployed', 'Evaluated', 'Engineered', 'Fine-tuned'],
    project_suggestions: [
      { title: 'End-to-End ML Pipeline with Production Deployment', tech: 'Python · FastAPI · Scikit-learn · MLflow · Docker', why: 'Production ML mindset — shows you build real models, not just notebooks' },
      { title: 'NLP Sentiment Analysis API', tech: 'Python · HuggingFace Transformers · FastAPI · Docker', why: 'NLP + LLM ecosystem is the hottest DS skill in 2025' },
      { title: 'Recommendation System (Collaborative Filtering)', tech: 'Python · Pandas · Matrix Factorization · Flask · PostgreSQL', why: 'High business value — shows real-world ML with engineering' },
    ],
    trending_2025: ['LLM Fine-tuning (LoRA/QLoRA)', 'LangChain/LlamaIndex', 'Vector DBs (Pinecone/Weaviate)', 'MLOps', 'RAG Systems', 'HuggingFace PEFT', 'DPO/RLHF', 'Multimodal AI', 'AutoML (AutoGluon)', 'Feature Stores'],
    github_tips: ['Show model metrics: Accuracy, F1, AUC-ROC, RMSE — in README', 'Include Jupyter notebooks with clear markdown cells', 'Deploy models as APIs (FastAPI/Streamlit) with public links', 'Use MLflow or W&B for experiment tracking', 'Kaggle Expert/Master badge is a legitimate resume credential'],
    portfolio_tips: ['Frame every project as: Business Problem → ML Approach → Metrics → Deployment', 'Show model comparison tables (Baseline vs Final)', 'Include a section on "What I would do with more data/compute"', 'Write Medium articles about your models', 'Link to Kaggle notebooks for public competition work'],
  },
  'devops': {
    must_have: ['Docker', 'Linux', 'CI/CD', 'Git', 'Bash', 'AWS', 'Kubernetes'],
    nice_to_have: ['Terraform', 'Ansible', 'Jenkins', 'GitHub Actions', 'Prometheus', 'Grafana', 'Helm', 'Nginx', 'Redis', 'GCP', 'Azure'],
    action_verbs: ['Automated', 'Deployed', 'Orchestrated', 'Configured', 'Optimized', 'Reduced', 'Implemented', 'Managed', 'Scaled', 'Migrated', 'Provisioned'],
    project_suggestions: [
      { title: 'Kubernetes Cluster with Full Observability Stack', tech: 'K8s · Prometheus · Grafana · Helm · GitHub Actions', why: 'Core DevOps stack — shows production-level infrastructure thinking' },
      { title: 'CI/CD Pipeline from Code to Production (Zero Downtime)', tech: 'GitHub Actions · Docker · AWS ECS · Terraform · Blue-Green Deploy', why: 'IaC + automation + zero-downtime = ideal DevOps candidate profile' },
      { title: 'Infrastructure as Code for Multi-Environment Setup', tech: 'Terraform · AWS · Ansible · CloudWatch · SNS Alerts', why: 'Multi-env management shows scale thinking' },
    ],
    trending_2025: ['Platform Engineering', 'GitOps (ArgoCD/Flux)', 'eBPF', 'Crossplane', 'Karpenter', 'OpenTelemetry', 'Cilium CNI', 'Dagger.io', 'WASM for K8s', 'Backstage IDP'],
    github_tips: ['Show working Kubernetes manifests or Terraform code', 'Include architecture diagrams in READMEs', 'Demonstrate real cloud cost impact: "Reduced infra costs by X%"', 'Public CI/CD workflows in .github/workflows/ folder', 'Certifications (CKA, AWS SAA) worth pinning in GitHub bio'],
    portfolio_tips: ['Show a working monitoring dashboard (Grafana) with screenshots', 'Document a real incident you resolved and how you automated the fix', 'Include cost optimization case studies with actual numbers', 'Show before/after deployment times with your CI/CD improvements', 'Publish runbooks as GitHub wikis'],
  },
  'react developer': {
    must_have: ['React', 'JavaScript', 'TypeScript', 'HTML', 'CSS', 'Git', 'REST API', 'State Management'],
    nice_to_have: ['Redux', 'React Query', 'Next.js', 'Testing Library', 'Jest', 'Tailwind CSS', 'Vite', 'Storybook', 'Performance', 'React Native', 'Zustand'],
    action_verbs: ['Built', 'Optimized', 'Designed', 'Refactored', 'Implemented', 'Migrated', 'Created', 'Improved', 'Delivered', 'Engineered'],
    project_suggestions: [
      { title: 'Component Library with Design System', tech: 'React · TypeScript · Storybook · CSS Variables · Chromatic', why: 'Shows architectural and documentation skills' },
      { title: 'Real-Time Data Dashboard', tech: 'React · TanStack Query · WebSocket · Recharts · TypeScript', why: 'Complex state + performance + real-time — difficult to fake' },
      { title: 'PWA with Offline Support & Push Notifications', tech: 'React · Service Worker · IndexedDB · Web Push API · TypeScript', why: 'Advanced browser APIs — rare and recruiter-noticed skill' },
    ],
    trending_2025: ['React 19 Actions & Transitions', 'React Server Components', 'TanStack Router v1', 'Zustand / Jotai', 'shadcn/ui', 'Next.js 14 App Router', 'Million.js', 'TypeScript 5.x', 'Biome linter', 'Vite 5'],
    github_tips: ['Show component architecture: src/components/ui/ + src/features/ split', 'Include Storybook stories for reusable components', 'Add React DevTools screenshots showing component hierarchy', 'Performance metrics: Bundle size, Lighthouse, Core Web Vitals in README', 'Live deployed Vercel/Netlify links for every project — mandatory'],
    portfolio_tips: ['Show component API design with TypeScript props documentation', 'Include before/after performance metrics using Chrome DevTools', 'Show mobile responsiveness with side-by-side screenshots', 'Link to CodeSandbox/StackBlitz for interactive demos', 'Include a "Built with" tech badge section at the top of each README'],
  },
};

// ── Constants ─────────────────────────────────────────────────────────────────

const STRONG_ACTION_VERBS = [
  'built', 'developed', 'designed', 'created', 'implemented', 'engineered',
  'deployed', 'optimized', 'architected', 'led', 'managed', 'drove',
  'increased', 'reduced', 'improved', 'launched', 'delivered', 'automated',
  'integrated', 'migrated', 'refactored', 'analyzed', 'visualized', 'trained',
  'solved', 'established', 'spearheaded', 'orchestrated', 'scaled', 'streamlined',
  'transformed', 'accelerated', 'boosted', 'generated', 'achieved', 'coordinated',
  'collaborated', 'maintained', 'configured', 'provisioned', 'monitored',
];

const WEAK_STARTERS = [
  'worked on', 'was responsible for', 'responsible for', 'helped with', 'helped to',
  'assisted in', 'was involved in', 'participated in', 'was part of',
  'worked as part of', 'was tasked with', 'contributed to the', 'involved in',
];

const GENERIC_OBJECTIVES = [
  'seeking a challenging', 'to work in a dynamic', 'hardworking individual',
  'passionate about technology', 'eager to learn', 'looking for an opportunity',
  'fresher looking', 'to utilize my skills', 'a position where i can',
  'goal-oriented', 'team player', 'quick learner', 'obtain a position',
];

// ── Role Normalizer ────────────────────────────────────────────────────────────

function normalizeRole(role) {
  const r = (role || '').toLowerCase().trim();
  if (r.includes('mern')) return 'mern stack';
  if (r.includes('frontend') || r.includes('front-end') || r.includes('front end')) return 'frontend developer';
  if (r.includes('backend') || r.includes('back-end') || r.includes('back end')) return 'backend developer';
  if (r.includes('react developer') || r.includes('react native') || r.includes('react dev')) return 'react developer';
  if (r.includes('react')) return 'react developer';
  if (r.includes('sde') || r.includes('software engineer') || r.includes('software developer') || r.includes('full stack') || r.includes('fullstack')) return 'sde';
  if (r.includes('data analyst') || r.includes('analyst')) return 'data analyst';
  if (r.includes('data scien') || r.includes('machine learning') || r.includes('ml engineer')) return 'data scientist';
  if (r.includes('devops') || r.includes('cloud engineer') || r.includes('sre') || r.includes('site reliability')) return 'devops';
  return 'sde';
}

function getRoleProfile(role) {
  return ROLE_PROFILES[normalizeRole(role)] || ROLE_PROFILES['sde'];
}

// ── Section Detection (FIXED: handles decorative headers + PDF text) ──────────

const SEC_PATS = {
  summary:        /\b(summary|objective|profile|about\s*me|career\s*objective|professional\s*summary|overview|introduction)\b/i,
  skills:         /\b(skills|technical\s*skills|tech\s*stack|technologies|competencies|expertise|tools(\s*[&and]+\s*technologies)?|core\s*competencies)\b/i,
  experience:     /\b(experience|work\s*experience|employment|work\s*history|internship|professional\s*experience|industry\s*experience|work\s*&\s*experience)\b/i,
  projects:       /\b(projects|project\s*work|personal\s*projects|academic\s*projects|key\s*projects|portfolio|notable\s*projects|my\s*projects|side\s*projects)\b/i,
  education:      /\b(education|educational\s*background|academic\s*(background|qualification)?|qualification|degree|university|college|schooling)\b/i,
  certifications: /\b(certifications?|certificates?|courses?|training|achievements?|awards?|accomplishments?|honors?)\b/i,
  links:          /\b(github|linkedin|portfolio|contact|social|links?|website|online\s*presence|profiles?)\b/i,
};

function stripDecorative(s) {
  // Remove horizontal bar chars, dashes, ═══, ───, === etc from both ends
  return s
    .replace(/^[\s\-=─━▬▭_~*#|►▶─-╿═-╦]+/, '')
    .replace(/[\s\-=─━▬▭_~*#|►▶─-╿═-╦]+$/, '')
    .trim();
}

function detectSections(text) {
  const lines = text.split('\n');
  const sections = {};
  const sectionContent = {};
  let currentSection = 'unsorted';
  let currentLines = [];

  const saveSection = () => {
    const content = currentLines.join('\n').trim();
    if (currentSection && content) sectionContent[currentSection] = content;
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) { currentLines.push(''); continue; }

    // Strip decorative characters BEFORE length check and pattern matching
    // This fixes: "─── PROJECTS ───", "=== Skills ===", "### Projects ###"
    const cleaned = stripDecorative(trimmed);
    const testStr = cleaned.length > 0 && cleaned.length < 80 ? cleaned
                  : trimmed.length < 80 ? trimmed
                  : null;

    if (testStr) {
      let matched = null;
      for (const [sec, pat] of Object.entries(SEC_PATS)) {
        if (pat.test(testStr)) { matched = sec; break; }
      }
      if (matched) {
        saveSection();
        currentSection = matched;
        currentLines = [];
        sections[matched] = true;
        continue;
      }
    }
    currentLines.push(line);
  }
  saveSection();
  return { sections, sectionContent };
}

// ── Bullet Extraction (FIXED: verb-detection + wider symbol support) ───────────

function extractBullets(text) {
  if (!text) return [];
  const seen = new Set();
  const results = [];

  for (const line of text.split('\n')) {
    const trimmed = line.trim();
    if (trimmed.length < 12 || trimmed.length > 280) continue;
    if (seen.has(trimmed)) continue;

    // Explicit bullet symbol at start
    const symMatch = trimmed.match(/^[•·\-\*▪►•‣●▸○◦▷»–]\s+(.+)/);
    if (symMatch && symMatch[1].trim().length >= 10) {
      results.push(symMatch[1].trim());
      seen.add(trimmed);
      continue;
    }

    // Numbered list: 1. / 1) / (1)
    const numMatch = trimmed.match(/^(?:\(\d+\)|\d+[.):])\s+(.+)/);
    if (numMatch && numMatch[1].trim().length >= 10) {
      results.push(numMatch[1].trim());
      seen.add(trimmed);
      continue;
    }

    // Lines starting with a known strong action verb (common in PDF-extracted text)
    const firstWord = trimmed.split(/\s+/)[0].replace(/[,.:;!?]$/, '').toLowerCase();
    if (STRONG_ACTION_VERBS.includes(firstWord) && trimmed.length >= 18) {
      results.push(trimmed);
      seen.add(trimmed);
      continue;
    }

    // Lines starting with a weak/passive verb (we want to catch these for improvement)
    const weakVerbStarters = ['worked', 'helped', 'assisted', 'responsible', 'participated', 'involved', 'collaborated'];
    if (weakVerbStarters.includes(firstWord) && trimmed.length >= 18) {
      results.push(trimmed);
      seen.add(trimmed);
      continue;
    }
  }

  return results.slice(0, 25);
}

// ── ATS Score Dimensions ──────────────────────────────────────────────────────

function scoreKeywordMatch(textLower, profile, jd) {
  const allKw = [...new Set([...profile.must_have, ...profile.nice_to_have])];
  const jdLower = jd ? jd.toLowerCase() : '';
  const foundList = [];
  const missingList = [];

  for (const kw of allKw) {
    const kwl = kw.toLowerCase();
    if (textLower.includes(kwl) || jdLower.includes(kwl)) {
      foundList.push(kw);
    } else {
      missingList.push(kw);
    }
  }

  return { score: Math.min(30, (foundList.length / allKw.length) * 30), foundList, missingList };
}

function scoreFormatting(text, sections) {
  const presentCount = Object.keys(sections).length;
  const hasBullets = extractBullets(text).length >= 2;
  const wc = text.split(/\s+/).length;
  const hasEmail = /[\w.+-]+@[\w.]+\.[a-z]{2,}/i.test(text);
  const hasPhone = /[\+\d][\d\s\-()]{9,}/.test(text);

  let s = 0;
  s += Math.min(6, (presentCount / 5) * 6);
  s += hasBullets ? 3 : 0;
  s += (wc >= 250 && wc <= 900) ? 3 : wc > 100 ? 1 : 0;
  s += hasEmail ? 1.5 : 0;
  s += hasPhone ? 1.5 : 0;
  return Math.min(15, s);
}

function scoreContentQuality(text) {
  const lower = text.toLowerCase();
  const verbsFound = STRONG_ACTION_VERBS.filter(v => lower.includes(v));
  const passiveCount = WEAK_STARTERS.filter(p => lower.includes(p)).length;
  const genericCount = GENERIC_OBJECTIVES.filter(g => lower.includes(g)).length;
  let s = Math.min(14, verbsFound.length * 1.8) - passiveCount * 2 - genericCount * 1.5;
  return Math.max(0, Math.min(20, s));
}

function scoreImpactMetrics(text) {
  const numbers = (text.match(/\d+/g) || []).length;
  const hasPercent = (text.match(/%/g) || []).length;
  const hasDollar = (text.match(/\$/g) || []).length;
  const hasXFactor = (text.match(/\d+x\b/gi) || []).length;
  const hasUsers = /\d+\s*(users|customers|clients|people|members)/i.test(text);

  let s = 0;
  s += Math.min(10, numbers * 0.7);
  s += Math.min(5, hasPercent * 1.5);
  s += Math.min(2, hasDollar * 1);
  s += Math.min(2, hasXFactor * 1);
  s += hasUsers ? 1 : 0;
  return Math.min(20, s);
}

function scoreSkillsRelevance(textLower, profile) {
  const found = profile.must_have.filter(k => textLower.includes(k.toLowerCase()));
  return Math.min(15, (found.length / profile.must_have.length) * 15);
}

// ── Section Analyzers ──────────────────────────────────────────────────────────

function analyzeSummary(sections, sectionContent) {
  const present = !!sections.summary;
  const content = sectionContent.summary || '';
  const lower = content.toLowerCase();
  const issues = [], improvements = [];

  if (!present) return {
    present: false, health: 'missing',
    issues: ['No Summary/Objective section found'],
    improvements: ['Add a 3-line Professional Summary at the very top of your resume'],
    rewrite: 'Results-driven [Role] with hands-on experience in [Key Skills]. Built [X] projects including [Best Project]. Seeking a [Target Role] position to deliver measurable impact.'
  };

  if (GENERIC_OBJECTIVES.some(g => lower.includes(g))) {
    issues.push('Generic objective language detected ("seeking a challenging position", "team player")');
    improvements.push('Replace with a specific Professional Summary mentioning top 2 skills and one measurable achievement');
  }
  if (content.split(/\s+/).length < 25) {
    issues.push('Summary is too short — under 25 words gives recruiters nothing to remember');
    improvements.push('Expand to 3–4 sentences: Who you are · What you build · What you achieved · What you want');
  }
  if (content.length < 200) {
    issues.push(`Summary is ${content.length} characters — recommend 300–350 characters for optimal ATS + human scan`);
    improvements.push('Add: Your specialization + top technology + one quantified achievement = strong summary');
  }
  if (!/\d/.test(content)) {
    issues.push('No measurable claim in summary — recruiters want proof, not promises');
    improvements.push('Add a metric: "Built X projects", "X+ contributions", "Improved performance by X%"');
  }

  const health = issues.length === 0 ? 'strong' : issues.length === 1 ? 'average' : 'weak';
  return {
    present, health, issues, improvements,
    rewrite: 'Results-driven software developer with proven experience building scalable [tech] applications. Delivered [X] production-ready projects serving [N]+ users, with demonstrated ability to reduce load times by [X%] through architecture optimization. Seeking a [Target Role] position where I can drive measurable engineering impact.'
  };
}

function analyzeSkills(sections, sectionContent, profile) {
  const present = !!sections.skills;
  const content = sectionContent.skills || '';
  const lower = content.toLowerCase();
  const issues = [], improvements = [];

  if (!present) return {
    present: false, health: 'missing',
    issues: ['No Skills section — ATS cannot parse your tech stack without it'],
    improvements: ['Add a Technical Skills section with categorized skills immediately after Summary'],
    rewrite: `Languages: JavaScript, TypeScript, Python\nFrameworks: React.js, Node.js, Express.js\nDatabases: MongoDB, PostgreSQL\nTools: Git, Docker, VS Code, Postman`
  };

  const irrelevant = ['ms word', 'microsoft word', 'powerpoint', 'ms office', 'microsoft office', 'ms excel', 'photoshop', 'coreldraw', 'ms powerpoint'];
  const foundIrrelevant = irrelevant.filter(s => lower.includes(s));
  if (foundIrrelevant.length) {
    issues.push(`Remove office/design tools irrelevant to dev roles: ${foundIrrelevant.join(', ')}`);
    improvements.push('Keep only technical/engineering skills — office tools are assumed and dilute your profile');
  }

  if (!/(languages?|frameworks?|tools|databases?|technologies|cloud|devops)/i.test(content)) {
    issues.push('Skills not categorized — hard for ATS to parse and for humans to scan in 6 seconds');
    improvements.push('Group into: Languages | Frameworks | Databases | Tools | Cloud/DevOps');
  }

  const missingMust = profile.must_have.filter(k => !lower.includes(k.toLowerCase()));
  if (missingMust.length > 2) {
    issues.push(`Missing ${missingMust.length} must-have skills for this role: ${missingMust.slice(0, 3).join(', ')}`);
    improvements.push(`Add these to Skills if you know them: ${missingMust.join(', ')}`);
  }

  const health = issues.length === 0 ? 'strong' : issues.length === 1 ? 'average' : 'weak';
  return {
    present, health, issues, improvements,
    rewrite: `Languages: ${profile.must_have.slice(0, 3).join(', ')}\nFrameworks: ${profile.must_have.slice(3, 6).join(', ')}\nTools & Databases: ${profile.nice_to_have.slice(0, 4).join(', ')}\nCloud/DevOps: Git, Docker, GitHub Actions`
  };
}

function analyzeProjects(sections, sectionContent, profile) {
  const present = !!sections.projects;
  const content = sectionContent.projects || '';
  const issues = [], improvements = [];

  if (!present || !content.trim()) return {
    present: false, health: 'missing',
    issues: ['No Projects section — this is the #1 section recruiters check for freshers/juniors'],
    improvements: ['Add 2–3 well-documented projects with live demo links and impact metrics'],
    rewrite: ''
  };

  // FIX: Extract bullets FROM the projects section text specifically
  const projectBullets = extractBullets(content);

  const hasMetrics = /\d+\s*(%|users|ms|seconds|requests|customers|downloads|visits|k\s*stars)/i.test(content);
  const hasLinks = /(github\.com|vercel\.app|netlify\.app|demo|live\s*link|source\s*code|deployed)/i.test(content);
  const genericTitles = ['todo', 'calculator', 'weather app', 'simple portfolio', 'basic blog', 'simple chat', 'basic ecommerce'];
  const foundGeneric = genericTitles.filter(g => content.toLowerCase().includes(g));

  if (!hasMetrics) {
    issues.push('No performance metrics — "built X" is weak vs "built X serving 500 users with 40ms response"');
    improvements.push('Add: active users, load time, uptime %, API response time, performance improvement %');
  }
  if (!hasLinks) {
    issues.push('No GitHub/live demo links — recruiters MUST verify your work to shortlist you');
    improvements.push('Add: GitHub repo URL + live demo URL for every project (non-negotiable for tech roles)');
  }
  if (foundGeneric.length) {
    issues.push(`Generic project title detected — blends in with thousands of other resumes`);
    improvements.push('Rename: "Todo App" → "Full-Stack Task Management Platform with Real-Time Sync & Team Collaboration"');
  }
  if (projectBullets.length < 2) {
    issues.push('Too few bullet points in projects — each project needs 2–3 impact-driven bullets');
    improvements.push('Structure each project: 1) What you built 2) How (tech choices) 3) Impact (metric)');
  }

  const health = issues.length === 0 ? 'strong' : issues.length <= 2 ? 'average' : 'weak';
  return { present, health, issues, improvements, rewrite: '' };
}

function analyzeEducation(sections, sectionContent) {
  const present = !!sections.education;
  const content = sectionContent.education || '';
  const issues = [], improvements = [];

  if (!present) return {
    present: false, health: 'missing',
    issues: ['No Education section found'],
    improvements: ['Add your degree, institution, graduation year, and GPA if above 7.5/75%'],
    rewrite: ''
  };

  if (!/\b(20\d{2})\b/.test(content)) {
    issues.push('Graduation year missing — ATS uses this for experience-level filtering');
    improvements.push('Add: "B.Tech CSE | XYZ University | 2024" — year is mandatory');
  }
  if (!/\b(gpa|cgpa|percentage|%)\b/i.test(content)) {
    improvements.push('Add GPA if above 7.5/75%: "CGPA: 8.2/10" — helps with eligibility filters');
  }

  return { present, health: issues.length === 0 ? 'strong' : 'average', issues, improvements, rewrite: '' };
}

function analyzeCertifications(sections, sectionContent) {
  const present = !!sections.certifications;
  const content = sectionContent.certifications || '';
  const issues = [], improvements = [];

  if (!present) return {
    present: false, health: 'missing',
    issues: ['No Certifications section — certs significantly differentiate freshers'],
    improvements: ['Add free certs: AWS Cloud Practitioner, Google Data Analytics, Meta Frontend Dev, HackerRank skills badges'],
    rewrite: ''
  };

  if (!/(aws|google|microsoft|meta|udemy|coursera|hackerrank|leetcode|ibm|cisco|oracle)/i.test(content)) {
    issues.push('Certifications from unknown sources carry less weight — use recognized platforms');
    improvements.push('Preferred issuers: AWS · Google · Microsoft · Meta · IBM · Coursera (university-backed)');
  }

  return { present, health: issues.length === 0 ? 'strong' : 'average', issues, improvements, rewrite: '' };
}

function analyzeLinks(text) {
  const hasGitHub = /github\.com\/[\w\-]+/i.test(text);
  const hasLinkedIn = /linkedin\.com\/in\/[\w\-]+/i.test(text);
  const hasPortfolio = /(vercel\.app|netlify\.app|\.dev\/|\.io\/[\w]|portfolio|personal\s*site)/i.test(text);
  const issues = [], improvements = [];

  if (!hasGitHub) {
    issues.push('No GitHub URL — #1 thing recruiters check for developer roles');
    improvements.push('Add: github.com/yourhandle — ensure repos are public and well-documented');
  }
  if (!hasLinkedIn) {
    issues.push('No LinkedIn URL — most ATS systems and recruiters verify LinkedIn profiles');
    improvements.push('Add: linkedin.com/in/yourname — ensure profile matches your resume');
  }
  if (!hasPortfolio) {
    improvements.push('Bonus: add a portfolio site (free Vercel/Netlify) for significantly higher callback rates');
  }

  const health = !hasGitHub && !hasLinkedIn ? 'missing' : issues.length === 0 ? 'strong' : 'average';
  return { present: hasGitHub || hasLinkedIn, health, issues, improvements, rewrite: '' };
}

// ── Keyword Analysis ──────────────────────────────────────────────────────────

function buildKeywordAnalysis(text, profile, jd, kwResult) {
  const lower = text.toLowerCase();
  const overused = WEAK_STARTERS.filter(p => lower.includes(p)).map(p => `"${p}"`);
  const jdMissing = [];

  if (jd) {
    const jdWords = [...new Set(jd.toLowerCase().match(/\b[a-z]{4,}\b/g) || [])];
    const stop = new Set(['with', 'that', 'this', 'have', 'from', 'your', 'will', 'they', 'more', 'also', 'such', 'when', 'where']);
    for (const w of jdWords) {
      if (!lower.includes(w) && !stop.has(w)) jdMissing.push(w);
    }
  }

  return {
    found: kwResult.foundList,
    missing: kwResult.missingList,
    jd_specific_missing: jdMissing.slice(0, 12),
    overused_weak_phrases: overused,
    suggested_action_verbs: ['Architected', 'Engineered', 'Optimized', 'Deployed', 'Delivered', 'Drove', 'Launched', 'Reduced', 'Increased', 'Automated'],
  };
}

// ── Contextual Keyword Weighting (NEW) ────────────────────────────────────────
// Skills listed in Skills section = 1x weight
// Skills demonstrated in projects/experience = 1.5x
// Skills demonstrated WITH a metric = 2x (most valuable to ATS)

function buildContextualKeywords(textLower, sectionContent, profile) {
  const allKw = [...new Set([...profile.must_have, ...profile.nice_to_have])];
  const expAndProj = `${sectionContent.experience || ''} ${sectionContent.projects || ''}`.toLowerCase();

  const in_skills_only = [];
  const demonstrated = [];
  const demonstrated_with_metrics = [];

  for (const kw of allKw) {
    const kwl = kw.toLowerCase();
    if (!textLower.includes(kwl)) continue;

    const inDemos = expAndProj.includes(kwl);
    if (!inDemos) { in_skills_only.push(kw); continue; }

    const idx = expAndProj.indexOf(kwl);
    const vicinity = expAndProj.slice(Math.max(0, idx - 120), idx + 120 + kwl.length);
    const hasMetric = /\d+\s*(%|users|ms|seconds|k|mb|requests|downloads)/.test(vicinity);

    if (hasMetric) demonstrated_with_metrics.push(kw);
    else demonstrated.push(kw);
  }

  return { in_skills_only, demonstrated, demonstrated_with_metrics };
}

// ── Bullet Improvements ───────────────────────────────────────────────────────

const WEAK_REPLACEMENTS = {
  'worked on': 'Developed',
  'helped with': 'Contributed to and improved',
  'was responsible for': 'Owned and delivered',
  'assisted in': 'Collaborated to build',
  'was part of': 'Engineered as core team member for',
  'participated in': 'Led development of',
  'involved in': 'Spearheaded',
  'responsible for': 'Owned',
};

function improveBullets(bullets, profile) {
  const improved = [];
  for (const bullet of bullets.slice(0, 10)) {
    const lower = bullet.toLowerCase();
    const hasAction = STRONG_ACTION_VERBS.some(v => lower.startsWith(v));
    const hasMetric = /\d/.test(bullet);
    const isWeak = WEAK_STARTERS.some(p => lower.startsWith(p));

    if (hasAction && hasMetric) continue; // already strong

    let text = bullet;
    for (const [weak, strong] of Object.entries(WEAK_REPLACEMENTS)) {
      if (lower.startsWith(weak)) { text = strong + text.slice(weak.length); break; }
    }
    if (!STRONG_ACTION_VERBS.some(v => text.toLowerCase().startsWith(v))) {
      text = `${profile.action_verbs[0] || 'Built'} ${text.charAt(0).toLowerCase()}${text.slice(1)}`;
    }
    if (!hasMetric) text += ', improving performance by [X%] and serving [N]+ users';

    if (text !== bullet) {
      improved.push({
        original: bullet,
        improved: text,
        why: `${!hasAction || isWeak ? 'Added strong action verb. ' : ''}${!hasMetric ? 'Added measurable impact metric.' : ''}`.trim()
      });
    }
  }
  return improved;
}

// ── Project Optimization ───────────────────────────────────────────────────────

const GENERIC_PROJECT_MAP = {
  'todo app': 'Full-Stack Task Management Platform with Real-Time Sync',
  'todo list': 'Collaborative Task Management System with Team Roles',
  'weather app': 'Real-Time Weather Intelligence Dashboard with Location Analytics',
  'calculator': 'Scientific Calculator PWA with Offline Mode & Calculation History',
  'blog': 'Developer Blog Platform with CMS, SEO & Newsletter Integration',
  'portfolio': 'Personal Portfolio with Performance Analytics & Dark Mode',
  'chat app': 'Real-Time Messaging Platform with End-to-End Encryption',
  'ecommerce': 'Full-Stack E-Commerce Platform with Payment Gateway & Inventory',
  'quiz app': 'Competitive Quiz Platform with Leaderboard & Real-Time Scoring',
  'note app': 'Smart Note-Taking App with AI Summarization & Tag System',
  'movie app': 'Film Discovery Platform with Personalized Recommendations',
};

function optimizeProjects(sectionContent, profile) {
  const content = sectionContent.projects || '';
  if (!content) return [];
  const results = [];

  for (const [generic, improved] of Object.entries(GENERIC_PROJECT_MAP)) {
    if (content.toLowerCase().includes(generic)) {
      results.push({
        original_title: generic.charAt(0).toUpperCase() + generic.slice(1),
        improved_title: improved,
        description: `${improved} built with ${profile.must_have.slice(0, 3).join(', ')}.`,
        improvements: [
          `Rename to "${improved}" — generic names are invisible to recruiters`,
          `Add: "Deployed on [Platform] serving [N] active users"`,
          `Add: "Implemented [tech: ${profile.nice_to_have.slice(0, 3).join('/')}] achieving [X%] improvement"`,
          `Add inline: GitHub link + Live Demo URL next to the project title`,
        ],
        suggested_tech_keywords: profile.nice_to_have.slice(0, 5),
      });
    }
  }

  if (!results.length && content.length > 50) {
    results.push({
      original_title: 'Detected Projects',
      improved_title: 'Apply these improvements to all projects',
      description: '',
      improvements: [
        'Add live demo links for every project — GitHub repo + deployed URL',
        'Each project needs 2–3 bullet points minimum',
        'Add user/performance metrics to every description',
        `Add missing tech keywords: ${profile.nice_to_have.slice(0, 4).join(', ')}`,
      ],
      suggested_tech_keywords: profile.nice_to_have.slice(0, 6),
    });
  }

  return results;
}

// ── Red Flag Detection ─────────────────────────────────────────────────────────

function detectRedFlags(text, sections, expLevel) {
  const lower = text.toLowerCase();
  const flags = [];

  const passiveFound = WEAK_STARTERS.filter(p => lower.includes(p));
  if (passiveFound.length > 0) {
    flags.push({
      severity: 'high',
      flag: 'Passive / weak ownership language detected',
      instances: passiveFound.map(p => `"${p}"`),
      fix: 'Replace with action verbs: "Built", "Engineered", "Deployed", "Optimized", "Led"'
    });
  }

  const numberCount = (text.match(/\d+/g) || []).length;
  if (numberCount < 5) {
    flags.push({
      severity: 'high',
      flag: 'Almost no metrics or numbers in the entire resume',
      instances: [],
      fix: 'Add specific numbers to every bullet: users served, % improvement, response time, project count'
    });
  }

  if (!/github\.com/i.test(text)) {
    flags.push({ severity: 'high', flag: 'Missing GitHub profile link', instances: [], fix: 'Add your GitHub URL in the contact header — #1 thing recruiters check for dev roles' });
  }

  const genericFound = GENERIC_OBJECTIVES.filter(g => lower.includes(g));
  if (genericFound.length) {
    flags.push({ severity: 'medium', flag: 'Generic objective statement — filtered by ATS immediately', instances: genericFound.map(g => `"${g}"`), fix: 'Replace with specific Professional Summary mentioning tech stack and a real achievement' });
  }

  const wc = text.split(/\s+/).length;
  if (wc < 200) flags.push({ severity: 'high', flag: `Resume too thin — only ~${wc} words`, instances: [], fix: 'Expand to 400–700 words: stronger Projects + Skills sections compensate for no experience' });
  if (expLevel === 'Fresher' && wc > 900) flags.push({ severity: 'medium', flag: 'Resume too long for a fresher — avg recruiter spends 6 seconds', instances: [], fix: 'Cut to 1 page (400–600 words). Remove irrelevant content, keep only high-impact items' });

  if (!sections.skills) flags.push({ severity: 'high', flag: 'No Skills section — ATS cannot parse your technical profile', instances: [], fix: 'Add a categorized Technical Skills section immediately after your Summary' });
  if (!sections.projects && !sections.experience) flags.push({ severity: 'high', flag: 'No Projects OR Experience section — resume has no evidence of your work', instances: [], fix: 'Add at least 2–3 projects with tech stack, GitHub links, and metrics' });

  const pipeCount = (text.match(/\|/g) || []).length;
  if (pipeCount > 10) flags.push({ severity: 'medium', flag: 'Table/multi-column formatting detected — many ATS systems cannot parse this', instances: [`${pipeCount} pipe characters found`], fix: 'Convert tables to plain bullet lists for maximum ATS compatibility' });

  const wordFreq = {};
  lower.split(/\s+/).forEach(w => { if (w.length > 5) wordFreq[w] = (wordFreq[w] || 0) + 1; });
  const overused = Object.entries(wordFreq).filter(([, c]) => c >= 5);
  if (overused.length) {
    flags.push({ severity: 'low', flag: 'Repetitive words reduce impact', instances: overused.slice(0, 3).map(([w, c]) => `"${w}" ×${c}`), fix: 'Use varied vocabulary — alternate between synonymous action verbs and tech terms' });
  }

  return flags;
}

// ── ATS Compatibility Checker (NEW) ───────────────────────────────────────────

function checkATSCompatibility(text, sections, profile) {
  const lower = text.toLowerCase();
  const lines = text.split('\n');
  const checks = [];

  // 1. Single-column layout (no table pipes)
  const multiColLines = lines.filter(l => (l.match(/\|/g) || []).length >= 3);
  checks.push({ id: 'single_column', label: 'Single-column layout (no tables)', pass: multiColLines.length < 3, detail: multiColLines.length >= 3 ? `${multiColLines.length} table-like rows detected — ATS often scrambles multi-column resumes` : 'Clean single-column format — ATS-safe' });

  // 2. Standard section headings
  const sectionCount = Object.keys(sections).length;
  checks.push({ id: 'sections', label: 'Standard section headings (3+ detected)', pass: sectionCount >= 3, detail: sectionCount >= 3 ? `${sectionCount} standard sections found (Summary, Skills, Projects, Education…)` : `Only ${sectionCount} sections found — ATS may not parse structure correctly` });

  // 3. Bullet points present
  const bulletCount = extractBullets(text).length;
  checks.push({ id: 'bullets', label: 'Bullet points in content sections', pass: bulletCount >= 2, detail: bulletCount >= 2 ? `${bulletCount} bullet points detected — structured content ATS-friendly` : 'No bullet points detected — long paragraphs are harder for ATS to parse' });

  // 4. Contact info in body (not buried in header/footer)
  const hasEmail = /[\w.+-]+@[\w.]+\.[a-z]{2,}/i.test(text);
  const hasPhone = /[\+\d][\d\s\-()]{9,}/.test(text);
  checks.push({ id: 'contact', label: 'Email and phone in resume body', pass: hasEmail && hasPhone, detail: hasEmail && hasPhone ? 'Email and phone found — contact accessible to ATS parsers' : `Missing: ${!hasEmail ? 'email ' : ''}${!hasPhone ? 'phone' : ''}— add to the contact header` });

  // 5. Action verbs in content
  const verbCount = STRONG_ACTION_VERBS.filter(v => lower.includes(v)).length;
  checks.push({ id: 'action_verbs', label: 'Action verbs present (5+ required)', pass: verbCount >= 5, detail: verbCount >= 5 ? `${verbCount} strong action verbs found — strong content signal` : `Only ${verbCount} action verbs — add more: Built, Deployed, Optimized, Engineered` });

  // 6. Quantified achievements
  const nums = (text.match(/\d+/g) || []).length;
  const hasPct = /%/.test(text);
  checks.push({ id: 'metrics', label: 'Quantified achievements (numbers + %)', pass: nums >= 5 && hasPct, detail: nums < 5 ? `Only ${nums} numbers — add metrics to every bullet point` : !hasPct ? 'No % metrics — add improvement percentages to bullets' : `${nums} numerical data points — good metrics density` });

  // 7. Optimal word count
  const wc = text.split(/\s+/).length;
  checks.push({ id: 'length', label: 'Optimal length (250–900 words)', pass: wc >= 250 && wc <= 900, detail: wc < 250 ? `Only ${wc} words — too thin, expand Projects and Skills` : wc > 900 ? `${wc} words — too long, trim to 1 page` : `${wc} words — optimal for ATS scanning` });

  // 8. GitHub + LinkedIn links
  const hasGH = /github\.com\//i.test(text);
  const hasLI = /linkedin\.com\//i.test(text);
  checks.push({ id: 'links', label: 'GitHub and LinkedIn URLs present', pass: hasGH && hasLI, detail: hasGH && hasLI ? 'Both GitHub and LinkedIn found — great for recruiter verification' : `Missing: ${!hasGH ? 'GitHub ' : ''}${!hasLI ? 'LinkedIn' : ''}` });

  // 9. No emojis in resume body (emojis break many ATS parsers)
  const emojiCount = (text.match(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{27BF}]/gu) || []).length;
  checks.push({ id: 'no_emojis', label: 'No emojis or ATS-breaking symbols', pass: emojiCount === 0, detail: emojiCount === 0 ? 'No emojis in resume — ATS-safe text format' : `${emojiCount} emojis detected — remove all emojis from resume content` });

  // 10. Core skills coverage
  const mustFound = profile.must_have.filter(k => lower.includes(k.toLowerCase())).length;
  const needed = Math.ceil(profile.must_have.length * 0.55);
  checks.push({ id: 'skill_coverage', label: `55%+ core skills for target role`, pass: mustFound >= needed, detail: mustFound >= needed ? `${mustFound}/${profile.must_have.length} core skills found — good ATS keyword coverage` : `Only ${mustFound}/${profile.must_have.length} core skills — add missing tech to Skills section` });

  const passCount = checks.filter(c => c.pass).length;
  return {
    score: passCount,
    max: checks.length,
    grade: passCount >= 9 ? 'A+' : passCount >= 8 ? 'A' : passCount >= 6 ? 'B' : passCount >= 4 ? 'C' : 'F',
    grade_label: passCount >= 9 ? 'Excellent' : passCount >= 8 ? 'Good' : passCount >= 6 ? 'Average' : passCount >= 4 ? 'Below Average' : 'Poor',
    checks,
  };
}

// ── Readability & Grammar Analysis (NEW) ──────────────────────────────────────

function analyzeReadability(text, sectionContent) {
  const lower = text.toLowerCase();

  const passiveInstances = WEAK_STARTERS.filter(p => lower.includes(p));

  const sentences = text.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 10);
  const longSentences = sentences.filter(s => s.trim().split(/\s+/).length > 35);
  const avgLen = sentences.length ? Math.round(sentences.reduce((sum, s) => sum + s.split(/\s+/).length, 0) / sentences.length) : 0;

  const summaryText = sectionContent.summary || '';
  const summaryChars = summaryText.replace(/\s+/g, ' ').trim().length;

  // PII detection
  const pii = [];
  if (/\b(date\s*of\s*birth|dob|born\s*on|birth\s*date|age\s*:\s*\d+|\d+\s*years?\s*old)\b/i.test(text)) pii.push('Date of birth / age — remove for unbiased screening');
  if (/\b(marital\s*status|married|single|unmarried|divorced)\b/i.test(text)) pii.push('Marital status — not required in modern tech resumes');
  if (/\b(nationality|religion|caste|gender\s*:\s*(male|female))\b/i.test(text)) pii.push('Personal identity info (religion/caste/gender) — consider removing');
  if (/\b(father'?s?\s*name|mother'?s?\s*name)\b/i.test(text)) pii.push("Parent's name is irrelevant — remove from professional resume");
  if (/\b(photo|passport\s*size|photograph|hobbies)\b/i.test(text)) pii.push('Photo/hobbies reference — most tech companies do not require these');

  // Grammar flags
  const grammar = [];
  if (/\betc\.?\b/i.test(text)) grammar.push('"etc." detected — be specific, never trail off with etc.');
  if (/\band\s+so\s+on\b/i.test(text)) grammar.push('"and so on" — replace with specific items');
  if (/(^|\s)I\s/gm.test(text)) grammar.push('First-person "I" used — resumes use implied first-person (omit "I")');
  if (/\b(various|several|many\s*tech|multiple\s*tech|different\s*tool)\b/i.test(text)) grammar.push('Vague quantifiers ("various", "several") — replace with exact numbers');
  if (/\b(hardworking|passionate\s*about|team\s*player|quick\s*learner|detail.oriented)\b/i.test(text)) grammar.push('Cliché words ("hardworking", "passionate", "team player") — show, don\'t tell');
  if (/\b(strong|good|excellent|great)\s+(knowledge|understanding|skills?)\b/i.test(text)) grammar.push('"Strong knowledge of X" is vague — replace with proof: "Built X using Y, achieving Z"');

  const grade = passiveInstances.length <= 1 && longSentences.length === 0 && grammar.length <= 1 ? 'A'
              : passiveInstances.length <= 2 && longSentences.length <= 1 ? 'B'
              : passiveInstances.length <= 4 ? 'C' : 'D';

  return {
    grade,
    passive_count: passiveInstances.length,
    passive_instances: passiveInstances.slice(0, 3).map(p => `"${p}"`),
    long_sentence_count: longSentences.length,
    avg_sentence_length: avgLen,
    summary_char_count: summaryChars,
    summary_status: summaryChars < 150 ? 'too_short' : summaryChars <= 420 ? 'optimal' : 'too_long',
    pii_flags: pii,
    grammar_flags: grammar,
  };
}

// ── 6-Second Recruiter Test (NEW) ─────────────────────────────────────────────

function generateSixSecondTest(text, sections, sectionContent, score, profile, role) {
  const obs = [];

  const hasEmail = /[\w.+-]+@[\w.]+\.[a-z]{2,}/i.test(text);
  const hasPhone = /[\+\d][\d\s\-()]{9,}/.test(text);
  obs.push({ item: 'Name & Contact Info at Top', pass: hasEmail && hasPhone, detail: hasEmail && hasPhone ? 'Email + phone visible — recruiter can reach you' : `Missing: ${!hasEmail ? 'email' : ''} ${!hasPhone ? 'phone' : ''}` });

  obs.push({ item: 'Professional Headline / Summary', pass: !!sections.summary, detail: sections.summary ? 'Summary present — recruiter immediately understands your target role' : 'No headline — recruiter doesn\'t know your role in 6 seconds. Critical miss.' });

  const mustFound = profile.must_have.filter(k => text.toLowerCase().includes(k.toLowerCase()));
  obs.push({ item: 'Core Tech Keywords Visible', pass: mustFound.length >= Math.ceil(profile.must_have.length * 0.6), detail: mustFound.length >= Math.ceil(profile.must_have.length * 0.6) ? `${mustFound.length} key skills visible (${mustFound.slice(0, 3).join(', ')}…)` : `Only ${mustFound.length}/${profile.must_have.length} core skills visible` });

  const projContent = sectionContent.projects || '';
  const hasGenericProj = ['todo', 'calculator', 'weather'].some(g => projContent.toLowerCase().includes(g));
  obs.push({ item: 'Memorable Project Titles', pass: !!sections.projects && !hasGenericProj, detail: !sections.projects ? 'No Projects section — major gap for tech candidates' : hasGenericProj ? 'Generic project names (Todo, Calculator) won\'t stand out' : 'Strong project titles — recruiter takes notice' });

  const nums = (text.match(/\d+/g) || []).length;
  obs.push({ item: 'Numbers / Metrics Visible', pass: nums >= 6, detail: nums >= 6 ? `${nums} data points — metrics signal competence immediately` : `Only ${nums} numbers — add user counts, % improvements, times` });

  const passCount = obs.filter(o => o.pass).length;
  const impression = passCount >= 4 ? 'strong' : passCount >= 3 ? 'average' : 'weak';

  return {
    observations: obs,
    pass_count: passCount,
    first_impression: impression,
    message: impression === 'strong' ? 'Strong 6-second scan — resume passes the initial filter'
           : impression === 'average' ? 'Average first impression — needs stronger headline and visible metrics'
           : 'Weak first impression — recruiter will likely pass. Fix summary, metrics, and project titles.',
    headline_suggestions: [
      `${role} | ${profile.must_have.slice(0, 3).join(' · ')} | [X] Production Projects | Open to Opportunities`,
      `Full-Stack Engineer → ${role} | ${profile.must_have.slice(0, 2).join(' & ')} | [X]+ Deployments | [City / Remote]`,
      `${role} Developer | Building Scalable Apps with ${profile.must_have[0]} & ${profile.must_have[1]} | Graduate [Year]`,
    ],
  };
}

// ── Interview Question Predictor (NEW) ────────────────────────────────────────

const INTERVIEW_QS = {
  'mern stack': {
    technical: [
      { q: 'Explain the complete flow of user login in a MERN app (frontend → API → DB → response).', prep: 'JWT, bcrypt, localStorage/cookie storage, token refresh strategy' },
      { q: 'How do you prevent unnecessary re-renders in React?', prep: 'useMemo, useCallback, React.memo, component splitting, key prop' },
      { q: 'How does MongoDB indexing work and when would you use compound indexes?', prep: 'B-tree indexes, explain() query plan, index selectivity' },
      { q: 'Explain REST API principles — what makes an API truly RESTful?', prep: 'Stateless, uniform interface, HTTP methods, status codes, HATEOAS' },
    ],
    behavioral: [
      { q: 'Walk me through your most complex project. Why those tech choices?', prep: 'STAR format, emphasize trade-offs and scale considerations' },
      { q: 'Describe a bug that took you 2+ hours to debug.', prep: 'Debugging methodology: logs, breakpoints, isolating variables, hypothesis-test loop' },
    ],
    role_fit: [
      { q: 'Why MERN stack over Django+React or Spring Boot + React?', prep: 'JavaScript across stack, npm ecosystem, JSON-native, faster iteration' },
      { q: 'Where are the biggest performance bottlenecks in a MERN app?', prep: 'N+1 queries, unoptimized React renders, missing DB indexes, no caching' },
    ],
  },
  'frontend developer': {
    technical: [
      { q: 'Explain the browser\'s critical rendering path from HTML to pixels.', prep: 'DOM → CSSOM → Render Tree → Layout → Paint → Composite' },
      { q: 'What are Core Web Vitals and how do you optimize LCP and CLS?', prep: 'LCP < 2.5s: lazy load, preload. CLS: fixed dimensions, font-display: swap' },
      { q: 'CSS Grid vs Flexbox — when do you use each?', prep: 'Grid = 2D layout. Flexbox = 1D distribution. Combine: Grid for page, Flex for components' },
      { q: 'How do you implement dark mode without flash-of-wrong-theme?', prep: 'CSS custom properties + prefers-color-scheme + localStorage + blocking script' },
    ],
    behavioral: [
      { q: 'Walk me through the hardest UI component you\'ve built.', prep: 'Focus on: state design, accessibility, animation, edge cases, performance' },
      { q: 'How would you make an existing app accessible (WCAG 2.1 AA)?', prep: 'Semantic HTML, ARIA labels, keyboard nav, focus management, color contrast 4.5:1' },
    ],
    role_fit: [
      { q: 'How do you profile and optimize a slow React component?', prep: 'React DevTools Profiler → memoize → virtualize → code split → lazy load' },
      { q: 'CSS-in-JS vs utility-first (Tailwind) vs CSS Modules — opinion?', prep: 'Show nuanced view: scoping, DX, bundle size, SSR hydration trade-offs' },
    ],
  },
  'sde': {
    technical: [
      { q: 'Design a URL shortener (system design round).', prep: 'Hashing strategy (base62), DB schema (SQL), cache layer (Redis), analytics, CDN, scale' },
      { q: 'HashMap time complexity — when does O(1) degrade to O(n)?', prep: 'Hash collision → chaining → worst case O(n). Java HashMap: load factor 0.75, rehash' },
      { q: 'Explain the difference between a process and a thread with OS context.', prep: 'Memory sharing, context switching cost, deadlocks, race conditions, semaphores' },
      { q: 'How would you optimize a slow SQL query step by step?', prep: 'EXPLAIN ANALYZE → check index usage → N+1 → covering index → query rewrite → pagination' },
    ],
    behavioral: [
      { q: 'Describe a time you had to learn a new technology in under a week.', prep: 'Show learning approach: official docs → build toy project → reference real code → iterate' },
      { q: 'Walk me through how you debug a problem you\'ve never encountered.', prep: 'Reproduce first → isolate → binary search → logs → smallest failing case → hypothesis-test' },
    ],
    role_fit: [
      { q: 'Horizontal vs vertical scaling — when to use each?', prep: 'Vertical = bigger machine (simpler, limited). Horizontal = more machines (stateless, LB needed)' },
      { q: 'What does clean code mean to you, practically?', prep: 'Readable names, small functions, single responsibility, minimal comments (code is doc), tested' },
    ],
  },
  'data analyst': {
    technical: [
      { q: 'Write a SQL query: top 3 customers by revenue per month using window functions.', prep: 'RANK() OVER (PARTITION BY month_year ORDER BY revenue DESC)' },
      { q: 'How do you handle missing data — what factors drive your decision?', prep: 'Imputation (mean/median/mode/model), drop (MCAR), flag separately (MNAR)' },
      { q: 'Explain A/B testing from hypothesis to statistical conclusion.', prep: 'Null hypothesis → sample size (power analysis) → p-value → confidence interval → effect size' },
      { q: 'Mean vs median vs mode — when does median give better insight?', prep: 'Skewed distributions (income, house prices): median more robust to outliers' },
    ],
    behavioral: [
      { q: 'Tell me about an analysis you did that changed a business decision.', prep: 'Focus on business impact: what changed, what was the outcome, how did you measure it' },
      { q: 'How do you validate your analysis is correct before presenting?', prep: 'Sanity checks, peer review, cross-validate with known benchmarks, source verification' },
    ],
    role_fit: [
      { q: 'Tableau vs Power BI vs Looker — trade-offs?', prep: 'Tableau: powerful viz. Power BI: Microsoft ecosystem. Looker: LookML semantic layer. Context matters' },
      { q: 'How would you build a daily reporting pipeline from scratch?', prep: 'Data source → ETL (dbt/Airflow) → warehouse (Snowflake/BQ) → visualization → alerting' },
    ],
  },
  'data scientist': {
    technical: [
      { q: 'Explain bias-variance trade-off with a concrete example.', prep: 'High bias = underfitting (linear on non-linear data). High variance = overfitting. Regularization balances' },
      { q: 'How do you handle class imbalance in a classification problem?', prep: 'SMOTE, class_weight, undersampling, threshold tuning, use F1/PR-AUC not accuracy' },
      { q: 'L1 vs L2 regularization — when to prefer Lasso?', prep: 'L1 (Lasso) → sparse weights → feature selection. L2 (Ridge) → small weights. ElasticNet = both' },
      { q: 'Walk me through deploying an ML model to production.', prep: 'Train → validate → FastAPI wrapper → Docker → CI/CD → monitoring → retraining trigger' },
    ],
    behavioral: [
      { q: 'Tell me about a model that failed. What did you learn?', prep: 'Show: data quality debugging, feature engineering iteration, humility, systematic improvement' },
      { q: 'How do you explain model uncertainty to non-technical stakeholders?', prep: 'Confidence intervals, what-if scenarios, simple charts, avoid jargon, business impact framing' },
    ],
    role_fit: [
      { q: 'When would you use logistic regression over a neural network?', prep: 'Interpretability needed, small data, compute constraints, feature importance required' },
      { q: 'How do you stay current with ML research?', prep: 'arXiv (Papers With Code), Hugging Face blog, Kaggle forums, Twitter/X ML community, fast.ai' },
    ],
  },
  'devops': {
    technical: [
      { q: 'Docker vs Kubernetes — what does K8s solve that Docker Compose doesn\'t?', prep: 'K8s: auto-scaling, self-healing, service discovery, rolling updates, multi-node orchestration' },
      { q: 'Walk me through your ideal CI/CD pipeline from code push to production.', prep: 'Push → lint/test → build image → scan → push registry → deploy (blue-green/canary) → monitor' },
      { q: 'Troubleshoot a pod in CrashLoopBackOff — step by step.', prep: 'kubectl logs → describe → events → exec into init container → check resource limits/env vars' },
      { q: 'Blue-green vs canary deployment — trade-offs?', prep: 'Blue-green: instant rollback, 2x infra cost. Canary: gradual rollout, real traffic test, slower rollback' },
    ],
    behavioral: [
      { q: 'Describe a production incident you responded to.', prep: 'Incident response: detect → alert → triage → fix → communicate → post-mortem → prevent recurrence' },
      { q: 'How do you ensure security in your CI/CD pipeline?', prep: 'Secrets manager (Vault), SAST/DAST scans, least privilege service accounts, signed commits, image scanning' },
    ],
    role_fit: [
      { q: 'Terraform vs Ansible — different tools for different jobs?', prep: 'Terraform: infrastructure provisioning (IaC). Ansible: config management, app deployment. Often used together' },
      { q: 'How would you reduce cloud costs by 30% for a production system?', prep: 'Right-sizing → reserved/spot instances → auto-scaling → unused resource audit → S3 lifecycle policies' },
    ],
  },
  'backend developer': {
    technical: [
      { q: 'Design a rate limiting middleware — which algorithm and why?', prep: 'Token bucket (burst-friendly) vs sliding window (accurate) vs fixed window (simple). Redis for distributed' },
      { q: 'ACID transactions — explain each property with a real example.', prep: 'Atomicity (bank transfer), Consistency (constraints), Isolation (concurrent reads), Durability (crash recovery)' },
      { q: 'The N+1 query problem — how do you detect and fix it?', prep: 'ORM lazy loading → 1 query + N queries per item. Fix: eager loading, DataLoader, JOIN, includes()' },
      { q: 'How do you design a secure JWT authentication system?', prep: 'Short-lived access token + long-lived refresh token + rotation + revocation list + HTTPS only + httpOnly cookie' },
    ],
    behavioral: [
      { q: 'Tell me about a time your API had performance issues. How did you fix it?', prep: 'Profile first (APM) → identify bottleneck → apply targeted fix → measure improvement → document' },
      { q: 'How do you approach testing for a backend API?', prep: 'Unit (pure logic) → integration (real DB) → e2e (full flow). Avoid excessive mocking at integration level' },
    ],
    role_fit: [
      { q: 'PostgreSQL vs MongoDB — when would you choose relational?', prep: 'Complex queries, ACID requirements, structured data, reporting. MongoDB: flexible schema, horizontal scale' },
      { q: 'What monitoring would you set up for a production API from day one?', prep: 'Prometheus metrics (latency, error rate, throughput) → Grafana → alerts → distributed tracing (Jaeger)' },
    ],
  },
  'react developer': {
    technical: [
      { q: 'When does React trigger a re-render — all causes?', prep: 'State change, prop change, parent re-render (unless memo), context value change, forceUpdate' },
      { q: 'useEffect vs useLayoutEffect — real scenario where it matters?', prep: 'useLayoutEffect: DOM measurements (scrollWidth, getBoundingClientRect) before paint to avoid flicker' },
      { q: 'Controlled vs uncontrolled components — which for a complex form?', prep: 'Controlled: React state, predictable, validation easy. Uncontrolled: ref-based, simpler for simple forms' },
      { q: 'Global state: Context vs Redux vs Zustand — decision framework?', prep: 'Context: simple/infrequent. Redux: complex with DevTools + middleware. Zustand: simpler Redux alternative' },
    ],
    behavioral: [
      { q: 'Walk me through the most complex component you\'ve built.', prep: 'Focus: prop API design, state strategy, performance, accessibility, edge cases' },
      { q: 'How do you ensure a React app is accessible?', prep: 'Semantic HTML first, ARIA only when needed, keyboard nav, focus management, axe/lighthouse audit' },
    ],
    role_fit: [
      { q: 'React 19 — what new features are you most excited about?', prep: 'Actions, optimistic updates, use() hook, enhanced server components, compiler (React Forget)' },
      { q: 'How do you approach performance optimization in a slow React app?', prep: 'Measure first (Profiler) → memoize expensive renders → virtualize long lists → code split → lazy load' },
    ],
  },
};

function generateInterviewPredictions(sectionContent, profile, role) {
  const key = normalizeRole(role);
  const qs = INTERVIEW_QS[key] || INTERVIEW_QS['sde'];
  return {
    technical: qs.technical.slice(0, 4),
    behavioral: qs.behavioral.slice(0, 2),
    role_fit: qs.role_fit.slice(0, 2),
    tip: 'Prepare STAR answers (Situation · Task · Action · Result) with specific numbers for every behavioral question.',
  };
}

// ── Resume Headline Generator (NEW) ──────────────────────────────────────────

function generateHeadlines(profile, role, expLevel) {
  const tech = profile.must_have.slice(0, 3).join(' · ');
  const niceTech = profile.nice_to_have.slice(0, 2).join(' & ');
  const grad = expLevel === 'Fresher' ? 'Graduate 2024/25' : 'Available Immediately';

  return [
    `${role} | ${tech} | [X] Production Projects | ${expLevel}`,
    `Building Scalable ${role.split(' ')[0]} Solutions with ${profile.must_have[0]} & ${profile.must_have[1]} | Seeking ${role} Role`,
    `${role} — ${tech} | ${niceTech} | ${grad}`,
  ];
}

// ── Optimized Resume Generator ─────────────────────────────────────────────────

function generateOptimizedResume(text, sections, sectionContent, profile, role, expLevel) {
  const lines = text.split('\n').filter(l => l.trim());
  const name = lines[0]?.trim() || 'YOUR NAME';
  const emailMatch = text.match(/[\w.+-]+@[\w.]+\.[a-z]{2,}/i);
  const phoneMatch = text.match(/[\+\d][\d\s\-()]{9,}/);
  const ghMatch = text.match(/github\.com\/[\w\-]+/i);
  const liMatch = text.match(/linkedin\.com\/in\/[\w\-]+/i);

  const email = emailMatch?.[0] || 'email@example.com';
  const phone = phoneMatch?.[0]?.trim() || '+91-XXXXXXXXXX';
  const github = ghMatch ? `https://${ghMatch[0]}` : 'https://github.com/yourhandle';
  const linkedin = liMatch ? `https://${liMatch[0]}` : 'https://linkedin.com/in/yourname';

  const techSkills = [
    `Languages: ${profile.must_have.slice(0, 4).join(', ')}`,
    `Frameworks: ${profile.must_have.slice(4, 7).join(', ')}, ${profile.nice_to_have.slice(0, 2).join(', ')}`,
    `Databases & Tools: ${profile.nice_to_have.slice(2, 6).join(', ')}, Git, Docker`,
    `Cloud & DevOps: GitHub Actions, Vercel, AWS (basics)`,
  ].join('\n  ');

  const projContent = sectionContent.projects?.trim() || '• [Project Name] — [Description with tech stack and metrics]\n  GitHub: [link] | Live: [link]';
  const expContent = sectionContent.experience?.trim() || '';
  const eduContent = sectionContent.education?.trim() || 'B.Tech/BCA | [University Name] | [City] | [Year] | CGPA: X.X/10';
  const certContent = sectionContent.certifications?.trim() || '';

  const out = [
    name.toUpperCase(),
    `${email}  |  ${phone}  |  ${github}  |  ${linkedin}`,
    '',
    '─── PROFESSIONAL SUMMARY ─────────────────────────────────────────────',
    `Results-driven ${role} developer with hands-on experience building scalable`,
    `applications using ${profile.must_have.slice(0, 3).join(', ')}. Delivered [N] production`,
    `projects serving [X]+ users. Seeking a ${role} role to drive measurable engineering impact.`,
    '',
    '─── TECHNICAL SKILLS ─────────────────────────────────────────────────',
    `  ${techSkills}`,
    '',
    '─── PROJECTS ─────────────────────────────────────────────────────────',
    projContent,
    '',
  ];

  if (expContent) {
    out.push('─── EXPERIENCE ───────────────────────────────────────────────────────', expContent, '');
  }

  out.push('─── EDUCATION ────────────────────────────────────────────────────────', eduContent, '');

  if (certContent) {
    out.push('─── CERTIFICATIONS ───────────────────────────────────────────────────', certContent, '');
  }

  return out.join('\n');
}

// ── Improvement Plan ──────────────────────────────────────────────────────────

function generateImprovementPlan(score, sectionAnalysis, kwAnalysis, redFlags) {
  const priority_fixes = [];
  const quick_wins = [];

  for (const flag of redFlags.filter(f => f.severity === 'high').slice(0, 4)) {
    const boost = flag.flag.includes('metric') ? '+8–12 pts' : flag.flag.includes('GitHub') ? '+4 pts' : flag.flag.includes('Passive') ? '+5 pts' : '+3–6 pts';
    priority_fixes.push({ fix: flag.fix, impact: boost, effort: '15–30 min' });
  }

  if (kwAnalysis.missing.length > 3) {
    priority_fixes.push({ fix: `Add missing must-have keywords to Skills/Projects: ${kwAnalysis.missing.slice(0, 4).join(', ')}`, impact: '+6–9 pts', effort: '20 min' });
  }

  for (const [sec, analysis] of Object.entries(sectionAnalysis)) {
    if (analysis.health === 'missing' && ['projects', 'skills', 'summary'].includes(sec)) {
      priority_fixes.push({ fix: `Add ${sec.charAt(0).toUpperCase() + sec.slice(1)} section — currently missing`, impact: '+5–8 pts', effort: '1–2 hrs' });
    }
  }

  if (!sectionAnalysis.links?.present || sectionAnalysis.links?.health !== 'strong') quick_wins.push('Add GitHub + LinkedIn URLs to header (+3 pts, 5 min)');
  if (kwAnalysis.overused_weak_phrases.length) quick_wins.push(`Replace "${kwAnalysis.overused_weak_phrases[0]}" with action verbs (+2 pts, 10 min)`);
  if (['weak', 'average'].includes(sectionAnalysis.skills?.health)) quick_wins.push('Categorize skills: Languages | Frameworks | Tools | Cloud (+2 pts, 10 min)');
  quick_wins.push(`Add ${kwAnalysis.missing.slice(0, 3).join(', ')} to Skills section if you know them (+4 pts, 5 min)`);
  quick_wins.push('Spell-check and use consistent date formats (Month YYYY) across all sections');

  const boost = Math.min(35, priority_fixes.length * 7 + quick_wins.length * 2);
  return {
    priority_fixes: priority_fixes.slice(0, 5),
    quick_wins: quick_wins.slice(0, 5),
    estimated_score_after_fix: Math.min(97, score + boost),
  };
}

// ── Main Entry Point ───────────────────────────────────────────────────────────

function analyzeResume(resumeText, targetRole, experienceLevel, jobDescription) {
  if (!resumeText || resumeText.trim().length < 50) {
    return { error: 'Invalid or empty resume. Please upload a valid resume.' };
  }

  const text = resumeText;
  const textLower = text.toLowerCase();
  const profile = getRoleProfile(targetRole);
  const jd = jobDescription || '';

  const { sections, sectionContent } = detectSections(text);
  const bullets = extractBullets(text);

  const kwResult = scoreKeywordMatch(textLower, profile, jd);
  const fmtScore = scoreFormatting(text, sections);
  const cqScore = scoreContentQuality(text);
  const imScore = scoreImpactMetrics(text);
  const srScore = scoreSkillsRelevance(textLower, profile);
  const totalScore = Math.min(100, Math.round(kwResult.score + fmtScore + cqScore + imScore + srScore));

  const score_breakdown = {
    keyword_match:    { score: Math.round(kwResult.score), max: 30, label: 'Keyword Match' },
    formatting:       { score: Math.round(fmtScore),       max: 15, label: 'Formatting & Structure' },
    content_quality:  { score: Math.round(cqScore),        max: 20, label: 'Content Quality' },
    impact_metrics:   { score: Math.round(imScore),        max: 20, label: 'Impact & Metrics' },
    skills_relevance: { score: Math.round(srScore),        max: 15, label: 'Skills Relevance' },
  };

  const section_analysis = {
    summary:        analyzeSummary(sections, sectionContent),
    skills:         analyzeSkills(sections, sectionContent, profile),
    projects:       analyzeProjects(sections, sectionContent, profile),
    experience:     { present: !!sections.experience, health: sections.experience ? 'average' : 'missing', issues: sections.experience ? [] : ['No Experience/Internship section'], improvements: ['Add internships, freelance, or open-source contributions as experience'] },
    education:      analyzeEducation(sections, sectionContent),
    certifications: analyzeCertifications(sections, sectionContent),
    links:          analyzeLinks(text),
  };

  const keyword_analysis = buildKeywordAnalysis(text, profile, jd, kwResult);
  const contextual_keywords = buildContextualKeywords(textLower, sectionContent, profile);
  const bullet_improvements = improveBullets(bullets, profile);
  const project_optimization = optimizeProjects(sectionContent, profile);
  const red_flags = detectRedFlags(text, sections, experienceLevel);
  const ats_compatibility = checkATSCompatibility(text, sections, profile);
  const readability = analyzeReadability(text, sectionContent);
  const six_second_test = generateSixSecondTest(text, sections, sectionContent, totalScore, profile, targetRole);
  const optimized_resume = generateOptimizedResume(text, sections, sectionContent, profile, targetRole, experienceLevel);
  const improvement_plan = generateImprovementPlan(totalScore, section_analysis, keyword_analysis, red_flags);

  return {
    ats_score: totalScore,
    score_label: totalScore >= 85 ? 'Excellent' : totalScore >= 70 ? 'Good' : totalScore >= 55 ? 'Average' : 'Needs Work',
    score_breakdown,
    word_count: text.split(/\s+/).length,
    target_role: targetRole,
    experience_level: experienceLevel,
    section_analysis,
    keyword_analysis,
    contextual_keywords,
    bullet_improvements,
    project_optimization,
    red_flags,
    ats_compatibility,
    readability,
    six_second_test,
    optimized_resume,
    improvement_plan,
    bonus: {
      suggested_projects: profile.project_suggestions,
      trending_skills_2025: profile.trending_2025,
      github_tips: profile.github_tips,
      portfolio_tips: profile.portfolio_tips,
      interview_predictions: generateInterviewPredictions(sectionContent, profile, targetRole),
      headline_suggestions: generateHeadlines(profile, targetRole, experienceLevel),
    },
  };
}

module.exports = { analyzeResume };
