import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../hooks/useMediaQuery';

type Line = { kind: 'cmd' | 'req' | 'ok' | 'dim'; tag: string; text: string };

/** Atmospheric, simulated log of a request moving through a full-stack system. */
const SCRIPT: Line[] = [
  { kind: 'cmd', tag: '$', text: 'trace request --app interview' },
  { kind: 'req', tag: 'client', text: 'POST /api/sessions  { resume, job_description }' },
  { kind: 'dim', tag: 'api', text: 'validate → authorize → route' },
  { kind: 'dim', tag: 'db', text: 'INSERT INTO sessions … RETURNING id' },
  { kind: 'req', tag: 'ai', text: 'analyse(resume, job_description)' },
  { kind: 'dim', tag: 'ai', text: 'generate adaptive questions' },
  { kind: 'dim', tag: 'speech', text: 'stream answer → transcript' },
  { kind: 'req', tag: 'eval', text: 'score answers → scorecard' },
  { kind: 'ok', tag: 'resp', text: '200 OK  scorecard ready' },
];

const CHAR_MS = 16;
const LINE_PAUSE = 420;
const LOOP_PAUSE = 2600;

export function SystemPanel() {
  const reduce = useReducedMotion();
  const [lineIdx, setLineIdx] = useState(reduce ? SCRIPT.length : 0);
  const [chars, setChars] = useState(0);
  const [running, setRunning] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  // Pause when off screen or the tab is hidden.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let visible = true;
    const update = () => setRunning(visible && document.visibilityState === 'visible');
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      update();
    });
    io.observe(el);
    document.addEventListener('visibilitychange', update);
    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', update);
    };
  }, []);

  useEffect(() => {
    if (reduce) {
      setLineIdx(SCRIPT.length);
      return;
    }
    if (!running) return;
    let t: number;
    if (lineIdx >= SCRIPT.length) {
      t = window.setTimeout(() => {
        setLineIdx(0);
        setChars(0);
      }, LOOP_PAUSE);
    } else if (chars < SCRIPT[lineIdx].text.length) {
      t = window.setTimeout(() => setChars((c) => c + 2), CHAR_MS);
    } else {
      t = window.setTimeout(() => {
        setLineIdx((i) => i + 1);
        setChars(0);
      }, LINE_PAUSE);
    }
    return () => window.clearTimeout(t);
  }, [lineIdx, chars, running, reduce]);

  return (
    <div className="syspanel" ref={ref}>
      <div className="syspanel__bar">
        <span className="syspanel__dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="t-meta">system / trace</span>
        <span className="t-meta syspanel__sim">simulated</span>
      </div>
      <p className="sr-only">
        Decorative simulated log showing a request travelling from the client through an API, database and AI services
        back to a response.
      </p>
      <pre className="syspanel__log" aria-hidden="true">
        {SCRIPT.map((l, i) => {
          if (i > lineIdx) return <span key={i} className="syspanel__line is-empty">{'\n'}</span>;
          const text = i === lineIdx ? l.text.slice(0, chars) : l.text;
          return (
            <span key={i} className={`syspanel__line syspanel__line--${l.kind}`}>
              <span className="syspanel__tag">{l.tag.padEnd(7)}</span>
              {text}
              {i === lineIdx && <span className="syspanel__caret" />}
              {'\n'}
            </span>
          );
        })}
      </pre>
    </div>
  );
}
