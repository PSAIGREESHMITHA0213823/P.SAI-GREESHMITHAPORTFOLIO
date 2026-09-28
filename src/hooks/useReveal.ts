import { useCallback } from 'react';

let observer: IntersectionObserver | null = null;

function getObserver() {
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-in');
            observer!.unobserve(e.target);
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
    );
  }
  return observer;
}

/** Ref callback: adds `.is-in` once the element enters the viewport. One shared observer. */
export function useReveal<T extends Element>() {
  return useCallback((el: T | null) => {
    if (!el) return;
    el.classList.add('reveal');
    getObserver().observe(el);
  }, []);
}
