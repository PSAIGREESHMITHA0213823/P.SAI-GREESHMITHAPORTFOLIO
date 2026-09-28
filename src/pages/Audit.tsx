import { useEffect } from 'react';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { auditPlaceholders } from '../utils/audit';

/** Owner tool at /audit — lists every placeholder still visible on the site. Not linked, not indexed. */
export default function Audit() {
  useDocumentMeta('Placeholder audit');
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex';
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);

  const items = auditPlaceholders();
  const byFile = new Map<string, typeof items>();
  for (const i of items) byFile.set(i.file, [...(byFile.get(i.file) ?? []), i]);

  return (
    <section className="audit container" aria-labelledby="audit-title">
      <span className="t-meta">Owner tool · /audit</span>
      <h1 className="t-title" id="audit-title">
        {items.length} placeholders to fill
      </h1>
      <p className="t-body">Each row renders as a visible [ PLACEHOLDER ] on the site until its value is set.</p>
      {[...byFile.entries()].map(([file, rows]) => (
        <div key={file} className="audit__group">
          <h2 className="t-meta">
            {file} · {rows.length}
          </h2>
          <ul>
            {rows.map((r, i) => (
              <li key={i}>
                <code>{r.field}</code>
                {r.note && <span className="t-meta">{r.note}</span>}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}
