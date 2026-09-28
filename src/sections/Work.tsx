import { Link } from 'react-router';
import { PLACEHOLDER } from '../data/config';
import { achievements } from '../data/achievements';
import { certifications } from '../data/certifications';
import { CATEGORY_LABELS, clientProjects, experimentProjects, projects } from '../data/projects';
import { Icon } from '../components/Icon';
import { ModuleHead, Placeholder } from '../components/Primitives';
import { caseStudyPath, markSharedCover, ProjectCard } from '../components/ProjectCard';
import { useReveal } from '../hooks/useReveal';

export function ClientWork() {
  return (
    <section className="module client" id="client-work" aria-labelledby="client-title">
      <div className="container">
        <ModuleHead
          index="07"
          label="Selected Client Work"
          title={<>Private by <em>design.</em></>}
          id="client-title"
          aside="Real-world software built for organizations and businesses."
        />
        <div className="client__notice">
          <Icon name="lock" size={16} />
          <p>
            Built with CraftLanee. These projects belong to their clients, so live URLs and credentials are never
            shared here. Screens shown are sanitized placeholders; each case study links to its project document.
          </p>
        </div>
        <ul className="client__grid swipe-row" aria-label="Client projects">
          {clientProjects.map((p) => (
            <li key={p.slug} className="swipe-row__item">
              <ProjectCard project={p} index={projects.indexOf(p)} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Experiments() {
  return (
    <section className="module experiments" id="experiments" aria-labelledby="exp-title">
      <div className="container">
        <ModuleHead
          index="08"
          label="Experiments & Technical Projects"
          title={<>The <em>lab</em> index</>}
          id="exp-title"
          aside="Smaller builds, models and experiments. Hover or focus a row for details."
        />
        <div className="terminal">
          <div className="terminal__bar t-meta">
            <span>~/projects/experiments</span>
            <span>{experimentProjects.length} entries</span>
          </div>
          <div className="terminal__cols t-meta" aria-hidden="true">
            <span>#</span>
            <span>Name</span>
            <span>Area</span>
            <span>Stack</span>
          </div>
          <ol className="terminal__list">
            {experimentProjects.map((p, i) => (
              <li key={p.slug}>
                <Link to={caseStudyPath(p)} viewTransition className="terminal__row" onClick={(e) => markSharedCover(e.currentTarget)}>
                  <span className="terminal__num">{String(i + 1).padStart(3, '0')}</span>
                  <span className="terminal__name">{p.title}</span>
                  <span className="terminal__area">{p.category.map((c) => CATEGORY_LABELS[c]).join(' / ')}</span>
                  <span className="terminal__stack">{p.technologies.join(', ') || '—'}</span>
                  <span className="terminal__detail">
                    <span>
                      <span className="terminal__prompt">›</span> {p.description ?? `[ ${PLACEHOLDER.description} ]`}
                      <span className="terminal__open">
                        open case study <Icon name="arrowRight" size={12} />
                      </span>
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

export function Achievements() {
  const reveal = useReveal<HTMLOListElement>();
  const dated = achievements
    .flatMap((a) => a.years.map((y) => ({ year: y as number | null, a })))
    .sort((x, y) => (x.year ?? 0) - (y.year ?? 0));
  const undated = achievements.filter((a) => !a.years.length).map((a) => ({ year: null, a }));
  const groups = new Map<string, typeof dated>();
  for (const e of [...dated, ...undated]) {
    const k = e.year === null ? 'undated' : String(e.year);
    groups.set(k, [...(groups.get(k) ?? []), e]);
  }

  return (
    <section className="module achievements" id="achievements" aria-labelledby="ach-title">
      <div className="container">
        <ModuleHead index="09" label="Achievements" title={<>Awards &amp; <em>recognition</em></>} id="ach-title" />
        <ol className="ach" ref={reveal}>
          {[...groups.entries()].map(([year, items]) => (
            <li key={year} className="ach__year">
              <span className="ach__marker t-meta">{year === 'undated' ? <Placeholder label={PLACEHOLDER.year} /> : year}</span>
              <ul>
                {items.map(({ a }) => (
                  <li key={a.title} className="ach__item">
                    <span className="t-meta">{a.kind}</span>
                    <span className="ach__title">{a.title}</span>
                    {a.detail && <span className="ach__detail">{a.detail}</span>}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Certifications() {
  return (
    <section className="module certs" id="certifications" aria-labelledby="cert-title">
      <div className="container">
        <ModuleHead index="10" label="Certifications" title={<><em>Certified</em> learning</>} id="cert-title" />
        <ul className="certs__wall">
          {certifications.map((c, i) => {
            const body = (
              <>
                <span className="certs__name">{c.name}</span>
                <span className="certs__meta t-meta">
                  {c.organization} · {c.year ?? <Placeholder label={PLACEHOLDER.year} />}
                  {c.credentialUrl && <Icon name="arrowUpRight" size={12} />}
                </span>
              </>
            );
            return (
              <li key={i} className="certs__item">
                {c.credentialUrl ? (
                  <a href={c.credentialUrl} target="_blank" rel="noopener noreferrer" className="certs__entry">
                    {body}
                  </a>
                ) : (
                  <div className="certs__entry">{body}</div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
