import { useEffect, useState, type RefObject } from 'react';

/**
 * 0 → 1 progress of `ref` through the viewport.
 * 'through': 0 when its top reaches the viewport top, 1 when its bottom reaches the viewport bottom
 *            (for pinned sections taller than the viewport).
 * 'enter':   0 when its top crosses the reading line (60% down), 1 when its bottom does.
 */
export function useScrollProgress(ref: RefObject<HTMLElement | null>, mode: 'through' | 'enter' = 'through') {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      let p: number;
      if (mode === 'through') {
        const total = r.height - vh;
        p = total <= 0 ? (r.top <= 0 ? 1 : 0) : -r.top / total;
      } else {
        p = (vh * 0.6 - r.top) / r.height;
      }
      setProgress(Math.min(1, Math.max(0, p)));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [ref, mode]);

  return progress;
}
