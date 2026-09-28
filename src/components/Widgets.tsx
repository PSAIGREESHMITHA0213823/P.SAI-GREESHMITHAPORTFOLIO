import { useEffect, useRef, useState } from 'react';
import { config } from '../data/config';
import { useReducedMotion } from '../hooks/useMediaQuery';
import { useStore } from '../utils/store';
import { toastStore } from '../utils/toast';
import { cn } from '../utils/cn';
import { Icon } from './Icon';

/** Live clock in the owner's time zone. */
export function LiveClock({ withZone = true }: { withZone?: boolean }) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);
  const time = new Intl.DateTimeFormat('en-GB', {
    timeZone: config.timeZone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(now);
  const zone =
    new Intl.DateTimeFormat('en-US', { timeZone: config.timeZone, timeZoneName: 'short' })
      .formatToParts(now)
      .find((p) => p.type === 'timeZoneName')?.value ?? '';
  return (
    <span className="clock t-mono">
      <time dateTime={now.toISOString()}>{time}</time>
      {withZone && <span className="clock__zone"> {zone}</span>}
    </span>
  );
}

/** Counts up to `value` once visible. Only ever used for verified numbers. */
export function Counter({ value }: { value: number }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(reduce ? value : 0);

  useEffect(() => {
    if (reduce) {
      setShown(value);
      return;
    }
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const dur = 900;
      const tick = (t: number) => {
        const k = Math.min(1, (t - start) / dur);
        setShown(Math.round(value * (1 - Math.pow(1 - k, 3))));
        if (k < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, reduce]);

  return (
    <span ref={ref} aria-label={String(value)}>
      <span aria-hidden="true">{shown}</span>
    </span>
  );
}

export function Toaster() {
  const toasts = useStore(toastStore);
  return (
    <div className="toaster" role="status" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={cn('toast', `toast--${t.tone}`)}>
          {t.tone === 'success' && <Icon name="check" size={14} />}
          {t.message}
        </div>
      ))}
    </div>
  );
}
