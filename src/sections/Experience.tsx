import { useRef } from 'react';
import { PLACEHOLDER } from '../data/config';
import { experience } from '../data/experience';
import { Chip, ModuleHead, Placeholder } from '../components/Primitives';
import { useReveal } from '../hooks/useReveal';
import { useScrollProgress } from '../hooks/useScrollProgress';

function Entry({ e, i }: { e: (typeof experience)[number]; i: number }) {
  const reveal = useReveal<HTMLLIElement>();
  return (
    <li className="xp__item" ref={reveal}>
      <span className="xp__marker" aria-hidden="true" />
      <div className="xp__when t-meta">
        <span>{e.year}</span>
        <span>
          {e.mode} · {e.duration}
        </span>
      </div>
      <div className="xp__card">
        <div className="t-meta">EXPERIENCE / {String(i + 1).padStart(2, '0')}</div>
        <h3 className="xp__role">{e.role}</h3>
        <p className="xp__org">{e.organization}</p>
        {e.technologies.length > 0 && (
          <ul className="tech-list" aria-label="Technologies">
            {e.technologies.map((t) => (
              <li key={t}>
                <Chip as="span">{t}</Chip>
              </li>
            ))}
          </ul>
        )}
        {e.details.length ? (
          <ul className="xp__details">
            {e.details.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        ) : (
          <Placeholder label={PLACEHOLDER.details} inline={false} />
        )}
      </div>
    </li>
  );
}

export function Experience() {
  const listRef = useRef<HTMLOListElement>(null);
  const progress = useScrollProgress(listRef, 'enter');

  return (
    <section className="module xp" id="experience" aria-labelledby="xp-title">
      <div className="container">
        <ModuleHead
          index="03"
          label="Experience"
          title={<>Where I’ve <em>worked</em></>}
          id="xp-title"
          aside="Three internships across full stack development and artificial intelligence, all completed remotely."
        />
        <div className="xp__wrap" style={{ '--progress': progress } as React.CSSProperties}>
          <span className="xp__rail" aria-hidden="true">
            <span className="xp__fill" />
          </span>
          <ol className="xp__list" ref={listRef}>
            {experience.map((e, i) => (
              <Entry key={e.id} e={e} i={i} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
