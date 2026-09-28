import { Link, useParams } from 'react-router';
import { nextProject, projectBySlug, TRACK_LABELS } from '../data/projects';
import type { Project } from '../data/types';
import { Icon } from '../components/Icon';
import { COVER_VT_NAME, caseStudyPath, markSharedCover } from '../components/ProjectCard';
import { Picture } from '../components/ProjectCover';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { useReveal } from '../hooks/useReveal';
import NotFound from './NotFound';

/** Keyed by slug so every hook resets when moving to the next project. */
export default function CaseStudyRoute() {
  const { slug = '' } = useParams();
  return <CaseStudy key={slug} slug={slug} />;
}

function Actions({ project }: { project: Project }) {
  return (
    <div className="pj__actions">
      {project.liveUrl && (
        <a className="btn btn--primary" href={project.liveUrl} target="_blank" rel="noopener noreferrer">
          View live <Icon name="arrowUpRight" size={16} />
        </a>
      )}
      {project.documentUrl && (
        <a className={project.liveUrl ? 'btn btn--ghost' : 'btn btn--primary'} href="#document">
          <Icon name="file" size={16} /> Read project document
        </a>
      )}
      {project.githubUrl && (
        <a className="btn btn--ghost" href={project.githubUrl} target="_blank" rel="noopener noreferrer">
          <Icon name="github" size={16} /> Source code
        </a>
      )}
      {project.linkedinUrl && (
        <a className="btn btn--ghost" href={project.linkedinUrl} target="_blank" rel="noopener noreferrer">
          <Icon name="linkedin" size={16} /> See it on LinkedIn
        </a>
      )}
    </div>
  );
}

function CaseStudy({ slug }: { slug: string }) {
  const project = projectBySlug.get(slug);
  useDocumentMeta(project?.title ?? 'Not found', project?.description);
  const reveal = useReveal<HTMLDivElement>();
  const revealGallery = useReveal<HTMLElement>();

  if (!project) return <NotFound />;

  const cs = project.caseStudy;
  const next = nextProject(project.slug);
  const highlights = cs.features.filter((f) => f.confirmed).slice(0, 6);
  const story = [cs.problem, cs.solution].filter(Boolean) as string[];
  const facts = [
    { label: 'Type', value: TRACK_LABELS[project.track] },
    { label: 'Domain', value: project.domain },
    project.year ? { label: 'Year', value: String(project.year) } : null,
    project.status ? { label: 'Status', value: project.status } : null,
    project.builtWith ? { label: 'Built with', value: project.builtWith } : null,
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <article className="pj">
      <header className="container pj__head">
        <Link to="/work" viewTransition className="back-link">
          <Icon name="arrowLeft" size={14} /> All projects
        </Link>
        <div className="pj__intro">
          <div>
            <p className="pj__eyebrow t-meta">
              {TRACK_LABELS[project.track]} · {project.domain}
              {project.visibility === 'private' && (
                <span className="pj__private">
                  <Icon name="lock" size={11} /> Private client project
                </span>
              )}
            </p>
            <h1 className="pj__title">{project.title}</h1>
          </div>
          <div className="pj__side">
            {project.description && <p className="pj__lede">{project.description}</p>}
            <Actions project={project} />
          </div>
        </div>
      </header>

      {project.image && (
        <figure className="container pj__cover">
          <div className="pj__frame" style={{ viewTransitionName: COVER_VT_NAME }}>
            <Picture image={project.image} eager />
          </div>
        </figure>
      )}

      <div className="container pj__body" ref={reveal}>
        <section className="pj__overview" aria-labelledby="overview-h">
          <h2 className="pj__h2" id="overview-h">
            Overview
          </h2>
          {story.length ? story.map((t) => <p key={t}>{t}</p>) : <p>{project.description}</p>}
          <dl className="pj__facts">
            {facts.map((f) => (
              <div key={f.label}>
                <dt>{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <aside className="pj__aside">
          {highlights.length > 0 && (
            <section aria-labelledby="hl-h">
              <h2 className="pj__h2" id="hl-h">
                Highlights
              </h2>
              <ul className="pj__highlights">
                {highlights.map((f) => (
                  <li key={f.label}>
                    <Icon name="check" size={16} />
                    {f.label}
                  </li>
                ))}
              </ul>
            </section>
          )}
          {project.technologies.length > 0 && (
            <section aria-labelledby="stack-h">
              <h2 className="pj__h2" id="stack-h">
                Stack
              </h2>
              <ul className="pj__stack">
                {project.technologies.map((t) => (
                  <li key={t}>
                    <Link to={{ pathname: '/work', search: `?tech=${encodeURIComponent(t)}` }} className="chip">
                      {t}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </aside>
      </div>

      {project.screenshots.some((s) => s.image) && (
        <section className="container pj__gallery" aria-labelledby="gallery-h" ref={revealGallery}>
          <h2 className="pj__h2" id="gallery-h">
            Screens
          </h2>
          <ul>
            {project.screenshots.map(
              (s, i) =>
                s.image && (
                  <li key={i}>
                    <a href={s.image.src} target="_blank" rel="noopener noreferrer" className="pj__shot" aria-label={`Open ${s.image.alt} full size`}>
                      <Picture image={s.image} />
                    </a>
                  </li>
                ),
            )}
          </ul>
        </section>
      )}

      {project.documentUrl && (
        <section className="container pj__doc" id="document" aria-labelledby="doc-h">
          <div className="pj__doc-head">
            <div>
              <h2 className="pj__h2" id="doc-h">
                Project document
              </h2>
              <p>The full case study — scroll through it here, or open it in a new tab.</p>
            </div>
            <a className="btn btn--ghost" href={project.documentUrl} target="_blank" rel="noopener noreferrer">
              Open full screen <Icon name="arrowUpRight" size={16} />
            </a>
          </div>
          <div className="pj__doc-frame">
            <iframe src={`${project.documentUrl}#view=FitH&toolbar=1`} title={`${project.title} — project document`} loading="lazy" />
          </div>
        </section>
      )}

      <footer className="container pj__next">
        <Link to={caseStudyPath(next)} viewTransition className="pj__next-link" onClick={(e) => markSharedCover(e.currentTarget)}>
          <div>
            <span className="t-meta">Next project</span>
            <span className="pj__next-title">{next.title}</span>
            <span className="pj__next-meta">
              {TRACK_LABELS[next.track]} · {next.domain} <Icon name="arrowRight" size={14} />
            </span>
          </div>
          {next.image && (
            <div className="cover pj__next-thumb">
              <img src={next.image.thumb ?? next.image.src} alt="" loading="lazy" width={800} height={500} />
            </div>
          )}
        </Link>
      </footer>
    </article>
  );
}
