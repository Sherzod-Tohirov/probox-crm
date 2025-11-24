import { useLayoutEffect, useRef, useCallback } from 'react';

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
}) {
  const hasRestoredScroll = useRef(false);

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
    if (!hasData || hasRestoredScroll.current) return;

    const saved = sessionStorage.getItem(storageKey);
    const targetY =
      saved && !isNaN(parseInt(saved, 10)) ? parseInt(saved, 10) : null;
    const savedRowKey = sessionStorage.getItem(`${storageKey}__rowKey`);
    if (targetY == null) return;

    let tries = 0;
    const maxTries = 60; // ~1s at 60fps

    const tryRestore = () => {
      const wrapper = getScrollableWrapper();
      if (!wrapper) {
        if (tries++ < maxTries) requestAnimationFrame(tryRestore);
        return;
      }

      let done = false;
      if (savedRowKey) {
        // Try to find row by data attribute without relying on CSS.escape
        const rows = wrapper.querySelectorAll('[data-row-key]');
        let rowEl = null;
        for (const el of rows) {
          if (el.getAttribute('data-row-key') === savedRowKey) {
            rowEl = el;
            break;
          }
        }
        if (rowEl) {
          const wrapperRect = wrapper.getBoundingClientRect();
          const rowRect = rowEl.getBoundingClientRect();
          const offset =
            rowRect.top -
            wrapperRect.top +
            wrapper.scrollTop -
            Math.round(wrapper.clientHeight / 3);
          wrapper.scrollTop = Math.max(0, offset);
          done = true;
        }
      }

      if (!done) {
        // Fallback to raw Y position
        const canScroll = wrapper.scrollHeight > wrapper.clientHeight;
        const prevBehavior = wrapper.style.scrollBehavior;
        wrapper.style.scrollBehavior = 'auto';
        wrapper.scrollTop = targetY;
        wrapper.style.scrollBehavior = prevBehavior || '';
        done = canScroll && Math.abs(wrapper.scrollTop - targetY) <= 1;
      }

      if (done || tries >= maxTries) {
        sessionStorage.removeItem(storageKey);
        sessionStorage.removeItem(`${storageKey}__rowKey`);
        hasRestoredScroll.current = true;
        return;
      }

      tries += 1;
      requestAnimationFrame(tryRestore);
    };

    requestAnimationFrame(tryRestore);
  }, [hasData, getScrollableWrapper, storageKey]);

  return {
    saveScrollPosition,
  };
}
