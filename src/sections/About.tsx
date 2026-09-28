import { useState } from 'react';
import { config } from '../data/config';
import { achievements } from '../data/achievements';
import { education, experience, schooling } from '../data/experience';
import { projects } from '../data/projects';
import type { Category } from '../data/types';
import { Icon } from '../components/Icon';
import { ModuleHead } from '../components/Primitives';
import { useGoToSection } from '../hooks/useGoToSection';
import { useReveal } from '../hooks/useReveal';
import { cn } from '../utils/cn';

const DOMAINS: { label: string; cat: Category | null; client?: boolean }[] = [
  { label: 'Full stack development', cat: 'fullstack' },
  { label: 'AI applications', cat: 'ai' },
  { label: 'Web applications', cat: 'web' },
  { label: 'SaaS platforms', cat: 'saas' },
  { label: 'Business systems', cat: 'business' },
  { label: 'Education technology', cat: 'education' },
  { label: 'Healthcare software', cat: 'healthcare' },
  { label: 'Custom client software', cat: null, client: true },
];

interface Milestone {
  year: number;
  title: string;
  org: string;
  kind: 'education' | 'internship' | 'award' | 'role';
  detail: string;
}

function buildJourney(): Milestone[] {
  const list: Milestone[] = [
    ...schooling.map<Milestone>((s) => ({
      year: s.end,
      title: `${s.level} — ${s.score}`,
      org: s.institution,
      kind: 'education',
      detail: `${s.level}, ${s.start}–${s.end}, ${s.score}.`,
    })),
    {
      year: education.start,
      title: 'Started B.Tech',
      org: education.institution,
      kind: 'education',
      detail: `${education.degree}, ${education.start}–${education.end}.`,
    },
    ...achievements
      .filter((a) => a.kind === 'academic')
      .flatMap((a) =>
        a.years.map<Milestone>((y) => ({ year: y, title: a.title, org: education.institution, kind: 'award', detail: `${a.title}, ${y}.` })),
      ),
    ...[...experience].reverse().map<Milestone>((e) => ({
      year: e.year,
      title: e.role,
      org: e.organization,
      kind: 'internship',
      detail: `${e.mode} · ${e.duration}${e.technologies.length ? ` · ${e.technologies.join(', ')}` : ''}`,
    })),
    {
      year: education.end,
      title: `B.Tech — ${education.score}`,
      org: education.institution,
      kind: 'education',
      detail: `${education.degree}, ${education.start}–${education.end}, ${education.score}.`,
    },
  ];
  if (config.currentRole) {
    list.push({
      year: education.end,
      title: config.currentRole.title,
      org: config.currentRole.organization,
      kind: 'role',
      detail: `Current role since ${config.currentRole.since}.`,
    });
  }
  return list;
}

const journey = buildJourney();

function Journey() {
  const [selected, setSelected] = useState(journey.length - 1);
  const m = journey[selected];
  return (
    <div className="journey">
      <div className="journey__head t-meta">
        <span>Journey</span>
        <span>
          {journey[0].year} — {education.end}
        </span>
      </div>
      <ol className="journey__track" aria-label="Journey timeline">
        {journey.map((j, i) => {
          const newYear = i === 0 || journey[i - 1].year !== j.year;
          return (
            <li key={i} className={cn('journey__item', `journey__item--${j.kind}`)}>
              <span className={cn('journey__year t-meta', !newYear && 'is-repeat')}>{j.year}</span>
              <button
                type="button"
                className={cn('journey__node', i === selected && 'is-active')}
                aria-pressed={i === selected}
                onClick={() => setSelected(i)}
              >
                <span className="journey__dot" aria-hidden="true" />
                <span className="journey__title">{j.title}</span>
                <span className="journey__org">{j.org}</span>
              </button>
            </li>
          );
        })}
      </ol>
      <div className="journey__detail" aria-live="polite">
        <span className="t-meta">
          {m.kind === 'role' ? 'Current role' : m.kind} · {m.year}
        </span>
        <p>
          <strong>{m.title}</strong> — {m.org}. {m.detail}
        </p>
      </div>
    </div>
  );
}

export function About() {
  const reveal = useReveal<HTMLDivElement>();
  const go = useGoToSection();
  const count = (d: (typeof DOMAINS)[number]) =>
    projects.filter((p) => (d.client ? p.track === 'client' : d.cat && p.category.includes(d.cat))).length;

  return (
    <section className="module about" id="about" aria-labelledby="about-title">
      <div className="container">
        <div className="about__grid">
          <div className="about__sticky">
            <ModuleHead index="02" label="About" title={<>The engineer <em>behind</em> the products.</>} id="about-title" />
          </div>
          <div className="about__body" ref={reveal}>
            <p className="about__lead">
              I&rsquo;m a software engineer who builds complete products, from the interface and API to the database and the AI
              services behind them.
            </p>
            <p className="t-body">
              My work spans full-stack web applications, AI-powered apps and SaaS platforms, alongside private software built for
              clients in healthcare, education and business. I studied Computer Science &amp; Engineering at {education.institution}{' '}
              ({education.start}–{education.end}, {education.score}) and have completed three internships across full stack
              development and AI / ML.
            </p>

            {config.currentRole && (
              <div className="current-role">
                <span className="t-meta">Current role</span>
                <p>
                  {config.currentRole.title} — {config.currentRole.organization}, since {config.currentRole.since}
                </p>
              </div>
            )}

            <ul className="domains" aria-label="Domains">
              {DOMAINS.map((d, i) => (
                <li key={d.label}>
                  <button
                    type="button"
                    className="domains__row"
                    onClick={() => go('projects', d.client ? '?type=client' : d.cat ? `?cat=${d.cat}` : '')}
                  >
                    <span className="t-meta">{String(i + 1).padStart(2, '0')}</span>
                    <span className="domains__label">{d.label}</span>
                    <span className="domains__count t-meta">{count(d)} projects</span>
                    <Icon name="arrowRight" size={14} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <Journey />
      </div>
    </section>
  );
}
