# Deploying on Netlify (with contact-form emails)

The site has no backend. Contact-form messages go through **Netlify Forms**, which stores each submission and emails it to you.

## 1. Deploy
1. Push this folder to a GitHub repo. Include `public/docs/` (the project PDFs) and `public/media/` (the screenshots). Netlify builds from the repo and can't reach the files on your computer.
2. In Netlify: **Add new site → Import an existing project → GitHub →** pick the repo.
3. Netlify reads `netlify.toml` and fills in the build settings itself (`npm run build`, publish `dist`). Click **Deploy**.

## 2. Turn on form detection (one time)
**Site configuration → Forms → Enable form detection**, then **Deploys → Trigger deploy** once more. After that deploy, a form called **project-inquiry** appears under **Forms**.

## 3. Get submissions by email
**Site configuration → Forms → Form notifications → Add notification → Email notification**
- Event: *New form submission*
- Email: `greeshmithagowd@gmail.com`
- Form: `project-inquiry`

Every inquiry then arrives in your inbox with the visitor's name, email, project type, budget and message. The Netlify dashboard (**Forms → project-inquiry**) keeps a copy of every submission.

## 4. Test it
Open the live site → **Contact** → send a test message. It should show "Inquiry sent." and appear under Forms within seconds, followed by the email.

## Notes
- The free plan includes 100 form submissions a month.
- Spam: the form has a hidden honeypot field (`website`). Bots that fill it are dropped, and Netlify runs its own spam filter too.
- On `localhost` Netlify isn't running, so the form opens a pre-filled email in your mail app instead.
- After deploying, set `siteUrl` in `src/data/config.ts` to your Netlify address (e.g. `https://your-site.netlify.app`) so link previews and the sitemap use it.
