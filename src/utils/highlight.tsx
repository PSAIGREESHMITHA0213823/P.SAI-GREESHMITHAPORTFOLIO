import { Fragment } from 'react';
import { tokenize } from './filters';

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Wraps every occurrence of the query terms in <mark>. */
export function Highlight({ text, query }: { text: string; query: string }) {
  const terms = tokenize(query);
  if (!terms.length) return <>{text}</>;
  const re = new RegExp(`(${terms.map(escape).join('|')})`, 'gi');
  const parts = text.split(re);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? <mark key={i}>{part}</mark> : <Fragment key={i}>{part}</Fragment>,
      )}
    </>
  );
}
