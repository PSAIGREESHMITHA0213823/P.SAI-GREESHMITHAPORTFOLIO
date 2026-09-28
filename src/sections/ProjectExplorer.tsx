import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router';
import { allProjectTechnologies, CATEGORY_LABELS, projects, TRACK_LABELS } from '../data/projects';
import type { Category, Track } from '../data/types';
import { Icon, type IconName } from '../components/Icon';
import { Chip, Kbd, ModuleHead } from '../components/Primitives';
import { ProjectCard } from '../components/ProjectCard';
import { searchFocusRequest } from '../components/Shortcuts';
import { Sheet } from '../components/Sheet';
import { cn } from '../utils/cn';
import {
  applyFilters,
  hasActiveFilters,
  parseFilters,
  writeFilters,
  type ExplorerFilters,
  type ExplorerView,
} from '../utils/filters';
import { ProjectUniverse } from './ProjectUniverse';

/** Universe chips: only technologies that actually connect two or more projects. */
const sharedTechnologies = allProjectTechnologies.filter((t) => projects.filter((p) => p.technologies.includes(t)).length > 1);

const PAGE_SIZE: Record<ExplorerView, number> = { grid: 9, list: 24, universe: Infinity };

const VIEWS: { id: ExplorerView; label: string; icon: IconName }[] = [
  { id: 'universe', label: 'Universe', icon: 'universe' },
  { id: 'grid', label: 'Grid', icon: 'grid' },
  { id: 'list', label: 'List', icon: 'list' },
];

const CHIP_ORDER: (Category | 'client' | 'personal')[] = [
  'ai',
  'fullstack',
  'saas',
  'business',
  'healthcare',
  'education',
  'client',
  'personal',
  'web',
];

function AdvancedFilters({ f, update }: { f: ExplorerFilters; update: (p: Partial<ExplorerFilters>) => void }) {
  return (
    <div className="explorer__advanced">
      <label className="field field--inline">
        <span className="t-meta">Technology</span>
        <select
          value=""
          onChange={(e) => e.target.value && update({ tech: [...new Set([...f.tech, e.target.value])] })}
          aria-label="Add technology filter"
        >
          <option value="">Add technology…</option>
          {allProjectTechnologies
            .filter((t) => !f.tech.includes(t))
            .map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
        </select>
      </label>
      <label className="field field--inline">
        <span className="t-meta">Project type</span>
        <select value={f.track ?? ''} onChange={(e) => update({ track: (e.target.value || null) as Track | null })}>
          <option value="">All types</option>
          {(Object.keys(TRACK_LABELS) as Track[]).map((t) => (
            <option key={t} value={t}>
              {TRACK_LABELS[t]}
            </option>
          ))}
        </select>
      </label>
      {f.tech.map((t) => (
        <button key={t} type="button" className="chip is-active chip--removable" onClick={() => update({ tech: f.tech.filter((x) => x !== t) })}>
          {t}
          <Icon name="close" size={12} />
          <span className="sr-only">Remove {t} filter</span>
        </button>
      ))}
    </div>
  );
}

export function ProjectExplorer() {
  const [params, setParams] = useSearchParams();
  const f = useMemo(() => parseFilters(params), [params]);
  const [sheet, setSheet] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Projects with real screens lead; the sort is stable, so data order holds within each group.
  const results = useMemo(
    () => [...applyFilters(projects, f)].sort((a, b) => Number(!!b.image) - Number(!!a.image)),
    [f],
  );
  const matching = useMemo(() => new Set(results.map((p) => p.slug)), [results]);

  const size = PAGE_SIZE[f.view];
  const pages = Math.max(1, Math.ceil(results.length / size));
  const page = Math.min(f.page, pages);
  const visible = f.view === 'universe' ? results : results.slice((page - 1) * size, page * size);

  const update = (patch: Partial<ExplorerFilters>, opts: { animate?: boolean } = { animate: true }) => {
    const next = { ...f, page: 1, ...patch };
    setParams(writeFilters(next, params), {
      replace: true,
      preventScrollReset: true,
      viewTransition: opts.animate,
    });
  };

  useEffect(() => {
    if (searchFocusRequest.pending) {
      searchFocusRequest.pending = false;
      requestAnimationFrame(() => searchRef.current?.focus());
    }
  }, []);

  const toggleChip = (c: (typeof CHIP_ORDER)[number]) => {
    if (c === 'client' || c === 'personal') update({ type: f.type === c ? null : c });
    else update({ cat: f.cat.includes(c) ? f.cat.filter((x) => x !== c) : [...f.cat, c] });
  };

  const chipCount = (c: (typeof CHIP_ORDER)[number]) =>
    c === 'client' || c === 'personal' ? projects.filter((p) => p.type === c).length : projects.filter((p) => p.category.includes(c)).length;

  const goPage = (n: number) => {
    update({ page: n }, { animate: false });
    topRef.current?.scrollIntoView({ block: 'start' });
  };

  const clearAll = () => update({ q: '', cat: [], type: null, tech: [], track: null });
  const active = hasActiveFilters(f);
  const advancedCount = f.tech.length + (f.track ? 1 : 0);

  return (
    <section className="module explorer" id="projects" aria-labelledby="projects-title">
      <div className="container">
        <ModuleHead
          index="05"
          label="Project Explorer"
          title={<>Things I’ve <em>built</em></>}
          id="projects-title"
          aside="From AI systems and SaaS platforms to healthcare, education, and business applications."
        />

        <div className="explorer__toolbar" ref={topRef}>
          <div className="explorer__search">
            <Icon name="search" size={16} />
            <label htmlFor="project-search" className="sr-only">
              Search projects
            </label>
            <input
              id="project-search"
              ref={searchRef}
              type="search"
              placeholder="Search projects..."
              value={f.q}
              onChange={(e) => update({ q: e.target.value }, { animate: false })}
              autoComplete="off"
              spellCheck={false}
            />
            <Kbd>/</Kbd>
          </div>

          <div className="segmented" role="group" aria-label="View">
            {VIEWS.map((v) => (
              <button
                key={v.id}
                type="button"
                aria-pressed={f.view === v.id}
                className={cn('segmented__opt', f.view === v.id && 'is-active')}
                onClick={() => update({ view: v.id, page: 1 })}
              >
                <Icon name={v.icon} size={14} />
                <span>{v.label}</span>
              </button>
            ))}
          </div>

          <button type="button" className="btn btn--ghost btn--sm explorer__filters-btn" onClick={() => setSheet(true)} aria-haspopup="dialog">
            <Icon name="filter" size={14} />
            Filters{advancedCount ? ` · ${advancedCount}` : ''}
          </button>
        </div>

        <div className="explorer__chips" role="group" aria-label="Filter by category">
          <Chip active={!f.cat.length && !f.type} onClick={() => update({ cat: [], type: null })}>
            All
          </Chip>
          {CHIP_ORDER.map((c) => (
            <Chip
              key={c}
              active={c === 'client' || c === 'personal' ? f.type === c : f.cat.includes(c)}
              onClick={() => toggleChip(c)}
              count={chipCount(c)}
            >
              {c === 'client' ? 'Client' : c === 'personal' ? 'Personal' : CATEGORY_LABELS[c]}
            </Chip>
          ))}
        </div>

        <div className="explorer__desktop-adv">
          <AdvancedFilters f={f} update={update} />
        </div>

        <div className="explorer__status">
          <p className="t-meta" role="status" aria-live="polite">
            {results.length} of {projects.length} projects
            {f.view !== 'universe' && pages > 1 && ` · page ${page} / ${pages}`}
          </p>
          {active && (
            <button type="button" className="link-btn" onClick={clearAll}>
              Clear all
            </button>
          )}
        </div>

        {f.view === 'universe' ? (
          <ProjectUniverse
            all={projects}
            matching={matching}
            techs={sharedTechnologies}
            selectedTech={f.tech[0] ?? null}
            onSelectTech={(t) => update({ tech: t ? [t] : [] })}
          />
        ) : results.length === 0 ? (
          <div className="explorer__empty">
            <p className="t-title">Nothing matches that combination.</p>
            <p className="t-body">Try removing a filter or searching for a domain like “healthcare”.</p>
            <button type="button" className="btn btn--ghost" onClick={clearAll}>
              Clear all filters
            </button>
          </div>
        ) : f.view === 'grid' ? (
          <ul className="explorer__grid">
            {visible.map((p) => (
              <li key={p.slug} style={{ viewTransitionName: `card-${p.slug}` }} className="explorer__cell">
                <ProjectCard project={p} index={projects.indexOf(p)} query={f.q} />
              </li>
            ))}
          </ul>
        ) : (
          <ul className="explorer__list">
            {visible.map((p) => (
              <li key={p.slug} style={{ viewTransitionName: `card-${p.slug}` }}>
                <ProjectCard project={p} index={projects.indexOf(p)} query={f.q} variant="list" />
              </li>
            ))}
          </ul>
        )}

        {f.view !== 'universe' && pages > 1 && (
          <nav className="pager" aria-label="Project pages">
            <button type="button" className="icon-btn" disabled={page === 1} onClick={() => goPage(page - 1)} aria-label="Previous page">
              <Icon name="arrowLeft" />
            </button>
            {Array.from({ length: pages }, (_, i) => (
              <button
                key={i}
                type="button"
                className={cn('pager__num', page === i + 1 && 'is-active')}
                aria-current={page === i + 1 ? 'page' : undefined}
                onClick={() => goPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button type="button" className="icon-btn" disabled={page === pages} onClick={() => goPage(page + 1)} aria-label="Next page">
              <Icon name="arrowRight" />
            </button>
          </nav>
        )}
      </div>

      <Sheet open={sheet} onClose={() => setSheet(false)} placement="bottom" title="Filters" meta={`${results.length} RESULTS`}>
        <div className="filter-sheet">
          <div className="filter-sheet__chips">
            {CHIP_ORDER.map((c) => (
              <Chip key={c} active={c === 'client' || c === 'personal' ? f.type === c : f.cat.includes(c)} onClick={() => toggleChip(c)}>
                {c === 'client' ? 'Client' : c === 'personal' ? 'Personal' : CATEGORY_LABELS[c]}
              </Chip>
            ))}
          </div>
          <AdvancedFilters f={f} update={update} />
          <div className="filter-sheet__foot">
            <button type="button" className="btn btn--ghost" onClick={clearAll}>
              Clear all
            </button>
            <button type="button" className="btn btn--primary" onClick={() => setSheet(false)}>
              Show {results.length} projects
            </button>
          </div>
        </div>
      </Sheet>
    </section>
  );
}
