import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { config } from './src/data/config';
import { education } from './src/data/experience';
import { projects } from './src/data/projects';
import { allSkills } from './src/data/skills';

/**
 * SEO from the same data files the app uses:
 *  - fills %SITE_URL% and the Person JSON-LD in index.html
 *  - emits sitemap.xml and robots.txt at build time
 */
function seo(): Plugin {
  const site = config.siteUrl ?? '';
  const sameAs = [config.githubUrl, config.linkedinUrl].filter(Boolean);
  const person = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: config.name,
    jobTitle: 'Software Engineer',
    description: config.headline,
    ...(site && { url: site }),
    ...(config.email && { email: `mailto:${config.email}` }),
    ...(sameAs.length && { sameAs }),
    alumniOf: { '@type': 'CollegeOrUniversity', name: education.institution },
    knowsAbout: allSkills,
  };

  return {
    name: 'portfolio-seo',
    transformIndexHtml(html) {
      return html
        .replaceAll('%SITE_URL%', site)
        .replace('%PERSON_JSON_LD%', JSON.stringify(person).replace(/</g, '\\u003c'));
    },
    generateBundle() {
      const urls = ['/', '/work', '/about', '/services', '/contact', ...projects.map((p) => `/work/${p.slug}`)];
      if (site) {
        const sitemap =
          `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
          urls.map((u) => `  <url><loc>${site}${u}</loc></url>`).join('\n') +
          `\n</urlset>\n`;
        this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: sitemap });
      } else {
        this.warn('config.siteUrl is null — sitemap.xml skipped and OG URLs are relative. Set it before deploying.');
      }
      const robots = `User-agent: *\nAllow: /\nDisallow: /audit\n${site ? `Sitemap: ${site}/sitemap.xml\n` : ''}`;
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: robots });
    },
  };
}

export default defineConfig({
  plugins: [react(), seo()],
  build: {
    target: 'es2022',
    cssMinify: true,
  },
});
