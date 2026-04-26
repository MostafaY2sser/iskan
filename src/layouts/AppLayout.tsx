import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getLanguageByCode } from '@/i18n/languages';
import ScrollToHash from '@/components/ScrollToHash';
import ScrollToTop from '@/components/ScrollToTop';
import Navigation from '@/components/Navigation';
import SiteFooter from '@/components/SiteFooter';
import { useAuth } from '@/providers/AuthProvider'; 



const AppLayout: React.FC = () => {
  const { i18n } = useTranslation();
  const location = useLocation();
  const { user } = useAuth(); 
  const isAdmin = user?.user_type === 'admin'; 



  // 👇 1) List every route prefix where you DON'T want the global nav/footer
  const HIDE_CHROME_PREFIXES = [
    '/dashboard',
    '/dashboard-customer',
    '/messages',
    '/messages-new',
    '/properties',
    '/properties-new',
    '/customer-properties',
    '/add-property',
    '/add-residence',
    '/bookings',
    '/bookings-new',
    '/customer-bookings',
    '/create-booking',
    '/profile',
    '/account',
    '/settings',
    '/settings-customer',
    '/reports',
  ];

  // 👇 2) Check current path
  const hideChrome = HIDE_CHROME_PREFIXES.some((p) =>
    location.pathname.startsWith(p)
  );

  const hideGlobalUI = hideChrome || isAdmin; 
  
  // Language / direction
  const currentLanguage = getLanguageByCode(i18n.language);
  const isRTL = currentLanguage?.dir === 'rtl';

  React.useEffect(() => {
    try {
      if (typeof document !== 'undefined' && currentLanguage) {
        document.documentElement.dir = currentLanguage.dir;
        document.documentElement.lang = currentLanguage.code;
        if (currentLanguage.dir === 'rtl') {
          document.body.classList.add('rtl');
          document.body.classList.remove('ltr');
        } else {
          document.body.classList.add('ltr');
          document.body.classList.remove('rtl');
        }
      }
    } catch (error) {
      console.log('Direction setting error:', error);
    }
  }, [currentLanguage]);

  return (
    <div
      dir={currentLanguage?.dir || 'ltr'}
      className={isRTL ? 'rtl-content' : 'ltr-content'}
    >
      <ScrollToHash />
      <ScrollToTop />

      {/* 👇 3) Render global nav/footer only when NOT on dashboard-ish routes */}
      {!hideGlobalUI && <Navigation />}

      {/* Your page content (Outlet = child routes) */}
      <Outlet />

      {!hideGlobalUI && <SiteFooter />}
      
    </div>
  );
};

export default AppLayout;






