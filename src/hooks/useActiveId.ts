import { useEffect, useState } from 'react';

/**
 * Returns the id (from `ids`) of the element currently crossing the reading line
 * (`line` × viewport height from the top). Used for scrollytelling and progress rails.
 */
export function useActiveId(ids: string[], line = 0.4): string | null {
  const [active, setActive] = useState<string | null>(ids[0] ?? null);
  const key = ids.join('|');

  useEffect(() => {
    const list = key.split('|');
    const els = list.map((id) => document.getElementById(id)).filter((e): e is HTMLElement => !!e);
    if (!els.length) return;
    const visible = new Map<string, boolean>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) visible.set(e.target.id, e.isIntersecting);
        const current = list.filter((id) => visible.get(id));
        if (current.length) setActive(current[current.length - 1]);
      },
      { rootMargin: `-${line * 100}% 0px -${(1 - line) * 100 - 1}% 0px` },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [key, line]);

  return active;
}
