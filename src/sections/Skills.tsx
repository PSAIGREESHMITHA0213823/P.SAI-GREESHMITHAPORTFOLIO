import { useState } from 'react';
import { Link } from 'react-router';
import { experience } from '../data/experience';
import { projectsUsing } from '../data/projects';
import { skillGroups } from '../data/skills';
import { Icon } from '../components/Icon';
import { ModuleHead, Placeholder, PrivateBadge } from '../components/Primitives';
import { caseStudyPath } from '../components/ProjectCard';
import { Sheet } from '../components/Sheet';
import { useIsMobile } from '../hooks/useMediaQuery';
import { usePointerFx } from '../hooks/usePointerFx';
import { cn } from '../utils/cn';

const usage = (tech: string) => ({
  projects: projectsUsing(tech),
  roles: experience.filter((e) => e.technologies.includes(tech)),
});

function TechDrawer({ tech, onClose }: { tech: string | null; onClose: () => void }) {
  const u = tech ? usage(tech) : null;
  const groups = tech ? skillGroups.filter((g) => g.items.includes(tech)).map((g) => g.label) : [];
  return (
    <Sheet open={!!tech} onClose={onClose} title={tech} meta={`STACK / ${groups.join(' · ').toUpperCase()}`} className="tech-drawer">
      {u && (
        <div className="tech-drawer__body">
          <section>
            <h3 className="t-meta">Projects using {tech}</h3>
            {u.projects.length ? (
              <ul className="tech-drawer__list">
                {u.projects.map((p) => (
                  <li key={p.slug}>
                    <Link to={caseStudyPath(p)} viewTransition className="tech-drawer__row" onClick={onClose}>
                      <span>
                        <strong>{p.title}</strong>
                        <span className="t-meta">{p.domain}</span>
                      </span>
                      {p.visibility === 'private' ? <PrivateBadge /> : <Icon name="arrowRight" />}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="t-body">
                No project in the master list is tagged with {tech} yet. <Placeholder label="CONFIRM STACK PER PROJECT" />
              </p>
            )}
          </section>
          {u.roles.length > 0 && (
            <section>
              <h3 className="t-meta">Used in experience</h3>
              <ul className="tech-drawer__list">
                {u.roles.map((r) => (
                  <li key={r.id} className="tech-drawer__row is-static">
                    <span>
                      <strong>{r.role}</strong>
                      <span className="t-meta">
                        {r.organization} · {r.year}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}
    </Sheet>
  );
}

function Group({
  group,
  index,
  hovered,
  onHover,
  onOpen,
}: {
  group: (typeof skillGroups)[number];
  index: number;
  hovered: string | null;
  onHover: (t: string | null) => void;
  onOpen: (t: string) => void;
}) {
  const fx = usePointerFx<HTMLDivElement>({ tilt: false });
  return (
    <div className="eco__group fx-card" {...fx}>
      <div className="eco__group-head t-meta">
        <span>{String(index + 1).padStart(2, '0')}</span>
        <span>{group.label}</span>
        <span>{group.items.length}</span>
      </div>
      <ul className="eco__nodes">
        {group.items.map((t) => {
          const u = usage(t);
          const n = u.projects.length + u.roles.length;
          return (
            <li key={t}>
              <button
                type="button"
                className={cn('eco__node', hovered === t && 'is-linked', n > 0 && 'has-usage')}
                onMouseEnter={() => onHover(t)}
                onMouseLeave={() => onHover(null)}
                onFocus={() => onHover(t)}
                onBlur={() => onHover(null)}
                onClick={() => onOpen(t)}
                aria-haspopup="dialog"
              >
                {t}
                {n > 0 && <span className="eco__count">{n}</span>}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function Skills() {
  const [open, setOpen] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const mobile = useIsMobile();

  return (
    <section className="module eco" id="skills" aria-labelledby="skills-title">
      <div className="container">
        <ModuleHead
          index="04"
          label="Skills"
          title={<>Technology <em>ecosystem</em></>}
          id="skills-title"
          aside="Select any technology to see the projects and roles it was used in. Numbers count confirmed usages only."
        />
        {mobile ? (
          <div className="eco__accordion">
            {skillGroups.map((g, i) => (
              <details key={g.id} className="eco__acc" open={i === 0}>
                <summary>
                  <span className="t-meta">{String(i + 1).padStart(2, '0')}</span>
                  <span className="eco__acc-label">{g.label}</span>
                  <span className="t-meta">{g.items.length}</span>
                  <Icon name="chevronDown" />
                </summary>
                <ul className="eco__nodes">
                  {g.items.map((t) => (
                    <li key={t}>
                      <button type="button" className="eco__node" onClick={() => setOpen(t)} aria-haspopup="dialog">
                        {t}
                      </button>
                    </li>
                  ))}
                </ul>
              </details>
            ))}
          </div>
        ) : (
          <div className="eco__map">
            {skillGroups.map((g, i) => (
              <Group key={g.id} group={g} index={i} hovered={hovered} onHover={setHovered} onOpen={setOpen} />
            ))}
          </div>
        )}
      </div>
      <TechDrawer tech={open} onClose={() => setOpen(null)} />
    </section>
  );
}
