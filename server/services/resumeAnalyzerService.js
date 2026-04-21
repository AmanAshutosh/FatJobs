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
      { title: 'SaaS Task Manager with Collaboration', tech: 'Next.js · Express · MongoDB · Drag-and-Drop · Role-based Auth', why: 'Complex state + UX thinking + auth — differentiates from basic CRUD apps' },
    ],
    trending_2025: ['Next.js 14 (App Router)', 'Prisma ORM', 'tRPC', 'Bun.js', 'Turborepo', 'shadcn/ui', 'Supabase', 'Vercel AI SDK', 'Zod', 'WebSockets (native)'],
    github_tips: [
      'Pin 3–4 MERN projects with live demo links in each README',
      'Add a profile README.md with animated tech-stack badges',
      'Set up GitHub Actions CI/CD pipeline in at least 1 project',
      'Each repo: Screenshots · Live Demo URL · Tech Stack section · Setup guide',
      'Contribute to open-source React/Node.js repos to build credibility',
    ],
    portfolio_tips: [
      'Deploy every project on Vercel/Railway with a live URL',
      'Build a personal site showcasing projects with before/after screenshots',
      'Include GitHub stats widget and contribution graph on portfolio',
      'Add a "Tech Stack" section with technology icons (use devicon.dev)',
      'Record a 60-second Loom video demo for your best project',
    ]
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
    github_tips: [
      'Your portfolio site must have a live deployed URL — no exceptions',
      'Show component-level thinking: small, composable, well-typed components',
      'Add Lighthouse Performance scores in project READMEs (aim 90+)',
      'Screenshot your UI in the README — visual proof matters for frontend',
      'Include bundle size stats if you optimized (e.g., "Reduced bundle by 40%")',
    ],
    portfolio_tips: [
      'Include a "Before / After" performance section showing your optimizations',
      'Show cross-browser screenshots (Chrome, Firefox, Safari, mobile)',
      'Add accessibility score (WCAG compliance) to differentiate from peers',
      'Show Figma design → implementation side-by-side for at least one project',
      'Link to a CodeSandbox or StackBlitz for interactive demos',
    ]
  },
  'backend developer': {
    must_have: ['Node.js', 'REST API', 'SQL', 'Git', 'Database', 'Authentication', 'Express', 'PostgreSQL'],
    nice_to_have: ['Python', 'Docker', 'Redis', 'MongoDB', 'GraphQL', 'Microservices', 'Kafka', 'AWS', 'JWT', 'Testing', 'gRPC', 'TypeScript'],
    action_verbs: ['Built', 'Designed', 'Engineered', 'Optimized', 'Deployed', 'Scaled', 'Architected', 'Implemented', 'Reduced', 'Automated'],
    project_suggestions: [
      { title: 'RESTful API with Rate Limiting & Caching', tech: 'Node.js · Express · Redis · PostgreSQL · Docker · Swagger', why: 'Core backend skills in one project — clean signal for any backend role' },
      { title: 'Auth Service with OAuth2 & JWT Refresh Tokens', tech: 'Node.js · Express · PostgreSQL · OAuth2 · JWT · bcrypt', why: 'Security-aware auth is a must-have — shows maturity' },
      { title: 'Event-Driven Microservice with Message Queue', tech: 'Node.js · RabbitMQ/Kafka · Docker Compose · PostgreSQL', why: 'Enterprise-level architecture awareness — separates you from CRUD devs' },
    ],
    trending_2025: ['Bun.js', 'Hono.js', 'tRPC', 'Prisma ORM', 'Drizzle ORM', 'Kafka', 'OpenTelemetry', 'gRPC', 'ClickHouse', 'Temporal.io (workflows)'],
    github_tips: [
      'Include Swagger/OpenAPI documentation in repos — shows professionalism',
      'Add Docker Compose for one-command local setup — recruiters will test it',
      'Write integration tests hitting a real test database, not mocks',
      'Show database schema design in README with ER diagram image',
      'Include load test results (k6/Artillery) if you optimized performance',
    ],
    portfolio_tips: [
      'Deploy APIs publicly (Railway/Render) with Swagger UI accessible',
      'Show architecture diagrams using draw.io or Excalidraw in README',
      'Include a postman collection or bruno collection for testing your API',
      'Demonstrate handling of edge cases: rate limiting, error handling, logging',
      'Show monitoring setup (Prometheus/Grafana) for at least one project',
    ]
  },
  'sde': {
    must_have: ['Data Structures', 'Algorithms', 'Git', 'OOP', 'REST API', 'Problem Solving', 'JavaScript', 'Python'],
    nice_to_have: ['System Design', 'SQL', 'Dynamic Programming', 'Trees', 'Graphs', 'LeetCode', 'Java', 'C++', 'Docker', 'Cloud'],
    action_verbs: ['Solved', 'Implemented', 'Designed', 'Optimized', 'Built', 'Engineered', 'Reduced', 'Improved', 'Developed', 'Architected'],
    project_suggestions: [
      { title: 'URL Shortener with Click Analytics', tech: 'Node.js · Redis · PostgreSQL · React · Docker', why: 'Covers hashing, caching, DB design — classic SDE interview discussion topic' },
      { title: 'Distributed Rate Limiter Library', tech: 'Node.js/Python · Redis · Docker · Jest/Pytest', why: 'Shows system design awareness — publishable as open-source package' },
      { title: 'Code Execution Sandbox (Mini LeetCode)', tech: 'React · Node.js · Docker Sandbox · WebSocket · Queue', why: 'Complex distributed architecture — highest credibility signal for SDE roles' },
    ],
    trending_2025: ['System Design', 'Distributed Systems', 'Go', 'Rust (basics)', 'Cloud (AWS/GCP)', 'Kubernetes basics', 'ClickHouse', 'Kafka', 'gRPC', 'OpenTelemetry'],
    github_tips: [
      'Pin competitive programming repo: link LeetCode/Codeforces profile in bio',
      'Include time and space complexity analysis in algorithm implementations',
      'Projects should show scale concerns: pagination, caching, indexing, rate limiting',
      'Highlight any open-source contributions with merged PRs',
      'Write README as a technical design document, not just setup instructions',
    ],
    portfolio_tips: [
      'Include a dedicated "Problem Solving" section with LeetCode stats',
      'Show system design diagrams for your most complex project',
      'Link to any published technical articles or dev.to posts',
      'Demonstrate knowledge of trade-offs (SQL vs NoSQL, REST vs GraphQL)',
      'Certifications (AWS SAA, etc.) add credibility for SDE roles',
    ]
  },
  'data analyst': {
    must_have: ['SQL', 'Python', 'Excel', 'Data Visualization', 'Statistics', 'Pandas', 'NumPy'],
    nice_to_have: ['Tableau', 'Power BI', 'Looker', 'R', 'Matplotlib', 'Seaborn', 'BigQuery', 'Snowflake', 'A/B Testing', 'Dashboard', 'Google Analytics'],
    action_verbs: ['Analyzed', 'Visualized', 'Identified', 'Reduced', 'Improved', 'Built', 'Designed', 'Extracted', 'Modeled', 'Transformed', 'Automated', 'Forecasted'],
    project_suggestions: [
      { title: 'Sales Performance Dashboard with Forecasting', tech: 'Python · Pandas · Tableau/Power BI · SQL · Streamlit', why: 'End-to-end analytics pipeline — demonstrates business value immediately' },
      { title: 'Customer Segmentation Analysis', tech: 'Python · Scikit-learn · Pandas · Matplotlib · SQL', why: 'Combines SQL + ML + visualization — multi-skill proof in one project' },
      { title: 'A/B Testing Framework & Statistical Report', tech: 'Python · SciPy · Pandas · SQL · Jupyter · Streamlit', why: 'Product analytics core skill — highly valued at tech companies' },
    ],
    trending_2025: ['dbt (data build tool)', 'DuckDB', 'Polars', 'Snowflake', 'BigQuery', 'Hex Notebooks', 'Apache Spark', 'Metabase', 'LLM for Analytics (Text-to-SQL)', 'Observable Plot'],
    github_tips: [
      'Use Jupyter Notebooks — recruiters expect interactive .ipynb files',
      'Include data visualizations as screenshots in README',
      'Show SQL query complexity: CTEs, window functions, subqueries, GROUP BY',
      'Deploy dashboards (Streamlit/Gradio) with public links — shows initiative',
      'Share Kaggle profile link — competitions demonstrate analytical rigor',
    ],
    portfolio_tips: [
      'Include a case study format: Problem → Approach → Insight → Business Impact',
      'Show data cleaning steps — DA recruiters care about data quality awareness',
      'Include a public Tableau/Power BI dashboard link',
      'Write a blog post about each analysis project on Medium or dev.to',
      'Show sample SQL queries with comments explaining your logic',
    ]
  },
  'data scientist': {
    must_have: ['Python', 'Machine Learning', 'Pandas', 'NumPy', 'Scikit-learn', 'Statistics', 'SQL'],
    nice_to_have: ['TensorFlow', 'PyTorch', 'NLP', 'Computer Vision', 'Deep Learning', 'Spark', 'MLflow', 'AWS SageMaker', 'Feature Engineering', 'Model Deployment', 'HuggingFace'],
    action_verbs: ['Built', 'Trained', 'Optimized', 'Improved', 'Developed', 'Designed', 'Reduced', 'Increased', 'Deployed', 'Evaluated', 'Engineered', 'Fine-tuned'],
    project_suggestions: [
      { title: 'End-to-End ML Pipeline with Production Deployment', tech: 'Python · FastAPI · Scikit-learn · MLflow · Docker', why: 'Production ML mindset — shows you build real models, not just notebooks' },
      { title: 'NLP Sentiment Analysis API', tech: 'Python · HuggingFace Transformers · FastAPI · Docker', why: 'NLP + LLM ecosystem is the hottest DS skill in 2025' },
      { title: 'Recommendation System (Collaborative Filtering)', tech: 'Python · Pandas · Matrix Factorization · Flask · PostgreSQL', why: 'High business value — shows real-world ML application with engineering' },
    ],
    trending_2025: ['LLM Fine-tuning (LoRA/QLoRA)', 'LangChain/LlamaIndex', 'Vector DBs (Pinecone/Weaviate)', 'MLOps', 'RAG Systems', 'HuggingFace PEFT', 'DPO/RLHF', 'Multimodal AI', 'AutoML (AutoGluon)', 'Feature Stores'],
    github_tips: [
      'Show model metrics: Accuracy, F1, AUC-ROC, RMSE — prominently in README',
      'Include Jupyter notebooks with clear markdown cells explaining your thinking',
      'Deploy models as APIs (FastAPI/Streamlit) with public accessible links',
      'Use MLflow or W&B for experiment tracking — shows professional DS workflow',
      'Kaggle Expert/Master badge is a legitimate resume credential — link it',
    ],
    portfolio_tips: [
      'Frame every project as: Business Problem → ML Approach → Metrics → Deployment',
      'Show model comparison tables (Baseline vs Final) to demonstrate iteration',
      'Include a section on "What I would do with more data/compute"',
      'Write Medium articles about your models — thought leadership stands out',
      'Link to Kaggle notebooks for public competition work',
    ]
  },
  'devops': {
    must_have: ['Docker', 'Linux', 'CI/CD', 'Git', 'Bash', 'AWS', 'Kubernetes'],
    nice_to_have: ['Terraform', 'Ansible', 'Jenkins', 'GitHub Actions', 'Prometheus', 'Grafana', 'Helm', 'Nginx', 'Redis', 'GCP', 'Azure'],
    action_verbs: ['Automated', 'Deployed', 'Orchestrated', 'Configured', 'Optimized', 'Reduced', 'Implemented', 'Managed', 'Scaled', 'Migrated', 'Provisioned'],
    project_suggestions: [
      { title: 'Kubernetes Cluster with Full Observability Stack', tech: 'K8s · Prometheus · Grafana · Helm · GitHub Actions', why: 'Core DevOps stack — shows production-level infrastructure thinking' },
      { title: 'CI/CD Pipeline from Code to Production (Zero Downtime)', tech: 'GitHub Actions · Docker · AWS ECS · Terraform · Blue-Green Deploy', why: 'IaC + automation + zero-downtime = ideal DevOps candidate profile' },
      { title: 'Infrastructure as Code for Multi-Environment Setup', tech: 'Terraform · AWS · Ansible · CloudWatch · SNS Alerts', why: 'Multi-env (dev/staging/prod) management shows scale thinking' },
    ],
    trending_2025: ['Platform Engineering', 'GitOps (ArgoCD/Flux)', 'eBPF', 'Crossplane', 'Karpenter', 'OpenTelemetry', 'Cilium CNI', 'Dagger.io', 'WASM for K8s', 'Backstage IDP'],
    github_tips: [
      'Show working Kubernetes manifests or Terraform code — not just theory',
      'Include architecture diagrams in READMEs (draw.io/Excalidraw exports)',
      'Demonstrate real cloud cost impact: "Reduced infra costs by X%"',
      'Public CI/CD workflows visible in .github/workflows/ folder',
      'Certifications (CKA, AWS SAA) are worth pinning in GitHub profile bio',
    ],
    portfolio_tips: [
      'Show a working monitoring dashboard (Grafana) with screenshots',
      'Document a real incident you resolved and how you automated the fix',
      'Include cost optimization case studies with actual numbers',
      'Show before/after deployment times with your CI/CD improvements',
      'Publish runbooks as GitHub wikis — shows operational maturity',
    ]
  },
  'react developer': {
    must_have: ['React', 'JavaScript', 'TypeScript', 'HTML', 'CSS', 'Git', 'REST API', 'State Management'],
    nice_to_have: ['Redux', 'React Query', 'Next.js', 'Testing Library', 'Jest', 'Tailwind CSS', 'Vite', 'Storybook', 'Performance', 'React Native', 'Zustand'],
    action_verbs: ['Built', 'Optimized', 'Designed', 'Refactored', 'Implemented', 'Migrated', 'Created', 'Improved', 'Delivered', 'Engineered'],
    project_suggestions: [
      { title: 'Component Library with Design System', tech: 'React · TypeScript · Storybook · CSS Variables · Chromatic', why: 'Shows architectural and documentation skills — differentiating for any React role' },
      { title: 'Real-Time Data Dashboard', tech: 'React · TanStack Query · WebSocket · Recharts · TypeScript', why: 'Complex state + performance + real-time — difficult to fake' },
      { title: 'PWA with Offline Support & Push Notifications', tech: 'React · Service Worker · IndexedDB · Web Push API · TypeScript', why: 'Advanced browser APIs — rare and recruiter-noticed skill' },
    ],
    trending_2025: ['React 19 Actions & Transitions', 'React Server Components', 'TanStack Router v1', 'Zustand / Jotai', 'shadcn/ui', 'Next.js 14 App Router', 'Million.js', 'TypeScript 5.x', 'Biome linter', 'Vite 5'],
    github_tips: [
      'Show component architecture: src/components/ui/ + src/features/ folder split',
      'Include Storybook stories for reusable components — shows documentation habit',
      'Add React DevTools screenshots showing component hierarchy design',
      'Performance metrics: Bundle size, Lighthouse, Core Web Vitals in README',
      'Live deployed Vercel/Netlify links for every project — absolutely mandatory',
    ],
    portfolio_tips: [
      'Show component API design with TypeScript props documentation',
      'Include before/after performance metrics using Chrome DevTools screenshots',
      'Show mobile responsiveness with side-by-side desktop/mobile screenshots',
      'Link to CodeSandbox/StackBlitz for interactive component demos',
      'Include a "Built with" tech badge section at the top of each README',
    ]
  }
};

const GENERIC_OBJECTIVES = [
  'seeking a challenging', 'to work in a dynamic', 'hardworking individual',
  'passionate about technology', 'eager to learn', 'looking for an opportunity',
  'fresher looking', 'to utilize my skills', 'a position where i can',
  'obtain a position', 'goal-oriented', 'team player', 'quick learner',
];

const PASSIVE_PHRASES = [
  'responsible for', 'was responsible for', 'worked on', 'was tasked with',
  'helped with', 'assisted in', 'was involved in', 'participated in',
  'was part of a team', 'contributed to the', 'worked as part of',
];

const STRONG_ACTION_VERBS = [
  'built', 'developed', 'designed', 'created', 'implemented', 'engineered',
  'deployed', 'optimized', 'architected', 'led', 'managed', 'drove',
  'increased', 'reduced', 'improved', 'launched', 'delivered', 'automated',
  'integrated', 'migrated', 'refactored', 'analyzed', 'visualized', 'trained',
  'solved', 'established', 'spearheaded', 'orchestrated', 'overhauled', 'scaled',
  'streamlined', 'transformed', 'accelerated', 'boosted', 'generated', 'achieved',
];

// ── Role Normalizer ───────────────────────────────────────────────────────────

function normalizeRole(role) {
  const r = (role || '').toLowerCase().trim();
  if (r.includes('mern')) return 'mern stack';
  if (r.includes('frontend') || r.includes('front-end') || r.includes('front end')) return 'frontend developer';
  if (r.includes('backend') || r.includes('back-end') || r.includes('back end')) return 'backend developer';
  if (r.includes('react native') || r.includes('react developer') || r.includes('react dev')) return 'react developer';
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

// ── Section Detection ─────────────────────────────────────────────────────────

const SECTION_PATTERNS = {
  summary:        /\b(summary|objective|profile|about\s*me|career\s*objective|professional\s*summary|overview|introduction)\b/i,
  skills:         /\b(skills|technical\s*skills|tech\s*stack|technologies|competencies|expertise|tools\s*&\s*technologies|core\s*competencies)\b/i,
  experience:     /\b(experience|work\s*experience|employment|work\s*history|internship|professional\s*experience|industry\s*experience)\b/i,
  projects:       /\b(projects|project\s*work|personal\s*projects|academic\s*projects|key\s*projects|portfolio|notable\s*projects)\b/i,
  education:      /\b(education|academic|qualification|degree|university|college|schooling)\b/i,
  certifications: /\b(certifications?|certificates?|courses?|training|achievements?|awards?|accomplishments?|honors?)\b/i,
  links:          /\b(github|linkedin|portfolio|contact|social|links?|website|online\s*presence)\b/i,
};

function detectSections(text) {
  const lines = text.split('\n');
  const sections = {};
  const sectionContent = {};
  let currentSection = 'unsorted';
  let currentLines = [];

  const saveSection = () => {
    if (currentSection && currentLines.length) {
      sectionContent[currentSection] = currentLines.join('\n').trim();
    }
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) { currentLines.push(''); continue; }

    // Header detection: short line matching a known section name
    if (trimmed.length < 60) {
      let matched = null;
      for (const [sec, pat] of Object.entries(SECTION_PATTERNS)) {
        if (pat.test(trimmed)) { matched = sec; break; }
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

// ── Bullet Extraction ─────────────────────────────────────────────────────────

function extractBullets(text) {
  if (!text) return [];
  const bullets = [];
  const patterns = [
    /^[\s]*[•·\-\*▪►•‣●►]\s+(.{15,})$/gm,
    /^[\s]*\d+[.)]\s+(.{15,})$/gm,
  ];
  for (const pat of patterns) {
    let m;
    while ((m = pat.exec(text)) !== null) bullets.push(m[1].trim());
  }
  // Also detect sentences that likely ARE bullets but without symbol (indent-based)
  const lines = text.split('\n');
  for (const line of lines) {
    const t = line.trim();
    if (t.length > 20 && t.length < 200 && /^[A-Z]/.test(t) && !t.endsWith(':') && line.startsWith('  ')) {
      if (!bullets.includes(t)) bullets.push(t);
    }
  }
  return bullets.slice(0, 20); // cap at 20
}

// ── Scoring Dimensions ────────────────────────────────────────────────────────

function scoreKeywordMatch(textLower, profile, jd) {
  const allKw = [...new Set([...profile.must_have, ...profile.nice_to_have])];
  const jdBonus = jd ? jd.toLowerCase() : '';
  let found = 0;
  const foundList = [];
  const missingList = [];

  for (const kw of allKw) {
    const kwl = kw.toLowerCase();
    if (textLower.includes(kwl) || (jdBonus && jdBonus.includes(kwl))) {
      found++;
      foundList.push(kw);
    } else {
      missingList.push(kw);
    }
  }

  const score = Math.min(30, (found / allKw.length) * 30);
  return { score, foundList, missingList };
}

function scoreFormatting(text, sections) {
  const presentSections = Object.keys(sections).length;
  const hasBullets = /^[\s]*[•·\-\*▪►•]\s+\S/m.test(text);
  const wordCount = text.split(/\s+/).length;
  const hasEmail = /[\w.]+@[\w.]+\.[a-z]{2,}/i.test(text);
  const hasPhone = /[\+\d][\d\s\-()]{9,}/.test(text);

  let score = 0;
  score += Math.min(6, (presentSections / 5) * 6);
  score += hasBullets ? 3 : 0;
  score += (wordCount >= 250 && wordCount <= 900) ? 3 : wordCount > 100 ? 1 : 0;
  score += hasEmail ? 1.5 : 0;
  score += hasPhone ? 1.5 : 0;
  return Math.min(15, score);
}

function scoreContentQuality(text) {
  const lower = text.toLowerCase();
  const verbsFound = STRONG_ACTION_VERBS.filter(v => lower.includes(v));
  const passiveCount = PASSIVE_PHRASES.filter(p => lower.includes(p)).length;
  const genericCount = GENERIC_OBJECTIVES.filter(g => lower.includes(g)).length;

  let score = Math.min(14, verbsFound.length * 1.8);
  score -= passiveCount * 2;
  score -= genericCount * 1.5;
  return Math.max(0, Math.min(20, score));
}

function scoreImpactMetrics(text) {
  const numbers = (text.match(/\d+/g) || []).length;
  const hasPercent = (text.match(/%/g) || []).length;
  const hasDollar = (text.match(/\$/g) || []).length;
  const hasX = (text.match(/\d+x\b/gi) || []).length;
  const hasUsers = /\d+\s*(users|customers|clients|people|members)/i.test(text);
  const hasMs = /\d+\s*(ms|seconds|minutes|hours)/i.test(text);

  let score = 0;
  score += Math.min(10, numbers * 0.7);
  score += Math.min(5, hasPercent * 1.5);
  score += Math.min(2, hasDollar * 1);
  score += Math.min(2, hasX * 1);
  score += hasUsers ? 1 : 0;
  score += hasMs ? 1 : 0;
  return Math.min(20, Math.round(score * 10) / 10);
}

function scoreSkillsRelevance(textLower, profile) {
  const mustFound = profile.must_have.filter(k => textLower.includes(k.toLowerCase()));
  return Math.min(15, (mustFound.length / profile.must_have.length) * 15);
}

// ── Section Analyzers ─────────────────────────────────────────────────────────

function analyzeSummary(sections, sectionContent) {
  const present = !!sections.summary;
  const content = sectionContent.summary || '';
  const lower = content.toLowerCase();
  const issues = [];
  const improvements = [];

  if (!present) {
    return {
      present: false, health: 'missing',
      issues: ['No Summary/Objective section found'],
      improvements: ['Add a 3-line Professional Summary at the top of your resume'],
      rewrite: 'Results-driven [Role] with hands-on experience in [Key Skills]. Built [X] projects including [Best Project]. Seeking a [Target Role] position to deliver [Impact].'
    };
  }

  if (GENERIC_OBJECTIVES.some(g => lower.includes(g))) {
    issues.push('Contains generic objective language (e.g., "seeking a challenging position")');
    improvements.push('Replace with a specific Professional Summary mentioning your top 2 skills and a measurable achievement');
  }
  if (content.split(' ').length < 30) {
    issues.push('Summary is too short (under 30 words) — add more professional context');
    improvements.push('Expand to 3–4 sentences: Who you are · What you build · What you want · Your impact');
  }
  if (!/\d/.test(content)) {
    issues.push('No measurable claims in summary — recruiters want proof, not promises');
    improvements.push('Add a metric: "Built X projects", "X+ contributions", "Improved performance by X%"');
  }

  const health = issues.length === 0 ? 'strong' : issues.length === 1 ? 'average' : 'weak';

  return {
    present, health, issues, improvements,
    rewrite: `Results-driven software developer with proven experience building [role-specific tech] applications. Delivered [X] production-ready projects serving [N] users, with demonstrated ability to reduce load times by [X%] through architecture optimization. Seeking a [Target Role] position where I can drive measurable engineering impact.`
  };
}

function analyzeSkills(sections, sectionContent, profile) {
  const present = !!sections.skills;
  const content = sectionContent.skills || '';
  const lower = content.toLowerCase();
  const issues = [];
  const improvements = [];

  if (!present) {
    return {
      present: false, health: 'missing',
      issues: ['No Skills section found — ATS cannot parse your tech stack'],
      improvements: ['Add a Technical Skills section with categorized skills'],
      rewrite: `Languages: JavaScript, TypeScript, Python\nFrameworks: React.js, Node.js, Express.js\nDatabases: MongoDB, PostgreSQL\nTools: Git, Docker, VS Code, Postman`
    };
  }

  const irrelevantSkills = ['ms word', 'microsoft word', 'powerpoint', 'ms office', 'microsoft office', 'ms excel', 'photoshop', 'coreldraw'];
  const foundIrrelevant = irrelevantSkills.filter(s => lower.includes(s));
  if (foundIrrelevant.length) {
    issues.push(`Remove office/design tools irrelevant to ${profile.must_have[0]} roles: ${foundIrrelevant.join(', ')}`);
    improvements.push('Keep only technical/engineering skills — recruiters filter by tech stack relevance');
  }

  if (!/(languages?|frameworks?|tools|databases?|technologies)/i.test(content)) {
    issues.push('Skills are not categorized — hard for ATS to parse and for humans to scan');
    improvements.push('Group into: Languages | Frameworks/Libraries | Databases | Tools | Cloud/DevOps');
  }

  const missingMust = profile.must_have.filter(k => !lower.includes(k.toLowerCase()));
  if (missingMust.length > 2) {
    issues.push(`Missing ${missingMust.length} critical skills for this role: ${missingMust.slice(0, 3).join(', ')}...`);
    improvements.push(`Add these to your skills section if you know them: ${missingMust.join(', ')}`);
  }

  const health = issues.length === 0 ? 'strong' : issues.length === 1 ? 'average' : 'weak';
  return {
    present, health, issues, improvements,
    rewrite: `Languages: ${profile.must_have.slice(0, 3).join(', ')}\nFrameworks: ${profile.must_have.slice(3, 6).join(', ')}\nTools & Databases: ${profile.nice_to_have.slice(0, 4).join(', ')}\nCloud/DevOps: Git, Docker, GitHub Actions`
  };
}

function analyzeProjects(sections, sectionContent, bullets) {
  const present = !!sections.projects;
  const content = sectionContent.projects || '';
  const issues = [];
  const improvements = [];

  if (!present) {
    return {
      present: false, health: 'missing',
      issues: ['No Projects section — this is the #1 section recruiters look at for freshers/juniors'],
      improvements: ['Add 2–3 well-documented projects with live demo links and metrics'],
      rewrite: ''
    };
  }

  const projectBullets = bullets.filter(b => content.includes(b));
  const hasMetrics = /\d+\s*(%|users|ms|seconds|requests|customers)/i.test(content);
  const hasLinks = /(github\.com|vercel\.app|netlify\.app|demo|live|deployed)/i.test(content);
  const genericTitles = ['todo', 'calculator', 'weather app', 'portfolio', 'blog app', 'chat app', 'e-commerce site'];
  const foundGeneric = genericTitles.filter(g => content.toLowerCase().includes(g));

  if (!hasMetrics) {
    issues.push('No performance metrics in project descriptions — "built X" is weaker than "built X serving 500 users"');
    improvements.push('Add: users served, load time improvement, uptime %, response time, lines of code, API calls/sec');
  }
  if (!hasLinks) {
    issues.push('No GitHub/live demo links in Projects section — ATS and recruiters need to verify your work');
    improvements.push('Add: GitHub repo link + live demo URL for every project');
  }
  if (foundGeneric.length) {
    issues.push(`Generic project title(s) detected: "${foundGeneric[0]}" — these blend in with 1000 other resumes`);
    improvements.push('Rename: "Todo App" → "Full-Stack Task Management Platform with Real-Time Sync & Team Collaboration"');
  }
  if (projectBullets.length < 2) {
    issues.push('Projects have too few bullet points — each project needs 2–3 impact-driven bullets');
    improvements.push('Add 2–3 bullets per project: What you built · How you built it · What impact it had');
  }

  const health = issues.length === 0 ? 'strong' : issues.length <= 2 ? 'average' : 'weak';
  return { present, health, issues, improvements, rewrite: '' };
}

function analyzeEducation(sections, sectionContent) {
  const present = !!sections.education;
  const content = sectionContent.education || '';
  const issues = [];
  const improvements = [];

  if (!present) {
    return {
      present: false, health: 'missing',
      issues: ['No Education section found'],
      improvements: ['Add your degree, university, graduation year, and GPA if above 3.0/7.5+'],
      rewrite: ''
    };
  }

  if (!/\b(20\d{2})\b/.test(content)) {
    issues.push('Graduation year not visible — ATS uses this for experience calculation');
    improvements.push('Add graduation year explicitly: "B.Tech CSE | IIT/NIT/Your Uni | 2024"');
  }
  if (!/\b(gpa|cgpa|percentage|%)/i.test(content)) {
    issues.push('No GPA/percentage mentioned — include if above 7.5 CGPA or 75%');
    improvements.push('Add GPA: "CGPA: 8.2/10" — helps with eligibility filters at top companies');
  }

  const health = issues.length === 0 ? 'strong' : 'average';
  return { present, health, issues, improvements, rewrite: '' };
}

function analyzeCertifications(sections, sectionContent) {
  const present = !!sections.certifications;
  const content = sectionContent.certifications || '';
  const issues = [];
  const improvements = [];

  if (!present) {
    return {
      present: false, health: 'missing',
      issues: ['No Certifications section — certifications differentiate freshers significantly'],
      improvements: ['Add free certifications: AWS Cloud Practitioner, Google Data Analytics, Meta Frontend Dev, HackerRank skills'],
      rewrite: ''
    };
  }

  if (!/(aws|google|microsoft|meta|udemy|coursera|hackerrank|leetcode|ibm|cisco)/i.test(content)) {
    issues.push('Certifications listed may not carry weight — prioritize recognized issuers');
    improvements.push('Preferred issuers: AWS · Google · Microsoft · Meta · IBM · Coursera (university-backed)');
  }

  const health = issues.length === 0 ? 'strong' : 'average';
  return { present, health, issues, improvements, rewrite: '' };
}

function analyzeLinks(text, sections) {
  const hasGitHub = /github\.com\/[\w\-]+/i.test(text);
  const hasLinkedIn = /linkedin\.com\/in\/[\w\-]+/i.test(text);
  const hasPortfolio = /(portfolio|personal.*site|vercel\.app|netlify\.app|\.dev|\.io\/[\w])/i.test(text);
  const present = hasGitHub || hasLinkedIn || hasPortfolio;
  const issues = [];
  const improvements = [];

  if (!hasGitHub) {
    issues.push('No GitHub profile link — this is the #1 missing link recruiters check');
    improvements.push('Add: github.com/yourhandle — ensure repos are public and well-documented');
  }
  if (!hasLinkedIn) {
    issues.push('No LinkedIn URL — most ATS systems and recruiters verify LinkedIn');
    improvements.push('Add: linkedin.com/in/yourname — ensure profile matches your resume');
  }
  if (!hasPortfolio) {
    improvements.push('Bonus: add a portfolio site (free on Vercel/Netlify) for significantly higher callback rates');
  }

  const health = !hasGitHub && !hasLinkedIn ? 'missing' : issues.length === 0 ? 'strong' : 'average';
  return { present, health, issues, improvements, rewrite: '' };
}

// ── Keyword Analysis ──────────────────────────────────────────────────────────

function buildKeywordAnalysis(text, profile, jdText, kwResult) {
  const lower = text.toLowerCase();
  const overused = PASSIVE_PHRASES.filter(p => lower.includes(p)).map(p => `"${p}"`);
  const jdMissing = [];

  if (jdText) {
    const jdLower = jdText.toLowerCase();
    const jdWords = [...new Set(jdLower.match(/\b[a-z]{4,}\b/g) || [])];
    for (const word of jdWords) {
      if (word.length > 4 && !lower.includes(word) && !['with', 'that', 'this', 'have', 'from', 'your', 'will', 'they', 'more', 'also'].includes(word)) {
        jdMissing.push(word);
      }
    }
  }

  return {
    found: kwResult.foundList,
    missing: kwResult.missingList,
    jd_specific_missing: jdMissing.slice(0, 10),
    overused_weak_phrases: overused,
    suggested_action_verbs: ['Architected', 'Engineered', 'Optimized', 'Deployed', 'Delivered', 'Drove', 'Launched', 'Reduced', 'Increased', 'Automated']
  };
}

// ── Bullet Improvements ────────────────────────────────────────────────────────

const BULLET_REWRITES = {
  'worked on': 'Developed',
  'helped with': 'Contributed to and improved',
  'was responsible for': 'Owned and delivered',
  'assisted in': 'Collaborated to build',
  'was part of': 'Engineered as core team member for',
  'participated in': 'Led development of',
  'involved in': 'Spearheaded',
};

function improveBullets(bullets, profile) {
  const improved = [];

  for (const bullet of bullets.slice(0, 8)) {
    const lower = bullet.toLowerCase();
    const isWeak = PASSIVE_PHRASES.some(p => lower.startsWith(p)) || !STRONG_ACTION_VERBS.some(v => lower.startsWith(v));
    const hasMetric = /\d/.test(bullet);
    const hasAction = STRONG_ACTION_VERBS.some(v => lower.startsWith(v));

    if (!isWeak && hasMetric && hasAction) continue; // already strong

    let improved_text = bullet;
    // Fix passive starters
    for (const [weak, strong] of Object.entries(BULLET_REWRITES)) {
      if (lower.startsWith(weak)) {
        improved_text = strong + improved_text.slice(weak.length);
        break;
      }
    }
    // If no action verb, prepend one
    if (!STRONG_ACTION_VERBS.some(v => improved_text.toLowerCase().startsWith(v))) {
      const verb = profile.action_verbs[0] || 'Built';
      improved_text = `${verb} ${improved_text.charAt(0).toLowerCase()}${improved_text.slice(1)}`;
    }
    // Append metric suggestion if none
    if (!hasMetric) {
      improved_text += ', improving performance by [X%] and serving [N] users';
    }

    if (improved_text !== bullet) {
      improved.push({
        original: bullet,
        improved: improved_text,
        why: `${!hasAction ? 'Added strong action verb. ' : ''}${!hasMetric ? 'Added measurable impact metric.' : ''}`.trim()
      });
    }
  }

  return improved;
}

// ── Project Optimization ──────────────────────────────────────────────────────

const GENERIC_PROJECT_NAMES = {
  'todo app': 'Full-Stack Task Management Platform with Real-Time Sync',
  'todo list': 'Collaborative Task Management System with Team Roles',
  'weather app': 'Real-Time Weather Intelligence Dashboard with Location Analytics',
  'calculator': 'Scientific Calculator PWA with Offline Mode & History',
  'blog': 'Developer Blog Platform with CMS, SEO & Newsletter Integration',
  'portfolio': 'Personal Portfolio with Performance Analytics & Dark Mode',
  'chat app': 'Real-Time Messaging Platform with End-to-End Encryption',
  'ecommerce': 'Full-Stack E-Commerce Platform with Payment Gateway & Inventory Management',
  'e-commerce': 'Full-Stack E-Commerce Platform with Payment Gateway & Inventory Management',
  'quiz app': 'Competitive Quiz Platform with Leaderboard & Real-Time Score Tracking',
  'note app': 'Smart Note-Taking App with AI Summarization & Tagging',
  'movie app': 'Film Discovery Platform with Personalized Recommendations & Watchlist',
};

function optimizeProjects(sectionContent, profile) {
  const content = sectionContent.projects || '';
  if (!content) return [];

  const optimized = [];
  for (const [generic, improved] of Object.entries(GENERIC_PROJECT_NAMES)) {
    if (content.toLowerCase().includes(generic)) {
      optimized.push({
        original_title: generic.charAt(0).toUpperCase() + generic.slice(1),
        improved_title: improved,
        description: `${improved} built with ${profile.must_have.slice(0, 3).join(', ')}.`,
        improvements: [
          `Rename to "${improved}" to stand out from generic resumes`,
          `Add: "Deployed on [Platform] serving [N] active users"`,
          `Add: "Implemented [tech from: ${profile.nice_to_have.slice(0, 3).join(', ')}] to achieve [X%] improvement"`,
          `Add GitHub + Live Demo links inline with project title`,
        ],
        suggested_tech_keywords: profile.nice_to_have.slice(0, 4)
      });
    }
  }

  // If no generic names found but section exists, give generic advice
  if (!optimized.length && content.length > 0) {
    optimized.push({
      original_title: 'Detected Projects',
      improved_title: 'Projects (see improvements below)',
      description: '',
      improvements: [
        'Add live demo links for every project — github.com/user/repo + live URL',
        'Every project description should have at least 3 bullet points',
        'Add user/performance metrics: "Serving 200+ users", "API latency under 50ms"',
        `Add these missing tech keywords: ${profile.nice_to_have.slice(0, 4).join(', ')}`,
      ],
      suggested_tech_keywords: profile.nice_to_have.slice(0, 5)
    });
  }

  return optimized;
}

// ── Red Flag Detection ─────────────────────────────────────────────────────────

function detectRedFlags(text, sections, bullets, expLevel) {
  const lower = text.toLowerCase();
  const flags = [];

  // Passive phrases
  const passiveFound = PASSIVE_PHRASES.filter(p => lower.includes(p));
  if (passiveFound.length > 0) {
    flags.push({
      severity: 'high',
      flag: 'Passive / weak ownership language detected',
      instances: passiveFound.map(p => `"${p}"`),
      fix: 'Replace with strong action verbs: "Built", "Engineered", "Deployed", "Optimized", "Led"'
    });
  }

  // No metrics
  const numberCount = (text.match(/\d+/g) || []).length;
  if (numberCount < 5) {
    flags.push({
      severity: 'high',
      flag: 'Almost no metrics or numbers in the entire resume',
      instances: [],
      fix: 'Add specific numbers to every bullet: users served, % improvement, response time, project count, team size'
    });
  }

  // No GitHub
  if (!/github\.com/i.test(text)) {
    flags.push({
      severity: 'high',
      flag: 'Missing GitHub profile link',
      instances: [],
      fix: 'Add your GitHub URL in the contact header — it\'s the #1 thing recruiters check for dev roles'
    });
  }

  // Generic objective
  const genericFound = GENERIC_OBJECTIVES.filter(g => lower.includes(g));
  if (genericFound.length > 0) {
    flags.push({
      severity: 'medium',
      flag: 'Generic objective statement detected — filtered by ATS immediately',
      instances: genericFound.map(g => `"${g}"`),
      fix: 'Replace with a specific Professional Summary mentioning your tech stack and a real achievement'
    });
  }

  // Word count
  const wordCount = text.split(/\s+/).length;
  if (wordCount < 200) {
    flags.push({
      severity: 'high',
      flag: `Resume is too thin — only ~${wordCount} words`,
      instances: [],
      fix: 'Expand to 400–700 words. Freshers need strong Projects + Skills sections to compensate for no experience'
    });
  }
  if (expLevel === 'Fresher' && wordCount > 900) {
    flags.push({
      severity: 'medium',
      flag: 'Resume is too long for a fresher — recruiters spend avg 6 seconds per resume',
      instances: [],
      fix: 'Cut to 1 page (400–600 words). Remove irrelevant content, keep only high-impact items'
    });
  }

  // No skills section
  if (!sections.skills) {
    flags.push({
      severity: 'high',
      flag: 'No Skills section — ATS cannot parse your technical profile without it',
      instances: [],
      fix: 'Add a categorized Technical Skills section immediately after your Summary'
    });
  }

  // Repeated words
  const wordFreq = {};
  lower.split(/\s+/).forEach(w => { if (w.length > 4) wordFreq[w] = (wordFreq[w] || 0) + 1; });
  const overused = Object.entries(wordFreq).filter(([w, c]) => c >= 5 && !['which', 'using', 'worked', 'skills', 'experience'].includes(w));
  if (overused.length > 0) {
    flags.push({
      severity: 'low',
      flag: 'Repetitive words reduce impact',
      instances: overused.slice(0, 3).map(([w, c]) => `"${w}" used ${c} times`),
      fix: 'Use varied vocabulary: alternate between synonymous action verbs and technologies'
    });
  }

  // ATS risky: tables/columns (heuristic: lots of | characters)
  if ((text.match(/\|/g) || []).length > 8) {
    flags.push({
      severity: 'medium',
      flag: 'Table/column formatting detected — many ATS systems cannot parse table layouts',
      instances: [],
      fix: 'Convert any tables to plain text bullet lists for maximum ATS compatibility'
    });
  }

  return flags;
}

// ── Optimized Resume Generator ─────────────────────────────────────────────────

function generateOptimizedResume(text, sections, sectionContent, profile, role, expLevel) {
  // Extract name from first non-empty line
  const lines = text.split('\n').filter(l => l.trim());
  const name = lines[0]?.trim() || 'YOUR NAME';

  // Extract email
  const emailMatch = text.match(/[\w.+-]+@[\w.]+\.[a-z]{2,}/i);
  const email = emailMatch ? emailMatch[0] : 'email@example.com';

  // Extract phone
  const phoneMatch = text.match(/[\+\d][\d\s\-()]{9,}/);
  const phone = phoneMatch ? phoneMatch[0].trim() : '+91-XXXXXXXXXX';

  // Extract GitHub
  const ghMatch = text.match(/github\.com\/[\w\-]+/i);
  const github = ghMatch ? `https://${ghMatch[0]}` : 'https://github.com/yourhandle';

  // Extract LinkedIn
  const liMatch = text.match(/linkedin\.com\/in\/[\w\-]+/i);
  const linkedin = liMatch ? `https://${liMatch[0]}` : 'https://linkedin.com/in/yourname';

  const techSkills = [
    `Languages: ${profile.must_have.slice(0, 4).join(', ')}`,
    `Frameworks & Libraries: ${profile.must_have.slice(4, 7).join(', ')}, ${profile.nice_to_have.slice(0, 2).join(', ')}`,
    `Databases & Tools: ${profile.nice_to_have.slice(2, 6).join(', ')}, Git, Docker`,
    `Cloud & DevOps: GitHub Actions, Vercel, AWS (basics)`,
  ].join('\n  ');

  const projectContent = sectionContent.projects
    ? sectionContent.projects.trim()
    : `• Project Name — [Description with tech and metrics]\n  GitHub: [link] | Live: [link]`;

  const experienceContent = sectionContent.experience
    ? sectionContent.experience.trim()
    : '';

  const educationContent = sectionContent.education
    ? sectionContent.education.trim()
    : 'B.Tech/BCA/BSc | [University Name] | [City] | [Year] | CGPA: X.X/10';

  const certContent = sectionContent.certifications
    ? sectionContent.certifications.trim()
    : '';

  const lines_arr = [
    `${name.toUpperCase()}`,
    `${email}  |  ${phone}  |  ${github}  |  ${linkedin}`,
    ``,
    `─── PROFESSIONAL SUMMARY ───────────────────────────────────────────────────`,
    `Results-driven ${role} developer with hands-on experience building scalable`,
    `applications using ${profile.must_have.slice(0, 3).join(', ')}. Delivered [N] production`,
    `projects serving [X]+ users. Adept at translating requirements into high-performance`,
    `solutions with clean, maintainable code. Seeking to contribute at a fast-paced`,
    `engineering team where impact is measurable.`,
    ``,
    `─── TECHNICAL SKILLS ───────────────────────────────────────────────────────`,
    `  ${techSkills}`,
    ``,
    `─── PROJECTS ───────────────────────────────────────────────────────────────`,
    projectContent,
    ``,
  ];

  if (experienceContent) {
    lines_arr.push(`─── EXPERIENCE ─────────────────────────────────────────────────────────────`);
    lines_arr.push(experienceContent);
    lines_arr.push(``);
  }

  lines_arr.push(
    `─── EDUCATION ──────────────────────────────────────────────────────────────`,
    educationContent,
    ``
  );

  if (certContent) {
    lines_arr.push(
      `─── CERTIFICATIONS ─────────────────────────────────────────────────────────`,
      certContent,
      ``
    );
  }

  return lines_arr.join('\n');
}

// ── Improvement Plan ──────────────────────────────────────────────────────────

function generateImprovementPlan(score, sectionAnalysis, kwAnalysis, redFlags) {
  const priority_fixes = [];
  const quick_wins = [];

  // High severity red flags → priority
  for (const flag of redFlags.filter(f => f.severity === 'high').slice(0, 4)) {
    const scoreBoost = flag.flag.includes('metric') ? '+8–12 pts' : flag.flag.includes('GitHub') ? '+4 pts' : flag.flag.includes('Passive') ? '+5 pts' : '+3–6 pts';
    priority_fixes.push({ fix: flag.fix, impact: scoreBoost, effort: '15–30 min' });
  }

  // Keyword gaps → priority
  if (kwAnalysis.missing.length > 3) {
    priority_fixes.push({
      fix: `Add missing must-have keywords to Skills/Projects: ${kwAnalysis.missing.slice(0, 4).join(', ')}`,
      impact: '+6–9 pts',
      effort: '20 min'
    });
  }

  // Section analysis → priority
  for (const [sec, analysis] of Object.entries(sectionAnalysis)) {
    if (analysis.health === 'missing' && ['projects', 'skills', 'summary'].includes(sec)) {
      priority_fixes.push({ fix: `Add ${sec.charAt(0).toUpperCase() + sec.slice(1)} section — currently missing`, impact: '+5–8 pts', effort: '1–2 hrs' });
    }
  }

  // Quick wins
  if (!sectionAnalysis.links?.present || sectionAnalysis.links?.health !== 'strong') {
    quick_wins.push('Add GitHub + LinkedIn URLs to header (+3 pts, 5 min)');
  }
  if (kwAnalysis.overused_weak_phrases.length) {
    quick_wins.push(`Replace weak phrases (${kwAnalysis.overused_weak_phrases[0]}) with action verbs (+2 pts, 10 min)`);
  }
  if (sectionAnalysis.skills?.health === 'weak' || sectionAnalysis.skills?.health === 'average') {
    quick_wins.push('Categorize skills into Languages / Frameworks / Tools / Cloud (+2 pts, 10 min)');
  }
  quick_wins.push(`Add ${profile_display_keywords(kwAnalysis.missing)} to your skills section if you know them (+4 pts, 5 min)`);
  quick_wins.push('Spell-check and ensure consistent date formats (Month YYYY) across all sections');

  const pointsFromFixes = Math.min(35, priority_fixes.length * 7 + quick_wins.length * 2);
  const estimated = Math.min(97, score + pointsFromFixes);

  return { priority_fixes: priority_fixes.slice(0, 5), quick_wins: quick_wins.slice(0, 5), estimated_score_after_fix: estimated };
}

function profile_display_keywords(missing) {
  return missing.slice(0, 3).join(', ') || 'role-specific skills';
}

// ── Main Analyzer ─────────────────────────────────────────────────────────────

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

  // Score
  const kwResult = scoreKeywordMatch(textLower, profile, jd);
  const formattingScore = scoreFormatting(text, sections);
  const contentQualityScore = scoreContentQuality(text);
  const impactScore = scoreImpactMetrics(text);
  const skillsScore = scoreSkillsRelevance(textLower, profile);

  const totalScore = Math.min(100, Math.round(kwResult.score + formattingScore + contentQualityScore + impactScore + skillsScore));

  const score_breakdown = {
    keyword_match:    { score: Math.round(kwResult.score),        max: 30, label: 'Keyword Match' },
    formatting:       { score: Math.round(formattingScore),       max: 15, label: 'Formatting & Structure' },
    content_quality:  { score: Math.round(contentQualityScore),   max: 20, label: 'Content Quality' },
    impact_metrics:   { score: Math.round(impactScore),           max: 20, label: 'Impact & Metrics' },
    skills_relevance: { score: Math.round(skillsScore),           max: 15, label: 'Skills Relevance' },
  };

  // Section analysis
  const section_analysis = {
    summary:        analyzeSummary(sections, sectionContent),
    skills:         analyzeSkills(sections, sectionContent, profile),
    projects:       analyzeProjects(sections, sectionContent, bullets),
    experience:     { present: !!sections.experience, health: sections.experience ? 'average' : 'missing', issues: sections.experience ? [] : ['No Experience/Internship section'], improvements: ['Add internships, freelance work, or open-source contributions'] },
    education:      analyzeEducation(sections, sectionContent),
    certifications: analyzeCertifications(sections, sectionContent),
    links:          analyzeLinks(text, sections),
  };

  const keyword_analysis = buildKeywordAnalysis(text, profile, jd, kwResult);
  const bullet_improvements = improveBullets(bullets, profile);
  const project_optimization = optimizeProjects(sectionContent, profile);
  const red_flags = detectRedFlags(text, sections, bullets, experienceLevel);
  const optimized_resume = generateOptimizedResume(text, sections, sectionContent, profile, targetRole, experienceLevel);
  const improvement_plan = generateImprovementPlan(totalScore, section_analysis, keyword_analysis, red_flags);

  const bonus = {
    suggested_projects: profile.project_suggestions,
    trending_skills_2025: profile.trending_2025,
    github_tips: profile.github_tips,
    portfolio_tips: profile.portfolio_tips,
  };

  return {
    ats_score: totalScore,
    score_label: totalScore >= 85 ? 'Excellent' : totalScore >= 70 ? 'Good' : totalScore >= 55 ? 'Average' : 'Needs Work',
    score_breakdown,
    word_count: text.split(/\s+/).length,
    target_role: targetRole,
    experience_level: experienceLevel,
    section_analysis,
    keyword_analysis,
    bullet_improvements,
    project_optimization,
    red_flags,
    optimized_resume,
    improvement_plan,
    bonus,
  };
}

module.exports = { analyzeResume };
