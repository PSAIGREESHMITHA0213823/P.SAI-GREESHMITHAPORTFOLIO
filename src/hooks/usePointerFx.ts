import { useCallback, useRef } from 'react';
import { useFinePointer, useReducedMotion } from './useMediaQuery';

/**
 * Cursor-aware surface: sets --mx/--my (spotlight position) and, with `tilt`,
 * --rx/--ry (degrees). Desktop pointer + motion allowed only; otherwise a no-op.
 */
export function usePointerFx<T extends HTMLElement>({ tilt = true, max = 4 } = {}) {
  const enabled = useFinePointer() && !useReducedMotion();
  const frame = useRef(0);

  const onPointerMove = useCallback(
    (e: React.PointerEvent<T>) => {
      const el = e.currentTarget;
      const { clientX, clientY } = e;
      cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const x = (clientX - r.left) / r.width;
        const y = (clientY - r.top) / r.height;
        el.style.setProperty('--mx', `${x * 100}%`);
        el.style.setProperty('--my', `${y * 100}%`);
        if (tilt) {
          el.style.setProperty('--rx', `${(0.5 - y) * max}deg`);
          el.style.setProperty('--ry', `${(x - 0.5) * max}deg`);
        }
      });
    },
    [tilt, max],
  );

  const onPointerLeave = useCallback((e: React.PointerEvent<T>) => {
    cancelAnimationFrame(frame.current);
    e.currentTarget.style.setProperty('--rx', '0deg');
    e.currentTarget.style.setProperty('--ry', '0deg');
  }, []);

  return enabled ? { onPointerMove, onPointerLeave, 'data-fx': '' } : {};
}
