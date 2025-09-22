import { breakpoints } from '@config/breakpoints';
import { useLayoutEffect, useState } from 'react';

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  useLayoutEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= breakpoints.lg);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [window.innerWidth]);
  return isMobile;
};
export default useIsMobile;
