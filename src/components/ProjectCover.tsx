import type { CSSProperties } from 'react';
import type { Project, ResponsiveImage } from '../data/types';
import { cn } from '../utils/cn';

/** Deterministic PRNG so a project's generated cover is stable across renders. */
function seeded(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

export function Picture({ image, className, eager }: { image: ResponsiveImage; className?: string; eager?: boolean }) {
  return (
    <picture className={className}>
      {image.avif && <source srcSet={image.avif} type="image/avif" />}
      {image.webp && <source srcSet={image.webp} type="image/webp" />}
      <img
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
      />
    </picture>
  );
}

/**
 * Project cover. Uses the real image when supplied; otherwise draws a sanitized
 * wireframe (a blueprint of an interface, not a screenshot) so nothing confidential
 * is ever shown and layout never shifts.
 */
export function ProjectCover({
  project,
  index,
  label,
  className,
  vtName,
  eager,
  seedSuffix = '',
}: {
  project: Project;
  index?: number;
  label?: string;
  className?: string;
  vtName?: string;
  eager?: boolean;
  seedSuffix?: string;
}) {
  const style: CSSProperties | undefined = vtName ? { viewTransitionName: vtName } : undefined;

  if (project.image && !seedSuffix) {
    return (
      <div className={cn('cover', className)} style={style}>
        <Picture image={project.image} eager={eager} />
      </div>
    );
  }

  const rand = seeded(project.slug + seedSuffix);
  const W = 320;
  const H = 200;
  const sidebar = rand() > 0.35;
  const sbW = sidebar ? 56 + Math.round(rand() * 20) : 0;
  const x0 = 12 + sbW + (sidebar ? 10 : 0);
  const cols = 2 + Math.floor(rand() * 2);
  const blocks: { x: number; y: number; w: number; h: number; accent: boolean }[] = [];
  let y = 42;
  const innerW = W - x0 - 12;
  // header row
  blocks.push({ x: x0, y, w: innerW * (0.45 + rand() * 0.2), h: 10, accent: false });
  y += 20;
  // stat row
  const gap = 8;
  const cw = (innerW - gap * (cols - 1)) / cols;
  for (let c = 0; c < cols; c++) blocks.push({ x: x0 + c * (cw + gap), y, w: cw, h: 34, accent: c === 0 && rand() > 0.4 });
  y += 42;
  // content
  const split = 0.5 + rand() * 0.2;
  blocks.push({ x: x0, y, w: innerW * split - gap / 2, h: H - y - 12, accent: false });
  blocks.push({ x: x0 + innerW * split + gap / 2, y, w: innerW * (1 - split) - gap / 2, h: H - y - 12, accent: false });
  const chartPts = Array.from({ length: 7 }, (_, i) => {
    const bx = blocks[blocks.length - 2];
    return `${bx.x + 8 + (i * (bx.w - 16)) / 6},${bx.y + bx.h - 10 - rand() * (bx.h - 26)}`;
  }).join(' ');
  const tag = label ?? (project.visibility === 'private' ? 'SANITIZED PREVIEW' : 'SCREENSHOT PENDING');

  return (
    <div className={cn('cover cover--generated', className)} style={style}>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" role="img" aria-label={`${project.title} — ${tag.toLowerCase()}`}>
        <defs>
          <pattern id={`g-${project.slug}${seedSuffix}`} width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M10 0H0V10" fill="none" className="cover__grid" />
          </pattern>
        </defs>
        <rect width={W} height={H} className="cover__bg" />
        <rect width={W} height={H} fill={`url(#g-${project.slug}${seedSuffix})`} />
        {/* window chrome */}
        <rect x="6" y="6" width={W - 12} height={H - 12} rx="6" className="cover__frame" />
        <line x1="6" x2={W - 6} y1="26" y2="26" className="cover__line" />
        {[0, 1, 2].map((i) => (
          <circle key={i} cx={16 + i * 9} cy="16" r="2.4" className="cover__dot" />
        ))}
        {sidebar && (
          <g>
            <rect x="12" y="34" width={sbW} height={H - 46} rx="3" className="cover__block" />
            {Array.from({ length: 5 }, (_, i) => (
              <rect key={i} x="18" y={44 + i * 14} width={sbW - 12 - (i % 2) * 10} height="5" rx="2" className={i === 1 ? 'cover__accent' : 'cover__ink'} />
            ))}
          </g>
        )}
        {blocks.map((b, i) => (
          <rect key={i} x={b.x} y={b.y} width={b.w} height={b.h} rx="3" className={b.accent ? 'cover__block cover__block--accent' : 'cover__block'} />
        ))}
        <polyline points={chartPts} className="cover__chart" />
        {Array.from({ length: 4 }, (_, i) => {
          const b = blocks[blocks.length - 1];
          return <rect key={i} x={b.x + 8} y={b.y + 10 + i * 12} width={b.w - 16 - (i % 3) * 12} height="5" rx="2" className="cover__ink" />;
        })}
      </svg>
      <span className="cover__meta t-meta">
        {index !== undefined && <span>PROJECT / {String(index + 1).padStart(2, '0')}</span>}
        <span>{tag}</span>
      </span>
    </div>
  );
}
