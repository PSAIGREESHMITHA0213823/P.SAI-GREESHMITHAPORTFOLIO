import { Link } from 'react-router';
import { PLACEHOLDER } from '../data/config';
import { TRACK_LABELS } from '../data/projects';
import type { Project } from '../data/types';
import { usePointerFx } from '../hooks/usePointerFx';
import { cn } from '../utils/cn';
import { Highlight } from '../utils/highlight';
import { Icon } from './Icon';
import { Placeholder, PrivateBadge } from './Primitives';

export const COVER_VT_NAME = 'project-cover';

/**
 * Marks the clicked card's cover as the shared element before React Router
 * starts the view transition to the case study page.
 */
export function markSharedCover(from: HTMLElement) {
  const cover = from.querySelector<HTMLElement>('.cover');
  if (cover) cover.style.viewTransitionName = COVER_VT_NAME;
}

export function caseStudyPath(p: Project) {
  return `/work/${p.slug}`;
}

export function TechList({ project, query = '', max }: { project: Project; query?: string; max?: number }) {
  if (!project.technologies.length) return <Placeholder label={PLACEHOLDER.stack} />;
  const shown = max ? project.technologies.slice(0, max) : project.technologies;
  return (
    <ul className="tech-list" aria-label="Technologies">
      {shown.map((t) => (
        <li key={t} className="chip chip--static">
          <Highlight text={t} query={query} />
        </li>
      ))}
    </ul>
  );
}

export function TypeBadge({ project }: { project: Project }) {
  return project.visibility === 'private' ? (
    <PrivateBadge />
  ) : (
    <span className="badge">{project.type === 'client' ? 'Client' : 'Personal'}</span>
  );
}

/** Real screenshot when there is one; otherwise a clean typographic cover. Never a fake UI. */
export function CardMedia({ project }: { project: Project }) {
  if (project.image) {
    return (
      <div className="cover project-card__media">
        <img
          src={project.image.thumb ?? project.image.src}
          alt={project.image.alt}
          width={800}
          height={500}
          loading="lazy"
          decoding="async"
        />
      </div>
    );
  }
  return (
    <div className="cover project-card__media project-card__type" aria-hidden="true">
      <span className="project-card__type-domain t-meta">{project.track === 'experiment' ? 'Lab project' : 'Product build'}</span>
      <span className="project-card__type-title">{project.domain}</span>
      <span className="project-card__type-stack">{project.technologies.slice(0, 4).join(' · ')}</span>
    </div>
  );
}

export function ProjectCard({
  project,
  index,
  query = '',
  variant = 'grid',
}: {
  project: Project;
  index: number;
  query?: string;
  variant?: 'grid' | 'list';
}) {
  const fx = usePointerFx<HTMLElement>({ max: 3 });
  const to = caseStudyPath(project);
  const cta = project.visibility === 'private' ? 'View Case Study' : 'View Details';

  if (variant === 'list') {
    return (
      <Link
        to={to}
        viewTransition
        className="project-row"
        onClick={(e) => markSharedCover(e.currentTarget)}
      >
        <span className="project-row__index t-meta">{String(index + 1).padStart(2, '0')}</span>
        <span className="project-row__title">
          <Highlight text={project.title} query={query} />
        </span>
        <span className="project-row__domain t-meta">{project.domain}</span>
        <span className="project-row__tech">
          <TechList project={project} query={query} max={3} />
        </span>
        <span className="project-row__type">
          <TypeBadge project={project} />
        </span>
        <Icon name="arrowRight" className="project-row__arrow" />
      </Link>
    );
  }

  return (
    <article className={cn('project-card fx-card')} {...fx}>
      <Link
        to={to}
        viewTransition
        className="project-card__link"
        aria-label={`${project.title} — ${cta}`}
        onClick={(e) => markSharedCover(e.currentTarget.closest('article')!)}
      />
      <CardMedia project={project} />
      <div className="project-card__body">
        <span className="project-card__meta t-meta">
          {TRACK_LABELS[project.track]} · {project.domain}
        </span>
        <h3 className="project-card__title">
          <Highlight text={project.title} query={query} />
        </h3>
        {project.description && (
          <p className="project-card__desc">
            <Highlight text={project.description} query={query} />
          </p>
        )}
        <div className="project-card__foot">
          <span className="project-card__links">
            {project.visibility === 'private' && (
              <span className="project-card__tag">
                <Icon name="lock" size={12} /> Private
              </span>
            )}
            {project.liveUrl && <span className="project-card__tag is-live">Live</span>}
            {project.documentUrl && <span className="project-card__tag">Document</span>}
          </span>
          <span className="project-card__cta">
            {cta}
            <Icon name="arrowRight" size={14} />
          </span>
        </div>
      </div>
    </article>
  );
}
