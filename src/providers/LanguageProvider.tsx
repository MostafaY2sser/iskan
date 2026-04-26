

import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Mock translations - in production, this would be a proper i18n solution
const translations: Record<Language, Record<string, string>> = {
  en: {
    'nav.dashboard': 'Dashboard',
    'nav.properties': 'Properties',
    'nav.users': 'Users',
    'nav.bookings': 'Bookings',
    'nav.special_request': 'Special Request',
    'nav.reports': 'Reports',
    'auth.login': 'Sign In',
    'auth.logout': 'Sign Out',
    'role.admin': 'Administrator',
    'role.property-owner': 'Property Owner',
    'role.recruiting-company': 'Recruiting Company',
    'dashboard.title': 'Admin Dashboard',
    'dashboard.totalUsers': 'Total Users',
    'dashboard.properties': 'Properties',
    'dashboard.occupancyRate': 'Occupancy Rate',
    'dashboard.monthlyRevenue': 'Monthly Revenue',
    'dashboard.overview': 'Platform Overview',

    'dashboard.users_per_type': 'Users by Type',
    'dashboard.monthly_income': 'Monthly Income',
    'dashboard.total_monthly_income': 'Total Monthly Income',
    'save':'Save',
    'platform_monthly_performance' :"Platform Monthly Performance",
    'dashboard.dashboard_overview': 'Dashboard Overview',
    'most_viewed_properties':'Most Viewed Properties',
    'dashboard.units_by_status': 'Units by Status',
    'dashboard.users_pending_approval': 'Users Pending Approval',
    'dashboard.no_users_pending_approval': 'No Users Pending Approval',
    'dashboard.units_pending_approval': 'Units Pending Approval',
    'dashboard.no_units_pending_approval': 'No Units Pending Approval',
    'dashboard.bookings_without_agent': 'Bookings Without Agent',
    'dashboard.without_agent': 'Without Agent',
    'dashboard.no_bookings_without_agent': 'No Bookings Without Agent',

    'header.adminPortal': 'Admin Portal',
    'property.myProperties': 'My Properties',
    'property.viewManage': 'View and manage your property listings.',
    'common.loading': 'Loading...',
  },
  ar: {
    'nav.dashboard': 'لوحة التحكم',
    'nav.properties': 'العقارات',
    'nav.users': 'المستخدمون',
    'nav.bookings': 'الحجوزات',
    'nav.special_request': 'طلبات خاصة',
    'nav.reports': 'التقارير',
    'nav.agents': 'الوكلاء',
    'auth.login': 'تسجيل الدخول',
    'auth.logout': 'تسجيل الخروج',
    'role.admin': 'مدير النظام',
    'role.property-owner': 'مالك العقار',
    'role.recruiting-company': 'شركة التوظيف',
    'dashboard.title': 'لوحة تحكم المدير',
    'dashboard.totalUsers': 'إجمالي المستخدمين',
    'dashboard.properties': 'العقارات',
    'dashboard.occupancyRate': 'معدل الإشغال',
    'dashboard.monthlyRevenue': 'الإيرادات الشهرية',
    'dashboard.overview': 'نظرة عامة على المنصة',

    'dashboard.users_per_type': 'المستخدمون حسب النوع',
    'dashboard.monthly_income': 'الإيرادات الشهرية',
    'dashboard.total_monthly_income': 'إجمالي الإيرادات الشهرية',
    'save':'حفظ',
    "platform_monthly_performance":"الأداء الشهري للمنصة",
    'most_viewed_properties':'أكثر العقارات مشاهدة',
    'dashboard.dashboard_overview': 'نظرة عامة على لوحة التحكم',
    'dashboard.units_by_status': 'الوحدات حسب الحالة',
    'dashboard.users_pending_approval': 'المستخدمون بانتظار الموافقة',
    'dashboard.no_users_pending_approval': 'لا يوجد مستخدمون بانتظار الموافقة',
    'dashboard.units_pending_approval': 'الوحدات بانتظار الموافقة',
    'dashboard.no_units_pending_approval': 'لا توجد وحدات بانتظار الموافقة',
    'dashboard.bookings_without_agent': 'الحجوزات بدون وكيل',
    'dashboard.without_agent': 'بدون وكيل',
    'dashboard.no_bookings_without_agent': 'لا توجد حجوزات بدون وكيل',


    'header.adminPortal': 'بوابة المدير',
    'property.myProperties': 'عقاراتي',
    'property.viewManage': 'عرض وإدارة قوائم العقارات الخاصة بك.',
    'common.loading': 'جارٍ التحميل...',
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window === 'undefined') return 'ar';
    return (localStorage.getItem('housing_language') as Language) || 'ar';
  });

  const handleSetLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage);
    if (typeof window !== 'undefined') {
      localStorage.setItem('housing_language', newLanguage);
      document.documentElement.lang = newLanguage;
      document.documentElement.dir = newLanguage === 'ar' ? 'rtl' : 'ltr';
    }
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || key;
  };

  const isRTL = language === 'ar';

  return (
      <LanguageContext.Provider
          value={{ language, setLanguage: handleSetLanguage, t, isRTL }}
      >
        {children}
      </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};