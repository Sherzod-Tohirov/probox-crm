import { useLayoutEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for managing scroll position restoration
 * @param {Object} options - Configuration options
 * @param {React.RefObject} options.scrollContainerRef - Reference to the scroll container
 * @param {string} options.storageKey - sessionStorage key for scroll position
 * @param {boolean} options.hasData - Whether data is loaded
 * @returns {Object} Scroll management functions
 */
export default function useScrollRestoration({
  scrollContainerRef,
  storageKey = 'scrollPosition',
  hasData = false,
}) {
  const hasRestoredScroll = useRef(false);

  /**
   * Save current scroll position before navigation
   */
  const saveScrollPosition = useCallback(() => {
    if (!scrollContainerRef.current) return;

    const tableWrapper = scrollContainerRef.current.closest('#table-wrapper');
    if (tableWrapper) {
      const scrollY = tableWrapper.scrollTop;
      sessionStorage.setItem(storageKey, scrollY);
    }
  }, [scrollContainerRef, storageKey]);

  /**
   * Restore scroll position after data loads
   */
  useLayoutEffect(() => {
    if (!hasData || hasRestoredScroll.current || !scrollContainerRef.current) {
      return;
    }

    const tableWrapper = scrollContainerRef.current.closest('#table-wrapper');
    if (!tableWrapper) return;

    requestAnimationFrame(() => {
      const savedY = sessionStorage.getItem(storageKey);
      if (savedY && !isNaN(parseInt(savedY))) {
        tableWrapper.scrollTop = parseInt(savedY);
        sessionStorage.removeItem(storageKey);
        hasRestoredScroll.current = true;
      }
    });
  }, [hasData, scrollContainerRef, storageKey]);

  return {
    saveScrollPosition,
  };
}
