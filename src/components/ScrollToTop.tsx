import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    // Only scroll to top on pathname change, not hash change
    if (!location.hash) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location.pathname]); // Only depend on pathname, not hash

  return null;
};

export default ScrollToTop;