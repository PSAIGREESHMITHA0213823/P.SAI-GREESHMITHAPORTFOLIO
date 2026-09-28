import { useEffect } from 'react';
import { config } from '../data/config';

const DEFAULT_TITLE = `${config.name} — Software Engineer & Full Stack Developer`;

/** Per-route title, description, OG tags and canonical URL. */
export function useDocumentMeta(title: string | null, description?: string | null) {
  useEffect(() => {
    const full = title ? `${title} — ${config.name}` : DEFAULT_TITLE;
    document.title = full;
    const setMeta = (sel: string, value: string) => document.querySelector(sel)?.setAttribute('content', value);
    setMeta('meta[property="og:title"]', full);
    if (description) {
      setMeta('meta[name="description"]', description);
      setMeta('meta[property="og:description"]', description);
    }
    if (config.siteUrl) {
      const url = config.siteUrl + location.pathname;
      setMeta('meta[property="og:url"]', url);
      document.querySelector('link[rel="canonical"]')?.setAttribute('href', url);
    }
  }, [title, description]);
}
