import { Link } from 'react-router';
import { config } from '../data/config';
import { education, experience } from '../data/experience';
import { clientProjects, projectBySlug, projects, TRACK_LABELS } from '../data/projects';
import type { Project } from '../data/types';
import { openResume } from '../components/CommandPalette';
import { Icon } from '../components/Icon';
import { ModuleHead, PageLevel, StatusBadge } from '../components/Primitives';
import { caseStudyPath } from '../components/ProjectCard';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { usePointerFx } from '../hooks/usePointerFx';
import { useReveal } from '../hooks/useReveal';
import { cn } from '../utils/cn';

const FOCUS = ['AI Applications', 'Full Stack', 'SaaS Platforms', 'Healthcare', 'Education', 'Business Software'];

/** The four home-page tiles, in bento order. */
const SELECTED: { slug: string; tone: 'pink' | 'paper' | 'dark'; span: 'wide' | 'narrow' }[] = [
  { slug: 'arun-dental', tone: 'pink', span: 'wide' },
  { slug: 'salon-management-system', tone: 'paper', span: 'narrow' },
  { slug: 'student-management-system', tone: 'dark', span: 'narrow' },
  { slug: 'onetowncity', tone: 'dark', span: 'wide' },
];

function Hero() {
  const reveal = useReveal<HTMLDivElement>();
  return (
    <section className="home-hero" aria-labelledby="home-title">
      <div className="container">
        <div className="hero2">
          <div className="hero2__text">
            <StatusBadge />
            <p className="hero2__hello">
              Hi, I’m <strong>{config.name}</strong>
            </p>
            <h1 className="home-hero__title" id="home-title">
              Software that works <em>beyond</em> the screen.
            </h1>
            <blockquote className="hero2__quote">
              <p>“Curious enough to start, disciplined enough to ship.”</p>
            </blockquote>
            <p className="home-hero__lede">
              I design and build complete products — AI applications, SaaS platforms and software for hospitals, schools
              and businesses.
            </p>
            <div className="home-hero__ctas">
              <Link to="/work" viewTransition className="btn btn--primary btn--lg">
                See my work <Icon name="arrowRight" size={18} />
              </Link>
              <Link to="/contact" viewTransition className="btn btn--ghost btn--lg">
                Let’s build something
              </Link>
            </div>
            <div className="home-hero__links">
              {config.githubUrl && (
                <a href={config.githubUrl} target="_blank" rel="noopener noreferrer">
                  <Icon name="github" size={16} /> GitHub
                </a>
              )}
              {config.linkedinUrl && (
                <a href={config.linkedinUrl} target="_blank" rel="noopener noreferrer">
                  <Icon name="linkedin" size={16} /> LinkedIn
                </a>
              )}
              <button type="button" onClick={openResume}>
                <Icon name="file" size={16} /> Résumé
              </button>
            </div>
          </div>

          {config.portraitUrl && (
            <figure className="hero2__portrait">
              <span className="hero2__block" aria-hidden="true" />
              <picture>
                <source srcSet="/portrait.webp" type="image/webp" />
                <img src={config.portraitUrl} alt={`Portrait of ${config.name}`} width={900} height={1200} fetchPriority="high" />
              </picture>
              <figcaption className="hero2__chip">
                <span className="hero2__chip-dot" aria-hidden="true" />
                Software Engineer · Full Stack
              </figcaption>
              <div className="hero2__float" aria-hidden="true">
                <b>{clientProjects.length}</b>
                <span>client builds shipped</span>
              </div>
            </figure>
          )}
        </div>

        <div ref={reveal}>
          <dl className="bento">
            <div className="bento__card bento__card--paper">
              <dt>projects built across AI, SaaS, healthcare and education</dt>
              <dd>{projects.length}</dd>
            </div>
            <div className="bento__card bento__card--pink">
              <dt>client builds for clinics, schools and businesses</dt>
              <dd>{clientProjects.length}</dd>
            </div>
            <div className="bento__card">
              <dt>internships · AI, ML and full stack</dt>
              <dd>{experience.length}</dd>
            </div>
            <div className="bento__card">
              <dt>
                B.Tech CSE · {education.institution}, {education.start}–{education.end}
              </dt>
              <dd>{education.score}</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}

function Marquee() {
  const row = (hidden: boolean) => (
    <div className="marquee__row" aria-hidden={hidden || undefined}>
      {FOCUS.map((f, i) => (
        <span key={f} className="marquee__item">
          <span className={i % 2 ? 'marquee__serif' : 'marquee__sans'}>{f}</span>
          <span className="marquee__star" aria-hidden="true">
            ✦
          </span>
        </span>
      ))}
    </div>
  );
  return (
    <div className="marquee" role="region" aria-label="What I work on">
      <div className="marquee__track">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}

function Tile({ project, tone, span }: { project: Project; tone: string; span: string }) {
  const fx = usePointerFx<HTMLAnchorElement>({ max: 2 });
  return (
    <Link to={caseStudyPath(project)} viewTransition className={cn('tile fx-card', `tile--${tone}`, `tile--${span}`)} {...fx}>
      <div className="tile__head">
        <div className="tile__text">
          <span className="t-meta tile__meta">
            {TRACK_LABELS[project.track]} · {project.domain}
            {project.year ? ` · ${project.year}` : ''}
          </span>
          <h3 className="tile__title">{project.title}</h3>
          <p className="tile__desc">{project.description}</p>
        </div>
        <span className="tile__arrow" aria-hidden="true">
          <Icon name="arrowUpRight" size={20} />
        </span>
      </div>
      {project.image && (
        <div className="tile__shot">
          <img src={project.image.thumb ?? project.image.src} alt={project.image.alt} width={800} height={500} loading="lazy" decoding="async" />
        </div>
      )}
    </Link>
  );
}

function SelectedWork() {
  return (
    <section className="module" aria-labelledby="selected-title">
      <div className="container">
        <ModuleHead
          label="Selected work"
          title={
            <>
              Products I’ve <em>shipped</em>
            </>
          }
          id="selected-title"
          aside={
            <Link to="/work" viewTransition className="arrow-link">
              All {projects.length} projects <Icon name="arrowRight" size={16} />
            </Link>
          }
        />
        <div className="tiles">
          {SELECTED.map((s) => {
            const p = projectBySlug.get(s.slug);
            return p ? <Tile key={s.slug} project={p} tone={s.tone} span={s.span} /> : null;
          })}
        </div>
      </div>
    </section>
  );
}

function ClientList() {
  return (
    <section className="module" aria-labelledby="clients-title">
      <div className="container clients">
        <div className="clients__head">
          <ModuleHead
            label="Built for clients"
            title={
              <>
                Real software, <em>real users.</em>
              </>
            }
            id="clients-title"
          />
          <p className="t-body">
            Clinics, hospitals, schools and local businesses — built with CraftLanee, each with its own project document.
          </p>
          <Link to="/work?type=client" viewTransition className="arrow-link">
            All client work <Icon name="arrowRight" size={16} />
          </Link>
        </div>
        <ul className="clients__list">
          {clientProjects
            .filter((p) => p.documentUrl)
            .map((p, i) => (
              <li key={p.slug}>
                <Link to={caseStudyPath(p)} viewTransition className="clients__row">
                  <span className="t-meta">{String(i + 1).padStart(2, '0')}</span>
                  <span className="clients__name">{p.title}</span>
                  <span className="t-meta clients__domain">{p.domain}</span>
                  <Icon name="arrowUpRight" size={18} className="clients__icon" />
                </Link>
              </li>
            ))}
        </ul>
      </div>
    </section>
  );
}

export function CtaBand() {
  return (
    <section className="cta-band-wrap" aria-labelledby="cta-title">
      <div className="container">
        <div className="cta-band">
          <h2 className="cta-band__title" id="cta-title">
            Have an idea? <em>Let’s build it.</em>
          </h2>
          <Link to="/contact" viewTransition className="btn btn--dark btn--lg">
            Start a conversation <Icon name="arrowRight" size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  useDocumentMeta(null);
  return (
    <PageLevel.Provider value={2}>
      <Hero />
      <Marquee />
      <SelectedWork />
      <ClientList />
      <CtaBand />
    </PageLevel.Provider>
  );
}
