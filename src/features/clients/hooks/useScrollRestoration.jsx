import { useLayoutEffect, useCallback } from 'react';

/**
 * Custom hook for managing scroll position restoration
 * @param {Object} options - Configuration options
 * @param {React.RefObject} options.scrollContainerRef - Reference to the table element
 * @param {string} options.storageKey - sessionStorage key for scroll position
 * @param {boolean} options.hasData - Whether data is loaded
 * @returns {Object} Scroll management functions
 */
export default function useScrollRestoration({
  scrollContainerRef,
  storageKey = 'scrollPosition',
  hasData = false,
  behavior = 'auto',
  maxTries = 120,
}) {
  /**
   * Get the scrollable wrapper element
   */
  const getScrollableWrapper = useCallback(() => {
    if (scrollContainerRef?.current) {
      const tableElement = scrollContainerRef.current;
      const viaRef =
        tableElement.closest('#table-wrapper') ||
        tableElement.closest('[data-testid="table-wrapper"]') ||
        tableElement.parentElement?.closest('.table-wrapper');
      if (viaRef) return viaRef;
    }
    const fallback = document.querySelector(
      '#table-wrapper, [data-testid="table-wrapper"], .table-wrapper'
    );
    return fallback || null;
  }, [scrollContainerRef]);

  /**
   * Save current scroll position before navigation
   */
  const saveScrollPosition = useCallback(() => {
    const tableWrapper = getScrollableWrapper();
    if (tableWrapper) {
      const scrollY = tableWrapper.scrollTop;
      sessionStorage.setItem(storageKey, String(scrollY));
    }
  }, [getScrollableWrapper, storageKey]);

  /**
   * Restore scroll position after data loads
   */
  useLayoutEffect(() => {
    if (!hasData) return;

    let tries = 0;

    const restore = () => {
      const wrapper = getScrollableWrapper();
      const saved = sessionStorage.getItem(storageKey);

      if (wrapper && saved) {
        // Ensure wrapper has layout & can scroll
        const canScroll = wrapper.scrollHeight > wrapper.clientHeight;
        if (!canScroll && tries++ < maxTries)
          return requestAnimationFrame(restore);

        const y = parseInt(saved, 10);
        if (!Number.isNaN(y)) {
          const prevBehavior = wrapper.style.scrollBehavior;
          wrapper.style.scrollBehavior = behavior || 'auto';
          wrapper.scrollTop = y;
          wrapper.style.scrollBehavior = prevBehavior || '';
          sessionStorage.removeItem(storageKey);
          sessionStorage.removeItem(`${storageKey}__rowKey`);
          return;
        }
      }

      if (tries++ < maxTries) requestAnimationFrame(restore);
    };

    requestAnimationFrame(restore);
  }, [hasData, getScrollableWrapper, storageKey, behavior, maxTries]);

  return {
    saveScrollPosition,
  };
}
