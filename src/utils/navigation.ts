/** Top-level pages, in nav order. */
export const PAGES = [
  { path: '/', label: 'Home' },
  { path: '/work', label: 'Work' },
  { path: '/about', label: 'About' },
  { path: '/services', label: 'Services' },
  { path: '/contact', label: 'Contact' },
] as const;

/**
 * Every place the palette, shortcuts and CTAs can jump to: a page, optionally
 * a section on it (hash) and a default query (e.g. a filter).
 */
export const DESTINATIONS = [
  { id: 'top', label: 'Home', path: '/' },
  { id: 'projects', label: 'All projects', path: '/work' },
  { id: 'client-work', label: 'Client work', path: '/work', search: '?type=client' },
  { id: 'about', label: 'About', path: '/about' },
  { id: 'experience', label: 'Experience', path: '/about', hash: 'experience' },
  { id: 'skills', label: 'Skills', path: '/about', hash: 'skills' },
  { id: 'achievements', label: 'Achievements', path: '/about', hash: 'achievements' },
  { id: 'certifications', label: 'Certifications', path: '/about', hash: 'certifications' },
  { id: 'services', label: 'Services', path: '/services' },
  { id: 'contact', label: 'Contact', path: '/contact' },
] as const satisfies readonly { id: string; label: string; path: string; hash?: string; search?: string }[];

export type DestinationId = (typeof DESTINATIONS)[number]['id'];

/** Scrolls to an element by id on the current page; returns false if it isn't there. */
export function scrollToSection(id: string, focus = true): boolean {
  const el = document.getElementById(id);
  if (!el) return false;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  if (focus) {
    const heading = el.querySelector<HTMLElement>('h1, h2');
    if (heading) {
      heading.setAttribute('tabindex', '-1');
      heading.focus({ preventScroll: true });
    }
  }
  return true;
}
