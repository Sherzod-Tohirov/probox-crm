import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export default function StickyFooterPortal({ children }) {
  const [style, setStyle] = useState({});

  const update = useCallback(() => {
    if (typeof document === 'undefined') return;
    const main = document.getElementById('dashboard-layout-main');
    const root = document.getElementById('footer-root');
    if (!main || !root) return;

    const mainRect = main.getBoundingClientRect();
    const computed = window.getComputedStyle(main);
    const paddingLeft = parseFloat(computed.paddingLeft || '0');
    const paddingRight = parseFloat(computed.paddingRight || '0');

    // Detect sidebar and exclude it from footer area
    // Sidebar class may be CSS-moduled; match by substring
    const sidebar =
      document.querySelector('[class*="sidebar-layout"]') ||
      document.querySelector('.sidebar-layout');
    let sidebarRight = 0;
    if (sidebar) {
      const sidebarRect = sidebar.getBoundingClientRect();
      // If sidebar is visible and overlaps the main's left region, keep footer to its right
      if (sidebarRect.width > 0 && sidebarRect.right > 0) {
        sidebarRight = sidebarRect.right;
      }
    }

    // Base left is content's left edge (exclude sidebar), then add a small gap
    const GAP_MIN = 0; // small side gap
    const left = Math.max(mainRect.left + paddingLeft, sidebarRight) + GAP_MIN;
    // Width should end before main right padding and keep a small right gap
    const rightEdge = mainRect.right - paddingRight - GAP_MIN;
    const width = Math.max(0, rightEdge - left);

    setStyle({
      position: 'fixed',
      left: `${left}px`,
      width: `${width}px`,
      bottom: 0,
      zIndex: 999,
      pointerEvents: 'auto',
    });
  }, []);

  useEffect(() => {
    // Initial update with small delay to ensure sidebar is rendered
    const initialUpdate = () => {
      requestAnimationFrame(() => {
        update();
        // Double-check after a brief moment in case sidebar animates in
        setTimeout(update, 100);
      });
    };

    // Run immediately and after DOM is ready
    if (document.readyState === 'complete') {
      initialUpdate();
    } else {
      window.addEventListener('load', initialUpdate);
    }
    
    // Also run on any layout shift
    initialUpdate();
    
    const onResize = () => requestAnimationFrame(update);
    window.addEventListener('resize', onResize, { passive: true });
    window.addEventListener('scroll', onResize, { passive: true });
    
    // Sidebar may toggle width; observe DOM mutations to remeasure
    const sidebar =
      document.querySelector('[class*="sidebar-layout"]') ||
      document.querySelector('.sidebar-layout');
    let observer;
    if (sidebar && 'ResizeObserver' in window) {
      observer = new ResizeObserver(() => requestAnimationFrame(update));
      observer.observe(sidebar);
    }
    
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onResize);
      window.removeEventListener('load', initialUpdate);
      if (observer) observer.disconnect();
    };
  }, [update]);

  const portalRoot =
    typeof document !== 'undefined'
      ? document.getElementById('footer-root')
      : null;

  return portalRoot
    ? createPortal(<div style={style}>{children}</div>, portalRoot)
    : children;
}
