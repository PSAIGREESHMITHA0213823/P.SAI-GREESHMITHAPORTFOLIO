import { useEffect, useRef } from 'react';
import { useGoToSection } from '../hooks/useGoToSection';
import { useStore } from '../utils/store';
import type { DestinationId } from '../utils/navigation';
import { paletteStore, shortcutsStore } from '../utils/ui';
import { Kbd, modKey } from './Primitives';
import { Sheet } from './Sheet';

/** Set before navigating home so the explorer focuses its search on mount. */
export const searchFocusRequest = { pending: false };

export function focusProjectSearch(): boolean {
  const input = document.getElementById('project-search') as HTMLInputElement | null;
  if (!input) return false;
  input.focus({ preventScroll: true });
  input.select();
  return true;
}

const GOTO: Record<string, DestinationId> = {
  p: 'projects',
  w: 'projects',
  h: 'top',
  a: 'about',
  e: 'experience',
  s: 'skills',
  v: 'services',
  c: 'contact',
};

export const SHORTCUTS: { keys: string[]; label: string; seq?: boolean }[] = [
  { keys: [modKey, 'K'], label: 'Command palette' },
  { keys: ['/'], label: 'Search projects' },
  { keys: ['G', 'P'], label: 'Go to work', seq: true },
  { keys: ['G', 'A'], label: 'Go to about', seq: true },
  { keys: ['G', 'V'], label: 'Go to services', seq: true },
  { keys: ['G', 'E'], label: 'Go to experience', seq: true },
  { keys: ['G', 'S'], label: 'Go to skills', seq: true },
  { keys: ['G', 'C'], label: 'Go to contact', seq: true },
  { keys: ['G', 'H'], label: 'Go to top', seq: true },
  { keys: ['?'], label: 'Show this panel' },
  { keys: ['Esc'], label: 'Close any panel' },
];

function isTyping(target: EventTarget | null) {
  const el = target as HTMLElement | null;
  if (!el) return false;
  return el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName);
}

/** Global keyboard layer. Rendered once in the app shell. */
export function KeyboardShortcuts() {
  const go = useGoToSection();
  const gPressed = useRef(0);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        shortcutsStore.set(false);
        paletteStore.set((o) => !o);
        return;
      }
      if (e.metaKey || e.ctrlKey || e.altKey || isTyping(e.target)) return;
      if (paletteStore.get() || document.querySelector('dialog[open]')) return;

      const key = e.key.toLowerCase();
      const now = performance.now();

      if (gPressed.current && now - gPressed.current < 1200 && GOTO[key]) {
        e.preventDefault();
        gPressed.current = 0;
        go(GOTO[key]);
        return;
      }
      gPressed.current = 0;

      if (key === 'g') {
        gPressed.current = now;
      } else if (e.key === '/') {
        e.preventDefault();
        if (!focusProjectSearch()) searchFocusRequest.pending = true;
        go('projects');
        requestAnimationFrame(() => focusProjectSearch());
      } else if (e.key === '?') {
        e.preventDefault();
        shortcutsStore.set(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go]);

  return null;
}

export function ShortcutsOverlay() {
  const open = useStore(shortcutsStore);
  return (
    <Sheet
      open={open}
      onClose={() => shortcutsStore.set(false)}
      placement="center"
      className="shortcuts"
      title="Keyboard shortcuts"
      meta="SYSTEM / KEYS"
    >
      <dl className="shortcuts__list">
        {SHORTCUTS.map((s) => (
          <div key={s.label} className="shortcuts__row">
            <dt>{s.label}</dt>
            <dd>
              {s.keys.map((k, i) => (
                <span key={k + i}>
                  {i > 0 && <span className="shortcuts__then">{s.seq ? 'then' : '+'}</span>}
                  <Kbd>{k}</Kbd>
                </span>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </Sheet>
  );
}
