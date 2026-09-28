import { createContext, useContext, type ReactNode } from 'react';
import { config } from '../data/config';
import { cn } from '../utils/cn';
import { Icon } from './Icon';

const SHOW_PLACEHOLDERS = false;

/** Marker for owner-supplied content that is still missing (hidden on the live site). */
export function Placeholder({ label, inline = true }: { label: string; inline?: boolean }) {
  // Visitors never see unfilled markers; the owner tracks them at /audit.
  if (!SHOW_PLACEHOLDERS) return null;
  return (
    <span className={cn('placeholder', !inline && 'placeholder--block')} title="Placeholder — set in the data files">
      [ {label} ]
    </span>
  );
}

/** Renders `value`, or a placeholder when it's null/empty. */
export function Maybe({ value, label, children }: { value: unknown; label: string; children?: ReactNode }) {
  if (value === null || value === undefined || value === '') return <Placeholder label={label} />;
  return <>{children ?? String(value)}</>;
}

export function StatusBadge({ label = config.availability, compact = false }: { label?: string; compact?: boolean }) {
  return (
    <span className={cn('status', compact && 'status--compact')}>
      <span className="status__dot" aria-hidden="true" />
      {label}
    </span>
  );
}

export function PrivateBadge() {
  return (
    <span className="badge badge--private">
      <Icon name="lock" size={12} />
      Private Client Project
    </span>
  );
}

export function Chip({
  children,
  active,
  onClick,
  as = 'button',
  count,
  className,
}: {
  children: ReactNode;
  active?: boolean;
  onClick?: () => void;
  as?: 'button' | 'span';
  count?: number;
  className?: string;
}) {
  if (as === 'span') return <span className={cn('chip', 'chip--static', className)}>{children}</span>;
  return (
    <button type="button" className={cn('chip', active && 'is-active', className)} aria-pressed={active} onClick={onClick}>
      {children}
      {count !== undefined && <span className="chip__count">{count}</span>}
    </button>
  );
}

/** Wrap the section that opens a page so its ModuleHead renders as the page <h1>. */
export const PageLevel = createContext<1 | 2>(2);

/**
 * Section heading: pink eyebrow, heavy display title (an <em> word turns into the
 * italic serif), optional aside. `level={1}` when it is the page's own title.
 */
export function ModuleHead({
  label,
  title,
  aside,
  id,
  level: levelProp,
}: {
  /** Kept for call-site readability; no longer rendered. */
  index?: string;
  label: string;
  title: ReactNode;
  aside?: ReactNode;
  id?: string;
  level?: 1 | 2;
}) {
  const pageLevel = useContext(PageLevel);
  const level = levelProp ?? pageLevel;
  const Heading = level === 1 ? 'h1' : 'h2';
  return (
    <header className={level === 1 ? 'module-head module-head--page' : 'module-head'}>
      <div className="module-head__index t-meta">
        <span className="module-head__dot" aria-hidden="true" />
        <span>{label}</span>
      </div>
      <Heading className="module-head__title t-display" id={id}>
        {title}
      </Heading>
      {aside && <div className="module-head__aside">{aside}</div>}
    </header>
  );
}


export function Kbd({ children }: { children: ReactNode }) {
  return <kbd className="kbd">{children}</kbd>;
}

export const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform);
export const modKey = isMac ? '⌘' : 'Ctrl';
