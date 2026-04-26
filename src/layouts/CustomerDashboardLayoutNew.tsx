import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useResidenceSearch } from '@/hooks/useResidenceSearch';
import { performLogout } from '@/utils/authErrorHandler';
import { useAuth } from '@/providers/AuthProvider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Calendar,
  LayoutDashboard,
  Settings,
  User,
  Search as SearchIcon,
} from 'lucide-react';
import CustomerMobileSidebar from '@/components/ui/customer-mobile-sidebar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { languages, getLanguageByCode } from '@/i18n/languages';
import NotificationsDropdown from '@/components/NotificationsDropdown';


interface CustomerDashboardLayoutNewProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

const CustomerDashboardLayoutNew: React.FC<CustomerDashboardLayoutNewProps> = ({ 
  children, 
  title,
  subtitle
}) => {
  // const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const { searchResults, loading, error, searchResidences, clearSearch } = useResidenceSearch();
  const { i18n , t } = useTranslation();
  const isRTL = i18n.language === 'ar';

  // _________________________________________________________________________________
  const [currentLanguage, setCurrentLanguage] = useState(
    getLanguageByCode(i18n.language) || languages[0]
  );

  const handleLanguageChange = async (languageCode: string) => {
    try {
      await i18n.changeLanguage(languageCode);
      const newLanguage = getLanguageByCode(languageCode);
      if (newLanguage) {
        setCurrentLanguage(newLanguage);
        toast.success(t('language_changed_successfully', 'تم تغيير اللغة بنجاح'));
      }
    } catch (error) {
      console.error('Error changing language:', error);
      toast.error(t('language_change_error', 'حدث خطأ في تغيير اللغة'));
    }
  };
  // _________________________________________________________________________________


  // Helper function to generate user initials
  const getUserInitials = (user: any) => {
    if (!user) return 'أح';
    
    const firstName = (user.firstName || '').trim();
    const lastName = (user.lastName || '').trim();
    
    // If we have both first and last name, use both initials
    if (firstName && lastName) {
      const firstInitial = firstName.charAt(0).toUpperCase();
      const lastInitial = lastName.charAt(0).toUpperCase();
      return firstInitial + lastInitial;
    }
    
    // If we only have first name, use first two characters
    if (firstName && firstName.length >= 2) {
      return firstName.substring(0, 2).toUpperCase();
    }
    
    // If we only have first name with one character, use it twice
    if (firstName && firstName.length === 1) {
      return (firstName.charAt(0) + firstName.charAt(0)).toUpperCase();
    }
    
    // If we only have last name, use first two characters
    if (lastName && lastName.length >= 2) {
      return lastName.substring(0, 2).toUpperCase();
    }
    
    // If we only have last name with one character, use it twice
    if (lastName && lastName.length === 1) {
      return (lastName.charAt(0) + lastName.charAt(0)).toUpperCase();
    }
    
    // Fallback
    return 'أح';
  };

  // Handle search input change with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        searchResidences(searchQuery);
        setShowSearchResults(true);
      } else {
        clearSearch();
        setShowSearchResults(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, searchResidences, clearSearch]);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    // Use centralized logout function
    performLogout();
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    clearSearch();
    setShowSearchResults(false);
  };

  const isActive = (path: string) => {
    const currentPath = location.pathname;
    
    // Special handling for dashboard - should be active for dashboard and root
    if (path === '/dashboard-customer') {
      return currentPath === '/dashboard-customer' || 
             currentPath === '/customer-dashboard-test' ||
             currentPath === '/dashboard' ||
             currentPath === '/';
    }
    
    // For other routes, check exact match or if it starts with the path
    return currentPath === path || currentPath.startsWith(path + '/');
  };

  return (
    <div className="min-h-screen bg-muted" dir="rtl">
      {/* Top Header - Fixed at top */}
      <nav className="bg-white py-fluid-sm px-fluid-md sticky top-0 z-50 h-[63px]" >
        <div className="flex items-center  w-full">
          {/* Mobile Menu */}
          <CustomerMobileSidebar className="lg:hidden" />
          
          {/* Actions - At the very end (far left) on desktop */}
          <div className={`flex items-center absolute top-[20%] md:top-[50%] translate-y-[0%] md:translate-y-[-50%] ${isRTL ? "left-10 md:left-4" : "right-10 md:right-10"}`} style={{ gap: '12px' }}>
            
            <div className="sm:w-[90px] " >
              <Select value={currentLanguage.code} onValueChange={handleLanguageChange} >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      <div className="">
                        {/* {lang.flag && <span>{lang.flag}</span>} */}
                        <span>{lang.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/*  */}
            

            {/* Notifications */}
            <NotificationsDropdown notificationsPageLink="/customer-notifications"/>

            <Avatar className="w-8 h-8 sm:w-10 sm:h-10 hidden sm:block">
              <AvatarImage src={user?.avatar || "/placeholder.svg"} alt="المستخدم" />
              <AvatarFallback>{getUserInitials(user)}</AvatarFallback>
            </Avatar>
          </div>
          
          {/* Logo - Far right on desktop, mobile position unchanged */}
          <div className={`flex items-center gap-3 absolute pt-[25px] flex-1 justify-end ${isRTL ? "right-4" : "left-4"}`}>
            <Link to="/home" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <img 
                src="/lovable-uploads/ca283cc3-3f3f-4fc0-ac7e-66bca15bd058.png" 
                alt={t('meta.title')}
                loading="lazy"
                className={`h-8 sm:h-10 lg:h-12 w-auto cursor-pointer
                  duration-300
                  hover:scale-[1.7]
                hover:bg-[#ffffff]
                  hover:ml-12
                  hover:mt-4
                  ${ isRTL ? 'hover:mr-12' : 'hover:ml-12' }
                `}
              />
            </Link>
          </div>

          
        </div>
      </nav>

      {/* <NotificationsAlert link={"/customer-notifications"}/> */}

      <div className="flex min-h-[calc(100vh-56px)] sm:min-h-[calc(100vh-64px)]">
        {/* Right Sidebar - Fixed on desktop, hidden on mobile */}
        <div
          className={`hidden md:flex w-80 bg-white flex-col fixed  ${isRTL ? 'right-0' : 'left-0'}  top-14 sm:top-16 h-[calc(100vh-56px)] sm:h-[calc(100vh-64px)] z-40`}
          dir={`${isRTL ? 'rtl' : 'ltr'}`}
        >
          {/* scrollable body */}
          <div className="flex grow flex-col overflow-y-auto pt-8 pb-6">

              {/* ===== Main nav ===== */}
              <nav className="flex flex-col gap-2 px-4 mt-2">
                {/* لوحة التحكم */}
                <Link
                  to="/dashboard-customer"
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 transition ${
                    isActive('/dashboard-customer')
                      ? 'bg-[#2E4166] text-[#DDD4BA]'
                      : 'text-[#2E4166] hover:bg-muted'
                  }`}
                >
                  <LayoutDashboard className="w-5 h-5 shrink-0" />
                  <span className="text-base font-medium truncate">{t('customer_sidebar_dashboard')}</span>
                </Link>

              </nav>

              {/* divider */}
              <div className="my-5 border-b border-b-[#E9E9E9]" />

              {/* ===== إدارة الحجوزات (header aligned with items) ===== */}
              <p className="text-sm font-semibold text-[#2E4166]/70 px-4 pr-[32px] mb-2">
                {t('customer_sidebar_mangeBooking')}
              </p>

              <div className="flex flex-col gap-2 px-4">
                <Link
                  to="/customer-properties"
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 transition ${
                    isActive('/customer-properties')
                      ? 'bg-[#2E4166] text-[#DDD4BA]'
                      : 'text-[#2E4166] hover:bg-muted'
                  }`}
                >
                  <SearchIcon className="w-5 h-5 shrink-0" />
                  <span className="text-base font-medium truncate">
                    {t('customer_Properties_search')}
                  </span>
                </Link>

                <Link
                  to="/customer-bookings"
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 transition ${
                    isActive('/customer-bookings')
                      ? 'bg-[#2E4166] text-[#DDD4BA]'
                      : 'text-[#2E4166] hover:bg-muted'
                  }`}
                >
                  <Calendar className="w-5 h-5 shrink-0" />
                  <span className="text-base font-medium truncate">{t('customer_sidebar_booking')}</span>
                </Link>

              </div>
              
              {/* ______________________________________ */}
              {/* <div className="my-5 border-b border-[#E9E9E9]" />
              <p className="text-sm font-semibold text-[#2E4166]/70 px-4 pr-[32px] mb-2">
                  {t('residential_management')}
              </p>

              <Link
                  to="/residential-management"
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 transition mx-4 ${
                    isActive('/residential-management')
                      ? 'bg-[#2E4166] text-[#DDD4BA]'
                      : 'text-[#2E4166] hover:bg-muted'
                  }`}
                >
                  <ClipboardMinusIcon className="w-5 h-5 shrink-0" />
                  <span className="text-base font-medium truncate">{t('residential_reports')}</span>
                </Link> */}
              {/* ______________________________________ */}



              {/* divider */}
              <div className="my-5 border-b border-b-[#E9E9E9]" />

              {/* ===== إدارة الحساب (header aligned with items) ===== */}
              <p className="text-sm font-semibold text-[#2E4166]/70 px-4 pr-[32px] mb-2">
              {t('customer_manage_account')}
              </p>

              <div className="flex flex-col gap-2 px-4">
                <Link
                  to="/account"
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 transition ${
                    isActive('/account')
                      ? 'bg-[#2E4166] text-[#DDD4BA]'
                      : 'text-[#2E4166] hover:bg-muted'
                  }`}
                >
                  <User className="w-5 h-5 shrink-0" />
                  <span className="text-base font-medium truncate">{t('customer_myAccount')}</span>
                </Link>

                <Link
                  to="/settings-customer"
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 transition ${
                    isActive('/settings-customer')
                      ? 'bg-[#2E4166] text-[#DDD4BA]'
                      : 'text-[#2E4166] hover:bg-muted'
                  }`}
                >
                  <Settings className="w-5 h-5 shrink-0" />
                  <span className="text-base font-medium truncate">
                  {t('customer_setting_account')}
                  </span>
                </Link>
              </div>

              {/* ===== Profile completion ===== */}
              {/* <div className="mt-6 px-4">
                <div className="flex items-center mb-2">
                  <span className="text-[#2E4166] font-semibold">82%</span>
                </div>
                <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
                  <div className="h-2 rounded-full bg-[#D9C690]" style={{ width: '82%' }} />
                </div>
                <p className="text-xs text-[#2E4166]/70 mt-2 text-right">
                  {t('complete_account_Percentage')}
                </p>
              </div> */}

              {/* push footer to bottom */}
              <div className="mt-auto" />

              {/* ===== Logout (non-overlapping, bottom) ===== */}
              <div className="px-4 pt-6"   dir={`${isRTL ? 'ltr' : 'rtl'}`}>
                <div className="flex items-center justify-end cursor-pointer gap-3" onClick={handleLogout}>
                  <span className="text-[#2E4166] font-medium">{t('logout')}</span>
                  <button
                    className="w-12 h-12 rounded-full bg-[#2E4166] text-white flex items-center justify-center shadow-md hover:opacity-90 transition"
                    aria-label="تسجيل الخروج"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" x2="9" y1="12" y2="12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

        {/* Main Content - Full width on mobile, with sidebar offset on desktop */}
        <div className={`flex-1  ${isRTL ? 'md:mr-80' : 'md:ml-80'}  h-[calc(100vh-56px)] sm:h-[calc(100vh-64px)] overflow-y-auto bg-muted`}
          dir={`${isRTL ? 'rtl' : 'ltr'}`}
        >
          <div className="p-2 sm:p-fluid-4 lg:p-6">
            {/* Header Title */}
            {/* <div className="mb-fluid-lg sm:mb-fluid-xl">
              <h1 className="responsive-heading text-foreground mb-2">{title}</h1>
              <p className="text-muted-foreground text-fluid-sm sm:text-fluid-base">{subtitle}</p>
            </div> */}

            {/* Dashboard Content */}
            {children}
          </div>

          {/* Blue Footer - Appears under dashboard content */}
          <footer className="bg-[#2E4166] text-white mt-12">
            <div className="p-4 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">{t('customer_footer_contact')}</h3>
                  <div className="space-y-3" dir={`${isRTL ? "rtl" : "ltr"}`}>
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                      </svg>
                      <span className='text-sm sm:text-base'>info@grh.sa</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                      </svg>
                      <span className='text-sm sm:text-base'> {t('riyadhLocation')}</span>
                    </div>
                  </div>
                </div>

                {/* Important Links */}
                <div>
                  {/* <h3 className="text-lg font-semibold mb-4">{t('customer_footer_links')}</h3> */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      {/* <h4 className="font-medium mb-2">{t('customer_footer_contact')}</h4> */}
                      <h4 className="font-semibold text-lg mb-2">{t('customer_footer_links')}</h4>
                      <ul className="space-y-1 text-sm">
                          <li><a href="/" className="text-sm sm:text-base hover:text-gray-300 transition">{t('customer_footer_home')}</a></li>
                        <li><a href="/#about" className="text-sm sm:text-base hover:text-gray-300 transition">{t('customer_footer_about')}</a></li>
                      </ul>
                    </div>
                    <div>
                      
                      <ul className="space-y-1 text-sm ">
                        <li><a href="/contact" className="text-sm sm:text-base hover:text-gray-300 transition">{t('customer_footer_contact')}</a></li>
                        <li><a href="/#popular-questions" className="text-sm sm:text-base hover:text-gray-300 transition">{t('customer_footer_FAQ')}</a></li>
                        <li><a href="/#news" className="text-sm sm:text-base hover:text-gray-300 transition">{t('customer_footer_news')}</a></li>
                        {/* <li><a href="#" className="text-sm sm:text-base hover:text-gray-300 transition">{t('customer_footer_property_owners')}</a></li> */}
                        {/* <li><a href="#" className="text-sm sm:text-base hover:text-gray-300 transition">{t('customer_footer_companies')}</a></li> */}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Bar */}
              <div className="border-t border-[#3E5166] pt-6 mt-4">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <p className="text-sm text-gray-300 text-center">
                    {t('all_rights_reserved')}
                  </p>
                  <div className="flex gap-6 mt-4 md:mt-0">
                    <a href="#" className={` ${isRTL ? 'text-sm' : 'text-xs' } text-gray-300 hover:text-white transition `}>{t('privacy_policy')}</a>
                    <a href="#" className={` ${isRTL ? 'text-sm' : 'text-xs' } text-gray-300 hover:text-white transition `}>{t('terms_and_conditions')}</a>
                    <a href="#" className={` ${isRTL ? 'text-sm' : 'text-xs' } text-gray-300 hover:text-white transition `}>{t('support')}</a>
                  </div>
                </div>
              </div>
            </div>
          </footer>

          
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboardLayoutNew;