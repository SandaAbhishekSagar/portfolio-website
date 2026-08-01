/**
 * CANONICAL PROFESSIONAL RECORD
 * ─────────────────────────────────────────────────────────────────────────────
 * Single source of truth for: the rendered site, the prerendered HTML, the
 * resume mode, and the retrieval corpus behind "ask the index".
 *
 * RULES FOR EDITING
 *  1. Every number here must trace to the client's resume, LinkedIn export, or
 *     a public link. Do not round, upgrade, or infer.
 *  2. Omit anything unconfirmed. Never ship a placeholder to a hiring manager —
 *     a blank is invisible, an unverified claim is a credibility problem.
 *  3. Adding a project = append to PROJECTS. Its case study at /work/{slug},
 *     its index row, and its corpus chunk are all derived from this file.
 */

/* ─────────────────────────────────────────────────────────────── profile ── */

export const PROFILE = {
  name: 'Abhishek Sagar Sanda',
  title: 'Applied AI Engineer',
  location: 'Boston, MA',
  availability: 'Open to full-time roles — available now.',
  email: 'sabhisheksagar200@gmail.com',
  github: 'https://github.com/SandaAbhishekSagar',
  linkedin: 'https://www.linkedin.com/in/sandaabhisheksagar',
  site: 'https://www.abhisheksagarsanda.com',
  summary:
    'Applied AI engineer building voice agents that answer real phone calls and retrieval systems that cite their sources. Most recently at AutoAce (YC F25) on the voice-agent OS for car dealerships — telephony integration, latency reduction, and routing safeguards in production.',
} as const;

/* ──────────────────────────────────────────────────────────── experience ── */

export type Role = {
  slug: string;
  role: string;
  org: string;
  orgNote?: string;
  period: string;
  location: string;
  /** most recent role — labelled 'latest', not 'current' */
  latest?: boolean;
  stack: string[];
  bullets: string[];
};

/** Reverse-chronological. Order is the client's confirmed sequence. */
export const EXPERIENCE: Role[] = [
  {
    slug: 'autoace',
    role: 'Applied AI Engineer',
    org: 'AutoAce',
    orgNote: 'YC F25',
    period: 'Jun 2026 \u2014 Jul 2026',
    location: 'Boston, MA',
    latest: true,
    stack: ['LiveKit', 'Telephony / SIP', 'Python', 'TypeScript', 'Next.js', 'Supabase'],
    bullets: [
      'Built the voice-agent OS for car dealerships: telephony integration carrying live inbound calls end to end.',
      'Cut response latency in the voice loop and fixed race conditions surfacing under concurrent calls.',
      'Added routing safeguards to LiveKit so calls fail over predictably instead of dropping mid-conversation.',
    ],
  },
  {
    slug: 'elevance-health',
    role: 'Developer',
    org: 'Elevance Health',
    period: 'Apr 2026 \u2014 Jun 2026',
    location: 'Boston, MA',
    stack: ['.NET', 'C#', 'SQL Server', 'Azure'],
    bullets: [
      'Delivered .NET services for a Fortune 30 health insurer inside a regulated release process.',
    ],
  },
  {
    slug: 'northeastern-ta',
    role: 'Teaching Assistant',
    org: 'Northeastern University',
    orgNote: 'College of Engineering',
    period: 'Sep 2025 \u2014 Dec 2025',
    location: 'Boston, MA',
    stack: ['LLMs', 'Prompt engineering', 'Python'],
    bullets: [
      'Supported a graduate generative-AI course for 50+ students: labs, grading, and office hours.',
    ],
  },
  {
    slug: 'virtual-presenz',
    role: 'Research Software Engineer',
    org: 'Virtual Presenz Inc.',
    period: 'Sep 2024 \u2014 Dec 2025',
    location: 'Shrewsbury, MA',
    stack: ['YOLOv8', 'GPT-4', 'Python', 'PyTorch', 'OpenCV'],
    bullets: [
      'Built a YOLOv8 + GPT-4 multimodal pipeline reaching 85% detection accuracy across 70,000+ images.',
      'Reduced manual review effort by 60% by routing only low-confidence detections to a human.',
      'Cut chatbot response latency by 50%.',
    ],
  },
  {
    slug: 'hcltech',
    role: 'Dotnet Developer',
    org: 'HCL Technologies',
    period: 'Aug 2022 \u2014 Aug 2023',
    location: 'Chennai, India',
    stack: ['.NET', 'C#', 'SQL'],
    bullets: [
      'Shipped and maintained .NET services in an enterprise delivery team across a one-year engagement.',
    ],
  },
  {
    slug: 'blackbuck',
    role: 'Artificial Intelligence Intern',
    org: 'Blackbuck',
    period: 'Aug 2021 \u2014 Jul 2022',
    location: 'Remote',
    stack: ['Python', 'Machine learning'],
    bullets: [
      'Year-long applied machine-learning internship building and evaluating models in Python.',
    ],
  },
  {
    slug: 'iacademia',
    role: 'Summer Intern',
    org: 'iAcademia',
    period: 'Apr 2020 \u2014 Oct 2020',
    location: 'Hyderabad, India',
    stack: ['Python'],
    bullets: [
      'Seven-month software internship; first professional engineering role.',
    ],
  },
];

/* ───────────────────────────────────────────────────────────── education ── */

export const EDUCATION = [
  {
    degree: 'MS, Information Systems',
    school: 'Northeastern University',
    location: 'Boston, MA',
    date: 'Graduated December 2025',
    gpa: '3.82 / 4.0',
  },
  {
    degree: 'B.Tech, Electronics and Communication Engineering',
    school: 'Mahatma Gandhi Institute of Technology',
    location: 'Hyderabad, India',
    date: null,
    gpa: '7.8 / 10',
  },
];

/* ─────────────────────────────────────────────────────────── recognition ── */

export type Recognition = {
  title: string;
  org: string;
  date: string;
  detail: string;
  url: string | null;
  placement?: string;
};

export const AWARDS: Recognition[] = [
  {
    title: "Outstanding Master's Student Award — Community Impact",
    org: 'Northeastern University (MGEN Awards)',
    date: '2026',
    placement: 'One of four university-wide',
    detail:
      'Awarded for the Northeastern University Assistant, a faculty-sponsored retrieval system indexing 80,000+ university pages so students get answers with a cited source.',
    url: 'https://coe.northeastern.edu/news/information-systems-students-receive-2026-outstanding-masters-student-award-in-community-impact/',
  },
];

export const HACKATHONS: Recognition[] = [
  {
    title: 'MIT Bitcoin Hackathon — BitVoice Pay',
    org: 'Massachusetts Institute of Technology',
    date: '2026',
    placement: '2nd place',
    detail:
      'A Lightning wallet operated entirely through a phone call, built for people who own a basic phone but not a smartphone.',
    url: 'https://github.com/SandaAbhishekSagar/BitVoice_Pay',
  },
  {
    title: 'MIT × Weights & Biases Multi-Agent Hackathon — Denial Defense',
    org: 'MIT × Weights & Biases',
    date: '2026',
    placement: '3rd place',
    detail: 'A multi-agent system for contesting insurance claim denials.',
    url: 'https://github.com/SandaAbhishekSagar/denial-defense',
  },
  {
    title: 'Murf.AI Coding Challenge',
    org: 'Murf.AI',
    date: '2025',
    placement: 'Top-10 finalist',
    detail:
      'Built an AI interview coaching IVR on Murf.AI text-to-speech: callers run a mock interview by phone and get scored on speech rate, filler words and clarity.',
    url: 'https://github.com/SandaAbhishekSagar/AI_Interview_Couch_IVR',
  },
  {
    title: 'Roli.AI Hackathon',
    org: 'Roli.AI',
    date: '2024',
    placement: 'Winner',
    detail:
      'Built a dynamic AI chatbot on the Roli.AI platform, wiring conversational state and live model responses into a deployable web client.',
    url: 'https://github.com/SandaAbhishekSagar/AI_dynamic-chatbot',
  },
];

export const PUBLICATIONS: Recognition[] = [
  {
    title: 'TensorRT optimization — co-authored paper',
    org: 'MIT IMPACT Symposium',
    date: '2025',
    detail:
      'Co-authored work on TensorRT inference optimization, presented at the MIT IMPACT Symposium.',
    url: null,
  },
];

/** Framing line the client asked for. Derived, not invented. */
export const HACKATHON_FRAMING = 'Top-3 at three MIT hackathons in 14 months.';

/* ────────────────────────────────────────────────────────────── projects ── */

export type Project = {
  slug: string;
  title: string;
  cluster: 'voice' | 'retrieval' | 'vision' | 'systems';
  year: string;
  kind: string;
  /** one line, shown on the index */
  summary: string;
  metric: { label: string; value: string };
  problem: string;
  constraint: string;
  architecture: string[];
  stack: string[];
  outcomes: string[];
  repo: string | null;
  demo: string | null;
  demoLabel: string | null;
};

export const CLUSTERS = [
  { key: 'voice', label: 'Voice & telephony' },
  { key: 'retrieval', label: 'Retrieval' },
  { key: 'vision', label: 'Vision & language' },
  { key: 'systems', label: 'Systems' },
] as const;

export const PROJECTS: Project[] = [
  {
    slug: 'bitvoice-pay',
    title: 'BitVoice Pay',
    cluster: 'voice',
    year: '2026',
    kind: 'Voice-first Lightning wallet',
    summary: 'A Bitcoin Lightning wallet you operate entirely through a phone call.',
    metric: { label: 'MIT Bitcoin Hackathon', value: '2nd place' },
    problem:
      'Lightning wallets assume a smartphone, an app store, and a data plan. That excludes people who own only a basic phone.',
    constraint:
      'The entire interface is voice and keypad over a call. No screen, no app, no device-side key storage.',
    architecture: [
      'Inbound call over Twilio Voice; PIN authenticates the caller',
      'Speech-to-text, then an LLM extracts intent (balance, send, receive, history)',
      'LNbits executes the transfer against a real Lightning wallet',
      'WhatsApp delivers the invoice or receipt',
    ],
    stack: ['Python', 'Twilio Voice', 'LNbits', 'OpenAI', 'Railway'],
    outcomes: [
      '2nd place at the MIT Bitcoin Hackathon 2026 (Arc VII)',
      'Internal transfers on the same LNbits node settle with zero routing fees',
      'Every user is issued a real Lightning wallet, not a simulation',
    ],
    repo: 'https://github.com/SandaAbhishekSagar/BitVoice_Pay',
    demo: 'https://www.youtube.com/watch?v=a041bOCJK4k',
    demoLabel: 'Walkthrough video',
  },
  {
    slug: 'northeastern-assistant',
    title: 'Northeastern University Assistant v2.0',
    cluster: 'retrieval',
    year: '2025',
    kind: 'Faculty-sponsored RAG system',
    summary:
      'Retrieval over 80,000+ university pages, answering student questions with a cited source.',
    metric: { label: 'Pages indexed', value: '80,000+' },
    problem:
      'Students could not get straight answers about programs and policy; the information was spread across hundreds of university pages.',
    constraint:
      'An answer without a citation is worse than no answer, so every response has to name the page it came from.',
    architecture: [
      'Scrapy crawls and normalises university pages into a corpus',
      'ChromaDB stores embeddings; queries are expanded into variations',
      'Hybrid retrieval combines semantic and keyword search',
      'FastAPI serves answers with a confidence score and source link',
    ],
    stack: ['Python', 'FastAPI', 'Scrapy', 'ChromaDB', 'OpenAI', 'Ollama'],
    outcomes: [
      "Cited by Northeastern's 2026 Outstanding Master's Student Award for Community Impact",
      'Faculty-sponsored and deployed for student use',
      '80,000+ pages indexed and searchable',
    ],
    repo: 'https://github.com/SandaAbhishekSagar/Northeastern_University_chatbot',
    demo: 'https://northeastern-university-chatbot.vercel.app',
    demoLabel: 'Live',
  },
  {
    slug: 'interview-coach-ivr',
    title: 'AI Interview Coach IVR',
    cluster: 'voice',
    year: '2025',
    kind: 'Telephony interview coaching',
    summary: 'Call a number, run a mock interview, and get scored on how you actually spoke.',
    metric: { label: 'Analysis dimensions', value: '4 per answer' },
    problem:
      'Interview practice tools are text-based, so they never test the thing that fails under pressure: speaking.',
    constraint:
      'Feedback has to arrive inside the call, which caps how long any model call can take.',
    architecture: [
      'Twilio handles the call and speech-to-text',
      'GPT-4 generates follow-up questions from the answer given',
      'MurfAI returns natural speech for the next prompt',
      'Postgres stores sessions and tracks progress across attempts',
    ],
    stack: ['Node.js', 'Express', 'Twilio', 'MurfAI', 'GPT-4', 'Postgres'],
    outcomes: [
      'Scores each answer on speech rate, filler words, confidence and clarity',
      'Tracks improvement across repeat sessions per user',
      'JWT-authenticated REST API over Sequelize',
    ],
    repo: 'https://github.com/SandaAbhishekSagar/AI_Interview_Couch_IVR',
    demo: null,
    demoLabel: null,
  },
  {
    slug: 'wyckoff-trading-assistant',
    title: 'Wyckoff Trading Assistant',
    cluster: 'systems',
    year: '2025',
    kind: 'Transformer market-structure analysis',
    summary:
      'A transformer that labels price action against Richard Wyckoff’s market-phase method.',
    problem:
      'Wyckoff analysis is judgement-heavy and slow: a human reads chart structure phase by phase.',
    constraint:
      'Market phases are sequential and context-dependent, so the model has to see a window, not a candle.',
    metric: { label: 'Method encoded', value: 'Wyckoff phases' },
    architecture: [
      'Sequence windows of OHLCV data built into training examples',
      'Transformer encoder trained to classify market phase',
      'Served behind a web frontend for chart-by-chart inspection',
    ],
    stack: ['Python', 'PyTorch', 'Transformers', 'Vercel'],
    outcomes: [
      'Encodes a discretionary method into a reproducible classifier',
      'Deployed as a live web application',
    ],
    // Prior deployment now returns 404; link removed rather than shipped broken.
    repo: 'https://github.com/SandaAbhishekSagar/Transformer-based-Richard-Wyckoff-Trading-Assistant',
    demo: null,
    demoLabel: null,
  },
  {
    slug: 'manipuri-translator',
    title: 'Manipuri ↔ English Translator',
    cluster: 'vision',
    year: '2026',
    kind: 'Low-resource neural machine translation',
    summary: 'A transformer trained from scratch for a language pair with almost no parallel corpus.',
    metric: { label: 'Evaluation', value: 'BLEU vs. baselines' },
    problem:
      'Manipuri has its own script and very little parallel data, so off-the-shelf translation models do not cover it.',
    constraint:
      'No pretrained checkpoint exists for the pair — the tokenizer and the model both had to be trained from nothing.',
    architecture: [
      'Corpus assembly from the sparse available parallel text',
      'Subword tokenizer trained for the non-Latin script',
      'Encoder-decoder transformer trained from scratch in PyTorch',
      'BLEU evaluation against the baselines that exist',
    ],
    stack: ['PyTorch', 'SentencePiece', 'Jupyter'],
    outcomes: [
      'Working translation for a pair with no pretrained model available',
      'Documented end-to-end in a reproducible notebook',
    ],
    repo: 'https://github.com/SandaAbhishekSagar/Manipuri_language_translator',
    demo: null,
    demoLabel: null,
  },
  {
    slug: 'ai-dynamic-chatbot',
    title: 'AI Dynamic Chatbot',
    cluster: 'retrieval',
    year: '2024',
    kind: 'Conversational assistant · Roli.AI Hackathon winner',
    summary:
      'A configurable chatbot built on the Roli.AI runtime, wiring conversational state and live model responses into a deployable web client.',
    metric: { label: 'Roli.AI Hackathon', value: 'Winner' },
    problem:
      'Most hackathon chatbots forget the conversation the moment the page reloads, which makes them impossible to demo convincingly.',
    constraint:
      'Judging ran on a live shared deployment, so the build had to hold conversational state across sessions without a backend of its own.',
    architecture: [
      'Roli.AI hosted runtime handles model calls and persists conversation state server-side.',
      'A JavaScript web client renders the thread and streams responses as they arrive.',
      'Deployed straight from StackBlitz so judges could open and use it without a local setup.',
    ],
    stack: ['JavaScript', 'Roli.AI runtime', 'StackBlitz'],
    outcomes: ['Won the Roli.AI Hackathon.'],
    repo: 'https://github.com/SandaAbhishekSagar/AI_dynamic-chatbot',
    demo: null,
    demoLabel: null,
  },
];

/* ──────────────────────────────────────────────────────────────── skills ── */

export type Skill = {
  name: string;
  group: string;
  /** what he does with it — not a proficiency bar */
  use: string;
  /** the role or project that proves it */
  proof: string;
  proofHref: string;
  /**
   * Measured share of his public GitHub code, where directly measurable.
   * Computed from the GitHub languages API across all 28 public repositories
   * (22,103,339 bytes total) — evidence, not self-assessment.
   */
  share?: string;
};

/** Twelve maximum. Each attached to something verifiable. */
export const SKILLS: Skill[] = [
  {
    name: 'TypeScript / Next.js',
    group: 'Product surfaces',
    use: 'Product surfaces and internal dashboards around AI systems.',
    proof: 'AutoAce ticketing',
    proofHref: '#trajectory',
    share: '52.1% of public code',
  },
  {
    name: 'Jupyter / research',
    group: 'Models & training',
    use: 'Corpus assembly, training runs, and BLEU evaluation notebooks.',
    proof: 'Manipuri translator',
    proofHref: '/work/manipuri-translator',
    share: '20.4% of public code',
  },
  {
    name: 'PyTorch',
    group: 'Models & training',
    use: 'Trains transformers from scratch when no pretrained checkpoint exists.',
    proof: 'Manipuri translator',
    proofHref: '/work/manipuri-translator',
  },
  {
    name: 'TensorRT',
    group: 'Models & training',
    use: 'Inference optimization; co-authored work presented at MIT IMPACT 2025.',
    proof: 'MIT IMPACT Symposium',
    proofHref: '#recognition',
  },
  {
    name: 'ChromaDB',
    group: 'Retrieval & serving',
    use: 'Vector store behind an 80,000-page retrieval index.',
    proof: 'Northeastern Assistant',
    proofHref: '/work/northeastern-assistant',
  },
  {
    name: 'FastAPI',
    group: 'Retrieval & serving',
    use: 'Serves retrieval answers with confidence scores and source links.',
    proof: 'Northeastern Assistant',
    proofHref: '/work/northeastern-assistant',
  },

  {
    name: 'LiveKit',
    group: 'Voice & telephony',
    use: 'Real-time call routing with failover safeguards under load.',
    proof: 'AutoAce',
    proofHref: '#trajectory',
  },
  {
    name: 'Twilio Voice',
    group: 'Voice & telephony',
    use: 'Carries inbound calls into agent logic and back out as speech.',
    proof: 'BitVoice Pay',
    proofHref: '/work/bitvoice-pay',
  },
  {
    name: 'Python',
    group: 'Backend',
    use: 'Primary language for agents, retrieval services, and training code.',
    proof: 'BitVoice Pay',
    proofHref: '/work/bitvoice-pay',
    share: '12.0% of public code',
  },
  {
    name: '.NET / C#',
    group: 'Backend',
    use: 'Enterprise services delivered on a Fortune 30 health-insurance engagement.',
    proof: 'Elevance Health',
    proofHref: '#trajectory',
  },
  {
    name: 'Postgres / Supabase',
    group: 'Infrastructure',
    use: 'Persistence, auth, and row-level isolation for multi-user tools.',
    proof: 'AI Interview Coach IVR',
    proofHref: '/work/interview-coach-ivr',
  },
  {
    name: 'Docker / CUDA',
    group: 'Infrastructure',
    use: 'GPU-accelerated embedding services with automatic CPU fallback.',
    proof: 'Northeastern Assistant',
    proofHref: '/work/northeastern-assistant',
  },
];

export const SKILL_GROUPS = [
  'Product surfaces',
  'Models & training',
  'Retrieval & serving',
  'Voice & telephony',
  'Backend',
  'Infrastructure',
];

export const getProject = (slug: string) => PROJECTS.find((p) => p.slug === slug);
