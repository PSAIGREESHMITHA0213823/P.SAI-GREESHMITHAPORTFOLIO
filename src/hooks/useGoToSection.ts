import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { DESTINATIONS, scrollToSection, type DestinationId } from '../utils/navigation';

/**
 * Jump to a destination from anywhere. `search` overrides the destination's
 * default query (e.g. `?tech=React.js` for the work page).
 */
export function useGoToSection() {
  const navigate = useNavigate();
  const { pathname, search: currentSearch } = useLocation();
  return useCallback(
    (id: DestinationId, search?: string) => {
      const d = DESTINATIONS.find((x) => x.id === id)!;
      const hash = 'hash' in d ? d.hash : undefined;
      const query = search ?? ('search' in d ? d.search : '');
      const samePage = pathname === d.path && (query === '' ? true : query === currentSearch);
      if (samePage) {
        if (hash && scrollToSection(hash)) return;
        if (!hash) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
      }
      navigate({ pathname: d.path, search: query, hash }, { viewTransition: pathname !== d.path });
    },
    [navigate, pathname, currentSearch],
  );
}
