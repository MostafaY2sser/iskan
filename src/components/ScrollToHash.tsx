import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { scrollToId } from '@/utils/scroll';

const ScrollToHash: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      // Remove the # from hash and scroll to element
      const id = location.hash.slice(1);
      // Small delay to ensure page has loaded
      setTimeout(() => {
        scrollToId(id);
      }, 100);
    }
  }, [location.hash]);

  return null;
};

export default ScrollToHash;