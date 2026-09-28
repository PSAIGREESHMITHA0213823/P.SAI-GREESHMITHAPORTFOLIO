# Content inventory

Everything on the site comes from `src/data/*.ts`. This file records what was supplied, how it's grouped, and what's missing.

## Identity (`src/data/config.ts`)

| Field | Value |
|---|---|
| Name | P.SAI GREESHMITHA |
| Role line | Software Engineer \| Full Stack Developer \| Project Manager |
| Headline | I build real-world software, AI-powered applications, and scalable digital products. |
| Availability | Available for Software Projects |
| Stats | internships: **3** (verified). projects and clientProjects: **not supplied** |

## Education and experience (`src/data/experience.ts`)

- B.Tech, Computer Science & Engineering, Kuppam Engineering College, 2022–2026, 90%
- Shnoor International LLC: Full Stack Development Intern, 2026, virtual, 3 months. React.js, Node.js, PostgreSQL
- OneStop: Artificial Intelligence Intern, 2025, virtual, 2 months
- SmartBridge Educational Services: AI & ML Intern, 2025, virtual, 2 months
- Current role: none supplied, so the block isn't rendered

## Projects (`src/data/projects.ts`)

### Featured product builds (personal, public)

| Project | Domain | Confirmed features | Unconfirmed |
|---|---|---|---|
| AI Interview Platform | AI | Résumé + JD analysis, adaptive questions, speech interaction, evaluation, scorecard | — |
| OneTownCity | SaaS | Businesses, services, education, healthcare, events modules | — |
| Job Posting Platform | SaaS | Job discovery, employer management, candidate workflows | AI features, interview features |

### Private client work (client, private: `liveUrl`/`githubUrl` are always null)

| Project | Domain |
|---|---|
| BagMech Bengaluru (luggage repair booking) | Business |
| Student Management System | Education |
| E-Learning Platform | Education |
| BRD Gynecologist Hospital | Healthcare |
| KC Gynecologist Hospitals | Healthcare |
| Arun Dental | Healthcare |
| Billing Software | Business |

### Experiments and technical projects (personal, public)

| Project | Area | Confirmed tech |
|---|---|---|
| Object Detection & Text Classification | AI / ML | TensorFlow |
| TrafficIntelligent | AI / ML | — |
| Dream Dress Boutique | Web app | — |
| Amma Chethi Vanta | Web app | — |
| Quiz Application | Java | Java |
| Know Your State | Java | Java |

> `domain` and `category` are editorial groupings for filtering, the Universe clusters and visitor modes. They are not factual claims, so adjust them freely.

## Skills (`src/data/skills.ts`)

Languages: Java, Python, JavaScript · Frontend: HTML, CSS, JavaScript, React.js · Backend: Node.js, FastAPI, Django, Java · Databases: MySQL, PostgreSQL, Supabase · AI: Gemini, AI APIs, Speech technologies, AI-powered application development · Tools: Git, GitHub, Docker, Postman, Railway, VS Code.
TypeScript is left out until confirmed.

## Achievements (`src/data/achievements.ts`)

College Topper (2022, 2023, 2024) · Paper presentation, 2nd Prize (Kuppam Engineering College) · Paper presentation (Bargur Engineering College) · TechTalk (Thimmayya Institute, KGF) · Tech Fest competition achievements · Essay Writing and Drawing competitions.

## Certifications (`src/data/certifications.ts`)

Java (Great Learning) · Python (edX) · Java (Udemy) · Workshop on Python Programming (APSSE) · Data Analysis & Decision Making (NPTEL). No years or credential links were supplied.

## Missing information

The live list is at **`/audit`** on the running site, computed from the data files. See `docs/PLACEHOLDER_CHECKLIST.md` for the short version.
