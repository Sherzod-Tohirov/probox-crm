import { breakpoints } from '@config/breakpoints';
import { useLayoutEffect, useState } from 'react';

const useIsMobile = (props = {}) => {
  const [isMobile, setIsMobile] = useState(false);
  useLayoutEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= breakpoints.lg);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [window.innerWidth]);
  if (!props.withDetails) return isMobile;
  return {
    isMobile,
    isTablet: window.innerWidth <= breakpoints.md,
    isDesktop: window.innerWidth > breakpoints.md,
  };
};
export default useIsMobile;
