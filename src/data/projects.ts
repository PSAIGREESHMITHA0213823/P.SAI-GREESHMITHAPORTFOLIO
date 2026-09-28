import { config } from './config';
import { MEDIA } from './media';
import type { Architecture, CaseStudy, Category, Domain, Project, ResponsiveImage, Track } from './types';

/**
 * PROJECT MASTER LIST — one file drives the explorer, universe, featured rail,
 * client work, experiments index, skills drawer, command palette and case study pages.
 *
 * Integrity rules:
 *  - `technologies` holds only owner-confirmed tech. Empty renders [ CONFIRM STACK ].
 *  - Client projects: visibility 'private', liveUrl null, githubUrl null, no client data.
 *  - `null` text fields render as visible placeholders; never fill them with guesses.
 *  - `category` and `domain` are editorial groupings for filtering; adjust freely.
 */

/* ---------- architecture sketches (role-level, not stack claims) ---------- */

const webArchitecture = (subject: string): Architecture => ({
  confirmed: false,
  nodes: [
    { id: 'client', label: 'Client', meta: 'BROWSER / UI', pos: [0, 0] },
    { id: 'api', label: 'Application API', meta: 'SERVER', pos: [1, 0] },
    { id: 'db', label: 'Database', meta: 'PERSISTENCE', pos: [2, 0] },
    { id: 'admin', label: 'Admin views', meta: 'MANAGEMENT', pos: [1, 1] },
  ],
  edges: [
    ['client', 'api'],
    ['api', 'db'],
    ['admin', 'api'],
  ],
  steps: [
    { nodes: ['client'], title: 'Client', body: `Users of ${subject} interact through the interface.` },
    { nodes: ['api'], title: 'API', body: 'Requests are validated and handled by the application layer.' },
    { nodes: ['db'], title: 'Database', body: 'Records are stored and queried from the database.' },
    { nodes: ['admin'], title: 'Management', body: 'Staff-facing views manage the same data through the API.' },
  ],
});

const mlArchitecture: Architecture = {
  confirmed: false,
  nodes: [
    { id: 'input', label: 'Input data', meta: 'SOURCE', pos: [0, 0] },
    { id: 'prep', label: 'Preprocessing', meta: 'PIPELINE', pos: [1, 0] },
    { id: 'model', label: 'Model', meta: 'INFERENCE', pos: [2, 0] },
    { id: 'out', label: 'Predictions', meta: 'OUTPUT', pos: [2, 1] },
  ],
  edges: [
    ['input', 'prep'],
    ['prep', 'model'],
    ['model', 'out'],
  ],
  steps: [
    { nodes: ['input'], title: 'Input', body: 'Raw data enters the pipeline.' },
    { nodes: ['prep'], title: 'Preprocessing', body: 'Data is cleaned and shaped for the model.' },
    { nodes: ['model'], title: 'Model', body: 'The trained model runs inference.' },
    { nodes: ['out'], title: 'Output', body: 'Results are returned for display or evaluation.' },
  ],
};

/* ---------- helpers ---------- */

interface Seed {
  slug: string;
  title: string;
  track: Track;
  domain: Domain;
  category: Category[];
  description: string | null;
  technologies?: string[];
  featured?: boolean;
  features?: string[];
  unconfirmedFeatures?: string[];
  caseStudy?: Partial<CaseStudy>;
  year?: number;
  status?: string;
  /** Defaults to CraftLanee for client work. */
  builtWith?: string;
  /** Public path under /docs, e.g. '/docs/arun-dental.pdf'. */
  documentUrl?: string;
  /** Personal projects only — client work never links out. */
  liveUrl?: string;
  githubUrl?: string;
}

const GH = 'https://github.com/PSAIGREESHMITHA0213823';

/** Client projects were delivered through CraftLanee (spelling as in the project documents). */
const CLIENT_STUDIO = 'CraftLanee';

function mediaImage(slug: string, i: number, title: string): ResponsiveImage | null {
  const m = MEDIA[slug]?.[i];
  if (!m) return null;
  return {
    src: `/media/${m.base}.jpg`,
    webp: `/media/${m.base}.webp`,
    thumb: `/media/${m.base}-sm.webp`,
    width: m.w,
    height: m.h,
    alt: i === 0 ? `${title} — main screen` : `${title} — screen ${i + 1}`,
  };
}

function project(seed: Seed): Project {
  const isClient = seed.track === 'client';
  const features = [
    ...(seed.features ?? []).map((label) => ({ label, confirmed: true })),
    ...(seed.unconfirmedFeatures ?? []).map((label) => ({ label, confirmed: false })),
  ];
  return {
    id: seed.slug,
    slug: seed.slug,
    title: seed.title,
    category: seed.category,
    type: isClient ? 'client' : 'personal',
    track: seed.track,
    domain: seed.domain,
    description: seed.description,
    technologies: seed.technologies ?? [],
    image: mediaImage(seed.slug, 0, seed.title),
    screenshots: (MEDIA[seed.slug] ?? []).slice(1).map((_, i) => ({
      image: mediaImage(seed.slug, i + 1, seed.title),
      caption: '',
    })),
    caseStudy: {
      overview: seed.description,
      problem: null,
      solution: null,
      contribution: null,
      outcome: null,
      architecture: seed.domain === 'AI' && seed.track === 'experiment' ? mlArchitecture : webArchitecture(seed.title),
      ...seed.caseStudy,
      features,
    },
    documentUrl: seed.documentUrl ?? null,
    liveUrl: isClient ? null : (seed.liveUrl ?? null),
    githubUrl: isClient ? null : (seed.githubUrl ?? null),
    featured: seed.featured ?? false,
    visibility: isClient ? 'private' : 'public',
    year: seed.year ?? null,
    status: seed.status ?? null,
    builtWith: seed.builtWith ?? (isClient ? CLIENT_STUDIO : null),
    linkedinUrl: !isClient && !seed.liveUrl && !seed.githubUrl ? config.linkedinUrl : null,
  };
}

/* ---------- data ---------- */

export const projects: Project[] = [
  // Flagship products
  project({
    slug: 'ai-interview-platform',
    title: 'AI Interview Platform',
    track: 'product',
    domain: 'AI',
    category: ['ai', 'fullstack', 'saas', 'web'],
    featured: true,
    description:
      'An AI-powered interview experience: résumé and job-description analysis, adaptive questions, speech interaction, answer evaluation and a scorecard.',
    features: [
      'Résumé + job description analysis',
      'Adaptive question generation',
      'Speech interaction',
      'Answer evaluation',
      'Candidate scorecard',
    ],
    caseStudy: {
      architecture: {
        confirmed: false,
        nodes: [
          { id: 'ui', label: 'Candidate UI', meta: 'CLIENT', pos: [0, 0] },
          { id: 'api', label: 'Interview API', meta: 'SERVER', pos: [1, 0] },
          { id: 'db', label: 'Sessions & results', meta: 'DATABASE', pos: [1, 1] },
          { id: 'analysis', label: 'Résumé + JD analysis', meta: 'AI SERVICE', pos: [2, 0] },
          { id: 'questions', label: 'Adaptive questions', meta: 'AI SERVICE', pos: [3, 0] },
          { id: 'speech', label: 'Speech interaction', meta: 'VOICE I/O', pos: [0, 1] },
          { id: 'eval', label: 'Evaluation', meta: 'AI SERVICE', pos: [2, 1] },
          { id: 'score', label: 'Scorecard', meta: 'OUTPUT', pos: [3, 1] },
        ],
        edges: [
          ['ui', 'api'],
          ['api', 'analysis'],
          ['analysis', 'questions'],
          ['ui', 'speech'],
          ['speech', 'api'],
          ['api', 'db'],
          ['api', 'eval'],
          ['eval', 'score'],
        ],
        steps: [
          { nodes: ['ui', 'api'], title: 'Candidate → API', body: 'The candidate uploads a résumé and target job description.' },
          { nodes: ['analysis'], title: 'Analysis', body: 'The résumé is analysed against the job description to find what to probe.' },
          { nodes: ['questions'], title: 'Adaptive questions', body: 'Questions are generated from that analysis and adapt as the interview goes on.' },
          { nodes: ['speech'], title: 'Speech', body: 'The candidate answers by voice through the speech layer.' },
          { nodes: ['db', 'eval'], title: 'Evaluation', body: 'Answers are stored and evaluated.' },
          { nodes: ['score'], title: 'Scorecard', body: 'The evaluation is summarised into a scorecard.' },
        ],
      },
    },
  }),
  project({
    slug: 'onetowncity',
    title: 'OneTownCity',
    track: 'product',
    domain: 'SaaS',
    category: ['saas', 'fullstack', 'web', 'business'],
    featured: true,
    year: 2026,
    status: 'Deployment-ready',
    builtWith: CLIENT_STUDIO,
    technologies: ['Python', 'Django', 'PostgreSQL', 'Supabase', 'Bootstrap', 'Google Sign-In', 'Web Push', 'pandas', 'Gunicorn'],
    description:
      'A hyperlocal community platform for Kuppam that brings local businesses, property, jobs, events, news and civic projects together in one place.',
    features: [
      'Six listing types: businesses, property, jobs, events, news and civic projects',
      'Self-service submissions with a review and approval workflow',
      'Five roles, from Super Admin to Content Provider, with a delegated permission matrix',
      '“Near me” GPS search and Google Maps pinning',
      'Likes, comments, reviews, favourites and sharing',
      'In-app and web push notifications',
      'Hindi, Tamil, Telugu and Kannada interface',
      'Excel bulk import/export and a Super Admin analytics dashboard',
    ],
    caseStudy: {
      problem:
        'Residents had no single trusted place to find what is happening in town, and local businesses and organisations had no simple way to list themselves and reach the community.',
      solution:
        'A public directory and discovery experience paired with self-service submissions. Businesses and residents submit their own listings; admins review every submission (draft → pending → approved, rejected or changes requested) before it goes live, keeping the information accurate.',
      outcome:
        'Delivered with a full moderation trail, city-level scoping ready for more towns, and a deployment-ready setup for standard cloud hosts such as Render or Railway.',
      architecture: {
        confirmed: true,
        nodes: [
          { id: 'visitors', label: 'Visitors', meta: 'BROWSE · SEARCH', pos: [0, 0] },
          { id: 'providers', label: 'Content providers', meta: 'SUBMIT LISTINGS', pos: [0, 1] },
          { id: 'app', label: 'Django app', meta: 'DJANGO 5.1 · GUNICORN', pos: [1, 0] },
          { id: 'review', label: 'Approval workflow', meta: 'ADMINS · ROLES', pos: [1, 1] },
          { id: 'db', label: 'PostgreSQL', meta: 'SUPABASE', pos: [2, 0] },
          { id: 'storage', label: 'Photo storage', meta: 'SUPABASE STORAGE', pos: [2, 1] },
          { id: 'push', label: 'Notifications', meta: 'IN-APP · WEB PUSH', pos: [3, 0] },
        ],
        edges: [
          ['visitors', 'app'],
          ['providers', 'review'],
          ['review', 'app'],
          ['app', 'db'],
          ['app', 'storage'],
          ['app', 'push'],
        ],
        steps: [
          { nodes: ['visitors', 'app'], title: 'Discover', body: 'Visitors search the directory by category, keyword or “near me” GPS location.' },
          { nodes: ['providers', 'review'], title: 'Submit & review', body: 'Businesses and residents submit listings; Sub Admins and Content Providers go through a review queue, City Admins publish instantly.' },
          { nodes: ['db', 'storage'], title: 'Store', body: 'Listings live in PostgreSQL on Supabase, with photo galleries in Supabase cloud storage.' },
          { nodes: ['push'], title: 'Notify', body: 'In-app and browser push notifications keep admins and users up to date.' },
        ],
      },
    },
    documentUrl: '/docs/onetowncity.pdf',
  }),
  project({
    slug: 'shnoor-website',
    title: 'SHNOOR International Website',
    track: 'product',
    domain: 'Business',
    category: ['web', 'business'],
    year: 2026,
    status: 'Live',
    builtWith: 'SHNOOR International LLC · Full Stack internship',
    technologies: ['React.js', 'React Router', 'Framer Motion', 'React Hook Form', 'Axios', 'Netlify'],
    liveUrl: 'https://shnoorweb.netlify.app/',
    githubUrl: `${GH}/Correct_Shnoor_Website`,
    description:
      'The company website for SHNOOR International LLC, an IT consulting and global trade firm, built during my full stack internship.',
    features: [
      'Multi-page site: home, about, services, careers, trade and contact',
      'Dedicated pages for each service line, from cloud and AI to export and logistics',
      'Careers section with latest openings',
      'Quote and contact forms with validation',
      'Theme switcher and WhatsApp chat',
      'Scroll animations with Framer Motion',
    ],
    caseStudy: {
      solution:
        'A multi-page React site that presents both sides of the business, IT services and global trade, with a page per service line, a careers section and a quote form for new enquiries.',
    },
  }),
  project({
    slug: 'online-assessment-proctoring',
    title: 'Online Assessment with AI Proctoring',
    track: 'product',
    domain: 'AI',
    category: ['ai', 'education', 'fullstack', 'web'],
    year: 2026,
    technologies: ['React.js', 'Node.js', 'Express', 'PostgreSQL', 'Socket.IO', 'Python', 'Flask', 'YOLOv8', 'OpenCV'],
    // githubUrl held back: backend/.env with DB password and JWT secret is committed publicly.
    description:
      'An online test platform with webcam-based AI proctoring: a Python YOLOv8 service watches the camera feed while students take timed tests.',
    features: [
      'Student and admin areas with JWT authentication',
      'Timed online tests',
      'Webcam proctoring with YOLOv8 object detection (Flask + OpenCV service)',
      'Voice detection during the test',
      'Real-time proctoring events over Socket.IO',
    ],
    caseStudy: {
      architecture: {
        confirmed: true,
        nodes: [
          { id: 'ui', label: 'React app', meta: 'WEBCAM · TIMER', pos: [0, 0] },
          { id: 'api', label: 'Express API', meta: 'AUTH · TESTS', pos: [1, 0] },
          { id: 'db', label: 'PostgreSQL', meta: 'USERS · RESULTS', pos: [2, 0] },
          { id: 'ai', label: 'AI service', meta: 'FLASK · YOLOV8 · OPENCV', pos: [1, 1] },
        ],
        edges: [
          ['ui', 'api'],
          ['api', 'db'],
          ['api', 'ai'],
        ],
        steps: [
          { nodes: ['ui'], title: 'Take the test', body: 'The student starts a timed test with the webcam on.' },
          { nodes: ['api', 'db'], title: 'Record', body: 'The API authenticates the student and stores answers and results.' },
          { nodes: ['ai'], title: 'Proctor', body: 'Frames go to a Python service that runs YOLOv8 object detection.' },
        ],
      },
    },
  }),
  project({
    slug: 'edverse',
    title: 'Edverse',
    track: 'product',
    domain: 'Education',
    category: ['education', 'ai', 'fullstack', 'web'],
    year: 2026,
    technologies: ['React.js', 'Python', 'FastAPI', 'SQLAlchemy', 'PostgreSQL', 'OpenRouter API'],
    // githubUrl held back: backend/.env with an OpenRouter API key is committed publicly.
    description:
      'An AI learning platform that writes practice questions, evaluates students’ answers and tracks progress on a leaderboard.',
    features: [
      'AI-generated questions',
      'AI answer evaluation',
      'Learning chatbot',
      'Progress tracking and leaderboard',
      'Authentication',
    ],
    caseStudy: {
      architecture: {
        confirmed: true,
        nodes: [
          { id: 'ui', label: 'React app', meta: 'STUDENT UI', pos: [0, 0] },
          { id: 'api', label: 'FastAPI', meta: 'ROUTERS · SQLALCHEMY', pos: [1, 0] },
          { id: 'db', label: 'PostgreSQL', meta: 'PROGRESS · LEADERBOARD', pos: [2, 0] },
          { id: 'ai', label: 'LLM services', meta: 'QUESTIONS · EVALUATION · CHAT', pos: [1, 1] },
        ],
        edges: [
          ['ui', 'api'],
          ['api', 'db'],
          ['api', 'ai'],
        ],
        steps: [
          { nodes: ['ui', 'api'], title: 'Practise', body: 'Students request questions and submit answers through the API.' },
          { nodes: ['ai'], title: 'Generate & evaluate', body: 'Question-writer, answer-evaluator and chatbot services call an LLM via OpenRouter.' },
          { nodes: ['db'], title: 'Track', body: 'Scores feed progress tracking and the leaderboard.' },
        ],
      },
    },
  }),
  project({
    slug: 'slot-booking-system',
    title: 'Slot Booking System',
    track: 'product',
    domain: 'Education',
    category: ['education', 'fullstack', 'web'],
    year: 2026,
    status: 'Frontend deployed',
    technologies: ['React.js', 'FullCalendar', 'Node.js', 'Express', 'PostgreSQL'],
    liveUrl: 'https://stellar-starburst-435c68.netlify.app/',
    githubUrl: `${GH}/Slot_booking_system`,
    description:
      'A slot booking system with a student dashboard for booking and an admin command centre for generating and managing time slots.',
    features: [
      'Student dashboard with calendar date selection',
      'Admin command centre with slot stats',
      'Batch-generate 30-minute slots, or use morning/evening templates',
      'Daily and weekly calendar views',
      'Rules: one active booking per student, 1-hour notice to cancel or reschedule',
      'Booked slots hidden from other students',
    ],
    caseStudy: { architecture: webArchitecture('the slot booking system') },
  }),
  project({
    slug: 'virtual-queue-system',
    title: 'Virtual Queue System',
    track: 'product',
    domain: 'Business',
    category: ['business', 'fullstack', 'web'],
    year: 2026,
    status: 'Frontend deployed',
    technologies: ['React.js', 'Recharts', 'Node.js', 'Express', 'PostgreSQL', 'Socket.IO'],
    liveUrl: 'https://wondrous-dolphin-6018bf.netlify.app/',
    // githubUrl held back: backend/.env with DB credentials is committed publicly.
    description:
      'A digital token queue: users generate a token by service type, staff call the next token, and a live display board shows who is being served.',
    features: [
      'Token generation by service type, with priority tokens',
      'Admin dashboard to call next and complete tokens',
      'Live display board: now serving and next token',
      'Real-time updates with Socket.IO',
      'Queue analytics by service type and status',
      'In-app notifications',
    ],
    caseStudy: {
      architecture: {
        confirmed: true,
        nodes: [
          { id: 'user', label: 'User page', meta: 'GENERATE TOKEN', pos: [0, 0] },
          { id: 'admin', label: 'Admin dashboard', meta: 'CALL · COMPLETE', pos: [0, 1] },
          { id: 'api', label: 'Express API', meta: 'SOCKET.IO', pos: [1, 0] },
          { id: 'db', label: 'PostgreSQL', meta: 'TOKENS', pos: [2, 0] },
          { id: 'board', label: 'Display board', meta: 'NOW SERVING', pos: [1, 1] },
        ],
        edges: [
          ['user', 'api'],
          ['admin', 'api'],
          ['api', 'db'],
          ['api', 'board'],
        ],
        steps: [
          { nodes: ['user'], title: 'Join', body: 'A visitor picks a service type and gets a token.' },
          { nodes: ['api', 'db'], title: 'Queue', body: 'The token is stored and ordered, with priority tokens first.' },
          { nodes: ['admin'], title: 'Serve', body: 'Staff call the next token and mark it complete.' },
          { nodes: ['board'], title: 'Display', body: 'Socket.IO pushes the change to the live display board instantly.' },
        ],
      },
    },
  }),

  // Private client work — details from the CraftLanee project documents in public/docs
  project({
    slug: 'arun-dental',
    title: 'Dr. Arun Dental Care',
    track: 'client',
    domain: 'Healthcare',
    category: ['healthcare', 'fullstack', 'web'],
    year: 2026,
    status: 'Live',
    technologies: ['React.js', 'TypeScript', 'Vite', 'Node.js', 'Express', 'PostgreSQL', 'Supabase', 'Prisma', 'Railway', 'Netlify'],
    description:
      'A multilingual clinic website and a complete patient-management platform: online OP booking, a live admin console, digital examination forms and fee tracking.',
    features: [
      'Public site in English, Telugu, Tamil and Kannada',
      'Online OP booking with an instant, unique OP number and printable slip',
      'Live admin dashboard with 15-second auto-refresh and new-booking alerts',
      'Appointment pipeline with sitting counter',
      'Fee, part-payment and dues tracking per OP',
      'Digital examination form with interactive tooth chart, photos and PDF export',
      'Patient records with Excel export',
      'Doctor email alerts and WhatsApp confirmations',
    ],
    caseStudy: {
      problem:
        'A busy dental clinic in Kuppam needed to look as good online as it does in person, make booking easy for patients who speak different languages, and stop juggling paper registers, phone notes and separate payment books.',
      solution:
        'Two connected products: a premium public website patients can use in their own language, and a private admin console. Patients book an OP online and instantly get an OP number; the doctor gets an email alert, and the front desk manages status, sittings, fees, records and examination forms from one screen.',
      outcome:
        'Delivered in September 2026 and running in production: four-language website, online OP booking, admin console, Excel export, and doctor email alerts with WhatsApp confirmations.',
      architecture: {
        confirmed: true,
        nodes: [
          { id: 'users', label: 'Patients & staff', meta: 'PHONE · TABLET · DESKTOP', pos: [0, 0] },
          { id: 'web', label: 'React web app', meta: 'TYPESCRIPT · VITE · NETLIFY', pos: [1, 0] },
          { id: 'api', label: 'REST API', meta: 'NODE · EXPRESS · RAILWAY', pos: [2, 0] },
          { id: 'db', label: 'PostgreSQL', meta: 'SUPABASE · PRISMA', pos: [3, 0] },
          { id: 'files', label: 'Private storage', meta: 'PHOTOS · API-PROXIED', pos: [3, 1] },
          { id: 'mail', label: 'Brevo email', meta: 'NEW-OP ALERT', pos: [2, 1] },
          { id: 'links', label: 'WhatsApp · Maps', meta: 'DEEP LINKS', pos: [1, 1] },
        ],
        edges: [
          ['users', 'web'],
          ['web', 'api'],
          ['api', 'db'],
          ['api', 'files'],
          ['api', 'mail'],
          ['web', 'links'],
        ],
        steps: [
          { nodes: ['users', 'web'], title: 'Submit', body: 'The patient books from the web app, in their own language, over HTTPS.' },
          { nodes: ['api'], title: 'Validate', body: 'The API checks every field with Zod and rate-limits abuse.' },
          { nodes: ['db'], title: 'Number & save', body: 'An OP number is reserved atomically, and the patient and appointment are stored in PostgreSQL.' },
          { nodes: ['mail', 'links'], title: 'Notify', body: 'The doctor is emailed, the dashboard updates live, and the patient can confirm on WhatsApp.' },
          { nodes: ['files'], title: 'Records', body: 'Examination photos live in private storage, served only through the authenticated API.' },
        ],
      },
    },
    documentUrl: '/docs/arun-dental.pdf',
  }),
  project({
    slug: 'brd-gynecologist-hospital',
    title: 'BRD Gynecologist Hospital',
    track: 'client',
    domain: 'Healthcare',
    category: ['healthcare', 'fullstack', 'web'],
    year: 2026,
    status: 'Live',
    technologies: ['React.js', 'TypeScript', 'Vite', 'Tailwind CSS', 'Framer Motion', 'Supabase', 'PostgreSQL', 'Netlify'],
    description:
      'A patient website, online booking with UPI payment and a private staff dashboard for a gynaecology and maternity practice.',
    features: [
      'Story-led homepage with an interactive five-stage pregnancy journey',
      'Five languages with a welcome language picker',
      'Four-step booking that prevents double-booking',
      'Voice dictation for the reason for visit',
      'UPI QR payment with WhatsApp proof and transaction-ID capture',
      'Staff dashboard: overview, appointments, availability, payments, patient records, settings',
      'Digital maternity register',
      'Email alerts to staff and confirmation emails to patients',
    ],
    caseStudy: {
      problem:
        'Bookings were phone-only. The practice needed a warm, trustworthy website patients could use in their own language, a way to book and pay a small fee online, and a single place for the front desk to manage appointments, schedules, payments and maternity records.',
      solution:
        'A mobile-first patient website in five languages, a four-step booking flow built around UPI and WhatsApp (no gateway fees), and a secure six-module staff dashboard. The site talks directly to Supabase, with row-level security so patients can only create bookings and only signed-in staff can read records.',
      outcome:
        'Delivered in September 2026 and running as a live application, with bookings, payments and maternity records managed from the dashboard instead of paper.',
      architecture: {
        confirmed: true,
        nodes: [
          { id: 'site', label: 'Patient website', meta: 'REACT 19 · 5 LANGUAGES', pos: [0, 0] },
          { id: 'admin', label: 'Staff dashboard', meta: 'SIX MODULES', pos: [0, 1] },
          { id: 'db', label: 'PostgreSQL', meta: 'SUPABASE · ROW-LEVEL SECURITY', pos: [1, 0] },
          { id: 'auth', label: 'Staff auth', meta: 'SUPABASE AUTH', pos: [1, 1] },
          { id: 'fn', label: 'Edge functions', meta: 'BOOKING & CONFIRMATION EMAILS', pos: [2, 0] },
          { id: 'int', label: 'UPI · WhatsApp', meta: 'PAYMENT & MESSAGING', pos: [2, 1] },
        ],
        edges: [
          ['site', 'db'],
          ['admin', 'auth'],
          ['auth', 'db'],
          ['db', 'fn'],
          ['site', 'int'],
        ],
        steps: [
          { nodes: ['site'], title: 'Book', body: 'The patient picks a date and a free slot, and describes the visit, by voice if they like.' },
          { nodes: ['int'], title: 'Pay', body: 'They pay the booking fee by UPI QR and share the proof on WhatsApp.' },
          { nodes: ['db'], title: 'Store', body: 'The booking is saved in PostgreSQL; row-level security stops anyone reading other patients’ data.' },
          { nodes: ['fn'], title: 'Alert', body: 'An edge function emails staff about the new booking.' },
          { nodes: ['admin', 'auth'], title: 'Confirm', body: 'Staff sign in, verify the payment and confirm; the patient is emailed automatically.' },
        ],
      },
    },
    documentUrl: '/docs/brd-gynecologist-hospital.pdf',
  }),
  project({
    slug: 'kc-gynecologist-hospitals',
    title: 'KC Hospital · Women’s Care',
    track: 'client',
    domain: 'Healthcare',
    category: ['healthcare', 'fullstack', 'web'],
    year: 2026,
    status: 'Live',
    technologies: ['React.js', 'Vite', 'Python', 'Flask', 'Gunicorn', 'Supabase', 'PostgreSQL', 'Twilio', 'Resend', 'Railway'],
    description:
      'A women’s-care clinic website where patients book a 10-minute consultation slot, pay by UPI and get confirmed, backed by a single admin console.',
    features: [
      'Slot booking with live availability, one patient per slot',
      'UPI QR payment with the exact fee filled in; duplicate references rejected',
      'English, Telugu, Tamil and Kannada, with speech-to-text in the booking form',
      'WhatsApp, SMS and email confirmations to patient and clinic',
      'Admin dashboard with 7/30/90-day trends and a slot calendar',
      'One-click payment verification',
      'Delivery and newborn records with Excel export',
    ],
    caseStudy: {
      problem:
        'Every appointment meant a phone call and a name in a register. Two patients could be promised the same time, no-shows cost consultations, and delivery records lived in paper files. Patients call in three regional languages as well as English.',
      solution:
        'Patients pick an open slot online, day or night, and pay by UPI before the slot is confirmed. The database enforces one booking per slot and each payment reference is counted once. The clinic team runs appointments, payments and patient records from one console.',
      outcome:
        'Built August–September 2026 and live. Launched first, then improved from the clinic’s feedback: UPI payments, admin tools, three more languages, reliability retries and patient delivery records.',
      architecture: {
        confirmed: true,
        nodes: [
          { id: 'web', label: 'Website', meta: 'REACT · VITE · 4 LANGUAGES', pos: [0, 0] },
          { id: 'api', label: 'Booking server', meta: 'FLASK · GUNICORN', pos: [1, 0] },
          { id: 'db', label: 'PostgreSQL', meta: 'SUPABASE · STAFF LOGIN', pos: [2, 0] },
          { id: 'pay', label: 'Payments', meta: 'UPI QR · RAZORPAY-READY', pos: [0, 1] },
          { id: 'msg', label: 'Messaging', meta: 'TWILIO · RESEND', pos: [1, 1] },
          { id: 'admin', label: 'Admin console', meta: 'CLINIC TEAM', pos: [2, 1] },
        ],
        edges: [
          ['web', 'api'],
          ['web', 'pay'],
          ['api', 'db'],
          ['api', 'msg'],
          ['admin', 'api'],
        ],
        steps: [
          { nodes: ['web'], title: 'Choose a slot', body: 'The form only shows times still free for the chosen date.' },
          { nodes: ['pay'], title: 'Pay', body: 'A UPI QR with the exact fee; nothing is saved until the payment reference is submitted.' },
          { nodes: ['api', 'db'], title: 'Book once', body: 'The server writes the booking in one step, one patient per slot, and rejects reused references.' },
          { nodes: ['admin'], title: 'Verify', body: 'The clinic confirms the payment in the admin console.' },
          { nodes: ['msg'], title: 'Notify', body: 'WhatsApp, SMS and email go out separately, so one failure never stops the rest.' },
        ],
      },
    },
    documentUrl: '/docs/kc-gynecologist-hospitals.pdf',
  }),
  project({
    slug: 'bagmech-bengaluru',
    title: 'BagMech Bengaluru',
    track: 'client',
    domain: 'Business',
    category: ['business', 'fullstack', 'web'],
    year: 2026,
    status: 'Live',
    technologies: ['HTML', 'CSS', 'JavaScript', 'Python', 'FastAPI', 'PostgreSQL', 'Supabase', 'SendGrid', 'Twilio', 'Render'],
    description:
      'A doorstep luggage-repair brand site with a GPS-first booking form and a backend that alerts the owner the moment a request comes in.',
    features: [
      'GPS-first booking: every request arrives with coordinates and a Maps link',
      'Coverage map of 16 Bengaluru zones with upfront ETAs',
      'Multi-select repair types with browser and server validation',
      'Instant email (SendGrid) and WhatsApp (Twilio) alerts to the owner',
      'WhatsApp click-to-chat pre-filled with the booking details',
      'Booking API with a five-stage lifecycle',
      'One-switch maintenance mode with a health check',
    ],
    caseStudy: {
      problem:
        'Customers usually find a broken bag the night before a trip. Phone bookings lost details such as vague addresses and unclear repairs, travel times differ across the city, and the owner is out on jobs and needs to see new bookings on the phone right away.',
      solution:
        'A premium brand site whose booking form requires live GPS location, zones with honest ETAs, and a single FastAPI app that serves both the site and the booking API. Bookings are saved first, then alerts go out in the background, so a slow email service never delays the customer and a failed alert never loses a booking.',
      outcome:
        'Built July–August 2026, from first commit to live in six weeks. Delivered in August 2026 with cloud deployment and a run guide.',
      architecture: {
        confirmed: true,
        nodes: [
          { id: 'customer', label: 'Customer', meta: 'BROWSER + GPS', pos: [0, 0] },
          { id: 'app', label: 'FastAPI app', meta: 'SITE + /API · RENDER', pos: [1, 0] },
          { id: 'db', label: 'PostgreSQL', meta: 'SUPABASE · ZONES, BOOKINGS', pos: [2, 0] },
          { id: 'notify', label: 'Background notifier', meta: 'AFTER SAVE', pos: [1, 1] },
          { id: 'email', label: 'SendGrid', meta: 'EMAIL', pos: [2, 1] },
          { id: 'wa', label: 'Twilio', meta: 'WHATSAPP', pos: [0, 1] },
        ],
        edges: [
          ['customer', 'app'],
          ['app', 'db'],
          ['app', 'notify'],
          ['notify', 'email'],
          ['notify', 'wa'],
        ],
        steps: [
          { nodes: ['customer'], title: 'Share location', body: 'The customer shares live GPS, then fills in name, phone, address, zone and repairs.' },
          { nodes: ['app'], title: 'Validate', body: 'The API validates every field with Pydantic, whatever the browser sends.' },
          { nodes: ['db'], title: 'Save', body: 'The booking is written to PostgreSQL as pending, with a unique ID.' },
          { nodes: ['notify', 'email', 'wa'], title: 'Alert the owner', body: 'Email and WhatsApp go out independently in the background, each with a Google Maps link.' },
        ],
      },
    },
    documentUrl: '/docs/bagmech-bengaluru.pdf',
  }),
  project({
    slug: 'salon-management-system',
    title: 'Salon Billing & Management System',
    track: 'client',
    domain: 'Business',
    category: ['business', 'fullstack', 'web'],
    year: 2026,
    status: 'Delivered',
    technologies: ['React.js', 'TypeScript', 'Vite', 'Tailwind CSS', 'Recharts', 'Node.js', 'Express', 'SQLite'],
    description:
      'A point-of-sale and back-office platform for a unisex salon: GST-ready billing, memberships and prepaid wallets, staff performance, inventory, expenses, jewellery rental and reports.',
    features: [
      'POS-speed billing with per-service stylist credit',
      'GST-ready branded invoices: print, PDF, WhatsApp or email',
      'Memberships with member pricing and prepaid wallets',
      'Customer check-in/check-out and internal appointments',
      'Staff performance, inventory with movement log, and expenses',
      'Jewellery rental with deposits kept separate from revenue',
      'Nine report types with date filters and CSV export',
      'Owner and Staff roles enforced on the server',
    ],
    caseStudy: {
      problem:
        'Bills were handwritten or in spreadsheets, GST was worked out by hand, there was no record of which stylist did which service, and memberships, prepaid balances and jewellery rentals were tracked on paper — with no clear daily or monthly picture of sales and expenses.',
      solution:
        'One system for the front desk and the owner: a touch-friendly POS that builds a full bill in seconds, automatic CGST/SGST/IGST invoices, membership and wallet programmes, a jewellery rental workflow, and live dashboards. Information is entered once and flows into invoices, customer history, staff performance and reports.',
      outcome:
        'Delivered with 14 integrated modules, 240+ real salon services pre-loaded with prices, two secure roles and nine report types.',
      architecture: {
        confirmed: true,
        nodes: [
          { id: 'web', label: 'Web app', meta: 'REACT 19 · TAILWIND · RECHARTS', pos: [0, 0] },
          { id: 'api', label: 'API server', meta: 'NODE · EXPRESS · JWT', pos: [1, 0] },
          { id: 'db', label: 'SQLite', meta: 'SINGLE-FILE DATABASE', pos: [2, 0] },
          { id: 'inv', label: 'Invoices', meta: 'PDF · WHATSAPP · EMAIL', pos: [0, 1] },
          { id: 'roles', label: 'Role checks', meta: 'OWNER · STAFF', pos: [1, 1] },
        ],
        edges: [
          ['web', 'api'],
          ['api', 'db'],
          ['api', 'roles'],
          ['web', 'inv'],
        ],
        steps: [
          { nodes: ['web'], title: 'Build the bill', body: 'Staff search a customer, tap services and assign each to a stylist; member prices apply automatically.' },
          { nodes: ['api', 'roles'], title: 'Check the role', body: 'Every request is checked on the server, so staff cannot reach owner data even by calling the API directly.' },
          { nodes: ['db'], title: 'Record once', body: 'One calculation handles subtotal, discount, tax and total; stock and wallet changes keep before-and-after values.' },
          { nodes: ['inv'], title: 'Invoice', body: 'The bill becomes a branded GST invoice to print, download or share.' },
        ],
      },
    },
    documentUrl: '/docs/salon-management-system.pdf',
  }),
  project({
    slug: 'student-management-system',
    title: 'Smart School Management System',
    track: 'client',
    domain: 'Education',
    category: ['education', 'saas', 'fullstack', 'web'],
    year: 2026,
    status: 'In active development',
    technologies: ['React.js', 'TypeScript', 'Vite', 'Tailwind CSS', 'Node.js', 'Express', 'Supabase', 'PostgreSQL', 'Docker', 'Leaflet'],
    description:
      'A cloud-hosted school ERP with nine role-based portals covering academics, attendance, fees, communication and live GPS bus tracking.',
    features: [
      'Nine role-based portals, from Super Admin to Driver',
      'Live GPS transport with ETA and 10-min / 5-min / arrival alerts',
      'Attendance, timetable, homework, exams, report cards and fees',
      'Built-in approval workflows for homework, leave and registrations',
      'In-app, email and browser push notifications',
      'Multi-school platform with isolated data per campus',
      '17 learning games with badges and streaks',
      'English, Hindi, Telugu, Kannada and Tamil; light and dark themes',
    ],
    caseStudy: {
      problem:
        'Schools run on paper registers, fee notebooks, spreadsheets, messaging groups and phone calls to the bus driver. Each works on its own, but together they leave gaps that cost staff time and parents’ trust.',
      solution:
        'One secure web platform where every role signs in to a portal built around their daily work, all drawing on the same school data. Drivers share location from an ordinary phone browser, and parents watch the van approach on a live map.',
      outcome:
        'Version 1.0 product document published September 2026: 9 portals, 20+ modules and 400+ API operations, with automated unit tests for core business logic.',
      architecture: {
        confirmed: true,
        nodes: [
          { id: 'users', label: 'Users', meta: 'DESKTOP · TABLET · PHONE', pos: [0, 0] },
          { id: 'driver', label: 'Driver phone', meta: 'LIVE GPS · ~10 S', pos: [0, 1] },
          { id: 'web', label: 'Web application', meta: 'REACT 19 · LEAFLET MAPS', pos: [1, 0] },
          { id: 'api', label: 'API server', meta: 'EXPRESS · DOCKER · /API/V1', pos: [2, 0] },
          { id: 'data', label: 'Data layer', meta: 'SUPABASE · RLS · REALTIME', pos: [3, 0] },
          { id: 'notify', label: 'Notifications', meta: 'IN-APP · EMAIL · PUSH', pos: [2, 1] },
        ],
        edges: [
          ['users', 'web'],
          ['driver', 'web'],
          ['web', 'api'],
          ['api', 'data'],
          ['api', 'notify'],
        ],
        steps: [
          { nodes: ['users', 'web'], title: 'Sign in', body: 'Each role lands on its own portal; permissions are checked on the server for every request.' },
          { nodes: ['driver'], title: 'Start a trip', body: 'The driver taps Start and shares GPS from a phone browser, with an offline queue.' },
          { nodes: ['api', 'data'], title: 'Track', body: 'Distance and ETA are calculated per stop; row-level security keeps each school’s data isolated.' },
          { nodes: ['notify'], title: 'Alert families', body: 'Parents get 10-minute, 5-minute and arrival alerts, each sent once per child per trip.' },
        ],
      },
    },
    documentUrl: '/docs/student-management-system.pdf',
  }),
  project({
    slug: 'e-learning-platform',
    title: 'E-Learning Platform (LMS)',
    track: 'client',
    domain: 'Education',
    category: ['education', 'ai', 'fullstack', 'web'],
    year: 2026,
    technologies: ['Python', 'Django', 'MySQL', 'Bootstrap', 'JavaScript', 'OpenRouter API', 'Gunicorn'],
    description:
      'A learning management system for students, instructors and administrators, with gamification, PDF certificates and an AI mentor chatbot.',
    features: [
      'Course creation, enrollment, lessons, quizzes and progress tracking',
      'XP, levels, achievements and learning streaks',
      'Skill tracking with AI-suggested learning paths for target job roles',
      'AI Mentor chatbot (OpenRouter · GPT-4o-mini)',
      'Downloadable PDF course-completion certificates',
      'Instructor–student chat with attachments and voice notes',
      'Role-based approval workflow and admin analytics with Excel export',
      'Google OAuth sign-in and an age-adaptive theme',
    ],
    caseStudy: {
      problem: null,
      solution:
        'A Django application split into focused apps — accounts, courses, students, instructors, admin panel, AI mentor, career, messaging — sharing one MySQL database and rendered with server-side templates. It covers the full learning lifecycle from course creation to certification.',
      outcome: null,
      architecture: {
        confirmed: true,
        nodes: [
          { id: 'users', label: 'Students · instructors · admins', meta: 'BROWSER', pos: [0, 0] },
          { id: 'app', label: 'Django apps', meta: 'MVT · GUNICORN · WHITENOISE', pos: [1, 0] },
          { id: 'db', label: 'MySQL', meta: 'DJANGO ORM', pos: [2, 0] },
          { id: 'ai', label: 'AI Mentor', meta: 'OPENROUTER · GPT-4O-MINI', pos: [1, 1] },
          { id: 'auth', label: 'Google OAuth', meta: 'DJANGO-ALLAUTH', pos: [0, 1] },
          { id: 'pdf', label: 'Certificates', meta: 'REPORTLAB PDF', pos: [2, 1] },
        ],
        edges: [
          ['users', 'app'],
          ['auth', 'app'],
          ['app', 'db'],
          ['app', 'ai'],
          ['app', 'pdf'],
        ],
        steps: [
          { nodes: ['users', 'auth'], title: 'Sign in', body: 'Users sign in with email or Google; new instructors and students wait for approval.' },
          { nodes: ['app', 'db'], title: 'Learn', body: 'Role-based dashboards serve courses, lessons, quizzes and progress from MySQL.' },
          { nodes: ['ai'], title: 'Mentor', body: 'The AI Mentor answers roadmap, tool and project questions and suggests learning paths.' },
          { nodes: ['pdf'], title: 'Certify', body: 'Completing a course generates a downloadable PDF certificate.' },
        ],
      },
    },
    documentUrl: '/docs/e-learning-platform.pdf',
  }),
  project({
    slug: 'billing-software',
    title: 'Billing Software',
    track: 'client',
    domain: 'Business',
    category: ['business'],
    description: 'Billing software built for a business client.',
  }),

  // Experiments & technical projects
  project({
    slug: 'object-detection-text-classification',
    title: 'Object Detection & Text Classification',
    track: 'experiment',
    domain: 'AI',
    category: ['ai'],
    technologies: ['TensorFlow'],
    year: 2025,
    description: 'A real-time system for detecting objects and classifying text using TensorFlow and pre-trained models.',
    features: ['Real-time object detection', 'Text classification', 'Pre-trained models'],
  }),
  project({
    slug: 'trafficintelligent',
    title: 'TrafficIntelligent',
    track: 'experiment',
    domain: 'AI',
    category: ['ai'],
    technologies: ['Python', 'Jupyter'],
    githubUrl: `${GH}/TrafficTelligence`,
    year: 2025,
    description:
      'A traffic signal optimization system that detects vehicle density and adjusts green/red light duration using ML.',
    features: ['Vehicle density detection', 'Adaptive green/red signal timing'],
  }),
  project({
    slug: 'dream-dress-boutique',
    title: 'Dream Dress Boutique',
    track: 'experiment',
    domain: 'Business',
    category: ['web', 'business'],
    year: 2025,
    technologies: ['HTML', 'CSS', 'JavaScript'],
    liveUrl: 'https://psaigreeshmitha0213823.github.io/Dream-Dress-Boutique-Webpage/',
    githubUrl: `${GH}/Dream-Dress-Boutique-Webpage`,
    description: 'A responsive online boutique platform.',
  }),
  project({
    slug: 'amma-chethi-vanta',
    title: 'Amma Chethi Vanta',
    track: 'experiment',
    domain: 'Business',
    category: ['web', 'business'],
    year: 2025,
    technologies: ['HTML', 'CSS', 'JavaScript'],
    liveUrl: 'https://psaigreeshmitha0213823.github.io/Food_Webpage/',
    githubUrl: `${GH}/Food_Webpage`,
    description: 'A responsive food-ordering web app with a user-friendly design.',
  }),
  project({
    slug: 'quiz-application',
    title: 'Quiz Application',
    track: 'experiment',
    domain: 'Education',
    category: ['education'],
    technologies: ['Java'],
    year: 2025,
    githubUrl: `${GH}/Quiz_Application`,
    description: 'An interactive quiz system in Core Java using OOP concepts, constructors and multithreading.',
  }),
  project({
    slug: 'know-your-state',
    title: 'Know Your State',
    track: 'experiment',
    domain: 'Education',
    category: ['education'],
    technologies: ['Java'],
    year: 2023,
    description: 'A console-based Java application that displays state details based on user input.',
  }),
  project({
    slug: 'code-verifier',
    title: 'Code Verifier (Plagiarism Checker)',
    track: 'experiment',
    domain: 'AI',
    category: ['ai', 'fullstack', 'web'],
    year: 2026,
    technologies: ['React.js', 'Node.js', 'Express', 'Supabase', 'Groq API', 'OpenRouter API'],
    githubUrl: `${GH}/Plagarisam_Checker`,
    description: 'Checks code line by line and labels it AI-generated, human-written or uncertain, using LLMs via Groq and OpenRouter.',
    features: ['Line-by-line annotation', 'AI-generated / human-written / uncertain labels', 'Language selection'],
  }),
  project({
    slug: 'jdbc-bank-application',
    title: 'JDBC Bank Application',
    track: 'experiment',
    domain: 'Business',
    category: ['business', 'web'],
    year: 2025,
    technologies: ['Java', 'JDBC', 'Servlets', 'JSP', 'Maven'],
    githubUrl: `${GH}/JDBC_BankApplication`,
    description: 'A Java web banking app built with Servlets, JSP and JDBC: create an account, deposit, withdraw and view account details.',
    features: ['Create account', 'Deposit', 'Withdraw', 'Show account'],
  }),
  project({
    slug: 'study-buddy',
    title: 'Study Buddy',
    track: 'experiment',
    domain: 'Education',
    category: ['education', 'web'],
    year: 2025,
    technologies: ['HTML', 'CSS', 'JavaScript'],
    liveUrl: 'https://psaigreeshmitha0213823.github.io/Study_Buddy/',
    githubUrl: `${GH}/Study_Buddy`,
    description: 'A study-together website: “Learn Together, Grow Smarter”.',
  }),
  project({
    slug: 'drum-kit',
    title: 'Drum Kit',
    track: 'experiment',
    domain: 'Web',
    category: ['web'],
    year: 2025,
    technologies: ['HTML', 'CSS', 'JavaScript'],
    liveUrl: 'https://dice-game-25wc.vercel.app/',
    githubUrl: `${GH}/Drum_Game`,
    description: 'A browser drum kit played with the W, A, S, D, J, K and L keys or by clicking the drums.',
  }),
];

/* ---------- derived lookups ---------- */

export const projectBySlug = new Map(projects.map((p) => [p.slug, p]));

export const featuredProjects = projects.filter((p) => p.featured);
export const clientProjects = projects.filter((p) => p.track === 'client');
export const experimentProjects = projects.filter((p) => p.track === 'experiment');

export const CATEGORY_LABELS: Record<Category, string> = {
  ai: 'AI / ML',
  fullstack: 'Full Stack',
  saas: 'SaaS',
  business: 'Business',
  healthcare: 'Healthcare',
  education: 'Education',
  web: 'Web Apps',
};

export const DOMAINS: Domain[] = ['AI', 'Healthcare', 'Education', 'Business', 'SaaS', 'Web'];

export const TRACK_LABELS: Record<Track, string> = {
  product: 'Product build',
  client: 'Client project',
  experiment: 'Experiment',
};

/** Every technology referenced by any project, sorted. */
export const allProjectTechnologies = [...new Set(projects.flatMap((p) => p.technologies))].sort();

export function projectsUsing(tech: string): Project[] {
  const t = tech.toLowerCase();
  return projects.filter((p) => p.technologies.some((x) => x.toLowerCase() === t));
}

export function nextProject(slug: string): Project {
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i + 1) % projects.length];
}
