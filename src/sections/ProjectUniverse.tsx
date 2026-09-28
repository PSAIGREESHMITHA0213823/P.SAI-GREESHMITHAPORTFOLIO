import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import { DOMAINS, TRACK_LABELS } from '../data/projects';
import type { Domain, Project } from '../data/types';
import { Icon } from '../components/Icon';
import { caseStudyPath, markSharedCover, TypeBadge } from '../components/ProjectCard';
import { useIsMobile } from '../hooks/useMediaQuery';
import { cn } from '../utils/cn';

type Pt = { x: number; y: number };

const LAYOUTS: Record<'wide' | 'tall', { w: number; h: number; centers: Record<Domain, Pt> }> = {
  wide: {
    w: 1000,
    h: 620,
    centers: {
      AI: { x: 185, y: 175 },
      SaaS: { x: 490, y: 130 },
      Business: { x: 805, y: 200 },
      Healthcare: { x: 760, y: 480 },
      Education: { x: 250, y: 460 },
      Web: { x: 505, y: 520 },
    },
  },
  tall: {
    w: 600,
    h: 820,
    centers: {
      AI: { x: 165, y: 150 },
      SaaS: { x: 435, y: 190 },
      Business: { x: 440, y: 450 },
      Healthcare: { x: 170, y: 470 },
      Education: { x: 170, y: 700 },
      Web: { x: 450, y: 710 },
    },
  },
};

/**
 * Projects as nodes clustered by domain; edges join projects that share a confirmed technology.
 * Projects that don't match the current filters are dimmed, not removed, so the map stays stable.
 */
export function ProjectUniverse({
  all,
  matching,
  techs,
  selectedTech,
  onSelectTech,
}: {
  all: Project[];
  matching: Set<string>;
  techs: string[];
  selectedTech: string | null;
  onSelectTech: (t: string | null) => void;
}) {
  const mobile = useIsMobile();
  const layout = LAYOUTS[mobile ? 'tall' : 'wide'];
  const [hover, setHover] = useState<string | null>(null);

  const positions = useMemo(() => {
    const map = new Map<string, Pt>();
    for (const d of DOMAINS) {
      const group = all.filter((p) => p.domain === d);
      const c = layout.centers[d];
      const r = group.length > 1 ? 46 + group.length * 9 : 0;
      if (group.length === 1) {
        // A lone project sits below the domain label instead of on top of it.
        map.set(group[0].slug, { x: c.x, y: c.y + 30 });
        continue;
      }
      group.forEach((p, i) => {
        const a = (i / group.length) * Math.PI * 2 - Math.PI / 2;
        map.set(p.slug, { x: c.x + Math.cos(a) * r, y: c.y + Math.sin(a) * r * 0.85 });
      });
    }
    return map;
  }, [all, layout]);

  const edges = useMemo(() => {
    const out: { a: Project; b: Project; techs: string[] }[] = [];
    for (let i = 0; i < all.length; i++)
      for (let j = i + 1; j < all.length; j++) {
        const shared = all[i].technologies.filter((t) => all[j].technologies.includes(t));
        if (shared.length) out.push({ a: all[i], b: all[j], techs: shared });
      }
    return out;
  }, [all]);

  const hovered = hover ? all.find((p) => p.slug === hover) : null;
  const pct = (p: Pt) => ({ left: `${(p.x / layout.w) * 100}%`, top: `${(p.y / layout.h) * 100}%` });

  return (
    <div className="universe">
      <div className="universe__techs" role="group" aria-label="Highlight projects by technology">
        <span className="t-meta">Highlight tech</span>
        <button type="button" className={cn('chip', !selectedTech && 'is-active')} aria-pressed={!selectedTech} onClick={() => onSelectTech(null)}>
          None
        </button>
        {techs.map((t) => (
          <button
            key={t}
            type="button"
            className={cn('chip', selectedTech === t && 'is-active')}
            aria-pressed={selectedTech === t}
            onClick={() => onSelectTech(selectedTech === t ? null : t)}
          >
            {t}
          </button>
        ))}
        <span className="universe__note t-meta">Hover a project or pick a technology to see connections.</span>
      </div>

      <div className="universe__canvas" style={{ aspectRatio: `${layout.w} / ${layout.h}` }}>
        <svg viewBox={`0 0 ${layout.w} ${layout.h}`} className="universe__svg" aria-hidden="true">
          {DOMAINS.map((d) => {
            const c = layout.centers[d];
            const n = all.filter((p) => p.domain === d).length;
            const r = n > 1 ? 46 + n * 9 + 34 : 44;
            return (
              <g key={d} className="universe__cluster">
                <ellipse cx={c.x} cy={c.y} rx={r} ry={r * 0.85} />
                {all
                  .filter((p) => p.domain === d)
                  .map((p) => {
                    const q = positions.get(p.slug)!;
                    return <line key={p.slug} x1={c.x} y1={c.y} x2={q.x} y2={q.y} className="universe__spoke" />;
                  })}
              </g>
            );
          })}
          {/* With real stacks nearly everything shares React/Node/PostgreSQL, so edges are
              drawn only for the selected technology or the hovered project. */}
          {edges.map((e) => {
            const lit =
              (selectedTech && e.techs.includes(selectedTech)) || (hover && (hover === e.a.slug || hover === e.b.slug));
            if (!lit) return null;
            const A = positions.get(e.a.slug)!;
            const B = positions.get(e.b.slug)!;
            const mx = (A.x + B.x) / 2;
            const my = (A.y + B.y) / 2 - 40;
            return (
              <path
                key={`${e.a.slug}-${e.b.slug}`}
                d={`M ${A.x} ${A.y} Q ${mx} ${my} ${B.x} ${B.y}`}
                className={cn('universe__edge', lit && 'is-lit')}
              />
            );
          })}
        </svg>

        {DOMAINS.map((d) => (
          <span key={d} className="universe__domain t-meta" style={pct({ x: layout.centers[d].x, y: layout.centers[d].y })}>
            {d}
          </span>
        ))}

        {all.map((p) => {
          const q = positions.get(p.slug)!;
          const dim = !matching.has(p.slug);
          const lit = selectedTech ? p.technologies.includes(selectedTech) : false;
          return (
            <Link
              key={p.slug}
              to={caseStudyPath(p)}
              viewTransition
              className={cn('universe__node', `is-${p.track}`, dim && 'is-dim', lit && 'is-lit', hover === p.slug && 'is-hover')}
              style={pct(q)}
              onMouseEnter={() => setHover(p.slug)}
              onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(p.slug)}
              onBlur={() => setHover(null)}
              onClick={(e) => markSharedCover(e.currentTarget)}
              aria-label={`${p.title} — ${p.domain}, ${TRACK_LABELS[p.track]}${dim ? ' (filtered out)' : ''}`}
            >
              <span className="universe__dot" />
              {(p.featured || hover === p.slug) && <span className="universe__label">{p.title}</span>}
            </Link>
          );
        })}

        {hovered && (
          <div
            className={cn('universe__preview', positions.get(hovered.slug)!.x > layout.w * 0.6 && 'is-left')}
            style={pct(positions.get(hovered.slug)!)}
            aria-hidden="true"
          >
            <span className="t-meta">
              {hovered.domain} · {TRACK_LABELS[hovered.track]}
            </span>
            <strong>{hovered.title}</strong>
            {hovered.description && <p>{hovered.description}</p>}
            <div className="universe__preview-foot">
              <TypeBadge project={hovered} />
              <span className="t-meta">
                Open <Icon name="arrowRight" size={12} />
              </span>
            </div>
          </div>
        )}
      </div>

      <ul className="universe__legend t-meta" aria-label="Legend">
        <li>
          <span className="universe__key is-product" /> Product build
        </li>
        <li>
          <span className="universe__key is-client" /> Client project
        </li>
        <li>
          <span className="universe__key is-experiment" /> Experiment
        </li>
        <li>
          <span className="universe__key-line" /> Shared technology
        </li>
      </ul>
    </div>
  );
}
