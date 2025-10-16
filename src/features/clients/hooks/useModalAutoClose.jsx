import { useLayoutEffect, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { closeAllModals } from '@store/slices/toggleSlice';

/**
 * Custom hook to automatically close modals on route change or scroll
 * @param {React.RefObject} scrollContainerRef - Reference to the scrollable container
 */
export default function useModalAutoClose(scrollContainerRef) {
  const dispatch = useDispatch();
  const location = useLocation();

  // Close all modals when route changes
  useLayoutEffect(() => {
    dispatch(closeAllModals());
  }, [location.pathname, dispatch]);

  // Close all modals when scrolling
  useEffect(() => {
    if (!scrollContainerRef?.current) return;

    const tableWrapper = scrollContainerRef.current.closest('#table-wrapper');
    if (!tableWrapper) return;

    const handleScroll = () => {
      dispatch(closeAllModals());
    };

    tableWrapper.addEventListener('scroll', handleScroll, {
      passive: true,
    });

    return () => {
      tableWrapper.removeEventListener('scroll', handleScroll);
    };
  }, [dispatch, scrollContainerRef]);
}
