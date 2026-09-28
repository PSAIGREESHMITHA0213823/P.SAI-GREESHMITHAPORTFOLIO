import { CATEGORY_LABELS, TRACK_LABELS } from '../data/projects';
import type { Category, Project, Track } from '../data/types';

export type ExplorerView = 'universe' | 'grid' | 'list';

export interface ExplorerFilters {
  q: string;
  cat: Category[];
  type: 'client' | 'personal' | null;
  tech: string[];
  track: Track | null;
  view: ExplorerView;
  page: number;
}

const CATEGORIES = Object.keys(CATEGORY_LABELS) as Category[];
const TRACKS = Object.keys(TRACK_LABELS) as Track[];
const VIEWS: ExplorerView[] = ['universe', 'grid', 'list'];

const list = (v: string | null) => (v ? v.split(',').map(decodeURIComponent).filter(Boolean) : []);

export function parseFilters(params: URLSearchParams): ExplorerFilters {
  const type = params.get('type');
  const track = params.get('track');
  const view = params.get('view');
  const page = Number(params.get('page'));
  return {
    q: params.get('q') ?? '',
    cat: list(params.get('cat')).filter((c): c is Category => CATEGORIES.includes(c as Category)),
    type: type === 'client' || type === 'personal' ? type : null,
    tech: list(params.get('tech')),
    track: TRACKS.includes(track as Track) ? (track as Track) : null,
    view: VIEWS.includes(view as ExplorerView) ? (view as ExplorerView) : 'grid',
    page: Number.isFinite(page) && page > 0 ? Math.floor(page) : 1,
  };
}

/** Writes explorer keys into `base`, leaving unrelated params (e.g. mode) untouched. */
export function writeFilters(f: ExplorerFilters, base: URLSearchParams): URLSearchParams {
  const p = new URLSearchParams(base);
  const set = (k: string, v: string | null) => (v ? p.set(k, v) : p.delete(k));
  set('q', f.q.trim() || null);
  set('cat', f.cat.length ? f.cat.join(',') : null);
  set('type', f.type);
  set('tech', f.tech.length ? f.tech.map(encodeURIComponent).join(',') : null);
  set('track', f.track);
  set('view', f.view === 'grid' ? null : f.view);
  set('page', f.page > 1 ? String(f.page) : null);
  return p;
}

export const hasActiveFilters = (f: ExplorerFilters) =>
  Boolean(f.q.trim() || f.cat.length || f.type || f.tech.length || f.track);

export function tokenize(q: string): string[] {
  return q
    .toLowerCase()
    .split(/\s+/)
    .map((t) => t.trim())
    .filter(Boolean);
}

function haystack(p: Project): string {
  return [
    p.title,
    p.description ?? '',
    p.domain,
    TRACK_LABELS[p.track],
    p.type,
    ...p.technologies,
    ...p.category.map((c) => CATEGORY_LABELS[c]),
  ]
    .join(' ')
    .toLowerCase();
}

export function matchesQuery(p: Project, q: string): boolean {
  const terms = tokenize(q);
  if (!terms.length) return true;
  const h = haystack(p);
  return terms.every((t) => h.includes(t));
}

export function applyFilters(projects: Project[], f: ExplorerFilters): Project[] {
  return projects.filter(
    (p) =>
      matchesQuery(p, f.q) &&
      (!f.cat.length || f.cat.some((c) => p.category.includes(c))) &&
      (!f.type || p.type === f.type) &&
      (!f.tech.length || f.tech.every((t) => p.technologies.includes(t))) &&
      (!f.track || p.track === f.track),
  );
}
