import { Link } from 'react-router';
import { clientProjects, projects } from '../data/projects';
import { process, services, type ServiceDetail } from '../data/services';
import type { Project } from '../data/types';
import { Icon } from '../components/Icon';
import { caseStudyPath } from '../components/ProjectCard';
import { usePointerFx } from '../hooks/usePointerFx';
import { useReveal } from '../hooks/useReveal';
import { cn } from '../utils/cn';

/** Real projects that back up a service, screenshots first. */
function proofFor(s: ServiceDetail): Project[] {
  const pool = s.proof.length ? projects.filter((p) => p.category.some((c) => s.proof.includes(c))) : clientProjects;
  return pool.filter((p) => p.image).slice(0, 3);
}

function ServiceCard({ service, index }: { service: ServiceDetail; index: number }) {
  const fx = usePointerFx<HTMLElement>({ tilt: false });
  const proof = proofFor(service);
  const featured = index === 0;
  const moreHref = service.filter ? `/work?${service.filter}` : '/contact';

  return (
    <article className={cn('svc fx-card', featured && 'svc--featured', !service.proof.length && 'svc--wide')} {...fx}>
      <div className="svc__top">
        <span className="svc__icon" aria-hidden="true">
          <Icon name={service.icon} size={22} />
        </span>
        <span className="svc__num">{String(index + 1).padStart(2, '0')}</span>
      </div>

      <h3 className="svc__title">{service.title}</h3>
      <p className="svc__summary">{service.summary}</p>

      <ul className="svc__includes">
        {service.includes.map((i) => (
          <li key={i}>
            <Icon name="check" size={14} />
            {i}
          </li>
        ))}
      </ul>

      <div className="svc__foot">
        {proof.length > 0 && (
          <div className="svc__proof">
            <span className="svc__faces">
              {proof.map((p) => (
                <Link key={p.slug} to={caseStudyPath(p)} viewTransition title={p.title} className="svc__face">
                  <img src={p.image!.thumb ?? p.image!.src} alt={p.title} width={80} height={50} loading="lazy" />
                </Link>
              ))}
            </span>
            <span className="svc__proof-text">Real projects</span>
          </div>
        )}
        <Link to={moreHref} viewTransition className="svc__more" aria-label={`${service.title}: ${service.filter ? 'see related projects' : 'start a conversation'}`}>
          {service.filter ? 'See projects' : 'Let’s talk'}
          <Icon name="arrowRight" size={14} />
        </Link>
      </div>
    </article>
  );
}

export function ServicesPage() {
  const revealGrid = useReveal<HTMLDivElement>();
  const revealProcess = useReveal<HTMLOListElement>();
  const domains = new Set(clientProjects.map((p) => p.domain)).size;

  return (
    <>
      <section className="svc-hero" aria-labelledby="svc-title">
        <div className="container svc-hero__grid">
          <div className="svc-hero__text">
            <span className="module-head__index t-meta">
              <span className="module-head__dot" aria-hidden="true" />
              <span>Services</span>
            </span>
            <h1 className="svc-hero__title" id="svc-title">
              Have a software idea? <em>Let’s build it.</em>
            </h1>
            <p className="svc-hero__lede">
              From a first sketch to a deployed product — websites, SaaS platforms, AI features and business software,
              built end to end.
            </p>
            <Link to="/contact" viewTransition className="btn btn--primary btn--lg">
              Start a project <Icon name="arrowRight" size={18} />
            </Link>
          </div>

          <dl className="svc-hero__facts">
            <div>
              <dt>client projects delivered</dt>
              <dd>{clientProjects.length}</dd>
            </div>
            <div>
              <dt>industries — healthcare, education, business</dt>
              <dd>{domains}</dd>
            </div>
            <div>
              <dt>projects built in total, from clinics to classrooms</dt>
              <dd>{projects.length}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="container svc-section" aria-label="Services">
        <div className="svc-grid" ref={revealGrid}>
          {services.map((s, i) => (
            <ServiceCard key={s.id} service={s} index={i} />
          ))}
        </div>
      </section>

      <section className="container svc-section" aria-labelledby="process-title">
        <div className="svc-process__head">
          <span className="module-head__index t-meta">
            <span className="module-head__dot" aria-hidden="true" />
            <span>Process</span>
          </span>
          <h2 className="svc-process__title" id="process-title">
            How we’ll <em>work</em>
          </h2>
        </div>
        <ol className="svc-process" ref={revealProcess}>
          {process.map((step, i) => (
            <li key={step.title} className="svc-step">
              <span className="svc-step__num">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="svc-step__title">{step.title}</h3>
              <p className="svc-step__body">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
