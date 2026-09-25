import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Router default is to keep the scroll position across navigations, which feels
 * broken on a storefront. Jump to the top on a new path, or to the anchor when
 * the link carries a hash (the footer's policy links do).
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // Wait a frame so the target section has mounted.
      const id = hash.slice(1);
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      return;
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}
