import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useResidenceSearch } from '@/hooks/useResidenceSearch';
import { performLogout } from '@/utils/authErrorHandler';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import SearchResults from '@/components/SearchResults';
import { 
  Search, 
  Plus,
  Mail,
  Home,
  Calendar,
  LayoutDashboard,
  Settings,
  User,
  Bell,
  MessageSquare,
  Search as SearchIcon,
  X
} from 'lucide-react';
import MobileSidebar from '@/components/ui/mobile-sidebar';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { getLanguageByCode, languages } from '@/i18n/languages';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import NotificationsDropdown from '../NotificationsDropdown';
import NotificationsAlert from '../NotificationsAlert';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  title, 
  subtitle
}) => {
  // const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const { searchResults, loading, error, searchResidences, clearSearch } = useResidenceSearch();
  // _________________________________________________________________________________
  const { i18n , t } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
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
    if (path === '/dashboard') {
      return currentPath === '/dashboard' || 
             currentPath === '/dashboard-test' ||
             currentPath === '/';
    }
    
    // For other routes, check exact match or if it starts with the path
    return currentPath === path || currentPath.startsWith(path + '/');
  };

  return (
    <div className="min-h-screen bg-muted" dir='rtl'>
      {/* Top Header - Fixed at top */}
      <nav className="bg-white  sticky top-0 z-50 shadow-none h-[70px]" >
        <div className="flex items-center w-full">

          {/* Mobile Menu */}
          <MobileSidebar className="lg:hidden" />
          
          {/* Actions - At the very end (far left) on desktop */}
          <div className={`flex items-center gap-2 sm:gap-3 absolute top-3 ${isRTL ? 'left-10 md:left-4'  : 'right-12 ; md:right-4 ; flex-row-reverse ' }`} >
            

            {/* HandlecLanguage Change   */}
             <div className="sm:w-[90px]">
              <Select value={currentLanguage.code} onValueChange={handleLanguageChange} >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      <div className="flex items-center sm:gap-2">
                        <span>{lang.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Add Residence Button */}
            <Button 
              className="text-[#DDD4BA] text-base px-[6px] sm:px-5 h-8 sm:h-11"
              onClick={() => navigate('/add-residence')}
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">{t('add_property')}</span>
            </Button>

            {/* Notifications */}
            <NotificationsDropdown notificationsPageLink="/notifications"/>
            
            <Avatar className="w-8 h-8 sm:w-10 sm:h-10 hidden sm:block">
              <AvatarImage src="/placeholder.svg" alt="المستخدم" />
              <AvatarFallback>أح</AvatarFallback>
            </Avatar>
          </div>
          
          {/* Logo - Far right on desktop, mobile position unchanged */}
          <div className={`flex items-center gap-3 absolute  ${isRTL ? 'right-4' : 'left-4' } top-4 md:top-1`}>
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <img 
                src="/lovable-uploads/ca283cc3-3f3f-4fc0-ac7e-66bca15bd058.png" 
                alt={t('meta.title')}
                loading="lazy"
                className={`h-8 sm:h-10 lg:h-12 w-auto cursor-pointer
                  duration-300
                  hover:scale-[1.7]
                hover:bg-[#ffffff]
                  hover:mt-4
                  hover:ml-12
                  ${ isRTL ? 'hover:mr-12' : 'hover:ml-12' }
                `}
              />
            </Link>
          </div>

          {/* Search Field - Positioned after sidebar space on desktop */}
          <div className="hidden flex-1 lg:mr-80 max-w-md ">
            <div className="relative w-full" ref={searchRef}>
              <Input 
                placeholder="ابحث عن العقارات..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pr-12 bg-gray-50 border-0 rounded-lg h-10 text-right text-sm"
                dir="rtl"
                onFocus={() => searchQuery.trim() && setShowSearchResults(true)}
              />
              {searchQuery ? (
                <button
                  onClick={handleClearSearch}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : (
                <Button size="icon" variant="ghost" className="absolute left-2 top-1/2 -translate-y-1/2 touch-target">
                  <Search className="w-4 h-4 text-gray-500" />
                </Button>
              )}
              
              {/* Search Results */}
              {showSearchResults && (
                <SearchResults
                  results={searchResults}
                  loading={loading}
                  error={error}
                  onResultClick={() => setShowSearchResults(false)}
                />
              )}
            </div>
          </div>
          
        </div>
      </nav>

      {/* <NotificationsAlert link={"/notifications"}/> */}

      <div className="flex min-h-[calc(100vh-56px)] sm:min-h-[calc(100vh-64px)]">

        {/* Right Sidebar - Fixed on desktop, hidden on mobile */}
        <div
          className={`hidden md:flex w-80 bg-white flex-col fixed ${isRTL ? 'right-0' : 'left-0'} top-14 sm:top-16 h-[calc(100vh-56px)] sm:h-[calc(100vh-64px)] z-40`}
          dir={`${isRTL ? 'rtl' : 'ltr'}`}
        >
          {/* scrollable body */}
          <div className="flex grow flex-col overflow-y-auto pt-8 pb-6">


            {/* ===== Main nav ===== */}
            <nav className="flex flex-col gap-2 px-4 mt-2">
              {/* لوحة التحكم */}
              <Link
                to="/dashboard"
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 transition ${
                  isActive('/dashboard')
                    ? 'bg-[#2E4166] text-[#DDD4BA]'
                    : 'text-[#2E4166] hover:bg-muted'
                }`}
              >
                <LayoutDashboard className="w-5 h-5 shrink-0" />
                <span className="text-base font-medium truncate">{t('customer_sidebar_dashboard')}</span>
              </Link>

            </nav>

            {/* divider */}
            <div className="my-5 border-b border-border" />


            {/* ===== إدارة قائمة العقارات (header aligned with items) ===== */}
            <p className="text-sm font-semibold text-[#2E4166]/70 px-4 pr-[32px] mb-2">
             {t('customer_manage_property')}
            </p>

            <div className="flex flex-col gap-2 px-4">
              <Link
                to="/properties"
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 transition ${
                  isActive('/properties')
                    ? 'bg-[#2E4166] text-[#DDD4BA]'
                    : 'text-[#2E4166] hover:bg-muted'
                }`}
              >
                <Home className="w-5 h-5 shrink-0" />
                <span className="text-base font-medium truncate">{t('properties')}</span>
              </Link>

              <Link
                to="/add-residence"
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 transition ${
                  isActive('/add-residence')
                    ? 'bg-[#2E4166] text-[#DDD4BA]'
                    : 'text-[#2E4166] hover:bg-muted'
                }`}
              >
                <Plus className="w-5 h-5 shrink-0" />
                <span className="text-base font-medium truncate">{t('add_new_property')}</span>
              </Link>

              <Link
                to="/bookings"
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 transition ${
                  isActive('/bookings')
                    ? 'bg-[#2E4166] text-[#DDD4BA]'
                    : 'text-[#2E4166] hover:bg-muted'
                }`}
              >
                <Calendar className="w-5 h-5 shrink-0" />
                <span className="text-base font-medium truncate">{t('bookings')}</span>
              </Link>
            </div>

            {/* divider */}
            <div className="my-5 border-b border-border" />

            {/* ===== إدارة الحساب (header aligned with items) ===== */}
            <p className="text-sm font-semibold text-[#2E4166]/70 px-4 pr-[32px] mb-2">
               {t('customer_manage_account')}
            </p>

            <div className="flex flex-col gap-2 px-4">
              <Link
                to="/profile"
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 transition ${
                  isActive('/profile')
                    ? 'bg-[#2E4166] text-[#DDD4BA]'
                    : 'text-[#2E4166] hover:bg-muted'
                }`}
              >
                <User className="w-5 h-5 shrink-0" />
                <span className="text-base font-medium truncate">{t('customer_myAccount')}</span>
              </Link>

              <Link
                to="/settings"
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 transition ${
                  isActive('/settings')
                    ? 'bg-[#2E4166] text-[#DDD4BA]'
                    : 'text-[#2E4166] hover:bg-muted'
                }`}
              >
                <Settings className="w-5 h-5 shrink-0" />
                <span className="text-base font-medium truncate">{t('customer_setting_account')}</span>
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
              <p className="text-xs text-[#2E4166]/70 mt-2 text-right">{t('complete_account_Percentage')}</p>
            </div> */}

            {/* push footer to bottom */}
            <div className="mt-auto" />

            {/* ===== Logout (non-overlapping, bottom) ===== */}
            <div className="px-4 pt-6">
              <div className="flex items-center cursor-pointer  gap-3" onClick={handleLogout}>
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
                <span className="text-[#2E4166] font-medium">{t('logout')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - Full width on mobile, with sidebar offset on desktop */}
        <div className={`flex-1 ${isRTL ? 'md:mr-80' : 'md:ml-80'} h-[calc(100vh-56px)] sm:h-[calc(100vh-64px)] overflow-y-auto bg-muted`}
          dir={`${isRTL ? 'rtl' : 'ltr'}`}
        >
          <div className="p-2 sm:p-fluid-4 lg:p-6">
            {/* Header Title */}
            <div className="mb-6 bg-white rounded-md shadow-md p-4">
              <h1 className="text-xl sm:text-2xl font-bold mb-2">{title}</h1>
              <p className=" text-[#516180] text-sm sm:text-base font-[400]">{subtitle}</p>
            </div>

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
                      <h4 className="font-medium mb-2">{t('customer_footer_contact')}</h4>
                      <ul className="space-y-1 text-sm">
                        <li><a href="/contact" className="text-sm sm:text-base hover:text-gray-300 transition">{t('customer_footer_contact')}</a></li>
                        <li><a href="/#popular-questions" className="text-sm sm:text-base hover:text-gray-300 transition">{t('customer_footer_FAQ')}</a></li>
                        <li><a href="/#news" className="text-sm sm:text-base hover:text-gray-300 transition">{t('customer_footer_news')}</a></li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">{t('customer_footer_links')}</h4>
                      <ul className="space-y-1 text-sm">
                        <li><a href="/" className="text-sm sm:text-base hover:text-gray-300 transition">{t('customer_footer_home')}</a></li>
                        <li><a href="/#about" className="text-sm sm:text-base hover:text-gray-300 transition">{t('customer_footer_about')}</a></li>
                        <li><a href="#" className="text-sm sm:text-base hover:text-gray-300 transition">{t('customer_footer_property_owners')}</a></li>
                        <li><a href="#" className="text-sm sm:text-base hover:text-gray-300 transition">{t('customer_footer_companies')}</a></li>
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
                  <div className="flex gap-4 sm:gap-6 mt-4 md:mt-0">
                    <a href="#" className={` ${isRTL ? 'text-sm' : 'text-xs' }  text-gray-300 hover:text-white transition `}>{t('privacy_policy')}</a>
                    <a href="#"className={` ${isRTL ? 'text-sm' : 'text-xs' } text-gray-300 hover:text-white transition `}>{t('terms_and_conditions')}</a>
                    <a href="#"className={` ${isRTL ? 'text-sm' : 'text-xs' }  text-gray-300 hover:text-white transition `}>{t('support')}</a>
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

export default DashboardLayout;