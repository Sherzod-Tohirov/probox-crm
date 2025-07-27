import { BREAKPOINTS } from '@config/breakpoints';
import { useEffect, useState } from 'react';

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= BREAKPOINTS.LG);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [window.innerWidth]);
  return isMobile;
};
export default useIsMobile;
