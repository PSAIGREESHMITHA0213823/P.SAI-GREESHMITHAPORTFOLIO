import { certifications } from '../data/certifications';
import { achievements } from '../data/achievements';
import { config } from '../data/config';
import { experience } from '../data/experience';
import { projects } from '../data/projects';

export interface AuditItem {
  file: string;
  field: string;
  note?: string;
}

/** Every owner-supplied value that is still missing, computed from the data files. */
export function auditPlaceholders(): AuditItem[] {
  const out: AuditItem[] = [];
  const cfg = 'src/data/config.ts';
  (['email', 'phone', 'location', 'linkedinUrl', 'githubUrl', 'resumeUrl', 'siteUrl'] as const).forEach((k) => {
    if (!config[k]) out.push({ file: cfg, field: k });
  });
  (Object.keys(config.stats) as (keyof typeof config.stats)[]).forEach((k) => {
    if (config.stats[k] === null) out.push({ file: cfg, field: `stats.${k}`, note: 'Owner-verified number only' });
  });
  out.push({ file: cfg, field: 'timeZone', note: `Currently ${config.timeZone} — confirm` });
  if (!config.currentRole) out.push({ file: cfg, field: 'currentRole', note: 'Optional — leave null if none' });

  for (const e of experience) {
    if (!e.details.length) out.push({ file: 'src/data/experience.ts', field: `${e.organization} → details` });
    if (!e.technologies.length) out.push({ file: 'src/data/experience.ts', field: `${e.organization} → technologies` });
  }

  for (const p of projects) {
    const f = 'src/data/projects.ts';
    const t = p.title;
    if (!p.technologies.length) out.push({ file: f, field: `${t} → technologies` });
    if (p.year === null) out.push({ file: f, field: `${t} → year` });
    if (p.status === null) out.push({ file: f, field: `${t} → status` });
    if (!p.image) out.push({ file: f, field: `${t} → image`, note: p.visibility === 'private' ? 'Sanitized only' : undefined });
    (['problem', 'solution', 'contribution', 'outcome'] as const).forEach((k) => {
      if (!p.caseStudy[k]) out.push({ file: f, field: `${t} → caseStudy.${k}` });
    });
    if (!p.caseStudy.features.length) out.push({ file: f, field: `${t} → features` });
    p.caseStudy.features.filter((x) => !x.confirmed).forEach((x) => out.push({ file: f, field: `${t} → confirm feature “${x.label}”` }));
    if (p.caseStudy.architecture && !p.caseStudy.architecture.confirmed) out.push({ file: f, field: `${t} → confirm architecture` });
    if (p.visibility === 'private' && !p.documentUrl) out.push({ file: f, field: `${t} → documentUrl`, note: 'Sanitized document' });
    if (p.screenshots.some((s) => !s.image)) out.push({ file: f, field: `${t} → screenshots` });
  }

  for (const c of certifications) {
    if (c.year === null) out.push({ file: 'src/data/certifications.ts', field: `${c.name} (${c.organization}) → year` });
  }
  for (const a of achievements) {
    if (!a.years.length) out.push({ file: 'src/data/achievements.ts', field: `${a.title} → year` });
  }
  return out;
}
