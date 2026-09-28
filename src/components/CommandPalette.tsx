import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { config } from '../data/config';
import { allProjectTechnologies, projects, TRACK_LABELS } from '../data/projects';
import { allSkills } from '../data/skills';
import { useGoToSection } from '../hooks/useGoToSection';
import { copyText } from '../utils/clipboard';
import { cn } from '../utils/cn';
import { Highlight } from '../utils/highlight';
import { tokenize } from '../utils/filters';
import { DESTINATIONS } from '../utils/navigation';
import { useStore } from '../utils/store';
import { toast } from '../utils/toast';
import { closePalette, paletteStore, shortcutsStore } from '../utils/ui';
import { Icon, type IconName } from './Icon';
import { Kbd } from './Primitives';
import { Sheet } from './Sheet';

interface Command {
  id: string;
  group: 'Actions' | 'Navigate' | 'Projects' | 'Technologies';
  label: string;
  hint?: string;
  keywords?: string;
  icon: IconName;
  run: () => void;
}

export function openResume() {
  if (config.resumeUrl) window.open(config.resumeUrl, '_blank', 'noopener');
  else toast('Résumé link not set yet — [ SET IN CONFIG ]');
}

function useCommands(): Command[] {
  const navigate = useNavigate();
  const go = useGoToSection();

  return useMemo(() => {
    const techs = [...new Set([...allProjectTechnologies, ...allSkills])].sort();
    const list: Command[] = [
      { id: 'inquiry', group: 'Actions', label: 'Start an inquiry', keywords: 'contact hire project build', icon: 'send', run: () => go('contact') },
      { id: 'resume', group: 'Actions', label: 'Open résumé', keywords: 'cv resume pdf', icon: 'file', run: openResume },
      {
        id: 'copy-email',
        group: 'Actions',
        label: 'Copy email address',
        keywords: 'mail contact',
        icon: 'copy',
        run: () => (config.email ? copyText(config.email, 'Email copied') : toast('Email not set yet — [ SET IN CONFIG ]')),
      },
      { id: 'universe', group: 'Actions', label: 'Open Project Universe', keywords: 'map graph nodes', icon: 'universe', run: () => go('projects', '?view=universe') },
      { id: 'shortcuts', group: 'Actions', label: 'Keyboard shortcuts', hint: '?', keywords: 'help keys', icon: 'keyboard', run: () => shortcutsStore.set(true) },
      ...DESTINATIONS.map<Command>((s) => ({
        id: `nav-${s.id}`,
        group: 'Navigate',
        label: s.label,
        keywords: 'go jump page section',
        icon: 'arrowRight',
        run: () => go(s.id),
      })),
      ...projects.map<Command>((p) => ({
        id: `p-${p.slug}`,
        group: 'Projects',
        label: p.title,
        hint: `${p.domain} · ${TRACK_LABELS[p.track]}`,
        keywords: `${p.description ?? ''} ${p.technologies.join(' ')} ${p.category.join(' ')}`,
        icon: p.visibility === 'private' ? 'lock' : 'layers',
        run: () => navigate(`/work/${p.slug}`, { viewTransition: true }),
      })),
      ...techs.map<Command>((t) => ({
        id: `t-${t}`,
        group: 'Technologies',
        label: `Filter by ${t}`,
        keywords: 'tech stack skill',
        icon: 'filter',
        run: () => go('projects', `?tech=${encodeURIComponent(t)}`),
      })),
    ];
    return list;
  }, [go, navigate]);
}

const GROUP_ORDER: Command['group'][] = ['Actions', 'Projects', 'Navigate', 'Technologies'];

export function CommandPalette() {
  const open = useStore(paletteStore);
  const commands = useCommands();
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setQuery('');
      setActive(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  const results = useMemo(() => {
    const terms = tokenize(query);
    const hits = terms.length
      ? commands.filter((c) => {
          const h = `${c.label} ${c.hint ?? ''} ${c.keywords ?? ''} ${c.group}`.toLowerCase();
          return terms.every((t) => h.includes(t));
        })
      : commands.filter((c) => c.group !== 'Technologies');
    // Keep empty-query list short and useful.
    return GROUP_ORDER.flatMap((g) => hits.filter((c) => c.group === g).slice(0, terms.length ? 12 : 6));
  }, [commands, query]);

  useEffect(() => setActive(0), [query]);

  useEffect(() => {
    listRef.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  const run = (c: Command) => {
    closePalette();
    // Let the dialog close before scrolling/navigating.
    requestAnimationFrame(() => c.run());
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i) => (results.length ? (i + 1) % results.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => (results.length ? (i - 1 + results.length) % results.length : 0));
    } else if (e.key === 'Home') {
      setActive(0);
    } else if (e.key === 'End') {
      setActive(results.length - 1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const c = results[active];
      if (c) run(c);
    }
  };

  let lastGroup = '';

  return (
    <Sheet open={open} onClose={closePalette} placement="center" className="palette" labelledBy="palette-label">
      <h2 id="palette-label" className="sr-only">
        Command palette
      </h2>
      <div className="palette__search">
        <Icon name="search" size={18} />
        <input
          ref={inputRef}
          className="palette__input"
          placeholder="Search projects, sections, tech, actions…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKeyDown}
          role="combobox"
          aria-expanded="true"
          aria-controls="palette-list"
          aria-activedescendant={results[active] ? `cmd-${results[active].id}` : undefined}
          aria-autocomplete="list"
          autoComplete="off"
          spellCheck={false}
        />
        <Kbd>Esc</Kbd>
      </div>
      <div className="palette__list" id="palette-list" role="listbox" aria-label="Commands" ref={listRef}>
        {results.length === 0 && (
          <p className="palette__empty">
            No results for “{query}”. Try a project name, a technology, or “theme”.
          </p>
        )}
        {results.map((c, i) => {
          const header = c.group !== lastGroup ? c.group : null;
          lastGroup = c.group;
          return (
            <div key={c.id} role="presentation">
              {header && (
                <div className="palette__group t-meta" role="presentation">
                  {header}
                </div>
              )}
              <div
                id={`cmd-${c.id}`}
                role="option"
                aria-selected={i === active}
                data-index={i}
                className={cn('palette__item', i === active && 'is-active')}
                onMouseMove={() => i !== active && setActive(i)}
                onClick={() => run(c)}
              >
                <Icon name={c.icon} />
                <span className="palette__label">
                  <Highlight text={c.label} query={query} />
                </span>
                {c.hint && <span className="palette__hint">{c.hint}</span>}
              </div>
            </div>
          );
        })}
      </div>
      <footer className="palette__foot t-meta">
        <span>
          <Kbd>↑</Kbd>
          <Kbd>↓</Kbd> navigate
        </span>
        <span>
          <Kbd>↵</Kbd> select
        </span>
        <span>
          <Kbd>?</Kbd> shortcuts
        </span>
      </footer>
    </Sheet>
  );
}
