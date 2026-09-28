# Placeholders the owner must fill

Each item currently shows as a visible `[ PLACEHOLDER ]` on the site. For the live, complete list, open **`/audit`** on the running site.

## Done
- Email, phone, location, LinkedIn, GitHub, résumé link (`src/data/config.ts`)
- Internship summaries, experiment years and descriptions, achievement details, schooling (from the résumé)
- Client project documents: linked from each case study and copied into `public/docs/` by `npm run docs` (also runs before `dev` and `build`)
- "Built with Craftlanee" on client work

## 1. `src/data/config.ts`
- [ ] `siteUrl`: needed for canonical/OG URLs and `sitemap.xml`
- [ ] `formEndpoint`: optional. Without it, the contact form opens a pre-filled email
- [ ] `stats.projects` and `stats.clientProjects`: verified numbers only
- [ ] `timeZone`: currently assumed `Asia/Kolkata`

## 2. `src/data/experience.ts`
- [ ] Technologies used at OneStop and SmartBridge (optional)

## 3. `src/data/projects.ts`
- [x] Client case studies and OneTownCity filled from the CraftLanee project documents
- [ ] **My Contribution** for every client project and OneTownCity. The documents credit CraftLanee, not her personal role
- [ ] E-Learning Platform: problem and outcome (not in its document)
- [ ] Billing Software: is it the same project as the Salon Billing system? If so, delete the entry; if not, add details
- [x] Personal projects linked from GitHub and live deployments (Slot Booking, Virtual Queue, Drum Kit, Study Buddy, Dream Dress, Amma Chethi Vanta, Quiz, TrafficIntelligent, Code Verifier, JDBC Bank)
- [ ] **Rotate the secrets** committed in `backend/.env` of job-posting-platform, Edverse_Project, Online_Assessment and virtual-queue-system-1-, then add their `githubUrl`
- [ ] Deploy the backends for Slot Booking and Virtual Queue. Their live frontends call `http://localhost:5000`
- [ ] AI Interview Platform: which repo or link is it? Stack, year, status
- [ ] Object Detection & Text Classification: repo or link
- [ ] `image` and `screenshots`
- [ ] Confirm or correct the role-level architecture sketches
- [ ] Job Posting Platform: confirm whether "AI features" and "Interview features" exist

## 4. `src/data/certifications.ts`
- [ ] Year for each certification, and `credentialUrl` where a real verification link exists

## 5. `src/data/achievements.ts`
- [ ] Years for the Tech Fest, essay/drawing, TechTalk and paper presentation entries

## 6. `public/`
- [ ] `og-image.png` (1200×630): export `public/og-image.svg` to PNG
